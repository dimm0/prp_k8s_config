FROM centos:7

RUN yum install -y https://github.com/sflow/host-sflow/releases/download/v2.0.11-1/hsflowd-centos7-2.0.11-1.x86_64.rpm

ADD hsflowd.conf /etc/

CMD /usr/sbin/hsflowd -m `uuidgen` -d
