pushcerts:
	kubectl create secret generic ssl-key -n nrp-perfsonar --from-file=cert=../traefik/prod/k8s_cert.cer --from-file=key=../traefik/prod/k8s.key

pushconfig:
	-kubectl delete configmap nrp-maddash -n nrp-perfsonar
	kubectl create configmap nrp-maddash --from-file=maddash.yaml=maddash.yaml -n nrp-perfsonar
	-kubectl delete configmap nrp-config -n nrp-perfsonar
	kubectl create configmap nrp-config --from-file=config.json=config.json -n nrp-perfsonar
	-kubectl delete configmap nrp-scidas -n nrp-perfsonar
	kubectl create configmap nrp-scidas --from-file=scidas.sh=scidas.sh -n nrp-perfsonar
	-kubectl delete configmap nrp-cron-load-gridftp -n nrp-perfsonar
	kubectl create configmap nrp-cron-load-gridftp --from-file=cron-load-gridftp.sh=cron-load-gridftp.sh -n nrp-perfsonar
	
grantpriv:
	kubectl create clusterrolebinding default:psp:privileged \
    --clusterrole=psp:privileged-user \
    --serviceaccount=nrp-perfsonar:default \
		-n nrp-perfsonar
