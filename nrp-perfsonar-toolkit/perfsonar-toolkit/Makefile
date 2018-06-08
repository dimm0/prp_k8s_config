default: buildrelease

builddocker:
	docker build -t us.gcr.io/prp-k8s/nrp-perfsonar-toolkit:latest .

pushdocker:
	gcloud docker -- push us.gcr.io/prp-k8s/nrp-perfsonar-toolkit

buildrelease: builddocker pushdocker

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/nrp-perfsonar-toolkit:latest .

submitkeys:
	kubectl create secret generic ssl-key --from-file=key=k8s_optiputer_net.key --from-file=cert=k8s_optiputer_net_cert.cer -n perfsonar

markcore:
	for i in `seq -w 1 8`; do kubectl label nodes coreos-0$i.calit2.optiputer.net core=true; done
