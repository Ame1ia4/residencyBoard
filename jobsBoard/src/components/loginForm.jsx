import React, { useState } from "react";
import {supabase} from '../SupabaseClient';

export default function LoginForm(){
    // variables for input values initialised to empty strings
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // variable for Login / SignUp initalised true for Login
    const [isLogin, setIsLogin] = useState(true);

    // called by form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents page from auto reloading and form from auto submitting

        if (isLogin){
            const {error} = await supabase.auth.signInWithPassword({email, password});
            if(error) alert(error.message);
            else alert('Login Successful');
        }else{
            const {error} = await supabase.auth.signUp({email, password});
            if(error) alert(error.message);
            else alert('Check your email for conformation')
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)} // updates email variable to inputted string
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)} // updates password variable to inputted string
                required
            />
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
