import React, { useEffect } from "react";
import Header from '../components/header/header'
import Sidebar from "../components/sidenav/sidebar"

const HomeComp = () => {

    useEffect(() => {
        if(!localStorage.getItem('userToken')){
            window.location.href = '/'
        }
    }, [])

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar  />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h4>HOME</h4>
                    </div>
                    <div className="px-4">
                        <br />

                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeComp;