FROM gcr.io/tensorflow/tensorflow:latest-gpu

MAINTAINER John Graham jjgraham@ucsd.edu

# # install everything
COPY setup_petsc.sh /root/
RUN apt update
RUN apt-get install npm nodejs-legacy --upgrade
RUN npm install -g configurable-http-proxy
RUN apt install python3-pip
RUN apt install git
RUN pip3 install jupyterlab --upgrade
RUN pip3 install jupyterhub --upgrade
RUN pip3 install --upgrade pip
RUN pip3 install --upgrade notebook
RUN pip3 install git+https://github.com/jupyterhub/wrapspawner
RUN pip3 install oauthenticator --upgrade
RUN pip3 install dockerspawner --upgrade
RUN jupyterhub --generate-config
RUN npm cache clean -f
RUN npm install -g n
RUN n stable
RUN jupyter labextension install @jupyterlab/hub-extension
WORKDIR /root/
RUN jupyterhub
