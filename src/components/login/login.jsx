import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import './sty.css';

function Login() {
    const navigate = useNavigate();
    const [userID, setUserID] = useState('');
    const [password, setpassword] = useState('');

    const getLogin = (userid, password) => {
        fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "POST",
            body: JSON.stringify({
                user_id: userid,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json))
            .catch((err) => {
                console.log(err);
            })
    };


    const dologin = (e) => {
        e.preventDefault();
        getLogin(userID, password);
    }

    return (
        <div>
            <div className='main'>
                <div className='cntr'>
                    <div>
                        <h2 style={{ textAlign: 'center' }}>👋 Welcome Back</h2>
                        <p style={{ textAlign: 'center' }}>Sign in to your account to continue</p>
                        <div className='logform'><br />
                            <div style={{ fontSize: '23px' }}><h2 className='hedundr'>Sig</h2>n In</div>

                            <br /><br />
                            <form>
                                User ID
                                <input type='text' className='loginpt' value={userID} onChange={(e) => { setUserID(e.target.value) }} required autoFocus='ture' />
                                Password
                                <input type='password' className='loginpt' value={password} onChange={(e) => { setpassword(e.target.value) }} required /><br />
                                <button className='logsbmt' type='submit' onClick={dologin}>Sign In</button>
                            </form><br />
                            <p className='para'>By Signing in you agree to the Terms of Service and Privacy Policy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;