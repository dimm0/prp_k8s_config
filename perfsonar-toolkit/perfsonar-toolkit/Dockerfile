FROM centos:latest

MAINTAINER John Graham <jjgraham@ucsd.edu>, Dmitry Mishin <dmishin@sdsc.edu>
LABEL Vendor="UCSD" \
      License=GPLv2 \
      Version=1.0


ADD *.patch /tmp/

RUN yum -y --setopt=tsflags=nodocs update && \
    yum -y --setopt=tsflags=nodocs install epel-release httpd && \
    yum -y --setopt=tsflags=nodocs install http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/perfSONAR-repo-0.8-1.noarch.rpm && \
    yum -y --setopt=tsflags=nodocs clean all && \
    yum -y --setopt=tsflags=nodocs install perfsonar-toolkit perfsonar-toolkit-ntp net-tools sysstat tcpdump htop traceroute nmap mlocate && \
    yum -y --setopt=tsflags=nodocs install maddash maddash-server maddash-webui perfsonar-meshconfig-guiagent perfsonar-meshconfig-agent && \
    yum -y --setopt=tsflags=nodocs install jq perl netpbm netpbm-progs perl-Log-Log4perl ImageMagick wget git mercurial vim patch && \
    yum -y --setopt=tsflags=nodocs install supervisor rsyslog iproute bind-utils && \
    yum clean all && \
    patch -i /tmp/esmond.conf.patch /etc/esmond/esmond.conf && \
    cd /usr/lib/esmond && \
    easy_install pip && \
    pip install -r requirements.txt --exists-action=s

# -----------------------------------------------------------------------

#
# PostgreSQL Server
#
# Based on a Dockerfile at
# https://raw.githubusercontent.com/zokeber/docker-postgresql/master/Dockerfile

# Postgresql version
ENV PG_VERSION 9.5
ENV PGVERSION 95

# Set the environment variables
ENV PGDATA /var/lib/pgsql/9.5/data

# Initialize the database
#RUN su - postgres -c "/usr/pgsql-9.5/bin/pg_ctl init"

# Overlay the configuration files
COPY postgresql/postgresql.conf /var/lib/pgsql/$PG_VERSION/data/postgresql.conf
COPY postgresql/pg_hba.conf /var/lib/pgsql/$PG_VERSION/data/pg_hba.conf

# Change own user
RUN chown -R postgres:postgres /var/lib/pgsql/$PG_VERSION/data/*

# End PostgreSQL Setup


# -----------------------------------------------------------------------------

#
# pScheduler Database
#
# Initialize pscheduler database.  This needs to happen as one command
# because each RUN happens in an interim container.

COPY postgresql/pscheduler-build-database /tmp/pscheduler-build-database
COPY postgresql/esmond-build-database /tmp/esmond-build-database
RUN  /tmp/pscheduler-build-database
RUN  rm -f /tmp/pscheduler-build-database
RUN  /tmp/esmond-build-database
RUN  rm -f /tmp/esmond-build-database


# -----------------------------------------------------------------------------

# Rsyslog
# Note: need to modify default CentOS7 rsyslog configuration to work with Docker,
# as described here: http://www.projectatomic.io/blog/2014/09/running-syslog-within-a-docker-container/
COPY rsyslog/rsyslog.conf /etc/rsyslog.conf
COPY rsyslog/listen.conf /etc/rsyslog.d/listen.conf
COPY rsyslog/python-pscheduler.conf /etc/rsyslog.d/python-pscheduler.conf
COPY rsyslog/owamp_bwctl-syslog.conf /etc/rsyslog.d/owamp_bwctl-syslog.conf


# -----------------------------------------------------------------------------

ADD meshconfig-agent.conf meshconfig-guiagent.conf /etc/perfsonar/
RUN chown perfsonar:perfsonar /etc/perfsonar/meshconfig*

ADD maddash.yaml /etc/maddash/maddash-server/
ADD maddash_config.json /etc/maddash/maddash-webui/config.json

RUN sed -i 's/SSLCertificateFile \/etc\/pki\/tls\/certs\/localhost.crt/SSLCertificateFile \/etc\/pki\/tls\/mycert\/ssl.crt/' /etc/httpd/conf.d/ssl.conf && \
  sed -i 's/SSLCertificateKeyFile \/etc\/pki\/tls\/private\/localhost.key/SSLCertificateKeyFile \/etc\/pki\/tls\/mycert\/ssl.key/' /etc/httpd/conf.d/ssl.conf && \
  chown maddash:maddash /etc/maddash/maddash-server/maddash.yaml

RUN mkdir -p /var/log/supervisor
ADD supervisord.conf /etc/supervisord.conf

ADD meshconfig /etc/cron.d/
