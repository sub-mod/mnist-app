FROM centos:latest

MAINTAINER Subin Modeel

USER root

ENV NODEJS_VERSION=v8.3.0
EXPOSE 8000


ENV PATH=/node-lib/node/bin:$PATH

RUN mkdir -p /app
WORKDIR /app

ADD src /app/src
ADD static /app/static
ADD templates /app/templates
COPY main.py /app/
COPY requirements.txt /app/
COPY package.json /app/
COPY gulpfile.js /app/
COPY gunicorn.sh /app/

RUN yum -y install epel-release make gcc gcc-c++ python python-pip \
    && yum -y clean all \
    && mkdir -p /node-lib \
    && cd /node-lib \
    && curl -s -L -O https://nodejs.org/dist/${NODEJS_VERSION}/node-${NODEJS_VERSION}-linux-x64.tar.xz \
    && tar xf node-${NODEJS_VERSION}-linux-x64.tar.xz \
    && mv node-${NODEJS_VERSION}-linux-x64 node \
    && cd /app \
    && pip install --upgrade pip \
    && pip install -r requirements.txt \
    && npm install  --unsafe-perm \
    && npm install gulp -g \
    && gulp build \
    && yum erase -y gcc gcc-c++ glibc-devel \
    && yum clean all -y \
    && chmod +x /app/gunicorn.sh

USER root
LABEL io.k8s.description="my App." \
      io.k8s.display-name="my App" \
      io.openshift.expose-services="8000:http"

EXPOSE 5000
WORKDIR /app

CMD ["/app/gunicorn.sh"]


