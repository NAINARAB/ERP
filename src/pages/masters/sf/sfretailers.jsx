import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../../env";
import { SF_Retailers, customStyles } from "../../../components/tablecolumn";
import Header from '../../../components/header/header'
import Sidebar from "../../../components/sidenav/sidebar"
import { NavigateNext } from '@mui/icons-material';
import { pageRights } from '../../../components/rightsCheck'
import { Sync } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../../components/loader/loader';
import 'react-toastify/dist/ReactToastify.css';
import '../../com.css';

const SFRetailers = () => {
    const [retailerData, setRetailerData] = useState([]);
    const [pageInfo, setPageInfo] = useState({ permissions: { Read_Rights: 0, Add_Rights: 0, Edit_Rights: 0, Delete_Rights: 0 }, token: '' });
    const [isSync, setIsSync] = useState(false);

    useEffect(() => {
        pageRights(3, 5).then(rights => {
            if (rights.permissions.Read_Rights === 1) {
                fetch(`${apihost}/api/sf/retailers`, { method: "GET", headers: { 'Authorization': rights.token } }).then(res => res.json())
                    .then(resdata => {
                        if (resdata.status === "Success") {
                            setRetailerData(resdata.data)
                        }
                    })
            } setPageInfo(rights)
        })
    }, [])

    const syncSFRetailers = () => {
        if (retailerData.length !== 0) {
            setIsSync(true)
            fetch(`${apihost}/api/sf/retailers`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageInfo.token,
                },
                body: JSON.stringify({ data: retailerData })
            }).then(res => res.json()).then(data => {
                setIsSync(false)
                if (data.status === "Success") {
                    toast.success(data.message)
                } else { toast.error(data.message) }
            }).catch(e => console.log(e))
        } else { toast.warn("No Data") }
    }

    return (
        <><ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={2} subMenuId={11} childMenuId={5} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        {pageInfo.permissions.Add_Rights === 1
                            && <button
                                className={`comadbtn filticon ${isSync ? 'rotate' : ''}`}
                                onClick={syncSFRetailers}
                                disabled={isSync}
                            >
                                <Sync sx={{ color: 'white' }} />
                            </button>}
                        <h5>RETAILERS</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp;
                            SALES FORCE &nbsp;<NavigateNext fontSize="small" />&nbsp; RETAILERS</h6>
                    </div>
                    <div className="px-4">
                        <br />
                        {retailerData && retailerData.length
                            ? <div className="box">
                                <DataTable
                                    columns={SF_Retailers}
                                    data={retailerData}
                                    pagination
                                    highlightOnHover={true}
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight={"68vh"}
                                    customStyles={customStyles}
                                />
                            </div>
                            : <Loader />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SFRetailers;