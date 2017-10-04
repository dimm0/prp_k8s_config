FROM phusion/baseimage:0.9.19

MAINTAINER Dmitry Mishin, dmishin@sdsc.edu

# ENV BUILDTYPE ""


# # PETSc and SLEPc versions

ENV PETSC_VERSION=3.7.2 \
    SLEPC_VERSION=3.7.1 \
    ARCH=arch-linux2-c-debug \
    SWDIR=/opt

ENV PETSC_DIR=${SWDIR}/petsc-${PETSC_VERSION} \
    SLEPC_DIR=${SWDIR}/slepc-${SLEPC_VERSION} \
    PETSC_ARCH=${ARCH} \
    SLEPC_ARCH=${ARCH}

ENV PETSC_LIB=${PETSC_DIR}/${PETSC_ARCH}/lib/ \
    SLEPC_LIB=${SLEPC_DIR}/${SLEPC_ARCH}/lib/

ENV LD_LIBRARY_PATH=${PETSC_LIB}:${SLEPC_LIB}:${LD_LIBRARY_PATH}


# # install everything

COPY setup_petsc.sh ${SWDIR}/
WORKDIR ${SWDIR}
RUN ./setup_petsc.sh ${PETSC_VERSION} ${SLEPC_VERSION} ${ARCH} ${SWDIR}


# LibMesh install
ADD https://github.com/libMesh/libmesh/archive/master.zip /tmp/master.zip
WORKDIR /tmp
# Build LibMesh
RUN unzip -q master.zip
WORKDIR /tmp/libmesh-master
# Set PETSc and SLEPc paths
ENV PETSC_DIR /opt/petsc
ENV SLEPC_DIR /opt/slepc
# Configure
RUN ./configure --with-methods="opt pro dbg" \
    	--prefix=/opt/libmesh \
        --with-metis=PETSc \
        --enable-tbb \
        --enable-ifem \
        --enable-cxx11 \
        --enable-silent-rules \
        --enable-unique-ptr \
        --enable-unique-id \
        --disable-warnings \
        --disable-timestamps \
        --disable-fortran \
        --disable-pthreads \
        --disable-openmp \
        --disable-maintainer-mode
# Buld and test
RUN make -j$(nproc)
RUN make install -j$(nproc)
RUN make installcheck -j$(nproc) METHODS=opt
# Add LIBMESH_DIR to env variables
ENV LIBMESH_DIR /opt/libmesh
ENV PATH $LIBMESH_DIR/bin:$PATH
# Clean
RUN rm -rf /tmp/*

WORKDIR /home
