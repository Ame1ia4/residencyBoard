#!/bin/bash

echo 'Downloading Frontend Requirements'
sudo apt update
sudo apt install -y nodejs npm
cd jobsBoard/
npm install
cd ..

echo 'Downloading Backend Requirements'
sudo apt install -y python3 python3-pip python3.12-venv
cd backend/

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

fuser -k 5000/tcp

# Activate venv and install packages
source venv/bin/activate
pip3 install -r requirements.txt

echo 'Starting Backend'
# Run backend in background
python3 app.py &

echo 'Starting Frontend'
cd ../jobsBoard/
npm run dev


# run with chmod +x setup.sh for first time and ./setup.sh the rest of the time
# for windows users run as wsl bash ./setup.sh