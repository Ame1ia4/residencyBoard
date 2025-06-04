from supabase import create_client, Client
import pandas as pd
import os
from loadCSVs import qca_list_download
from housekeeping import clearInterviewAllocations

def allocate_interviews(year_group):

    # creates a supabase client
    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MTIzMywiZXhwIjoyMDYzNTU3MjMzfQ.pLxh4lCSOpIY6mp_Kr1VKB2Mm1YS80eAsd4OTn22LYk"
    supabase: Client = create_client(url, key)

    qca_path = qca_list_download(year_group)
    qca_df = pd.read_csv(qca_path)

    # convert qca order to list
    students_ordered = qca_df["StudentID"].tolist()
    #print(f"Students ordered by QCA: {students_ordered}")

    # copying all the rankings from the db
    jobs_ranked = (
        supabase.table("RankingCompany")
                      .select("rankNo,jobID,studentID")
                      .execute()
    )
    jobs_ranked_df = pd.DataFrame(jobs_ranked.data)
    print(jobs_ranked_df)

    # copying job details from the db
    jobDetails = (
        supabase.table("JobDetails")
        .select("jobID,positionsAvailable")
        .execute()
    )
    jobDetails_df = pd.DataFrame(jobDetails.data)

    clearInterviewAllocations()

    # make a dict of how many interview slots a company has
    interview_slots = {}
    for index, row in jobDetails_df.iterrows():
        job = row["jobID"]
        positions = int(row["positionsAvailable"])
        interview_slots[job] = positions * 3

    # selecting students for interviews
    interview_results = {}
    remaining_slots = interview_slots.copy()
    student_interview_count = {}

    interview_list = []

    # going through each student in QCA order
    for student in students_ordered:

        # finding and ordering that students ranked companies
        student_rankings = jobs_ranked_df[jobs_ranked_df["studentID"] == student]
        student_rankings = student_rankings.sort_values("rankNo")
        interview_count = 0

        # if student rankings are blank, skip
        if student_rankings.empty:
            continue
        
        for _, ranking_row in student_rankings.iterrows():

            job_id = ranking_row["jobID"] # current job id

            # do a check to see if the company has slots left
            if remaining_slots.get(job_id, 0) > 0:
            
                # if the job is not in interview_results create a new list to hold students
                if job_id not in interview_results:
                    interview_results[job_id] = []
                interview_results[job_id].append(student)

                remaining_slots[job_id] -= 1
                interview_count += 1

                if interview_count >= 3:
                    break

        student_interview_count[student] = interview_count


    # creating a dataframe for the results to display
    interview_list = []
    for job, students in interview_results.items():
        for student in students:
            interview_list.append({
                "jobID": job, 
                "StudentID": student})

    interview_df = pd.DataFrame(interview_list)
    #print(interview_df)

    for index, row in interview_df.iterrows():
        job = str(row["jobID"])
        student_id = str(row["StudentID"])

        response = (
            supabase.table("InterviewAllocation")
            .insert({
                "jobID": job,
                "studentID": student_id
        })
            .execute()
        )

    def print_full(x):
        pd.set_option('display.max_rows', len(x))
        print(x)
        pd.reset_option('display.max_rows')

    ranking = (
        supabase.table("RankingCompany")
        .select("rankID,rankNo,studentID,jobID")
        .execute()
    )

    ranking_df = pd.DataFrame(ranking.data)

    download_directory = "csvRankingDownloads"
    os.makedirs(download_directory, exist_ok=True)

    os.path.join(download_directory, f"ranking_company_{year_group}.csv")

    ranking_df.to_csv(f"csvRankingDownloads/ranking_company_{year_group}.csv", index=False)

    with open(f"csvRankingDownloads/ranking_company_{year_group}.csv", "rb") as f:
        response = (
            supabase.storage
            .from_("ranking-companies")
            .upload(
                file=f,
                path=f"ranking_company_{year_group}.csv",
                file_options={"upsert": "true"}
        )
    )

    
    ranking_company_ids = (
        supabase.table("RankingCompany")
        .select("rankID")
        .execute()
    )

    ranking_company_ids_list = [row["rankID"] for row in ranking_company_ids.data]

    response = (
        supabase.table("RankingCompany")
        .delete()
        .in_("rankID", ranking_company_ids_list)
        .execute()
    )

    return interview_list

#result = allocate_interviews("2025")
#print(result)