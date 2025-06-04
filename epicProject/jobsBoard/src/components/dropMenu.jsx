import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';

const Dropdown = ({ onSelectCompany, selectedCompanyStaffID }) => { 
    const [fetchError, setFetchError] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [interviewAllocation, setInterviewAllocation] = useState(null);
    const [mode, setMode] = useState(null);

    useEffect(() => {
        async function fetchMode() {
            const { data, error } = await supabase
                .from('rankView')
                .select('rankViewNo')
                .eq('rankViewID', 0) 
                .single();

            if (error) {
                console.error("Error fetching rankViewNo (mode):", error.message);
                setFetchError("Could not fetch ranking mode.");
                setMode(null);
            } else if (data) {

                setMode(data.rankViewNo); 
                setFetchError(null);
            }
        }
        fetchMode();
    }, []);

    useEffect(() => {
        const fetchJobDetails = async () => {
            const { data, error } = await supabase
                .from('JobDetails')
                .select('jobID, jobTitle, residencyNo, companyStaffID, ResidencyPartner(companyName)')
                .order('jobTitle', { ascending: true });

            if (error) {
                setFetchError('Could not fetch job data for dropdown.');
                setJobDetails(null);
                console.error("Fetch error in jobDetails dropdown:", error);
            } else if (data) {
                setJobDetails(data);
                setFetchError(null);
            }
        };

        fetchJobDetails();
    }, []); 


    useEffect(() => {
        const fetchInterviewAllocation = async () => {
            const { data, error } = await supabase
                .from('InterviewAllocation')
                .select('interviewID, jobID, JobDetails(jobTitle, residencyNo, ResidencyPartner(companyName))') // MODIFIED HERE
                .order('JobDetails(jobTitle)', { ascending: true });

            if (error) {
                setFetchError('Could not fetch interview allocation data for dropdown.');
                setInterviewAllocation(null);
                console.error("Fetch error in interview allocation dropdown:", error);
            } else if (data) {
                setInterviewAllocation(data);
                setFetchError(null);
            }
        };

        fetchInterviewAllocation();
    }, []); 


    const handleDropChange = (e) => {
        const selectedValue = e.target.value;
        let companyName = '';
        let idToPass = selectedValue; 

        if (mode === '1') { 
            const selectedJob = jobDetails.find(job => job.companyStaffID === selectedValue);
            if (selectedJob) {
                companyName = selectedJob.ResidencyPartner.companyName;
              
            }
        } else if (mode === '2') {
            const selectedInterview = interviewAllocation.find(interview => interview.jobID.toString() === selectedValue); // Match by jobID
            if (selectedInterview && selectedInterview.JobDetails) {
                companyName = selectedInterview.JobDetails.ResidencyPartner.companyName;
            }
        }

        if (onSelectCompany && selectedValue) {
            onSelectCompany(idToPass, companyName);
        } else if (onSelectCompany) {
            onSelectCompany(null, '');
        }
    };


    if (fetchError) {
        return <div className="DropdownContainer"><p>{fetchError}</p></div>;
    }

    if (mode === null) {
        return (
            <div className='DropdownContainer'>
                <p>Loading ranking mode...</p>
            </div>
        );
    }

    //Students rank Jobs view
    if (mode === 1) {
        if (!jobDetails) {
            return <div className='DropdownContainer'><p>Loading jobs...</p></div>;
        }
        return (
            <div className='DropdownContainer'>
                <select
                    className="dropdown-button"
                    value={selectedCompanyStaffID} 
                    onChange={handleDropChange}
                >
                    <option value="" disabled>Select a job</option>
                    {jobDetails.map(job => (
                        <option
                            key={job.jobID} 
                            value={job.jobID}
                        >
                            {job.jobTitle} - {job.ResidencyPartner.companyName}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    //Round 1 - interview rankings - no data currently need to test tomorrow
    else if (mode === 2) {
        if (!interviewAllocation) {
            return <div className='DropdownContainer'><p>Loading interview allocations...</p></div>;
        }
        return (
            <div className='DropdownContainer'>
                <select
                    className="dropdown-button"
                    value={selectedCompanyStaffID} 
                    onChange={handleDropChange}
                >
                    <option value="" disabled>Select an interview allocation</option>
                    {interviewAllocation.map(interview => (
                        <option
                            key={interview.interviewID}
                            value={interview.jobID}
                        >
                            {interview.JobDetails.jobTitle} - {interview.JobDetails.ResidencyPartner.companyName} (Interview ID: {interview.interviewID})
                        </option>
                    ))}
                </select>
            </div>
        );
    }

  
    else if (mode === 3) { //mode 3 should be same as mode 1 - just ensure taken jobs are deleted so rankings can be done properly
        if (!jobDetails) {
            return <div className='DropdownContainer'><p>Loading jobs...</p></div>;
        }
        return (
            <div className='DropdownContainer'>
                <select
                    className="dropdown-button"
                    value={selectedCompanyStaffID} 
                    onChange={handleDropChange}
                >
                    <option value="" disabled>Select a job</option>
                    {jobDetails.map(job => (
                        <option
                            key={job.jobID} 
                            value={job.companyStaffID}
                        >
                            {job.jobTitle} - {job.ResidencyPartner.companyName}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className='DropdownContainer'>
            <p>Loading rankViewNo or invalid mode: {mode}</p>
        </div>
    );
};

export default Dropdown;