import React from 'react';
import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function RankingPage(){

const [newRank, setNewRank] = useState({rankId: "", companyName: ""});
const [fetchError, setFetchError] = useState(null)
const [rank, setRank] = useState(null)

const handleSubmit = async (e) => {
        e.preventDefault();

    const RankToInsert = {
        ...newRank,
        rankID: newRank.rankID ? parseInt(newRank.rankId) : undefined,
        companyName: newRank.companyName ? parseInt(newRank.companyName) : undefined
    };

  
const {error} = await supabase.from("Ranking").insert(RankToInsert).single();

    if(error){
    console.error("Error adding job:", error.message);
   }
   else{
    setRank({rankId: "", companyName: ""});
   }
}

const handleChange = (e) => {
  const { name, value } = e.target;
  setNewJob(prev => ({
    ...prev,
    [name]: value
  }));
};

useEffect(() =>{
const fetchRank = async () => {
const{ data, error} = await supabase
  .from('Ranking')
  .select('rankID, companyName')

  if (error) {
    setFetchError('Could not fetch data')
    setRank(null)
    console.log(error)
  }
  if(data){
    setRank(data)
    setFetchError(null)
  }
}
    
fetchRank()
}, [])

return (
  <div style={{maxWidth: "600PX", margin: "0 auto", padding: "1rem"}}>

<h2>Rank your companies</h2>

<form  style={{marginBottom: "1rem"}} onSubmit={handleSubmit}>
    <input
    name='rankID'
    type='number' 
    placeholder='Rank Number'
    value={newRank.rankID}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <input
    name='companyName'
    type='text' 
    placeholder='Company Name' 
    value={newRank.companyName}
    onChange={handleChange}
    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
    />
    <button type='submit' style={{padding: "0.5rem 1rem"}}>
    Add Ranking
    </button>
</form>

<br></br>
<h2>Sorted Rankings</h2>
{fetchError && (<p>{fetchError}</p>)}
<div className='Card'>
{rank && (
  <div className='jobDetails'>
    {rank.map(rank => (
      <p>
        <p>Rank number: {rank.rankID}</p>
        <p>Company Name: {rank.companyName}</p>
        <br></br>
      </p>
    ))}
  </div>
)}
</div>
</div>
    );
  };

export default RankingPage;