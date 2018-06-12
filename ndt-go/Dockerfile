FROM centos as builder
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
RUN go get github.com/m-lab/ndt-server-go
ENTRYPOINT ["ndt-server-go"]


FROM centos
MAINTAINER Dmitry Mishin <dmishin@ucsd.edu>

COPY --from=builder /go/bin/ndt-server-go /bin/ndt-server-go

EXPOSE 3001
ENTRYPOINT ["/bin/ndt-server-go"]