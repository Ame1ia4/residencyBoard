import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function AllocationPage() {
    const [interview, setInterview] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [job, setJob] = useState(null);
    const [fetchError2, setFetchError2] = useState(null);
    const [userID, setUserID] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true); // New loading state for user

    // Effect to get the user ID
    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error.message);
                setFetchError("Error fetching user. Please try again.");
                setUserID(null);
            } else if (user) {
                setUserID(user.id);
            } else {
                setUserID(null);
                setFetchError("To view/add allocations, please log in.");
            }
            setLoadingUser(false); // Set loading to false after user check
        };
        getUser();
    }, []); // Runs only once on component mount

    // Effect to fetch interview allocations once userID is available
    useEffect(() => {
        const fetchInterview = async () => {
            if (!userID) { // Don't fetch if userID is null (e.g., user not logged in yet)
                setInterview(null);
                setFetchError(null); // Clear previous errors if user is not logged in
                return;
            }

            const { data, error } = await supabase
                .from('InterviewAllocation')
                .select('studentID, interviewID, jobID, JobDetails(jobTitle)')
                .eq('studentID', userID)
                .order('interviewID', { ascending: true });

            if (error) {
                setFetchError('Could not fetch interview allocation data.');
                setInterview(null);
                console.error("Error fetching interview:", error.message);
            } else if (data) {
                setInterview(data);
                setFetchError(null);
            }
        };

        if (!loadingUser) { // Only attempt to fetch if user check is complete
            fetchInterview();
        }
    }, [userID, loadingUser]); // Re-run when userID changes or loadingUser state changes

    // Effect to fetch job allocations once userID is available
    useEffect(() => {
        const fetchJob = async () => {
            if (!userID) { // Don't fetch if userID is null
                setJob(null);
                setFetchError2(null); // Clear previous errors if user is not logged in
                return;
            }

            const { data, error } = await supabase
                .from('JobAllocation')
                .select('allocationID, studentID, JobDetails(jobTitle)')
                .eq('studentID', userID)
                .order('allocationID', { ascending: true });

            if (error) {
                setFetchError2('Could not fetch job allocation data. Data may currently be unavailable.');
                setJob(null);
                console.error("Error fetching job allocation:", error.message);
            } else if (data) {
                setJob(data);
                setFetchError2(null);
            }
        };

        if (!loadingUser) { // Only attempt to fetch if user check is complete
            fetchJob();
        }
    }, [userID, loadingUser]); // Re-run when userID changes or loadingUser state changes


    // Conditional rendering based on loading and data
    if (loadingUser) {
        return <p>Loading user information...</p>;
    }

    return (
        <div>
            <h2 className='interview'>Interview Allocation</h2>
            {fetchError && (<p style={{ color: 'red' }}>{fetchError}</p>)}
            <div className='Card'>
                {interview && interview.length > 0 ? (
                    <div className='jobDetails'>
                        {interview.map(interviewAllocation => (
                            <p key={interviewAllocation.interviewID}>
                                {interviewAllocation.studentID} : {interviewAllocation.JobDetails.jobTitle}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p>No interview allocations found for this student.</p>
                )}
            </div>

            <h2>Job Allocation</h2>
            {fetchError2 && (<p style={{ color: 'red' }}>{fetchError2}</p>)}
            <div className='Card'>
                {job && job.length > 0 ? (
                    <div className='jobDetails'>
                        {job.map(jobAllocation => (
                            <p key={jobAllocation.allocationID}>
                                {jobAllocation.studentID} : {jobAllocation.JobDetails.jobTitle}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p>No job allocations found for this student.</p>
                )}
            </div>
        </div>
    );
}

export default AllocationPage;