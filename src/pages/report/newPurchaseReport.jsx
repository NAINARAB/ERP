import React, { useEffect, useState, useContext, useMemo } from "react";
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, FilterAlt } from '@mui/icons-material';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, IconButton } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';


const PurchaseReport2 = () => {
    const [PurchaseData, setPurchaseData] = useState([]);
    const [pageAccess, setPageAccess] = useState({});
    const { compData } = useContext(CurrentCompany)
    const [selectedValue, setSelectedValue] = useState({
        Report_Type: 2,
        Fromdate: '2023-10-01',
        Todate: new Date().toISOString().split('T')[0],
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 48;

    useEffect(() => {
        pageRights(2, 1017).then(per => {
            setPageAccess(per)
        })
    }, [])

    useEffect(() => {
        setPurchaseData([]);
        if (pageAccess?.permissions?.Read_Rights === 1) {
            fetch(`${apihost}/api/PurchaseOrderReportCard?Report_Type=${selectedValue.Report_Type}&Fromdate=${selectedValue.Fromdate}&Todate=${selectedValue.Todate}`, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageAccess.token,
                    'Db': compData.id
                }
            })
                .then(res => { return res.json() })
                .then(data => {
                    if (data.status === 'Success') {
                        data.data.sort((a, b) => a.po_no - b.po_no);
                        setPurchaseData(data.data)
                    }
                })
        }
    }, [pageAccess, compData, selectedValue.Report_Type, selectedValue.Fromdate, selectedValue.Todate])

    return (
        <div className="row">
            <div className="col-md-12">
                <Header setting={true} />
            </div>
            <div className="col-md-2">
                <Sidebar mainMenuId={'REPORTS'} subMenuId={'PURCHASE REPORT'} />
            </div>
            <div className="col-md-10">
                <div className="comhed">
                    {/* <button className="comadbtn filticon" onClick={() => setDialog(!dialog)}><FilterAlt sx={{ color: 'white' }} /></button> */}
                    {/* <h5 className="text-uppercase">Purchase Report</h5> */}
                    <h6 className="text-uppercase mb-0">REPORTS &nbsp;<NavigateNext fontSize="small" />&nbsp; LOS REPORT</h6>
                </div>

                <div className="p-3">
                    <div className="card">
                        <div className="card-header row fw-bold text-dark" style={{ backgroundColor: '#eae0cc' }}>
                            <div className="col-10 d-flex align-items-center">
                                {compData.Company_Name}
                            </div>
                            <div className="col-2 d-flex justify-content-end">
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={open ? 'long-menu' : undefined}
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                >
                                    <FilterAlt />
                                </IconButton>
                            </div>
                        </div>

                        <div className="card-body p-0 overflow-scroll" style={{ maxHeight: '75vh' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ fontSize: '14px' }}>-</th>
                                        <th style={{ fontSize: '14px' }}>Ledger</th>
                                        <th style={{ fontSize: '14px' }}>Date</th>
                                        <th style={{ fontSize: '14px' }}>Rate</th>
                                        <th style={{ fontSize: '14px' }}>Worth(₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {memoComp} */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseReport2;