import './header.css';
import { Logout, Settings, AccountCircle } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Tooltip } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { apihost } from "../../backendAPI";
import { CurrentCompany } from '../context/contextData';


const Header = ({ setting }) => {
  const nav = useNavigate();
  const token = localStorage.getItem('userToken');
  const [open, setOpen] = useState(false);
  const [comp, setComp] = useState([])
  const { compData, setCompData } = useContext(CurrentCompany)


  useEffect(() => {
    if (setting === true) {
      fetch(`${apihost}/api/myCompanys?Auth=${token}`)
        .then((res) => { return res.json() })
        .then((data) => {
          if (data.status === "Success") {
            setComp(data.data);
          } else {
            setComp([])
          }
        })
        .catch((e) => { console.log(e) })
    }
  }, [])

  const companyOnChange = (e) => {
    const id = e.target.value;
    const matchingCompany = comp.find(obj => obj?.Company_Id === id);
    setCompData({
      ...compData,
      id: matchingCompany?.Company_Id ? matchingCompany.Company_Id : '',
      Company_Name: matchingCompany?.Company_Name ? matchingCompany.Company_Name : ''
    });
  };

  const logout = () => {
    const session = JSON.parse(localStorage.getItem('loginResponse'))
    fetch(`${apihost}/api/logout?userid=${localStorage.getItem('UserId')}&sessionId=${session?.SessionId}`,
      {
        method: 'PUT',
        headers: { 'Authorization': token }
      })
      .then((res) => { return res.json() })
      .then(data => {
        if (data.status === 'Success') {
          // localStorage.clear();
          // nav('/');
        }
      }).catch(e => console.error(e))
      .finally(() => {
        localStorage.clear();
        nav('/');
      })
  }


  return (
    <>
      <div className='heddiv'>
        <div className="heddiv-start">
          <h4 className='mb-0 ms-5'>ERP</h4>
        </div>
        <div>
          {/* <Tooltip title="Refresh">
            <IconButton sx={{ color: 'white' }} onClick={() => { window.location.reload() }}><Replay /></IconButton>
          </Tooltip> */}
          {setting === true
            && (
              <Tooltip title="Settings">
                <IconButton sx={{ color: 'white' }} onClick={() => setOpen(!open)}>
                  <Settings />
                </IconButton>
              </Tooltip>
            )
          }
          <Tooltip title='Logout'>
            <IconButton sx={{ color: 'white' }} onClick={logout}><Logout /></IconButton>
          </Tooltip>
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
            <AccountCircle sx={{ fontSize: '100px' }} />
            <br />
            <h4>{localStorage.getItem('Name')}</h4>
          </center>
          <hr />
          <div className="row">
            <div className="col-sm-4 p-3">
              <TextField
                fullWidth
                select
                label="Company"
                variant="outlined"
                onChange={(e) => companyOnChange(e)}
                value={compData?.id}
                
                placeholder='SELECT COMPANY'
                InputProps={{
                  inputProps: {
                    style: { padding: '26px' }
                  }
                }}
              >
                <MenuItem value=''>SELECT COMPANY</MenuItem>
                {comp.map((obj, i) =>
                  Number(obj?.View_Rights) === 1 && (
                    <MenuItem key={i} value={obj?.Company_Id} >
                      {obj?.Company_Name}
                    </MenuItem>
                  )
                )}
              </TextField>
            </div>
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