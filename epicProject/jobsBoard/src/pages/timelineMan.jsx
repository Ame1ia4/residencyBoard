
import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';

function TimePage() {
    const [algorithmEnabled, setAlgorithmEnabled] = useState(false);
    const [algorithm2Enabled, setAlgorithm2Enabled] = useState(false);
    const [data, setData] = useState(null);
    const [data2, setData2] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    const handleSwitch = (event) =>{
        const checked = event.target.checked;
        setAlgorithmEnabled(checked);

        if (!checked) {
            setAlgorithmEnabled(false);
            console.log('Toggle is not checked.')
        }
    }

    const handleSwitch2 = (event2) => {
        const checked = event2.target.checked;
        setAlgorithm2Enabled(checked);

         if (!checked) {
            setAlgorithm2Enabled(false);
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
            alert('Algorithm ran successfully');
            
            } else {
            console.log("Toggle not enabled, algorithm is not running");
            setFetchError('Failed to run algorithm.');
            setData(null);
            }
        }

        const runAlgorithm2 = async () => {
            if(algorithm2Enabled){
            const response2 = await fetch('http://127.0.0.1:5000/rpAllocation')
            
            if (!response2.ok)
            console.error('Response error from fetch.')

            const json2 = await response2.json();
            setData2(json2);
            console.log('Algorithm ran successfully.')
            alert('Algorithm ran successfully');
            
            } else {
            console.log("Toggle not enabled, algorithm is not running");
            setFetchError('Failed to run algorithm.');
            setData2(null);
            }
        }



    runAlgorithm();
    runAlgorithm2();
}
, [algorithmEnabled, algorithm2Enabled]);

    return (
    <div className='home-main'>
     <h1>Ranking Control</h1>
    



     <h1>Allocation Control</h1>
     <h2 id='interviewAllocate'>Interview Allocation Algorithm</h2>
     <p>Please insert QCA list for year group you want to run algorithm for. Results will display for students of that year group.</p>
     <label class="switch">
        <p id='off'>Off/On</p>
        <input id="switchBox" type="checkbox" checked={algorithmEnabled} onChange={handleSwitch}></input>
         <span class="slider round"></span>
    </label>
     <h2 id='jobAllocate'>Job Allocation Algorithm</h2>
     <p>Result of running this algorithm will appear in student and residency partner allocation pages.</p>
<label class="switch">
        <p id='off'>Off/On</p>
        <input id="switchBox" type="checkbox" checked={algorithm2Enabled} onChange={handleSwitch2}></input>
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