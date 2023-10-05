import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../env";
import { products } from "../tablecolumn";
import Header from "../header/header";
import Sidebar from "../sidenav/sidebar";
import { Sync } from '@mui/icons-material';

const Product = () => {
    const today = new Date();
    const todaydate = today.toISOString().split('T')[0];
    const [data, setData] = useState([]);
    const [date, setDate] = useState(todaydate)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetch(`${apihost}/api/productinfo?date=${date}`)
            .then((res) => { return res.json() })
            .then((data) => {
                setData(data)
            })
            .catch((e) => { console.log(e) });
    }, [date]);

    const syncData = () => {
        if (data.length !== 0) {
            fetch(`${apihost}/api/syncsalesorder`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
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
            toast.warn("No data for this Date");
        }
    }


    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar page={2} />
                </div>
                <div className="col-md-10">
                    <h3 className="m-3">Sale Order Sync</h3>
                    <ToastContainer />
                    <div className="m-3">
                        <div className="col-sm-4">
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
                        <div className="row"><div className="col-sm-8"></div>
                            <div className="col-sm-4">
                                Search<input type='search' className="form-control" onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <DataTable
                            title="Sale Orders"
                            columns={products}
                            data={data.filter((item) => {
                                if (searchTerm === "") {
                                    return true; // Return true to include all items when no search term is provided
                                } else {
                                    // Check if any of the columns' values match the search term
                                    return products.some((obj) => {
                                        const columnValue = item[obj.selector];
                                        if (columnValue && typeof columnValue === "string") {
                                            // Ensure columnValue is a string and not undefined
                                            const lowercaseColumnValue = columnValue.toLowerCase();
                                            const lowercaseSearchTerm = searchTerm.toLowerCase();
                                            console.log("Column Value:", lowercaseColumnValue);
                                            console.log("Search Term:", lowercaseSearchTerm);
                                            return lowercaseColumnValue.includes(lowercaseSearchTerm);
                                        }
                                        return false; // Exclude items with undefined or non-string column values
                                    });
                                }
                            })}
                            
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
