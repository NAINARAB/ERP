import React, { useEffect, useState } from "react";
import { apihost } from "../../env";
import Header from "../header/header";
import Sidebar from "../sidenav/sidebar";
import { useNavigate } from "react-router-dom";
import { TextField, MenuItem, Slide, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { MainMenu } from "../tablecolumn";
import { Check, Close } from '@mui/icons-material';


const UserAuthorization = () => {
    const token = localStorage.getItem('userToken')
    const nav = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [mainMenu, setMainMenu] = useState([]);
    useEffect(() => {
        if (token) {
            fetch(`${apihost}/api/users`, { headers: { 'Authorization': token } })
                .then((res) => { return res.json() })
                .then((data) => {
                    setUsers(data);
                })
                .catch((e) => { console.log(e) })
            fetch(`${apihost}/api/sidebar`, { headers: { 'Authorization': token } })
                .then((res) => { return res.json() })
                .then((data) => {
                    setMainMenu(data[0])

                })
                .catch((e) => { console.log(e) })
        } else {
            nav('/')
        }
    }, [])
    useEffect(() => { console.log(selectedUser) }, [selectedUser]);
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
                            <TextField fullWidth select label="Select User" variant="outlined"
                                onChange={(e) => setSelectedUser(e.target.value)}
                                InputProps={{ inputProps: { style: { padding: '26px', width: '50%' } } }}
                                value={selectedUser}
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.UserId} value={user.Autheticate_Id}>
                                        {user.UserName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div><br />

                        {selectedUser !== '' ?
                            <>
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
                                                        sx={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}
                                                    >
                                                        {obj.headname}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {mainMenu.map(obj => (
                                            <TableRow key={obj.Main_Menu_Id}>
                                                <TableCell>{obj.Main_Menu_Id}</TableCell>
                                                <TableCell>{obj.MenuName}</TableCell>
                                                <TableCell>{obj.Read_Rights === 1 ?   <Check /> : <Close />}</TableCell>
                                                <TableCell>{obj.Add_Rights === 1 ?    <Check /> : <Close />}</TableCell>
                                                <TableCell>{obj.Edit_Rights === 1 ?   <Check /> : <Close />}</TableCell>
                                                <TableCell>{obj.Delete_Rights === 1 ? <Check /> : <Close />}</TableCell>
                                                <TableCell>{obj.Print_Rights === 1 ?  <Check /> : <Close />}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </> : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}


export default UserAuthorization;