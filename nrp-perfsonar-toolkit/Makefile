pushcerts:
	kubectl create secret generic ssl-key -n nrp-perfsonar --from-file=cert=../traefik/prod/k8s_cert.cer --from-file=key=../traefik/prod/k8s.key

pushconfig:
	-kubectl delete configmap maddash-yaml-config -n nrp-perfsonar
	kubectl create configmap maddash-yaml-config --from-file=maddash.yaml=maddash.yaml -n nrp-perfsonar

grantpriv:
	kubectl create clusterrolebinding default:psp:privileged \
    --clusterrole=psp:privileged-user \
    --serviceaccount=nrp-perfsonar:default \
		-n nrp-perfsonar
