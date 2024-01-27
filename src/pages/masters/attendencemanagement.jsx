import { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidenav/sidebar';
import { apihost } from '../../backendAPI';
import { pageRights } from '../../components/rightsCheck';
import { NavigateNext, Logout } from '@mui/icons-material';
import DataTable from "react-data-table-component";
import { customStyles, customSelectStyles, attendanceHistoryColumn } from '../../components/tablecolumn';
import { Dialog, IconButton, DialogTitle, DialogContent, DialogActions, Button, Tab, Box } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';


const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

const formatTime = (inputTime) => {
    const [hours, minutes, seconds] = inputTime.split(':');
    const dateObj = new Date(2000, 0, 1, hours, minutes, seconds);
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return formattedTime;
}

function convertDateFormat(inputDate) {
    const [day, month, year] = inputDate.split('-');
    const convertedDate = `${year}-${month}-${day}`;
    return convertedDate;
}


const AttendanceManagement = () => {
    const token = localStorage.getItem('userToken')
    const [activeEmp, setActiveEmp] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
    const [search, setSearch] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
        useDate: false
    });
    const [modify, setModify] = useState({
        add: false,
        edit: false,
        delete: false
    })
    const [dopen, setdopen] = useState(false);
    const [addDialog, setAddDialog] = useState(false)
    const [rowDetails, setRowDetails] = useState({ Id: '', OutDate: '', OutTime: '' });
    const [empData, setEmpData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState({
        Emp_Id: '',
        Emp_Name: '',
        Start_Date: '',
        InTime: '',
    })
    const [attendanceHistory, setAttendanceHistory] = useState([])
    const [tabValue, setTabValue] = useState('1')
    const [selectEmpHis, setSelEmpHis] = useState({
        User_Mgt_Id: 0,
        Emp_Name: 'ALL EMPLOYEE',
    });

    useEffect(() => {
        pageRights(2, 1016).then(per => {
            fetch(`${apihost}/api/ActiveEmployee`, { headers: { 'Authorization': per.token } }).then(res => { return res.json() }).then(data => {
                if (data.status === 'Success') {
                    data.data.map(obj => {
                        obj.Start_Date = obj.Start_Date ? formatDate(obj.Start_Date) : ' - ';
                        obj.InTime = obj.InTime ? formatTime(obj.InTime) : ' - ';
                        return obj;
                    })
                    setActiveEmp(data.data)
                } else { setActiveEmp([]) }
            })
            setModify({
                add: per.permissions.Add_Rights === 1,
                edit: per.permissions.Edit_Rights === 1,
                delete: per.permissions.Delete_Rights === 1,
            });
            fetch(`${apihost}/api/employeeDropDown`, { headers: { 'Authorization': per.token } })
                .then((res) => { return res.json() })
                .then((data) => {
                    if (data.status === "Success") {
                        setEmpData(data.data)
                    }
                })
        })
    }, [refresh])

    useEffect(() => {
        const Mode = Number(selectEmpHis.User_Mgt_Id) === 0 ? 2 : 1
        fetch(`${apihost}/api/UserAttendanceHistory?UserId=${selectEmpHis.User_Mgt_Id}&Mode=${Mode}`, {
            headers: { 'Authorization': localStorage.getItem('userToken') }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "Success") {
                    setAttendanceHistory(data.data)
                }
            })
    }, [selectEmpHis.User_Mgt_Id])

    useEffect(() => {
        const filteredResults = attendanceHistory.filter(item => {
            const itemDate = new Date(item.Start_Date).toISOString().split('T')[0];
            console.log(itemDate);
            return itemDate >= search.from && itemDate <= search.to;
        });

        setFilteredData(filteredResults);
    }, [search.from, search.to])

    const closeAttendence = () => {
        if (rowDetails?.Id && rowDetails?.OutDate && rowDetails?.OutTime) {
            fetch(`${apihost}/api/ActiveEmployee`, {
                method: 'PUT',
                headers: { 'Authorization': localStorage.getItem('userToken'), 'Content-Type': 'application/json' },
                body: JSON.stringify({ Id: rowDetails?.Id, OutDate: rowDetails?.OutDate, OutTime: rowDetails?.OutTime })
            }).then(res => { return res.json() }).then(data => {
                setdopen(false);
                setRowDetails({ Id: '', OutDate: '', OutTime: '' })
                if (data.status === "Success") {
                    toast.success(data.message)
                    setRefresh(!refresh)
                } else {
                    toast.error(data.message)
                }
            })
        } else {
            toast.error('Enter Required Details')
        }
    }

    const TblColumn = [
        // {
        //     name: 'Employee Code',
        //     selector: (row) => row.Emp_Code,
        //     sortable: true,
        // },
        {
            name: 'Employee Name',
            selector: (row) => row.Emp_Name,
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row) => row.Start_Date,
            sortable: true,
        },
        {
            name: 'In Time',
            selector: (row) => row.InTime,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div>
                    {modify.edit === true && <IconButton onClick={() => {
                        setRowDetails({ ...rowDetails, Id: row.Id, OutDate: convertDateFormat(row.Start_Date) })
                        setdopen(true)
                    }}><Logout sx={{ color: '#FF6865' }} /></IconButton>}
                </div>
            ),
        },
    ]

    const PostWithoutLocation = () => {
        if ((selectedEmp.Emp_Name && selectedEmp.Emp_Name !== '')
            && (selectedEmp.Start_Date && selectedEmp.Start_Date !== '')
            && (selectedEmp.InTime && selectedEmp.InTime !== '')) {
            fetch(`${apihost}/api/attendance`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: selectedEmp.Emp_Id,
                    Start_Date: selectedEmp.Start_Date,
                    InTime: selectedEmp.InTime,
                    Creater: 'Admin'
                })
            }).then(res => { return res.json() })
                .then(data => {
                    setRefresh(!refresh)
                    setAddDialog(false)
                    setSelectedEmp({ Emp_Id: '', Emp_Name: '', Start_Date: '', InTime: '' })
                    if (data.status === 'Success') {
                        toast.success(data.message)
                    } else {
                        toast.error(data.message)
                    }
                })
        } else {
            toast.error(
                (!selectedEmp.Emp_Name || selectedEmp.Emp_Name === '')
                    ? "Select Employee"
                    : (!selectedEmp.Start_Date || selectedEmp.Start_Date === '')
                        ? "Date is Required"
                        : (!selectedEmp.InTime || selectedEmp.InTime === '')
                            ? "InTime is Required"
                            : null
            );

        }
    }

    const handleFromDateChange = (newFromDate) => {
        if (new Date(newFromDate) <= new Date(search.to)) {
            setSearch({ ...search, from: newFromDate });
        } else {
            toast.warn("Invalid date range");
        }
    };

    const handleToDateChange = (newToDate) => {
        if (new Date(newToDate) >= new Date(search.from)) {
            setSearch({ ...search, to: newToDate });
        } else {
            toast.warn("Invalid date range");
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
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'ATTENDANCE MANAGEMENT'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed shadow-lg">
                        <button className="comadbtn" onClick={() => setAddDialog(true)}>Add Attendance</button>
                        <h4 className='h5'>ATTENDANCE MANAGEMENT</h4>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp; ATTENDANCE MANAGEMENT</h6>
                    </div>
                    <div className="p-3 mt-1">
                        <div className={((filteredData && filteredData.length) || (activeEmp && activeEmp.length)) ? 'box' : ''}>
                            <TabContext value={tabValue}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList indicatorColor='transparant' onChange={(e, n) => setTabValue(n)} aria-label="lab API tabs example">
                                        <Tab sx={tabValue === '1' ? {backgroundColor: '#c6d7eb'} : {}} label={'Active Employees ( ' + activeEmp.length + ' )'} value="1" />
                                        <Tab sx={tabValue === '2' ? {backgroundColor: '#c6d7eb'} : {}} label="Attendance History" value="2" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1" sx={{ p: 0 }}>
                                    <DataTable
                                        columns={TblColumn}
                                        data={activeEmp}
                                        pagination
                                        highlightOnHover={true}
                                        fixedHeader={true}
                                        fixedHeaderScrollHeight={'70vh'}
                                        customStyles={customStyles}
                                    />
                                </TabPanel>
                                <TabPanel value="2" sx={{ p: 0 }}>
                                    <div style={{ minHeight: '68vh' }}>
                                        <div className="row">
                                            <div className='col-lg-3 col-md-6 p-2' >
                                                <label>Name</label>
                                                <Select
                                                    options={[{ value: 0, label: 'ALL EMPLOYEE' }, ...empData.map(obj => ({ value: obj.Emp_Id, label: obj.Emp_Name }))]}
                                                    isSearchable={true}
                                                    placeholder={'Select Employee'}
                                                    styles={customSelectStyles}
                                                    value={{ value: selectEmpHis.User_Mgt_Id, label: selectEmpHis.Emp_Name }}
                                                    onChange={(e) => { setSelEmpHis({ ...selectEmpHis, User_Mgt_Id: e.value, Emp_Name: e.label }) }}
                                                />
                                            </div>
                                            <div className='col-lg-3 col-md-6 p-2'>
                                                <label>From</label>
                                                <input
                                                    className='cus-inpt'
                                                    type='date'
                                                    placeholder="Search..."
                                                    value={search.from}
                                                    onInput={(e) => handleFromDateChange(e.target.value)} />
                                            </div>
                                            <div className='col-lg-3 col-md-6 p-2'>
                                                <label>To</label>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <input
                                                        className='cus-inpt'
                                                        type='date'
                                                        placeholder="Search..."
                                                        value={search.to}
                                                        onInput={(e) => handleToDateChange(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 p-2 d-flex align-items-center">
                                                <input
                                                    style={{ padding: '0.7em' }} id="muser"
                                                    className='cus-check'
                                                    type='checkbox'
                                                    checked={search.useDate}
                                                    onChange={(e) => {
                                                        setSearch({ ...search, useDate: e.target.checked })
                                                    }}
                                                    title="Use Date Filter" />
                                                <label className="form-check-label p-1 pe-2" htmlFor="muser">Use Date Filter</label>
                                            </div>
                                        </div>
                                        <DataTable
                                            columns={attendanceHistoryColumn}
                                            data={search.useDate ? filteredData : attendanceHistory}
                                            pagination
                                            highlightOnHover={true}
                                            fixedHeader={true}
                                            fixedHeaderScrollHeight={'58vh'}
                                            customStyles={customStyles}
                                        />
                                    </div>
                                </TabPanel>
                            </TabContext>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                open={dopen}
                onClose={() => { setdopen(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {"Close Employee Attendance"}
                </DialogTitle>
                <DialogContent>
                    <label className='my-2'>Out Date</label>
                    <input
                        type='date'
                        onChange={(e) => { setRowDetails({ ...rowDetails, OutDate: e.target.value }) }}
                        className='form-control p-3' value={rowDetails.OutDate} />
                    <label className='my-2'>Out Time</label>
                    <input
                        type='time'
                        onChange={(e) => { setRowDetails({ ...rowDetails, OutTime: e.target.value }) }}
                        className='form-control p-3' value={rowDetails.OutTime} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setdopen(false)}>Cancel</Button>
                    <Button onClick={closeAttendence} autoFocus sx={{ color: 'red' }}>
                        Close Attendance
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={addDialog}
                onClose={() => { setAddDialog(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth>
                <DialogTitle id="alert-dialog-title">
                    {"Add Employee Attendance"}
                </DialogTitle>
                <DialogContent className='pt-3 pb-5 m-2'>
                    <label>Select Employee</label>
                    <Select
                        options={[...empData.map(obj => ({ value: obj.Emp_Id, label: obj.Emp_Name }))]}
                        isSearchable={true}
                        placeholder={'Select Employee'}
                        styles={customSelectStyles}
                        value={{ value: selectedEmp.Emp_Id, label: selectedEmp.Emp_Name }}
                        onChange={(e) => { setSelectedEmp({ ...selectedEmp, Emp_Id: e.value, Emp_Name: e.label }) }}
                    />
                    <label className="p-2 mt-2">Date And Time</label>
                    <div className="row pb-5 mb-5">
                        <div className="col-md-6 pe-md-2">
                            <input
                                type='date'
                                className="form-control p-3"
                                style={{ border: '1px solid lightgrey' }}
                                onChange={(e) => setSelectedEmp({ ...selectedEmp, Start_Date: e.target.value })}
                                value={selectedEmp.Start_Date} />
                        </div>
                        <div className="d-md-none d-sm-block p-2"></div>
                        <div className="col-md-6 ps-md-2">
                            <input
                                type='time'
                                className="form-control p-3"
                                style={{ border: '1px solid lightgrey' }}
                                onChange={(e) => setSelectedEmp({ ...selectedEmp, InTime: e.target.value })}
                                value={selectedEmp.InTime} />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setdopen(false)}>Cancel</Button>
                    <Button onClick={PostWithoutLocation} autoFocus sx={{ color: 'red' }}>
                        Add Attendance
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AttendanceManagement;