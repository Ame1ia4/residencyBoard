import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd

# creates a supabase client
url = "https://zahjfkggsyktdshmjmre.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODEyMzMsImV4cCI6MjA2MzU1NzIzM30.-7nvAbM7nzfHAs3qYwXivZjHMP6dfbX5k3LUByxk09A"
supabase: Client = create_client(url, key)

# any files downloaded from supabase are stored in the download_directory
download_directory = "epicProject/backend/csvDownloads"
os.makedirs(download_directory, exist_ok=True)

# downloads the qca_list csv from supabase storage
def qca_list_download(year_group):
    filename = f"qca_list_{year_group}.csv"
    qca_path = os.path.join(download_directory, filename)
    response = (
        supabase.storage
        .from_("qca-list")
        .download(f"qca_list_{year_group}.csv")
    )
    with open(qca_path, "wb") as file:
        file.write(response)

    #print(f"QCA list downloaded to {qca_path}")
    return qca_path
