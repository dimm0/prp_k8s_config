default: buildrelease

buildgo:
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix "static" .

builddocker:
	docker build -t us.gcr.io/prp-k8s/meshconfig:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/meshconfig

cleanup:
	rm meshconfig

buildrelease: buildgo builddocker pushdocker cleanup

restartpod:
	kubectl delete pod -n perfsonar -l k8s-app=meshconfig

pushconfig:
	-kubectl delete configmap mesh-config -n perfsonar
	kubectl create configmap mesh-config --from-file=config.toml=config.toml -n perfsonar
