# perfsonar-toolkit

FROM centos:centos7
MAINTAINER John Graham <jjgraham@ucsd.edu>

RUN yum -y install epel-release && yum clean all && yum -y install systemd && rpm -hUv http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm && yum -y update && yum -y install perfsonar-toolkit perfsonar-toolkit-ntp net-tools sysstat tcpdump htop traceroute nmap mlocate

# The following ports are used:
# bwctl:4823, 5001-5900, 6001-6200
# owamp:861, 8760-9960
