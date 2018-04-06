package main

//https://github.com/golang/go/issues/22688

import (
	"net"

	"github.com/vishvananda/netlink"
)

func main() {
	link, _ := getDefaultInterface()

}

func getDefaultInterface() (Link, error) {
	dstIP := net.IPv4(8, 8, 8, 8)
	routeToDstIP, _ := netlink.RouteGet(dstIP)
	link, _ := netlink.LinkByIndex(routeToDstIP[0].LinkIndex)
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
