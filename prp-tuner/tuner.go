package main

//https://github.com/golang/go/issues/22688

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/vishvananda/netlink"
)

type NodeConfig struct {
	FQ string `json:"fq"`
}

func main() {
	http.HandleFunc("/", RootHandler)
	log.Fatal(http.ListenAndServe(":10015", nil))
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	conf := &NodeConfig{}

	if fq, err := getFQ(); err == nil {
		conf.FQ = fq
	}

	b, err := json.Marshal(conf)
	if err != nil {
		fmt.Println(err)
		return
	}
	w.Write(b)
}

func getFQ() (string, error) {
	link, _ := getDefaultInterface()
	qdiscs, err := netlink.QdiscList(link)
	if err != nil {
		return "", err
	}

	fq, ok := qdiscs[0].(*netlink.Fq)
	if !ok {
		return "", nil
	}

	return fmt.Sprintf("%.2fgbit", float64(fq.FlowMaxRate)*8.0/1000000000.0), nil
}

func getDefaultInterface() (netlink.Link, error) {
	dstIP := net.IPv4(8, 8, 8, 8)
	routeToDstIP, _ := netlink.RouteGet(dstIP)
	link, _ := netlink.LinkByIndex(routeToDstIP[0].LinkIndex)
	return link, nil
}

var netconf string = `default_iface=$(awk '$2 == 00000000 { print $1 }' /proc/net/route)
/usr/sbin/ethtool -C $default_iface adaptive-rx off
/sbin/ifconfig $default_iface txqueuelen 10000
/usr/sbin/tc qdisc add dev $default_iface root fq maxrate 2.5gbit
`

var netservice string = `[Unit]
After=network.target

[Service]
ExecStart=/opt/prp/netconf.sh

[Install]
WantedBy=default.target
`

var sysconf string = `net.core.default_qdisc = fq
net.core.rmem_max=536870912
net.core.wmem_max=536870912
net.ipv4.tcp_rmem=4096 87380 268435456
net.ipv4.tcp_wmem=4096 65536 268435456
net.core.netdev_max_backlog=250000
net.ipv4.tcp_congestion_control=htcp
net.ipv4.tcp_mtu_probing=1
net.ipv4.tcp_no_metrics_save = 1
net.ipv4.tcp_timestamps = 1
net.ipv4.tcp_sack = 1
net.ipv4.tcp_low_latency = 0
`
