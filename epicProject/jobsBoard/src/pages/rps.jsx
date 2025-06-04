import React, { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';

function RPSPage() {
    
    const [rankingList, setRankingList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const[jobList, setJobList] = useState([]);

    // holds whatever company the user picks from the dropdown
    const [selectedCompanyID, setSelectedCompanyID] = useState('');
    const[selectedJobID, setSelectedJobID] = useState('');

    const [rankError, setRankError] = useState(null);

    const [pending, setPending] = useState(null);
    const [pendingError, setPendingError] = useState(null);
    const [userID, setUserID] = useState(null)

useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserID(user.id);
            } else {
                setUserID(null);
                setPendingError("Please log in to view pending job posts.");
            }
        };
        getUser();
    }, []); // Runs once on mount to get the authenticated user

    // Function to fetch pending job posts from the 'Approval' table
    // Defined at the top level of the component
    const fetchPending = async () => {
        // Only attempt to fetch if a user is logged in
        if (!userID) {
            setPending(null);
            setPendingError("Please log in to view job posts pending approval.");
            return;
        }

        const { data, error } = await supabase
            .from('Approval')
            .select('*, ResidencyPartner(companyName)');

        if (error) {
            setPendingError('Could not fetch job posts, job post may be pending approval: ' + error.message);
            setPending(null);
            console.error('Fetch error (pending jobs):', error);
        } else {
            setPending(data);
            setPendingError(null);
        }
    };

    // Effect to trigger fetchPendingJobs when authUserID changes
    // This useEffect is also at the top level
    useEffect(() => {
        fetchPending();
    }, [userID]); // Re-run when authUserID changes (i.e., user logs in/out)

    
    const handleApproval = async(approving) =>{
        setPendingError(null);

        const {error: insertError} = await supabase.from('JobDetails')
        .insert({residencyNo: approving.residencyNo, description: approving.description,
        salary: approving.salary, requirements: approving.requirements, jobTitle: approving.jobTitle, 
        positionsAvailable: approving.positionsAvailable, 
        companyStaffID: approving.companyStaffID});

        if(insertError){
            console.error("Error inserting to JobDetails from Approval: ", insertError.message);
            setPendingError("Failed to approve.")
        }
    

    const{error: deletionError} = await supabase.from('Approval')
    .delete()
    .eq('jobID',approving.jobID );

    if(deletionError){
        console.error('Error deleting values from Approval', deletionError.message);
        setPendingError('Job approved, but deletion failed.');
    }
    else{
        console.log('Job approval and deletion complete:', approving);
        fetchPending();
    }
    };

    const handleRejection = async(rejecting) =>{
        setPendingError(null);

        const{error: deletionError} = await supabase.from('Approval')
    .delete()
    .eq('jobID',rejecting.jobID );

    if(deletionError){
        console.error('Error deleting values from Approval', deletionError.message);
        setPendingError('Job rejected, but deletion failed.');
    }
    else{
        console.log('Job rejection and deletion complete:', rejecting);
        fetchPending();
    }
    };



    useEffect(
        function () {
        async function loadData() {

        const rankings = await supabase
            .from('RankingStudent2')
            .select('jobID,studentID,rankNo');
    
        const companies = await supabase
            .from('ResidencyPartner')
            .select('companyStaffID, companyName');

        const students = await supabase
            .from('Student')
            .select('studentID, firstName, lastName');
        
        const jobs = await supabase
            .from('JobDetails')
            .select('jobID,jobTitle,companyStaffID');

        if (rankings.error) {
            console.error('Rankings error:', rankings.error);
        }

        if (companies.error) {
            console.error('Companies error:', companies.error);
        }

        if (students.error) {
            console.error('Students error:', students.error);
        }

        if (jobs.error) {
            console.error('Jobs error:', jobs.error);
        }

        if (rankings.error || companies.error || students.error || jobs.error) {
            setRankError('Failed to load data.');
            return;
        }

        setRankingList(rankings.data);
        setCompanyList(companies.data);
        setStudentList(students.data);
        setJobList(jobs.data);
        setRankError(null);
        }

        loadData();
    }, []);

    // getting the name of the selected company
    let selectedCompanyName = 'Unknown';
    for (let i = 0; i < companyList.length; i++) {
        if (companyList[i].companyStaffID === selectedCompanyID) {
        selectedCompanyName = companyList[i].companyName;
        break;
        }
    }

    console.log('companyList:', companyList);
    console.log('rankingList:', rankingList);
    console.log('selectedCompanyID:', selectedCompanyID);

    // filtering the rankings 
    const studentRankings = 

        rankingList
            .filter(function (row) {
                return String(row.jobID) === String(selectedJobID);
            })
            .sort(function (a, b) {
                return a.rankNo - b.rankNo; 
    });

    // function to get full name from student id
    function getStudentName(studentID) {
        for (let i = 0; i < studentList.length; i++) {
            if (studentList[i].studentID === studentID) {
                return studentList[i].firstName + ' ' + studentList[i].lastName;
            }
        }
        return 'Unknown';
    }

    console.log('selectedJobID:', selectedJobID);
    console.log('studentRankings:', studentRankings);

    return (
        <div className="home-rps">
            <h2>Residency Partner Rankings</h2>

            {/* Display Pending Job Posts for Approval */}
            <h3>Job Posts for Approval</h3>
            {pendingError && (<p style={{ color: 'red' }}>{pendingError}</p>)} {/* Use pendingJobsError */}
            <div className='Card'>
                {/* FIX: Ensure pendingJobs is not null and has items before mapping */}
                {pending && pending.length > 0 ? (
                    <div className='pending-jobs-list'> {/* Changed class name for clarity */}
                        {pending.map(job => ( // Renamed 'pending' to 'job' for clarity in map
                            <div key={job.jobID} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9', color: '#333' }}>
                                <p>Job Title: {job.jobTitle}</p>
                                <p>Company Staff ID: {job.companyStaffID}</p>
                                <p>Company Name: {job.ResidencyPartner.companyName}</p>
                                <p>Description: {job.description}</p>
                                <p>Salary: {job.salary}</p>
                                <p>Requirements: {job.requirements}</p>
                                <p> Residency No: {job.residencyNo}</p>
                                <p>Positions Available: {job.positionsAvailable}</p>
                                <div style={{ marginTop: '10px' }}>
                                    <button
                                        onClick={() => handleApproval(job)}
                                        style={{ marginRight: '10px', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleRejection(job)}
                                        style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Display message if no pending jobs and no error
                    !pendingError && <p>No pending job posts for approval.</p>
                )}
            </div>


            {rankError && <p>{rankError}</p>} {/* Use rankingDataError */}

            {/* dropdown to pick a company */}
            {companyList.length > 0 && (
                <div className='rpsDiv' style={{ marginBottom: '1rem' }}>
                    <label>Select a company: </label>
                    <select
                        value={selectedCompanyID}
                        onChange={function (e) {
                            setSelectedCompanyID(e.target.value);
                            setSelectedJobID('');
                        }}
                    >
                        <option value="">-- Select a Company --</option>
                        {companyList.map(function (company) {
                            return (
                                <option key={company.companyStaffID} value={company.companyStaffID}>
                                    {company.companyName}
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            {/* dropdown to pick a job */}
            {selectedCompanyID && jobList.length > 0 && (
                <div className='rpsDiv' style={{marginBottom: '1rem'}}>
                    <label>Select a job: </label>
                    <select
                        value={selectedJobID}
                        onChange={function (e) {
                            setSelectedJobID(e.target.value);
                        }}
                    >
                        <option value="">-- Select a Job --</option>
                        {jobList
                            .filter(job => job.companyStaffID === selectedCompanyID)
                            .map(function (job) {
                                return (
                                    <option key={job.jobID} value={job.jobID}>
                                        {job.jobTitle}
                                    </option>
                                );
                            })}
                    </select>
                </div>
            )}

            {selectedJobID && studentRankings.length > 0 && (
                <div>
                    <h3>{selectedCompanyName}'s Rankings</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <table id="rpsTable" border="1" cellPadding="6">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentRankings.map(function (row, index) {
                                    return (
                                        <tr key={index}>
                                            <td>{row.rankNo}</td>
                                            <td>{row.studentID}</td>
                                            <td>{getStudentName(row.studentID)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedJobID && studentRankings.length === 0 && (
                <p>No students ranked for this job.</p>
            )}
        </div>
    );
}

export default RPSPage;


