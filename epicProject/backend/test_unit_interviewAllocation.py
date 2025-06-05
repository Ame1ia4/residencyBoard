from interviewAllocations import allocate_slots
import pandas as pd

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