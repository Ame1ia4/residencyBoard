import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

const Dropdown = ({ onSelectCompany, selectedCompanyId }) => {

    const [fetchError, setFetchError] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            const { data, error } = await supabase
                .from('JobDetails')
                .select('jobID, jobTitle,residencyNo, companyID, ResidencyPartner(companyName)')
                .order('jobTitle', { ascending: true});

            if (error) {
                setFetchError('Could not fetch job data for dropdown.');
                setJobDetails(null);
                console.error("Fetch error in dropdown:", error);
            } else if (data) {
                setJobDetails(data);
                setFetchError(null);
            }
        };

        fetchJobDetails();
    }, []);

    const handleDropChange = (e) => {
        const selectedCompanyId = e.target.value;
        const selectedJob = jobDetails.find(job => job.companyID.toString() === selectedCompanyId);

        if (selectedJob && onSelectCompany) {
            onSelectCompany(selectedCompanyId, selectedJob.ResidencyPartner.companyName);
        }
    };

    return (
        <div className='DropdownContainer'>
            {fetchError && (<p>{fetchError}</p>)}
            {jobDetails && (
                <select
                    className="dropdown-button"
                    value={selectedCompanyId}
                    onChange={handleDropChange}
                >
                    <option value="" disabled>Select a job</option>
                    {jobDetails.map(job => (
                        <option
                            key={job.jobID}
                            value={job.companyID}
                        >
                            {job.jobTitle} - {job.ResidencyPartner.companyName}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default Dropdown;