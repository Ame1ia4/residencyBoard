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

    # make a dictionary of companies with their rankings
    studentsRankingCompanies = (
        supabase.table('RankingCompany')
        .select('rankNo,jobID(companyStaffID),studentID')
        .execute()
    )

    studentsRankingCompanies_df = pd.DataFrame(studentsRankingCompanies.data)
    print(studentsRankingCompanies_df)
    
    companiesRankingStudents = (
        supabase.table('RankingStudent')
        .select('rankNo,companyID,studentID')
        .execute()
    )

    companiesRankingStudents_df = pd.DataFrame(companiesRankingStudents)
    global companies
    companies = {}
    for index, row in companiesRankingStudents_df.iterrows():
        company = row['companyID']
        rank = row['rankNo']
        student = row['studentID']
        if(company in companies):
            assignStudent(rank,student,company)
        else:
            companies[company] = {'rank1':'','rank2':'','rank3':''}
            assignStudent(rank,student,company)

    
    return companies

def assignStudent(rankNo,studentID,companyID):
    match rankNo:
        case 1:
            companies.update({companyID:{'rank1':studentID}})
            return
        case 2:
            companies.update({companyID:{'rank2':studentID}})
            return
        case 3:
            companies.update({companyID:{'rank3':studentID}})
            return
    