import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../backendAPI";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import moment from 'moment';
import '../com.css';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from "@mui/material";
import { Info } from '@mui/icons-material';
import { prodetails } from "../../components/tablecolumn";
import DataTable from "react-data-table-component";
import Loader from "../../components/loader/loader";
import CurrentPage from '../../components/currentPage'

const SaleOrderList = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const initialStartDate = moment().subtract(29, "days").format("YYYY-MM-DD");
  const initialEndDate = moment().format("YYYY-MM-DD");
  const [start, setStart] = useState(initialStartDate);
  const [end, setEnd] = useState(initialEndDate);
  const [popupdetails, setPopupdetails] = useState({});
  const token = localStorage.getItem('userToken');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (token) {
      fetchrange()
    }
  }, [start, end]);

  function handleSearchChange(event) {
    const term = event.target.value;
    setSearchTerm(term);
    const filteredResults = data.filter(item => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(term.toLowerCase())
      );
    });

    setFilteredData(filteredResults);
  }

  const fetchrange = () => {
    if (start > end) {
      toast.warn("Select valid date")
    } else {
      fetch(`${apihost}/api/listsalesorder?start=${start}&end=${end}`, { headers: { 'Authorization': token } })
        .then((res) => { return res.json() })
        .then((data) => {
          if (data.status === "Success") {
            setData(data.data)
            data.data.map(obj => {
              obj.docDate = moment(obj.docDate).format("DD-MM-YYYY")
            })
          }
        })
        .catch((e) => { console.log(e) });
    }
  }

  const fetchorderinfo = (num, all) => {
    setOrderDetails([]);
    setPopupdetails(all);
    fetch(`${apihost}/api/orderinfo?orderno=${num}`, { headers: { 'Authorization': token } })
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
          <Sidebar mainMenuId={"SALES"} subMenuId={'SALES ORDER LIST'} />
        </div>
        <div className="col-md-10 p-3">

          <CurrentPage MainMenu={'SALES'} SubMenu={'SALES LIST'} />

          <div className="row">
            <div className="col-md-3 px-2">
              <p className="mb-0 p-2">Form</p>
              <input type="date" className="form-control p-2" value={start} onChange={(e) => { setStart(e.target.value) }} />
            </div>
            <div className="col-md-3 px-2">
              <p className="mb-0 p-2">To</p>
              <input type="date" className="form-control p-2" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="col-md-3 px-2">
              <p className="mb-0 p-2">Search Data</p>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} className="form-control p-2" />
            </div>

          </div><br />

          <div className="row" style={{ maxHeight: '68vh', overflowY: 'scroll', backgroundColor: 'transparent' }}>

            {(filteredData && filteredData.length ? filteredData : searchTerm === '' ? data : []).map(obj => (
              <div className="col-lg-4 col-sm-6" key={obj.orderNo}>
                <div className="card p-3 m-3">
                  <div className="text-end"><IconButton onClick={() => { fetchorderinfo(obj.orderNo, obj) }} ><Info sx={{ color: 'blue' }} /></IconButton></div>
                  <h4>
                    <span style={{ float: 'left' }}>Customer</span>
                    <span style={{ float: 'right', width: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>{obj.customerName}</span>
                  </h4>
                  <p><span style={{ float: 'left' }}>Order No</span>         <span style={{ float: 'right' }}>{obj.orderNo}</span></p>
                  <p><span style={{ float: 'left' }}>Order Value</span>      <span style={{ float: 'right' }}>{obj.orderValue}</span></p>
                  <p><span style={{ float: 'left' }}>Date</span>         <span style={{ float: 'right' }}>{obj.docDate}</span></p>
                  <p>
                    <span style={{ float: 'left' }}>Address</span>
                    <span style={{ float: 'right', width: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>
                      {obj.shippingAddress}
                    </span>
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>


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
                    <p style={{ color: 'black' }}>Name <span className="text-primary" style={{ float: 'right' }}>{popupdetails.customerName}</span></p>
                    <p style={{ color: 'black' }}>Order No <span className="text-primary" style={{ float: 'right', fontSize: '0.85em' }}>{popupdetails.orderNo}</span></p>
                  </div>
                  <div className="col-md-6 px-4">
                    <p style={{ color: 'black' }}>Date <span className="text-primary" style={{ float: 'right' }}>{moment(popupdetails.docDate).format("DD-MM-YYYY")}</span></p>
                    <p style={{ color: 'black' }}>
                      Address &nbsp;<span className="text-primary" style={{ float: 'right', fontSize: '0.85em', textAlign: 'right' }}>{popupdetails.shippingAddress}</span>
                    </p>
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
          <Button onClick={() => { setOpen(false) }} color="error">Close</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default SaleOrderList;
