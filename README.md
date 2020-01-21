# install

    $ pip install -r requirements.txt
    $ npm install
    $ gunicorn main:app --log-file=-


# dockerbuild

docker build -t submod/mnist-app -f Dockerfile.nodejs .


# Integration With OpenShift

Ensure that you are connected to an OpenShift project

```
oc new-project test
```

Create the template for mnist web application.

```
oc create -f https://raw.githubusercontent.com/sub-mod/mnist-app/master/template.json
```

Once the tensorflow serving endpoints are created deploy the mnist-app.
This app needs 2 serving endpoints.For more details look here [tensorflow-serving-s2i](https://github.com/radanalyticsio/tensorflow-serving-s2i)


```
oc new-app --template=mnistapp --param=APPLICATION_NAME=mnist-app \
	--param=PREDICTION_SERVICE1=tf-reg \
	--param=PREDICTION_SERVICE2=tf-cnn
```

### credits:
The UI layer code was used with permission from Yoshihiro Sugi (@sugyan). The backend was redeveloped to work with tensorflow model server and openshift.



