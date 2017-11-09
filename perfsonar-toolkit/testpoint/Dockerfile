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
    yum -y --setopt=tsflags=nodocs install git wget nmap htop mlocate net-tools sysstat tcpdump rsyslog && \
    yum -y --setopt=tsflags=nodocs install supervisor perfsonar-testpoint postgresql95 postgresql95-server

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
RUN su - postgres -c "/usr/pgsql-9.5/bin/pg_ctl init"

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
RUN  /tmp/pscheduler-build-database
RUN  rm -f /tmp/pscheduler-build-database


# -----------------------------------------------------------------------------

# Rsyslog
# Note: need to modify default CentOS7 rsyslog configuration to work with Docker,
# as described here: http://www.projectatomic.io/blog/2014/09/running-syslog-within-a-docker-container/
COPY rsyslog/rsyslog.conf /etc/rsyslog.conf
COPY rsyslog/listen.conf /etc/rsyslog.d/listen.conf
COPY rsyslog/python-pscheduler.conf /etc/rsyslog.d/python-pscheduler.conf
COPY rsyslog/owamp_bwctl-syslog.conf /etc/rsyslog.d/owamp_bwctl-syslog.conf

# -----------------------------------------------------------------------------

ADD conf/meshconfig-agent.conf /etc/perfsonar/
RUN chown perfsonar:perfsonar /etc/perfsonar/meshconfig*

RUN mkdir -p /var/log/supervisor
ADD supervisord.conf /etc/supervisord.conf

CMD /usr/bin/supervisord -c /etc/supervisord.conf
