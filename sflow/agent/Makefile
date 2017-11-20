default: buildrelease

builddocker:
	docker build -t us.gcr.io/prp-k8s/sflow_agent:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/sflow_agent

buildrelease: builddocker pushdocker

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/sflow_agent:latest .

restartcontainer:
	kubectl delete pod --selector=k8s-app=sflow-agent
