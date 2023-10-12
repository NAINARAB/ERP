import React, { useEffect, useState } from "react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../env";
import Header from "../header/header";
import Sidebar from "../sidenav/sidebar";
import moment from 'moment';
import './com.css';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Slide, IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { products } from "../tablecolumn";
import { prodetails } from "../tablecolumn";
import DataTable from "react-data-table-component";
import Loader from "../loader/loader";

const SaleOrderList = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const initialStartDate = moment().subtract(29, "days").format("YYYY-MM-DD");
  const initialEndDate = moment().format("YYYY-MM-DD");
  const [start, setStart] = useState(initialStartDate);
  const [end, setEnd] = useState(initialEndDate);
  const [popupdetails, setPopupdetails] = useState({});

  useEffect(() => {
    fetchrange()
  }, []);

  const fetchrange = () => {
    if (start > end) {
      toast.warn("Select valid date")
    } else {
      fetch(`${apihost}/api/listsalesorder?start=${start}&end=${end}`)
        .then((res) => { return res.json() })
        .then((data) => {
          setData(data.data)
        })
        .catch((e) => { console.log(e) });
    }
  }

  const fetchorderinfo = (num, all) => {
    setOrderDetails([]);
    setPopupdetails(all);
    fetch(`${apihost}/api/orderinfo?orderno=${num}`)
      .then((res) => { return res.json() })
      .then((data) => {
        setOrderDetails(data.data)
        setOpen(true)
      })
      .catch((e) => { console.log(e) });
  }

  return (
    <>
      <ToastContainer />
      <div className="row">
        <div className="col-md-12">
          <Header />
        </div>
        <div className="col-md-2">
          <Sidebar mainMenuId={4} subMenuId={7} />
        </div>
        <div className="col-md-10">
          <div className="m-3">
            <h3>Sale Orders</h3><br />
            <p>Select Date Range</p>
            <div className="row">
              <div className="col-md-4 px-2">
                <p>Form</p>
                <input type="date" className="form-control" value={start} onChange={(e) => { setStart(e.target.value) }} />
              </div>
              <div className="col-md-4 px-2">
                <p>To</p>
                <input type="date" className="form-control" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
              <div className="col-md-4 px-2">
                <p style={{ opacity: '0' }}>j</p>
                <button className="btn btn-success" onClick={fetchrange}>Search</button>
              </div>
            </div><br />
            <div className="row">
              {data.map(obj => (
                <div className="col-md-6" key={obj.orderNo}>
                  <div className="card">
                    <div className="text-end"><IconButton onClick={() => { fetchorderinfo(obj.orderNo, obj) }} ><InfoIcon sx={{ color: 'blue' }} /></IconButton></div>
                    <h4><span style={{ float: 'left' }}>Customer Name</span>   <span style={{ float: 'right' }}>{obj.customerName}</span></h4>
                    <p><span style={{ float: 'left' }}>Order No</span>         <span style={{ float: 'right' }}>{obj.orderNo}</span></p>
                    <p><span style={{ float: 'left' }}>Order Value</span>      <span style={{ float: 'right' }}>{obj.orderValue}</span></p>
                    <p><span style={{ float: 'left' }}>Doc Date</span>         <span style={{ float: 'right' }}>{moment(obj.docDate).format("DD-MM-YYYY")}</span></p>
                    <p><span style={{ float: 'left' }}>Shipping Address</span> <span style={{ float: 'right' }}>{obj.shippingAddress}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Dialog
          open={open}
          onClose={() => { setOpen(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Order Details
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {orderDetails.length === 0 ?
                <Loader />
                :
                <>
                  <div className="row">
                    <div className="col-md-6 px-4">
                      <p style={{color:'black'}}>Customer Name    <span className="text-primary" style={{ float: 'right' }}>{popupdetails.customerName}</span>    </p>
                      <p style={{color:'black'}}>Order No         <span className="text-primary" style={{ float: 'right',fontSize:'0.85em' }}>{popupdetails.orderNo}</span>         </p>
                    </div>
                    <div className="col-md-6 px-4">
                      <p style={{color:'black'}}>Doc Date         <span className="text-primary" style={{ float: 'right' }}>{moment(popupdetails.docDate).format("DD-MM-YYYY")}</span>         </p>
                      <p style={{color:'black'}}>Shipping Address &nbsp;<span className="text-primary" style={{ float: 'right',fontSize:'0.85em' }}>{popupdetails.shippingAddress}</span> </p>
                    </div>
                  </div>
                  
                  <DataTable
                    columns={prodetails}
                    data={orderDetails}
                    pagination
                    highlightOnHover={true}
                    fixedHeader={true} fixedHeaderScrollHeight={'50vh'}
                  />
                  <div className="text-end">
                    <p style={{ color: 'black', fontWeight: 'bold' }}>Total Amount: {popupdetails.orderValue}</p>
                  </div>
                </>
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpen(false)}}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default SaleOrderList;
