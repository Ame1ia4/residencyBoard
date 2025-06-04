import DropdownMenu from '../components/dropdown1'; 
import Dropdown2 from '../components/dropMenuRP';
import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

function RankingPage(){

    const [newRank, setNewRank] = useState({rankNo: "", studentID: ""});
    const [fetchError, setFetchError] = useState(null)
    const [rank, setRank] = useState(null)

    const [studentDropID, setStudentDropID] = useState('');

    const handleStudentSelection = (studentID) => {
        setStudentDropID(studentID);
     

        setNewRank(prev => ({
            ...prev,
            studentID : studentID
        }));
    };

    const setNewRankNumbers = async (data) => {
        // get the list of entries following the new entry
        const { data: list, error: listError } = await supabase
            .from('RankingStudent')
            .select('rankNo, studentID') 
            .eq('companyID',user.id)
            .gte('rankNo', data.rankNo)
            .neq('studentID',data.studentID)
            .order('rankNo', { ascending: true}); 

        let index = 0;
        let rank = data.rankNo;
        while(index < list.length){
            const {error: deleteError} = await supabase.from('RankingStudent').delete().eq('companyID',user.id).eq('studentID',list[index].studentID);
            const {error: uploadError} = await supabase.from("RankingStudent").insert({ 
                companyID: user.id,
                studentID: list[index].studentID,
                rankNo: rank + 1}).single();


            if(deleteError || uploadError){
                if(deleteError){
                    console.log(deleteError.message);
                }
                if(uploadError){
                    console.log(uploadError.message);
                }
            }
            index++;
            rank++;
        }
        fetchRankings();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that a student has been selected (i.e., jobID is not null)
        if (!newRank.studentID) { // Check for jobID now
            setFetchError("Please select a student from the dropdown.");
            return;
        }

        const rankDataToInsert = {
            rankNo: newRank.rankNo ? parseInt(newRank.rankNo) : null, // Ensure rankNo is an integer or null
            companyID: user.id, // take user.id and user it for companyID
            studentID: newRank.studentID // get studentID from newRank
        };

        // Basic validation for rank number
        if (!rankDataToInsert.rankNo) {
             setFetchError("Please enter a valid rank number.");
            return;
        }

        // Delete old ranking and Insert into RankingCompany table

        const {error: presentError} = await supabase.from('RankingStudent').select('').eq('companyID', user.id).eq('studentID', newRank.studentID);
        if(!presentError){ 
            const {error: deleteError} = await supabase.from('RankingStudent').delete().eq('companyID',user.id).eq('studentID',newRank.studentID);

            if(deleteError){
                console.error("Error with deleting rank:", deleteError.message);
                setFetchError("Error deletting rank: " + deleteError.message);
            }
        }
        const {error: uploadError} = await supabase.from("RankingStudent").insert(rankDataToInsert).single();

        if(uploadError){
            console.error("Error with inserting rank:", uploadError.message);
            setFetchError("Error inserting rank: " + uploadError.message);
        }else{
            setNewRank({rankNo: ""}); 
            setStudentDropID(''); 
            setFetchError(null);
            setNewRankNumbers(rankDataToInsert);
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
            .from('RankingStudent')
            .select('rankNo, studentID, Student(firstName, lastName)')
            .order('rankNo', { ascending: true});

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
        <div className='rankForm'>

            <h2>Rank your students</h2>

            <form style={{marginBottom: "1rem"}} onSubmit={handleSubmit}>
                <input
                    name='rankNo'
                    type='number'
                    placeholder='Rank Number'
                    value={newRank.rankNo}
                    onChange={handleChange}
                    style={{width:"100%", marginBottom: "0.5rem", padding: "0.5rem"}}
                />
                <Dropdown2
                    onSelectStudent={handleStudentSelection}
                    selectedStudentId={studentDropID}
                />
                <button type='submit' style={{padding: "0.5rem 1rem"}}>
                    Add Ranking
                </button>
            </form>

            <br></br>
            <h2 id='sortRank'>Sorted Rankings</h2>
            {fetchError && (<p>{fetchError}</p>)} 
                {rank && (
                    <div className='jobDetails'>
                        {rank.map(rankingStudent => (
                            <p id='rankName'>
                                {rankingStudent.rankNo} : {rankingStudent.Student.firstName} {rankingStudent.Student.lastName}
                            </p>
                        ))}
                    </div>
                )}
            </div>
    );
};

export default RankingPage;