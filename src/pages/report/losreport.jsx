import React, { useEffect, useState, useContext } from "react";
import { apihost } from "../../env";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, Sort } from '@mui/icons-material';
import { customSelectStyles } from "../../components/tablecolumn";
import Select from 'react-select';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";


const LOSReport = () => {
    const today = new Date();
    const todaydate = today.toISOString().split('T')[0];
    const [pageInfo, setPageInfo] = useState({ permissions: { Read_Rights: 0, Add_Rights: 0, Edit_Rights: 0, Delete_Rights: 0 } });
    const { compData } = useContext(CurrentCompany)
    const [open, setOpen] = useState(false)
    const [dropDown, setDropdown] = useState([]);
    const [selectedValue, setSelectedValue] = useState({
        bag: "ALL",
        group: "ALL",
        brand: "ALL",
        stock_group: "ALL",
        inm: "ALL",
        date: todaydate
    })

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
            }).then(res => res.json())
                .then(data =>
                    data.status === 200 ? setDropdown(data) : null
                )
        }
    }, [pageInfo, compData])


    useEffect(() => {
        fetch(`${apihost}/api/stockabstract?Fromdate=${selectedValue.date}&Group_ST=${selectedValue.group}&Stock_Group=${selectedValue.stock_group}&Bag=${selectedValue.bag}&Brand=${selectedValue.brand}&Item_Name=${selectedValue.inm}`, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Db': compData.id
            }
        }).then(res => res.json())
          .then(data => console.log(data.data))
        
    }, [selectedValue,compData])


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
                        <button className="comadbtn filticon" onClick={() => setOpen(!open)}><Sort sx={{ color: 'white' }} /></button>
                        <h5>LOS Report</h5>
                        <h6>REPORTS &nbsp;<NavigateNext fontSize="small" />&nbsp; LOS REPORT</h6>
                    </div>

                    <div className="row p-2">
                        <h4 className="px-2 pt-1">{"REPORT OF " + compData.Company_Name}</h4>
                        
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
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select Bag</label>
                        <Select
                            options={dropDown.bag && dropDown.bag.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))}
                            isSearchable={true}
                            placeholder="Bag"
                            styles={customSelectStyles} value={{value: selectedValue.bag, label: selectedValue.bag}}
                            onChange={(e) => setSelectedValue({ ...selectedValue, bag: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select Group</label>
                        <Select
                            options={dropDown.group && dropDown.group.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))}
                            isSearchable={true}
                            placeholder="Group"
                            styles={customSelectStyles} 
                            onChange={(e) => setSelectedValue({ ...selectedValue, group: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select Brand</label>
                        <Select
                            options={dropDown.brand && dropDown.brand.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))}
                            isSearchable={true}
                            placeholder="Brand"
                            styles={customSelectStyles} 
                            onChange={(e) => setSelectedValue({ ...selectedValue, brand: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select Stock Group</label>
                        <Select
                            options={dropDown.stock_group && dropDown.stock_group.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))}
                            isSearchable={true}
                            placeholder="Stock Group"
                            styles={customSelectStyles} 
                            onChange={(e) => setSelectedValue({ ...selectedValue, stock_group: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select INM</label>
                        <Select
                            options={dropDown.inm && dropDown.inm.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))}
                            isSearchable={true}
                            placeholder="INM"
                            styles={customSelectStyles} 
                            onChange={(e) => setSelectedValue({ ...selectedValue, inm: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select DATE</label>
                        <input 
                            type="date"
                            className="form-control" 
                            style={{padding:'0.64em', borderColor: 'lightgray', borderRadius: '4px'}}
                            onChange={(e) => setSelectedValue({...selectedValue, date: e.target.value})} />
                    </div> <div className="p-5 mb-5"></div>
                </DialogContent>
                <DialogActions>
                    <Button  variant="outlined" onClick={() => setOpen(!open)}>Apply</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default LOSReport;