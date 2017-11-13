default: buildrelease

builddocker:
	docker build -t us.gcr.io/prp-k8s/sflow:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/sflow

buildrelease: builddocker pushdocker

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/sflow:latest .

restartcontainer:
	kubectl delete pod --selector=k8s-app=sflow
