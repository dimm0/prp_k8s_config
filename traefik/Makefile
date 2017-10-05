pushconfig:
	kubectl delete configmap traefik-conf -n kube-system
	kubectl create configmap -n kube-system traefik-conf --from-file=traefik.toml
