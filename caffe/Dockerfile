FROM gcr.io/tensorflow/tensorflow:latest-gpu

RUN pip install jupyterlab && \
  apt-get update && \
  apt-get install -y openssh-client vim mlocate libprotobuf-dev libleveldb-dev libsnappy-dev \
    libopencv-dev libhdf5-serial-dev protobuf-compiler git wget libatlas-base-dev python-dev linux-headers-generic apt-file && \
  apt-file update && \
  apt-get install -y --no-install-recommends libboost-all-dev && \
  cd /tmp && \
  git clone https://github.com/BVLC/caffe.git && \
  wget https://developer.nvidia.com/compute/cuda/9.0/Prod/local_installers/cuda_9.0.176_384.81_linux-run && \
  sh ./cuda_9.0.176_384.81_linux-run && \
  cd caffe/ && \
  cp Makefile.config.example Makefile.config && \
  wget https://developer.nvidia.com/compute/cuda/8.0/Prod2/local_installers/cuda_8.0.61_375.26_linux-run && \
  sh cuda_8.0.61_375.26_linux-run && \
  cd /usr/local && \
  tar -zxvf cudnn-8.0-linux-x64-v5.1.tgz && \
  cd /examples/caffe/ && \
  apt-get install -y libgflags-dev libgoogle-glog-dev libhdf5-dev libhdf5 cmake liblmdb-dev htop && \
  mkdir build && \
  cd build && \
  cmake .. && \
  make all -j4 && \
  cd python && \
  ldconfig

CMD ["jupyter-notebook", "--allow-root"]
