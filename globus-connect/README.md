## GridFTP server /Globus Connect container

docker build -t globus-connect .
docker tag globus-connect gateway.calit2.optiputer.net:5000/prp-k8s/globus-connect:latest
docker push gateway.calit2.optiputer.net:5000/prp-k8s/globus-connect:latest

## Testing
test GridFTP from another host with 'globus-data-management-client' installed
>globus-url-copy -list ftp://67.58.50.66:2811/export/data/

>globus-url-copy -vb -fast -p 4 ftp://hostname:2811/data/test-file1 file:///dev/null

## Security:
make sure the following ports are allowed by the base host:
GridFTP:2811, 50000-51000  ; bwctl:4823, 5001-5900, 6001-6200 ; owamp:861, 8760-9960