FROM alpine:3.7

MAINTAINER Dmitry Mishin <dmishin@ucsd.edu>

RUN apk --update add nmap nmap-scripts curl tcpdump bind-tools jq nmap-ncat ethtool iproute2

ADD prp-tuner /
CMD ["/prp-tuner"]
EXPOSE 10015