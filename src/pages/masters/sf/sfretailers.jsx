import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../../env";
import { SF_Retailers, customStyles } from "../../../components/tablecolumn";
import Header from '../../../components/header/header'
import Sidebar from "../../../components/sidenav/sidebar"
import { NavigateNext } from '@mui/icons-material';
import { pageRights } from '../../../components/rightsCheck'
import '../../com.css';

const SFRetailers = () => {
    const [retailerData, setRetailerData] = useState([]);

    useEffect(() => {
        pageRights(3, 5).then(rights => {
            if (rights.permissions.Read_Rights === 1) {
                fetch(`${apihost}/api/sf/retailers`, { method: "GET", headers: { 'Authorization': rights.token } }).then(res => res.json())
                    .then(resdata => {
                        if (resdata.status === "Success") {
                            setRetailerData(resdata.data)
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
                    <Sidebar mainMenuId={2} subMenuId={11} childMenuId={5} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>RETAILERS</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp;
                            SALES FORCE &nbsp;<NavigateNext fontSize="small" />&nbsp; RETAILERS</h6>
                    </div>
                    <div className="px-4">
                        <br />
                        <div className="box">
                            <DataTable
                                columns={SF_Retailers}
                                data={retailerData}
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

export default SFRetailers;