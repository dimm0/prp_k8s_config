FROM gcr.io/tensorflow/tensorflow:latest-gpu

MAINTAINER John Graham jjgraham@ucsd.edu

# # install everything
WORKDIR /root/
RUN apt update -y && \
 apt-get install npm nodejs-legacy --upgrade  -y && \
 npm install -g configurable-http-proxy  && \
 apt install python3-pip -y && \
 apt install git -y && \
 pip3 install --upgrade pip && \
 pip3 install jupyterlab --upgrade && \
 pip3 install jupyterhub --upgrade && \
 pip3 install notebook --upgrade  && \
 pip3 install git+https://github.com/jupyterhub/wrapspawner && \
 pip3 install oauthenticator --upgrade && \
 pip3 install dockerspawner --upgrade && \
 jupyterhub --generate-config && \
 npm cache clean -f && \
 npm install -g n && \
 n stable && \
 jupyter labextension install @jupyterlab/hub-extension
