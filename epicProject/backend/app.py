from flask import Flask, jsonify
from flask_cors import CORS
from interviewAllocations import allocate_interviews
from jobAllocations import rpAllocate


app = Flask(__name__) #creates the flask app and
CORS(app, origins={"http://127.0.0.1:5173"}) #uses CORS on this file so React can talk to it

@app.route('/timelineMan') #url on the flask local host that will run the function below
def allocate(year_group): #function to call in frontend
    return allocate_interviews(year_group) #function form python file

@app.route('/rpAllocation')
def rp():
    return rpAllocate()

if __name__ == '__main__': #if this file is run directly then this will run
    app.run(debug=True)