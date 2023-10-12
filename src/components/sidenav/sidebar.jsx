import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Menu, Close } from '@mui/icons-material';
import { apihost } from '../../env';
import { Collapse } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, AccountCircle } from '@mui/icons-material';

const MainMenu = (props) => {
    const [open, setOpen] = useState(props.mainMenuId === props.MainMenuData.Main_Menu_Id ? true : false);
    return (
        <>
            <button
                className={open ? 'active' : 'in active'}
                onClick={() => setOpen(!open)}>
                {props.MainMenuData.MenuName}
                {open
                    ? <KeyboardArrowDown sx={{ float: 'right' }} />
                    : <KeyboardArrowRight sx={{ float: 'right' }} />}
            </button>
            <Collapse in={open} timeout="auto" unmountOnExit sx={{padding: '0.2em 0.4em'}}>
                {props.SubMenuData.map(obj => (
                    props.MainMenuData.Main_Menu_Id === obj.Main_Menu_Id
                        ? <SubMenu key={obj.Sub_Menu_Id} SubMenuData={obj} ChildMenuData={props.ChildMenuData} subMenuId={props.subMenuId} childMenuId={props.childMenuId} />
                        : null
                ))}
            </Collapse>
        </>
    );
}

const SubMenu = (props) => {
    const [open, setOpen] = useState(props.subMenuId === props.SubMenuData.Sub_Menu_Id ? true : false);
    const nav = useNavigate();
    return (
        <>
            <button
                className={open ? 'active subMenu' : 'in active subMenu'}
                style={props.SubMenuData.PageUrl !== "" ? {backgroundColor: 'transparent'} : {} }
                onClick={
                    props.SubMenuData.PageUrl === ""
                        ? () => setOpen(!open)
                        : () => nav(props.SubMenuData.PageUrl)
                }>
                &nbsp;{'- ' + props.SubMenuData.SubMenuName}
                {props.SubMenuData.PageUrl === ""
                    ? <>
                        {open
                            ? <><KeyboardArrowDown sx={{ float: 'right' }} /></>
                            : <><KeyboardArrowRight sx={{ float: 'right' }} /></>}
                    </>
                    : null
                }
            </button>
            <Collapse in={open} timeout="auto" unmountOnExit sx={{padding: '0em 1em'}}>
                {props.SubMenuData.PageUrl === ""
                    ? 
                    <>
                        {props.ChildMenuData.map(obj => (
                            props.SubMenuData.Sub_Menu_Id === obj.Sub_Menu_Id 
                            ? <ChildMenu key={obj.Child_Menu_Id} childMenuId={props.childMenuId} ChildMenuData={obj} />
                            : null
                        ))}
                    </>
                    : null
                }
            </Collapse>
        </>
    );
}

const ChildMenu = (props) => {
    console.log(props,'child')
    const nav = useNavigate()
    return (
        <>
            <button 
                className={props.childMenuId === props.ChildMenuData.Child_Menu_Id ? 'active childMenu': 'in active childMenu'} 
                onClick={() => nav(props.ChildMenuData.PageUrl)} >
                {'-  ' + props.ChildMenuData.ChildMenuName}
            </button>
        </>
    );
}

const Sidebar = ({ mainMenuId, subMenuId, childMenuId }) => {
    const nav = useNavigate(); 
    const [opncond, setopencond] = useState(false);
    const token = localStorage.getItem('userToken');
    const [mainMenu, setMainMenu] = useState([]);
    const [subMenu, setSubMenu] = useState([]);
    const [childMenu, setChildMenu] = useState([]);

    useEffect(() => {
        if(token) {
            fetch(`${apihost}/api/sidebar`, {
                headers: {
                    'Authorization': token
                }
            })
                .then((res) => { return res.json() })
                .then((data) => {
                    setMainMenu(data[0])
                    setSubMenu(data[1])
                    setChildMenu(data[2])
    
                })
                .catch((e) => { console.log(e) })
        } else {
            nav('/')
        }
    }, [])

    return (
        <>
            <div className='menuhide'>
                {opncond === false ? <IconButton size='small' sx={{ color: 'white', fontWeight: 'bold' }}
                    onClick={() => { document.getElementById('sid').style.display = 'block'; setopencond(true) }}
                ><Menu /></IconButton> :

                    <IconButton size='small' sx={{ color: 'white', fontWeight: 'bold' }}
                        onClick={() => { document.getElementById('sid').style.display = 'none'; setopencond(false) }}
                    ><Close /></IconButton>}
            </div>
            <div className='hideside' id="sid">
                <div className='usrinfo' style={{ display: 'flex' }}>
                    <AccountCircle sx={{fontSize: '2.7em', marginRight:'0.2em'}} />
                    <div>
                        <h5 style={{ color: 'rgb(64, 38, 236)' }}>{
                            // localStorage.getItem('Name')
                            'Raj Nainaar'
                        }</h5>
                        <p style={{ color: 'rgb(64, 38, 236)' }}>{localStorage.getItem('UserType')}</p>
                    </div>
                </div>
                {mainMenu.map(obj => (
                    <MainMenu
                        key={obj.Main_Menu_Id}
                        mainMenuId={mainMenuId} subMenuId={subMenuId} childMenuId={childMenuId}
                        MainMenuData={obj}
                        SubMenuData={subMenu}
                        ChildMenuData={childMenu} />
                ))}
            </div>
        </>
    );
}

export default Sidebar;