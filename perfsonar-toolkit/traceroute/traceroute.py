import networkx as nx
from networkx import set_node_attributes
import json
import re
import itertools
import socket
import requests

from networkx.readwrite.json_graph import node_link_data

meshconfigreq = requests.get('https://perfsonar.k8s.optiputer.net/k8s.json', verify=False)
meshconfig = meshconfigreq.json()

hosts = {}

i = 0

for org in meshconfig["organizations"]:
    for site in org["sites"]:
        for host in site["hosts"]:
            if not host["description"] in hosts:
                hosts[host["description"]] = {"addr": [host["addresses"][0]], "lat": float(site["location"]["latitude"]), "lon": float(site["location"]["longitude"]), "id": i}
                i += 1
            else:
                hosts[host["description"]]["addr"].append(host["addresses"][0])


g_cen = nx.MultiDiGraph()
g_cen.add_nodes_from(list(hosts.keys()), type="primary")

base_url = "https://perfsonar.k8s.optiputer.net" #"https://ps-dashboard.cenic.net"

def get_lat(hostname):
    if(hostname in hosts):
        return hosts[hostname]["lat"]
    return None

def get_lon(hostname):
    if(hostname in hosts):
        return hosts[hostname]["lon"]
    return None


def get_cen_group(hostname):
    if(hostname in hosts):
        return "g%d"%hosts[hostname]["id"]
    return None

set_node_attributes(g_cen, name="source_group", values={host:[get_cen_group(host)] for host in hosts})
set_node_attributes(g_cen, name="target_group", values={host:[] for host in hosts})
set_node_attributes(g_cen, name="lat", values={host:[get_lat(host)] for host in hosts})
set_node_attributes(g_cen, name="lon", values={host:[get_lon(host)] for host in hosts})

def get_cen_link_stats(source, target):
    result = [-1, -1, None]
    result_fields = {'throughput':0, 'packet-retransmits':1}

    try:
        r = requests.get("%s/esmond/perfsonar/archive/?format=json&source=%s&destination=%s&event-type=throughput"%(base_url, hosts[source]["addr"][0], hosts[target]["addr"][0]), verify=False).json()
        data_path_first_record = r[0]

        for event in data_path_first_record['event-types']:
            if(not event['time-updated']):
                continue
            data_path_uri = event['base-uri']
            if(event['event-type'] in result_fields):
#                 print "%s%s?format=json&time-interval=21600"%(base_url,data_path_uri)
                r1 = requests.get("%s%s?format=json&time-interval=21600"%(base_url,data_path_uri), verify=False).json()
                result[result_fields[event['event-type']]] = r1.pop()['val']
    except Exception, ex:
        print "Error getting throughput value for %s %s %s"%(source, target, ex)


    try:
        r = requests.get("%s/esmond/perfsonar/archive/?format=json&source=%s&destination=%s&event-type=packet-trace"%(base_url, hosts[source]["addr"][1], hosts[target]["addr"][1]), verify=False).json()
        data_path_tracert_record = r[0]
        for event in data_path_tracert_record['event-types']:
            if(not event['time-updated']):
                continue
            data_path_uri = event['base-uri']
            if(event['event-type'] == "packet-trace"):
#                 print "%s%s?format=json&time-interval=21600"%(base_url,data_path_uri)
                r1 = requests.get("%s%s?format=json&time-interval=21600"%(base_url,data_path_uri), verify=False).json()
                result[2] = r1.pop()['val']
    except Exception, ex:
        print "Error getting trace value for %s %s %s"%(source, target, ex)

    return result

def is_same_host(host1, host2):
    try:
        return IP(socket.gethostbyname(host1.replace('(', '').replace(')', ''))) == IP(socket.gethostbyname(host2.replace('(', '').replace(')', '')))
    except:
        print("Error resolving %s %s"%(host1, host2))
        return False # can't resolve

def ip_to_host(ip):
    try:
        return socket.gethostbyaddr(ip)[0]
    except:
        return ip

def gen_key(host_pair):
    return "%s %s"%(host_pair[0], host_pair[1])

