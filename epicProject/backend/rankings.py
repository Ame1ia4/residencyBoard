import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd
from loadCSVs import local_path, qca_path, company_path

qca_df = pd.read_csv(qca_path)
ranking_df = pd.read_csv(local_path)
company_df = pd.read_csv(company_path)

# convert qca order to list
students_ordered = qca_df["StudentName"].tolist()
#print(students_ordered)

# make a dict of how many interview slots a company has
interview_slots = {}
for index, row in company_df.iterrows():
    company = row["CompanyName"]
    slots = row["PositionsAvailable"]
    interview_slots[company] = slots * 3
#print(interview_slots)

# selecting students for interviews      
interview_results = {}
remaining_slots = interview_slots.copy()
student_interview_count = {}

# going through each student in QCA order
for student in students_ordered:
    interview_count = 0

    student_row = ranking_df[ranking_df["StudentName"] == student]
    if student_row.empty:
        continue

    # the student's ranked companies
    ranked_companies = []
    row = student_row.iloc[0]
    for i in range(1, len(student_row.columns)):
        column_name = f"Rank_{i}"
        company = row[column_name]
        ranked_companies.append(company)
    
    #print(f"Ranked companies for {student}: {ranked_companies}")

    for company in ranked_companies:
        # do a check to see if the company has slots left
        if remaining_slots.get(company, 0) > 0:
            
            # if the company is not in interview_results create a new list to hold students
            if company not in interview_results:
                interview_results[company] = []
            interview_results[company].append(student)

            remaining_slots[company] -= 1
            interview_count += 1

            if interview_count > 3:
                break

    student_interview_count[student] = interview_count



# creating a dataframe for the results to display
interview_list = []
for company, students in interview_results.items():
    for student in students:
        interview_list.append({"Company": company, "StudentName": student})

interview_df = pd.DataFrame(interview_list)
print(interview_df.head())