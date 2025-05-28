import React, { useEffect, useState } from 'react';

import RankingPage from '../pages/ranking';
import HomePage from '../pages/home';
import DetailsPage from '../pages/details';
import AllocationPage from '../pages/allocation';
import HomeRPPage from '../pages/homeRP';
import AllocationRPPage from '../pages/allocationRP';
import JobPostPage from '../pages/jobPostings';
import RankingRPPage from '../pages/rankingRP';
import StudentsPage from '../pages/students';
import TimePage from '../pages/timelineMan';
import RPSPage from '../pages/rps';
import HomeStaffPage from '../pages/homeStaff';
import Residency1Page from '../pages/r1';
import Residency2Page from '../pages/r2';

import Navbar from './navbar';
import Navbar2 from './navbarRP';
import Navbar3 from './navbarStaff';

import { supabase } from '../SupabaseClient';

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

function RenderPage({user}){
    const [role, setRole] = useState(null);

    useEffect(() => {
        async function fetchRole() {
        const { data, error } = await supabase
            .from('User')
            .select('Role')
            .eq('Email', user.email)
            .single();

        if (!error && data) {
            setRole(data.Role);
        } else {
            setRole(null); // handle error or no role found case
        }
        }
        fetchRole();
    }, [user.email]);

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
        case "/r1":
        component = <Residency1Page/>
        break  
        case "/r2":
        component = <Residency2Page/>
        break 
    }

    switch (role) {
        case 'student':
        return <Student component={component}/>
        case 'residency':
        return <RP component={component}/>
        case 'staff':
        return <Staff component={component}/>
    }
}

export default RenderPage;