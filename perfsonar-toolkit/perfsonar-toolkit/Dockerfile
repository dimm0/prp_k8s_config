FROM gateway.calit2.optiputer.net:5000/prp-k8s/c7-systemd:latest

MAINTAINER John Graham <jjgraham@ucsd.edu>
LABEL Vendor="UCSD" \
      License=GPLv2 \
      Version=1.0

RUN yum -y --setopt=tsflags=nodocs update && \
    yum -y --setopt=tsflags=nodocs install epel-release httpd && \
    yum -y --setopt=tsflags=nodocs install http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm && \
    yum -y --setopt=tsflags=nodocs install initscripts systemd && \
    yum -y --setopt=tsflags=nodocs clean all && \
    yum -y --setopt=tsflags=nodocs install perfsonar-toolkit perfsonar-toolkit-ntp net-tools sysstat tcpdump htop traceroute nmap mlocate && \
    yum -y --setopt=tsflags=nodocs install jq perl netpbm netpbm-progs perl-Log-Log4perl ImageMagick wget git && \
    yum clean all

EXPOSE 80 443 861 4328

RUN mkdir -p /var/log/pods

CMD ["/usr/sbin/init"]

ADD startfoo.sh /startfoo.sh
RUN chmod -v +x /startfoo.sh

# The following ports are used:
# bwctl:4823, 5001-5900, 6001-6200
# owamp:861, 8760-9960
