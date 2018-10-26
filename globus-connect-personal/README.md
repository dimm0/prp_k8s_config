## GridFTP server /Globus Connect container

### Build docker image

Edit local.mk file  and set your local variables: NAMESPACE, SIZE,NW 

``` bash
make image
```

### Testing image
```
docker run -i -t --rm globus-personal-connect bash
```

### Security
make sure the following ports are allowed by the base host:
* GridFTP: 2811, 50000-51000 
* bwctl: 4823, 5001-5900, 6001-6200
* owamp: 861, 8760-9960

### Extending image with Globus Connect Personal 

The docker file is updated with globusconnectpersonal tools. 
Once the container is up and running  follow these steps to create and
configure globus personal endpoint (Globus login account is needed).
This will allow a user to use the globus web application https://www.globus.org/app/transfer
to transfer files to/from a container globus endpoint to another globus endpoint.

#. Become a gridftp user
```bash
su - gridftp
```
#. Login to your globus account
``` bash
$ cd globusconnectpersonal-2.3.6/
$ globus login --no-local-server
```
You will see the output similar to the following :
``` text
Please authenticate with Globus here:
------------------------------------
https://auth.globus.org/v2/oauth2/authorize?prompt=login&access_type=offline&state=_default&redirect_uri=https
%3A%2F%2Fauth.globus.org%2Fv2%2Fweb%2Fauth-code&response_type=code&client_id=85...
&scope=openid+profile+email+uuview_identity_set+urn%3Aglobus%3Aauth%3Ascope%3Atransfer.api.globus.org%3Aall
------------------------------------
Enter the resulting Authorization Code here:
```
At this poitn the prompt is waiting for the authorization code. 
Paste the URL from the output into a web browser (not on a container) and follow the directions
to login using CILogon. You may use your Globus account or your institutional
account that is recognized by Globus.  Once you login you will be given
and authorization code string which you need to paste at the prompt on a
container.  If successful, the results is:
``` text
You have successfully logged in to the Globus CLI as YouCredential@your.org
```

The authentication string given by Globus  in a web browser is valid for ~10 min.

#. Create a globus endpoint

Use a unique name for the endpoint, in the command below it is "bwep"
``` bash
$ globus endpoint create --personal bwep
Endpoint created successfully
Endpoint ID: 087ecee8-d7cd-11e8-8c7b-0a1d4c5c
Setup Key: 93229f51-7c87-4041-829e-7a644ac8
```
Save the Endpoint as variables for the next commands

``` bash
ep=087ecee8-d7cd-11e8-8c7b-0a1d4c5c
epkey=93229f51-7c87-4041-829e-7a644ac8
```

#. Generate a setup key for the endpoint and create endpoint

``` bash
$ ./globusconnectpersonal -setup $epkey
Configuration directory: /home/gridftp/.globusonline/lta
Contacting relay.globusonline.org:2223
Done!
```

#. Verify Endpoint is configured

``` bash
$ globus endpoint search --filter-scope my-endpoints
ID                | Owner                  | Display Name 
------------------| -----------------------| -------------
087ecee8-d7cd-... | YouCredential@your.org | bwep
```
A user can have multiple endpoints and they all will be listed.

#. Start personal globus connect

``` bash
$ ./globusconnect -start &
```

At this point configure personal endpoint shows in the globus  web application
and one can use it for transferring  the files to/from other endpoints.

NOTE: one need to have a paid-for Globus account in order to transfer files
between two personal endpoints. For a base Globus account one can  have
multiple  personal endpoints and use them for transfers to/from other (public
or per login) endpoints.

#. Saving endpoint info

When container restarts your globus setup is gone but the endpoint info in the
globus web app remains. One can save endpoint setup in a persistent volume
that was used for the container, for example /data:

``` bash
$ mkdir /data/gridftp-home 
$ cd ~gridftp/
cp -p -r .globus* /data/gridftp-home/
```
After a container restart will need to restore the saved info
in order to reuse the endpoint (commands assume gridftp user):

``` bash
$ cp -p -r /data/gridftp-home/.glob* ~ 
```
