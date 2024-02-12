import React, { useEffect, useMemo, useState } from "react";
import { apihost } from "../../backendAPI";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IconButton } from '@mui/material';
import { LaunchOutlined } from '@mui/icons-material'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";


const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);


const SOAComp = () => {
    const [isCustomer, setIsCustomer] = useState(false)
    const [dataArray, setDataArray] = useState([])
    const UserId = localStorage.getItem('UserId');
    const token = localStorage.getItem('userToken');
    const [total, setTotal] = useState(0)
    const [dialog, setDialog] = useState(false)
    const [SOA, setSOA] = useState([])
    const [clickedRow, setClickedRow] = useState({})

    const [selectedRange, setSelectedRange] = useState({
        from: firstDayOfMonth.toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });

    const [closingBalance, setClosingBalance] = useState({ debit: 0, credit: 0 });


    useEffect(() => {
        fetch(`${apihost}/api/getBalance?UserId=${UserId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            if (data.status === 'Success') {
                setDataArray(data.data)
                let temp = 0;
                data.data.map(obj => {
                    temp += Number(obj.Bal_Amount)
                })
                setTotal(temp)
            }
            if (data?.isCustomer) {
                setIsCustomer(true)
            } else {
                setIsCustomer(false)
            }
        })
    }, [])

    const getInfo = (prop, mode) => {
        let rowData;
        if (mode && mode === 1) {
            rowData = clickedRow;
        } else {
            rowData = prop
        }
        setClickedRow(rowData)
        setDialog(true)
        fetch(`${apihost}/api/StatementOfAccound?Cust_Id=${rowData?.Cust_Id}&Acc_Id=${rowData?.tally_id}&Company_Id=${rowData?.Company_Id}&Fromdate=${selectedRange?.from}&Todate=${selectedRange?.to}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            setSOA(data.data)
            let bal = { debit: 0, credit: 0 }
            data.data.map(obj => {
                bal.debit += Number(obj.Debit_Amt)
                bal.credit += Number(obj.Credit_Amt)
            })
            setClosingBalance(bal)
        })
    }

    const handleClose = () => {
        setDialog(false);
        setSOA([]);
        setClickedRow({});
        setSelectedRange({
            from: firstDayOfMonth.toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0],
        })
    }

    return isCustomer ? (
        <>
            <div className="card">
                <div className="card-header py-3 bg-white" >
                    <p className="mb-0 fw-bold" >
                        <span>Balance of {localStorage.getItem('Name')}</span>
                        <span className={total > 0 ? 'text-primary' : 'text-danger'}> &nbsp;( {total.toLocaleString('en-IN') + (total < 0 ? ' CR' : ' DR')} )</span>
                    </p>
                </div>
                <div className="card-body p-0 table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ fontSize: '13px' }}>S.No</th>
                                <th style={{ fontSize: '13px' }}> - </th>
                                <th style={{ fontSize: '13px' }}>Company</th>
                                <th style={{ fontSize: '13px' }}>Ledger</th>
                                <th style={{ fontSize: '13px' }}>Balance</th>
                                <th style={{ fontSize: '13px' }}>Dr/Cr</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataArray.map((o, i) => (
                                <tr key={i}>
                                    <td style={{ fontSize: '13px' }}>{i + 1}</td>
                                    <td style={{ fontSize: '13px' }}>
                                        <button
                                            className="icon-btn"
                                            onClick={() => { getInfo(o) }}>
                                            <LaunchOutlined sx={{ fontSize: 'inherit' }} />
                                        </button>
                                    </td>
                                    <td style={{ fontSize: '13px' }}>{o?.Company_Name}</td>
                                    <td style={{ fontSize: '13px' }}>{o?.ledger_name}</td>
                                    <td style={{ fontSize: '13px' }}>{o?.Bal_Amount?.toLocaleString('en-IN')}</td>
                                    <td style={{ fontSize: '13px' }}>{o?.CR_DR}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Dialog
                open={dialog}
                onClose={handleClose}
                fullScreen
                fullWidth>
                <DialogTitle className="border-bottom text-primary">Transaction Report of {clickedRow?.Customer_name}</DialogTitle>
                <DialogContent className="rounded-2 shadow m-4 p-0">
                    <div className="row align-content-center">
                        <div className="col-lg-1">
                            <img src="./ic_launcher.png" alt="smtlogo" className="smtlogo" />
                        </div>
                        <div className="col-lg-4 p-2 ps-3">
                            <table className="table border-0">
                                <tbody>
                                    <tr>
                                        <td className="border-0" scope="row">Company</td>
                                        <td className="border-0">{clickedRow?.Company_Name}</td>
                                    </tr>
                                    <tr>
                                        <td className="border-0" scope="row">Ledger Name</td>
                                        <td className="border-0">{clickedRow?.ledger_name}</td>
                                    </tr>
                                    <tr>
                                        <td className="border-0" scope="row">Contact Person</td>
                                        <td className="border-0">{SOA[0]?.Contact_Person}</td>
                                    </tr>
                                    <tr>
                                        <td className="border-0" scope="row">Mobile</td>
                                        <td className="border-0">{SOA[0]?.Mobile_no}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        <div className="col-lg-4 p-2">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td className="border-0">Opening Balnce</td>
                                        <td className="border-0 text-primary">{
                                            SOA[0]?.Debit_Amt > 0
                                                ? SOA[0]?.Debit_Amt.toLocaleString('en-IN') + ' DR'
                                                : SOA[0]?.Credit_Amt.toLocaleString('en-IN') + ' CR'
                                        }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-0">Closing Balance</td>
                                        <td className="border-0 text-primary">{
                                            (closingBalance?.debit - closingBalance?.credit) < 0
                                                ? (closingBalance?.debit - closingBalance?.credit).toLocaleString('en-IN') + " CR"
                                                : (closingBalance?.debit - closingBalance?.credit).toLocaleString('en-IN') + ' DR'
                                        }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-3 p-2">
                            <table className="table border-0">
                                <tbody>
                                    <tr>
                                        <td className="border-0">From :</td>
                                        <td className="p-0 border-0">
                                            <input
                                                type="date"
                                                className="form-control w-auto ms-2"
                                                onChange={(e) => setSelectedRange({ ...selectedRange, from: e.target.value })}
                                                value={selectedRange.from} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-0">To :</td>
                                        <td className="p-0 border-0">
                                            <input
                                                type="date"
                                                className="form-control w-auto ms-2"
                                                onChange={(e) => {
                                                    if (selectedRange.from && selectedRange.from <= e.target.value) {
                                                        setSelectedRange({ ...selectedRange, to: e.target.value });
                                                    } else {
                                                        window.alert('Invald Date Range')
                                                    }
                                                }}
                                                value={selectedRange.to}
                                                disabled={!selectedRange.from} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-0"></td>
                                        <td className="border-0">
                                            <button
                                                className="btn text-white"
                                                style={{ backgroundColor: 'rgb(66, 34, 225)' }}
                                                onClick={() => { getInfo('', 1) }}>Search</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* <MaterialReactTable table={Statement} /> */}
                    <div className="p-2 table-responsive" style={{ maxHeight: '75vh' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="fa-13 tble-hed-stick">Date</th>
                                    <th className="fa-13 tble-hed-stick">Invoice No</th>
                                    <th className="fa-13 tble-hed-stick">Purticular</th>
                                    <th className="fa-13 tble-hed-stick">Dr</th>
                                    <th className="fa-13 tble-hed-stick">Cr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SOA.map((o, i) => (
                                    <tr key={i}>
                                        <td className="fa-13 bg-light">
                                            {new Date(o?.Ledger_Date).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="fa-13">{o.invoice_no}</td>
                                        <td className="fa-13 bg-light">{o.Ledger_Desc}</td>
                                        <td className="fa-13">{o.Debit_Amt.toLocaleString('en-IN')}</td>
                                        <td className="fa-13 bg-light">{o.Credit_Amt.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='contained' color='error'>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    ) : <></>
}

export default SOAComp;