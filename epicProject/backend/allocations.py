import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd

def rpAllocate():
    # creates a supabase client
    load_dotenv(dotenv_path=".env")
    url: str = os.environ.get("VITE_SUPABASE_URL")
    key: str = os.environ.get("VITE_SUPABASE_KEY") 
    supabase: Client = create_client(url, key)

    return 'RP'