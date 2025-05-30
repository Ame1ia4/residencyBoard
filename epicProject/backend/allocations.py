import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd

# creates a supabase client
load_dotenv(dotenv_path="epicProject/jobsBoard/.env")
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_KEY") 
print(url)
print(key) 
print(os.getcwd())
supabase: Client = create_client(url, key)