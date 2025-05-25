import React from 'react';
import Navbar from './components/navbar';
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
import Navbar2 from './components/navbarRP';
import Navbar3 from './components/navbarStaff';
import HomeStaffPage from './pages/homeStaff';


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

function SignedOut() {
  return <div className='signedOut'><h1>User not logged in!</h1></div>
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


function App() {  
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
  default:
    return <SignedOut component={component}/>
}
}

export default App;
