import React, { useState } from "react";
import {supabase} from '../SupabaseClient';

export default function LoginForm(){
    // variables for input values initialised to empty strings
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [cname, setCname] = useState('');
    const [role, setRole] = useState('');
    const [studentId, setSID] = useState('');
    const [yrGroup, setYrGroup] = useState('');

    const [isLogin, setIsLogin] = useState(null);
    // called by form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents page from auto reloading and form from auto submitting

        if (isLogin){
            const {error} = await supabase.auth.signInWithPassword({email, password});
            if(error) alert(error.message);
            else alert('Login Successful');
        }else{
            const {error} = await supabase.auth.signUp({email, password});

            if(error){ 
                alert(error.message);
            }else{ 
                alert('Check your email for conformation');

                // if succesful add data to the database
                switch(role){
                    case 'student':
                        const {error: userStudentError} = await supabase.from("User").insert({
                            Role: 'student',
                            Email: email
                        })
                        console.log('student');
                        const {error: studentError} = await supabase.from('Student').insert({
                            firstName: fname,
                            lastName: lname,
                            studentNo: studentId,
                            password: password,
                            groupID: yrGroup,
                            studentEmail: email
                        }) 
                        console.log("user");
                        if(studentError || userStudentError) alert(`Error inserting user data: ${studentError?.message || userStudentError?.message}`);
                    case 'staff':
                        const {staffError} = await supabase.from('Staff').insert({
                            staffEmail: email,
                            staffFirstName: fname,
                            staffLastName: lname,
                            staffPassword: password
                        })
                        const {userStaffError} = await supabase.from("User").insert({
                            Role: 'staff',
                            Email: email
                        })
                        if(staffError || userStaffError) alert('Error inserting user data: ',staffError.message);
                    case 'residency':
                        const {residencyError} = await supabase.from('Residency Partner').insert({
                            companyName: cname,
                            companyEmail: email,
                            companyPassword: password
                        })
                        const {userResidencyError} = await supabase.from("User").insert({
                            Role: 'residency',
                            Email: email
                        })
                        if(residencyError || userResidencyError) alert('Error inserting user data: ',staffError.message);
                        
                }
                
            }
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            {!isLogin && (
                <>
                    <p>Please select your Role.</p>

                    <label>
                        <input
                            type="radio"
                            name="role"
                            value='student'
                            checked={role === 'student'}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        Student
                        <input
                            type="radio"
                            name="role"
                            value='staff'
                            checked={role === 'staff'}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        Staff
                        <input
                            type="radio"
                            name="role"
                            value='residency'
                            checked={role === 'residency'}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        Residency Partner
                    </label>
                </>
            )}
            <br></br>
            <br></br>
            
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)} // updates email variable to inputted string
                required
            />
            <br></br>

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)} // updates password variable to inputted string
                required
            />
            <br></br>

            {!isLogin && (
                <>
                    {role !== 'residency' ? (
                        <>
                            <input
                            type="text"
                            placeholder="First Name"
                            value={fname}
                            onChange={e => setFname(e.target.value)} // updates firstname variable to inputted string
                            required
                            />
                            <br></br>

                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lname}
                                onChange={e => setLname(e.target.value)} // updates lastname variable to inputted string
                                required
                            />
                            <br></br>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Company Name"
                                value={cname}
                                onChange={e => setCname(e.target.value)} // updates companyname variable to inputted string
                                required
                            />
                            <br></br>
                        </>
                    )}

                    {role === 'student' && (
                        <>
                            <input
                                type="text"
                                placeholder="Student Id"
                                value={studentId}
                                onChange={e => setSID(e.target.value)} // updates student id variable to inputted string
                                required
                            />
                            <br></br>

                            <input
                                type="text"
                                placeholder="Year Group"
                                value={yrGroup}
                                onChange={e => setYrGroup(e.target.value)} // updates student year group variable to inputted string
                                required
                            />
                            <br></br>
                        </>
                    )}
                </>
            )}
            
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            <p
                onClick={() => setIsLogin(!isLogin)}
                style={{cursor: 'pointer',color: 'blue'}}
            >
                {isLogin ? 'Create an account' : 'Already have an account? Login'}
            </p>
        </form>
    )
}
