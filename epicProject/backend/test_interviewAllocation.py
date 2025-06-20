from interviewAllocations import get_students_ordered
from interviewAllocations import get_jobs_ranked
from interviewAllocations import get_job_details
from interviewAllocations import allocate_slots
from interviewAllocations import insert_interview_allocations
from interviewAllocations import export_and_upload_rankings
from interviewAllocations import delete_rankings_for_students

from supabase import create_client, Client
import pandas as pd
import os

year_group = "2026"

def test_get_jobs_ranked(): # integration test

    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MTIzMywiZXhwIjoyMDYzNTU3MjMzfQ.pLxh4lCSOpIY6mp_Kr1VKB2Mm1YS80eAsd4OTn22LYk"
    supabase: Client = create_client(url, key)

    students_ordered = get_students_ordered(year_group)
    testing_path = "testingFiles\\rankingCompany.csv"

    ranked_jobs_df = pd.read_csv(testing_path)
    ranked_jobs_results = get_jobs_ranked(supabase, students_ordered)

    ranked_jobs_df = ranked_jobs_df.sort_values(by="rankID").reset_index(drop=True)
    ranked_jobs_results = ranked_jobs_results.sort_values(by="rankID").reset_index(drop=True)

    assert ranked_jobs_results.equals(ranked_jobs_df)

#test_get_jobs_ranked()
#print("Passed")

def test_get_job_details(): # integration test
    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MTIzMywiZXhwIjoyMDYzNTU3MjMzfQ.pLxh4lCSOpIY6mp_Kr1VKB2Mm1YS80eAsd4OTn22LYk"
    supabase: Client = create_client(url, key)

    testing_path = "testingFiles\\jobDetails.csv"
    job_details_df = pd.read_csv(testing_path)
    job_details_results = get_job_details(supabase)

    job_details_df = job_details_df.sort_values(by="jobID").reset_index(drop=True)
    job_details_results = job_details_results.sort_values(by="jobID").reset_index(drop=True)

    assert job_details_results.equals(job_details_df)

#test_get_job_details()
#print("Passed")

def test_allocate_slots(): # integration test
    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MTIzMywiZXhwIjoyMDYzNTU3MjMzfQ.pLxh4lCSOpIY6mp_Kr1VKB2Mm1YS80eAsd4OTn22LYk"
    supabase: Client = create_client(url, key)

    students_ordered = get_students_ordered(year_group)
    jobs_ranked_df = get_jobs_ranked(supabase, students_ordered)
    job_details_df = get_job_details(supabase)

    testing_path = "testingFiles\\allocatedInterviews.csv"
    expected_interview_df = pd.read_csv(testing_path)

    allocated_interviews_df = allocate_slots(jobs_ranked_df, job_details_df, students_ordered)

    allocated_interviews_df = allocated_interviews_df.sort_values(by=["jobID","studentID"]).reset_index(drop=True)
    expected_interview_df = expected_interview_df.sort_values(by=["jobID","studentID"]).reset_index(drop=True)

    assert allocated_interviews_df.equals(expected_interview_df)

#test_allocate_slots()
#print("Passed")

def test_insert_interview_allocations(): # integration test
    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MTIzMywiZXhwIjoyMDYzNTU3MjMzfQ.pLxh4lCSOpIY6mp_Kr1VKB2Mm1YS80eAsd4OTn22LYk"
    supabase: Client = create_client(url, key)

    students_ordered = get_students_ordered(year_group)
    jobs_ranked_df = get_jobs_ranked(supabase, students_ordered)
    job_details_df = get_job_details(supabase)
    allocated_interviews_df = allocate_slots(jobs_ranked_df, job_details_df, students_ordered)

    insert_interview_allocations(supabase, allocated_interviews_df)

    testing_path = "testingFiles\\finalInterviewAllocation.csv"
    reading = (
        supabase.table("InterviewAllocation")
        .select("jobID,studentID")
        .execute()
    )

    results_df = pd.DataFrame(reading.data)
    expected_df = pd.read_csv(testing_path)

    results_df = results_df.sort_values(by=["jobID","studentID"]).reset_index(drop=True)
    expected_df = expected_df.sort_values(by=["jobID","studentID"]).reset_index(drop=True)

    assert results_df.equals(expected_df)

#test_insert_interview_allocations()
#print("Passed")


def test_export_and_upload_rankings(): # integration test
    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MTIzMywiZXhwIjoyMDYzNTU3MjMzfQ.pLxh4lCSOpIY6mp_Kr1VKB2Mm1YS80eAsd4OTn22LYk"
    supabase: Client = create_client(url, key)

    students_ordered = get_students_ordered(year_group)
    export_and_upload_rankings(supabase, students_ordered, year_group)

    file_list = supabase.storage.from_("ranking-companies").list()
    filenames = [f["name"] for f in file_list]
    assert f"ranking_company_{year_group}.csv" in filenames, "File was not uploaded"

    expected_file_path = f"csvRankingDownloads/ranking_company_{year_group}.csv"
    assert os.path.exists(expected_file_path), "CSV file was not created."

#test_export_and_upload_rankings()
#print("Passed")

def test_delete_rankings_for_students(): # integration test
    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MTIzMywiZXhwIjoyMDYzNTU3MjMzfQ.pLxh4lCSOpIY6mp_Kr1VKB2Mm1YS80eAsd4OTn22LYk"
    supabase: Client = create_client(url, key)

    students_ordered = get_students_ordered(year_group)

    delete_rankings_for_students(supabase, students_ordered)

    response = (
        supabase
        .table("RankingCompany")
        .select("*")
        .in_("studentID", students_ordered)
        .execute()
    )
    assert len(response.data) == 0
#test_delete_rankings_for_students()
#print("Passed")