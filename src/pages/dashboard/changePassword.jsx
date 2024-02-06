import React, { useEffect, useState } from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidenav/sidebar"
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Button, FormHelperText } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../backendAPI";
import CurrentPage from '../../components/currentPage'

const ChangePassword = () => {
    const [enteredData, setEnteredData] = useState({ currentPassword: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState({ currentPassword: false, password: false, confirmPassword: false });
    const [isLoading, setIsLoading] = useState(false);
    const [locStore] = useState({ token: localStorage.getItem('userToken'), UserId: localStorage.getItem('UserId') });

    const clear = () => {
        setShowPassword({ currentPassword: false, password: false, confirmPassword: false });
        setEnteredData({ currentPassword: '', password: '', confirmPassword: '' });
    }

    const SubmitChangePassword = () => {
        setIsLoading(true)
        fetch(`${apihost}/api/changePassword`, {
            method: 'PUT',
            headers: { 'Authorization': locStore?.token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword: enteredData.currentPassword, newPassword: enteredData.password, userId: locStore?.UserId })
        }).then(res => res.json()).then(resdata => {
            setIsLoading(false);
            clear();
            if (resdata.status === 'Success') {
                toast.success(resdata.message);
            } else {
                toast.error(resdata.message)
            }
        });
    }

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'DASHBOARD'} subMenuId={'CHANGE PASSWORD'} />
                </div>
                <div className="col-md-10 p-3">
                    <CurrentPage MainMenu={'DASHBOARD'} SubMenu={'CHANGE PASSWORD'} />

                    <div className="col-lg-6 card">
                        <div className="card-header bg-white">
                            <h5 className="mb-0 py-2">CHANGE PASSWORD</h5>
                        </div>

                        <div className="card-body">

                            <div className="py-2">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="current-password">Current Password</InputLabel>
                                    <OutlinedInput
                                        id="current-password"
                                        type={showPassword.currentPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({ ...showPassword, currentPassword: !(showPassword.currentPassword) })}
                                                >
                                                    {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Current Password"
                                        sx={{ p: 1.2, }}
                                        value={enteredData.currentPassword}
                                        onChange={(e) => setEnteredData({ ...enteredData, currentPassword: e.target.value })}
                                    />
                                </FormControl>
                            </div>

                            <div className="py-2">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="new-password">New Password</InputLabel>
                                    <OutlinedInput
                                        id="new-password"
                                        type={showPassword.password ? 'text' : 'password'}
                                        error={enteredData.password !== '' && enteredData.password.length < 6}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                                                >
                                                    {showPassword.password ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="New Password"
                                        sx={{ p: 1.2 }}
                                        value={enteredData.password}
                                        onChange={(e) => setEnteredData({ ...enteredData, password: e.target.value })}
                                    />
                                    {enteredData.password !== '' && enteredData.password.length < 6 && (
                                        <FormHelperText error>
                                            Password must be at least 6 characters long.
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </div>

                            <div className="py-2">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="confirm-password">ReEnter New Password </InputLabel>
                                    <OutlinedInput
                                        id="confirm-password"
                                        type={showPassword.confirmPassword ? 'text' : 'password'}
                                        error={enteredData.password !== enteredData.confirmPassword && enteredData.confirmPassword !== ''}

                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                                                >
                                                    {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="ReEnter New Password "
                                        sx={{ p: 1.2 }}
                                        value={enteredData.confirmPassword}
                                        onChange={(e) => setEnteredData({ ...enteredData, confirmPassword: e.target.value })}
                                    />
                                    {(enteredData.password !== enteredData.confirmPassword && enteredData.confirmPassword !== '') && (
                                        <FormHelperText error>
                                            Passwords do not match
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </div>

                        </div>

                        <div className="card-footer text-end bg-white">
                            <Button onClick={clear} className="me-2">Clear</Button>
                            <Button
                                disabled={
                                    isLoading ||
                                    (!enteredData.password || !enteredData.currentPassword || !enteredData.confirmPassword) ||
                                    enteredData.password.length < 6 ||
                                    enteredData.password !== enteredData.confirmPassword
                                }
                                onClick={SubmitChangePassword} >Submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword;