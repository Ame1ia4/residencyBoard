import Dropdown from '../components/dropMenu';
import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function RankingPage(){

    // State to hold the new rank data for submission
    // It should store companyStaffID, not companyName directly for insertion
    const [newRank, setNewRank] = useState({rankNo: "", companyStaffID: null}); // Changed companyName to companyStaffID
    const [fetchError, setFetchError] = useState(null);
    const [rankings, setRankings] = useState(null); // Renamed 'rank' to 'rankings' for clarity

    // State for the selected company in the dropdown (optional, but good for controlled component)
    const [selectedDropdownCompanyID, setSelectedDropdownCompanyID] = useState('');
    const [selectedDropdownCompanyName, setSelectedDropdownCompanyName] = useState(''); // This is for display in UI, not for DB insertion


    // This function receives companyStaffID and companyName from the Dropdown
    const handleCompanySelection = (companyStaffId, companyName) => {
        setSelectedDropdownCompanyID(companyStaffId); // Store the ID for the dropdown itself
        setSelectedDropdownCompanyName(companyName); // Store the Name for display (optional)

        // Update newRank with the companyStaffID, as this is what RankingCompany table needs
        setNewRank(prev => ({
            ...prev,
            companyStaffID: companyStaffId // Correctly set companyStaffID
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that a company has been selected (i.e., companyStaffID is not null)
        if (!newRank.companyStaffID) { // Check for companyStaffID now
            setFetchError("Please select a company from the dropdown.");
            return;
        }

        // Prepare the data for insertion
        const rankDataToInsert = {
            rankNo: newRank.rankNo ? parseInt(newRank.rankNo) : null, // Ensure rankNo is an integer or null
            companyStaffID: newRank.companyStaffID, // Correctly use companyStaffID
        };

        // Basic validation for rank number
        if (!rankDataToInsert.rankNo) {
             setFetchError("Please enter a valid rank number.");
            return;
        }

        // Insert into RankingCompany table
        const {error} = await supabase.from("RankingCompany").insert(rankDataToInsert).single();

        if(error){
            console.error("Error with inserting rank:", error.message);
            setFetchError("Error inserting rank: " + error.message);
        }
        else{
            // Clear form fields and update rankings after successful insert
            setNewRank({rankNo: "", companyStaffID: null});
            setSelectedDropdownCompanyID('');
            setSelectedDropdownCompanyName('');
            setFetchError(null);
            fetchRankings(); // Re-fetch rankings to update the list
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRank(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fetch rankings, joining to get the company name from ResidencyPartner
    const fetchRankings = async () => {
        // SELECT 'rankNo' and then traverse the foreign key relationship
        // 'companyStaffID' is the foreign key, and 'companyName' is the field in ResidencyPartner
        const { data, error } = await supabase
            .from('RankingCompany')
            .select('rankNo, companyStaffID(companyName)') // THIS IS THE CORRECT WAY TO GET COMPANY NAME VIA FK
            .order('rankNo', { ascending: true});

        if (error) {
            setFetchError('Could not fetch rankings data');
            setRankings(null);
            console.error("Fetch error in RankingPage:", error); // Use console.error for actual errors
        }
        if (data) {
            setRankings(data);
            setFetchError(null);
        }
    };

    useEffect(() => {
        fetchRankings(); // Initial fetch when component mounts
    }, []);

    return (
        <div className='rankForm'>

            <h2>Rank your companies</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name='rankNo'
                    type='number'
                    placeholder='Rank Number'
                    value={newRank.rankNo} // Use newRank.rankNo for value
                    onChange={handleChange}
                    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
                />
                <Dropdown
                    onSelectCompany={handleCompanySelection}
                    selectedCompanyStaffID={selectedDropdownCompanyID} // Pass the ID to the dropdown
                />
                <button type='submit' style={{padding: "0.5rem 1rem"}}>
                    Add Ranking
                </button>
            </form>

            <br></br>
            <h2 id='sortRank'>Sorted Rankings</h2>
            {fetchError && (<p style={{color: 'red'}}>{fetchError}</p>)} {/* Added style for error visibility */}
            <div className='Card'>
                {rankings && ( // Use 'rankings' state here
                    <div className='jobDetails'>
                        {rankings.map(rankingCompany => (
                            <p key={rankingCompany.rankNo + rankingCompany.companyStaffID.companyName}> {/* Add a unique key */}
                                {rankingCompany.rankNo} : {rankingCompany.companyStaffID ? rankingCompany.companyStaffID.companyName : 'N/A'}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RankingPage;