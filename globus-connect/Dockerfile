# Globus Connect/GridFTP container
# https://www.globus.org/globus-connect-server

# includes GridFTP and Globus Connect
# also includes some network test tools

FROM centos:centos7
MAINTAINER John Graham <jjgraham@ucsd.edu>

RUN yum -y update; yum clean all
RUN yum -y install traceroute lsb yum-utils net-tools 
RUN rpm -hUv http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm
RUN yum -y install epel-release
RUN yum -y update; yum clean all
RUN yum -y install mlocate
RUN yum -y install perfsonar-tools
RUN yum -y install nuttcp bwctl owamp iperf3
RUN rpm -hUv http://downloads.globus.org/toolkit/gt6/stable/installers/repo/rpm/globus-toolkit-repo-latest.noarch.rpm
RUN yum -y install globus-data-management-client globus-data-management-server globus-xio-udt-driver
RUN yum -y install globus-connect-server
RUN adduser gridftp
ADD gridftp.conf /etc/gridftp.conf
ADD globus-connect-server.conf /etc/globus-connect-server.conf
# globus-connect-server-setup script needs these
ENV HOME /root
ENV TERM xterm

# The following ports are used:
# GridFTP:2811, 50000-51000  
# ranges not supported, so need to use docker run -P to expose all ports

# add GridFTP data directory
### VOLUME /home/data
# add pid directory
### VOLUME /var/run

### CMD ["/usr/sbin/globus-gridftp-server", "-c" "/etc/gridftp.conf", "-pidfile", "/var/run/globus-gridftp-server.pid", "-no-detach", "-config-base-path", "/data"]