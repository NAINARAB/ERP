import React, { useEffect, useState, useContext, useMemo } from "react";
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, Add, Remove, Search, FilterAlt } from '@mui/icons-material';
import { customSelectStyles } from "../../components/tablecolumn";
import Select from 'react-select';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, IconButton } from "@mui/material";
import Enumerable from 'linq';
import Loader from '../../components/loader/loader';




const StockReport2 = () => {
    const { compData } = useContext(CurrentCompany)
    const [pageInfo, setPageInfo] = useState({});
    const [StockData, setStockData] = useState(null)
    const [search, setSearch] = useState({
        zero: false,
        inm: '',
        date: '2024-01-01',
        dialogOpen: false
    })
    // console.log(new Date().toISOString().split('T')[0])

    useEffect(() => {
        pageRights(2, 10).then(rights => {
            setPageInfo(rights);
        })
    }, [])

    useEffect(() => {
        if (pageInfo?.permissions?.Read_Rights === 1) {
            fetch(`${apihost}/api/stockReport?ReportDate=${search.date}`, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageInfo.token,
                    'Db': compData.id
                }
            }).then(res => res.json())
                .then(data => {
                    if (data.status === "Success") {
                        setStockData(data.data);
                    } else {
                        setStockData([])
                    }
                })
        }
    }, [pageInfo, compData])



    const TableRows = ({ rows, searchElement }) => {
        const [open, setOpen] = useState(false);

        const calcBalQty = (colmn) => {
            let count = 0;
            rows?.product_details?.map(obj => {
                count += Number(obj[colmn]) ? Number(obj[colmn]) : 0;
            })
            return count.toLocaleString('en-IN');
        }

        function calculateMean() {
            let total = 0.0;
            rows?.product_details?.map(ob => {
                if (ob.CL_Rate > 0) {
                    total += Number(ob.CL_Rate)
                }
            })
            let mean = total / rows?.product_details.length
            return mean;
        }

        return (
            <>
                <tr>
                    <td style={{ fontSize: '14px' }}>
                        <button onClick={() => setOpen(!open)} className="icon-btn">
                            {!open ? <Add sx={{ fontSize: 'inherit' }} /> : <Remove sx={{ fontSize: 'inherit' }} />}
                        </button>
                    </td>
                    <td style={{ fontSize: '14px' }}>{rows.Stock_Group + " (" + rows.product_details.length + ")"}</td>
                    <td style={{ fontSize: '14px' }}>{calcBalQty('Bal_Qty')}</td>
                    <td style={{ fontSize: '14px' }}>{calculateMean().toFixed(3)}</td>
                    <td style={{ fontSize: '14px' }}>{calcBalQty('CL_Rate')}</td>
                </tr>
                {open && (
                    <tr>
                        <td colSpan={5}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <td style={{ fontSize: '13px' }}>INM</td>
                                        <td style={{ fontSize: '13px' }}>Quantity</td>
                                        <td style={{ fontSize: '13px' }}>Rate</td>
                                        <td style={{ fontSize: '13px' }}>Stock Value</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows?.product_details?.map((obj, i) => {
                                        const isVisibleRow = search.zero || Number(obj.Bal_Qty) !== 0;

                                        return isVisibleRow && (
                                            <tr key={search.zero ? i : obj.Group_Name}>
                                                <td style={{ fontSize: '13px' }}>{obj.Group_Name}</td>
                                                <td style={{ fontSize: '13px' }}>{obj.Bal_Qty}</td>
                                                <td style={{ fontSize: '13px' }}>{obj.CL_Rate}</td>
                                                <td style={{ fontSize: '13px' }}>{obj.Stock_Value}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                )}
            </>
        )
    }

    const memoComp = useMemo(() => {
        if (StockData !== null) {
            return StockData.map((o, i) => {
                return <TableRows key={i} rows={o} />;
            });
        } else {
            return <></>;
        }
    }, [StockData, search.date, search.zero]);



    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header setting={true} />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'REPORTS'} subMenuId={'STOCK REPORT'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <button
                            className="comadbtn filticon"
                            onClick={() => setSearch({ ...search, dialogOpen: true })}>
                            <FilterAlt sx={{ color: 'white' }} />
                        </button>
                        <h5>STOCK Report</h5>
                        <h6>REPORTS &nbsp;<NavigateNext fontSize="small" />&nbsp; STOCK REPORT</h6>
                    </div>

                    <div className="p-2">
                        {StockData !== null
                            ? (
                                <div className="card">
                                    <div className="card-header fw-bold text-dark" style={{ backgroundColor: '#eae0cc' }}>
                                        <span className="float-start">{compData.Company_Name} REPORTS</span>
                                        <span className="float-end"> DATE : 01/01/2024</span> &nbsp;
                                    </div>
                                    <div className="card-body p-0 overflow-scroll" style={{ maxHeight: '70vh' }}>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <td style={{ fontSize: '14px' }}>-</td>
                                                    <td style={{ fontSize: '14px' }}>Group Name</td>
                                                    <td style={{ fontSize: '14px' }}>Quantity</td>
                                                    <td style={{ fontSize: '14px' }}>Rate</td>
                                                    <td style={{ fontSize: '14px' }}>Value</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {memoComp}
                                            </tbody>
                                        </table>
                                        {StockData.length === 0 && <h6 className="text-center">No Records Available</h6>}
                                    </div>
                                </div>
                            )
                            : <Loader />
                        }
                    </div>
                </div>
            </div>
            <Dialog
                open={search.dialogOpen}
                onClose={() => setSearch({ ...search, dialogOpen: false })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth maxWidth="md"
            >
                <DialogTitle id="alert-dialog-title">Filters</DialogTitle>
                <DialogContent>
                    <div className="row">
                        <div className="col-md-6 col-lg-4 p-2">
                            <label>Include Zeros</label>
                            <select
                                style={{ padding: 10 }}
                                className="cus-inpt" value={search.zero}
                                onChange={(e) => setSearch({ ...search, zero: e.target.value })} >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>
                        <div className="col-md-6 col-lg-4 p-2">
                            <label>Date</label>
                            <input type={'date'} className='cus-inpt'
                                value={search.date}
                                onChange={(e) => {
                                    setSearch({ ...search, date: e.target.value });
                                }} />
                        </div>
                        <div className="col-md-6 col-lg-4 p-2">
                            <label>Search</label>
                            <input type={'search'} className='micardinpt'
                                value={search.inm}
                                onChange={(e) => {
                                    setSearch({ ...search, inm: e.target.value });
                                }} style={{ paddingLeft: '3em' }} />
                            <div className="sIcon">
                                <Search sx={{ fontSize: '1.6em' }} />
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSearch({ ...search, dialogOpen: false })}>Close</Button>
                    <Button onClick={() => setSearch({ ...search, dialogOpen: false })} autoFocus sx={{ color: 'green' }}>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}


export default StockReport2;