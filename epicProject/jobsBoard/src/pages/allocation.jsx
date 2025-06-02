//needs to return only the users interview allocations
//needs to switch based on timeline management to return job Allocation of user

import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function AllocationPage(){
  const [interview, setInterview] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [job, setJob] = useState(null);
  const [fetchError2, setFetchError2] = useState(null);

    const fetchInterview = async () => {
          const { data, error } = await supabase
              .from('InterviewAllocation')
              .select('studentID, interviewID, jobID, JobDetails(jobTitle)')
              .eq('studentID', '58494')
              .order('interviewID', { ascending: true});

          if (error) {
              setFetchError('Could not fetch rankings data');
              setInterview(null);
              console.log(error);
          }
          if (data) {
              setInterview(data);
              setFetchError(null);
          }
      };

      const fetchJob = async () => {
          const { data, error } = await supabase
              .from('JobAllocation')
              .select('allocationID, studentID, JobDetails(jobID)')
              .eq('studentID', '58494')
              .order('allocationID', { ascending: true});

          if (error) {
              setFetchError2('Could not fetch job allocation data. Data may currently be unavailable.');
              setJob(null);
              console.log(error);
          }
          if (data) {
              setJob(data);
              setFetchError2(null);
          }
      };

    {/*fetch('http://127.0.0.1:5000/allocation')
    
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching:', error));
  }, []);
*/}
  
      useEffect(() => {
          fetchInterview();
          fetchJob();
      }, []);

  

  return( 
<div>
  <h2 className='interview'>Interview Allocation</h2>
            {fetchError && (<p>{fetchError}</p>)} 
            <div className='Card'>
                {interview && (
                    <div className='jobDetails'>
                        {interview.map(InterviewAllocation => (
                            <p>
                                {InterviewAllocation.studentID} : {InterviewAllocation.JobDetails.jobTitle}
                            </p>
                        ))}
                    </div>
                )}
            </div>

    <h2>Job Allocation</h2>
    {fetchError2 && (<p>{fetchError2}</p>)} 
            <div className='Card'>
                {job && (
                    <div className='jobDetails'>
                        {job.map(JobAllocation => (
                            <p>
                                {JobAllocation.studentID} : {JobAllocation.JobDetails.jobTitle}
                            </p>
                        ))}
                    </div>
                )}
            </div>
</div>
)
};

export default AllocationPage;
