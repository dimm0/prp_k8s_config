default: buildgoogle

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/perfsonar_testpoint:latest .

meshupdate:
	kubectl get pods --selector=k8s-app=testpoint --output=jsonpath={.items..metadata.name} -n perfsonar | xargs -n 1 -P 8 -I{} kubectl exec -it {} -n perfsonar supervisorctl restart perfsonar_meshconfig_agent

submitesmondsecret:
	-kubectl delete secret meshconfig-agent-tasks -n perfsonar
	kubectl create secret generic meshconfig-agent-tasks --from-file=meshconfig-agent-tasks.conf -n perfsonar
