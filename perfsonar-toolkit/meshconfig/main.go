package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"

	"github.com/spf13/viper"
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
	Description string
}

type MeshConfig struct {
	Organizations map[string]Organization
	BWIPs         []string
	TraceIPs      []string
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("templates/meshconfig.tmpl")
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		perfsonarURL := "Not found"
		perfsonarService, err := clientset.Services("perfsonar").Get("perfsonar-toolkit", metav1.GetOptions{})
		if err != nil {
			log.Printf("Error getting Perfsonar service: %s", err.Error())
		} else {
			for _, port := range perfsonarService.Spec.Ports {
				if port.NodePort > 30000 {
					perfsonarURL = fmt.Sprintf("https://%s:%d/esmond/perfsonar/archive", viper.GetString("cluster_url"), port.NodePort)
				}
			}
		}

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

		pods, err := clientset.Pods("perfsonar").List(metav1.ListOptions{LabelSelector: "k8s-app=testpoint"})
		if err != nil {
			log.Printf("Error getting testpoint pods: %s", err.Error())
		} else {
			for _, pod := range pods.Items {
				for orgID, org := range conf.Organizations {
					for _, orgDomain := range org.Domain {
						if strings.HasSuffix(pod.Spec.NodeName, orgDomain) {
							org.Site.Host = append(org.Site.Host, Host{IP: []string{pod.Status.PodIP}, Description: pod.Spec.NodeName})
							conf.Organizations[orgID] = org // because map[..] is not addressable - can't assign..
							conf.BWIPs = append(conf.BWIPs, pod.Status.PodIP)
						}
					}
				}
			}
		}

		pods, err = clientset.Pods("perfsonar").List(metav1.ListOptions{LabelSelector: "k8s-app=htestpoint"})
		if err != nil {
			log.Printf("Error getting htestpoint pods: %s", err.Error())
		} else {
			for _, pod := range pods.Items {
				for orgID, org := range conf.Organizations {
					for _, orgDomain := range org.Domain {
						if strings.HasSuffix(pod.Spec.NodeName, orgDomain) {

							found := false
							for hind, host := range org.Site.Host {
								if host.Description == pod.Spec.NodeName {
									org.Site.Host[hind].IP = append(org.Site.Host[hind].IP, pod.Status.PodIP)
									found = true
									conf.Organizations[orgID] = org // because map[..] is not addressable - can't assign..
								}
							}

							if !found {
								org.Site.Host = append(org.Site.Host, Host{IP: []string{pod.Status.PodIP}, Description: pod.Spec.NodeName})
								conf.Organizations[orgID] = org // because map[..] is not addressable - can't assign..
							}

							conf.TraceIPs = append(conf.TraceIPs, pod.Status.PodIP)
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
