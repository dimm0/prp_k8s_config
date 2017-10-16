FROM gcr.io/tensorflow/tensorflow:latest-gpu

RUN pip install jupyterlab && \
  apt-get update && \
  apt-get install -y openssh-client vim mlocate libprotobuf-dev libleveldb-dev libsnappy-dev \
    libopencv-dev libhdf5-serial-dev protobuf-compiler git wget libatlas-base-dev python-dev linux-headers-generic apt-file libcudnn7 libcudnn7-dev && \
  apt-get install -y --no-install-recommends libboost-all-dev && \
  cd /tmp && \
  wget https://developer.nvidia.com/compute/cuda/8.0/Prod2/local_installers/cuda_8.0.61_375.26_linux-run && \
  sh cuda_8.0.61_375.26_linux-run --silent

  #git clone https://github.com/BVLC/caffe.git && \
  #cd caffe/ && \
  #cp Makefile.config.example Makefile.config && \
  #echo 'INCLUDE_DIRS := $(PYTHON_INCLUDE) /usr/local/include /usr/include/hdf5/serial/' >> Makefile.config && \
  #echo 'LIBRARY_DIRS := $(PYTHON_LIB) /usr/local/lib /usr/lib /usr/lib/x86_64-linux-gnu/hdf5/serial/' >> Makefile.config && \
  #sed -i "s/# USE_CUDNN := 1/USE_CUDNN := 1/" Makefile.config

  #libgflags-dev libgoogle-glog-dev libhdf5-dev  cmake liblmdb-dev htop && \

#RUN \
  #make all -j 4 && \
  #rm -rf /tmp/*

  #CMD ["jupyter-notebook", "--allow-root"]
  CMD ["sleep", "36500000"]
