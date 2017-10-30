default: buildrelease

builddocker:
	docker build -t us.gcr.io/prp-k8s/caffe:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/caffe

buildrelease: builddocker pushdocker

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/caffe:latest --timeout=2h .
