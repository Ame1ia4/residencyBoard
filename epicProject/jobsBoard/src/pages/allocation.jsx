//needs to return only the users interview allocations
//needs to switch based on timeline management to return job Allocation of user

import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function AllocationPage(){
  const [interview, setInterview] = useState(null);
  const [fetchError, setFetchError] = useState(null)

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


    {/*fetch('http://127.0.0.1:5000/allocation')
    
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching:', error));
  }, []);
*/}
  
      useEffect(() => {
          fetchInterview();
      }, []);

  

  return( 
<div>
  <h2>Interview Allocation</h2>
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
</div>
)
};

export default AllocationPage;
