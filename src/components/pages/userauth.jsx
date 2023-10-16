import React, { useEffect, useState } from "react";
import { apihost } from "../../env";
import Header from "../header/header";
import Sidebar from "../sidenav/sidebar";
import { useNavigate } from "react-router-dom";
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Checkbox } from "@mui/material";
import { MainMenu } from "../tablecolumn";
import { UnfoldMore } from '@mui/icons-material';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material/';


const token = localStorage.getItem('userToken')

const postCheck = (param, Menu_id, Menu_Type, UserId) => {
    fetch(`${apihost}/api/updatesidemenu`,{
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
        }})
        .then(res => res.json())
        .then(data => console.log(data))
}

const TRow = (props) => {
    const [open, setOpen] = useState(false);
    const UserId = props.UserId;
    const [readRights, setReadRights] = useState(props.data.Read_Rights === 1)
    const [addRights, setAddRights] = useState(props.data.Add_Rights === 1)
    const [editRights, setEditRights] = useState(props.data.Edit_Rights === 1)
    const [deleteRights, setDeleteRights] = useState(props.data.Delete_Rights === 1)
    const [printRights, setPrintRights] = useState(props.data.Print_Rights === 1)
    const [pflag, setpFlag] = useState(false); 
    console.log(props.data)

    useEffect(() => {
        console.log('useEffect in TRow called'); 
        if(pflag === true){
            postCheck({readRights, addRights, editRights, deleteRights, printRights}, props.props.Main_Menu_Id, 1, UserId)
        }
    }, [readRights, addRights, editRights, deleteRights, printRights])

    return(
        <>
            <TableRow key={props.data.Main_Menu_Id} hover={true}>
                <TableCell>{props.data.Main_Menu_Id}</TableCell>
                <TableCell>{props.data.MenuName}</TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={readRights} 
                        onChange={() => {setpFlag(true); setReadRights(!readRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={addRights} 
                        onChange={() => {setpFlag(true); setAddRights(!addRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={editRights} 
                        onChange={() => {setpFlag(true); setEditRights(!editRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={deleteRights} 
                        onChange={() => {setpFlag(true); setDeleteRights(!deleteRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={printRights} 
                        onChange={() => {setpFlag(true); setPrintRights(!printRights)}}/>
                </TableCell>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        <UnfoldMore />
                    </IconButton>
                </TableCell>
            </TableRow>
            <Dialog open={open} onClose={() => setOpen(!open)} maxWidth="lg" fullWidth>
                <DialogContent>
                    <h3 style={{paddingBottom: '0.5em'}}>
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
                                {props.subMenu.map(obj => (
                                    obj.Main_Menu_Id === props.data.Main_Menu_Id 
                                    ? <STrow key={obj.Sub_Menu_Id} props={obj}  UserId={UserId} childMenu={props.childMenu} />
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
    const UserId = props.UserId;
    const [open, setOpen] = useState(false);
    const [readRights, setReadRights] = useState(props.props.Read_Rights === 1)
    const [addRights, setAddRights] = useState(props.props.Add_Rights === 1)
    const [editRights, setEditRights] = useState(props.props.Edit_Rights === 1)
    const [deleteRights, setDeleteRights] = useState(props.props.Delete_Rights === 1)
    const [printRights, setPrintRights] = useState(props.props.Print_Rights === 1)
    const [pflag, setpFlag] = useState(false);
    console.log(props)

    useEffect(() => {
        if(pflag === true){
            postCheck({readRights, addRights, editRights, deleteRights, printRights}, props.props.Sub_Menu_Id, 2, UserId)
        }
    }, [readRights, addRights, editRights, deleteRights, printRights])

    return(
        <>
            <TableRow key={props.props.Sub_Menu_Id} hover={true}>
                <TableCell>{props.props.Sub_Menu_Id}</TableCell>
                <TableCell>{props.props.SubMenuName}</TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={readRights} 
                        onChange={() => {setpFlag(true); setReadRights(!readRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={addRights} 
                        onChange={() => {setpFlag(true); setAddRights(!addRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={editRights} 
                        onChange={() => {setpFlag(true); setEditRights(!editRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={deleteRights} 
                        onChange={() => {setpFlag(true); setDeleteRights(!deleteRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={printRights} 
                        onChange={() => {setpFlag(true); setPrintRights(!printRights)}}/>
                </TableCell>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        <UnfoldMore />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Dialog open={open} onClose={() => setOpen(!open)}  maxWidth="lg" fullWidth>
                <DialogContent>
                    <h3 style={{paddingBottom: '0.5em'}}>
                        Child Menu 
                    </h3>
                    <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                         <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {MainMenu.map(obj => ( obj.headname !== 'Action' ?
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
                                {props.childMenu.map(obj => (
                                    obj.Sub_Menu_Id === props.props.Sub_Menu_Id 
                                    ? <CTrow key={obj.Child_Menu_Id} props={obj} UserId={UserId} /> 
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
    const UserId = props.UserId;
    const [readRights, setReadRights] = useState(props.props.Read_Rights === 1)
    const [addRights, setAddRights] = useState(props.props.Add_Rights === 1)
    const [editRights, setEditRights] = useState(props.props.Edit_Rights === 1)
    const [deleteRights, setDeleteRights] = useState(props.props.Delete_Rights === 1)
    const [printRights, setPrintRights] = useState(props.props.Print_Rights === 1)
    const [pflag, setpFlag] = useState(false);

    useEffect(() => {
        if(pflag === true){
            postCheck({readRights, addRights, editRights, deleteRights, printRights}, props.props.Child_Menu_Id, 3, UserId)
        }
    }, [readRights, addRights, editRights, deleteRights, printRights])

    return(
        <>
            <TableRow key={props.props.Child_Menu_Id} hover={true}>
                <TableCell>{props.props.Child_Menu_Id}</TableCell>
                <TableCell>{props.props.ChildMenuName}</TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={readRights} 
                        onChange={() => {setpFlag(true); setReadRights(!readRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={addRights} 
                        onChange={() => {setpFlag(true); setAddRights(!addRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={editRights} 
                        onChange={() => {setpFlag(true); setEditRights(!editRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={deleteRights} 
                        onChange={() => {setpFlag(true); setDeleteRights(!deleteRights)}}/>
                </TableCell>
                <TableCell>
                    <Checkbox 
                        sx={{'& .MuiSvgIcon-root':{fontSize: 28}}} 
                        checked={printRights} 
                        onChange={() => {setpFlag(true); setPrintRights(!printRights)}}/>
                </TableCell>
            </TableRow>
        </>
    )
}

const UserAuthorization = () => {
    const nav = useNavigate();
    const [users, setUsers] = useState([]);
    const [userID, setUserID] = useState('');
    const [mainMenu, setMainMenu] = useState([]);
    const [subMenu, setSubMenu] = useState([]);
    const [childMenu, setChildMenu] = useState([]);

    const [currentAuthId, setCurrentAuthId] = useState('');


    useEffect(() => {
        if (token) {
            fetch(`${apihost}/api/users`, { headers: { 'Authorization': token } })
                .then((res) => { return res.json() })
                .then((data) => {
                    setUsers(data);
                })
                .catch((e) => { console.log(e) })
        } 
    }, [])

    useEffect(() => {
        if(currentAuthId !== '') {
            users.map(obj => obj.Autheticate_Id === currentAuthId ? setUserID(parseInt(obj.UserId)) : null);
            fetch(`${apihost}/api/sidebar`, { headers: { 'Authorization': currentAuthId } })
                .then(res => res.json())
                .then(data => {
                    setMainMenu(data[0]);
                    setSubMenu(data[1]);
                    setChildMenu(data[2]);
                })
                .catch(e => console.log(e))
        }
    },[currentAuthId])    

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={2} subMenuId={4} />
                </div>
                <div className="col-md-10">
                    <div className="m-3">
                        <h2>User Authorization</h2> <br />
                        <div className="col-sm-4">
                            <select className="form-select" onChange={(e) => setCurrentAuthId(e.target.value)}>
                                <option defaultValue={true}>Select User</option>
                                {users.map((user) => ( user.Autheticate_Id !=='' 
                                ? <option key={user.UserId} value={user.Autheticate_Id}>
                                        {user.UserName}
                                    </option>
                                : null
                                ))}
                            </select>
                        </div><br />
                        <h3 style={{paddingBottom: '0.5em'}}>Main Menu</h3>
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
                                    <TRow key={obj.Main_Menu_Id} data={obj} UserId={userID} subMenu={subMenu} childMenu={childMenu} />
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    )
}


export default UserAuthorization;