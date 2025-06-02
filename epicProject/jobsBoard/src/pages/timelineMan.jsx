
import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';

function TimePage() {
    const [algorithmEnabled, setAlgorithmEnabled] = useState(false);
    const [data, setData] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    const handleSwitch = (event) =>{
        const checked = event.target.checked;
        setAlgorithmEnabled(checked);

        if (!checked) {
            setAlgorithmEnabled(false);
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
            console.log('Algorithm ran successfully.')
            
            } else {
            console.log("Toggle not enabled, algorithm is not running");
            setFetchError('Failed to run algorithm.');
            setData(null);
            }
        }
    runAlgorithm();
}
, [algorithmEnabled]);

    return (
    <div className='home-main'>
     <h1>Ranking Control</h1>
     <h1>Allocation Control</h1>
     <h2>Interview Allocation Algorithm</h2>
     <p>Please insert QCA list for year group you want to run algorithm for. Results will display for students of that year group.</p>
     <label class="switch">
        <input id="switchBox" type="checkbox" checked={algorithmEnabled} onChange={handleSwitch}></input>
         <span class="slider round"></span>
    </label>
     <h2>Job Allocation Algorithm</h2>
     
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