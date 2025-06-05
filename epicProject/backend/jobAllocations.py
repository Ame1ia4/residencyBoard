import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd
from housekeeping import clearJobAllocation

def rpAllocate(yearGroup):
    # creates a supabase client
    load_dotenv(dotenv_path=".env")
    url: str = os.environ.get("VITE_SUPABASE_URL")
    key: str = os.environ.get("VITE_SUPABASE_KEY") 
    supabase: Client = create_client(url, key)

    # clear existing data in output
    clearJobAllocation(yearGroup)
    
    # make a global dictionary of student with their rankings
    gatherStudents(yearGroup,supabase)
    
    # make a dictionary of companies with their rankings
    gatherCompanies(yearGroup, supabase)
    
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
    allocate()

    # remove used information
    cleanUp(supabase)

    return jobParings


def assignStudent(rankNo,studentID,companyID,position):
    match rankNo:
        case 1:
            for position in companies[companyID].keys():
                if companies[companyID][position][1] == '':
                    companies[companyID][position][1] = studentID
            return
        case 2:
            for position in companies[companyID].keys():
                if companies[companyID][position][2] == '':
                    companies[companyID][position][2] = studentID
            return
        case 3:
            for position in companies[companyID].keys():
                if companies[companyID][position][3] == '':
                    companies[companyID][position][3] = studentID
            return


def assignJob(rankNo,studentID,jobID):
    match rankNo:
        case 1:
            students[studentID][1] = jobID
            return
        case 2:
            students[studentID][2] = jobID
            return
        case 3:
            students[studentID][3] = jobID
            return
        
def gatherStudents(yearGroup, supabase):
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
    
def gatherCompanies(yearGroup, supabase):
    companiesRankingStudents = (
        supabase.table('RankingStudent')
        .select('rankNo,jobID,studentID,jobID(positionsAvailable)')
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
        positions = row['jobID(positionsAvailable)']
        if(company in companies):
            assignStudent(rank,student,company,positions)
        else:
            companies[company] = {1:'',2:'',3:''}
            assignStudent(rank,student,company,positions)

def allocate():
    global jobParings
    jobParings = {}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][1]
                for studentKey in students:
                    studentCompany = students[studentKey][1]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][1]
                for studentKey in students:
                    studentCompany = students[studentKey][2]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][2]
                for studentKey in students:
                    studentCompany = students[studentKey][1]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][1]
                for studentKey in students:
                    studentCompany = students[studentKey][3]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][2]
                for studentKey in students:
                    studentCompany = students[studentKey][2]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][2]
                for studentKey in students:
                    studentCompany = students[studentKey][3]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][3]
                for studentKey in students:
                    studentCompany = students[studentKey][1]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][3]
                for studentKey in students:
                    studentCompany = students[studentKey][2]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}
    for companyKey in companies:
        if companyKey not in jobParings:
            jobParings[companyKey] = {}
        for positionKey in companies[companyKey]:
            if positionKey not in jobParings[companyKey]:
                companyStudent = companies[companyKey][positionKey][3]
                for studentKey in students:
                    studentCompany = students[studentKey][3]
                    if companyStudent == studentCompany:
                        jobParings[companyKey][positionKey] = {studentKey}

def cleanUp(supabase):
    listOfStudents = []
    # write these to the database
    for company in jobParings:
        for position in jobParings:
            companyid = company
            studentid = jobParings[company][position]
            finalAllocation = (
                supabase.table('JobAllocation')
                    .insert({
                        'studentID': studentid, 
                        'jobID': companyid,
                        'position': position
                        })
                    .execute()
            )
            listOfStudents.append(studentid)
    
    # delete used information
    deleteCompany = (
        supabase.table('RankingCompany')
            .delete()
            .in_('studentID', listOfStudents)
            .execute()
    )

    deleteStudent = (
        supabase.table('RankingStudent')
            .delete()
            .in_('studentID', listOfStudents)
            .execute()
    )