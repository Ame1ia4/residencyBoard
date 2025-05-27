import { supabase } from '../SupabaseClient';
import { useState } from 'react';

function JobPostPage(){

    const [newJob, setNewJob] = useState({jobID: "", description: "", salary: "", requirements: "", staffID: "", companyID: "", jobTitle: ""});


const handleSubmit = async (e) => {
        e.preventDefault();

    const jobDataToInsert = {
        ...newJob,
        jobID: newJob.jobID ? parseInt(newJob.jobID) : undefined, // Only parse if present
        companyID: newJob.companyID ? parseInt(newJob.companyID) : undefined,
        staffID: newJob.staffID ? parseInt(newJob.staffID) : undefined,
        salary: newJob.salary ? parseFloat(newJob.salary) : undefined,
    };

  


    const {error} = await supabase.from("Job Details").insert(jobDataToInsert).single();

    if(error){
    console.error("Error adding job:", error.message);
   }
   else{
    setNewJob({jobID: "", description: "", salary: "", requirements: "", staffID: "", companyID: "", jobTitle: ""});
   }
}

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

<h2>List of Posts</h2>


</div>
    );
};

export default JobPostPage;