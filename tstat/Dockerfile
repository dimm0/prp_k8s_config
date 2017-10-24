FROM centos

RUN yum update -y && yum install -y svn autoconf automake libtool libpcap libpcap-devel make gcc-c++

WORKDIR /opt

RUN svn checkout http://tstat.polito.it/svn/software/tstat/trunk tstat && \
  cd tstat && \
  ./autogen.sh && ./configure && make && make install && make clean
