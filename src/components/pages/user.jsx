import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../env";
import { users } from "../tablecolumn";
import Header from "../header/header";
import Sidebar from "../sidenav/sidebar";

const User = () => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetch(`${apihost}/api/users`)
            .then((res) => { return res.json() })
            .then((data) => {
                setData(data);
            })
            .catch((e) => { console.log(e) })

        fetch(`${apihost}/api/productinfo`)
            .then((res) => { return res.json() })
            .then((data) => {
                console.log(data)
            })
            .catch((e) => { console.log(e) });
    }, []);

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar page={1} />
                </div>
                <div className="col-md-10">
                    <div className="m-2">
                        <DataTable
                            title="Users"
                            columns={users}
                            data={data} 
                            pagination
                            highlightOnHover={true}
                            fixedHeader={true} fixedHeaderScrollHeight={'50vh'}
                        />
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default User;
