import React, { useEffect, useState, useContext, useMemo } from "react";
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, KeyboardArrowDown, KeyboardArrowUp, Search, FilterAlt } from '@mui/icons-material';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Menu } from "@mui/material";
import CurrentPage from "../../components/currentPage";


const StockReport2 = () => {
    const { compData } = useContext(CurrentCompany)
    const [pageInfo, setPageInfo] = useState({});
    const [StockData, setStockData] = useState([])
    const [search, setSearch] = useState({
        zero: false,
        inm: '',
        date: new Date().toISOString().split('T')[0],
        dialogOpen: false,
    })
    const [laks, setLaks] = useState(true)
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
        const [laks, setLaks] = useState(true);

        const calcBalQty = (colmn) => {
            let count = 0;
            rows?.product_details?.map(obj => {
                count += Number(obj[colmn]);
            })
            return Number(count)
        }

        function calculateMean() {
            let total = 0;
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
                            {open ? <KeyboardArrowUp sx={{ fontSize: 'inherit' }} /> : <KeyboardArrowDown sx={{ fontSize: 'inherit' }} />}
                        </button>
                    </td>
                    <td style={{ fontSize: '13px' }}>
                        {rows.Stock_Group}
                        <span className="text-danger"> ({rows.product_details.length})</span>
                    </td>
                    <td style={{ fontSize: '13px' }} className="text-primary">{(calcBalQty('Bal_Qty') / 1000).toLocaleString('en-IN', { maximumFractionDigits: 0 }) }</td>
                    <td style={{ fontSize: '13px' }} className="text-primary">{calculateMean().toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                    <td style={{ fontSize: '13px' }} className="text-primary" onClick={() => setLaks(!laks)}>
                        {laks 
                            ?   (calcBalQty('Stock_Value') / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 })
                            :   calcBalQty('Stock_Value').toLocaleString('en-IN', { maximumFractionDigits: 2 })
                        } 
                    </td>
                    <td style={{ fontSize: '13px' }} className="text-primary">{calcBalQty('Bal_Qty').toLocaleString('en-IN')}</td>
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
                                        <th style={{ fontSize: '13px' }}>Value(₹)</th>
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
        return total;
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
                <div className="col-md-10 p-3">

                    <CurrentPage MainMenu={'REPORTS'} SubMenu={'STOCK REPORT'} />

                    {/* <div className="row justify-content-end">
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
                        <div className="col-md-6 col-lg-4 col-xl-3 p-2">
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
                            </div>
                    </div> */}

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
                            <div className="card mb-2" style={{ boxShadow: 'none' }}>
                                <div className="card-header p-0" style={{ boxShadow: 'none' }}>
                                    <h6 className="p-2 m-0 float-start">
                                        Date:
                                        <span className="text-primary fw-bold"> {new Date(search.date).toLocaleDateString('en-IN')}</span>
                                    </h6>
                                    <h6 className="p-2 m-0 float-end">
                                        Value :
                                        <span className="text-primary fw-bold" onClick={() => setLaks(!laks)}> 
                                            {laks 
                                                ?   (overAllTotal() / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2}) + '(L)'
                                                :   overAllTotal().toLocaleString('en-IN', { maximumFractionDigits: 2})
                                            }
                                        </span>
                                    </h6>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="tble-hed-stick" style={{ fontSize: '14px' }}>-</th>
                                        <th className="tble-hed-stick" style={{ fontSize: '14px' }}>Group Name</th>
                                        <th className="tble-hed-stick" style={{ fontSize: '14px' }}>Tonnage</th>
                                        <th className="tble-hed-stick" style={{ fontSize: '14px' }}>Rate</th>
                                        <th className="tble-hed-stick" style={{ fontSize: '14px' }}>Value(L)</th>
                                        <th className="tble-hed-stick" style={{ fontSize: '14px' }}>Quantity</th>
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