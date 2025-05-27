#!/bin/bash

echo 'Downloading Frontend Requirments'
sudo apt update
sudo apt install -y nodejs npm
cd jobsBoard/
npm install

echo 'Downloading Backend Requirments'
sudo apt install -y python3 python3-pip python3.12-venv
cd ../backend/
python3 -m venv venv

echo 'Starting Backend'
source venv/bin/activate
pip install -r requirments.txt
python3 app.py

echo 'Starting Frontend'
cd ../jobsBoard/
npm run dev

# run with chmod +x setup.sh for first time and ./setup.sh the rest of the time
# for windows users run as wsl bash ./setup.sh