buildlinux:
	GOOS=linux GOARCH=amd64 go build

upload:
	scp prp-tuner jupyter:
	ssh jupyter ./prp-tuner
