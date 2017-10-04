#!/bin/bash

PETSC_VERSION=$1
SLEPC_VERSION=$2
ARCH=$3
SWDIR=$4

# # environment variables
export PETSC_DIR=${SWDIR}/petsc-${PETSC_VERSION}
export SLEPC_DIR=${SWDIR}/slepc-${SLEPC_VERSION}
# export PETSC_ARCH=arch-linux2-c-debug
export PETSC_ARCH=${ARCH}
export SLEPC_ARCH=${ARCH}

# # print inherited environment
printenv


apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
                       unzip make m4 \
                       gcc gfortran wget curl python pkg-config build-essential \
                       valgrind


# # Download and extract PETSc.
cd ${SWDIR}
printf "\n=== Downloading PETSc\n"
wget --no-verbose http://ftp.mcs.anl.gov/pub/petsc/release-snapshots/petsc-lite-${PETSC_VERSION}.tar.gz && \
    gunzip -c petsc-lite-${PETSC_VERSION}.tar.gz | tar -xof -

cd ${PETSC_DIR}

# # # Configure and build PETSc
printf "\n=== Configuring PETSc without batch mode & installing\n"
./configure --with-cc=gcc --with-cxx=g++ --with-fc=gfortran --download-fblaslapack --download-mpich --download-hdf5=yes &&\
    make all && \
    make test




# # # Download and extract SLEPc.
cd ${SWDIR}
printf "\n=== Downloading SLEPc\n"
wget --no-verbose http://www.grycap.upv.es/slepc/download/distrib/slepc-${SLEPC_VERSION}.tar.gz
gunzip -c slepc-${SLEPC_VERSION}.tar.gz | tar -xof -



cd $SLEPC_DIR

# # # Configure and build SLEPc.
printf "\n=== Configuring & installing SLEPc\n"
./configure && \
    make all && \
    make test

# # remove .tar.gz
cd ${SWDIR}
rm *.tar.gz



# # # Add the newly compiled libraries to the environment.
# export LD_LIBRARY_PATH=${PETSC_DIR}/${PETSC_ARCH}/lib/:${SLEPC_DIR}/${PETSC_ARCH}/lib/
# export PKG_CONFIG_PATH=${PETSC_DIR}/${PETSC_ARCH}/lib/pkgconfig:${SLEPC_DIR}/${PETSC_ARCH}/lib/pkgconfig



# # # clean temp data
apt-get clean && apt-get purge && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
