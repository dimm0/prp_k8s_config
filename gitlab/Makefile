install:
	# TILLER_NAMESPACE=gitlab helm upgrade --debug --install gitlab --namespace gitlab ~/code/gitlab --timeout 600 --set global.hosts.domain=nautilus.optiputer.net,gitlab.migrations.initialRootPassword="MJ42hGLjnhZW56",global.ingress.configureCertmanager=false 
	# TILLER_NAMESPACE=gitlab helm install --namespace=gitlab --name gitlab --set baseDomain=nautilus.optiputer.net,gitlab=ee,global.ingress.configureCertmanager=false  gitlab/gitlab-omnibus
	TILLER_NAMESPACE=gitlab helm install --dry-run --debug --namespace=gitlab --name gitlab --set baseDomain=nautilus.optiputer.net,gitlab=ee,global.ingress.configureCertmanager=false  gitlab/gitlab-omnibus

pushcerts:
	-kubectl delete secret ssl-key -n gitlab
	kubectl create secret generic ssl-key -n gitlab --from-file=certificate.pem=../traefik/prod/k8s_cert.cer --from-file=key.pem=../traefik/prod/k8s.key
