pushcerts:
	kubectl create secret generic ssl-key -n perfsonar --from-file=cert=../traefik/prod/k8s_cert.cer --from-file=key=../traefik/prod/k8s.key

pushgooglecert:
	kubectl --namespace=perfsonar create secret docker-registry gcr-json-key \
          --docker-server=https://us.gcr.io \
          --docker-username=_json_key \
          --docker-password="`cat ../prp-k8s-4a9119125faa.json`" \
          --docker-email=dmishin@sdsc.edu
	kubectl --namespace=perfsonar patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'

grantpriv:
	kubectl create clusterrolebinding default:psp:privileged \
    --clusterrole=psp:privileged-user \
    --serviceaccount=perfsonar:default \
		-n perfsonar
