import React, { useEffect, useState, useContext } from "react";
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, FilterAlt } from '@mui/icons-material';
import { customSelectStyles } from "../../components/tablecolumn";
import Select from 'react-select';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box } from "@mui/material";
import { Search } from '@mui/icons-material'


const Dropdown = ({ label, options, value, onChange, placeholder }) => (
    <div className="col-md-4 p-2">
        <label className="p p-2">{label}</label>
        <Select
            options={options}
            isSearchable={true}
            placeholder={placeholder}
            styles={customSelectStyles}
            value={value}
            onChange={(selectedOption) => onChange(selectedOption)}
        />
    </div>
);

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const today = formatDate(new Date());

const PurchaseReport = () => {
    const { compData } = useContext(CurrentCompany)
    const [LedgerList, setLedgerList] = useState([]);
    const [StockItemList, setStockItemList] = useState([]);
    const [purchaseOrderData, setPurchaseOrderData] = useState([]);
    const allOption = { value: 0, label: 'ALL' };
    const [selectedValue, setSelectedValue] = useState({
        Report_Type: allOption.value,
        Fromdate: '2020-01-01',
        Todate: today,
        Customer_Id: allOption.value,
        Item_Id: allOption.value,
        BillNo: '',
        CustomerGet: allOption.label,
        ItemGet: allOption.label,
        ReportGet: 'ITEM BASED'
    });
    const [dialog, setDialog] = useState(false)
    const [refresh, setRefresh] = useState(false);
    const [pageAccess, setPageAccess] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    // const [filteredData, setFilteredData] = useState(purchaseOrderData);


    useEffect(() => {
        pageRights(2, 1017).then(per => {
            setPageAccess(per)
            if (per?.permissions?.Read_Rights === 1) {
                fetch(`${apihost}/api/ledgerList`, {
                    headers: {
                        'Authorization': per.token,
                        'Db': compData.id
                    }
                }).then(res => { return res.json() }).then(data => {
                    setLedgerList(data.status === 'Success' ? data.data : [])
                })
                fetch(`${apihost}/api/StockItemList`, {
                    headers: {
                        'Authorization': per.token,
                        'Db': compData.id
                    }
                }).then(res => { return res.json() }).then(data => {
                    setStockItemList(data.status === 'Success' ? data.data : [])
                })
            }
        })
    }, [compData])

    useEffect(() => {
        if (pageAccess?.permissions?.Read_Rights === 1) {
            fetch(`${apihost}/api/PurchaseOrderReport?Report_Type=${selectedValue.Report_Type}&Fromdate=${selectedValue.Fromdate}&Todate=${selectedValue.Todate}&Customer_Id=${selectedValue.Customer_Id}&Item_Id=${selectedValue.Item_Id}&BillNo=${selectedValue.BillNo}`, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageAccess.token,
                    'Db': compData.id
                }
            }).then(res => { return res.json() }).then(data => {
                if (data.status === 'Success') {
                    data.data.sort((a, b) => a.po_no - b.po_no);
                    data.data.map(obj => {
                        const parsed = obj?.product_details ? JSON.parse(obj.product_details) : []
                        obj.po_date = obj?.po_date.split('T')[0].split('-').reverse().join('-');
                        obj.product_details = parsed
                        // obj.invoice_value_after_tax = obj?.invoice_value_after_tax.toLocaleString('en-IN')
                    })
                    console.log(data.data)
                    setPurchaseOrderData(data.data)
                }

            })
        }
    }, [pageAccess, compData, selectedValue.Report_Type, selectedValue.Fromdate, selectedValue.Todate])

    // function handleSearchChange(event) {
    //     const term = event.target.value;
    //     setSearchTerm(term);
    //     const filteredResults = purchaseOrderData.filter(item => {
    //         return Object.values(item).some(value =>
    //             String(value).toLowerCase().includes(term.toLowerCase())
    //         );
    //     });

    //     setFilteredData(filteredResults);
    // }

    // const searchItem = () => {
    //     const filteredData = purchaseOrderData.filter(mainobj => {
    //         mainobj.product_details.some(obj => obj.stock_item_name === searchTerm)
    //     });
    //     return filteredData
    // }

    const filteredData = purchaseOrderData.filter(item => {
        const productDetailsMatch = item.product_details.some(product =>
            product?.stock_item_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const mainObjectMatch =
            item?.po_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.po_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.ledger_name?.toLowerCase().includes(searchTerm.toLowerCase());

        return productDetailsMatch || mainObjectMatch;
    });
    //&& filteredData.length ? filteredData : searchTerm === '' ? purchaseOrderData : []


    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header setting={true} />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'REPORTS'} subMenuId={'LOS REPORT'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <button className="comadbtn filticon" onClick={() => setDialog(!dialog)}><FilterAlt sx={{ color: 'white' }} /></button>
                        <h5 className="text-uppercase">Purchase Report</h5>
                        <h6 className="text-uppercase">REPORTS &nbsp;<NavigateNext fontSize="small" />&nbsp; LOS REPORT</h6>
                    </div>

                    <div className="row p-3">
                        <h5 className="py-2">
                            REPORT OF
                            <span style={{ color: 'rgb(66, 34, 225)' }}> &nbsp;
                                {compData.Company_Name}
                            </span> &nbsp;
                            FROM :
                            <span style={{ color: 'rgb(66, 34, 225)' }}>
                                {selectedValue?.Fromdate?.split('-').reverse().join('-')}
                            </span> &nbsp;
                            TO :
                            <span style={{ color: 'rgb(66, 34, 225)' }}>
                                {selectedValue?.Todate?.split('-').reverse().join('-')}
                            </span>
                        </h5>
                        {selectedValue.Report_Type !== 3 &&
                            <div className="col-md-4 col-sm-12 px-2 pb-0" style={{ marginBottom: 'unset' }}>
                                <input type={'search'} className='micardinpt'
                                    placeholder="Search Here..."
                                    onChange={(e) => {
                                        setSearchTerm((e.target.value).toLowerCase());
                                    }} style={{ paddingLeft: '3em' }} />
                                <div className="sIcon">
                                    <Search sx={{ fontSize: '2em' }} />
                                </div>
                            </div>
                        }
                        <div className="row" style={{ maxHeight: '69vh', overflowY: 'scroll' }}>
                            {selectedValue.Report_Type === 3 && purchaseOrderData.map((obj, index) => (
                                <div className="col-12 col-md-6 col-lg-4 col-xxl-3 p-2" key={index}>
                                    <div className="card">
                                        <div className="card-header pb-0">
                                            <h5 className="h6 fw-bold pb-0">
                                                <span className="float-start">No: {obj?.po_no}</span>
                                                <span className="float-end">{obj?.po_date}</span>
                                            </h5><br />
                                        </div>
                                        <div className={obj.cancel_status === 'Yes' ? "card-body bg-light" : 'card-body'}>
                                            <p className="mb-2 fw-bold text-primary"
                                                style={{ width: '90%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {obj.ledger_name}
                                            </p>
                                            <p>
                                                <span className="float-start">AMOUNT</span>
                                                <span className="float-end">{obj.invoice_value_after_tax}</span>
                                            </p><br />
                                            <p>
                                                <span className="float-start">CANCEL STATUS</span>
                                                <span className={obj.cancel_status === 'Yes' ? "float-end bg-danger text-light px-3 rounded" : "float-end bg-success text-light px-3 rounded"}>{obj.cancel_status}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {selectedValue.Report_Type !== 3 && filteredData.map((obj, index) => (
                                <div className="col-12 col-lg-6 p-2" key={index}>
                                    <div className="card overflow-hidden" style={{ boxSizing: 'border-box' }}>
                                        <div className="card-header pb-0">
                                            <h5 className="h6 fw-bold pb-0">
                                                <span className={obj?.product_details?.length === 0 ? 'float-start text-danger' : "float-start"}>No: {obj?.po_no}</span>
                                                <span className="float-end">{obj?.po_date}</span>
                                            </h5><br />
                                        </div>
                                        <div className={obj.cancel_status === 'Yes' ? "card-body bg-light overflow-x-scroll" : 'card-body overflow-x-scroll'}>
                                            <p className="fw-bold text-primary">
                                                <span className="float-start"
                                                    style={{ width: '65%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{obj.ledger_name}</span>
                                                <span className="float-end text-primary fw-bold h5">
                                                    {obj?.product_details[0]?.invoice_value_after_tax.toLocaleString('en-IN')}
                                                </span>
                                            </p><br />
                                            <p className="text-primary border-bottom">Products :</p>
                                            <table className="w-100 bg-light rounded overflow-x-scroll">
                                                <thead className="text-center border-bottom">
                                                    <tr>
                                                        <td className="text-start p-2">Name</td>
                                                        <td className="p-2">Rate</td>
                                                        <td className="p-2">Quantity</td>
                                                        <td className="p-2">Unit</td>
                                                        <td className="p-2">Amount</td>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                    {obj?.product_details?.map((ob, ind) => (
                                                        <tr key={ind}>
                                                            <td className="text-start p-2">{ob?.stock_item_name}</td>
                                                            <td className="p-2">{ob?.rate}</td>
                                                            <td className="p-2">{ob?.bill_qty}</td>
                                                            <td className="p-2">{ob?.bill_unit}</td>
                                                            <td className="p-2">{ob?.amount.toLocaleString('en-IN')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {obj?.product_details?.length === 0 && <p className="text-danger fw-bold text-end">Order Canceled!</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={dialog} onClose={() => { setDialog(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth>
                <DialogTitle>Filter Options</DialogTitle><hr className="m-0" />
                <DialogContent className="row">
                    <div className="col-md-4 p-2">
                        <label className="p-2">REPORT TYPE</label>
                        <select 
                            className="form-select" 
                            value={selectedValue.Report_Type} 
                            style={{ padding: '0.64em', borderColor: 'lightgray', borderRadius: '4px' }}
                            onChange={(e) => setSelectedValue({...selectedValue, Report_Type: e.target.value })}>
                                <option value={0}>ITEM BASED</option>
                                <option value={2}>PENDING PURCHASE ORDER</option>
                                <option value={3}>PURCHASE ORDER</option>
                        </select>
                    </div>

                    <div className="col-md-4 p-2">
                        <label className="p-2 text-uppercase">From DATE</label>
                        <input
                            type="date"
                            className="form-control"
                            style={{ padding: '0.64em', borderColor: 'lightgray', borderRadius: '4px' }} value={selectedValue?.Fromdate}
                            onChange={(e) => setSelectedValue({ ...selectedValue, Fromdate: e.target.value })} />
                    </div>

                    <div className="col-md-4 p-2">
                        <label className="p p-2 text-uppercase">To DATE</label>
                        <input
                            type="date"
                            className="form-control text-uppercase"
                            style={{ padding: '0.64em', borderColor: 'lightgray', borderRadius: '4px' }} value={selectedValue?.Todate}
                            onChange={(e) => setSelectedValue({ ...selectedValue, Todate: e.target.value })} />
                    </div>
                </DialogContent><hr className="m-0" />
                <DialogActions>
                    <Button variant="contained" onClick={() => { setDialog(!dialog); setRefresh(!refresh) }}>Apply</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PurchaseReport;