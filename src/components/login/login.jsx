import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import './sty.css';
import { apihost } from '../../backendAPI';


function Login() {
    const navigate = useNavigate();
    const [userID, setUserID] = useState('');
    const [password, setpassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const Auth = queryParams.get('Auth') || localStorage.getItem('userToken')

        fetch(`${apihost}/api/getUserByAuth?Auth=${Auth}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'Success') {
                    const { Autheticate_Id, BranchId, BranchName, Company_id, Name, UserId, UserName, UserType, UserTypeId, session } = data.data[0];
                    const user = {
                        Autheticate_Id, BranchId, BranchName, Company_id, Name, UserId, UserName, UserType, UserTypeId
                    }
                    const loginResponse = {
                        InTime: session[0].InTime,
                        userId: UserId,
                        SessionId: session[0].SessionId
                    };

                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('loginResponse', JSON.stringify(loginResponse))
                    localStorage.setItem('UserType', UserType); // 2
                    localStorage.setItem('userToken', Autheticate_Id); // 4
                    localStorage.setItem('branchId', BranchId); // 5
                    localStorage.setItem('uType', UserTypeId) // 6
                    localStorage.setItem('UserId', UserId); // 7
                    localStorage.setItem('Name', Name); // 3
                    navigate('home');
                }
            }).catch(e => { console.error(e) })
            .finally(() => {
                const newUrl = window.location.pathname;
                window.history.pushState({}, document.title, newUrl);
            })

    }, []);

    const getLogin = async () => {
        fetch(`${apihost}/api/login?user=${userID}&pass=${password}`)
            .then((res) => { return res.json() })
            .then((data) => {
                setIsLoading(false);
                if (data.status === "Success") {
                    localStorage.setItem('userToken', data.user.Autheticate_Id)
                    localStorage.setItem('Name', data.user.Name)
                    localStorage.setItem('UserType', data.user.UserType)
                    localStorage.setItem('UserId', data.user.UserId)
                    localStorage.setItem('branchId', data.user.BranchId)
                    localStorage.setItem('loginResponse', JSON.stringify(data.sessionInfo))
                    localStorage.setItem('uType', data.user.UserTypeId);
                    localStorage.setItem('user', JSON.stringify(data.user))
                    navigate('home')
                } else {
                    toast.error("Login Failed")
                }
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