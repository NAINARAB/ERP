import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import './sty.css';
import { apihost } from '../../env';

function Login() {
    const navigate = useNavigate();
    const [userID, setUserID] = useState('');
    const [password, setpassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getLogin = async () => {
        fetch(`${apihost}/api/login?user=${userID}&pass=${password}`)
            .then((res) => { return res.json() })
            .then((data) => {
                console.log(data)
                setIsLoading(false);
                localStorage.setItem('userToken',data[0].Autheticate_Id)
                navigate('/users')
            })
            .catch((e) => { console.log(e) });
    };


    const dologin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        getLogin();
    }

    return (
        <div>
            <ToastContainer />
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
                                <button className='logsbmt' type='submit' onClick={dologin}>
                                    {isLoading && (
                                        <div className="overlay">
                                            <CircularProgress className="spinner" />
                                        </div>
                                    )}
                                    Sign In
                                </button>
                                {/* <button onClick={() => console.log(data)} className='logsbmt' type='button'>disp</button> */}
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