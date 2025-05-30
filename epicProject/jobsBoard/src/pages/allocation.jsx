import React, { useState } from 'react';
import { supabase } from '../SupabaseClient';

function AllocationPage(){

    const [flaskData, setFlaskData] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    const fetchFlaskData = async () => {

    };
    
    useEffect(() => {
    fetchFlaskData();
    }, []);

    return (
     
    );
};

export default AllocationPage;
