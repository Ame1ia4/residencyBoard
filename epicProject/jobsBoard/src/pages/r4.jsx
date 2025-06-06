import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function Residency4Page(){

const [fetchError, setFetchError] = useState(null)
const [jobDetails, setJobDetails] = useState(null)

    useEffect(() =>{
    const fetchJobDetails1 = async () => {
    const{ data, error} = await supabase
      .from('JobDetails')
      .select('*')
      .eq('residencyNo', '4')
    
      if (error) {
        setFetchError('Could not fetch data')
        setJobDetails(null)
        console.log(error)
      }
      if(data){
        setJobDetails(data)
        setFetchError(null)
      }
    }
        
    fetchJobDetails1()
    }, [])

    return (
<div>
<h2>Available R4 Positions</h2>
{fetchError && (<p>{fetchError}</p>)}
<div className='Card'>
{jobDetails && (
  <div className='jobDetails'>
    {jobDetails.map(jobDetails => (
        <div className='studentJobDetails'>
        <p>Job Title: {jobDetails.jobTitle}</p>
        <p>Salary: {jobDetails.salary}</p>
        <p>Description: {jobDetails.description}</p>
        <p>Requirements: {jobDetails.requirements}</p>
        <p>Residency: {jobDetails.residencyNo}</p>
        <br></br>
        </div>
    ))}
  </div>
)}
</div>
</div>
    );
};

export default Residency4Page;
