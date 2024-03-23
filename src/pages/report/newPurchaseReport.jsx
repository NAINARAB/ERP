import React, { useEffect, useState, useContext } from "react";
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { FilterAlt, Add, Remove } from '@mui/icons-material';
import { CurrentCompany } from "../../components/context/contextData";
import { IconButton, Menu } from "@mui/material";
import CurrentPage from "../../components/currentPage";
import Loader from '../../components/loader/loader'


const calcTotal = (arr, column) => {
    let total = 0;
    if (Array.isArray(arr)) {
        arr.map(ob => {
            total += Number(ob[column])
        })
    }
    return total.toLocaleString('en-IN')
}

const calcAverage = (arr, column) => {
    let total = 0;
    if (Array.isArray(arr) && arr.length > 0) {
        arr.map(obj => {
            total += Number(obj[column])
        })
    }
    return total / arr.length
}

const PurchaseReport2 = () => {
    const [PurchaseData, setPurchaseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageAccess, setPageAccess] = useState({});
    const { compData } = useContext(CurrentCompany);
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 2);

    const [selectedValue, setSelectedValue] = useState({
        Report_Type: 2,
        Fromdate: firstDayOfMonth.toISOString().split('T')[0],
        Todate: new Date().toISOString().split('T')[0],
        Report: 'PENDING PURCHASE ORDER'
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 78;

    useEffect(() => {
        pageRights(2, 1017).then(per => {
            setPageAccess(per)
        })
    }, [])

    useEffect(() => {
        setPurchaseData([]);
        setLoading(true)
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
                    setLoading(false)
                    if (data.status === 'Success') {
                        data.data.sort((a, b) => new Date(b.po_date) - new Date(a.po_date));
                        setPurchaseData(data.data)
                    }
                })
        }
    }, [pageAccess, compData, selectedValue.Report_Type, selectedValue.Fromdate, selectedValue.Todate])

    const DispRows = ({ rowData }) => {
        const [open, setOpen] = useState(false);

        // const totalRate = rowData?.product_details?.reduce(
        //     (acc, item) => acc + item?.product_details_1?.reduce((subAcc, subItem) => subAcc + subItem?.item_rate, 0),
        //     0
        // );

        const allItemRates = rowData?.product_details?.reduce((acc, item) => {
            return acc.concat(item?.product_details_1?.map(subItem => subItem?.item_rate));
        }, []);
        
        const totalRate = allItemRates.reduce((acc, rate) => acc + rate, 0);
        
        const averageRate = allItemRates.length > 0 ? totalRate / allItemRates.length : 0;
        
        const totalTonnage = rowData?.product_details?.reduce(
            (acc, item) => acc + item?.product_details_1?.reduce((subAcc, subItem) => subAcc + subItem?.bill_qty, 0),
            0
        );

        const totalValue = rowData?.product_details?.reduce(
            (acc, item) => acc + item?.product_details_1?.reduce((subAcc, subItem) => subAcc + subItem?.amount, 0),
            0
        );

        return rowData?.product_details?.length > 0 && (
            <>
                <tr>
                    <td style={{ fontSize: '12px' }}>
                        <button onClick={() => setOpen(!open)} className="icon-btn">
                            {open ? <Remove sx={{ fontSize: 'inherit' }} /> : <Add sx={{ fontSize: 'inherit' }} />}
                        </button>
                    </td>
                    <td style={{ fontSize: '12px' }} className="text-success bg-light">{rowData?.Stock_Group}</td>
                    <td style={{ fontSize: '12px' }} className="text-success">-</td>
                    <td style={{ fontSize: '12px' }} className="text-success bg-light fw-bold">
                        {totalTonnage?.toLocaleString('en-IN')}
                        {/* <span className="text-dark"> (Sum)</span> */}
                    </td>
                    <td style={{ fontSize: '12px' }} className="text-success fw-bold">
                        {averageRate.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        {/* <span className="text-dark"> (Avg)</span> */}
                        {/* {(totalRate / AvgRateCount).toLocaleString('en-IN', { maximumFractionDigits: 2 })} */}
                    </td>
                    <td style={{ fontSize: '12px' }} className="text-success bg-light fw-bold">
                        {/* {totalValue?.toLocaleString('en-IN')} or */}
                        {(Number(totalTonnage) * Number(averageRate)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                </tr>
                {open && rowData.product_details.map((o, i) => <SubRows subRowData={o} key={i} />)}
            </>
        )
    }

    const SubRows = ({ subRowData }) => {
        const [open, setOpen] = useState(false);

        return subRowData?.product_details_1?.length > 0 && (
            <>
                <tr>
                    <td style={{ fontSize: '12px' }} className="text-primary"></td>
                    <td style={{ fontSize: '12px' }} className="text-primary bg-light">
                        <button onClick={() => setOpen(!open)} className="icon-btn">
                            {open ? <Remove sx={{ fontSize: 'inherit' }} /> : <Add sx={{ fontSize: 'inherit' }} />}
                        </button>
                    </td>
                    <td style={{ fontSize: '12px' }} className="text-primary">{subRowData?.Item_Name_Modified} (Sum)</td>
                    <td style={{ fontSize: '12px' }} className="text-primary bg-light fw-bold">
                        {calcTotal(subRowData?.product_details_1, 'bill_qty')} 
                        {/* <span className="text-dark"> (Sum)</span> */}
                    </td>
                    <td style={{ fontSize: '12px' }} className="text-primary fw-bold">
                        {calcAverage(subRowData?.product_details_1, 'item_rate').toFixed(2)} 
                        {/* <span className="text-dark"> (Avg)</span> */}
                    </td>
                    <td style={{ fontSize: '12px' }} className="text-primary bg-light fw-bold">{calcTotal(subRowData?.product_details_1, 'amount')}</td>
                </tr>
                {open && subRowData?.product_details_1?.map((o, i) => (
                    <tr key={i}>
                        <td style={{ fontSize: '12px' }}>{o?.po_no}</td>
                        <td style={{ fontSize: '12px' }} className="bg-light">{new Date(o?.po_date).toLocaleDateString('en-IN')}</td>
                        <td style={{ fontSize: '12px' }}>{o?.ledger_name}</td>
                        <td style={{ fontSize: '12px' }} className="bg-light fw-bold">{o?.bill_qty.toLocaleString('en-IN') + " " + o?.bill_unit}</td>
                        <td style={{ fontSize: '12px' }} className=" fw-bold">{o?.item_rate.toLocaleString('en-IN')}</td>
                        <td style={{ fontSize: '12px' }} className="bg-light fw-bold">{o?.amount.toLocaleString('en-IN')}</td>
                    </tr>
                ))}
            </>
        )
    }

    const OrderValue = ({ row }) => {
        const [open, setOpen] = useState(false);

        return (
            <>
                <tr>
                    <td>
                        <button onClick={() => setOpen(!open)} className="icon-btn">
                            {open ? <Remove sx={{ fontSize: 'inherit' }} /> : <Add sx={{ fontSize: 'inherit' }} />}
                        </button>
                    </td>
                    <td style={{ fontSize: '12px' }}>{row?.ledger_name}</td>
                    <td style={{ fontSize: '12px' }}>{row?.Order_details?.length}</td>
                    <td style={{ fontSize: '12px' }} className="text-primary fw-bold">{calcTotal(row?.Order_details, 'total_invoice_value')}</td>
                </tr>
                {open &&
                    <tr>
                        <td colSpan={4} className="overflow-scroll">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ fontSize: '14px' }}>PO No</th>
                                        <th style={{ fontSize: '14px' }}>Date</th>
                                        <th style={{ fontSize: '14px' }}>Order Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row?.Order_details?.map((o, i) => (
                                        <tr key={i}>
                                            <td style={{ fontSize: '12px' }}>{o?.po_no}</td>
                                            <td style={{ fontSize: '12px' }}>{o?.po_date && new Date(o.po_date).toLocaleDateString('en-IN')}</td>
                                            <td style={{ fontSize: '12px' }}>{o?.total_invoice_value?.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                }
            </>
        )
    }

    const overAllTotal = () => {
        let tonnageTotal = 0;
        let total = 0;
        PurchaseData.map(o => {
            o?.product_details?.map(ob => {
                ob?.product_details_1.map(obj => {
                    tonnageTotal += Number(obj.bill_qty)
                    total += Number(obj.amount)
                })
            })
        })
        return {
            amount: parseInt(total).toLocaleString('en-IN'),
            tonage: parseInt(tonnageTotal).toLocaleString('en-IN')
        };
    }

    const OrderValueTotal = () => {
        let amountTotal = 0;
        PurchaseData.map(o => {
            o?.Order_details?.map(ob => {
                amountTotal += Number(ob?.total_invoice_value)
            })
        })
        return parseInt(amountTotal).toLocaleString('en-IN')
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header setting={true} />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'REPORTS'} subMenuId={'PURCHASE REPORT'} />
                </div>
                <div className="col-md-10 p-3">

                    <CurrentPage MainMenu={'REPORTS'} SubMenu={'PURCHASE REPORT'} />

                    <div className="card">
                        <div className="card-header row fw-bold text-dark" style={{ backgroundColor: '#eae0cc' }}>
                            <div className="col-10 d-flex flex-column justify-content-center">
                                {compData.Company_Name}
                                <span style={{fontSize: '11px'}}>( {selectedValue.Report} )</span>
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
                            {loading ? <Loader /> : (
                                <>
                                    <div className="card mb-2" style={{ boxShadow: 'none' }}>
                                        <div className="card-header p-0" style={{ boxShadow: 'none' }}>
                                            <h6 className="p-2 m-0 float-start" style={{ fontSize: '14px' }}>
                                                <span className="text-primary fw-bold">{new Date(selectedValue.Fromdate).toLocaleDateString('en-IN')} </span>
                                                -
                                                <span className="text-primary fw-bold"> {new Date(selectedValue.Todate).toLocaleDateString('en-IN')}</span>
                                            </h6>
                                            <h6 className="p-2 m-0 float-end">
                                                {/* Total : */}
                                                <span className="text-primary fw-bold" style={{fontSize: '14px'}}>
                                                    {Number(selectedValue.Report_Type) !== 3
                                                        ? " ( " + overAllTotal().tonage + " ) - ( " + overAllTotal().amount +" )"
                                                        : " " + OrderValueTotal()}
                                                </span>
                                            </h6>
                                        </div>
                                    </div>
                                    {Number(selectedValue.Report_Type) !== 3 ? (
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="tble-hed-stick" style={{ fontSize: '13px' }}>-</th>
                                                    <th className="tble-hed-stick" style={{ fontSize: '13px' }}>Stock Group</th>
                                                    <th className="tble-hed-stick" style={{ fontSize: '13px' }}>Item</th>
                                                    <th className="tble-hed-stick" style={{ fontSize: '13px' }}>Tonnage</th>
                                                    <th className="tble-hed-stick" style={{ fontSize: '13px' }}>Rate</th>
                                                    <th className="tble-hed-stick" style={{ fontSize: '13px' }}>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {PurchaseData.map((o, i) => <DispRows key={i} rowData={o} />)}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th style={{ fontSize: '14px' }} className="tble-hed-stick">S.No</th>
                                                    <th style={{ fontSize: '14px' }} className="tble-hed-stick">Ledger</th>
                                                    <th style={{ fontSize: '14px' }} className="tble-hed-stick">Order(s)</th>
                                                    <th style={{ fontSize: '14px' }} className="tble-hed-stick">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {PurchaseData.map((o, i) => <OrderValue row={o} key={i} />)}
                                            </tbody>
                                        </table>
                                    )}
                                </>
                            )}
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
                    <label>Report Type</label>
                    <select
                        className="cus-inpt mb-2"
                        onChange={(e) => {
                            const selectedIndex = e.target.selectedIndex;
                            const selectedText = e.target.options[selectedIndex].text;
                            setSelectedValue({
                                ...selectedValue,
                                Report_Type: Number(e.target.value),
                                Report: selectedText
                            });
                        }}
                        value={selectedValue.Report_Type}>
                        <option value={2}>PENDING PURCHASE ORDER</option>
                        <option value={0}>PURCHASE ORDER</option>
                        <option value={1}>PURCHASE</option>
                        <option value={3}>ORDER VALUE</option>
                    </select>
                    <label>From Date</label>
                    <input type={'date'} className='cus-inpt mb-2'
                        value={selectedValue.Fromdate}
                        onChange={(e) => {
                            setSelectedValue({ ...selectedValue, Fromdate: e.target.value });
                        }} />
                    <label>To Date</label>
                    <input type={'date'} className='cus-inpt mb-2'
                        value={selectedValue.Todate}
                        onChange={(e) => {
                            setSelectedValue({ ...selectedValue, Todate: e.target.value });
                        }} />
                </div>
            </Menu>
        </>
    )
}

export default PurchaseReport2;