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
ADD ntpd.sh /root/ntpd.sh
RUN chmod +x /root/ntpd.sh

CMD ["/root/ntpd.sh"]

RUN rpm -hUv http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm
RUN yum -y install perfsonar-tools
RUN yum -y install supervisor net-tools sysstat tcpdump # grab a few other favorite tools

RUN mkdir -p /var/log/supervisor 
ADD supervisord.conf /etc/supervisord.conf

# The following ports are used:
# bwctl:4823, 5001-5900, 6001-6200
# owamp:861, 8760-9960
# ranges not supported, so need to use docker run -P to expose all ports

# add pid directory
VOLUME /var/run

CMD /usr/bin/supervisord -c /etc/supervisord.conf
