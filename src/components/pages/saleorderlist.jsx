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
import DataTable from "react-data-table-component";
import Loader from "../loader/loader";

const SaleOrderList = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const ranges = {
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
  };
  const initialStartDate = moment().subtract(29, "days").format("YYYY-MM-DD");
  const initialEndDate = moment().format("YYYY-MM-DD");

  const [dates, setDatesState] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });

  const setDates = (e, { startDate, endDate }) => {
    setDatesState({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    });
  };


  useEffect(() => {
    fetch(`${apihost}/api/listsalesorder?start=${dates.startDate}&end=${dates.endDate}`)
      .then((res) => { return res.json() })
      .then((data) => {
        setData(data.data)
      })
      .catch((e) => { console.log(e) });
  }, [dates]);

  const fetchorderinfo = (num) => {
    setOrderDetails([])
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
          <Sidebar page={3} />
        </div>
        <div className="col-md-10">
          <div className="m-2">
            <h3>Sale Orders</h3><br />
            <p>Select Date Range</p>
            <div className="col-md-4">
              <DateRangePicker
                onApply={setDates}
                initialSettings={{ startDate: dates.startDate, endDate: dates.endDate, ranges: ranges }}
                locale={{
                  format: 'YYYY-MM-DD',
                }}
              >
                <input
                  type="text"
                  value={dates.startDate + " - " + dates.endDate}
                  className="form-control"
                />
              </DateRangePicker><br />

            </div>
            <div className="row">
              {data.map(obj => (
                <div className="col-md-6" key={obj.orderNo}>
                  <div className="card">
                    <div className="text-end"><IconButton onClick={() => { fetchorderinfo(obj.orderNo) }} ><InfoIcon sx={{ color: 'blue' }} /></IconButton></div>
                    <h4><span style={{ float: 'left' }}>Customer Name</span>   <span style={{ float: 'right' }}>{obj.customerName}</span></h4>
                    <p><span style={{ float: 'left' }}>Order No</span>         <span style={{ float: 'right' }}>{obj.orderNo}</span></p>
                    <p><span style={{ float: 'left' }}>Order Value</span>      <span style={{ float: 'right' }}>{obj.orderValue}</span></p>
                    <p><span style={{ float: 'left' }}>Doc Date</span>         <span style={{ float: 'right' }}>{obj.docDate}</span></p>
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
          <DialogTitle id="alert-dialog-title">
            {"Order Details"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {orderDetails.length === 0 ? 
                <Loader /> 
                :
                <DataTable
                  title="Users"
                  columns={products}
                  data={orderDetails}
                  pagination
                  highlightOnHover={true}
                  fixedHeader={true} fixedHeaderScrollHeight={'50vh'}
                />}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpen(false); setOrderDetails([]) }}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default SaleOrderList;
