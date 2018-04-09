default: buildrelease

builddocker:
	docker build -t us.gcr.io/prp-k8s/dhub:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/dhub

buildrelease: builddocker pushdocker

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/dhub:latest .
