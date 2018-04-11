default: buildrelease

builddocker:
	docker build -t us.gcr.io/prp-k8s/dhub:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/dhub

buildrelease: builddocker pushdocker

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/dhub:latest --timeout=1h .

pushgooglecert:
	kubectl --namespace=digital-humanities create secret docker-registry gcr-json-key \
          --docker-server=https://us.gcr.io \
          --docker-username=_json_key \
          --docker-password="`cat ../prp-k8s-4a9119125faa.json`" \
          --docker-email=dmishin@sdsc.edu
	kubectl --namespace=digital-humanities patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'
pushconfig:
	-kubectl delete configmap jupyterhub-config -n digital-humanities
	kubectl create configmap jupyterhub-config --from-file=jupyterhub_config.py=jupyterhub_config.py -n digital-humanities
