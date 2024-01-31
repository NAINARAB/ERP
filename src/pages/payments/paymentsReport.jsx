import React, { useEffect, useState } from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidenav/sidebar"
import { NavigateNext, UnfoldMoreOutlined, Search } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { customStyles } from '../../components/tablecolumn';
import { Tab, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TabPanel, TabList, TabContext } from '@mui/lab';
import { apihost } from "../../backendAPI";
import { pageRights } from "../../components/rightsCheck";
import DataTable from "react-data-table-component";



const PaymentReport = () => {
    const [PHData, setPHData] = useState([])
    const [pagePermissions, setPagePermissions] = useState([]);
    const [tabValue, setTabValue] = useState('1');
    const [search, setSearch] = useState({ searchData: '', payStatus: '0' });
    const [open, setOpen] = useState(false);
    const [verifyDetails, setVerifyDetails] = useState({ date: new Date().toISOString().split('T')[0], discribtion: '', verifyStatus: 0, Order_Id: '' });
    const [reload, setReload] = useState(false);
    const [isCustomer, setIsCustomer] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [showData, setShowData] = useState([])

    useEffect(() => {
        pageRights(2, 2018).then(per => {
            setPagePermissions(per)
        })
    }, [])

    useEffect(() => {
        setPHData([]);
        if (pagePermissions?.permissions?.Read_Rights === 1) {
            fetch(`${apihost}/api/isCustomer?UserId=${pagePermissions.UserId}`)
                .then(res => res.json())
                .then(data => {
                    let api = '';
                    if (data.isCustomer) {
                        setIsCustomer(data.isCustomer);
                        console.log(data)
                        api = `${apihost}/api/PaymentHistory?paymentType=${tabValue}&customerId=${data.data[0].Cust_Id}&payStatus=${search.payStatus}`;
                    } else {
                        setIsCustomer(false);
                        api = `${apihost}/api/PaymentHistory?paymentType=${tabValue}&payStatus=${search.payStatus}`;
                    }
                    fetch(api, { headers: { 'Authorization': pagePermissions.token } })
                        .then(res => res.json())
                        .then(data => {
                            if (data.status === "Success") {
                                data.data.map(o => {
                                    o.Created_At = new Date(o.Created_At)
                                    o.Total_Amount = Number(o.Total_Amount)
                                })
                                setPHData(data.data)
                            }
                        })
                })

        }
    }, [pagePermissions, tabValue, reload, search.payStatus])

    useEffect(() => {
        const filteredResults = PHData.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(search.searchData.toLowerCase())
            );
        });

        setFilteredData(filteredResults);
    }, [search.searchData, PHData]);

    useEffect(() => {
        setShowData(filteredData && filteredData.length > 0 ? filteredData : search.searchData === '' ? PHData : [])
    }, [filteredData])


    const clearVerifyDetails = () => {
        setVerifyDetails({ date: new Date().toISOString().split('T')[0], discribtion: '', verifyStatus: 0, Order_Id: '' })
    }

    const paymentReportColumn = [
        {
            name: 'Date',
            selector: (row) => row.Created_At,
            cell: (row) => row.Created_At.toLocaleDateString('en-IN'),
            // maxWidth: '60px',
            sortable: true,
        },
        {
            name: 'Name',
            selector: (row) => row.Customer_name,
            sortable: true,
        },
        {
            name: 'Bills',
            selector: (row) => row.Bill_Count,
            // maxWidth: '60px',
            sortable: true,
        },
        {
            name: 'Amount',
            selector: (row) => row.Total_Amount,
            cell: (row) => row.Total_Amount.toLocaleString('en-IN'),
            // maxWidth: '60px',
            sortable: true,
        },
        {
            name: 'Company',
            selector: (row) => row.Company_Name,
            sortable: true,
        },
        {
            name: 'OrderId',
            selector: (row) => row.Order_Id,
        },
        {
            name: 'Status',
            selector: (row) => row.Payment_Status,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => {
                return pagePermissions?.permissions?.Edit_Rights === 1 && Number(search.payStatus) === 0 ? (
                    <IconButton
                        onClick={() => {
                            setOpen(true);
                            setVerifyDetails({ ...verifyDetails, Order_Id: row.Order_Id });
                        }}>
                        <UnfoldMoreOutlined />
                    </IconButton>
                ) : <></>
            },
            sortable: true,
        },
    ]

    const cusPaymentReportColumn = [
        {
            name: 'Date',
            selector: (row) => row.Created_At,
            cell: (row) => row.Created_At.toLocaleDateString('en-IN'),
            // maxWidth: '60px',
            sortable: true,
        },
        {
            name: 'Name',
            selector: (row) => row.Customer_name,
            sortable: true,
        },
        {
            name: 'Bills',
            selector: (row) => row.Bill_Count,
            // maxWidth: '40px',
            sortable: true,
        },
        {
            name: 'Amount',
            selector: (row) => row.Total_Amount,
            cell: (row) => row.Total_Amount.toLocaleString('en-IN'),
            // maxWidth: '60px',
            sortable: true,
        },
        {
            name: 'Company',
            selector: (row) => row.Company_Name,
            sortable: true,
        },
        {
            name: 'OrderId',
            selector: (row) => row.Order_Id,
        },
        {
            name: 'Status',
            selector: (row) => row.Payment_Status,
            sortable: true,
        }
    ]

    const DispDataTable = () => (
        <DataTable
            data={showData}
            columns={isCustomer ? cusPaymentReportColumn : paymentReportColumn}
            expandableRows
            pagination
            highlightOnHover={true}
            fixedHeader={true}
            fixedHeaderScrollHeight={'58vh'}
            customStyles={customStyles}
            expandableRowsComponent={
                (row) => {
                    return (
                        <div className="rounded overflow-hidden m-2 shadow-sm" style={{ width: 'fit-content' }}>
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <td className=" bg-light">Invoice No</td>
                                        <td className=" bg-light">Bill Amount</td>
                                        <td className=" bg-light">Ledger No</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.data.PaymentDetails.map((o, i) => (
                                        <tr key={i}>
                                            <td className=" bg-light">{o.Invoice_No}</td>
                                            <td className=" bg-light">{o.Bal_Amount}</td>
                                            <td className=" bg-light">{o.Ledger_Name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                }
            } />
    )

    const postVefification = () => {
        if (!isCustomer) {
            fetch(`${apihost}/api/manualPaymentVerification`, {
                method: 'POST',
                headers: {
                    'Authorization': pagePermissions.token,
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    orderId: verifyDetails.Order_Id,
                    description: verifyDetails.discribtion,
                    verifiedDate: verifyDetails.date,
                    verifyStatus: verifyDetails.verifyStatus
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.status === 'Success') {
                        toast.success(data.message);
                        clearVerifyDetails();
                        setOpen(false);
                        setReload(!reload)
                    } else {
                        toast.error(data.message)
                    }
                })
        }
    }


    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'PAYMENTS'} subMenuId={'PAYMENT REPORTS'} />
                </div>
                <div className="col-md-10">

                    <div className="comhed">
                        <h5>PAYMENT REPORTS</h5>
                        <h6>PAYMENTS &nbsp;<NavigateNext fontSize="small" />&nbsp; PAYMENT REPORTS</h6>
                    </div>

                    <div className="p-2">
                        <div className="row justify-content-end">
                            <div className="col-md-6 col-lg-4 col-xl-3 p-2">
                                <label>Payment Status</label>
                                <select
                                    style={{ padding: 10 }}
                                    className="cus-inpt" value={search.payStatus}
                                    onChange={(e) => setSearch({ ...search, payStatus: e.target.value })} >
                                    <option value='0'>Verification Pending List</option>
                                    <option value="1">Verified</option>
                                    <option value="2">Rejected</option>
                                </select>
                            </div>
                            <div className="col-md-6 col-lg-4 col-xl-3 p-2">
                                <label>Search</label>
                                <input type={'search'} className='micardinpt'
                                    value={search.searchData}
                                    onChange={(e) => {
                                        setSearch({ ...search, searchData: e.target.value });
                                    }} style={{ paddingLeft: '3em' }} />
                                <div className="sIcon">
                                    <Search sx={{ fontSize: '1.6em' }} />
                                </div>
                            </div>
                        </div>
                        <div className={'box mt-2'}>

                            <TabContext value={tabValue}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList indicatorColor='transparant' onChange={(e, n) => setTabValue(n)} aria-label="">
                                        <Tab sx={tabValue === '1' ? { backgroundColor: '#c6d7eb' } : {}} label={'MANUAL PAYMENT '} value='1' />
                                        <Tab sx={tabValue === '2' ? { backgroundColor: '#c6d7eb' } : {}} label="PAYMENT GATEWAY" value='2' />
                                    </TabList>
                                </Box>
                                <TabPanel value={'1'} sx={{ p: 0, }}>
                                    <DispDataTable />
                                </TabPanel>
                                <TabPanel value={'2'} sx={{ p: 0, }}>
                                    <DispDataTable />
                                </TabPanel>
                            </TabContext>
                        </div>
                    </div>

                </div>
            </div>

            <Dialog
                open={open}
                onClose={() => { setOpen(false); clearVerifyDetails(); }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md" fullWidth>
                <DialogTitle id="alert-dialog-title">Payment Action</DialogTitle>
                <DialogContent>
                    <div className="p-2">
                        <label>Discrition</label>
                        <textarea
                            rows="3" className="cus-inpt shadow-none" maxLength={330}
                            onChange={(e) => setVerifyDetails({ ...verifyDetails, discribtion: e.target.value })}
                            value={verifyDetails.discribtion}></textarea>
                    </div>
                    <div className="row">
                        <div className="col-md-6 p-2">
                            <label>Verification Date</label>
                            <input
                                type="date"
                                className="cus-inpt"
                                onChange={(e) => setVerifyDetails({ ...verifyDetails, date: e.target.value })}
                                value={verifyDetails.date} />
                        </div>
                        <div className="col-md-6 p-2">
                            <label>Status</label>
                            <select
                                style={{ padding: 12 }}
                                className="cus-inpt"
                                onChange={(e) => setVerifyDetails({ ...verifyDetails, verifyStatus: e.target.value })}
                                value={verifyDetails.verifyStatus}>
                                <option value='0'>Verification Pending</option>
                                <option value="1">Verify</option>
                                <option value="2">Reject</option>
                            </select>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpen(false); clearVerifyDetails(); }}>Close</Button>
                    <Button onClick={postVefification} autoFocus >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PaymentReport;