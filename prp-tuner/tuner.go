package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"
	"github.com/spf13/viper"

	"github.com/vishvananda/netlink"
)

type NodeConfig struct {
	FQ string `json:"fq"`
}

func main() {
	viper.SetConfigName("config")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s", err))
	}

	ticker := time.NewTicker(10 * time.Minute)
	go func() {
		adjustAll()
		for {
			select {
			case <-ticker.C:
				adjustAll()
			}
		}
	}()

	http.HandleFunc("/", RootHandler)
	log.Fatal(http.ListenAndServe(":10015", nil))
}

func adjustAll() {
	if err := adjustFQMaxRate(); err != nil {
		log.Printf("Error adjusting FQ: %s", err.Error())
	}
	if err := adjustSysctlSettings(); err != nil {
		log.Printf("Error adjusting sysctl: %s", err.Error())
	}
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	conf := &NodeConfig{}

	b, err := json.Marshal(conf)
	if err != nil {
		fmt.Println(err)
		return
	}
	w.Write(b)
}

func getDefaultInterface() (netlink.Link, error) {
	dstIP := net.IPv4(8, 8, 8, 8)
	routeToDstIP, _ := netlink.RouteGet(dstIP)
	link, _ := netlink.LinkByIndex(routeToDstIP[0].LinkIndex)
	return link, nil
}

func getInterfaceSpeed(interf string) (uint32, error) {
	if b, err := ioutil.ReadFile(fmt.Sprintf("/sys/class/net/%s/speed", interf)); err != nil {
		return 0, err
	} else {
		speedStr := fmt.Sprintf("%s", b)
		speedStr = strings.TrimRight(speedStr, "\r\n")
		if i, err := strconv.ParseUint(speedStr, 10, 32); err != nil {
			return 0, err
		} else {
			return uint32(i), nil
		}
	}
}

func adjustSysctlSettings() error {
	for key, val := range viper.Get("sysctl").(map[string]interface{}) {
		path := fmt.Sprintf("/proc/sys/%s", strings.Replace(key, ".", "/", -1))
		if b, err := ioutil.ReadFile(path); err != nil {
			return err
		} else {
			fileValue := strings.TrimRight(fmt.Sprintf("%s", b), "\r\n")
			if fileValue != val.(string) {
				fmt.Printf("Adjusting sysctl value %s from %s to %s\n", key, fileValue, val.(string))
				if err := ioutil.WriteFile(path, []byte(val.(string)), 0644); err != nil {
					return err
				}
			}
		}
	}
	return nil
}