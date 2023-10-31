import React, { useEffect, useState, useContext } from "react";
import { apihost } from "../../env";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, FilterAlt } from '@mui/icons-material';
import { customSelectStyles } from "../../components/tablecolumn";
import Select from 'react-select';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button} from "@mui/material";
import { ReportMenu } from "../../components/tablecolumn";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Loader from '../../components/loader/loader'


const LOSReport = () => {
    const today = new Date();
    today.setDate(today.getDate() - 30);
    const [pageInfo, setPageInfo] = useState({ permissions: { Read_Rights: 0, Add_Rights: 0, Edit_Rights: 0, Delete_Rights: 0 } });
    const { compData } = useContext(CurrentCompany)
    const [open, setOpen] = useState(false)
    const [dropDown, setDropdown] = useState({bag: [], brand: [], group: [], inm: [], stock_group: []});
    const [allReport, setAllReport] = useState([]);
    const allOption = { value: 'ALL', label: 'ALL' };
    const [loading, setLoading] = useState(false);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const dateFormatted = formatDate(today);
    const todateFormatted = formatDate(new Date());
    const [selectedValue, setSelectedValue] = useState({
        bag: "ALL",
        group: "ALL",
        brand: "ALL",
        stock_group: "ALL",
        inm: "ALL",
        date: dateFormatted,
        todate: todateFormatted,
      });

    useEffect(() => {
        pageRights(2, 10).then(rights => {
            setPageInfo(rights);
        })
    }, [])

    useEffect(() => {
        if (pageInfo.permissions.Read_Rights === 1) {
            fetch(`${apihost}/api/losdropdown`, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageInfo.token,
                    'Db': compData.id
                }
            })  .then(res => res.json())
                .then(data => setDropdown(data))
        }
    }, [pageInfo, compData])

    useEffect(() => {
        if(pageInfo.permissions.Read_Rights === 1){
            fetch(`${apihost}/api/stockabstract?Fromdate=${selectedValue.date}&Todate=${selectedValue.todate}&Group_ST=${selectedValue.group}&Stock_Group=${selectedValue.stock_group}&Bag=${selectedValue.bag}&Brand=${selectedValue.brand}&Item_Name=${selectedValue.inm}`, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageInfo.token || localStorage.getItem('userToken'),
                    'Db': compData.id
                }
            }).then(res => res.json())
                .then(data => {
                    let resdata = data.data; const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    for (let i = 0; i < resdata.length; i++) {
                        resdata[i].id = i+1;
                        const date = new Date(resdata[i].Trans_Date);
                        resdata[i].Trans_Date = date.toISOString().split('T')[0];
                        const monthIndex = date.getMonth();
                        resdata[i].month = monthNames[monthIndex];
                    } setAllReport(resdata)
                }).catch(e => console.log(e))
        }
    }, [selectedValue, compData, pageInfo])


    const table = useMaterialReactTable({
        columns: ReportMenu,
        data: allReport,
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableRowVirtualization: true,
        initialState: {
          density: 'compact',
          expanded: true, 
          grouping: ['Stock_Group'], 
          pagination: { pageIndex: 0, pageSize: 100 },
          sorting: [{ id: 'id', desc: false }], 
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: 440 } },
    })

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header setting={true} />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={5} subMenuId={10} />
                </div>
                <div className="col-md-10">
                    <div className="comhed">
                        <button className="comadbtn filticon" onClick={() => setOpen(!open)}><FilterAlt sx={{ color: 'white' }} /></button>
                        <h5>LOS Report</h5>
                        <h6>REPORTS &nbsp;<NavigateNext fontSize="small" />&nbsp; LOS REPORT</h6>
                    </div>

                    <div className="row p-3">
                        <h5 className="py-2">
                            REPORT OF 
                            <span style={{color: 'rgb(66, 34, 225)'}}> &nbsp;{compData.Company_Name}</span> &nbsp; 
                            FROM : 
                            <span style={{color: 'rgb(66, 34, 225)'}}> {selectedValue.date}</span> &nbsp; 
                            TO : 
                            <span style={{color: 'rgb(66, 34, 225)'}}> {selectedValue.todate}</span>
                        </h5>
                        <MaterialReactTable table={table} />
                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={() => { setOpen(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth>
                <DialogTitle>Filter Options</DialogTitle><hr />
                <DialogContent className="row">
                    <div className="col-md-4 p-2">
                        <label className="p p-2">Select Bag</label>
                        <Select
                            options={[allOption, ...dropDown.bag.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))]}
                            isSearchable={true}
                            placeholder="Bag"
                            styles={customSelectStyles} value={{ value: selectedValue.bag, label: selectedValue.bag }}
                            onChange={(e) => setSelectedValue({ ...selectedValue, bag: e.value })}
                        />
                    </div>
                    <div className="col-md-4 p-2">
                        <label className="p p-2">Select Group</label>
                        <Select
                            options={[allOption, ...dropDown.group.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))]}
                            isSearchable={true}
                            placeholder="Group"
                            styles={customSelectStyles} value={{ value: selectedValue.group, label: selectedValue.group }}
                            onChange={(e) => setSelectedValue({ ...selectedValue, group: e.value })}
                        />
                    </div>
                    <div className="col-md-4 p-2">
                        <label className="p p-2">Select Brand</label>
                        <Select
                            options={[allOption, ...dropDown.brand.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))]}
                            isSearchable={true}
                            placeholder="Brand"
                            styles={customSelectStyles} value={{ value: selectedValue.brand, label: selectedValue.brand }}
                            onChange={(e) => setSelectedValue({ ...selectedValue, brand: e.value })}
                        />
                    </div>
                    <div className="col-md-4 p-2">
                        <label className="p p-2">Select Stock Group</label>
                        <Select
                            options={[allOption, ...dropDown.stock_group.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))]}
                            isSearchable={true}
                            placeholder="Stock Group"
                            styles={customSelectStyles} value={{ value: selectedValue.stock_group, label: selectedValue.stock_group }}
                            onChange={(e) => setSelectedValue({ ...selectedValue, stock_group: e.value })}
                        />
                    </div>
                    <div className="col-md-4 p-2">
                        <label className="p p-2">Select INM</label>
                        <Select
                            options={[allOption, ...dropDown.inm.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))]}
                            isSearchable={true}
                            placeholder="INM"
                            styles={customSelectStyles} value={{ value: selectedValue.inm, label: selectedValue.inm }}
                            onChange={(e) => setSelectedValue({ ...selectedValue, inm: e.value })}
                        />
                    </div><div className="col-md-4"></div><div className="col-md-12"><br /></div><hr />
                    <div className="col-md-4 p-2">
                        <label className="p p-2">From DATE</label>
                        <input
                            type="date"
                            className="form-control"
                            style={{ padding: '0.64em', borderColor: 'lightgray', borderRadius: '4px' }} value={selectedValue.date}
                            onChange={(e) => setSelectedValue({ ...selectedValue, date: e.target.value })} />
                    </div>
                    <div className="col-md-4 p-2">
                        <label className="p p-2">To DATE</label>
                        <input
                            type="date"
                            className="form-control"
                            style={{ padding: '0.64em', borderColor: 'lightgray', borderRadius: '4px' }} value={selectedValue.todate}
                            onChange={(e) => setSelectedValue({ ...selectedValue, todate: e.target.value })} />
                    </div>
                     <div className="p-5 mb-5"></div>
                </DialogContent><hr />
                <DialogActions>
                    <Button variant="outlined" onClick={() => { setOpen(!open)}}>Apply</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default LOSReport;