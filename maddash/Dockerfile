# perfSONAR tools

FROM centos:centos7
MAINTAINER Brian Tierney <bltierney@es.net>

RUN yum -y install epel-release
RUN yum -y update; yum clean all
RUN echo "NETWORKING=yes" > /etc/sysconfig/network
RUN yum -y install ntp
#RUN cp -p /usr/share/zoneinfo/UTC /etc/localtime
RUN ntpdate -s pool.ntp.org
#ADD ntp.conf /etc/ntp.conf
RUN chkconfig ntpdate on
RUN chkconfig ntpd on
#ADD ntpd.sh /root/ntpd.sh
#RUN chmod +x /root/ntpd.sh
#CMD ["/root/ntpd.sh"]

RUN yum -y install git wget nmap htop mlocate net-tools sysstat tcpdump # grab a few other favorite tools
RUN yum -y install httpd java-1.8.0-openjdk
RUN yum -y install maven

RUN git clone --recursive https://github.com/esnet/maddash.git
RUN cd maddash && mvn clean install
RUN rpm -hUv http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm
RUN yum -y install nagios-plugins-perfsonar
RUN cd maddash/maddash-server/ && ./bin/run.sh

VOLUME /var/run
