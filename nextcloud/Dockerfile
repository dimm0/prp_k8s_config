#FROM tmaczukin/docker-nextcloud:latest - has volume for /apps, see https://github.com/moby/moby/issues/3639
#FROM sameersbn/nextcloud:latest
FROM nextcloud

RUN apt-get update && apt-get install -y make curl git vim

USER www-data:www-data

#RUN git clone --recursive https://github.com/maltevogl/useroidc.git /var/www/nextcloud/apps/useroidc

#RUN su www-data -s /bin/bash -c make

ADD oidc.config.php /var/www/nextcloud/config/

USER root:root
