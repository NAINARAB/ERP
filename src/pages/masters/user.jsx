import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../env";
import { users, customStyles } from "../../components/tablecolumn";
import Header from '../../components/header/header'
import Sidebar from "../../components/sidenav/sidebar"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem } from "@mui/material";
import { useFormik } from 'formik';
import { AccountCircle, MailOutline, LockOutlined, LocationOn, ManageAccounts, NavigateNext } from '@mui/icons-material';


const initialValues = {
    name: '',
    email: '',
    password: '',   
    branch: '',
    usertype: ''
};

const validate = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = 'Name is required';
    }

    if (!values.email) {
        errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.branch) {
        errors.branch = 'Branch is required';
    }

    if (!values.usertype) {
        errors.usertype = 'User Type is required';
    }

    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
};

const User = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [branch, setBranch] = useState([]);
    const [userType, setUserType] = useState([]);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        if (token) {
            fetch(`${apihost}/api/users`,{headers: {'Authorization': token, 'Db': 'db1'}})
                .then((res) => { return res.json() })
                .then((data) => {
                    setData(data);
                })
                .catch((e) => { console.log(e) })
            fetch(`${apihost}/api/usertype`,{headers: {'Authorization': token,'Db': 'db1'}})
                .then((res) => { return res.json() })
                .then((data) => {
                    setUserType(data)
                })
                .catch((e) => { console.log(e) });
            fetch(`${apihost}/api/branch`,{headers: {'Authorization': token, 'Db': 'db1'}})
                .then((res) => { return res.json() })
                .then((data) => {
                    setBranch(data)
                })
                .catch((e) => { console.log(e) });
        }
    }, []);

    const formik = useFormik({
        initialValues,
        validate,
        onSubmit: (values) => {
            console.log(values);
        },
    });

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header setting={true} />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={2} subMenuId={3} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <button className="comadbtn" onClick={() => setOpen(true)}>Add User</button>
                        <h5>Users</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp; USER MASTERS</h6>
                    </div>
                    <div className="m-4">
                        <div style={{ borderRadius: '5px', overflow: 'hidden' }}>
                          <DataTable
                            columns={users}
                            data={data}
                            pagination
                            highlightOnHover={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight={'50vh'}
                            customStyles={customStyles}
                          />
                        </div>
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
                    Create New User
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
                                <TextField fullWidth id="email" name="email" label="Email" variant="outlined"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    InputProps={{
                                        startAdornment: (<MailOutline color="action" style={{ marginRight: '8px' }} />),
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
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
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
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
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
                        <Button onClick={() => { setOpen(false) }}>Close</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </>
    );
}

export default User;
