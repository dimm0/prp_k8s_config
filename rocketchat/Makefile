generate-certificate:
	@echo 'Generating self signed certificate'
	-openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
	-openssl rsa -passin pass:x -in server.pass.key -out server.key
	-rm server.pass.key
	-openssl req -new -key server.key -out server.csr -subj "/C=US/ST=California/L=San Diego/O=Self/OU=Ops/CN=localhost"
	-openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
	-cat server.key server.crt > mongodb.pem
	-rm server.key server.crt server.csr
	-kubectl --namespace=rocketchat delete secret mongo-ssl
	-kubectl --namespace=rocketchat create secret generic mongo-ssl --from-file=./mongodb.pem
	-rm mongodb.pem
