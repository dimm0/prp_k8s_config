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

RUN git clone --recursive https://github.com/esnet/maddash.git /usr/lib/maddash
#RUN mv maddash /usr/lib/maddash
RUN cd /usr/lib/maddash && mvn clean install
RUN rpm -hUv http://software.internet2.edu/rpms/el7/x86_64/main/RPMS/Internet2-repo-0.7-1.noarch.rpm
RUN yum -y install nagios-plugins-perfsonar
ADD apache-maddash.conf /etc/httpd/conf.d/apache-maddash.conf
ADD httpd.conf /etc/httpd/conf/httpd.conf
RUN chkconfig httpd on
RUN yum -y install initscripts

VOLUME /var/run

ADD entrypoint.sh /entrypoint.sh
RUN chmod -v +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
