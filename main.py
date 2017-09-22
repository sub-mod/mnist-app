import os
import numpy as np
from flask import Flask, jsonify, render_template, request
import json
from grpc.beta import implementations
import tensorflow as tf
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_service_pb2
from tensorflow.core.framework import types_pb2
from google.protobuf.json_format import MessageToJson
from grpc.framework.interfaces.face.face import AbortionError

def model1(image):
    host = os.environ.get('PREDICTION_HOST1', '0.0.0.0')
    port = os.environ.get('PREDICTION_PORT1', '6006')
    channel = implementations.insecure_channel(host, int(port))
    stub = prediction_service_pb2.beta_create_PredictionService_stub(channel)
    request = predict_pb2.PredictRequest()
    request.model_spec.name = "mnist"
    request.model_spec.signature_name = 'predict_images'
    request.inputs['images'].CopyFrom(tf.contrib.util.make_tensor_proto(image, shape=[1, image.size]))

    result = []
    try:
        result = stub.Predict(request, 10.0)
    except AbortionError as e:
        print("=======ERROR======")
        print(type(e))    # the exception instance
        print(e.args)     # arguments stored in .args
        print(e)
        return np.array([])


    jsonresult = MessageToJson(result)
    finalresult = json.loads(jsonresult)
    final = np.array(finalresult["outputs"]["scores"]["floatVal"])
    return final


def model2(image):
    host = os.environ.get('PREDICTION_HOST2', '0.0.0.0')
    port = os.environ.get('PREDICTION_PORT2', '6006')
    channel = implementations.insecure_channel(host, int(port))
    stub = prediction_service_pb2.beta_create_PredictionService_stub(channel)
    request = predict_pb2.PredictRequest()
    request.model_spec.name = "mnist"
    request.model_spec.signature_name = 'predict_images'
    request.inputs['keep_prob'].dtype = types_pb2.DT_FLOAT
    request.inputs['keep_prob'].float_val.append(0.5)
    request.inputs['images'].CopyFrom(tf.contrib.util.make_tensor_proto(image, shape=[1, image.size]))
    result = []
    try:
        result = stub.Predict(request, 10.0)
    except AbortionError as e:
        print("=======ERROR======")
        print(type(e))    # the exception instance
        print(e.args)     # arguments stored in .args
        print(e)
        return np.array([])

    jsonresult = MessageToJson(result)
    finalresult = json.loads(jsonresult)
    final = np.array(finalresult["outputs"]["scores"]["floatVal"])
    return final

# webapp
app = Flask(__name__)


@app.route('/api/mnist', methods=['POST'])
def mnist():
    input = ((255 - np.array(request.json, dtype=np.uint8)) / 255.0).reshape(1, 784)
    print "------------"
    print request.json
    print "------------"

    print os.environ.get('PREDICTION_HOST2', '0.0.0.0')
    print os.environ.get('PREDICTION_HOST1', '0.0.0.0')
    image = np.array(input[0],dtype=np.dtype('float32'))

    resultlist1 = model1(image)
    resultlist2 = model2(image)
    prediction1 = np.argmax(resultlist1)
    print prediction1
    prediction2 = np.argmax(resultlist2)
    print prediction2
    output1 = resultlist1.flatten().tolist()
    output2 = resultlist2.flatten().tolist()
    return jsonify(results=[output1, output2])


@app.route('/')
def main():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
