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

    studentsRankingCompanies = (
        supabase.table('RankingCompany')
        .select('rankNo,jobID,studentID')
        .execute()
    )

    studentsRankingCompanies_df = pd.DataFrame(studentsRankingCompanies.data)
    print(studentsRankingCompanies_df)

    stuff = {}
    for index, row in studentsRankingCompanies_df.iterrows():
        rankNo = row['rankNo']
        jobID =row['jobID']
        rankID = row['rankID']
        studentId = row['studentID']
        list = [studentId, rankID, jobID]
        stuff[rankID] = list

    print(stuff)
    return 'unga bunga'