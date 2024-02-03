import React, { useEffect, useState, useContext, useMemo } from "react";
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, FilterAlt } from '@mui/icons-material';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';


const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const today = formatDate(new Date());

const PurchaseReport = () => {
    const { compData } = useContext(CurrentCompany)
    const [purchaseOrderData20, setPurchaseOrderData20] = useState([]);
    const [purchaseOrderData3, setPurchaseOrderData3] = useState([]);
    const allOption = { value: 0, label: 'ALL' };
    const [selectedValue, setSelectedValue] = useState({
        Report_Type: 2,
        Fromdate: today,
        Todate: today,
        Customer_Id: allOption.value,
        Item_Id: allOption.value,
        BillNo: '',
        CustomerGet: allOption.label,
        ItemGet: allOption.label,
    });
    const [dialog, setDialog] = useState(false)
    const [pageAccess, setPageAccess] = useState({});
    const [view, setView] = useState('Table')


    useEffect(() => {
        pageRights(2, 1017).then(per => {
            setPageAccess(per)
        })
    }, [])

    useEffect(() => {
        setPurchaseOrderData20([]);
        setPurchaseOrderData3([]);
        if (pageAccess?.permissions?.Read_Rights === 1) {
            if (view === 'Table') {
                fetch(`${apihost}/api/PurchaseOrderReportTable?Report_Type=${selectedValue.Report_Type}&Fromdate=${selectedValue.Fromdate}&Todate=${selectedValue.Todate}&Customer_Id=${selectedValue.Customer_Id}&Item_Id=${selectedValue.Item_Id}&BillNo=${selectedValue.BillNo}`, {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': pageAccess.token,
                        'Db': compData.id
                    }
                }).then(res => { return res.json() }).then(data => {
                    if (data.status === 'Success') {
                        data.data.sort((a, b) => a.po_no - b.po_no);
                        data.data.map(obj => {
                            // const parsed = obj?.product_details ? JSON.parse(obj.product_details) : []
                            obj.po_date = obj?.po_date.split('T')[0].split('-').reverse().join('-');
                            obj.product_details = parsed
                        })
                        console.log(data.data)
                        if (parseInt(selectedValue.Report_Type) === 2 || parseInt(selectedValue.Report_Type) === 0) {
                            setPurchaseOrderData20(data.data)
                            setPurchaseOrderData3([])
                        } else {
                            setPurchaseOrderData3(data.data)
                            setPurchaseOrderData20([])
                        }
                    } else {
                        setPurchaseOrderData20([]);
                        setPurchaseOrderData3([]);
                    }
                })
            } else {
                fetch(`${apihost}/api/PurchaseOrderReportCard?Report_Type=${selectedValue.Report_Type}&Fromdate=${selectedValue.Fromdate}&Todate=${selectedValue.Todate}&Customer_Id=${selectedValue.Customer_Id}&Item_Id=${selectedValue.Item_Id}&BillNo=${selectedValue.BillNo}`, {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': pageAccess.token,
                        'Db': compData.id
                    }
                }).then(res => { return res.json() }).then(data => {
                    if (data.status === 'Success') {
                        data.data.sort((a, b) => a.po_no - b.po_no);
                        data.data.map(obj => {
                            obj.po_date = obj.po_date.split('T')[0].split('-').reverse().join('-');
                            obj.amount = obj?.amount ? obj?.amount.toLocaleString('en-IN') : 0;
                            // obj.product_details = obj?.product_details ? JSON.parse(obj.product_details) : []
                        })
                        console.log(data.data);
                        if (parseInt(selectedValue.Report_Type) === 2 || parseInt(selectedValue.Report_Type) === 0) {
                            setPurchaseOrderData20(data.data)
                            setPurchaseOrderData3([])
                        } else {
                            setPurchaseOrderData3(data.data)
                            setPurchaseOrderData20([])
                        }
                    } else {
                        setPurchaseOrderData20([]);
                        setPurchaseOrderData3([]);
                    }
                })
            }
        }
    }, [pageAccess, compData, selectedValue.Report_Type, selectedValue.Fromdate, selectedValue.Todate, view])



    const pendingAndItemBased = useMemo(() => [
        {
            header: 'Order No',
            accessorKey: 'po_no',
            size: 130,
            enableSorting: false
        },
        {
            header: 'Stock Group',
            accessorKey: 'stock_group_name',
            filterVariant: 'multi-select',
            size: 230,
            enableSorting: false
        },
        {
            header: 'Item Name',
            accessorKey: 'Item_Name_Modified',
            filterVariant: 'multi-select',
            size: 230,
            enableSorting: false
        },
        {
            header: 'Date',
            accessorKey: 'po_date',
            size: 130,
            enableSorting: false
        },
        {
            header: 'Ledger Name',
            accessorKey: 'ledger_name',
            enableSorting: false
        },
        {
            header: '(Q)',
            accessorKey: 'bill_qty',
            size: 130,
            enableSorting: false,
            Cell: (({ row }) => {
                let value = 0;
                if (row.original.bill_qty) {
                    value = (row.original.bill_qty / 100).toLocaleString('en-IN')
                }
                return (
                    <div className="w-100 text-end">
                        {value}
                    </div>
                )
            }),
            AggregatedCell: ({ cell }) => (
                <div className="text-primary fw-bold text-end w-100">
                    {(parseFloat(cell.getValue() / 100).toLocaleString('en-IN'))}
                </div>
            ),
        },
        {
            header: '(R)',
            accessorKey: 'item_rate',
            size: 130,
            enableSorting: false,
            Cell: (({ row }) => {
                let value = 0;
                if (row.original.item_rate) {
                    value = (row.original.item_rate / 100).toLocaleString('en-IN')
                }
                return (
                    <div className="w-100 text-end">
                        {value}
                    </div>
                )
            }),

            aggregationFn: 'mean',
            AggregatedCell: ({ cell }) => (
                <div className="text-primary fw-bold text-end w-100">
                    {(parseFloat(cell.getValue() / 100).toLocaleString('en-IN'))}
                </div>
            ),
        },
        {
            header: '₹ Total',
            accessorKey: 'amount',
            size: 130,
            enableSorting: false,
            Cell: (({ row }) => {
                let value = 0;
                if (row.original.amount) {
                    value = (row.original.amount / 100).toLocaleString('en-IN')
                }
                return (
                    <div className="w-100 text-end">
                        {value}
                    </div>
                )
            }),
            AggregatedCell: ({ cell }) => (
                <div className="text-primary fw-bold text-end w-100">
                    {(parseFloat(cell.getValue() / 100).toLocaleString('en-IN'))}
                </div>
            ),
        },
    ], [selectedValue.Report_Type, view])

    const pendingAndItemBasedTable = useMaterialReactTable({
        columns: pendingAndItemBased,
        data: purchaseOrderData20,
        enableFacetedValues: true,
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableColumnOrdering: true,
        enableColumnPinning: true,
        initialState: {
            density: 'compact',
            expanded: false,
            pagination: { pageIndex: 0, pageSize: 100 },
            grouping: ['stock_group_name', 'Item_Name_Modified'],
            columnVisibility: { po_no: false, po_date: false }
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '60vh' } },
        muiTableBodyCellProps: { sx: { fontSize: '13px', textAlign: 'center' } }
    })

    const OrderBased = useMemo(() => [
        {
            header: 'No',
            accessorKey: 'po_no',
            size: 90,
            enableSorting: false
        },
        {
            header: 'Date',
            accessorKey: 'po_date',
            enableSorting: false,
            size: 100
        },
        {
            header: 'Ledger Name',
            accessorKey: 'ledger_name',
            size: 400,
            enableSorting: false
        },
        {
            header: 'Amount',
            accessorKey: 'invoice_value_after_tax',
            Cell: (({ row }) => {
                let Amount = 0;
                if (row.original?.invoice_value_after_tax) {
                    Amount = row.original?.invoice_value_after_tax.toLocaleString('en-IN')
                }
                return Amount
            }),
            enableSorting: false
        },
        {
            header: 'Canceled?',
            accessorKey: 'cancel_status',
            Cell: (({ row }) => (
                <span className={row.original?.cancel_status === 'Yes' ? "float-end bg-danger text-light px-3 rounded" : "float-end bg-success text-light px-3 rounded"}>
                    {row.original?.cancel_status}
                </span>
            )),
            enableSorting: false
        }
    ], [selectedValue.Report_Type, view])

    const PurchaseOrderBasedTable = useMaterialReactTable({
        columns: OrderBased,
        data: purchaseOrderData3,
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableColumnOrdering: true,
        enableColumnPinning: true,
        initialState: {
            density: 'compact',
            expanded: false,
            pagination: { pageIndex: 0, pageSize: 100 },
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '60vh' } },
    })

    // useEffect(() => console.log(parseInt(selectedValue.Report_Type), typeof selectedValue.Report_Type), [selectedValue.Report_Type])

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header setting={true} />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'REPORTS'} subMenuId={'PURCHASE REPORT'} />
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
                        {view === 'Card'
                            ?
                            <>
                                <div className="row" style={{ maxHeight: '69vh', overflowY: 'scroll' }}>
                                    {(parseInt(selectedValue.Report_Type) === 3) &&
                                        purchaseOrderData3.map((obj, index) => (
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
                                        ))
                                    }
                                    {(parseInt(selectedValue.Report_Type) === 2 || parseInt(selectedValue.Report_Type) === 0) &&
                                        purchaseOrderData20.map((obj, index) => (
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
                                                            <span
                                                                className="float-start"
                                                                style={{ width: '65%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {obj?.ledger_name}
                                                            </span>
                                                            <span className="float-end text-primary fw-bold h5">
                                                                {obj.product_details && obj.product_details[0] && obj.product_details[0].invoice_value_after_tax
                                                                    ? obj.product_details[0].invoice_value_after_tax.toLocaleString('en-IN')
                                                                    : null}
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
                                                                        <td className="text-start p-2">{ob?.Item_Name_Modified}</td>
                                                                        <td className="p-2">{ob?.rate.toLocaleString('en-IN')}</td>
                                                                        <td className="p-2">{ob?.bill_qty.toLocaleString('en-IN')}</td>
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
                                        ))
                                    }
                                </div>
                            </>
                            :
                            <>
                                {
                                    ((parseInt(selectedValue.Report_Type) === 0) || (parseInt(selectedValue.Report_Type) === 2))
                                    && <MaterialReactTable table={pendingAndItemBasedTable} />
                                }
                                {(parseInt(selectedValue.Report_Type) === 3) && <MaterialReactTable table={PurchaseOrderBasedTable} />}
                            </>
                        }
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
                            onChange={(e) => setSelectedValue({ ...selectedValue, Report_Type: e.target.value })}>
                            <option value={2}>PENDING PURCHASE ORDER</option>
                            <option value={0}>ITEM BASED</option>
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

                    <div className="col-md-4 p-2">
                        <label className="p-2">VIEW</label>
                        <select
                            className="form-select"
                            value={view}
                            style={{ padding: '0.64em', borderColor: 'lightgray', borderRadius: '4px' }}
                            onChange={(e) => setView(e.target.value)}>
                            <option value={'Table'}>Table</option>
                            <option value={'Card'}>Card</option>
                        </select>
                    </div>
                </DialogContent><hr className="m-0" />
                <DialogActions>
                    <Button variant="contained" onClick={() => setDialog(!dialog)}>Apply</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PurchaseReport;