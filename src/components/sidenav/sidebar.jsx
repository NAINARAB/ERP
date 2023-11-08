import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Menu, Close } from '@mui/icons-material';
import { apihost } from '../../env';
import { Collapse } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, AccountCircle, ArrowRight, ArrowDropDown, GridView, Tune, ShoppingCart, Toll, Grading, SwitchAccount } from '@mui/icons-material';

const MainMenu = (props) => {
    const [open, setOpen] = useState(props.mainMenuId === props.MainMenuData.Main_Menu_Id ? true : false);
    const nav = useNavigate();
    return (
        <>
            <button
              className={open ? 'active' : 'in active'}
              onClick={
                props.MainMenuData.PageUrl === ""
                    ? () => setOpen(!open)
                    : () => nav(props.MainMenuData.PageUrl)
            }
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
            >
              <span style={{ textAlign: 'left' }}>
                {props.MainMenuData.Main_Menu_Id === 1 && <GridView sx={{ fontSize: '1.3em', color: 'rgb(66, 34, 225)' }} />}
                {props.MainMenuData.Main_Menu_Id === 2 && <Tune sx={{ fontSize: '1.3em', color: 'rgb(66, 34, 225)' }} />}
                {props.MainMenuData.Main_Menu_Id === 3 && <ShoppingCart sx={{ fontSize: '1.3em', color: 'rgb(66, 34, 225)' }} />}
                {props.MainMenuData.Main_Menu_Id === 4 && <Toll sx={{ fontSize: '1.3em', color: 'rgb(66, 34, 225)' }} />}
                {props.MainMenuData.Main_Menu_Id === 5 && <Grading sx={{ fontSize: '1.3em', color: 'rgb(66, 34, 225)' }} />}
                {props.MainMenuData.Main_Menu_Id === 6 && <SwitchAccount sx={{ fontSize: '1.3em', color: 'rgb(66, 34, 225)' }} />}
                {' ' + props.MainMenuData.MenuName}
              </span>
              <div style={{ textAlign: 'right' }}>
                {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
              </div>
            </button>

            {props.MainMenuData.PageUrl === ""
                && 
                <Collapse in={open} timeout="auto" unmountOnExit sx={{padding: '0.2em 0.4em'}}>
                    {props.SubMenuData.map(obj => (
                        props.MainMenuData.Main_Menu_Id === obj.Main_Menu_Id && obj.Read_Rights === 1
                            ? <SubMenu key={obj.Sub_Menu_Id} SubMenuData={obj} ChildMenuData={props.ChildMenuData} subMenuId={props.subMenuId} childMenuId={props.childMenuId} />
                            : null
                    ))}
                </Collapse>
            }
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
                {props.SubMenuData.PageUrl === "" 
                ?   open === false  ? <ArrowRight sx={{color:'rgb(66, 34, 225)'}} /> 
                                    : <ArrowDropDown sx={{color:'rgb(66, 34, 225)'}} />
                :   null}
                
                {props.SubMenuData.SubMenuName}
            </button>
            {props.SubMenuData.PageUrl === ""
                && 
                <Collapse in={open} timeout="auto" unmountOnExit sx={{padding: '0em 1em'}}>
                    {props.ChildMenuData.map(obj => (
                        props.SubMenuData.Sub_Menu_Id === obj.Sub_Menu_Id && obj.Read_Rights === 1
                        ? <ChildMenu key={obj.Child_Menu_Id} childMenuId={props.childMenuId} ChildMenuData={obj} />
                        : null
                    ))}
                </Collapse>
            }
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
    const [opncond, setopencond] = useState(false);
    const token = localStorage.getItem('userToken');
    const [mainMenu, setMainMenu] = useState([]);
    const [subMenu, setSubMenu] = useState([]);
    const [childMenu, setChildMenu] = useState([]);

    useEffect(() => {
        if(token) {
            fetch(`${apihost}/api/sidebar`, {
                headers: {
                    'Authorization': token,
                    'Db': 'db1'
                }
            })
                .then((res) => { return res.json() })
                .then((data) => {
                    if(data.status === "Success"){
                        data.data[1].sort((a, b) => {
                            if (a.PageUrl === '' && b.PageUrl !== '') {
                              return -1;
                            } else if (a.PageUrl !== '' && b.PageUrl === '') {
                              return 1;
                            } else {
                              return 0;
                            }
                          });
                        setMainMenu(data.data[0])
                        setSubMenu(data.data[1])
                        setChildMenu(data.data[2])
                    }    
                })
                .catch((e) => { console.log(e) })
        } 
    },[])

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
                            // localStorage.getItem('Name') ||
                            'Raj Nainaar'
                        }</h5>
                        <p style={{ color: 'rgb(66, 34, 225)' }}>{localStorage.getItem('UserType') || "Null"}</p>
                    </div>
                </div>
                {mainMenu.map(obj => (
                    obj.Read_Rights === 1 
                    ? <MainMenu
                        key={obj.Main_Menu_Id}
                        mainMenuId={mainMenuId} subMenuId={subMenuId} childMenuId={childMenuId}
                        MainMenuData={obj}
                        SubMenuData={subMenu}
                        ChildMenuData={childMenu} />
                    : null 
                ))}
            </div>
        </>
    );
}

export default Sidebar;