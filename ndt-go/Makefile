default: buildrelease

builddocker:
	docker build -t us.gcr.io/prp-k8s/ndt:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/ndt

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/ndt:latest .

buildrelease: builddocker pushdocker

restartpod:
	kubectl delete pods --selector=k8s-app=ndt -n ndt

pushgooglecert:
	kubectl --namespace=ndt create secret docker-registry gcr-json-key \
          --docker-server=https://us.gcr.io \
          --docker-username=_json_key \
          --docker-password="`cat ../prp-k8s-4a9119125faa.json`" \
          --docker-email=dmishin@sdsc.edu
	kubectl --namespace=ndt patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'
