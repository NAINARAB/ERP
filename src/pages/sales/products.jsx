import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../env";
import { products, subtable, customStyles } from "../../components/tablecolumn";
import Header from '../../components/header/header'
import Sidebar from "../../components/sidenav/sidebar"
import { Sync, NavigateNext } from '@mui/icons-material';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box } from "@mui/material";
import axios from 'axios'


const Product = () => {
    const today = new Date();
    const todaydate = today.toISOString().split('T')[0];
    const [data, setData] = useState([]);
    const [date, setDate] = useState(todaydate)
    const token = localStorage.getItem('userToken')

    useEffect(() => {
        axios.get(`${apihost}/api/productinfo?date=${date}`, {
            headers: {
                'Authorization': token,
            }
        }).then(data => {
            data.data.data.map(obj => {
                obj.transDetails.map(tobj => {
                    tobj.orderNo = obj.orderNo
                })
            })
            setData(data.data.data);
        }).catch(e => console.log(e))
    }, [date]);

    const syncData = () => {
        if (data.length !== 0) {
            fetch(`${apihost}/api/syncsalesorder`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': token,
                    'Db': 'db1'
                },
                body: JSON.stringify({
                    data: data,
                    date: date
                })
            })
                .then(response => response.json())
                .then((data) => {
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
                <h5>Transaction Details ({data.orderNo})</h5>
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
                                    <TableCell>{obj.actualQty}</TableCell>
                                    <TableCell>{obj.amount}</TableCell>
                                    <TableCell>{obj.billedQty}</TableCell>
                                    <TableCell>{obj.closeingStock}</TableCell>
                                    <TableCell>{obj.productCode}</TableCell>
                                    <TableCell>{obj.rate}</TableCell>
                                    <TableCell>{obj.taxAmount}</TableCell>
                                    <TableCell>{obj.taxCode}</TableCell>
                                    <TableCell>{obj.uom}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }


    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={4} subMenuId={6} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>SYNC SALE ORDER</h5>
                        <h6>SALES &nbsp;<NavigateNext fontSize="small" />&nbsp; SYNC SALE ORDER</h6>
                    </div>
                    <div className="m-3">
                        <div className="col-sm-4">
                            <label>Order Date</label><br />
                            <input
                                className="form-control"
                                type='date'
                                value={date}
                                onChange={(e) => {
                                    setDate((e.target.value));
                                    console.log(e.target.value);
                                }} />
                            <br />
                            {/* <button
                                className={date >= todaydate ? 'btn btn-disabled' : 'btn btn-success'}
                                onClick={syncData}
                                disabled={date >= todaydate ? true : false}
                            ><Sync /> &nbsp;Sync Data </button> */}
                        </div><br />
                        <DataTable
                            title="Today Sale Orders"
                            columns={products}
                            data={data}
                            expandableRows
                            expandableRowsComponent={ExpandedComponent}
                            expandableIconColumnIndex={-1}
                            pagination
                            highlightOnHover={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight={"70vh"}
                            customStyles={customStyles}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;
