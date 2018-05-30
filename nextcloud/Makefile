default: buildrelease

builddocker:
	docker build -t us.gcr.io/prp-k8s/nextcloud:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/nextcloud

buildrelease: builddocker pushdocker

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/nextcloud:latest .

pushgooglecert:
	kubectl --namespace=nextcloud create secret docker-registry gcr-json-key \
          --docker-server=https://us.gcr.io \
          --docker-username=_json_key \
          --docker-password="`cat ../prp-k8s-4a9119125faa.json`" \
          --docker-email=dmishin@sdsc.edu
	kubectl --namespace=nextcloud patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'


# edit /var/www/html/config/config.php - add trusted_domains
