import './header.css';
import { Logout } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { IconButton } from '@mui/material';

const Header = () => {
  const nav = useNavigate()
  return (
    <>
      <div className='heddiv'>
        <h2>ERP</h2>
        <div className='logout'>
          <IconButton sx={{color: 'white'}} onClick={() => {localStorage.clear();nav('/')}}><Logout /></IconButton>
        </div>
      </div>
    </>
  );
}

export default Header;