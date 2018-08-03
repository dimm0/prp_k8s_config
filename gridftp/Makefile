default: builddocker pushdocker

builddocker:
	docker build -t dimm0/gridftp:latest .

pushdocker:
	docker push dimm0/gridftp

buildrelease: builddocker pushdocker
