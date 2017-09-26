FROM centos:latest

MAINTAINER John Graham <jjgraham@ucsd.edu>
MAINTAINER Dmitry Mishin <dmishin@ucsd.edu>
LABEL Vendor="UCSD" \
      License=GPLv2 \
      Version=1.0

RUN yum -y --setopt=tsflags=nodocs update && \
    yum -y --setopt=tsflags=nodocs install epel-release httpd && \
    yum -y --setopt=tsflags=nodocs install http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm && \
    yum -y --setopt=tsflags=nodocs clean all && \
    yum -y --setopt=tsflags=nodocs install ntp && \
    yum -y --setopt=tsflags=nodocs install git wget nmap htop mlocate net-tools sysstat tcpdump && \
    yum -y --setopt=tsflags=nodocs install maddash maddash-server maddash-webui
