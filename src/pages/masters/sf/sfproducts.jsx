import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apihost } from "../../../env";
import { SF_Product, customStyles } from "../../../components/tablecolumn";
import Header from '../../../components/header/header'
import Sidebar from "../../../components/sidenav/sidebar"
import { NavigateNext } from '@mui/icons-material';
import { pageRights } from '../../../components/rightsCheck'
import { Sync } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../../components/loader/loader';
import 'react-toastify/dist/ReactToastify.css';
import '../../com.css';

const SFProducts = () => {
    const [productData, setProductData] = useState([]);
    const [pageInfo, setPageInfo] = useState({ permissions: { Read_Rights: 0, Add_Rights: 0, Edit_Rights: 0, Delete_Rights: 0 }, token: '' });
    const [isSync, setIsSync] = useState(false);


    useEffect(() => {
        pageRights(3, 4).then(rights => {
            if (rights.permissions.Read_Rights === 1) {
                fetch(`${apihost}/api/sf/products`, { method: "GET", headers: { 'Authorization': rights.token } }).then(res => res.json())
                    .then(resdata => {
                        if (resdata.status === "Success") {
                            setProductData(resdata.data)
                        }
                    })
            } setPageInfo(rights)
        })
    }, [])

    const syncSFProduct = () => {
        if (productData.length !== 0) {
            setIsSync(true)
            fetch(`${apihost}/api/sf/products`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageInfo.token,
                },
                body: JSON.stringify({ data: productData })
            }).then(res => res.json()).then(data => {
                setIsSync(false)
                if (data.status === "Success") {
                    toast.success(data.message)
                } else { toast.error(data.message) }
            }).catch(e => console.log(e))
        } else { toast.warn("No Data") }
    }


    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'MASTERS'} subMenuId={'SALES FORCE'} childMenuId={'PRODUCTS'} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        {pageInfo.permissions.Add_Rights === 1
                            && <button
                                className={`comadbtn filticon ${isSync ? 'rotate' : ''}`}
                                onClick={syncSFProduct}
                                disabled={isSync}
                            >
                                <Sync sx={{ color: 'white' }} />
                            </button>}
                        <h5>PRODUCTS</h5>
                        <h6>MASTERS &nbsp;<NavigateNext fontSize="small" />&nbsp;
                            SALES FORCE &nbsp;<NavigateNext fontSize="small" />&nbsp; PRODUCTS</h6>
                    </div>
                    <div className="m-4">
                        {productData && productData.length
                            ? <div className="box">
                                <DataTable
                                    columns={SF_Product}
                                    data={productData}
                                    pagination
                                    highlightOnHover={true}
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight={"68vh"}
                                    customStyles={customStyles}
                                    sort={{ field: 'orderDate', order: 'asc' }}
                                />
                            </div>
                            : <Loader />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SFProducts;