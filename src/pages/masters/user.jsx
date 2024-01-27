import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../backendAPI";
import { customStyles } from "../../components/tablecolumn";
import Header from '../../components/header/header'
import Sidebar from "../../components/sidenav/sidebar"
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button, TextField, MenuItem, IconButton } from "@mui/material";
import { useFormik } from 'formik';
import { AccountCircle, LockOutlined, LocationOn, ManageAccounts, NavigateNext, RecentActors, Edit, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../com.css';
import { pageRights } from "../../components/rightsCheck";
import Loader from '../../components/loader/loader'

const initialValues = {
    userid: 0,
    name: '',
    mobile: '',
    password: '',
    branch: '',
    usertype: ''
}

const validate = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = 'Name is required';
    }

    // if (!values.mobile) {
    //     errors.mobile = 'Mobile number is required';
    // } else if (!/^\d{10}$/.test(values.mobile)) {
    //     errors.mobile = 'Invalid mobile number. Please enter a 10-digit number.';
    // }

    // if (!values.email) {
    //     errors.email = 'Email is required';
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    //     errors.email = 'Invalid email address';
    // }

    if (!values.branch) {
        errors.branch = 'Branch is required';
    }

    if (!values.usertype) {
        errors.usertype = 'User Type is required';
    }

    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 5) {
        errors.password = 'Password must be at least 5 characters long';
    }

    return errors;
};

