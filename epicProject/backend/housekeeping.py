from supabase import create_client, Client
import os
from dotenv import load_dotenv

# creates a supabase client
url = "https://zahjfkggsyktdshmjmre.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODEyMzMsImV4cCI6MjA2MzU1NzIzM30.-7nvAbM7nzfHAs3qYwXivZjHMP6dfbX5k3LUByxk09A"
supabase: Client = create_client(url, key)


def clearInterviewAllocations():
    response = (
        supabase.table("InterviewAllocation")
       .select("interviewID")
        .execute()
    )

    ids = []

    for row in response.data:
        if "interviewID" in row:
            ids.append(row["interviewID"])


    response = (
        supabase.table("InterviewAllocation")
        .delete()
        .in_("interviewID", ids)
        .execute()
     )

clearInterviewAllocations()

def clearJobAllocation(year_group):
    response = (
        supabase.table('JobAllocation')
            .select('studentID, studentID(groupID)')
            .eq('studentID(groupID)',year_group)
            .execute()
    )

    ids = []

    for row in response.data:
        ids.append(row['allocationID'])

    response = (
        supabase.table('JobAllocation')
            .delete()
            .in_('allocationID',ids)
            .execute()
    )