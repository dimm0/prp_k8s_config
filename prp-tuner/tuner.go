package main

//https://github.com/golang/go/issues/22688

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"strconv"
	"strings"

	"github.com/vishvananda/netlink"
)

type NodeConfig struct {
	FQ string `json:"fq"`
}

func main() {
	// getFQMaxRate()
	// ticker := time.NewTicker(10 * time.Minute)
	// go func() {
	// 	adjustAll()
	// 	for {
	// 		select {
	// 		case <-ticker.C:
	// 			adjustAll()
	// 		}
	// 	}
	// }()

	// http.HandleFunc("/", RootHandler)
	// log.Fatal(http.ListenAndServe(":10015", nil))
	adjustAll()
}

func adjustAll() {
	if err := adjustFQMaxRate(); err != nil {
		log.Printf("Error adjusting FQ: %s", err.Error())
	}
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	conf := &NodeConfig{}

	if fq, err := getFQMaxRate(); err == nil {
		conf.FQ = fmt.Sprintf("%.2fgbit", float64(fq)*8.0/1000000000.0)
	}

	b, err := json.Marshal(conf)
	if err != nil {
		fmt.Println(err)
		return
	}
	w.Write(b)
}

func getFQMaxRate() (uint32, error) {
	link, _ := getDefaultInterface()
	qdiscs, err := netlink.QdiscList(link)
	if err != nil {
		return 0, err
	}

	fq, ok := qdiscs[0].(*netlink.Fq)
	if !ok {
		return 0, nil
	}

	// fmt.Printf("Flow: %v", fq.FlowMaxRate)

	return fq.FlowMaxRate, nil
}

func adjustFQMaxRate() error {
	link, _ := getDefaultInterface()
	if speed, err := getInterfaceSpeed(link.Attrs().Name); err != nil {
		return err
	} else {
		if speed >= 10000 {
			fqMaxRateDesired := uint32(speed / 16 / 8 * 1000000)
			if fqMaxRate, err := getFQMaxRate(); err != nil || fqMaxRate != fqMaxRateDesired {
				qdiscs, _ := netlink.QdiscList(link)
				for _, qdisk := range qdiscs {
					netlink.QdiscDel(qdisk)
				}

				qdisc := &netlink.Fq{
					QdiscAttrs: netlink.QdiscAttrs{
						LinkIndex: link.Attrs().Index,
						Handle:    netlink.MakeHandle(1, 0),
						Parent:    netlink.HANDLE_ROOT,
					},
					// Rate:   131072,
					// Limit:  1220703,
					// Buffer: 16793,
					FlowMaxRate: fqMaxRateDesired,
				}

				netlink.QdiscAdd(qdisc)
			}
		}
		return nil
	}
}

func getDefaultInterface() (netlink.Link, error) {
	dstIP := net.IPv4(8, 8, 8, 8)
	routeToDstIP, _ := netlink.RouteGet(dstIP)
	link, _ := netlink.LinkByIndex(routeToDstIP[0].LinkIndex)
	return link, nil
}

func getInterfaceSpeed(interf string) (int, error) {
	if b, err := ioutil.ReadFile(fmt.Sprintf("/sys/class/net/%s/speed", interf)); err != nil {
		return 0, err
	} else {
		speedStr := fmt.Sprintf("%s", b)
		speedStr = strings.TrimRight(speedStr, "\r\n")
		if i, err := strconv.Atoi(speedStr); err != nil {
			return 0, err
		} else {
			return i, nil
		}
	}
}
