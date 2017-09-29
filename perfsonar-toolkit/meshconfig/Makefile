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
