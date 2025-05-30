from flask import Flask, jsonify
from flask_cors import CORS
from interviewAllocations import allocate_interviews


app = Flask(__name__) #creates the flask app and
CORS(app) #uses CORS on this file so React can talk to it

@app.route('/') #url on the flask local host that will run the function below
def allocate():
    result = allocate_interviews() 
    return result

if __name__ == '__main__': #if this file is run directly then this will run
    app.run(debug=True)