import './header.css';
import { Logout, Settings, AccountCircle } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { apihost } from "../../env";
import { CurrentCompany } from '../context/contextData';
// import Select from 'react-select';
// import { customSelectStyles } from '../tablecolumn';


const Header = ({setting}) => {
  const nav = useNavigate();
  const token = localStorage.getItem('userToken');
  const [open, setOpen] = useState(false);
  const [comp, setComp] = useState([])
  const {compData, setCompData} = useContext(CurrentCompany)
  

  useEffect(() => {
    if(setting === true) {
      fetch(`${apihost}/api/company`,{headers: {'Authorization': token}})
        .then((res) => { return res.json() })
        .then((data) => {
          if(data.status === "Success"){
            setComp(data.data);
          } else {
            
          }
        })
        .catch((e) => { console.log(e) })
    }
  }, [])

  const companyOnChange = (e) => {
    const id = e.target.value;
    const matchingCompany = comp.find(obj => obj.Id === id);
    const name = matchingCompany ? matchingCompany.Company_Name : 'Company Not Found';
    setCompData({ ...compData, id, Company_Name: name });
  };

  const logout = () => {
    const session = JSON.parse(localStorage.getItem('loginResponse'))
    fetch(`${apihost}/api/logout?userid=${localStorage.getItem('UserId')}&sessionId=${session.SessionId}`,
    {
      method: 'PUT',
      headers: {'Authorization': token}
    })
    .then((res) => { return res.json()})
    .then(data => {
      if(data.status === 'Success'){
        localStorage.clear();
        nav('/');
      } 
    })
  }
  
  
  return (
    <>
      <div className='heddiv'>
        <h2>ERP</h2>
        <div className='logout'>
          {setting === true && <IconButton sx={{color: 'white'}} onClick={() => setOpen(!open)}><Settings /></IconButton>}
          <IconButton sx={{color: 'white'}} onClick={logout}><Logout /></IconButton>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => { setOpen(false) }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <center>
            <AccountCircle sx={{fontSize:'100px'}} />
            <br />
            <h4>{localStorage.getItem('Name')}</h4>
          </center>
          <hr />
          <div className="row">
            <div className="col-sm-4 p-3">
              <TextField fullWidth select label="Company" variant="outlined"
                  onChange={(e) => companyOnChange(e)} value={compData.id}
                  InputProps={{inputProps: { style: { padding: '26px' } }}} >
                  {comp.map((obj) => (
                      <MenuItem key={obj.Id} value={obj.Id} >
                          {obj.Company_Name}
                      </MenuItem>
                  ))}
              </TextField>
            </div>
            {/* <div className="col-md-4 p-2">
              <Select
                options={comp.map(obj => ({value: obj.Id,label: obj.Company_Name}))}
                isSearchable={true} 
                placeholder="Company"
                styles={customSelectStyles}
                onChange={(e) => updateState(e.value)}
                value={myState}
              />
            </div> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false) }}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Header;