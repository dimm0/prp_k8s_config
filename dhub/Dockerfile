FROM gcr.io/tensorflow/tensorflow:latest-gpu

MAINTAINER John Graham jjgraham@ucsd.edu

# # install everything
WORKDIR /root/
RUN  apt update -y && \
 apt install python3-pip -y && \
 add-apt-repository ppa:deadsnakes/ppa -y && \
 apt update -y && \
 apt install python3.6 -y && \
 apt install vim -y && \
 apt install git -y && \
 apt install sudo -y && \
 apt install python3-tk -y && \
 apt install npm nodejs-legacy --upgrade -y && \
 apt install libcairo2-dev libjpeg-dev libgif-dev -y && \
 apt install python-igraph -y && \
 pip3 install jupyterhub --upgrade && \
 pip3 install notebook --upgrade  && \
 pip3 install oauthenticator --upgrade && \
 pip3 install tensorflow-gpu --upgrade --pre  && \
 pip3 install sklearn --upgrade && \
 pip3 install tensorflow-hub --upgrade && \
 pip3 install seaborn --upgrade && \
 pip3 install matplotlib --upgrade && \
 pip3 install dateparser --upgrade && \
 pip3 install jupyterlab==0.32.0 && \
 pip3 install ipywidgets==7.2.1 && \
 pip3 install ipyvolume==0.4.5 && \
 pip3 install bqplot==0.10.2 && \
 pip3 install plotly==2.4.1 && \
 pip3 install ipyleaflet==0.7.1 && \
 npm cache clean -f && \
 npm install -g n && \
 npm install -g configurable-http-proxy  && \
 n stable && \
 npm i -g npm && \
 jupyterhub --generate-config && \
 jupyter labextension install --no-build @jupyterlab/hub-extension && \
 jupyter labextension install --no-build @jupyterlab/fasta-extension && \
 jupyter labextension install --no-build @jupyterlab/geojson-extension && \
 jupyter labextension install --no-build @jupyterlab/plotly-extension && \
 jupyter labextension install --no-build @jupyterlab/vega2-extension && \
 jupyter labextension install --no-build @jupyter-widgets/jupyterlab-manager@0.35.0 && \
 jupyter labextension install --no-build @jupyterlab/plotly-extension@0.14.4 && \
 jupyter labextension install --no-build bqplot@0.3.6 && \
 jupyter labextension install --no-build ipyvolume@0.4.5 && \
 jupyter labextension install --no-build jupyter-leaflet@0.7.1 && \
 jupyter labextension install --no-build jupyterlab_vim@0.7.0 && \
 jupyter lab clean && jupyter lab build
