import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Menu, Close } from '@mui/icons-material';
import { apihost } from '../../env';

const Sidebar = ({ page }) => {
    const nav = useNavigate();
    const [opncond, setopencond] = useState(false);
    const token = localStorage.getItem('userToken')

    useEffect(() => {
        fetch(`${apihost}/api/sidebar`, {
            headers: {
                'Authorization': token
            }
        })
            .then((res) => { return res.json() })
            .then((data) => {
                console.log(data)
            })
            .catch((e) => { console.log(e) })
    }, [])

    const pages = [
        {
            id: 1,
            page: 'Users',
            link: '/users'
        },
        {
            id: 2,
            page: 'Sale Order Sync',
            link: '/saleordersync'
        },
        {
            id: 3,
            page: 'Sale Order List',
            link: '/saleorder'
        },
    ]

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
                {pages.map(obj => (
                    <>
                        <button
                            key={obj.id}
                            className={page === obj.page || page === obj.id ? 'active' : 'in active'}
                            onClick={() => { nav(obj.link) }}>{obj.page}</button>
                    </>
                ))}
            </div>
        </>
    );
}

export default Sidebar;