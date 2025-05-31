import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd

# creates a supabase client
<<<<<<< HEAD
load_dotenv(dotenv_path="epicProject/jobsBoard/.env")
url: str = "https://zahjfkggsyktdshmjmre.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODEyMzMsImV4cCI6MjA2MzU1NzIzM30.-7nvAbM7nzfHAs3qYwXivZjHMP6dfbX5k3LUByxk09A"
=======
load_dotenv(dotenv_path='.env')
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_KEY")
>>>>>>> 31fec0b75dd57bf20d4be04476d4a4222c702e1b
supabase: Client = create_client(url, key)

# any files downloaded from supabase are stored in the download_directory
download_directory = "epicProject/backend/csvDownloads"
os.makedirs(download_directory, exist_ok=True)

#downloads the jobRankings csv from supabase storage and prints it
global local_path
local_path = os.path.join(download_directory, "jobRankings.csv")
with open(local_path, "wb") as f:
    response = (
        supabase.storage
        .from_("ranking-csvs")
        .download("jobRankings.csv")
    )
    f.write(response)

# downloads the qca_list csv from supabase storage and prints it
global qca_path
qca_path = os.path.join(download_directory, "qca_list.csv")
with open(qca_path, "wb") as file:
    response = (
        supabase.storage
        .from_("qca-list")
        .download("qca_list.csv")
    )
    file.write(response)