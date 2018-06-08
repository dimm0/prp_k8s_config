FROM golang

WORKDIR /data
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...
