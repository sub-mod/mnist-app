# tensorflow/jupyter notebook
FROM centos:latest

MAINTAINER Subin Modeel <smodeel@redhat.com>

USER root

## taken/adapted from jupyter dockerfiles
# Not essential, but wise to set the lang
# Note: Users with other languages should set this in their derivative image
ENV LANGUAGE en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV PYTHONIOENCODING UTF-8
ENV CONDA_DIR /opt/conda
ENV PATH $CONDA_DIR/bin:$PATH
ENV NB_USER=nbuser
ENV NB_UID=1011
ENV HOME /home/$NB_USER
ENV NB_PYTHON_VER=2.7
## tensorflow ./configure options for Bazel
ENV PYTHON_BIN_PATH /opt/conda/bin/python
ENV PYTHON_LIB_PATH /opt/conda/lib/python2.7/site-packages
ENV PATH=$HOME/node-lib/node/bin:$PATH
ENV NODEJS_VERSION=v8.3.0


ADD fix-permissions.sh /usr/local/bin/fix-permissions.sh 
ADD src /workspace/src
ADD static /workspace/static
ADD templates /workspace/templates
COPY main.py /workspace/
COPY requirements.txt /workspace/
COPY package.json /workspace/
COPY gulpfile.js /workspace/
COPY gunicorn.sh /usr/local/bin/gunicorn.sh


# Python binary and source dependencies and Development tools
RUN echo 'PS1="\u@\h:\w\\$ \[$(tput sgr0)\]"' >> /root/.bashrc \
    && chgrp -R root /opt \
    && chmod -R ug+rwx /opt \
    && chgrp root /etc/passwd \
    && chmod ug+rw /etc/passwd \
    && useradd -m -s /bin/bash -N -u $NB_UID $NB_USER \
    && usermod -g root $NB_USER \
    && mkdir -p /workspace && chown $NB_UID:root /workspace \
    && yum install -y curl wget bzip2 gnupg2 sqlite3 epel-release tar xz zip unzip gcc gcc-c++ glibc-devel \
    && fix-permissions.sh /workspace


USER $NB_USER

RUN mkdir -p $HOME/node-lib \
    && cd $HOME/node-lib \
    && curl -s -L -O https://nodejs.org/dist/${NODEJS_VERSION}/node-${NODEJS_VERSION}-linux-x64.tar.xz  \
    && unxz node-${NODEJS_VERSION}-linux-x64.tar.xz \
    && tar -xf node-${NODEJS_VERSION}-linux-x64.tar \
    && rm -fr node-${NODEJS_VERSION}-linux-x64.tar.xz \
    && mv node-${NODEJS_VERSION}-linux-x64 node \
    && cd /tmp \
    && wget -q https://repo.continuum.io/miniconda/Miniconda3-4.2.12-Linux-x86_64.sh \
    && echo d0c7c71cc5659e54ab51f2005a8d96f3 Miniconda3-4.2.12-Linux-x86_64.sh | md5sum -c - \
    && bash Miniconda3-4.2.12-Linux-x86_64.sh -b -p $CONDA_DIR \
    && rm Miniconda3-4.2.12-Linux-x86_64.sh \
    && export PATH=/opt/conda/bin:$PATH \
    && $CONDA_DIR/bin/conda install --quiet --yes python=$NB_PYTHON_VER 'nomkl' \
                'matplotlib=1.5*' \
                numpy \
                scikit-learn \
                tensorflow \
                requests \
    && pip install -Iv https://pypi.python.org/packages/2f/3d/b3b7d31f5539d7bbf82310e666d3a1db4d2048f7e586e231faa58290e13e/grpcio-1.3.0.tar.gz#md5=d541daf77548499812929a1845721e9b \
    && pip install mock  \
    && pip install flask \
    && pip install waitress tensorflow-serving-api  \
    && cd /workspace \
    && pip install --upgrade pip \
    && pip install -r requirements.txt \
#&& npm install \
 #   && npm install gulp -g \
  #  && gulp build \
   # && cat /home/nbuser/.npm/_logs/2017*.log
    && $CONDA_DIR/bin/conda remove --quiet --yes --force qt pyqt \
    && $CONDA_DIR/bin/conda clean -tipsy \
    && fix-permissions.sh $CONDA_DIR \
    && fix-permissions.sh $HOME  \
    && fix-permissions.sh /workspace


USER root


# TensorBoard # IPython
EXPOSE 5000 8000
WORKDIR $HOME

ENTRYPOINT ["tini", "--"]
CMD ["gunicorn.sh"]

ENV TINI_VERSION v0.9.0
RUN wget -q https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini -P /tmp \
    && wget -q https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini.asc -P /tmp \
    && cd /tmp  \
    && gpg --keyserver ha.pool.sks-keyservers.net --recv-keys 0527A9B7 && gpg --verify /tmp/tini.asc \
    && mv /tmp/tini /usr/local/bin/tini \
    && chmod +x /usr/local/bin/tini \
    && mkdir -p $HOME/ \
    && fix-permissions.sh $CONDA_DIR \
    && fix-permissions.sh /workspace \
    && fix-permissions.sh $HOME

LABEL io.k8s.description="my App." \
      io.k8s.display-name="my App" \
      io.openshift.expose-services="8000:http"





USER $NB_USER