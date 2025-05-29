import DropdownMenu from '../components/dropdown1'; // Assuming this is another dropdown you might use elsewhere
import Dropdown from '../components/dropMenu'; // This is the component we're modifying
import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function RankingPage(){

    const [newRank, setNewRank] = useState({rankID: "", companyName: ""});
    const [fetchError, setFetchError] = useState(null)
    const [rank, setRank] = useState(null)

    const [companyDropID, setCompanyDropdID] = useState('');
    const [companyDropName, setCompanyDropName] = useState('');


    const handleCompanySelection = (companyId, companyName) => {
        setCompanyDropdID(companyId);
        setCompanyDropdID(companyName);

        setNewRank(prev => ({
            ...prev,
            companyName: companyName
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newRank.companyName) {
            setFetchError("Please select a company from the dropdown.");
            return; 
        }

        const rankDataToInsert = {
            ...newRank,
            rankID: newRank.rankID ? parseInt(newRank.rankID) : undefined,
           
        };

        const {error} = await supabase.from("Ranking").insert(rankDataToInsert).single();

        if(error){
            console.error("Error with inserting rank:", error.message);
            setFetchError("Error inserting rank: " + error.message);
        }
        else{
            setNewRank({rankID: "", companyName: ""}); 
            setCompanyDropdID(''); 
            setCompanyDropName('');
            setFetchError(null);
            fetchRank();
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRank(prev => ({
            ...prev,
            [name]: value
        }));
    };

  
    const fetchRank = async () => {
        const { data, error } = await supabase
            .from('Ranking')
            .select('rankID, companyName')
            .order('rankID', { ascending: true});

        if (error) {
            setFetchError('Could not fetch rankings data');
            setRank(null);
            console.log(error);
        }
        if (data) {
            setRank(data);
            setFetchError(null);
        }
    };

    useEffect(() => {
        fetchRank();
    }, []);

    return (
        <div style={{maxWidth: "600PX", margin: "0 auto", padding: "1rem"}}>

            <h2>Rank your companies</h2>

            <form style={{marginBottom: "1rem"}} onSubmit={handleSubmit}>
                <input
                    name='rankID'
                    type='number'
                    placeholder='Rank Number'
                    value={newRank.rankID}
                    onChange={handleChange}
                    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
                />
                <Dropdown
                    onSelectCompany={handleCompanySelection}
                    selectedCompanyId={companyDropID}
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
                        {rank.map(ranking => (
                            <p>
                                {ranking.rankID} : {ranking.companyName}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RankingPage;