import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../env";
import { products } from "../tablecolumn";
import Header from "../header/header";
import Sidebar from "../sidenav/sidebar";
import { Sync, NavigateNext } from '@mui/icons-material';

const Product = () => {
    const today = new Date();
    const todaydate = today.toISOString().split('T')[0];
    const [data, setData] = useState([]);
    const [date, setDate] = useState(todaydate)
    const token = localStorage.getItem('userToken')

    useEffect(() => {
        if (token) {
            fetch(`${apihost}/api/productinfo?date=${date}`,
                {
                    headers: {
                        'Authorization': token
                    }
                })
                .then((res) => { return res.json() })
                .then((data) => {
                    setData(data)
                })
                .catch((e) => { console.log(e) });
        }
    }, [date]);

    const syncData = () => {
        if (data.length !== 0) {
            fetch(`${apihost}/api/syncsalesorder`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': token
                },
                body: JSON.stringify({
                    data: data,
                    date: date
                })
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.status == "Success") {
                        toast.success(data.message);
                    } else {
                        toast.warn(data.message);
                    }
                })
                .catch((e) => { console.log(e) });
        } else {
            toast.warn("No Data");
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
                    <Sidebar mainMenuId={4} subMenuId={6} />
                </div>
                <div className="col-md-10">
                <div className="comhed">
                    <h5>SYNC SALE ORDER</h5>
                    <h6>SALES &nbsp;<NavigateNext fontSize="small" />&nbsp; SYNC SALE ORDER</h6>
                </div>
                    <div className="m-3">
                        <div className="col-sm-4">
                            <label>Order Date</label><br />
                            <input
                                className="form-control"
                                type='date'
                                value={date}
                                onChange={(e) => {
                                    setDate((e.target.value));
                                    console.log(e.target.value);
                                }} />
                            <br />
                            <button
                                className={date >= todaydate ? 'btn btn-disabled' : 'btn btn-success'}
                                onClick={syncData}
                                disabled={date >= todaydate ? true : false}
                            ><Sync /> &nbsp;Sync Data </button>
                        </div><br />
                        <DataTable
                            title="Sale Orders"
                            columns={products}
                            data={data}
                            pagination
                            highlightOnHover={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight={"50vh"}
                        />


                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;
