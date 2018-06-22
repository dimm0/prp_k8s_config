# Globus Connect/GridFTP container
# https://www.globus.org/globus-connect-server

# includes GridFTP and Globus Connect
# also includes some network test tools

FROM centos:centos7
MAINTAINER John Graham <jjgraham@ucsd.edu>

RUN yum -y update; yum clean all && \
yum -y install traceroute lsb yum-utils net-tools && \
rpm -hUv http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm && \
yum -y install epel-release && \
yum -y update; yum clean all && \
yum -y install python-pip mlocate && \
yum -y install perfsonar-tools && \
yum -y install nuttcp bwctl owamp iperf3 && \
rpm -hUv http://downloads.globus.org/toolkit/gt6/stable/installers/repo/rpm/globus-toolkit-repo-latest.noarch.rpm && \
yum -y install globus-data-management-client globus-data-management-server globus-xio-udt-driver && \
yum -y install globus-connect-server && \
pip install esmond-client && \
adduser gridftp
ADD gridftp.conf /etc/gridftp.conf
ADD globus-connect-server.conf /etc/globus-connect-server.conf
# globus-connect-server-setup script needs these
ENV HOME /root
ENV TERM xterm