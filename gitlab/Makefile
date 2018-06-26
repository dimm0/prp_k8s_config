default: buildrelease

install:
	# TILLER_NAMESPACE=gitlab helm upgrade --debug --install gitlab --namespace gitlab ~/code/gitlab --timeout 600 --set global.hosts.domain=nautilus.optiputer.net,gitlab.migrations.initialRootPassword="MJ42hGLjnhZW56",global.ingress.configureCertmanager=false 
	# TILLER_NAMESPACE=gitlab helm install --namespace=gitlab --name gitlab --set baseDomain=nautilus.optiputer.net,gitlab=ee,global.ingress.configureCertmanager=false  gitlab/gitlab-omnibus
	TILLER_NAMESPACE=gitlab helm install --dry-run --debug --namespace=gitlab --name gitlab --set baseDomain=nautilus.optiputer.net,gitlab=ee,global.ingress.configureCertmanager=false  gitlab/gitlab-omnibus

pushcerts:
	-kubectl delete secret ssl-key -n gitlab
	kubectl create secret generic ssl-key -n gitlab --from-file=registry.crt=../traefik/prod/k8s_cert.cer --from-file=registry.key=../traefik/prod/k8s.key

builddocker:
	docker build -t us.gcr.io/prp-k8s/gitlab:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/gitlab

buildrelease: builddocker pushdocker

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/gitlab:latest --timeout=1h .

pushgooglecert:
	kubectl --namespace=gitlab create secret docker-registry gcr-json-key \
          --docker-server=https://us.gcr.io \
          --docker-username=_json_key \
          --docker-password="`cat ../prp-k8s-4a9119125faa.json`" \
          --docker-email=dmishin@sdsc.edu
	kubectl --namespace=gitlab patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'