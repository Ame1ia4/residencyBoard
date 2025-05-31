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


    const handleSubmit = async (e) => {
        e.preventDefault();


        const rankDataToInsert = {
            ...newRank,
            rankID: newRank.rankNo ? parseInt(newRank.rankNo) : undefined,
            studentID: newRank.studentID ? parseInt(newRank.studentID) : undefined,
        };

        const {error} = await supabase.from("RankingStudent").insert(rankDataToInsert).single();

        if(error){
            console.error("Error with inserting rank:", error.message);
            setFetchError("Error inserting rank: " + error.message);
        }
        else{
            setNewRank({rankNo: ""}); 
            setStudentDropID(''); 
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
        <div style={{maxWidth: "600PX", margin: "0 auto", padding: "1rem"}}>

            <h2>Rank your companies</h2>

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
            <h2>Sorted Rankings</h2>
            {fetchError && (<p>{fetchError}</p>)} 
            <div className='Card'>
                {rank && (
                    <div className='jobDetails'>
                        {rank.map(rankingStudent => (
                            <p>
                                {rankingStudent.rankNo} : {rankingStudent.Student.firstName} {rankingStudent.Student.lastName}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RankingPage;