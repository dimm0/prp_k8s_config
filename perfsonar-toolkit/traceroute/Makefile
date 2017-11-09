default: buildrelease

buildgo:
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix "static" .

builddocker:
	docker build -t us.gcr.io/prp-k8s/traceroute:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/traceroute

cleanup:
	rm traceroute

buildrelease: buildgo builddocker pushdocker cleanup

restartpod:
	kubectl delete pods --selector=k8s-app=traceroute -n perfsonar
