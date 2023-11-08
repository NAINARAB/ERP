import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../../env";
import { SF_Details, customStyles } from "../../../components/tablecolumn";
import Header from '../../../components/header/header'
import Sidebar from "../../../components/sidenav/sidebar"
import { NavigateNext } from '@mui/icons-material';
import { pageRights } from '../../../components/rightsCheck'
import '../../com.css';

const SFDetails = () => {
    const [sfData, setSfData] = useState([]);

    useEffect(() => {
        pageRights(3, 6).then(rights => {
            if (rights.permissions.Read_Rights === 1) {
                fetch(`${apihost}/api/sf/sfdetails`, { method: "GET", headers: { 'Authorization': rights.token } }).then(res => res.json())
                    .then(resdata => {
                        if (resdata.status === "Success") {
                            setSfData(resdata.data)
                        }
                    })
            }
        })
    }, [])
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={2} subMenuId={11} childMenuId={6} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>SALES FORCE DETAILS</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp;
                            SALES FORCE &nbsp;<NavigateNext fontSize="small" />&nbsp; SF DETAILS</h6>
                    </div>
                    <div className="px-4">
                        <br />
                        <div className="box">
                            <DataTable
                                columns={SF_Details}
                                data={sfData}
                                pagination
                                highlightOnHover={true}
                                fixedHeader={true}
                                fixedHeaderScrollHeight={"65vh"}
                                customStyles={customStyles}
                                sort={{ field: 'orderDate', order: 'asc' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SFDetails;