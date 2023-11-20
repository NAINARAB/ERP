import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../env";
import { subtable } from "../../components/tablecolumn";
import Header from '../../components/header/header'
import Sidebar from "../../components/sidenav/sidebar"
import { Sync, NavigateNext, KeyboardArrowUp, KeyboardArrowRight, BarChart as BC } from '@mui/icons-material';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, IconButton, Collapse, Dialog, DialogContent, DialogActions, Button, DialogTitle } from "@mui/material";
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ProductBased from "./sfproductsaleorder";
import { Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart } from 'recharts';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { schemeCategory10 } from 'd3-scale-chromatic';

const Product = () => {
    const today = new Date();
    const todaydate = today.toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [data, setData] = useState([]);
    const [date, setDate] = useState(todaydate)
    const [from, setFrom] = useState(thirtyDaysAgo.toISOString().split('T')[0])
    const token = localStorage.getItem('userToken');
    const [isSync, setIsSync] = useState(false);
    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const [dispBy, setDispBy] = useState(false)
    const [open, setOpen] = useState(false);

    const totcount = (data) => {
        let total = 0;
        data.forEach(obj => {
            if (obj.orderValue) {
                total = total + parseInt(obj.orderValue, 10) || 0;
            }
        });
        return total;
    };


    useEffect(() => {
        axios.get(`${apihost}/api/sf/saleorders?from=${from}&to=${date}`, {
            headers: {
                'Authorization': token,
            }
        }).then(data => {
            data.data.data.map(obj => {
                obj.transDetails.map(tobj => {
                    tobj.orderNo = obj.orderNo
                })
                obj.orderValue = parseInt(obj.orderValue)
            })
            setTotalOrderValue(totcount(data.data.data))
            setData(data.data.data);
        }).catch(e => console.log(e))
    }, [date, from]);

    const syncData = () => {
        if (data.length !== 0) {
            setIsSync(true);
            fetch(`${apihost}/api/syncsalesorder`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': token,
                },
                body: JSON.stringify({
                    data: data
                })
            })
                .then(response => response.json())
                .then((data) => {
                    setIsSync(false)
                    if (data.status == "Success") {
                        toast.success(data.message);
                    } else {
                        toast.warn(data.message);
                    }
                })
                .catch((e) => { console.log(e) });
        } else {
            toast.warn("No Data");
        }
    }

    const ExpandedComponent = ({ data }) => {
        return (
            <Box sx={{ padding: '2em' }}>
                {/* <h5>Transaction Details ({data.orderNo})</h5> */}
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {subtable.map(obj => (
                                    <TableCell
                                        key={obj.id}
                                        width={obj.width}
                                        sx={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}>
                                        {obj.headname}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.transDetails.map(obj => (
                                <TableRow>
                                    <TableCell>{obj.productCode}</TableCell>
                                    <TableCell>{obj.productName}</TableCell>
                                    <TableCell>{obj.billedQty}</TableCell>
                                    <TableCell>{obj.rate}</TableCell>
                                    <TableCell>{obj.amount}</TableCell>
                                    <TableCell>{obj.closeingStock}</TableCell>
                                    <TableCell>{obj.uom}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const products = [
        {
            header: 'Order Taken By',
            accessorKey: 'orderTakenBy',
            sortable: true,
            minWidth: '100px',
            maxWidth: '140px'
        },
        {
            header: 'Date',
            accessorKey: 'orderDate',
            sortable: true,
            maxWidth: '100px'
        },
        {
            header: 'Cus-ID',
            accessorKey: 'customerId',
            size: 150
        },
        {
            header: 'Customer',
            accessorKey: 'customerName',
            sortable: true,
            maxWidth: '230px'
        },
        {
            header: 'Order Value',
            accessorKey: 'orderValue',
            sortable: true,
            maxWidth: '120px',
            AggregatedCell: ({ cell }) => <div style={{ color: 'blue', fontWeight: 'bold', float: 'right', width: '100%' }}>{parseInt(cell.getValue())}</div>,
            Footer: () => <div style={{ color: 'blue' }}> {totalOrderValue} </div>,
        },
        {
            header: 'Order No',
            accessorKey: 'orderNo',
            size: 230
        },
        {
            header: 'Billing Address',
            accessorKey: 'billingAddress',
            sortable: true,
            minWidth: '200px',
            size: 330
        },
    ];

    const table = useMaterialReactTable({
        columns: products,
        data: data === null ? [] : data,
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableColumnOrdering: true,
        enableRowNumbers: true,
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 100 },
            sorting: [{ id: 'orderDate', desc: false }, { id: 'orderNo', desc: false }],
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '56vh', minHeight: '56vh' } },
        renderDetailPanel: ({ row }) => (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}
            >
                <ExpandedComponent data={row.original} />
            </Box>
        ),
    })

    const totalOrders = data.length;

    const salespersonCounts = data.reduce((counts, salesorder) => {
        const { orderTakenBy } = salesorder;
        counts[orderTakenBy] = (counts[orderTakenBy] || 0) + 1;
        return counts;
    }, {});

    const pieData = Object.entries(salespersonCounts).map(([name, count]) => ({
        name,
        value: (count / totalOrders) * 100,
    }));
    const colorScale = schemeCategory10;


    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={"SALES"} subMenuId={'SALES ORDER SYNC'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>SYNC SALE ORDER</h5>
                        <h6>SALES &nbsp;<NavigateNext fontSize="small" />&nbsp; SYNC SALE ORDER</h6>
                    </div>
                    <div className="p-3">
                        <div className="row">
                            <div className="col-sm-4 p-2">
                                <label>From Date</label><br />
                                <input
                                    className="form-control"
                                    type='date'
                                    value={from}
                                    onChange={(e) => {
                                        setFrom((e.target.value));
                                    }} />
                            </div>
                            <div className="col-sm-4 p-2">
                                <label>To Date</label><br />
                                <input
                                    className="form-control"
                                    type='date'
                                    value={date}
                                    onChange={(e) => {
                                        setDate((e.target.value));
                                    }} />
                            </div>
                            <div className="col-sm-4 p-2">
                                <label></label><br />
                                <button
                                    className={'btn btn-success'}
                                    onClick={syncData} disabled={isSync}>
                                    <Sync /> &nbsp; {isSync ? "Syncing Data" : "Sync Data"}
                                </button>
                                <IconButton onClick={() => setOpen(true)}><BC /></IconButton>
                            </div>
                        </div>
                        <br />

                        <Box sx={{ boxShadow: '0 2px 8px rgb(0, 0, 0, 0.1)' }}>
                            <h5 className="p-4">Order Based
                                <IconButton sx={{ float: 'right' }} onClick={() => setDispBy({ ...dispBy, order: !dispBy.order })}>
                                    {dispBy.order ? <KeyboardArrowUp /> : <KeyboardArrowRight />}
                                </IconButton>
                            </h5>
                            <Collapse in={dispBy.order} timeout="auto" unmountOnExit >
                                <MaterialReactTable table={table} />
                            </Collapse>
                        </Box>
                        <Box sx={{ boxShadow: '0 2px 8px rgb(0, 0, 0, 0.1)', padding: '0' }} >
                            <h5 className="p-4">Product Based
                                <IconButton sx={{ float: 'right' }} onClick={() => setDispBy({ ...dispBy, product: !dispBy.product })}>
                                    {dispBy.product ? <KeyboardArrowUp /> : <KeyboardArrowRight />}
                                </IconButton></h5>
                            <Collapse in={dispBy.product} timeout="auto" unmountOnExit>
                                <ProductBased from={from} to={date} />
                            </Collapse>
                        </Box>

                    </div>

                </div>
            </div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth={'lg'}>
                <DialogTitle id="alert-dialog-title">
                    {"Analysis"}
                </DialogTitle>
                <DialogContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <XAxis dataKey="productName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="customerName" name="Customer" fill="#8884d8" />
                            <Bar dataKey="orderValue" name="Order Value" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colorScale[index % colorScale.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Product;
