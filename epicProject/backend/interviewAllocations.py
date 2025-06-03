from supabase import create_client, Client
import pandas as pd
from loadCSVs import qca_list_download

def allocate_interviews(year_group):

    # creates a supabase client
    url = "https://zahjfkggsyktdshmjmre.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODEyMzMsImV4cCI6MjA2MzU1NzIzM30.-7nvAbM7nzfHAs3qYwXivZjHMP6dfbX5k3LUByxk09A"
    supabase: Client = create_client(url, key)

    qca_path = qca_list_download(year_group)
    qca_df = pd.read_csv(qca_path)

    # convert qca order to list
    students_ordered = qca_df["StudentID"].tolist()
    #print(f"Students ordered by QCA: {students_ordered}")

    # copying all the rankings from the db
    companies_ranked = (
        supabase.table("RankingCompany")
                      .select("rankNo,companyStaffID,studentID")
                      .execute()
    )
    companies_ranked_df = pd.DataFrame(companies_ranked.data)
    #print(companies_ranked_df)

    # copying job details from the db
    jobDetails = (
        supabase.table("JobDetails")
        .select("jobID,"
            "companyStaffID,"
            "positionsAvailable")
        .execute()
    )
    jobDetails_df = pd.DataFrame(jobDetails.data)


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
    new_interview_id = 1

    # going through each student in QCA order
    for student in students_ordered:

        # finding and ordering that students ranked companies
        student_rankings = companies_ranked_df[companies_ranked_df["studentID"] == student]
        student_rankings = student_rankings.sort_values("rankNo")
        interview_count = 0

        # if student rankings are blank, skip
        student_row = companies_ranked_df[companies_ranked_df["studentID"] == student]
        if student_row.empty:
            continue

        
        for _, ranking_row in student_rankings.iterrows():
            companies_ranked_id = ranking_row["companyStaffID"] # current company id

            # find the jobID for the company
            job_row = jobDetails_df[jobDetails_df["companyStaffID"] == companies_ranked_id]
            if job_row.empty:
                continue
            job_id = job_row.iloc[0]["jobID"]

            # do a check to see if the company has slots left
            if remaining_slots.get(job_id, 0) > 0:
            
                # if the company is not in interview_results create a new list to hold students
                if job not in interview_results:
                    interview_results[job] = []
                interview_results[job].append(student)

                remaining_slots[job_id] -= 1
                interview_count += 1

                if interview_count >= 3:
                    break

        student_interview_count[student] = interview_count


    # creating a dataframe for the results to display
    interview_list = []
    id_count = 0
    for job, students in interview_results.items():
        for student in students:
            id_count += 90
            interview_list.append({
                "jobID": job, 
                "StudentID": student})

    interview_df = pd.DataFrame(interview_list)

    def print_full(x):
        pd.set_option('display.max_rows', len(x))
        print(x)
        pd.reset_option('display.max_rows')
    
    #print_full(interview_df)

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
        
        
        new_interview_id += 1

    return interview_list

#result = allocate_interviews("2025")
#print(result)