buildlinux:
	GOOS=linux GOARCH=amd64 go build

upload:
	scp prp-tuner root@k8s-epyc-01.sdsc.optiputer.net:
	ssh root@k8s-epyc-01.sdsc.optiputer.net ./prp-tuner

buildcontainer:
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix "static" .
	docker build -t us.gcr.io/prp-k8s/prp-tuner:latest .
	gcloud docker -- push us.gcr.io/prp-k8s/prp-tuner

restartpod:
	kubectl delete pod -n kube-system --selector=k8s-app=prp-tuner
