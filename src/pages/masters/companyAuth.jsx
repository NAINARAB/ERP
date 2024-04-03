import React, { useEffect, useState } from "react";
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, Checkbox } from "@mui/material";
import {  customSelectStyles } from "../../components/tablecolumn";
import { ToastContainer, toast } from 'react-toastify';
import { pageRights } from "../../components/rightsCheck";
import Select from 'react-select';
import CurrentPage from "../../components/currentPage";


const postCheck = (user, comp, rights) => {
    fetch(`${apihost}/api/companyAuthorization`, {
        method: 'POST',
        body: JSON.stringify({
            UserId: user,
            Company_Id: comp,
            View_Rights: rights ? 1 : 0
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': localStorage.getItem('userToken')
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === "Failure") {
                toast.error(data.message)
            }
        }).catch(e => console.log(e))
}


const TRow = ({ UserId, data, Sno, permission }) => {
    const [viewRights, setViewRights] = useState(Number(data.View_Rights) === 1)
    const [pflag, setpFlag] = useState(false);

    useEffect(() => {
        setViewRights(Number(data.View_Rights) === 1);
    }, [data])

    useEffect(() => {
        if (pflag === true) {
            postCheck(UserId, data.Company_Id, viewRights)
        }
    }, [viewRights])

    return (
        <>
            <TableRow hover={true}>
                <TableCell>{Sno}</TableCell>
                <TableCell>{data.Company_Name}</TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={viewRights}
                        onChange={permission ? () => { setpFlag(true); setViewRights(!viewRights) } : () => {}} />
                </TableCell>
            </TableRow>
        </>
    );
}


const CompanyAuth = () => {
    const [users, setUsers] = useState([]);
    const [compAuth, setCompAuth] = useState([]);
    const [currentUserId, setCurrentUserId] = useState({
        UserId: localStorage.getItem('UserId'),
        Name: localStorage.getItem('Name')
    });
    const [currentAuthId, setCurrentAuthId] = useState(localStorage.getItem('userToken'))
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
        fetch(`${apihost}/api/myCompanys?Auth=${currentAuthId}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "Success") {
                    setCompAuth(data.data)
                } else {
                    setCompAuth([])
                }
            })
            .catch(e => console.log(e))
    }, [currentAuthId])

    const headColumn = [
        {
            headname: 'SNo',
            variant: 'head',
            align: 'left',
            width: 100
        },
        {
            headname: 'Company Name',
            variant: 'head',
            align: 'left'
        },
        {
            headname: 'Rights',
            variant: 'head',
            align: 'left'
        },
    ]

    const handleUserChange = (selectedOption) => {
        if (selectedOption) {
            const selectedUser = users.find(user => user.UserId === selectedOption.value);
            setCurrentUserId({UserId: selectedUser.UserId, Name: selectedUser.Name});
            setCurrentAuthId(selectedUser?.Token)
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'COMPANY AUTHORIZATION'} />
                </div>
                <div className="col-md-10 p-3">

                    <CurrentPage
                        SubMenu={'COMPANY AUTHORIZATION'}
                        MainMenu={'MASTERS'} />

                    <div className="row mb-3">
                        <div className="col-sm-4 pt-1">
                            <Select
                                value={{value: currentUserId.UserId, label: currentUserId.Name}}
                                onChange={handleUserChange}
                                options={[...users.map(o => ({ value: o?.UserId, label: o?.Name}))]}
                                styles={customSelectStyles}
                                isSearchable={true}
                                placeholder={"Select User"}
                            />
                        </div>
                    </div>

                    <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {headColumn.map((obj, i) => (
                                        <TableCell
                                            key={i}
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
                                {compAuth.map((obj, i) => (
                                    <TRow
                                        key={i}
                                        data={obj}
                                        UserId={currentUserId.UserId}
                                        Sno={i + 1} 
                                        permission={Boolean(Number(pageInfo?.permissions?.Edit_Rights))} 
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
            </div>
        </>
    )
}

export default CompanyAuth