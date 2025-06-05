import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd

def rpAllocate(yearGroup):
    # creates a supabase client
    load_dotenv(dotenv_path=".env")
    url: str = os.environ.get("VITE_SUPABASE_URL")
    key: str = os.environ.get("VITE_SUPABASE_KEY") 
    supabase: Client = create_client(url, key)

    # make a dictionary of companies with their rankings
    studentsRankingCompanies = (
        supabase.table('RankingCompany')
        .select('rankNo,jobID,studentID')
        .eq('studentID(groupID)',yearGroup)
        .execute()
    )

    studentsRankingCompanies_df = pd.DataFrame(studentsRankingCompanies.data)
    global students
    students = {}
    for index, row in studentsRankingCompanies_df.iterrows():
        rank = row['rankNo']
        student = row['studentID']
        job = row['jobID']
        if(student in students):
            assignStudent(rank,student,job)
        else:
            students[student] = {1:'',2:'',3:''}
            assignStudent(rank,student,job)
    

    # make a dictionary of students with their rankings
    companiesRankingStudents = (
        supabase.table('RankingStudent')
        .select('rankNo,jobID,studentID')
        .eq('studentID(groupID)',yearGroup)
        .execute()
    )

    companiesRankingStudents_df = pd.DataFrame(companiesRankingStudents)
    global companies
    companies = {}
    for index, row in companiesRankingStudents_df.iterrows():
        company = row['jobID']
        rank = row['rankNo']
        student = row['studentID']
        if(company in companies):
            assignStudent(rank,student,company)
        else:
            companies[company] = {1:'',2:'',3:''}
            assignStudent(rank,student,company)

    """match companies with students using this plan
    company:student
    1:1
    1:2
    2:1
    1:3
    2:2
    2:3
    3:1
    3:2
    3:3
    """

    jobParings = {}
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][1]
            for studentKey in students:
                studentCompany = students[studentKey][1]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][1]
            for studentKey in students:
                studentCompany = students[studentKey][2]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][2]
            for studentKey in students:
                studentCompany = students[studentKey][1]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][1]
            for studentKey in students:
                studentCompany = students[studentKey][3]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][2]
            for studentKey in students:
                studentCompany = students[studentKey][2]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][2]
            for studentKey in students:
                studentCompany = students[studentKey][3]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][3]
            for studentKey in students:
                studentCompany = students[studentKey][1]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][3]
            for studentKey in students:
                studentCompany = students[studentKey][2]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey
    for companyKey in companies:
        if companyKey not in jobParings:
            companyStudent = companies[companyKey][3]
            for studentKey in students:
                studentCompany = students[studentKey][3]
                if companyStudent == studentCompany:
                    jobParings[companyKey] = studentKey

    # write these to the database
    for key in jobParings:
        companyid = key
        studentid = jobParings[key]
        finalAllocation = (
            supabase.table('finalAllocations')
                .insert({
                    'studentID': studentid, 
                    'jobID': companyid
                    })
                .execute()
        )
    return jobParings


def assignStudent(rankNo,studentID,companyID):
    match rankNo:
        case 1:
            companies.update({companyID:{1:studentID}})
            return
        case 2:
            companies.update({companyID:{2:studentID}})
            return
        case 3:
            companies.update({companyID:{3:studentID}})
            return


def assignJob(rankNo,studentID,jobID):
    match rankNo:
        case 1:
            students.update({studentID:{1:jobID}})
            return
        case 2:
            students.update({studentID:{2:jobID}})
            return
        case 3:
            students.update({studentID:{3:jobID}})
            return