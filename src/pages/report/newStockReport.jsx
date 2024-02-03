import React, { useEffect, useState, useContext, useMemo } from "react";
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, Add, Remove, Search, FilterAlt } from '@mui/icons-material';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Menu } from "@mui/material";




const StockReport2 = () => {
    const { compData } = useContext(CurrentCompany)
    const [pageInfo, setPageInfo] = useState({});
    const [StockData, setStockData] = useState(null)
    const [search, setSearch] = useState({
        zero: false,
        inm: '',
        date: new Date().toISOString().split('T')[0],
        dialogOpen: false,
    })

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const ITEM_HEIGHT = 48;

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
    }, [pageInfo, compData, search.date])

    const filteredStockData = useMemo(() => {
        if (StockData !== null) {
            return StockData.map((o) => {
                const filteredProductDetails = o.product_details.filter(
                    (obj) =>
                        (search.zero || Number(obj.Bal_Qty) !== 0) &&
                        (!search.inm || ((obj.Group_Name).toLowerCase()).includes((search.inm).toLowerCase()))
                );
                return { ...o, product_details: filteredProductDetails };
            });
        } else {
            return [];
        }
    }, [StockData, search.zero, search.inm]);

    const TableRows = ({ rows }) => {
        const [open, setOpen] = useState(false);

        const calcBalQty = (colmn) => {
            let count = 0;
            rows?.product_details?.map(obj => {
                count += Number(obj[colmn]);
            })
            return count.toLocaleString('en-IN');
        }

        function calculateMean() {
            let total = 0, prolength = rows?.product_details.length;
            rows?.product_details?.map(ob => {
                if (!isNaN(ob.CL_Rate)) {
                    total += Number(ob.CL_Rate)
                }
            })
            let mean = total / rows?.product_details.length
            return mean
        }

        return (
            <>
                <tr>
                    <td style={{ fontSize: '13px' }}>
                        <button onClick={() => setOpen(!open)} className="icon-btn">
                            {!open ? <Add sx={{ fontSize: 'inherit' }} /> : <Remove sx={{ fontSize: 'inherit' }} />}
                        </button>
                    </td>
                    <td style={{ fontSize: '13px' }}>
                        {rows.Stock_Group}
                        <span className="text-danger"> ({rows.product_details.length})</span>
                    </td>
                    <td style={{ fontSize: '13px' }} className="text-primary">{calcBalQty('Bal_Qty')}</td>
                    <td style={{ fontSize: '13px' }} className="text-primary">{calculateMean().toFixed(3).toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: '13px' }} className="text-primary">{calcBalQty('Stock_Value')}</td>
                </tr>
                {open && (
                    <tr>
                        <td colSpan={5}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ fontSize: '13px' }}>INM</th>
                                        <th style={{ fontSize: '13px' }}>Quantity</th>
                                        <th style={{ fontSize: '13px' }}>Rate</th>
                                        <th style={{ fontSize: '13px' }}>Worth(₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows?.product_details?.map((obj, i) => (
                                        <tr key={i}>
                                            <td style={{ fontSize: '13px' }}>{obj.Group_Name}</td>
                                            <td style={{ fontSize: '13px' }}>{obj.Bal_Qty.toLocaleString('en-IN')}</td>
                                            <td style={{ fontSize: '13px' }}>{obj.CL_Rate.toLocaleString('en-IN')}</td>
                                            <td style={{ fontSize: '13px' }}>{obj.Stock_Value.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                )}
            </>
        )
    }

    const memoComp = useMemo(() => {
        return filteredStockData.map((o, i) => {
            return <TableRows key={i} rows={o} />;
        });
    }, [filteredStockData, search.zero]);


    const overAllTotal = () => {
        let total = 0;
        filteredStockData.map(o => {
            o.product_details.map(ob => {
                total += Number(ob.Stock_Value)
            })
        })
        return total.toLocaleString('en-IN');
    }



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
                        {/* <button
                            className="comadbtn filticon"
                            onClick={() => setSearch({ ...search, dialogOpen: true })}>
                            <FilterAlt sx={{ color: 'white' }} />
                        </button> */}
                        {/* <h5>STOCK Report</h5> */}
                        <h6>REPORTS &nbsp;<NavigateNext fontSize="small" />&nbsp; STOCK REPORT</h6>
                    </div>
                    {/* <h6>REPORTS &nbsp;<NavigateNext fontSize="small" />&nbsp; STOCK REPORT</h6> */}

                    <div className="p-2">
                        <div className="row justify-content-end">
                            {/* <div className="col-md-6 col-lg-4 p-2">
                            <label>Include Zeros</label>
                            <select
                                style={{ padding: 10 }}
                                className="cus-inpt" value={search.zero}
                                onChange={(e) => setSearch({ ...search, zero: e.target.value })} >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div> */}
                            {/* <div className="col-md-6 col-lg-4 col-xl-3 p-2">
                                <label>Date</label>
                                <input type={'date'} className='cus-inpt'
                                    value={search.date}
                                    onChange={(e) => {
                                        setSearch({ ...search, date: e.target.value });
                                    }} />
                            </div>
                            <div className="col-md-6 col-lg-4 col-xl-3 p-2">
                                <label>Search</label>
                                <input type={'search'} className='micardinpt'
                                    value={search.inm}
                                    onChange={(e) => {
                                        setSearch({ ...search, inm: e.target.value });
                                    }} style={{ padding: '10px 10px 10px 3em' }} />
                                <div className="sIcon">
                                    <Search sx={{ fontSize: '1.6em' }} />
                                </div>
                            </div> */}
                        </div>

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
                                <div className="card mb-2" style={{boxShadow: 'none'}}>
                                    <div className="card-header" style={{boxShadow: 'none'}}>
                                        <h6 className="p-2 m-0 float-start">
                                            Date:
                                            <span className="text-primary fw-bold"> {new Date(search.date).toLocaleDateString('en-IN')}</span> 
                                        </h6>
                                        <h6 className="p-2 m-0 float-end">
                                            Total Value :
                                            <span className="text-primary fw-bold"> {overAllTotal()}</span> 
                                        </h6>
                                    </div>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ fontSize: '14px' }}>-</th>
                                            <th style={{ fontSize: '14px' }}>Group Name</th>
                                            <th style={{ fontSize: '14px' }}>Quantity</th>
                                            <th style={{ fontSize: '14px' }}>Rate</th>
                                            <th style={{ fontSize: '14px' }}>Worth(₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {memoComp}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '30ch',
                    },
                }}
            >
                <div className="p-2" style={{ outline: 'none', }}>
                    <label>Date</label>
                    <input type={'date'} className='cus-inpt mb-2'
                        value={search.date}
                        onChange={(e) => {
                            setSearch({ ...search, date: e.target.value });
                        }} />
                    <label>Search</label>
                    <input type={'search'} className='micardinpt'
                        value={search.inm}
                        onChange={(e) => {
                            setSearch({ ...search, inm: e.target.value });
                        }} style={{ padding: '10px 10px 10px 3em' }} />
                    <div className="sIcon">
                        <Search sx={{ fontSize: '1.6em' }} />
                    </div>
                </div>
            </Menu>

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
                        {/* <div className="col-md-6 col-lg-4 p-2">
                            <label>Include Zeros</label>
                            <select
                                style={{ padding: 10 }}
                                className="cus-inpt" value={search.zero}
                                onChange={(e) => setSearch({ ...search, zero: e.target.value })} >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div> */}
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