import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd

# creates a supabase client
load_dotenv(dotenv_path='.env')
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_KEY")
supabase: Client = create_client(url, key)

# any files downloaded from supabase are stored in the download_directory
download_directory = "csvDownloads"
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