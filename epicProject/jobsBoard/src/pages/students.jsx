import React, {useState} from 'react';
import { supabase } from '../SupabaseClient';

function StudentsPage() {

    const [yearGroup, setYearGroup] = useState('');
    const [csvFile, setCsvFile] = useState(null);
    const [error, setError] = useState(null);

    // uploading the csv file to the supabase bucket
    const fileUpload = async () => {
        if (!csvFile || !yearGroup) {
            setError('Please select a file and year group.');
            return;
        }

        const renamedFileName = `qca_list_${yearGroup}.csv`;

        const { uploadError } = await supabase
            .storage
            .from('qca-list')
            .upload(renamedFileName, csvFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Error uploading file: ', uploadError.message);
            setError('Error uploading file: ' + uploadError.message); 
        }
        else {
            setError(null);
            alert('File uploaded successfully!');
        }
    };

    return (
        <div className="home-students">
            <h2>Upload QCA Lists</h2>

            <label>Year Group:</label>
            <input
                type="text"
                placeholder="Year of Graduation"
                value={yearGroup}
                onChange={(e) => setYearGroup(e.target.value)}    
            />

            <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
            />

            <button onClick={fileUpload}>Upload CSV</button>
        </div>
    );
}

export default StudentsPage;
