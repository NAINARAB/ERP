import React, { useEffect } from "react";
import Header from '../components/header/header'
import Sidebar from "../components/sidenav/sidebar"
import Logo from '../download.png'
import './com.css';
import { taskManagementWebAddress } from "../env";


const HomeComp = () => {

    useEffect(() => {
        if(!localStorage.getItem('userToken')){
            window.location.href = '/'
        }
    }, [])

    const loginResponse = localStorage.getItem('loginResponse')
    const loginInfo = JSON.parse(loginResponse)
    const name = localStorage.getItem('Name')
    const branch = localStorage.getItem('branchId')

    const navtoTask = () => {
        window.location.href = `${taskManagementWebAddress}?InTime=${loginInfo.InTime}&UserId=${loginInfo.UserId}&username=${name}&branch=${branch}`
    }

    return (
        <>
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
                        <div className="icon" onClick={navtoTask}>
                            <img src={Logo} alt="SMT TASK ICON"  /><br /><br />
                            <p style={{textAlign: 'center'}}>SMT TASK</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeComp;