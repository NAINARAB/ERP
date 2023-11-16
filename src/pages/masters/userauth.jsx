import React, { useEffect, useState } from "react";
import { apihost } from "../../env";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Checkbox, TextField, MenuItem } from "@mui/material";
import { MainMenu } from "../../components/tablecolumn";
import { UnfoldMore, NavigateNext } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material/';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import { pageRights } from "../../components/rightsCheck";


const token = localStorage.getItem('userToken')

const validate = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Name is required';
    }
    if (!values.mtype) {
        errors.type = 'Select Menu Type';
    }
    if ((values.mtype === 2 && !values.mmenu) || (values.mtype === 3 && !values.mmenu)) {
        errors.mmenu = 'Select Main Menu';
    }
    if (values.mtype === 3 && !values.smenu) {
        errors.smenu = 'Select Sub-Menu'
    }
    if (values.mtype === 3 && !values.link) {
        errors.link = 'Page Link Is Required';
    }
    return errors;
};

const postCheck = (param, Menu_id, Menu_Type, UserId) => {
    fetch(`${apihost}/api/updatesidemenu`, {
        method: 'POST',
        body: JSON.stringify({
            MenuId: Menu_id,
            MenuType: Menu_Type,
            User: UserId,
            ReadRights: param.readRights === true ? 1 : 0,
            AddRights: param.addRights === true ? 1 : 0,
            EditRights: param.editRights === true ? 1 : 0,
            DeleteRights: param.deleteRights === true ? 1 : 0,
            PrintRights: param.printRights === true ? 1 : 0
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': token
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === "Failure") {
                toast.error(data.message)
            }
        })
}

const TRow = ({ UserId, subMenu, childMenu, data }) => {
    const [open, setOpen] = useState(false);
    const [readRights, setReadRights] = useState(data.Read_Rights === 1)
    const [addRights, setAddRights] = useState(data.Add_Rights === 1)
    const [editRights, setEditRights] = useState(data.Edit_Rights === 1)
    const [deleteRights, setDeleteRights] = useState(data.Delete_Rights === 1)
    const [printRights, setPrintRights] = useState(data.Print_Rights === 1)
    const [pflag, setpFlag] = useState(false);

    useEffect(() => {
        setReadRights(data.Read_Rights === 1);
        setAddRights(data.Add_Rights === 1);
        setEditRights(data.Edit_Rights === 1);
        setDeleteRights(data.Delete_Rights === 1);
        setPrintRights(data.Print_Rights === 1);
    }, [data])

    useEffect(() => {
        if (pflag === true) {
            postCheck({ readRights, addRights, editRights, deleteRights, printRights }, data.Main_Menu_Id, 1, UserId)
        }
    }, [readRights, addRights, editRights, deleteRights, printRights])

    return (
        <>
            <TableRow key={data.Main_Menu_Id} hover={true}>
                <TableCell>{data.Main_Menu_Id}</TableCell>
                <TableCell>{data.MenuName}</TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={readRights}
                        onChange={() => { setpFlag(true); setReadRights(!readRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={addRights}
                        onChange={() => { setpFlag(true); setAddRights(!addRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={editRights}
                        onChange={() => { setpFlag(true); setEditRights(!editRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={deleteRights}
                        onChange={() => { setpFlag(true); setDeleteRights(!deleteRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={printRights}
                        onChange={() => { setpFlag(true); setPrintRights(!printRights) }} />
                </TableCell>
                <TableCell>
                    {data.PageUrl === ""
                        && <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            <UnfoldMore />
                        </IconButton>}
                </TableCell>
            </TableRow>
            <Dialog open={open} onClose={() => setOpen(!open)} maxWidth="lg" fullWidth>
                <DialogContent>
                    <h3 style={{ paddingBottom: '0.5em' }}>
                        Sub Menu
                    </h3>
                    <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {MainMenu.map(obj => (
                                        <TableCell
                                            key={obj.id}
                                            variant={obj.variant}
                                            align={obj.align}
                                            width={obj.width}
                                            sx={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}>
                                            {obj.headname}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subMenu.map(obj => (
                                    obj.Main_Menu_Id === data.Main_Menu_Id
                                        ? <STrow key={obj.Sub_Menu_Id} data={obj} UserId={UserId} childMenu={childMenu} />
                                        : null
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(!open)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const STrow = (props) => {
    const [open, setOpen] = useState(false);
    const { data, UserId, childMenu } = props;
    const [readRights, setReadRights] = useState(data.Read_Rights === 1)
    const [addRights, setAddRights] = useState(data.Add_Rights === 1)
    const [editRights, setEditRights] = useState(data.Edit_Rights === 1)
    const [deleteRights, setDeleteRights] = useState(data.Delete_Rights === 1)
    const [printRights, setPrintRights] = useState(data.Print_Rights === 1)
    const [pflag, setpFlag] = useState(false);

    useEffect(() => {
        if (pflag === true) {
            postCheck({ readRights, addRights, editRights, deleteRights, printRights }, data.Sub_Menu_Id, 2, UserId)
        }
    }, [readRights, addRights, editRights, deleteRights, printRights])

    return (
        <>
            <TableRow key={data.Sub_Menu_Id} hover={true}>
                <TableCell>{data.Sub_Menu_Id}</TableCell>
                <TableCell>{data.SubMenuName}</TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={readRights}
                        onChange={() => { setpFlag(true); setReadRights(!readRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={addRights}
                        onChange={() => { setpFlag(true); setAddRights(!addRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={editRights}
                        onChange={() => { setpFlag(true); setEditRights(!editRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={deleteRights}
                        onChange={() => { setpFlag(true); setDeleteRights(!deleteRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={printRights}
                        onChange={() => { setpFlag(true); setPrintRights(!printRights) }} />
                </TableCell>
                <TableCell>
                    {data.PageUrl === ""
                        && <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            <UnfoldMore />
                        </IconButton>}
                </TableCell>
            </TableRow>

            <Dialog open={open} onClose={() => setOpen(!open)} maxWidth="lg" fullWidth>
                <DialogContent>
                    <h3 style={{ paddingBottom: '0.5em' }}>
                        Child Menu
                    </h3>
                    <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {MainMenu.map(obj => (obj.headname !== 'Action' ?
                                        <TableCell
                                            key={obj.id}
                                            variant={obj.variant}
                                            align={obj.align}
                                            width={obj.width}
                                            sx={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}>
                                            {obj.headname}
                                        </TableCell> : null
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {childMenu.map(obj => (
                                    obj.Sub_Menu_Id === data.Sub_Menu_Id
                                        ? <CTrow key={obj.Child_Menu_Id} data={obj} UserId={UserId} />
                                        : null
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(!open)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const CTrow = (props) => {
    const { UserId, data } = props;
    const [readRights, setReadRights] = useState(data.Read_Rights === 1)
    const [addRights, setAddRights] = useState(data.Add_Rights === 1)
    const [editRights, setEditRights] = useState(data.Edit_Rights === 1)
    const [deleteRights, setDeleteRights] = useState(data.Delete_Rights === 1)
    const [printRights, setPrintRights] = useState(data.Print_Rights === 1)
    const [pflag, setpFlag] = useState(false);

    useEffect(() => {
        if (pflag === true) {
            postCheck({ readRights, addRights, editRights, deleteRights, printRights }, data.Child_Menu_Id, 3, UserId)
        }
    }, [readRights, addRights, editRights, deleteRights, printRights])

    return (
        <>
            <TableRow key={data.Child_Menu_Id} hover={true}>
                <TableCell>{data.Child_Menu_Id}</TableCell>
                <TableCell>{data.ChildMenuName}</TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={readRights}
                        onChange={() => { setpFlag(true); setReadRights(!readRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={addRights}
                        onChange={() => { setpFlag(true); setAddRights(!addRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={editRights}
                        onChange={() => { setpFlag(true); setEditRights(!editRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={deleteRights}
                        onChange={() => { setpFlag(true); setDeleteRights(!deleteRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={printRights}
                        onChange={() => { setpFlag(true); setPrintRights(!printRights) }} />
                </TableCell>
            </TableRow>
        </>
    )
}


const UserAuthorization = () => {
    const [users, setUsers] = useState([]);
    const [mainMenu, setMainMenu] = useState([]);
    const [subMenu, setSubMenu] = useState([]);
    const [childMenu, setChildMenu] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentAuthId, setCurrentAuthId] = useState('');
    const [currentUserId, setCurrentUserId] = useState();
    const [pageInfo, setPageInfo] = useState({});

    useEffect(() => {
        pageRights(1, 2).then(rights => {
            setPageInfo(rights)
            fetch(`${apihost}/api/users`, { headers: { 'Authorization': rights.token } })
                .then((res) => { return res.json() })
                .then((data) => {
                    if (data.status === "Success") {
                        setUsers(data.data);
                    }
                })
                .catch((e) => { console.log(e) })
        })
    }, [])

    useEffect(() => {
        fetch(`${apihost}/api/side`, { headers: { 'Authorization': currentAuthId ? currentAuthId : token} })
            .then(res => res.json())
            .then(data => {
                if (data.status === "Success") {
                    setMainMenu(data.data[0])
                    setSubMenu(data.data[1])
                    setChildMenu(data.data[2])
                }
            })
            .catch(e => console.log(e))
    }, [currentAuthId])

    const initialValues = {
        name: '',
        link: '',
        mtype: '',
        mmenu: '',
        smenu: '',
        cmenu: ''
    };

    const formik = useFormik({
        initialValues,
        validate,
        onSubmit: (values) => {
            fetch(`${apihost}/api/newmenu`, {
                method: "POST",
                body: JSON.stringify({
                    menuType: values.mtype,
                    menuName: values.name,
                    menuLink: values.link,
                    mainMenuId: values.mmenu,
                    subMenuId: values.smenu
                }),
                headers: { 'Authorization': pageInfo.token, 'Content-Type': 'application/json' }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "Success") {
                        toast.success("New Menu Created");
                        setOpen(false)
                    } else {
                        toast.error(data.message); setOpen(false)
                    }
                })
                .catch(e => console.log(e))
        },
    });

    return (
        <>  <ToastContainer />
            <div className="row" >
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'USER AUTHORIZATION'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <button className="comadbtn" onClick={() => setOpen(true)}>Add Menu</button>
                        <h5>USER AUTHORIZATION</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp; USER AUTHORIZATION</h6>
                    </div>
                    <div className="m-3">
                        <div className="row">
                            <div className="col-sm-4 px-2">
                                <TextField
                                    fullWidth
                                    select
                                    label="Select User"
                                    variant="outlined"
                                    onChange={(e) => {
                                        const selectedUser = users.find(user => user.Token === e.target.value);
                                        setCurrentAuthId(selectedUser.Token);
                                        setCurrentUserId(selectedUser.UserId);
                                    }}
                                    InputProps={{ inputProps: { style: { padding: '26px', width: '50%' } } }}
                                    value={currentAuthId ? currentAuthId : token}
                                >
                                    {users.map((user) => (
                                        <MenuItem key={user.UserId} value={user.Token}>
                                            {user.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </div>
                        </div>

                        <br />
                        <>
                                <h3 style={{ paddingBottom: '0.5em' }}>Main Menu</h3>
                                <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                                    <Table stickyHeader aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {MainMenu.map(obj => (
                                                    <TableCell
                                                        key={obj.id}
                                                        variant={obj.variant}
                                                        align={obj.align}
                                                        width={obj.width}
                                                        sx={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}>
                                                        {obj.headname}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mainMenu.map(obj => (
                                                <TRow
                                                    key={obj.Main_Menu_Id}
                                                    data={obj}
                                                    UserId={currentUserId}
                                                    subMenu={subMenu}
                                                    childMenu={childMenu} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>

                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={() => setOpen(!open)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    Create New Menu
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <div className="row">
                            <div className="col-md-4 p-3">
                                <TextField fullWidth id="mtype" name="mtype" select label="Menu Type" variant="outlined"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.mtype}
                                    error={formik.touched.mtype && Boolean(formik.errors.mtype)}
                                    helperText={formik.touched.mtype && formik.errors.mtype ? formik.errors.mtype : null}
                                    InputProps={{ inputProps: { style: { padding: '26px' } } }}>
                                    <MenuItem value={1}>Main Menu</MenuItem>
                                    <MenuItem value={2}>Sub Menu</MenuItem>
                                    <MenuItem value={3}>Child Menu</MenuItem>
                                </TextField>
                            </div>
                            <div className="col-md-4 p-3">
                                <TextField fullWidth id="name" name="name" label="Menu Name" variant="outlined"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    InputProps={{
                                        inputProps: { style: { padding: '26px' } }
                                    }}
                                />
                            </div>
                            <div className="col-md-4 p-3">
                                <TextField fullWidth id="link" name="link" label="Page URL" variant="outlined"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.link}
                                    error={formik.touched.link && Boolean(formik.errors.link)}
                                    helperText={formik.touched.link && formik.errors.link
                                        ? formik.errors.link
                                        : null}
                                    InputProps={{ inputProps: { style: { padding: '26px' } } }} />
                            </div>
                            {(formik.values.mtype === 2 || formik.values.mtype === 3)
                                && <div className="col-md-4 p-3">
                                    <TextField fullWidth id="mmenu" name="mmenu" select label="Main Menu" variant="outlined"
                                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.mmenu}
                                        error={formik.touched.mmenu && Boolean(formik.errors.mmenu)}
                                        helperText={formik.touched.mmenu && formik.errors.mmenu ? formik.errors.mmenu : null}
                                        InputProps={{ inputProps: { style: { padding: '26px' } } }}>
                                        {mainMenu.map(obj => (
                                            obj.PageUrl === "" &&
                                            <MenuItem key={obj.Main_Menu_Id} value={obj.Main_Menu_Id}>{obj.MenuName}</MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                            }
                            {formik.values.mtype === 3
                                && <div className="col-md-4 p-3">
                                    <TextField fullWidth id="smenu" name="smenu" select label="Sub Menu" variant="outlined"
                                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.smenu}
                                        error={formik.touched.smenu && Boolean(formik.errors.smenu)}
                                        helperText={formik.touched.smenu && formik.errors.smenu ? formik.errors.smenu : null}
                                        InputProps={{ inputProps: { style: { padding: '26px' } } }}>
                                        {subMenu.map(obj => (
                                            ((obj.Main_Menu_Id === formik.values.mmenu) && (obj.PageUrl === ""))
                                            && <MenuItem key={obj.Sub_Menu_Id} value={obj.Sub_Menu_Id}>{obj.SubMenuName}</MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained">Create</Button>
                        <Button onClick={() => setOpen(!open)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}


export default UserAuthorization;