
import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';

function TimePage() {
    const [algorithmEnabled, setAlgorithmEnabled] = useState(false);
    const [algorithm2Enabled, setAlgorithm2Enabled] = useState(false);
    const [data, setData] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    const handleSwitch = (event) =>{
        const checked = event.target.checked;
        setAlgorithmEnabled(checked);

        if (!checked) {
            setAlgorithmEnabled(null);
            console.log('Toggle is not checked.')
        }
    }

    const handleSwitch2 = (event) =>{
        const checked2 = event.target.checked2;
        setAlgorithm2Enabled(checked2);

        if (!checked2) {
            setAlgorithm2Enabled(null);
            console.log('Toggle is not checked.')
        }
    }

useEffect(() =>{
const runAlgorithm = async () =>{
if(algorithmEnabled){
     const response = await fetch('http://127.0.0.1:5000/timelineMan')
      
    if (!response.ok)
        console.error('Response error from fetch.')
     const json = await response.json();
     setData(json);
     console.log('Interview algorithm ran successfully.')
   } else {
     console.log("Toggle not enabled, interview algorithm is not running");
     setFetchError('Failed to run algorithm.');
     setData(null);
   }
}
runAlgorithm();
}
, [algorithmEnabled]);

useEffect(() =>{
const runAlgorithm2 = async () =>{
if(algorithm2Enabled){
     const response = await fetch('http://127.0.0.1:5000/timelineMan')
      
    if (!response.ok)
        console.error('Response error from fetch.')
     const json = await response.json();
     setData(json);
     console.log('Job algorithm ran successfully.')
   } else {
     console.log("Toggle not enabled, job algorithm is not running");
     setFetchError('Failed to run algorithm.');
     setData(null);
   }
}
runAlgorithm2();
}
, [algorithm2Enabled]);

    return (
    <div className='home-main'>
     <h1>Ranking Control</h1>
    <p>Control the student view of the ranking page.</p>
    <p>Initial Company rankings.</p>
    <p>Round 1: Rank companies from interviews.</p>
    <p>Round 2: Rankings</p>

     <h1>Allocation Control</h1>
     <h2>Interview Allocation Algorithm</h2>
     <p>Please insert QCA list for year group you want to run algorithm for. Results will display for students of that year group.</p>
     <label class="switch">
        <input id="switchBox" type="checkbox" checked={algorithmEnabled} onChange={handleSwitch}></input>
         <span class="slider round"></span>
    </label>
     <h2>Job Allocation Algorithm</h2>
     <p>Please enable toggle to run algorithm for job allocation. Results will display for students and residency partners on their allocation page.</p>
     <label class="switch">
        <input id="switchBox" type="checkbox" checked2={algorithm2Enabled} onChange={handleSwitch2}></input>
         <span class="slider round"></span>
    </label>
    </div>
    );
};

export default TimePage;

//control ranking - changes ranking page for all Rs
// control allocation - changes allocation page results
//
//
//
//