from flask import Flask, jsonify
from flask_cors import CORS
from interviewAllocations import allocate_interviews
from allocations import rpAllocate


app = Flask(__name__) #creates the flask app and
CORS(app, origin="http://localhost:5173") #uses CORS on this file so React can talk to it

@app.route('/allocation') #url on the flask local host that will run the function below
def allocate(): #function to call in frontend
    return allocate_interviews() #function form python file

@app.route('/rpAllocation')
def rp():
    return rpAllocate()

if __name__ == '__main__': #if this file is run directly then this will run
    app.run(debug=True)