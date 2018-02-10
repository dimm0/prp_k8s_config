package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"

	"github.com/spf13/viper"
	"k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

var clientset *kubernetes.Clientset

type Organization struct {
	Site         Site
	Domain       []string
	PerfsonarURL string
	Description  string
}

type Site struct {
	Lat   float64
	Lon   float64
	City  string
	State string
	Host  []Host
}

type Host struct {
	IP          []string
	IPh         []string
	Description string
}

type MeshConfig struct {
	Organizations map[string]Organization
	BW10GIPs      []string
	BW40GIPs      []string
	TraceIPs      []string
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("templates/meshconfig.tmpl")
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		perfsonarURL := fmt.Sprintf("https://perfsonar.%s/esmond/perfsonar/archive/", viper.GetString("cluster_url"))

		conf := MeshConfig{Organizations: map[string]Organization{}}
		for orgID, _ := range viper.Get("org").(map[string]interface{}) {
			org := Organization{
				PerfsonarURL: perfsonarURL,
				Description:  viper.GetString(fmt.Sprintf("org.%s.description", orgID)),
				Domain:       viper.GetStringSlice(fmt.Sprintf("org.%s.domain", orgID)),
				Site: Site{
					Lat:   viper.GetFloat64(fmt.Sprintf("org.%s.lat", orgID)),
					Lon:   viper.GetFloat64(fmt.Sprintf("org.%s.lon", orgID)),
					City:  viper.GetString(fmt.Sprintf("org.%s.city", orgID)),
					State: viper.GetString(fmt.Sprintf("org.%s.state", orgID)),
				},
			}
			conf.Organizations[orgID] = org
		}

		if nodes, err := clientset.Core().Nodes().List(metav1.ListOptions{}); err != nil {
			log.Printf("Error getting testpoint nodes: %s", err.Error())
		} else {
			pods, err := clientset.Core().Pods("perfsonar").List(metav1.ListOptions{LabelSelector: "k8s-app=testpoint"})
			if err != nil {
				log.Printf("Error getting testpoint pods: %s", err.Error())
			} else {
				for _, pod := range pods.Items {
					if pod.Status.Phase != v1.PodRunning || pod.Status.PodIP == "" {
						continue
					}
					for orgID, org := range conf.Organizations {
						for _, orgDomain := range org.Domain {
							if strings.HasSuffix(pod.Spec.NodeName, orgDomain) {
								org.Site.Host = append(org.Site.Host, Host{IP: []string{pod.Status.PodIP}, Description: pod.Spec.NodeName})
								conf.Organizations[orgID] = org // because map[..] is not addressable - can't assign..
								for _, node := range nodes.Items {
									for _, addr := range node.Status.Addresses {
										if addr.Type == v1.NodeInternalIP && addr.Address == pod.Status.HostIP {
											switch node.Labels["nw"] {
											case "10G":
												conf.BW10GIPs = append(conf.BW10GIPs, pod.Status.PodIP)
											case "40G":
												conf.BW40GIPs = append(conf.BW40GIPs, pod.Status.PodIP)
											}
										}
									}
								}
							}
						}
					}
				}
			}

			pods, err = clientset.Core().Pods("perfsonar").List(metav1.ListOptions{LabelSelector: "k8s-app=testpoint-h"})
			if err != nil {
				log.Printf("Error getting htestpoint pods: %s", err.Error())
			} else {
				for _, pod := range pods.Items {
					if pod.Status.Phase != v1.PodRunning || pod.Status.PodIP == "" {
						continue
					}
					for orgID, org := range conf.Organizations {
						for _, orgDomain := range org.Domain {
							if strings.HasSuffix(pod.Spec.NodeName, orgDomain) {

								found := false
								for hind, host := range org.Site.Host {
									if host.Description == pod.Spec.NodeName {
										org.Site.Host[hind].IPh = append(org.Site.Host[hind].IPh, pod.Status.PodIP)
										found = true
										conf.Organizations[orgID] = org // because map[..] is not addressable - can't assign..
									}
								}

								if !found {
									org.Site.Host = append(org.Site.Host, Host{IPh: []string{pod.Status.PodIP}, Description: pod.Spec.NodeName})
									conf.Organizations[orgID] = org // because map[..] is not addressable - can't assign..
								}

								conf.TraceIPs = append(conf.TraceIPs, pod.Status.PodIP)
							}
						}
					}
				}
			}
		}

		err = t.Execute(w, conf)
		if err != nil {
			w.Write([]byte(err.Error()))
		}
	}
}

func main() {
	viper.SetConfigName("config")
	viper.AddConfigPath("config")

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s", err))
	}

	k8sconfig, err := rest.InClusterConfig()
	if err != nil {
		log.Fatal("Failed to do inclusterconfig: " + err.Error())
		return
	}

	clientset, err = kubernetes.NewForConfig(k8sconfig)
	if err != nil {
		log.Fatal("Failed to do inclusterconfig new client: " + err.Error())
	}
	clientset.Apps()

	http.HandleFunc("/", IndexHandler)
	log.Fatal(http.ListenAndServe(":80", nil))
}
