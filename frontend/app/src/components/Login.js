import axios from 'axios';
import React from 'react';


function Login() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    

    const handleLogin = async (e) => { 
        e.preventDefault();

        console.log(email, password);

        const response = await axios.post('http://localhost:34265/login', 
            JSON.stringify({email, password}),
            {headers: {'Content-Type': 'application/json'}}
            );
     
    }


    return (
    <div className="login-form-wrap">
      <h2>Login</h2>
      <form className="login-form">
        <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required
            onChange={(e) => setEmail(e.target.value)}
            />
        <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required
            onChange={(e) => setPassword(e.target.value)}
            />
        <button 
            type="submit" 
            className="btn-login" 
            onClick={(e) => handleLogin(e)}
            >Login</button>
      </form>
    </div>
    );
  }
  export default Login;