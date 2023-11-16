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


const token = localStorage.getItem('userToken');
const localuserType = localStorage.getItem('UserType')

const postCheck = (param, Menu_id, Menu_Type, usertype) => {
    fetch(`${apihost}/api/usertypeauth`, {
        method: 'POST',
        body: JSON.stringify({
            MenuId: Menu_id,
            MenuType: Menu_Type,
            UserType: usertype,
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


const TypeAuthorization = () => {
    const [usertype, setUserType] = useState([]);
    const [mainMenu, setMainMenu] = useState([]);
    const [subMenu, setSubMenu] = useState([]);
    const [childMenu, setChildMenu] = useState([]);
    const [currentUserType, setCurrentUserType] = useState();

    useEffect(() => {
        pageRights(2, 12).then(rights => {
            fetch(`${apihost}/api/usertype`, { headers: { 'Authorization': rights.token } })
                .then((res) => { return res.json() })
                .then((data) => {
                    if (data.status === "Success") {
                        setUserType(data.data);
                        const crnt = data.data.find(obj => obj.UserType === localuserType)
                        setCurrentUserType(crnt.Id)
                    }
                })
                .catch((e) => { console.log(e) })
        })
    }, [])

    useEffect(() => {
        if (currentUserType) {
            fetch(`${apihost}/api/usertypeauth?usertype=${currentUserType}`, { headers: { 'Authorization': token } })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "Success") {
                        setMainMenu(data.data[0])
                        setSubMenu(data.data[1])
                        setChildMenu(data.data[2])
                    }
                })
                .catch(e => console.log(e))
        }
    }, [currentUserType])


    return (
        <>  <ToastContainer />
            <div className="row" >
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'USER TYPE AUTHORIZATION'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>USER TYPE AUTHORIZATION</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp; USER TYPE AUTHORIZATION</h6>
                    </div>
                    <div className="m-3">
                        <div className="row">
                            <div className="col-sm-4 px-2">
                                <TextField
                                    fullWidth
                                    select
                                    label="Select User Type"
                                    variant="outlined"
                                    onChange={(e) => setCurrentUserType(e.target.value)}
                                    InputProps={{ inputProps: { style: { padding: '26px', width: '50%' } } }}
                                    value={currentUserType ? currentUserType : localuserType}
                                >
                                    {usertype.map((user) => (
                                        <MenuItem key={user.Id} value={user.Id}>
                                            {user.UserType}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </div>
                        </div>

                        <br />
                        {mainMenu.length !== 0
                            &&
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
                                                    UserId={currentUserType}
                                                    subMenu={subMenu}
                                                    childMenu={childMenu} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>}

                    </div>
                </div>
            </div>
        </>
    )
}


export default TypeAuthorization;