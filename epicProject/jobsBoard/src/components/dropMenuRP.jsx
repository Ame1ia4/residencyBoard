import { supabase } from '../SupabaseClient';
import { useEffect, useState } from 'react';

const Dropdown2 = ({ onSelectStudent, selectedStudentId }) => {

    const [fetchError, setFetchError] = useState(null);
    const [interviewAllocation, setInterviewAllocation] = useState(null);

    useEffect(() => {
        const fetchInterviewAllocation = async () => {
            const { data, error } = await supabase
                .from('InterviewAllocation')
                .select('interviewID,studentID, Student(groupID,firstName, lastName)')
                .order('Student(groupID)', { ascending: true});

            if (error) {
                setFetchError('Could not fetch job data for dropdown.');
                setInterviewAllocation(null);
                console.error("Fetch error in dropdown:", error);
            } else if (data) {
                setInterviewAllocation(data);
                setFetchError(null);
            }
        };

        fetchInterviewAllocation();
    }, []);

    const handleDropChange = (e) => {
        const selectedStudentId = e.target.value;
        const selectedInterview = interviewAllocation.find(interview => interview.studentID.toString() === selectedStudentId);

        if (selectedInterview && onSelectStudent) {
            onSelectStudent(selectedStudentId, selectedInterview.Student.firstName, selectedInterview.Student.lastName);
        }
    };

    return (
        <div className='DropdownContainer'>
            {fetchError && (<p>{fetchError}</p>)}
            {interviewAllocation && (
                <select
                    className="dropdown-button"
                    value={selectedStudentId}
                    onChange={handleDropChange}
                >
                    <option value="" disabled>Select a student</option>
                    {interviewAllocation.map(interview => (
                        <option
                            key={interview.interviewID}
                            value={interview.studentID}
                        >
                            R{interview.Student.groupID} - {interview.Student.firstName} {interview.Student.lastName}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default Dropdown2;