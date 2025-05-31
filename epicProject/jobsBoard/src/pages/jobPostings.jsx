import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function JobPostPage(){
{/**setting values, making functions ex:fetchJobDetails which is called and then used in to print values in retir*/}
const [newJob, setNewJob] = useState({jobID: "", description: "", salary: "", requirements: "", staffID: "", companyID: "", jobTitle: ""});
const [fetchError, setFetchError] = useState(null)
const [jobDetails, setJobDetails] = useState(null)
const [userID, setUserID] = useState(null)

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
            .select('jobTitle,description,salary,requirements, residencyNo, jobID') 
            .eq('staffID', userID); 

        if (error) {
            setFetchError('Could not fetch job posts: ' + error.message);
            setJobDetails(null);
            console.error('Fetch error:', error);
        } else (data) => {
            setJobDetails(data);
            setFetchError(null);
        }
    };

    useEffect(() => {
        getUser();
    }, []); 
{/**^setsUser and checks there is one VS fetchData function - need separate useEffect sections v*/}
    useEffect(() => {
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
            staffID: userID, //debating do i put salary: salary stuff here too
        };

        const { error } = await supabase.from("JobDetails").insert(jobDataToInsert).single();

        if (error) {
            console.error("Error adding job:", error.message);
            setFetchError("Error adding job: " + error.message);
        } else {
            setNewJob({ jobID: "", description: "", salary: "", requirements: "", companyID: "", jobTitle: "" }); 
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
  <div style={{maxWidth: "600PX", margin: "0 auto", padding: "1rem"}}>

<h2>Job Post</h2>

<form  style={{marginBottom: "1rem"}} onSubmit={handleSubmit}>
    <input
    name='jobID'
    type='number' 
    placeholder='Job ID'
    value={newJob.jobID}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <input
    name='companyID'
    type='number' 
    placeholder='Company ID' 
    value={newJob.companyID}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <input
    name='staffID'
    type='number' 
    placeholder='Staff ID'
    value={newJob.staffID}
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
      <p>
        <p>Job Title: {jobDetails.jobTitle}</p>
        <p>Salary: {jobDetails.salary}</p>
        <p>Description: {jobDetails.description}</p>
        <p>Requirements: {jobDetails.requirements}</p>
        <p>Residency: {jobDetails.residencyNo}</p>
        <br></br>
      </p>
    ))}
  </div>
)}
</div>
</div>
    );
  };

export default JobPostPage;

//notes gotta change bigint type probs to varchar or uuid