import React, { useEffect, useState, useMemo } from "react";
import { apihost } from "../../../backendAPI";
import Header from '../../../components/header/header'
import Sidebar from "../../../components/sidenav/sidebar"
import { NavigateNext, ManageAccounts, TextFormat, Edit, Delete } from '@mui/icons-material';
import { pageRights } from '../../../components/rightsCheck';
import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, IconButton, Avatar, Box, Tooltip } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import CustomerAddScreen from "./newcustomerform";
import '../../com.css';


const CustomerCategories = () => {
    const [CustomerCategories, setCustomerCategories] = useState([])
    const [customers, setCustomers] = useState([])
    const [pageInfo, setPageInfo] = useState({});
    const [open, setOpen] = useState({ create: false, delete: false, update: false });
    const [values, setValues] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [id, setId] = useState('')
    const [rowValue, setRowValue] = useState({})
    const [screen, setScreen] = useState(true);


    useEffect(() => {
        pageRights(3, 9).then(rights => {
            if (rights.permissions.Read_Rights === 1) {
                fetch(`${apihost}/api/usertype`, { headers: { 'Authorization': rights.token } })
                    .then(res => res.json())
                    .then(data => {
                        setCustomerCategories(data.data)
                    })
                fetch(`${apihost}/api/customer`, { headers: { 'Authorization': rights.token } })
                    .then(res => res.json())
                    .then(data => {
                        setCustomers(data.data)
                    })
            } setPageInfo(rights)
        })
    }, [refresh])

    useEffect(() => {
        if(screen === true){
            setRowValue({})
        }
    }, [screen])

    const AddCategories = () => {
        if (values?.name) {
            fetch(`${apihost}/api/usertype`, {
                method: 'POST',
                body: JSON.stringify({ name: values?.name, alias: values?.alias }),
                headers: { 'Authorization': pageInfo?.token, 'Content-Type': 'application/json' }
            }).then(res => res.json())
                .then(data => {
                    if (data.status === 'Success') {
                        setOpen({ ...open, create: false });
                        clearValue()
                        toast.success(data.message)
                        setRefresh(!refresh)
                    } else {
                        toast.error(data.message)
                    }
                })
        } else {
            toast.error('Enter Category Name')
        }
    }

    const deleteCategorie = () => {
        fetch(`${apihost}/api/usertype?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': pageInfo?.token, 'Content-Type': 'application/json' }
        }).then(res => res.json())
            .then(data => {
                if (data.status === 'Success') {
                    setOpen({ ...open, delete: false });
                    setId('')
                    toast.success(data.message)
                    setRefresh(!refresh)
                } else {
                    toast.error(data.message)
                }
            })
    }

    const clearValue = () => {
        setValues({})
    }

    const CustomerColumn = useMemo(() => [
        {
            header: 'Action',
            size: 130,
            Cell: ({ renderedCellValue, row }) => (
                <Box >
                    <Tooltip title="Edit">
                        <IconButton onClick={() => {
                            setRowValue(row.original);
                            setScreen(!screen);
                            }}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => console.log(row.original)}>
                            <Delete />
                        </IconButton>
                    </Tooltip> */}
                </Box>
            )
        },
        {
            header: 'No',
            accessorKey: 'Cust_No',
            size: 110,
            
        },
        {
            header: 'Name',
            accessorKey: 'Customer_name',
            size: 250
        },
        {
            header: 'Phone',
            accessorKey: 'Mobile_no',
            size: 140
        },
        {
            header: 'Type',
            accessorKey: 'UserTypeGet',
        },
        {
            header: 'Contact Person',
            accessorKey: 'Contact_Person',
        },
        {
            header: 'Email',
            accessorKey: 'Email_Id',
        },
        {
            header: 'Under',
            accessorKey: 'underGet',
        },
        {
            header: 'State',
            accessorKey: 'State',
        },
        {
            header: 'Pincode',
            accessorKey: 'Pincode',
        },
        {
            header: 'Gstin',
            accessorKey: 'Gstin',
        },
        {
            header: 'Created By',
            accessorKey: 'EnteyByGet',
        }
    ], [])

    const table = useMaterialReactTable({
        columns: CustomerColumn,
        data: customers,
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
            expanded: true,
            grouping: [],
            pagination: { pageIndex: 0, pageSize: 100 },
            sorting: [{ id: 'Customer_name', desc: false }],
            columnVisibility: { EnteyByGet: false, Gstin: false, Pincode: false, State: false },
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '60vh' } },
    })

    const doRefresh = () => {
        setRefresh(!refresh)
    }

    useEffect(() => {console.error = function() {}})

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'CUSTOMER MASTER'} childMenuId={'CUSTOMER CONFIG'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>CUSTOMER CONFIG</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp;
                            CUSTOMER MASTER &nbsp;<NavigateNext fontSize="small" />&nbsp; CUSTOMER CONFIG</h6>
                    </div>
                    <div className="px-4">
                        <br />
                        {screen ?
                            <>
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="float-start mb-0">User Types</h5>
                                        <span className="float-end">
                                            {pageInfo?.permissions?.Add_Rights === 1 &&
                                                <button className="comadbtn mb-0" onClick={() => setOpen({ ...open, create: true })}>Add</button>
                                            }
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        {CustomerCategories.map(obj =>
                                            <Chip
                                                key={obj?.Id} color="primary"
                                                avatar={<Avatar>{obj.UserType[0].toString().toUpperCase() + obj.UserType[1].toString().toUpperCase()}</Avatar>}
                                                label={obj?.UserType + ' ( ' + obj.Alias + ' ) '}
                                                variant='outlined'
                                                onDelete={
                                                    (obj?.Id > 5 && pageInfo?.permissions?.Delete_Rights === 1)
                                                        ? () => { setId(obj.Id); setOpen({ ...open, delete: true }) }
                                                        : undefined
                                                }
                                                className="m-1" />)}
                                    </div>
                                </div>
                                <br />
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="float-start mb-0">Customers</h5>
                                        <span className="float-end">
                                            {pageInfo?.permissions?.Add_Rights === 1 &&
                                                <button className="comadbtn mb-0" onClick={() => setScreen(!screen)}>Add</button>
                                            }
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <div className="box shadow-none bg-light">
                                            <MaterialReactTable table={table} />
                                        </div>
                                    </div>
                                </div>
                            </>
                            : <CustomerAddScreen
                                screen={screen}
                                setScreen={setScreen}
                                underArray={customers} row={rowValue} refresh={doRefresh}/>
                        }
                    </div>
                </div>
            </div>

            <Dialog
                open={open.create}
                onClose={() => { setOpen({ ...open, create: false }); clearValue(); }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='md' fullWidth>
                <DialogTitle>Add Customer Category</DialogTitle>
                <DialogContent className="row">
                    <div className="col-lg-6 p-2">
                        <TextField fullWidth id="name" name="name" label="UserType" variant="outlined"
                            onChange={e => setValues({ ...values, name: e.target.value })}
                            value={values?.name}
                            error={values?.name === ''}
                            helperText={values.name === '' ? 'Please Enter Category Name' : ''}
                            InputProps={{
                                startAdornment: (<ManageAccounts color="action" style={{ marginRight: '8px' }} />),
                                inputProps: { style: { padding: '26px' } }
                            }}
                        />
                    </div>
                    <div className="col-lg-6 p-2">
                        <TextField fullWidth id="name" name="name" label="Alias Name" variant="outlined"
                            onChange={e => setValues({ ...values, alias: e.target.value })}
                            value={values?.alias}
                            error={values?.alias === ''}
                            helperText={values.alias === '' ? 'Please Enter Category Name' : ''}
                            InputProps={{
                                startAdornment: (<TextFormat color="action" style={{ marginRight: '8px' }} />),
                                inputProps: { style: { padding: '26px' } }
                            }}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <button
                        onClick={() => {
                            setOpen({ ...open, create: false });
                            clearValue()
                        }}
                        className="cancelbtn">
                        Close
                    </button>
                    <button className="comadbtn mb-0" onClick={() => AddCategories()}>
                        Add
                    </button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open.delete}
                onClose={() => { setOpen({ ...open, delete: false }); clearValue(); }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle>
                    {"Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b style={{ color: 'black', padding: '0px 20px' }}>Do you Want to Delete?</b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button
                        onClick={() => {
                            setOpen({ ...open, delete: false })
                        }}
                        className="cancelbtn">
                        Cancel
                    </button>
                    <button className="comadbtn mb-0" onClick={deleteCategorie}>
                        Delete
                    </button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default CustomerCategories;