from supabase import create_client, Client
import pandas as pd
from loadCSVs import ranking_path, qca_list_download
from dotenv import load_dotenv
import os

def allocate_interviews(year_group):

    # creates a supabase client
    load_dotenv(dotenv_path='.env')
    url = os.getenv("VITE_SUPABASE_URL")
    key = os.getenv("VITE_SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    qca_path = qca_list_download(year_group)
    qca_df = pd.read_csv(qca_path)
    ranking_df = pd.read_csv(ranking_path)

    # convert qca order to list
    students_ordered = qca_df["StudentID"].tolist()

    jobDetails = (
        supabase.table("JobDetails")
        .select("jobID,companyID,positionsAvailable")
        .execute()
    )
    jobDetails_df = pd.DataFrame(jobDetails.data)


    # make a dict of how many interview slots a company has
    interview_slots = {}
    for index, row in jobDetails_df.iterrows():
        job = int(row["jobID"])
        positions = int(row["positionsAvailable"])
        interview_slots[job] = positions * 3

    # selecting students for interviews
    interview_results = {}
    remaining_slots = interview_slots.copy()
    student_interview_count = {}

    # going through each student in QCA order
    for student in students_ordered:
        interview_count = 0

        student_row = ranking_df[ranking_df["StudentID"] == student]
        if student_row.empty:
            continue

        # the student's ranked companies
        ranked_jobs = []
        row = student_row.iloc[0]
        for i in range(1, len(student_row.columns)):
            column_name = f"Rank_{i}"
            job = int(row[column_name])
            ranked_jobs.append(job)
    
        #print(f"Ranked companies for {student}: {ranked_jobs}")

        for job in ranked_jobs:
            # do a check to see if the company has slots left
            if remaining_slots.get(job, 0) > 0:
            
                # if the company is not in interview_results create a new list to hold students
                if job not in interview_results:
                    interview_results[job] = []
                interview_results[job].append(student)

                remaining_slots[job] -= 1
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
            interview_list.append({"Interview ID" : id_count ,
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
        interview_id = int(row["Interview ID"])

    max_id_response = supabase.table("InterviewAllocation").select("interviewID").order("interviewID", desc=True).limit(1).execute()
    if max_id_response.data and max_id_response.data[0]:
        latest_id = max_id_response.data[0]['interviewID']
        new_interview_id = latest_id + 1
    #counter for interview ids - stops duplication issues
    else:
        new_interview_id = 1 # Starts from 1 if table empty

    response = (
        supabase.table("InterviewAllocation")
        .insert({
            "interviewID": new_interview_id,
            "jobID": job,
            "studentID": student_id
        })
        .execute()
        )

    return interview_list