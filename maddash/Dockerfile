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
    yum -y --setopt=tsflags=nodocs install ntp && \
    yum -y --setopt=tsflags=nodocs install git wget nmap htop mlocate net-tools sysstat tcpdump # grab a few other favorite tools && \
    yum -y --setopt=tsflags=nodocs install httpd java-1.8.0-openjdk && \
    yum -y --setopt=tsflags=nodocs install maven && \
    yum -y --setopt=tsflags=nodocs install initscripts && \
    yum -y --setopt=tsflags=nodocs install nagios-plugins-perfsonar && \
    git clone --recursive https://github.com/esnet/maddash.git /usr/lib/maddash && \
    cd /usr/lib/maddash && mvn clean install && \
    ntpdate -s pool.ntp.org && \
    chkconfig ntpdate on && \
    chkconfig ntpd on && \
    chkconfig httpd on && \
    yum clean all

