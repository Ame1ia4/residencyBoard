from supabase import create_client, Client
# creates a supabase client
url: str = "https://zahjfkggsyktdshmjmre.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaGpma2dnc3lrdGRzaG1qbXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODEyMzMsImV4cCI6MjA2MzU1NzIzM30.-7nvAbM7nzfHAs3qYwXivZjHMP6dfbX5k3LUByxk09A"
supabase: Client = create_client(url, key)


def clearInterviewAllocations():
    x = 0
    ids = []
    for i in range(162):
        x += 90
        ids.append(x)
    response = (
        supabase.table("InterviewAllocation")
        .delete()
        .in_("interviewID", ids)
        .execute()
    )

clearInterviewAllocations()