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
import axios from 'axios';
import Loader from "../../components/loader/loader";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

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
            })
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
                                    <TableCell>{obj.productName}</TableCell>
                                    <TableCell>{obj.productCode}</TableCell>
                                    <TableCell>{obj.billedQty}</TableCell>
                                    <TableCell>{obj.rate}</TableCell>
                                    <TableCell>{obj.uom}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const table = useMaterialReactTable({
        columns: products,
        data: data === null ? [] : data,
        enableRowSelection: true,
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableRowVirtualization: true,
        enableColumnOrdering: true,
        enableColumnPinning: true,
        enableRowNumbers: true,
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 100 },
            sorting: [{ id: 'orderDate', desc: false }],
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '60vh' } },
        renderDetailPanel: ({ row }) => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              {console.log(row)}
              <ExpandedComponent data={row.original} />
            </Box>
          ),
    })


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
                            </div>
                        </div>
                        <br />
                        {/* <DataTable
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
                            sort={{ field: 'orderDate', order: 'asc' }}
                        /> */}
                        {data === null ? <Loader /> : <MaterialReactTable table={table} />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;
