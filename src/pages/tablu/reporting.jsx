import React, { useEffect, useState } from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidenav/sidebar"
import { NavigateNext } from '@mui/icons-material';
// import tableauContent from './table.html';


const TableueComp = () => {

    // const [source, setSource] = useState()

    // function loadScript(src) {
    //     return new Promise((resolve) => {
    //         const script = document.createElement('script')
    //         script.src = src
    //         script.onload = () => {
    //             resolve(true)
    //         }
    //         script.onerror = () => {
    //             resolve(false)
    //         }
    //         document.body.appendChild(script)
    //     })
    // }

    // const loadTableau = async () => {
    //     const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    //     if (!res) {
    //         alert('Razropay failed to load!!')
    //         return
    //     }
    // }

    // useEffect(() => {

    // }, [])

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'REPORTS'} subMenuId={'TABLEAU REPORTS'} childMenuId={'REPORT 1'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>TABLEAU REPORTS</h5>
                        <h6>DASHBOARD &nbsp;<NavigateNext fontSize="small" />&nbsp; TABLEAU REPORTS</h6>
                    </div>
                    <div className="p-2">
                        <iframe src='http://smttableau.sudeekha.in/' style={{height: 550, width: '100%'}}>

                        </iframe>
                        {/* <div dangerouslySetInnerHTML={{ __html: tableauContent }} /> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TableueComp;