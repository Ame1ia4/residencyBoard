from supabase import create_client, Client
import pandas as pd
import os
from loadCSVs import qca_list_download
from housekeeping import clearInterviewAllocations

def get_students_ordered(year_group):
    qca_path = qca_list_download(year_group)
    qca_df = pd.read_csv(qca_path)
    return qca_df["StudentID"].tolist()

def get_jobs_ranked(supabase, students_ordered):
    jobs_ranked = (
        supabase.table("RankingCompany")
        .select("rankID,rankNo,jobID,studentID")
        .in_("studentID", students_ordered)
        .execute()
    )
    return pd.DataFrame(jobs_ranked.data)

def get_job_details(supabase):
    jobDetails = (
        supabase.table("JobDetails")
        .select("jobID,positionsAvailable")
        .execute()
    )
    return pd.DataFrame(jobDetails.data)

def allocate_slots(jobs_ranked_df, jobDetails_df, students_ordered):

    interview_slots = {}
    for _,  row in jobDetails_df.iterrows():
        interview_slots[row["jobID"]] = int(row["positionsAvailable"]) * 3

    interview_results = {}
    remaining_slots = interview_slots.copy()
    student_interview_count = {}
    interview_list = []

    for student in students_ordered:
        student_rankings = jobs_ranked_df[jobs_ranked_df["studentID"] == student].sort_values("rankNo")
        interview_count = 0
        if student_rankings.empty:
            continue
        for _, ranking_row in student_rankings.iterrows():
            job_id = ranking_row["jobID"]
            if remaining_slots.get(job_id, 0) > 0:
                interview_results.setdefault(job_id, []).append(student)
                remaining_slots[job_id] -= 1
                interview_count += 1
                if interview_count >= 3:
                    break
        student_interview_count[student] = interview_count
    for job, students in interview_results.items():
        for student in students:
            interview_list.append({"jobID": job, "StudentID": student})
    return pd.DataFrame(interview_list)

def insert_interview_allocations(supabase, interview_df):
    for _, row in interview_df.iterrows():
        response = (supabase
            .table("InterviewAllocation")
            .insert({
                "jobID": str(row["jobID"]),
                "studentID": str(row["StudentID"])
            })
            .execute()
        )

def export_and_upload_rankings(supabase, students_ordered, year_group):
    ranking = (
        supabase.table("RankingCompany")
        .select("rankNo,jobID,studentID,rankNo")
        .in_("studentID", students_ordered)
        .execute()
    )
    ranking_df = pd.DataFrame(ranking.data)
    os.makedirs("csvRankingDownloads", exist_ok=True)
    csv_path = f"csvRankingDownloads/ranking_company_{year_group}.csv"
    ranking_df.to_csv(csv_path, index=False)
    with open(csv_path, "rb") as f:
        supabase.storage.from_("ranking-companies").upload(
            path=f"ranking_company_{year_group}.csv",
            file=f,
            file_options={"upsert": "true"}
        )

def delete_rankings_for_students(supabase, students_ordered):
    response = (
        supabase
            .table("RankingCompany")
            .delete()
            .in_("studentID", students_ordered)
            .execute()
    )

def allocate_interviews(year_group):
    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MTIzMywiZXhwIjoyMDYzNTU3MjMzfQ.pLxh4lCSOpIY6mp_Kr1VKB2Mm1YS80eAsd4OTn22LYk"
    supabase: Client = create_client(url, key)

    students_ordered = get_students_ordered(year_group)
    jobs_ranked_df = get_jobs_ranked(supabase, students_ordered)
    jobDetails_df = get_job_details(supabase)

    clearInterviewAllocations()
    interview_df = allocate_slots(jobs_ranked_df, jobDetails_df, students_ordered)
    insert_interview_allocations(supabase, interview_df)
    export_and_upload_rankings(supabase, students_ordered, year_group)
    delete_rankings_for_students(supabase, students_ordered)

    interview_list = interview_df.tolist()

    return interview_list()

allocate_interviews("2025")