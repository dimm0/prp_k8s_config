FROM scratch
ADD meshconfig /
ADD config.toml /config/
ADD templates /templates
ADD ca-bundle.crt /etc/ssl/certs/
CMD ["/meshconfig"]
EXPOSE 80
