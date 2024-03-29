import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Menu, Close } from '@mui/icons-material';
import { apihost } from '../../backendAPI';
import { Collapse } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, AccountCircle, ArrowRight, ArrowDropDown, GridView, CurrencyRupee, ShoppingCart, Toll, Grading, SwitchAccount, Circle, AddTask } from '@mui/icons-material';

const MainMenu = (props) => {
    const [open, setOpen] = useState(props.mainMenuId === props.MainMenuData.MenuName ? true : false);
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
                    {props.MainMenuData.MenuName === "DASHBOARD" && <GridView sx={{ fontSize: '1.5em', color: 'rgb(66, 34, 225)', }} />}
                    {props.MainMenuData.MenuName === "MASTERS" && <AddTask sx={{ fontSize: '1.5em', color: 'rgb(66, 34, 225)', }} />}
                    {props.MainMenuData.MenuName === "PURCHASE" && <ShoppingCart sx={{ fontSize: '1.5em', color: 'rgb(66, 34, 225)', }} />}
                    {props.MainMenuData.MenuName === "SALES" && <Toll sx={{ fontSize: '1.5em', color: 'rgb(66, 34, 225)', }} />}
                    {props.MainMenuData.MenuName === "REPORTS" && <Grading sx={{ fontSize: '1.5em', color: 'rgb(66, 34, 225)', }} />}
                    {props.MainMenuData.MenuName === "ACCOUNTING" && <SwitchAccount sx={{ fontSize: '1.5em', color: 'rgb(66, 34, 225)', }} />}
                    {props.MainMenuData.MenuName === "PAYMENTS" && <CurrencyRupee sx={{ fontSize: '1.5em', color: 'rgb(66, 34, 225)', }} />}
                    &nbsp;&nbsp;{' ' + props.MainMenuData.MenuName}
                </span>
                <div style={{ textAlign: 'right' }}>
                    {props.MainMenuData.PageUrl === "" && (open ? <KeyboardArrowDown /> : <KeyboardArrowRight />)}
                </div>
            </button>

            {props.MainMenuData.PageUrl === ""
                &&
                <Collapse in={open} timeout="auto" unmountOnExit >
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
    const [open, setOpen] = useState(props.subMenuId === props.SubMenuData.SubMenuName ? true : false);
    const nav = useNavigate();
    return (
        <>
            <button
                className={open ? 'active subMenu' : 'in active subMenu'}
                style={props.SubMenuData.PageUrl !== "" ? { backgroundColor: 'transparent' } : {}}
                onClick={
                    props.SubMenuData.PageUrl === ""
                        ? () => setOpen(!open)
                        : () => nav(props.SubMenuData.PageUrl)
                }>
                {props.SubMenuData.PageUrl === ""
                    ? open === false ? <ArrowRight sx={{ color: 'rgb(66, 34, 225)' }} />
                        : <ArrowDropDown sx={{ color: 'rgb(66, 34, 225)' }} />
                    : <Circle sx={{ fontSize: '6px', color: 'rgb(66, 34, 225)', marginRight: '10px' }} />}

                {props.SubMenuData.SubMenuName}
            </button>
            {props.SubMenuData.PageUrl === ""
                &&
                <Collapse in={open} timeout="auto" unmountOnExit >
                    {props.ChildMenuData.map(obj => (
                        props.SubMenuData.Sub_Menu_Id === obj.Sub_Menu_Id && obj.Read_Rights === 1
                            ? <ChildMenu key={obj.Child_Menu_Id} childMenuId={props.childMenuId} ChildMenuData={obj} />
                            : null
                    ))}
                </Collapse>
                // sx={{padding: '0em 1em'}}
            }
        </>
    );
}

const ChildMenu = (props) => {
    const nav = useNavigate()
    return (
        <>
            <button
                className={props.childMenuId === props.ChildMenuData.ChildMenuName ? 'active childMenu ps-4' : 'in active childMenu ps-4'}
                onClick={() => nav(props.ChildMenuData.PageUrl)} >
                <Circle sx={{ fontSize: '6px', color: 'rgb(66, 34, 225)', marginRight: '5px' }} />{' ' + props.ChildMenuData.ChildMenuName}
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
        if (token) {
            fetch(`${apihost}/api/sidebar`, {
                headers: {
                    'Authorization': token,
                }
            })
                .then((res) => { return res.json() })
                .then((data) => {
                    if (data.status === "Success") {
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
    }, [])

    return (
        <>
            <div className='menuhide'>
                <IconButton data-bs-toggle="offcanvas" data-bs-target="#sidenav" size='small' sx={{ color: 'white', fontWeight: 'bold' }}>
                    {opncond ? <Close /> : <Menu />}
                </IconButton>
            </div>

            <div className='hideside bg-white' id="sid">
                <div className='usrinfo' style={{ display: 'flex' }}>
                    <AccountCircle sx={{ fontSize: '2.7em', marginRight: '0.2em' }} />
                    <div>
                        <h5 style={{ color: 'rgb(64, 38, 236)' }}>{
                            localStorage.getItem('Name')
                        }</h5>
                        <p style={{ color: 'rgb(66, 34, 225)' }}>{localStorage.getItem('UserType') || "Null"}</p>
                    </div>
                </div>
                <div style={{ paddingRight: '5px' }}>
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
                {/* <div className="custom-height"></div> */}
            </div>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="sidenav" aria-labelledby="Label">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="Label">Menu</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <div className='usrinfo' style={{ display: 'flex' }}>
                        <AccountCircle sx={{ fontSize: '2.7em', marginRight: '0.2em' }} />
                        <div>
                            <h5 style={{ color: 'rgb(64, 38, 236)' }}>{
                                localStorage.getItem('Name')
                            }</h5>
                            <p style={{ color: 'rgb(66, 34, 225)' }}>{localStorage.getItem('UserType') || "Null"}</p>
                        </div>
                    </div>
                    <div style={{ paddingRight: '5px' }}>
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
                </div>
            </div>
        </>
    );
}

export default Sidebar;