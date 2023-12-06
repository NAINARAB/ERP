import React, { useEffect, useState } from "react";
import Header from '../components/header/header'
import Sidebar from "../components/sidenav/sidebar"
import './com.css';
import { apihost, taskManagementWebAddress } from "../backendAPI";
import { pageRights } from "../components/rightsCheck";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { PauseCircleOutline, PlayArrow, Done, CalendarMonthTwoTone, ArrowForwardOutlined, ArrowBackOutlined } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'
import Logo from '../download.png';


function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

function formatTime(inputTime) {
    const [hours, minutes, seconds] = inputTime.split(':');
    const dateObj = new Date(2000, 0, 1, hours, minutes, seconds);
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return formattedTime;
}


const HomeComp = () => {
    const [task, setTask] = useState(false);
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });
    const user = localStorage.getItem('UserId');
    const token = localStorage.getItem('userToken');
    const [attanance, setAttanance] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isEmp, setIsEmp] = useState(false);
    const [workSummary, setWorkSummary] = useState('')
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        pageRights(2, 13).then(per => {
            if (per.permissions.Add_Rights === 1) {
                setTask(true)
                fetch(`${apihost}/api/attanance?id=${per.UserId}`, { headers: { 'Authorization': token } })
                    .then(res => { return res.json() })
                    .then(data => {
                        setAttanance(data.status === 'Success' ? data.data : [])
                        setIsEmp(!(data.message === 'Not An Employee'))
                    })
            } else {
                setTask(false)
            }
        })
    }, [refresh])

    const loginResponse = localStorage.getItem('loginResponse')
    const loginInfo = JSON.parse(loginResponse)
    const name = localStorage.getItem('Name')
    const branch = localStorage.getItem('branchId')

    const navtoTask = () => {
        window.location.href = `${taskManagementWebAddress}?InTime=${loginInfo.InTime}&UserId=${loginInfo.UserId}&username=${name}&branch=${branch}`
    }


    const getLocation = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude, error: null });
            return true;
        } catch (error) {
            if (error.code === error.PERMISSION_DENIED) {
                setLocation({
                    latitude: null,
                    longitude: null,
                    error: 'Location access denied by the user',
                });
                toast.warn('Allow Location Access');
            } else {
                setLocation({ latitude: null, longitude: null, error: error.message });
            }
            return false;
        }
    };

    const StartDay = () => {
        getLocation().then((hasLocationAccess) => {
            if (hasLocationAccess) {
                if (location.latitude && location.latitude) {
                    fetch(`${apihost}/api/attanance`, {
                        method: 'POST',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            UserId: loginInfo.UserId,
                            Latitude: location.latitude,
                            Longitude: location.longitude
                        })
                    }).then(res => { return res.json() })
                        .then(data => {
                            setRefresh(!refresh)
                            if (data.status === 'Success') {
                                toast.success(data.message)
                            } else {
                                toast.error(data.message)
                            }
                        })
                } else {
                    toast.error('Location not found')
                }
            } else {
                toast.error('There is a problem in get location')
            }
        });
    };

    const EndDay = () => {
        fetch(`${apihost}/api/attanance`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserId: loginInfo.UserId,
                Work_Summary: workSummary
            })
        }).then(res => { return res.json() })
            .then(data => {
                setRefresh(!refresh)
                if (data.status === 'Success') {
                    toast.success(data.message)
                    setOpenDialog(false); setWorkSummary(''); setRefresh(!refresh)
                } else {
                    toast.error(data.message)
                }
            })
    }

    

    return (
        <>  <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'DASHBOARD'} subMenuId={'HOME'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h4>HOME</h4>
                    </div>
                    <div className="px-4">
                        <br />
                        
                        {isEmp
                            && <div className="card border col-lg-5 col-md-12 float-lg-end mb-3">
                                <div className="card-header bg-white">
                                    <h3 className="p-2 h4">
                                        <span className="float-start">Today Attanance</span>
                                        <span className="float-end">
                                            <Button
                                                startIcon={<PlayArrow />}
                                                disabled={attanance[0]?.Start_Date}
                                                onClick={StartDay} >Start Day</Button>
                                        </span>
                                    </h3>
                                </div>
                                {attanance.length > 0
                                    && <><div className="card-body row p-3">
                                        <h5>
                                            <span className="float-start"><CalendarMonthTwoTone /> Date</span>
                                            <span className="float-end">
                                                {attanance[0]?.Start_Date ? formatDate(attanance[0]?.Start_Date) : '-'}
                                            </span>
                                        </h5><br />
                                        <h5>
                                            <span className="float-start"><ArrowForwardOutlined /> In Time</span>
                                            <span className="float-end">
                                                {attanance[0]?.InTime ? formatTime(attanance[0]?.InTime) : '-'}
                                            </span>
                                        </h5><br />
                                        <h5>
                                            <span className="float-start"><CalendarMonthTwoTone /> Out Date</span>
                                            <span className="float-end">
                                                {attanance[0]?.OutDate ? formatDate(attanance[0]?.OutDate) : '-'}
                                            </span>
                                        </h5><br />
                                        <h5>
                                            <span className="float-start"><ArrowBackOutlined /> Out Time</span>
                                            <span className="float-end">
                                                {attanance[0]?.OutTime ? formatTime(attanance[0]?.OutTime) : '-'}
                                            </span>
                                        </h5>
                                    </div>
                                        <div className="card-footer text-end">
                                            <Button
                                                startIcon={<Done />}
                                                disabled={(attanance.length > 0) && (attanance[0]?.Current_St === 1)}
                                                variant="outlined"
                                                onClick={() => setOpenDialog(true)}>END day</Button>
                                        </div></>}
                            </div>}

                            {task
                            && <div className="icon" onClick={navtoTask}>
                                <img src={Logo} alt="SMT TASK ICON" /><br /><br />
                                <p style={{ textAlign: 'center' }}>SMT TASK</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth maxWidth="lg">
                <DialogTitle>
                    Add Work Summary
                </DialogTitle>
                <DialogContent>
                    <textarea className="form-control" onChange={(e) => setWorkSummary(e.target.value)} rows={10} autoFocus placeholder="Type Something About Today Work..." maxLength={1300} />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenDialog(false)} color='error'>Cancel</Button>
                    <Button variant="outlined" onClick={EndDay}>Close attendance</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default HomeComp;