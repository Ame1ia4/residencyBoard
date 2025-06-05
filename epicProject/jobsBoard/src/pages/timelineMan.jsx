
import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';

function TimePage() {
    const [algorithmEnabled, setAlgorithmEnabled] = useState(false);
    const [algorithm2Enabled, setAlgorithm2Enabled] = useState(false);
    const [data, setData] = useState(null); //redundant??
    const [data2, setData2] = useState(null); //redundant??? - don't need data really just need to run algorithm
    const [fetchError, setFetchError] = useState(null);
    const [view, setView] = useState({rankViewNo: ""});
    const [switch1, setSwitch1] = useState(true);
    const [switch2, setSwitch2] = useState(false);
    const [switch3, setSwitch3] = useState(false);



    const [rankingUpdateError, setRankingUpdateError] = useState(null);

    const updateRankingView = async (view) => {
        setRankingUpdateError(null); 
        try {
            const { data, error } = await supabase
                .from('rankView')
                .update({ rankViewNo: view }) 
                .eq('rankViewID', 0) 
                .select(); 

            if (error) {
                console.error("Error updating rankView:", error.message);
                setRankingUpdateError("Failed to set ranking view: " + error.message);
            } else {
                console.log(`Ranking view updated to: ${view}`, data);
            }
        } catch (error) {
            console.error("Unexpected error during ranking view update:", error);
            setRankingUpdateError("An unexpected error occurred.");
        }
    };


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

    const handleSwitch4 = (event3) =>{
        const checked = event3.target.checked;
        setSwitch1(checked);
        setSwitch2(!checked);
        setSwitch3(!checked);

        if(checked){
            updateRankingView('1');
        alert("Student can now see and rank all companies in round 0.");
        }   
        else {
            setSwitch1(false);
            console.log('Toggle is not checked.')
        }
    }

    const handleSwitch5 = (event3) =>{
        const checked = event3.target.checked;
        setSwitch1(!checked);
        setSwitch2(checked);
        setSwitch3(!checked);
        
        if(checked){
        updateRankingView('2');
        alert("Student can now see and rank all companies in round 1.");
        }   
        else {
            setSwitch2(false);
            console.log('Toggle is not checked.')
        }
    }

    const handleSwitch6 = (event3) =>{
        const checked = event3.target.checked;
        setSwitch1(!checked);
        setSwitch2(!checked);
        setSwitch3(checked);

        if(checked){
        updateRankingView('3');
        alert("Student can now see and rank all companies in round 2.");
        }   
        else {
            setSwitch3(false);
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
            alert('Algorithm ran successfully.')
            
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
}
, [algorithmEnabled]);

useEffect(()=>{
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
        runAlgorithm2();
}
, [algorithm2Enabled]);

    return (
    <div className='home-time'>
     <h1>Ranking Control</h1>
            {rankingUpdateError && <p style={{ color: 'red' }}>{rankingUpdateError}</p>}
        <p>Round 0: Let students rank all companies</p>
        <label class="switch">
        <input id="switchBox" type="checkbox" checked={switch1} onChange={handleSwitch4} style={{}}></input>
         <span class="slider round"></span>
            </label>
            <p>Round 1: Let students rank companies they have interviewed with.</p>
         <label class="switch">
        <input id="switchBox" type="checkbox" checked={switch2} onChange={handleSwitch5}></input>
         <span class="slider round"></span>
            </label>
            <p>Round 2: Let students rank remaining companies</p>
        <label class="switch">
        <input id="switchBox" type="checkbox" checked={switch3} onChange={handleSwitch6}></input>
         <span class="slider round"></span>
        </label>
     <h1 id='alloCon'>Allocation Control</h1>
     <h2 id='jobAllocate'>Interview Allocation Algorithm</h2>
     <p id='intAllo'>Please ensure QCA list has been provided on 'Students' page for year group you want to run algorithm for. Results will display for students of that year group.</p>
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