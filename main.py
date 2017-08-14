import os
import numpy as np
from flask import Flask, jsonify, render_template, request

# webapp
app = Flask(__name__)


@app.route('/api/mnist', methods=['POST'])
def mnist():
    input = ((255 - np.array(request.json, dtype=np.uint8)) / 255.0).reshape(1, 784)
    print "------------"
    print request.json
    print "------------"
    env = os.environ.get('FLASK_ENV', 'development')
    print env
    output1 = []
    output2 = []
    return jsonify(results=[output1, output2])


@app.route('/')
def main():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
