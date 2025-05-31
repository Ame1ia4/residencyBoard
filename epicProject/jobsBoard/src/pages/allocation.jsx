import React, { useState, useEffect } from 'react';

function AllocationPage(){

{
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/allocation')
    
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching:', error));
  }, []);

  return( 
  <div>
    {data ? JSON.stringify(data) : 'Loading...'}
  </div>
)

}
};

export default AllocationPage;
