FROM centos:centos7
MAINTAINER Dmitry Mishin <dmishin@ucsd.edu>

RUN yum -y update && yum clean all && \
rpm -hUv http://downloads.globus.org/toolkit/gt6/stable/installers/repo/rpm/globus-toolkit-repo-latest.noarch.rpm && \
yum -y install globus-data-management-client

RUN adduser gridftp

USER gridftp

ENV TERM xterm