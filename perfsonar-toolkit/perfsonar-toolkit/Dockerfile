FROM centos:latest

MAINTAINER John Graham <jjgraham@ucsd.edu>, Dmitry Mishin <dmishin@sdsc.edu>
LABEL Vendor="UCSD" \
      License=GPLv2 \
      Version=1.0

ADD *.patch /tmp/

RUN yum -y --setopt=tsflags=nodocs update && \
    yum -y --setopt=tsflags=nodocs install epel-release httpd && \
    yum -y --setopt=tsflags=nodocs install http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm && \
    yum -y --setopt=tsflags=nodocs clean all && \
    yum -y --setopt=tsflags=nodocs install perfsonar-toolkit perfsonar-toolkit-ntp net-tools sysstat tcpdump htop traceroute nmap mlocate && \
    yum -y --setopt=tsflags=nodocs install jq perl netpbm netpbm-progs perl-Log-Log4perl ImageMagick wget git mercurial vim patch && \
    yum clean all && \
    patch -i /tmp/esmond.conf.patch /etc/esmond/esmond.conf && \
    cd /usr/lib/esmond && \
    easy_install pip && \
    pip install -r requirements.txt --exists-action=s

RUN mkdir -p /var/log/pods

ADD startfoo.sh /startfoo.sh
RUN chmod -v +x /startfoo.sh

# The following ports are used:
# bwctl:4823, 5001-5900, 6001-6200
# owamp:861, 8760-9960
