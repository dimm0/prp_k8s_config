# Globus Connect/GridFTP container
# https://www.globus.org/globus-connect-server
# includes GridFTP and Globus Connect
# also includes some network test tools
# Nadya Williams: add globusconnectpersonal tools
# to globus-connect created by John Graham

FROM centos:centos7
MAINTAINER Nadya Williams <nwilliams@ucsd.edu>

RUN yum -y update; yum clean all && \
yum -y install traceroute lsb yum-utils net-tools && \
yum -y install wget rsync openssh-clients && \
rpm -hUv http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm && \
yum -y install epel-release && \
yum -y update; yum clean all && \
yum -y install python-pip python2-pip mlocate && \
yum -y install perfsonar-tools && \
yum -y install nuttcp bwctl owamp iperf3 && \
rpm -hUv http://downloads.globus.org/toolkit/gt6/stable/installers/repo/rpm/globus-toolkit-repo-latest.noarch.rpm && \
yum -y install globus-data-management-client globus-data-management-server globus-xio-udt-driver && \
yum -y install globus-connect-server && \
pip install esmond-client && \
pip install --upgrade globus-cli && \
adduser gridftp
RUN cd /root && \
wget https://downloads.globus.org/globus-connect-personal/linux/stable/globusconnectpersonal-latest.tgz && \
tar xzvf /root/globusconnectpersonal-latest.tgz -C /home/gridftp && \
chown -R gridftp.gridftp /home/gridftp/globus*
ADD gridftp.conf /etc/gridftp.conf
ADD globus-connect-server.conf /etc/globus-connect-server.conf
# globus-connect-server-setup script needs these
ENV HOME /root
ENV TERM xterm

