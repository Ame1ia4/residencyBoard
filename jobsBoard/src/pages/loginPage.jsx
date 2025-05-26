import React from "react";

import LoginForm from "../components/loginForm";

function LoginPage(){
    return(
    <div className="login-background">
        <div className="login-forground">
            <img src="../public/ISE.jpeg" alt="ISE Logo"></img>
            <LoginForm /> 
        </div>
    </div>
    );
};
export default LoginPage;