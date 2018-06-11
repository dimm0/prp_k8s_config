Put nvidia_exporter.service to /etc/systemd/system/ on GPU nodes

Put https://github.com/tankbusta/nvidia_exporter compiled to /opt

systemctl daemon-reload && systemctl enable nvidia_exporter.service
systemctl start nvidia_exporter.service

https://github.com/will-Do/nvidia_exporter/tree/master/grafana