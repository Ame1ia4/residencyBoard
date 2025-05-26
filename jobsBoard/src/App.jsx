import React, { useEffect, useState } from 'react';

import RankingPage from './pages/ranking'
import HomePage from './pages/home';
import DetailsPage from './pages/details';
import AllocationPage from './pages/allocation';
import HomeRPPage from './pages/homeRP';
import AllocationRPPage from './pages/allocationRP';
import JobPostPage from './pages/jobPostings';
import RankingRPPage from './pages/rankingRP';
import StudentsPage from './pages/students';
import TimePage from './pages/timelineMan';
import RPSPage from './pages/rps';
import HomeStaffPage from './pages/homeStaff';
import LoginPage from './pages/loginPage';

import LoginForm from './components/loginForm';
import Navbar from './components/navbar';
import Navbar2 from './components/navbarRP';
import Navbar3 from './components/navbarStaff';

import { supabase } from './SupabaseClient';


function Student({component}) {
  return(
  <div>
    <div className='header'>
    <h1 className='Overall-title'>ISE Job Board</h1>
    </div>  
    <Navbar/>
    {component}
    </div>
  );
}

function Staff({component}) {
  return(
    <div>
      <div className='header'>
      <h1 className='Overall-title'>ISE Job Board</h1>
      </div>  
      <Navbar3/>
      {component}
      </div>
    );
}

function RP({component}) {
  return(
    <div>
      <div className='header'>
      <h1 className='Overall-title'>ISE Job Board</h1>
      </div>  
      <Navbar2/>
      {component}
      </div>
    );
}

function renderPage(){
  let component
  switch (window.location.pathname){
    case "/":
      component = <HomePage/>
      break
    case "/ranking":
      component = <RankingPage/>
      break
    case "/details":
      component = <DetailsPage/>
      break
    case "/allocation":
      component = <AllocationPage/>
      break
      case "/allocationRP":
      component = <AllocationRPPage/>
      break
    case "/homeRP":
      component = <HomeRPPage/>
      break
    case "/jobPostings":
      component = <JobPostPage/>
      break
    case "/rankingRP":
      component = <RankingRPPage/>
      break
    case "/homeStaff":
      component = <HomeStaffPage/>
      break
    case "/students":
      component = <StudentsPage/>
      break
    case "/rps":
      component = <RPSPage/>
      break
    case "/timelineMan":
      component = <TimePage/>
      break
  }

  const userPermission = 'student'
  switch (userPermission) {
    case 'student':
      return <Student component={component}/>
    case 'rp':
      return <RP component={component}/>
    case 'staff':
      return <Staff component={component}/>
  }
}
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
          {renderPage()}
          <h1>Welcome, {user.email}</h1>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  )
}

export default App;
