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

    const clearQueryParameters = () => {
        const newUrl = window.location.pathname;
        window.history.pushState({}, document.title, newUrl);
      };
    
      useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const inTime = queryParams.get('InTime');
        const userId = queryParams.get('UserId');
        const username = queryParams.get('username');
        const branch = queryParams.get('branch')
        
        const uTypeId = queryParams.get('uTypeId')
        const uTypeGet = queryParams.get('uTypeGet')
        const userToken = queryParams.get('userToken')
        const SessionId = queryParams.get('SessionId')
    
        if (inTime && userId && username && branch && uTypeId && uTypeGet && userToken && SessionId) {
          const loginResponse = {
            data: {
              InTime: inTime,
              branchid: branch,
              message: 'Login Successfully',
              userId: userId,
              username: username,
              SessionId: SessionId
            },
          };
          // for ERP
          localStorage.setItem('UserType', uTypeGet); // 2
          localStorage.setItem('Name', username); // 3
          localStorage.setItem('userToken', userToken); // 4
          localStorage.setItem('branchId', branch); // 5
          localStorage.setItem('uType', uTypeId) // 6
          localStorage.setItem('UserId', userId); // 7
          // for Task management
          localStorage.setItem('loginResponse', JSON.stringify(loginResponse)); // 1
          clearQueryParameters();
          navigate('home')
        } 
        if(localStorage.getItem('userToken')){
            navigate('home')
        }
      }, []);


    const getLogin = async () => {
        fetch(`${apihost}/api/login?user=${userID}&pass=${password}`)
            .then((res) => { return res.json() })
            .then((data) => {
                setIsLoading(false);
                if (data.status === "Success") {
                    localStorage.setItem('userToken',data.user.Autheticate_Id)
                    localStorage.setItem('Name', data.user.Name)
                    localStorage.setItem('UserType', data.user.UserType)
                    localStorage.setItem('UserId', data.user.UserId)
                    localStorage.setItem('branchId', data.user.BranchId)
                    localStorage.setItem('loginResponse', JSON.stringify(data.sessionInfo))
                    localStorage.setItem('uType', data.user.UserTypeId)
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