import React, { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';

function AllocationPage(){

{
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/')
    
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching:', error));
  }, []);

  return( <div>{data ? JSON.stringify(data) : 'Loading...'}</div>
)

}
};

export default AllocationPage;
