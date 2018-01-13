pushconfig:
	-kubectl delete configmap traefik-conf -n kube-system
	kubectl create configmap -n kube-system traefik-conf --from-file=traefik.toml

makeselfcerts:
	openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
	openssl rsa -passin pass:x -in server.pass.key -out k8s.key
	rm server.pass.key
	openssl req -new -key k8s.key -out server.csr
	openssl x509 -req -sha256 -days 365 -in server.csr -signkey k8s.key -out k8s_cert.cer
	rm server.csr

pushcerts:
	kubectl create secret generic ssl-key -n kube-system --from-file=dev/k8s_cert.cer --from-file=dev/k8s.key

pushgooglecert:
	kubectl --namespace=kube-system create secret docker-registry gcr-json-key \
          --docker-server=https://us.gcr.io \
          --docker-username=_json_key \
          --docker-password="`cat ../prp-k8s-4a9119125faa.json`" \
          --docker-email=dmishin@sdsc.edu
	kubectl --namespace=kube-system patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'
