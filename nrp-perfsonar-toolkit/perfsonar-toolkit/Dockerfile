FROM centos:latest

MAINTAINER John Graham <jjgraham@ucsd.edu>, Dmitry Mishin <dmishin@sdsc.edu>
LABEL Vendor="UCSD" \
      License=GPLv2 \
      Version=1.0


ADD *.patch /tmp/
ADD postgresql /opt/postgresql/

RUN yum -y --setopt=tsflags=nodocs update && \
    yum -y --setopt=tsflags=nodocs install epel-release httpd && \
    yum -y --setopt=tsflags=nodocs install http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/perfSONAR-repo-0.8-1.noarch.rpm && \
    yum -y --setopt=tsflags=nodocs clean all && \
    yum -y --setopt=tsflags=nodocs install perfsonar-centralmanagement perfsonar-toolkit-ntp postgresql-load net-tools sysstat tcpdump htop traceroute nmap mlocate && \
    yum -y --setopt=tsflags=nodocs install jq perl netpbm netpbm-progs perl-Log-Log4perl ImageMagick wget git mercurial vim patch random-string && \
    yum -y --setopt=tsflags=nodocs install supervisor rsyslog iproute bind-utils && \
    yum clean all && \
    patch -i /tmp/esmond.conf.patch /etc/esmond/esmond.conf && \
    cd /usr/lib/esmond && \
    easy_install pip && \
    pip install -r requirements.txt --exists-action=s


ENV PG_VERSION 9.5
ENV PGVERSION 95
ENV PGDATA /var/lib/pgsql/9.5/data

# -----------------------------------------------------------------------------

# Rsyslog
# Note: need to modify default CentOS7 rsyslog configuration to work with Docker,
# as described here: http://www.projectatomic.io/blog/2014/09/running-syslog-within-a-docker-container/
COPY rsyslog/rsyslog.conf /etc/rsyslog.conf
COPY rsyslog/listen.conf /etc/rsyslog.d/listen.conf
COPY rsyslog/python-pscheduler.conf /etc/rsyslog.d/python-pscheduler.conf
COPY rsyslog/owamp_bwctl-syslog.conf /etc/rsyslog.d/owamp_bwctl-syslog.conf


# -----------------------------------------------------------------------------

ADD maddash.yaml /etc/maddash/maddash-server/
ADD maddash_config.json /etc/maddash/maddash-webui/config.json

RUN sed -i 's/SSLCertificateFile \/etc\/pki\/tls\/certs\/localhost.crt/SSLCertificateFile \/etc\/pki\/tls\/mycert\/ssl.crt/' /etc/httpd/conf.d/ssl.conf && \
  sed -i 's/SSLCertificateKeyFile \/etc\/pki\/tls\/private\/localhost.key/SSLCertificateKeyFile \/etc\/pki\/tls\/mycert\/ssl.key/' /etc/httpd/conf.d/ssl.conf && \
  chown maddash:maddash /etc/maddash/maddash-server/maddash.yaml

RUN mkdir -p /var/log/supervisor
ADD supervisord.conf /etc/supervisord.conf
