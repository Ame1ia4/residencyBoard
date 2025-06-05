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

def test_get_students_ordered(): # integration test
    data = {
        "studentID": ["7eebe849-85e1-4196-b7ed-7919fa350f00",
                        "9bbce3a5-dc56-4b0f-9b68-6ff7799960a4",
                         "5ee089e9-e8d6-407b-8944-b38c098283fc",
                           "de58fb69-86b5-4bfd-ae13-1210f588b994"],
        "Rank" : [1, 2, 3, 4]
    }
    df = pd.DataFrame(data)
    assert get_students_ordered(year_group) == df["studentID"].tolist()

#test_get_students_ordered()
#print("Passed")

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

    remaining = (
        supabase.table("RankingCompany")
        .select("*")
        .in_("studentID", students_ordered)
        .execute()
    )
    assert len(remaining.data) == 0    

#test_delete_rankings_for_students()
#print("Passed")

def test_unittest_allocate_interviews(): # unt test
    job_data = [
        {"jobID": "1", "positionsAvailable": 1},
        {"jobID": "2", "positionsAvailable": 1},
        {"jobID": "3", "positionsAvailable": 1},
        {"jobID": "4", "positionsAvailable": 2}
    ]
    job_details_df = pd.DataFrame(job_data)

    rankings = [
        {"studentID": "Sarah", "jobID": "1", "rankNo": 1},
        {"studentID": "Sarah", "jobID": "2", "rankNo": 2},
        {"studentID": "Sarah", "jobID": "3", "rankNo": 3},
        {"studentID": "Sarah", "jobID": "4", "rankNo": 4},
        {"studentID": "Ciarán", "jobID": "2", "rankNo": 1},
        {"studentID": "Ciarán", "jobID": "1", "rankNo": 2},
        {"studentID": "Ciarán", "jobID": "4", "rankNo": 3},
        {"studentID": "Ciarán", "jobID": "3", "rankNo": 4},
        {"studentID": "Amelia", "jobID": "4", "rankNo": 1},
        {"studentID": "Amelia", "jobID": "3", "rankNo": 2},
        {"studentID": "Amelia", "jobID": "2", "rankNo": 3},
        {"studentID": "Amelia", "jobID": "1", "rankNo": 4},
        {"studentID": "Conor", "jobID": "2", "rankNo": 2},
        {"studentID": "Conor", "jobID": "1", "rankNo": 1},
        {"studentID": "Conor", "jobID": "3", "rankNo": 3},
        {"studentID": "Conor", "jobID": "4", "rankNo": 4}
    ]
    rankings_df = pd.DataFrame(rankings)

    students_ordered = ["Sarah", "Ciarán", "Amelia", "Conor"]

    result = allocate_slots(rankings_df, job_details_df, students_ordered)

    interview_results = result[["studentID", "jobID"]].values.tolist()
    interview_results.sort()
    
    expected_results = [
        ["Sarah", "1"],
        ["Sarah", "2"],
        ["Sarah", "3"],
        ["Ciarán", "2"],
        ["Ciarán", "1"],
        ["Ciarán", "4"],
        ["Amelia", "4"],
        ["Amelia", "3"],
        ["Amelia", "2"],
        ["Conor", "1"],
        ["Conor", "3"],
        ["Conor", "4"]
    ]
    expected_results.sort()

    assert interview_results == expected_results

#test_unittest_allocate_interviews()
#print("Passed")