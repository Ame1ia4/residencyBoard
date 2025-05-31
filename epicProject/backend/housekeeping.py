from supabase import create_client, Client
import os
from dotenv import load_dotenv

# creates a supabase client
load_dotenv(dotenv_path="epicProject/jobsBoard/.env")
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_KEY") 

def clearInterviewAllocations():
    x = 0
    ids = []
    for i in range(162):
        x += 90
        ids.append(x)
    response = (
        supabase.table("InterviewAllocation")
        .delete()
        .in_("interviewID", ids)
        .execute()
    )

clearInterviewAllocations()