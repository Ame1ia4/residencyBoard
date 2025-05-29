import React, { useEffect, useState } from 'react';

import LoginPage from './pages/loginPage';
import RenderPage from './components/renderPage'

import { supabase } from './SupabaseClient';


function App() {  
  const [user, setUser] = useState(null); // initialise user to null

  // check the current session to see is a user logged in
  // update user
  useEffect(() =>{
    supabase.auth.getSession().then(({data: {session}}) => {
      setUser(session?.user ?? null);
    });

    const {data: subscription} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe;
  }, []);

  return(
    <div>
      {user ? (
        <>
          <RenderPage  user={user}/>
          {/*<h1>Welcome, {user.email}</h1>*/}
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  )
}

export default App;