const User = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [branch, setBranch] = useState([]);
    const [userType, setUserType] = useState([]);
    const token = localStorage.getItem('userToken');
    const [refresh, setRefresh] = useState(false);
    const [modify, setModify] = useState({
        add: false,
        edit: false,
        delete: false
    })
    const [dopen, setdopen] = useState(false);
    const [delid, setdelid] = useState(null);

    useEffect(() => {
        pageRights(2, 1014).then(rights => {
            if (rights.permissions.Read_Rights === 1) {
                fetch(`${apihost}/api/users`, { headers: { 'Authorization': rights.token } })
                    .then((res) => { return res.json() })
                    .then((data) => {
                        if (data.status === "Success") {
                            setData(data.data)
                        }
                    })
                    .catch((e) => { console.log(e) })
            }
            setModify({
                add: rights.permissions.Add_Rights === 1,
                edit: rights.permissions.Edit_Rights === 1,
                delete: rights.permissions.Delete_Rights === 1,
            });
        })
    }, [token, refresh]);

    useEffect(() => {
        if (token) {
            fetch(`${apihost}/api/usertype`, { headers: { 'Authorization': token } })
                .then((res) => { return res.json() })
                .then((data) => {
                    if (data.status === "Success") {
                        setUserType(data.data)
                    }
                })
                .catch((e) => { console.log(e) });
            fetch(`${apihost}/api/branch`, { headers: { 'Authorization': token } })
                .then((res) => { return res.json() })
                .then((data) => {
                    if (data.status === "Success") {
                        setBranch(data.data)
                    }
                })
                .catch((e) => { console.log(e) });
        }
    }, [token])

    const formik = useFormik({
        initialValues,
        validate,
        onSubmit: (values, actions) => {
            fetch(`${apihost}/api/users`, {
                method: values.userid == 0 ? 'POST' : 'PUT',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid: values.userid,
                    name: values.name,
                    mobile: values.mobile,
                    usertype: values.usertype,
                    password: values.password,
                    branch: values.branch
                })
            })
                .then((res) => res.json())
                .then((resdata) => {
                    setOpen(false);
                    setRefresh(!refresh);
                    if (resdata.status === "Success") {
                        toast.success(resdata.message);
                        actions.resetForm();
                    } else {
                        toast.error(resdata.message);
                    }
                })
                .catch((e) => console.log(e));
        },

    });

    function onlynum(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }

    const users = [
        {
            name: 'UserId',
            selector: (row) => row.UserId,
            sortable: true,
            maxWidth: '50px'
        },
        {
            name: 'Name',
            selector: (row) => row.Name,
            sortable: true,
        },
        {
            name: 'Mobile',
            selector: (row) => row.Mobile,
            sortable: true,
        },
        {
            name: 'User Type',
            selector: (row) => row.UserType,
            sortable: true,
        },
        {
            name: 'Branch Name',
            selector: (row) => row.BranchName,
            sortable: true,
        },
        {
            name: 'Token',
            selector: (row) => row.Token,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    {modify.edit === true && <IconButton onClick={() => handleEdit(row)}><Edit /></IconButton>}
                    {modify.delete === true && <IconButton onClick={() => handleDelete(row)}><Delete sx={{ color: '#FF6865' }} /></IconButton>}
                </div>
            ),
        },
    ];

    const handleEdit = (row) => {
        formik.setValues({
            ...formik.values,
            userid: row.UserId,
            name: row.Name,
            mobile: row.Mobile,
            password: row.Password,
            branch: row.BranchId,
            usertype: row.UserTypeId
        });
        setOpen(true)
    };

    const handleDelete = (row) => {
        setdopen(true);
        setdelid(row.UserId)
    };

    const deleteuser = () => {
        fetch(`${apihost}/api/users/${delid}`, {
            method: 'DELETE',
            headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        }).then(res => res.json()).then(resdata => {
            setdopen(false);
            setRefresh(!refresh);
            if (resdata.status === 'Success') {
                toast.success(resdata.message);
            }
        });
    };


    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header setting={true} />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'USER MASTER'} />
                </div>
                
                <div className="col-md-10">
                    <div className="comhed">
                        {modify.add === true && <button className="comadbtn" onClick={() => setOpen(true)}>Add User</button>}
                        <h5>Users</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp; USER MASTERS</h6>
                    </div>
                    <div className="px-4">
                        <br />
                        {data && data.length
                            ? <div className="box">
                                <DataTable
                                    columns={users}
                                    data={data}
                                    pagination
                                    highlightOnHover={true}
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight={'100vh'}
                                    customStyles={customStyles}
                                />
                            </div>
                            : <Loader />}
                    </div>
                </div>
            </div>

            <Dialog
                open={open}
                onClose={() => { setOpen(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    {formik.values.userid === 0 ? "Create New User" : "Update User"}
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <div className="row">
                            <div className="col-md-4 p-3">
                                <TextField fullWidth id="name" name="name" label="Name" variant="outlined"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    InputProps={{
                                        startAdornment: (<AccountCircle color="action" style={{ marginRight: '8px' }} />),
                                        inputProps: { style: { padding: '26px' } }
                                    }}
                                />
                            </div>
                            <div className="col-md-4 p-3">
                                <TextField fullWidth id="mobile" name="mobile" label="Mobile Number" variant="outlined"
                                    // onInput={(e) => {
                                    //     onlynum(e)
                                    // }}
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.mobile}
                                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                    helperText={formik.touched.mobile && formik.errors.mobile}
                                    InputProps={{
                                        startAdornment: (<RecentActors color="action" style={{ marginRight: '8px' }} />),
                                        inputProps: { style: { padding: '26px' } }
                                    }}
                                />
                            </div>
                            <div className="col-md-4 p-3">
                                <TextField fullWidth id="password" name="password" label="Password" type="password" variant="outlined"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    InputProps={{
                                        startAdornment: (<LockOutlined color="action" style={{ marginRight: '8px' }} />),
                                        inputProps: { style: { padding: '26px' } }
                                    }}
                                />
                            </div>
                            <div className="col-md-4 p-3">
                                <TextField fullWidth id="branch" name="branch" select label="Branch" variant="outlined"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.branch}
                                    error={formik.touched.branch && Boolean(formik.errors.branch)}
                                    helperText={
                                        formik.touched.branch && formik.errors.branch
                                            ? formik.errors.branch
                                            : 'Please select your branch'
                                    }
                                    InputProps={{
                                        startAdornment: (<LocationOn color="action" style={{ marginRight: '8px' }} />),
                                        inputProps: { style: { padding: '26px' } }
                                    }}
                                >
                                    {branch.map((branch) => (
                                        <MenuItem key={branch.BranchId} value={branch.BranchId}>
                                            {branch.BranchName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div className="col-md-4 p-3">
                                <TextField fullWidth id="usertype" name="usertype" select label="User Type" variant="outlined"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.usertype}
                                    error={formik.touched.usertype && Boolean(formik.errors.usertype)}
                                    helperText={
                                        formik.touched.usertype && formik.errors.usertype
                                            ? formik.errors.usertype
                                            : 'Please select your user type'
                                    }
                                    InputProps={{
                                        startAdornment: (<ManageAccounts color="action" style={{ marginRight: '8px' }} />),
                                        inputProps: { style: { padding: '26px' } }
                                    }}
                                >
                                    {userType.map((userType) => (
                                        <MenuItem key={userType.Id} value={userType.Id}>
                                            {userType.UserType}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setOpen(false); formik.handleReset() }}>Close</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog
                open={dopen}
                onClose={() => { setdopen(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b style={{ color: 'black', padding: '0px 20px' }}>Do you Want to Delete?</b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setdopen(false)}>Cancel</Button>
                    <Button onClick={deleteuser} autoFocus sx={{ color: 'red' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default User;
