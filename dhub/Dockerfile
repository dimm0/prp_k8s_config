FROM gcr.io/tensorflow/tensorflow:latest-gpu

MAINTAINER John Graham jjgraham@ucsd.edu

# # install everything
WORKDIR /root/
RUN apt update -y && \
 apt-get install npm nodejs-legacy --upgrade  -y && \
 npm install -g configurable-http-proxy  && \
 apt install python3-pip -y && \
 apt install vim git -y && \
 apt install libcairo2-dev libjpeg-dev libgif-dev -y && \
 pip3 install --upgrade pip && \
 pip3 install jupyterlab --upgrade && \
 pip3 install jupyterhub --upgrade && \
 pip3 install notebook --upgrade  && \
 pip3 install git+https://github.com/jupyterhub/wrapspawner && \
 pip3 install oauthenticator --upgrade && \
 pip3 install dockerspawner --upgrade && \
 pip3 install tensorflow-gpu --upgrade --pre  && \
 pip3 install tensorflow-hub --upgrade && \
 pip3 install seaborn --upgrade && \
 pip3 install matplotlib --upgrade && \
 jupyterhub --generate-config && \
 npm cache clean -f && \
 npm install -g n && \
 n stable && \
 npm i -g npm && \
 jupyter labextension install  --no-build @jupyterlab/hub-extension && \
 jupyter labextension install  --no-build @jupyterlab/fasta-extension && \
 jupyter labextension install  --no-build @jupyterlab/geojson-extension && \
 jupyter labextension install  --no-build @jupyterlab/plotly-extension && \
 jupyter labextension install  --no-build @jupyterlab/vega2-extension && \
 jupyter lab clean && jupyter lab build
