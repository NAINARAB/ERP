import React, { useEffect, useState } from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidenav/sidebar"
import { NavigateNext, LaunchOutlined, CurrencyRupee, ArrowBackIosNew } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../backendAPI";
import { pageRights } from "../../components/rightsCheck";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, } from '@mui/material';
import AppLogo from './ic_launcher.png';
import QRCode from 'qrcode';
import ShankarTraderQRC from './staticqrc.jpg';


const BillComponent = ({ props, bankDetails }) => {
    const [open, setOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [detailsDialog, setDetailsDialog] = useState(false);
    const [paymentType, setPaymentType] = useState(1);
    const [qrCodeURL, setQRCodeURL] = useState('');
    const [bankObj, setBankObj] = useState({});
    const [TransactionID, setTransactioId] = useState('')

    useEffect(() => {
        props.CompanyBalanceInfo.sort((itemA, itemB) => {
            const dateA = new Date(itemA.invoice_date);
            const dateB = new Date(itemB.invoice_date);
            return dateA - dateB;
        });

        const selectedBillsArray = props.CompanyBalanceInfo.map((item, index) => ({
            invoiceNO: item.invoice_no,
            num: index,
            check: false
        }));
        setSelectedBill(selectedBillsArray);
    }, [props, refresh]);

    const totalAmount = () => {
        let total = 0;
        selectedBill.map((item, index) => {
            if (item.check === true) {
                total += Number(props.CompanyBalanceInfo[index].Bal_Amount)
            }
        })
        if (Number(paymentType) === 1) {
            return parseInt(total);
        } else {
            return parseInt(Number(total) * 1.03);
        }
    }

    useEffect(() => {
        const comp = props.CompanyBalanceInfo[0].Company_Id;
        bankDetails.map(obj => {
            if (obj.Company_Id == comp) {
                setBankObj(obj);
            }
        })
        const generateQRCode = async () => {
            const upiNumber = bankObj.UPI_Number;
            const optionalMessage = 'Thank you!';
            const amount = totalAmount();
            const googlePayLink = `https://pay.google.com/payments/u/0/send?phone=${upiNumber}&msg=${optionalMessage}&amount=${amount}`;

            try {
                const url = await QRCode.toDataURL(googlePayLink);
                setQRCodeURL(url);
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        };

        generateQRCode();
    }, [totalAmount, bankDetails]);

    const handleCheckboxChange = (e, index) => {
        const updatedSelectedBill = [...selectedBill];
        updatedSelectedBill[index] = {
            ...updatedSelectedBill[index],
            check: e.target.checked
        };
        setSelectedBill(updatedSelectedBill);
    };

    const PayCheck = () => {
        let totalBillChecked = 0;
        let orderWiseChecked = true;

        for (let i = 0; i < selectedBill.length; i++) {
            const obj = selectedBill[i];
            if (obj.check === true) {
                totalBillChecked += 1;
            }
        }

        if (totalBillChecked === 0) {
            return toast.error('Select a bill for payment');
        }

        for (let i = 1; i < selectedBill.length; i++) {
            const currentObj = selectedBill[i];
            const prevObj = selectedBill[i - 1];
            if (currentObj.check === true && !prevObj.check) {
                orderWiseChecked = false;
                break;
            }
        }

        if (orderWiseChecked === false) {
            return toast.error('You can only Pay Bills Order Wisely');
        }

        setDetailsDialog(true);
    };

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    async function displayRazorpay(billsArray) {

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razropay failed to load!!')
            return
        }

        const selectedBillsData = [];
        selectedBill.map((obj, index) => {
            if (Boolean(obj.check) === true) {
                selectedBillsData.push(props.CompanyBalanceInfo[index])
            }
        })

        fetch(`${apihost}/api/makePayment`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                bills: selectedBillsData,
                amount: totalAmount(),
                UserId: localStorage.getItem('UserId'),
                paymentType: paymentType
            })
        })
            .then(res => res.json())
            .then(data => {
                const orderId = data.data[0] ? data.data[0].id : '';
                if (data.status === 'Success') {
                    const options = {
                        "key": process.env.REACT_APP_RAZORPAYID,
                        "amount": totalAmount() * 100,
                        "currency": "INR",
                        "name": "SMT",
                        "description": "Test Transaction",
                        "image": AppLogo,
                        "order_id": orderId,
                        "handler": function (res) {
                            console.log(res)
                            postPaymentVerify(res)
                        },
                        "prefill": {
                            "name": localStorage.getItem('Name'),
                        },
                        "theme": {
                            "color": "#3399cc"
                        }
                    };
                    new window.Razorpay(options).open()
                }
            })
    }

    function postPaymentVerify(orderInfo) {
        fetch(`${apihost}/api/paymentVerify`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                razorpay_payment_id: orderInfo.razorpay_payment_id,
                razorpay_order_id: orderInfo.razorpay_order_id,
                razorpay_signature: orderInfo.razorpay_signature
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
        })
    }

    const postManualPay = () => {
        const selectedBillsData = [];
        selectedBill.map((obj, index) => {
            if (Boolean(obj.check) === true) {
                selectedBillsData.push(props.CompanyBalanceInfo[index])
            }
        })

        fetch(`${apihost}/api/manualPayment`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                bills: selectedBillsData,
                amount: totalAmount(),
                UserId: localStorage.getItem('UserId'),
                paymentType: paymentType,
                TransactionId: TransactionID
            })
        }).then(res => res.json()).then(data => {
            if (data.status === 'Success') {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        })
    }

    // async function chooseQRCode() {
    //     const upiNumber = '7550387880';
    //     const optionalMessage = 'Thank you for your purchase!';
    //     const amount = totalAmount();
    //     const googlePayLink = `https://pay.google.com/payments/u/0/send?phone=${upiNumber}&msg=${optionalMessage}&amount=${amount}`;
    //     const src = QRCode.toDataURL(googlePayLink, (err, url) => {
    //         if (err) throw err;
    //         console.log(url); 
    //     });
    //     return src;
    //     // const compNum = Number(compID)
    //     // const CompDetails = [
    //     //     {
    //     //         imageSrc: ShankarTraderQRC,
    //     //         Name: 'SHANKAR TRADERS'
    //     //     },
    //     //     {
    //     //         imageSrc: ShankarTraderQRC,
    //     //         Name: 'BHAVANI TRADERS'
    //     //     }
    //     // ]
    //     // if (compNum === 1) {
    //     //     return CompDetails[0]
    //     // }
    //     // if (compNum === 3) {
    //     //     return CompDetails[1]
    //     // }
    // };

    return (
        <>
            <tr>
                <td>
                    <IconButton onClick={() => setOpen(!open)}>
                        <LaunchOutlined />
                    </IconButton>
                </td>
                <td>{props.CompName}</td>
                <td>{props.CompanyBalanceInfo.length}</td>
                <td>
                    {(() => {
                        let amount = 0;
                        props.CompanyBalanceInfo.map(cobj => {
                            amount += parseInt(cobj.Bal_Amount)
                        })
                        return amount.toLocaleString();
                    })()}
                </td>
            </tr>

            <Dialog open={open} onClose={() => { setOpen(!open); setRefresh(!refresh) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullScreen>
                <DialogTitle sx={{ fontSize: '14px' }} className="fw-bold text-primary">{'Bills Payable For ' + props.CompName}</DialogTitle>
                <DialogContent className="p-0 ">
                    <div className="row">
                        <div className="col-6 p-2">
                            <p>
                                <span>PAYMENT AMOUNT : </span><br />
                                <span className="text-primary">{totalAmount().toLocaleString('en-IN')}</span>
                            </p>
                        </div>
                        <div className="col-6 p-2">
                            <div className="float-end">
                                <label>PAYMENT TYPE</label>
                                <select
                                    className="form-select"
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    style={{ maxWidth: '270px' }} >
                                    <option value={1}>MANUAL PAYMENT</option>
                                    <option value={2}> (+ 3%) PAYMENT GATEWAY</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ fontSize: '13px' }}> - </th>
                                <th style={{ fontSize: '13px' }}>Date</th>
                                <th style={{ fontSize: '13px' }}>Ledger</th>
                                <th style={{ fontSize: '13px' }}>InvoiceNo</th>
                                <th style={{ fontSize: '13px' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.CompanyBalanceInfo.map((obj, index) => {
                                const dateObject = new Date(obj.invoice_date);
                                const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                                const formattedDate = dateObject.toLocaleDateString('en-IN', options);
                                return (
                                    <tr key={index}>
                                        <td style={{ fontSize: '17px' }} className={Number(obj?.Pay_Status) === 1 ? 'bg-success  text-white' : 'bg-light'}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input shadow-none"
                                                checked={selectedBill[index]?.check}
                                                onChange={(e) => handleCheckboxChange(e, index)} />
                                        </td>
                                        <td style={{ fontSize: '13px' }} className={Number(obj?.Pay_Status) === 1 ? 'bg-success  text-white' : ''}>{formattedDate}</td>
                                        <td style={{ fontSize: '13px' }} className={Number(obj?.Pay_Status) === 1 ? 'bg-success  text-white' : 'bg-light'}>{obj.ledger_name}</td>
                                        <td style={{ fontSize: '13px' }} className={Number(obj?.Pay_Status) === 1 ? 'bg-success  text-white' : ''}>{obj.invoice_no}</td>
                                        <td style={{ fontSize: '13px' }} className={Number(obj?.Pay_Status) === 1 ? 'bg-success  text-white' : 'text-primary bg-light'}>{obj.Bal_Amount.toLocaleString('en-IN')}</td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={<ArrowBackIosNew />}
                        onClick={() => { setOpen(!open); setRefresh(!refresh) }} >Go Back</Button>
                    <Button
                        color="success"
                        variant="outlined"
                        startIcon={<CurrencyRupee />}
                        onClick={PayCheck}>Proceed to pay </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={detailsDialog} onClose={() => { setDetailsDialog(false); setRefresh(!refresh) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg" fullWidth>
                <DialogTitle sx={{ fontSize: '14px' }} className="fw-bold text-primary">Selected Bills</DialogTitle>

                <DialogContent className="p-0">

                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ fontSize: '13px' }}>Date</th>
                                <th style={{ fontSize: '13px' }}>Ledger</th>
                                <th style={{ fontSize: '13px' }}>InvoiceNo</th>
                                <th style={{ fontSize: '13px' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBill.map((item, index) => {
                                const dateObject = new Date(props.CompanyBalanceInfo[index].invoice_date);
                                const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                                const formattedDate = dateObject.toLocaleDateString('en-IN', options);
                                return item.check === true && (
                                    <tr key={index}>
                                        <td style={{ fontSize: '13px' }} className=" bg-light">{formattedDate}</td>
                                        <td style={{ fontSize: '12px' }}>{props.CompanyBalanceInfo[index].ledger_name}</td>
                                        <td style={{ fontSize: '13px' }} className=" bg-light">{props.CompanyBalanceInfo[index].invoice_no}</td>
                                        <td style={{ fontSize: '13px' }} className="text-primary fw-bold">{props.CompanyBalanceInfo[index].Bal_Amount.toLocaleString('en-IN')}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td>Total :</td>
                                <td className="text-success fw-bold">{totalAmount().toLocaleString('en-IN')}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                    {Number(paymentType) === 1 &&
                        <>
                            <div className="row p-2">
                                <div className="col-lg-3 col-md-5 d-flex align-items-center flex-column">
                                    {/* {qrCodeURL && (
                                    <img src={qrCodeURL} alt="qr_code" />
                                )} */}
                                    <img src={ShankarTraderQRC} alt="qrc" height={260} />
                                    {/* <h5 className="text-uppercase mb-0 mt-2">Scan And PAY</h5> */}
                                </div>
                                <div className="col-lg-9 col-md-7 p-1">
                                    <h5 className="text-uppercase ">BANK DETAILS</h5>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td className=" border-0">Bank Name</td>
                                                <td className=" border-0">{bankObj.Bank_Name ? bankObj.Bank_Name : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className=" border-0">Account Number</td>
                                                <td className=" border-0">{bankObj.Account_No ? bankObj.Account_No : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className=" border-0">Account Holder Name</td>
                                                <td className=" border-0">{bankObj.Account_Holder_Name ? bankObj.Account_Holder_Name : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className=" border-0">IFSC Code</td>
                                                <td className=" border-0">{bankObj.IFSC_Code ? bankObj.IFSC_Code : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className=" border-0">UPI</td>
                                                <td className=" border-0">{bankObj.UPI_Number ? bankObj.UPI_Number : '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-md-4 p-3">
                                <label>Enter Transaction Id</label>
                                <input className="form-control p-2" onChange={(e) => setTransactioId(e.target.value)} value={TransactionID} />
                            </div>
                        </>
                    }
                </DialogContent>

                <DialogActions>
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={() => { setDetailsDialog(false); setRefresh(!refresh) }} >Cancel</Button>
                    <Button
                        color="success"
                        variant="outlined"
                        startIcon={Number(paymentType) === 2 ? <CurrencyRupee /> : undefined}
                        disabled={(Number(paymentType) === 1 && !TransactionID)}
                        onClick={
                            Number(paymentType) === 1
                                ? () => { postManualPay() }
                                : () => displayRazorpay(selectedBill)
                        }>{Number(paymentType) === 1 ? 'Submit' : 'Pay'} </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}


const PendingInvoice = () => {
    const [balance, setBalance] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [isCustomer, setIsCustomer] = useState(false)
    const [bankDetails, setBankDetails] = useState([]);

    useEffect(() => {
        pageRights(2, 2017).then(rights => {
            setPageInfo(rights)
        })
    }, [])

    useEffect(() => {
        if (parseInt(pageInfo?.permissions?.Read_Rights) === 1) {
            fetch(`${apihost}/api/paymentInvoiceList?UserId=${pageInfo.UserId}`, {
                headers: {
                    'Authorization': pageInfo?.token,
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(data => {
                    if (data.status === 'Success') {
                        const groupedData = data.data.reduce((acc, item) => {
                            const companyName = item.Company_Name;
                            const index = acc.findIndex((group) => group.CompName === companyName);

                            if (index === -1) {
                                acc.push({ CompName: companyName, CompanyBalanceInfo: [item] });
                            } else {
                                acc[index].CompanyBalanceInfo.push(item);
                            }

                            return acc;
                        }, []);
                        setBalance(groupedData);
                    }

                    if (data?.isCustomer) {
                        setIsCustomer(true)
                    } else {
                        setIsCustomer(false)
                    }
                })
            fetch(`${apihost}/api/BankDetails`, {
                headers: {
                    'Authorization': pageInfo?.token,
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(data => {
                    setBankDetails(data.data)
                })
        }
    }, [pageInfo])



    return isCustomer ? (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'PAYMENTS'} subMenuId={'PENDING INVOICE LIST'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>PENDING INVOICE LIST</h5>
                        <h6>PAYMENTS &nbsp;<NavigateNext fontSize="small" />&nbsp; PENDING INVOICE LIST</h6>
                    </div>

                    <div className="p-2">
                        <div className="card" style={{ maxHeight: '80vh' }}>

                            <div className="card-header fw-bold bg-white">
                                Pending Amount
                            </div>

                            <div className="card-body p-0">
                                <table className="table border mb-0">
                                    <thead>
                                        <tr>
                                            <th>Action</th>
                                            <th>Company</th>
                                            <th>Bills</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {balance.map((obj, index) => <BillComponent props={obj} key={index} bankDetails={bankDetails} />)}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <>
        </>
    )
}

export default PendingInvoice;