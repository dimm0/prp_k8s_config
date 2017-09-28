default: buildgoogle

buildgoogle:
	gcloud container builds submit --tag us.gcr.io/prp-k8s/perfsonar_testpoint:latest .

pushconfig:
	kubectl delete configmap perfsonar-testpoint -n kube-public
	kubectl create configmap perfsonar-testpoint -n kube-public --from-file=conf/meshconfig-agent-tasks.conf --from-file=conf/meshconfig-agent.conf