def add_new_edge(source, target, sgroup, tgroup, flap_route, throughput, latency, retransmits):
#     print "Adding edge!!!"
    if(latency < 0):
        latency = -1
    if(source == target):
        return
    if(not g_cen.has_edge(source, target)):
        g_cen.add_edge(source, target, source_group=[sgroup], target_group=[tgroup], flap_route=flap_route, throughput=throughput, latency=latency, retransmits=retransmits)
    else:
        if(sgroup not in g_cen[source][target][0]["source_group"]):
            g_cen[source][target][0]["source_group"].append(sgroup)
        if(tgroup not in g_cen[source][target][0]["target_group"]):
            g_cen[source][target][0]["target_group"].append(tgroup)
        if(g_cen[source][target][0]["throughput"] < throughput):
            g_cen[source][target][0]["throughput"] = throughput
        if(g_cen[source][target][0]["retransmits"] == -1 or (g_cen[source][target][0]["retransmits"] > retransmits and retransmits != -1)):
            g_cen[source][target][0]["retransmits"] = retransmits

        g_cen[source][target][0]["latency"] = min(latency, g_cen[source][target][0]["latency"])
    return 0

def add_new_node(node, sgroup, tgroup):
    if(node not in g_cen):
#         print "Add node %s"%node
        g_cen.add_node(node, type="", source_group=[sgroup], target_group=[tgroup])
    else:
        if(sgroup not in g_cen.node[node]["source_group"]):
            g_cen.node[node]["source_group"].append(sgroup)
        if(tgroup not in g_cen.node[node]["target_group"]):
            g_cen.node[node]["target_group"].append(tgroup)

for pair in [pair for pair in itertools.permutations(hosts, 2)]:
    sgroup = get_cen_group(pair[0])
    tgroup = get_cen_group(pair[1])
    key = gen_key(pair)

    [throughput_value, retransmits_value, traceroute] = get_cen_link_stats(pair[0], pair[1])

    latency = 0 # to store previous value
    last_nodes = {pair[0]:[0]} # to store previous values

    cur_query = 1
    if(not traceroute):
        continue

    cur_values = {}
    cur_ttl = 0

    done = False

    for trace_step in traceroute:
        if(trace_step["success"] != 1):
            continue


        if(trace_step["ttl"] == cur_ttl+1): # next value. finish the prev ones.
            cur_ttl += 1

            flap_route = len(cur_values) > 1

            cur_smallest_latency = 0 # the smallest average latency of this line to keep for next line
            # here we add edges: every last node to every current node
            # I take the min of last latencies to calculate the current one
            for host, latencies in cur_values.iteritems():
                if(is_same_host(pair[1], host)): # sometimes traceroute gives it as an IP
                    host = pair[1]
                    done = True
                add_new_node(host, sgroup, tgroup)

                cur_latency = sum(latencies)/len(latencies)
                if(not cur_smallest_latency):
                    cur_smallest_latency = cur_latency
                else:
                    cur_smallest_latency = min(cur_latency, cur_smallest_latency)

                for last_node, last_lat_unused in last_nodes.iteritems():
                    add_new_edge(last_node, host, sgroup, tgroup, flap_route, throughput_value, cur_latency - latency, retransmits_value)

            if(cur_values):
                last_nodes = cur_values
                latency = cur_smallest_latency
            cur_values = {}


        if(not trace_step.get("ip")):
            print("%s - %s doesn't have an ip in ttl %s"%(pair[0],pair[1],trace_step["ttl"]))
            continue

        cur_host = ip_to_host(trace_step["ip"])
        if(not cur_host in cur_values):
            cur_values[cur_host] = []
        cur_values[cur_host].append(float(trace_step["rtt"]))

    if(pair[0] in last_nodes):
        print("Error building path from %s to %s: no nodes found"%(pair[0], pair[1]))
    elif(not done): # not ended with the destination
        for last_node, last_lat_unused in last_nodes.iteritems():
            add_new_edge(last_node, pair[1], sgroup, tgroup, False, throughput_value, cur_latency - latency, retransmits_value)
        #print "Not finished %s-%s with %s, finished with %s"%(pair[0], pair[1], pair[1], last_nodes)

f1=open('/web/graph.json', 'w+')
f1.write(json.dumps(node_link_data(g_cen)))
f1.close()
