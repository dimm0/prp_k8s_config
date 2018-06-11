FROM  nvidia/cuda:9.2-devel-centos7 as builder
MAINTAINER Dmitry Mishin <dmishin@ucsd.edu>

ENV GOLANG_VERSION 1.10.3
RUN yum install -y git \
                   gcc \
                   make; \
    yum clean all;
RUN set -eux; \
    url="https://dl.google.com/go/go1.10.3.linux-amd64.tar.gz"; \
    curl -o go.tgz "$url"; \
    tar -C /usr/local -xzf go.tgz; \
    rm go.tgz; \
    export PATH="/usr/local/go/bin:$PATH"; \
    go version

ENV GOPATH /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH

RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
WORKDIR $GOPATH
RUN go get github.com/tankbusta/nvidia_exporter
ENTRYPOINT ["nvidia_exporter"]


FROM  nvidia/cuda:9.2-runtime-centos7
MAINTAINER Dmitry Mishin <dmishin@ucsd.edu>

COPY --from=builder /go/bin/nvidia_exporter /bin/nvidia_exporter

EXPOSE 9114
ENTRYPOINT ["/bin/nvidia_exporter"]