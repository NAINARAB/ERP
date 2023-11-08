import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../../env";
import { SF_Product, customStyles } from "../../../components/tablecolumn";
import Header from '../../../components/header/header'
import Sidebar from "../../../components/sidenav/sidebar"
import { NavigateNext } from '@mui/icons-material';
import { pageRights } from '../../../components/rightsCheck'
import '../../com.css';

const SFProducts = () => {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        pageRights(3, 4).then(rights => {
            if (rights.permissions.Read_Rights === 1) {
                fetch(`${apihost}/api/sf/products`, { method: "GET", headers: { 'Authorization': rights.token } }).then(res => res.json())
                    .then(resdata => {
                        if (resdata.status === "Success") {
                            setProductData(resdata.data)
                        }
                    })
            }
        })
    }, [])
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={2} subMenuId={11} childMenuId={4} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <h5>PRODUCTS</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp;
                            SALES FORCE &nbsp;<NavigateNext fontSize="small" />&nbsp; PRODUCTS</h6>
                    </div>
                    <div className="m-4">
                        <br />
                        <div className="box">
                            <DataTable
                                columns={SF_Product}
                                data={productData}
                                pagination
                                highlightOnHover={true}
                                fixedHeader={true}
                                fixedHeaderScrollHeight={"70vh"}
                                customStyles={customStyles}
                                sort={{ field: 'orderDate', order: 'asc' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SFProducts;