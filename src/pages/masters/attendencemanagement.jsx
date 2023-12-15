import { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidenav/sidebar';
import { apihost } from '../../backendAPI';
import { pageRights } from '../../components/rightsCheck';
import { NavigateNext, Logout } from '@mui/icons-material';
import DataTable from "react-data-table-component";
import { customStyles, customSelectStyles } from '../../components/tablecolumn';
import { Dialog, IconButton, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField } from '@mui/material';
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
    const [search, setSearch] = useState('')
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
        InTime: ''
    })

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

    function handleSearchChange(event) {
        const term = event.target.value;
        setSearch(term);
        const filteredResults = activeEmp.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(term.toLowerCase())
            );
        });

        setFilteredData(filteredResults);
    }

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
        {
            name: 'Employee Code',
            selector: (row) => row.Emp_Code,
            sortable: true,
        },
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
                    setSelectedEmp({Emp_Id: '', Emp_Name: '', Start_Date: '', InTime: '' })
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
                        <h2 className='h3 mb-5'>
                            <span className="float-start p-2">
                                Active Employees {'( ' + activeEmp.length + ' )'}
                            </span>
                            <span className='float-end col-lg-4'>
                                <input className='form-control p-3' type='search' placeholder="Search..." value={search} onChange={handleSearchChange} autoFocus />
                            </span>
                        </h2><br />
                        <div className={((filteredData && filteredData.length) || (activeEmp && activeEmp.length)) ? 'box mt-5' : 'mt-5'}>
                            <DataTable
                                columns={TblColumn}
                                data={filteredData && filteredData.length ? filteredData : search === '' ? activeEmp : []}
                                pagination
                                highlightOnHover={true}
                                fixedHeader={true}
                                fixedHeaderScrollHeight={'70vh'}
                                customStyles={customStyles}
                            />
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