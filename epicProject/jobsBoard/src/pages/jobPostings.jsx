import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function JobPostPage(){
const [newJob, setNewJob] = useState({residencyNo : "", description: "", salary: "", requirements: "", jobTitle: "", positionsAvailable: ""});
const [fetchError, setFetchError] = useState(null)
const [jobDetails, setJobDetails] = useState(null)
const [userID, setUserID] = useState(null)


//let rls policies fix this???? or just check against
    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserID(user.id);
        } else {
            setUserID(null);
            setFetchError("To view/add job posts log in."); 
        }
    };

    const fetchJobDetails = async () => {
        if (!userID) { 
            setJobDetails(null);
            setFetchError("Login to view job posts."); 
            return;
        }
        
        const { data, error } = await supabase
            .from('JobDetails') 
            .select('jobTitle,description,salary,requirements, residencyNo, jobID, positionsAvailable') 
            .eq('companyStaffID', userID); 

        if (error) {
            setFetchError('Could not fetch job posts, job post may be pending approval: ' + error.message);
            setJobDetails(null);
            console.error('Fetch error:', error);
        } else {
            setJobDetails(data);
            setFetchError(null);
        }
    };

 
{/**^setsUser and checks there is one VS fetchData function - need separate useEffect sections v*/}
    useEffect(() => {
    getUser();
        if (userID) {
            fetchJobDetails();
        }
    }, [userID]); //rerun

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userID) {
            console.error("No user logged in. Can't add post.");
            setFetchError("Please log in to add job post.");
            return;
        }

        const jobDataToInsert = {
            ...newJob, 
            companyStaffID: userID, //debating do i put salary: salary stuff here too
        };

        const { error } = await supabase.from("Approval").insert(jobDataToInsert).single();

        if (error) {
            console.error("Error adding job:", error.message);
            setFetchError("Error adding job: " + error.message);
        } else {
            setNewJob({description: "", residencyNo: "", salary: "", requirements: "", jobTitle: "", positionsAvailable: ""}); 
            setFetchError(null); 
            fetchJobDetails();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewJob(prev => ({
            ...prev,
            [name]: value
        }));
    };

return (
  <div className='postForm'>

<h2>Job Post</h2>

<form style={{marginBottom: "1rem"}} onSubmit={handleSubmit}>
  <input
    name='residencyNo'
    type='text'
    placeholder='Residency No'
    value={newJob.residencyNo}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />  
    <input
    name='positionsAvailable'
    type='number' 
    placeholder='Positions Available'
    value={newJob.positionsAvailable}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <input
    name='requirements'
    type='text'
    placeholder='Requirements'
    value={newJob.requirements}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <input
    name='jobTitle'
    type='text'
    placeholder='Job Title'
    value={newJob.jobTitle}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <textarea
    name='description'
    placeholder='Description'
    value={newJob.description}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <input
    name='salary'
    type='number' 
    placeholder='Salary'
    value={newJob.salary}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <button type='submit' style={{padding: "0.5rem 1rem"}}>
    Add Job Post
    </button>
</form>

<br></br>
<h2>List of Posts</h2>
{fetchError && (<p>{fetchError}</p>)}
<div className='Card'>
{jobDetails && (
  <div className='jobDetails'>
    {jobDetails.map(jobDetails => (
      <div className='jobPostingDetails'>
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

export default JobPostPage;

//notes gotta change bigint type probs to varchar or uuid