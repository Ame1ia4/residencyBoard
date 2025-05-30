import React, { useState } from 'react';
import { supabase } from '../SupabaseClient';

function AllocationPage(){

{
  const [allocation, setAllocation] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/')
    .then(response => response.json())

    if (error) {
            setFetchError('Could not fetch rankings data');
            setAllocation(null);
            console.log(error);
        }
        if (data) {
            setAllocation(json);
            setFetchError(null);
        }
  }, []);

  return(
  <div>
    {allocation ? JSON.stringify(data) : 'Loading...'}
    </div>
)

}
};

export default AllocationPage;
