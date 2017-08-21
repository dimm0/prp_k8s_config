## perfSONAR Tools docker container

The docker container runs all perfSONAR tools in the "Tools" bundle, as described at:
http://docs.perfsonar.net/install_options.html

This can be used to run the perfSONAR Tools on any OS that supports docker.

docker build -t perfsonar-tools .

docker tag perfsonar-tools gateway.calit2.optiputer.net:5000/prp-k8s/perfsonar-tools:latest

docker push gateway.calit2.optiputer.net:5000/prp-k8s/perfsonar-tools:latest 


To run the container in the background, so others can test to you:
>docker run -d -P --net=host -v /var/run perfsonar/tools

To get an interactive shell on the container, so you can run interactive tests to others:

Get the Container ID:
>docker ps -a

Then use that ID in this command:
>docker run -it ID bash

## Testing

Sample commands to try to another host with perfSONAR installed:
>owping hostname
>bwctl -c host1 -s host2
>pscheduler task --assist sourceHost throughput --source sourceHost --dest destHost

Note that pscheduler requires the full 'testpoint' bundle installed to run a test to/from a host.
You will not be able to run pScheduler directly to/from this docker container.
However, 3rd party mode using the '--assist' flag, as shown above, will work with this container.

## Notes:
The perfSONAR hostname is assume to be the same is the base host. To use a different
name/IP for the perfSONAR container, see: https://docs.docker.com/articles/networking/
It also assume the base host is running NTP.

## Firewalls:
make sure the following ports are allowed by the base host:
 pScheduler: 443, bwctl:4823, 5001-5900, 6001-6200 ; owamp:861, 8760-9960
See: http://www.perfsonar.net/deploy/security-considerations/


