import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../../backendAPI";
import { SF_Distributors, customStyles } from "../../../components/tablecolumn";
import Header from '../../../components/header/header'
import Sidebar from "../../../components/sidenav/sidebar"
import { NavigateNext } from '@mui/icons-material';
import { pageRights } from '../../../components/rightsCheck';
import { Sync } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../../components/loader/loader';
import 'react-toastify/dist/ReactToastify.css';
import '../../com.css';



const CostCenter = () => {
    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'CUSTOMER MASTER'} childMenuId={'COST CENTER'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>COST CENTER</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp;
                            CUSTOMER MASTER &nbsp;<NavigateNext fontSize="small" />&nbsp; COST CENTER</h6>
                    </div>
                    <div className="px-4">
                        <br />
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default CostCenter;