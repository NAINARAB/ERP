import { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidenav/sidebar';
import { NavigateNext, ChevronLeft, Add, KeyboardArrowUp, KeyboardArrowDown, Edit, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from '../../backendAPI';
import { pageRights } from '../../components/rightsCheck';
import { Collapse, IconButton } from '@mui/material';


function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

const DispEmployee = ({ emp, edit, del, setVal }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="card-header">
                <h3 className='h4'>
                    <span className='float-start align-items-center'
                        style={{ width: '40%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                        {emp.Emp_Name}
                    </span>
                    <span className='float-end h6'>
                        {emp.Designation_Name + ' '}
                        {edit === true && <IconButton size='small' onClick={() => setVal(emp, 'PUT')}><Edit /></IconButton>}
                        {/* {del === true && <IconButton size='small'><Delete sx={{ color: '#FF6865' }} /></IconButton>} */}
                        <IconButton onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </span>
                </h3>
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-4 col-md-12 p-2 ">
                            <h3 className="h6">
                                <span className="float-start">Branch</span>
                                <span className="float-end">{emp.BranchName ? emp.BranchName : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Salary</span>
                                <span className="float-end">{emp.Salary ? emp.Salary : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Joining</span>
                                <span className="float-end">{emp.DOJ ? formatDate(emp.DOJ) : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Education</span>
                                <span className="float-end">{emp.Education ? emp.Education : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Mobile</span>
                                <span className="float-end">{emp.Mobile_No ? emp.Mobile_No : '-'}</span>
                            </h3>
                        </div>
                        <div className="col-lg-4 col-md-12 p-2 ">
                            <h3 className="h6">
                                <span className="float-start">City</span>
                                <span className="float-end">{emp.City ? emp.City : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">PinCode</span>
                                <span className="float-end">{emp.Pincode ? emp.Pincode : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Gender</span>
                                <span className="float-end">{emp.Sex ? emp.Sex : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">DOB</span>
                                <span className="float-end">{emp.DOB ? formatDate(emp.DOB) : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Religion</span>
                                <span className="float-end">{emp.Emp_Religion ? emp.Emp_Religion : '-'}</span>
                            </h3>
                        </div>
                        <div className="col-lg-4 col-md-12 p-2 ">
                            <h3 className="h6">
                                <span className="float-start">Father's Name</span>
                                <span className="float-end">{emp.Fathers_Name ? emp.Fathers_Name : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Mother's Name</span>
                                <span className="float-end">{emp.Mothers_Name ? emp.Mothers_Name : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Spouse's Name</span>
                                <span className="float-end">{emp.Spouse_Name ? emp.Spouse_Name : '-'}</span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Address 1</span>
                                <span className="float-end" style={{ width: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>
                                    {emp.Address_1 ? emp.Address_1 : '-'}
                                </span>
                            </h3>
                            <br />
                            <h3 className="h6">
                                <span className="float-start">Address 2</span>
                                <span className="float-end" style={{ width: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>
                                    {emp.Address_2 ? emp.Address_2 : '-'}
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </Collapse>
        </>
    )
}

const Employees = () => {
    const [empFormData, setEmpFormData] = useState({
        branch: '',
        empname: '',
        designation: '',
        dob: '',
        doj: '',
        address1: '',
        address2: '',
        city: '',
        country: "India",
        pincode: '',
        mobile: '',
        education: '',
        father: '',
        mother: '',
        spouse: '',
        gender: '',
        religion: '',
        salary: 0,
        total_loan: 0,
        salary_advance: 0,
        due_loan: 0,
        user_manage_id: '',
        enter_by: parseInt(localStorage.getItem('UserId')),
    })
    const [empData, setEmpData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [branch, setBranch] = useState([]);
    const [designation, setDesignation] = useState([]);
    const token = localStorage.getItem('userToken');
    const inputclass = 'form-control b-0';
    const [dispScreen, setDispScreen] = useState(false);
    const [rights, setRights] = useState({});
    const [userCreate, setUserCreate] = useState(false);
    const [search, setSearch] = useState('')
    const [pk, setPK] = useState('')
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        pageRights(2, 3).then(right => {
            if (right.permissions.Read_Rights === 1) {
                fetch(`${apihost}/api/employee`, { headers: { 'Authorization': token } })
                    .then((res) => { return res.json() })
                    .then((data) => {
                        if (data.status === "Success") {
                            setEmpData(data.data)
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
                fetch(`${apihost}/api/emp-designation`, { headers: { 'Authorization': token } })
                    .then((res) => { return res.json() })
                    .then((data) => {
                        if (data.status === "Success") {
                            setDesignation(data.data)
                        }
                    })
                    .catch((e) => { console.log(e) });
                setRights({
                    add: right.permissions.Add_Rights === 1,
                    edit: right.permissions.Edit_Rights === 1,
                    delete: right.permissions.Delete_Rights === 1,
                })
            }
        })
    }, [refresh])

    function onlynum(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }

    const input = [
        {
            label: 'Name',
            elem: 'input',
            type: 'text',
            class: inputclass,
            placeholder: "Enter Name",
            event: (e) => setEmpFormData({ ...empFormData, empname: e.target.value }),
            required: true,
            value: empFormData.empname,
        },
        {
            label: 'Designation',
            elem: 'select',
            class: inputclass,
            options: [{ value: '', label: ' - Select - ', disabled: true, selected: true }, ...designation.map(obj => ({ value: obj.id, label: obj.Designation }))],
            event: (e) => setEmpFormData({ ...empFormData, designation: e.target.value }),
            required: true,
            value: empFormData.designation,
        },
        {
            label: 'Mobile',
            elem: 'input',
            oninput: (e) => onlynum(e),
            class: inputclass,
            placeholder: "Enter Mobile Number",
            event: (e) => setEmpFormData({ ...empFormData, mobile: e.target.value }),
            required: true,
            value: empFormData.mobile,
        },
        {
            label: 'Education',
            elem: 'input',
            type: 'text',
            class: inputclass,
            placeholder: "Enter Education",
            event: (e) => setEmpFormData({ ...empFormData, education: e.target.value }),
            value: empFormData.education,
        },
        {
            label: 'Date of Birth',
            elem: 'input',
            type: 'date',
            class: inputclass,
            placeholder: "Select Date of Birth",
            event: (e) => setEmpFormData({ ...empFormData, dob: e.target.value }),
            value: empFormData.dob,
        },
        {
            label: 'Date of Joining',
            elem: 'input',
            type: 'date',
            class: inputclass,
            placeholder: "Select Date of Joining",
            event: (e) => setEmpFormData({ ...empFormData, doj: e.target.value }),
            value: empFormData.doj,
        },
        {
            label: 'Gender',
            elem: 'select',
            class: inputclass,
            options: [
                { value: '', label: ' - Select - ', disabled: true, selected: true },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
            ],
            event: (e) => setEmpFormData({ ...empFormData, gender: e.target.value }),
            required: true,
            value: empFormData.gender,
        },
        {
            label: 'Religion',
            elem: 'select',
            class: inputclass,
            options: [
                { value: '', label: ' - Select - ', disabled: true, selected: true },
                { value: 'Hindu', label: 'Hindu' },
                { value: 'Muslim', label: 'Muslim' },
                { value: 'Christian', label: 'Christian' },
                { value: 'Other', label: 'Other' }
            ],
            event: (e) => setEmpFormData({ ...empFormData, religion: e.target.value }),
            value: empFormData.religion,
        },
        {
            label: 'Branch',
            elem: 'select',
            class: inputclass,
            options: [{ value: '', label: ' - Select - ', disabled: true, selected: true }, ...branch.map(obj => ({ value: obj.BranchId, label: obj.BranchName }))],
            event: (e) => setEmpFormData({ ...empFormData, branch: parseInt(e.target.value) }),
            required: true,
            value: empFormData.branch,
        },
        {
            label: 'Salary',
            elem: 'input',
            oninput: (e) => onlynum(e),
            class: inputclass,
            placeholder: "Enter Salary",
            event: (e) => setEmpFormData({ ...empFormData, salary: e.target.value }),
            required: true,
            value: empFormData.salary,
        },
        {
            label: 'Father\'s Name',
            elem: 'input',
            type: 'text',
            class: inputclass,
            placeholder: "Enter Father's Name",
            event: (e) => setEmpFormData({ ...empFormData, father: e.target.value }),
            value: empFormData.father,
        },
        {
            label: 'Mother\'s Name',
            elem: 'input',
            type: 'text',
            class: inputclass,
            placeholder: "Enter Mother's Name",
            event: (e) => setEmpFormData({ ...empFormData, mother: e.target.value }),
            value: empFormData.mother,
        },
        {
            label: 'Spouse\'s Name',
            elem: 'input',
            type: 'text',
            class: inputclass,
            placeholder: "Enter Spouse's Name",
            event: (e) => setEmpFormData({ ...empFormData, spouse: e.target.value }),
            value: empFormData.spouse,
        },
        {
            label: 'City',
            elem: 'input',
            type: 'text',
            class: inputclass,
            placeholder: "Enter City",
            event: (e) => setEmpFormData({ ...empFormData, city: e.target.value }),
            required: true,
            value: empFormData.city,
        },
        {
            label: 'Pincode',
            elem: 'input',
            oninput: (e) => onlynum(e),
            class: inputclass,
            placeholder: "Enter Pincode",
            event: (e) => setEmpFormData({ ...empFormData, pincode: e.target.value }),
            value: empFormData.pincode,
        },
        {
            label: 'Address Line 1',
            elem: 'textarea',
            type: 'text',
            class: inputclass,
            placeholder: "Enter Address Line 1",
            event: (e) => setEmpFormData({ ...empFormData, address1: e.target.value }),
            required: true,
            value: empFormData.address1,
        },
        {
            label: 'Address Line 2',
            elem: 'textarea',
            type: 'text',
            class: inputclass,
            placeholder: "Enter Address Line 2",
            event: (e) => setEmpFormData({ ...empFormData, address2: e.target.value }),
            value: empFormData.address2,
        },
        // {
        //     label: 'Entered By',
        //     elem: 'input',
        //     type: 'text',
        //     class: inputclass,
        //     placeholder: "Enter Entered By",
        //     event: (e) => setEmpFormData({ ...empFormData, enter_by: e.target.value }),
        //     disabled: true,
        //     value: localStorage.getItem('Name'),
        // },
    ];

    const validateForm = () => {
        for (const field of input) {
            if (field.required && field.value === '') {
                return `${field.label} is required.`;
            }
        }

        return "Success";
    };

    const postEmp = () => {
        const validate = validateForm();
        if (validate === 'Success') {
            fetch(`${apihost}/api/employee`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: empFormData, userMGT: userCreate })
            }).then(res => { return res.json() })
                .then(data => {
                    if (data.status === "Success") {
                        toast.success(data.message)
                        setInitialValue()
                        setPK('')
                        setDispScreen(!dispScreen)
                        setRefresh(!refresh)
                    } else {
                        toast.error(data.message)
                    }
                })
        } else {
            toast.error(validate)
        }
    }

    const putEmp = () => {
        const validate = validateForm();
        if (validate === 'Success') {
            fetch(`${apihost}/api/employee`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: empFormData, ID: pk })
            }).then(res => { return res.json() })
                .then(data => {
                    if (data.status === "Success") {
                        toast.success(data.message)
                        setInitialValue()
                        setPK('')
                        setDispScreen(!dispScreen)
                        setRefresh(!refresh)
                    } else {
                        toast.error(data.message)
                    }
                })
        } else {
            toast.error(validate)
        }
    }

    function handleSearchChange(event) {
        const term = event.target.value;
        setSearch(term);
        const filteredResults = empData.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(term.toLowerCase())
            );
        });

        setFilteredData(filteredResults);
    }

    const setVal = (emp, method) => {
        setPK(emp.Emp_Id);
        if (method === 'PUT') {
            setEmpFormData({
                branch: emp.Branch,
                empname: emp.Emp_Name,
                designation: emp.Designation,
                dob: new Date(emp.DOB).toISOString().split('T')[0],
                doj: new Date(emp.DOJ).toISOString().split('T')[0],
                address1: emp.Address_1,
                address2: emp.Address_2,
                city: emp.City,
                country: "India",
                pincode: emp.Pincode,
                mobile: emp.Mobile_No,
                education: emp.Education,
                father: emp.Fathers_Name,
                mother: emp.Mothers_Name,
                spouse: emp.Spouse_Name,
                gender: emp.Sex,
                religion: emp.Emp_Religion,
                salary: emp.Salary,
                total_loan: emp.Total_Loan,
                salary_advance: emp.Salary_Advance,
                due_loan: emp.Due_Loan,
                user_manage_id: emp.User_Mgt_Id,
                enter_by: parseInt(localStorage.getItem('UserId')),
            })
            setDispScreen(!dispScreen);
        }

    }

    const setInitialValue = () => {
        setEmpFormData({
            branch: '',
            empname: '',
            designation: '',
            dob: '',
            doj: '',
            address1: '',
            address2: '',
            city: '',
            country: "India",
            pincode: '',
            mobile: '',
            education: '',
            father: '',
            mother: '',
            spouse: '',
            gender: '',
            religion: '',
            salary: 0,
            total_loan: 0,
            salary_advance: 0,
            due_loan: 0,
            user_manage_id: '',
            enter_by: parseInt(localStorage.getItem('UserId')),
        })
    }


    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'EMPLOYEE MASTER'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed shadow-lg">
                        {rights?.add === true
                            && <button className="comadbtn" onClick={() => {
                                setDispScreen(!dispScreen);
                                setPK('');
                                setInitialValue()
                            }}>
                                {dispScreen
                                    ? <><ChevronLeft sx={{ fontSize: '1em', padding: '0px', margin: '0px' }} /> Back</>
                                    : <><Add sx={{ fontSize: '1em', padding: '0px', margin: '0px' }} /> Add Employee</>}
                            </button>
                        }
                        <h4 className='h5'>EMPLOYEE MASTER</h4>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp; EMPLOYEE MASTER</h6>
                    </div>
                    <div className="p-3 pt-4 px-4">
                        {dispScreen
                            ?
                            <div className='card shadow-lg'>
                                <div className='card-header py-3' style={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}>
                                    <h2 className='h5 mb-0'>Create Employee</h2>
                                </div>
                                <div className="row card-body">
                                    {input.map((field, index) => (
                                        <div key={index} className="col-lg-4 col-md-6 p-2 px-3">
                                            <label>{field.label}{field.required && <p style={{ color: 'red', display: 'inline', fontWeight: 'bold', fontSize: '1em' }}> *</p>}</label>
                                            {field.elem === 'input' ? (
                                                <input
                                                    type={field.type || 'text'}
                                                    className={field.class}
                                                    onChange={field.event}
                                                    onInput={field.oninput}
                                                    disabled={field.disabled}
                                                    value={field.value}

                                                />
                                            ) : field.elem === 'select' ? (
                                                <select
                                                    className={field.class}
                                                    onChange={field.event}
                                                    value={field.value}>
                                                    {field.options.map((option, optionIndex) => (
                                                        <option key={optionIndex} value={option.value} disabled={option.disabled} defaultValue={option.selected}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : field.elem === 'textarea' ? (
                                                <textarea
                                                    className={field.class}
                                                    onChange={field.event}
                                                    rows={4} value={field.value}>
                                                </textarea>
                                            ) : null}
                                        </div>
                                    ))}
                                    {!pk
                                        && <div className='col-lg-4 col-md-6 d-flex align-items-center'>
                                            <div className="card-body">
                                                <label className="form-check-label p-1 pe-2" htmlFor="muser">Create as a User</label>
                                                <input className="form-check-input shadow-none" style={{ padding: '0.7em' }} type="checkbox" id="muser" checked={userCreate} onChange={() => setUserCreate(!userCreate)} />
                                            </div>
                                        </div>}
                                </div>
                                <div className='card-footer text-end'>
                                    <button className='comadbtn' style={{ marginBottom: '0px' }} onClick={pk ? putEmp : postEmp}>Submit</button>
                                    <button className='cancelbtn' onClick={() => { 
                                        setDispScreen(!dispScreen); setPK('');
                                        setInitialValue(); }} >Cancel</button>
                                </div>
                            </div>
                            :
                            <div className='row' >
                                <h2 className='h3 pb-2'>
                                    <span className="float-start p-2">
                                        Employees {'( ' + empData.length + ' )'}
                                    </span>
                                    <span className='float-end col-lg-4'>
                                        <input className='form-control p-3' type='search' placeholder="Search..." value={search} onChange={handleSearchChange} />
                                    </span>
                                </h2>
                                <div style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                                    {(filteredData && filteredData.length ? filteredData : search === '' ? empData : []).map(emp => (
                                        <div key={emp.Emp_Id} className='col-sm-12 card shadow-lg mb-2'>
                                            <DispEmployee emp={emp} edit={true} del={true} setVal={setVal} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Employees