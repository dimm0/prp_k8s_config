default: buildrelease

builddocker:
	docker build --rm -t gateway.calit2.optiputer.net:5000/prp-k8s/nrp-perfsonar-toolkit:latest .

pushdocker:
    docker push gateway.calit2.optiputer.net:5000/prp-k8s/nrp-perfsonar-toolkit:latest

buildrelease: builddocker pushdocker

submitkeys:
	kubectl create secret generic ssl-key --from-file=key=k8s_optiputer_net.key --from-file=cert=k8s_optiputer_net_cert.cer -n nrp-perfsonar