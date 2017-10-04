default: buildgoogle

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/perfsonar_testpoint:latest .

meshupdateh:
	for i in `kubectl get pods --selector=k8s-app=htestpoint --output=jsonpath={.items..metadata.name} -n perfsonar`; do kubectl exec -it $$i -n perfsonar supervisorctl restart perfsonar_meshconfig_agent; done

meshupdate:
	for i in `kubectl get pods --selector=k8s-app=testpoint --output=jsonpath={.items..metadata.name} -n perfsonar`; do kubectl exec -it $$i -n perfsonar supervisorctl restart perfsonar_meshconfig_agent; done
