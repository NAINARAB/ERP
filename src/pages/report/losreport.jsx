import React, { useEffect, useState, useContext } from "react";
import { apihost } from "../../env";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, FilterAlt } from '@mui/icons-material';
import { customSelectStyles } from "../../components/tablecolumn";
import Select from 'react-select';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { ReportMenu } from "../../components/tablecolumn";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Enumerable from 'linq';
import Loader from '../../components/loader/loader'

const Dropdown = ({ label, options, value, onChange, placeholder }) => (
    <div className="col-md-4 p-2">
        <label className="p p-2">{label}</label>
        <Select
            options={options}
            isSearchable={true}
            placeholder={placeholder}
            styles={customSelectStyles}
            value={{ value, label: value }}
            onChange={(e) => onChange(e.value)}
        />
    </div>
);


const LOSReport = () => {
    const today = new Date();
    today.setDate(today.getDate() - 30);
    const [pageInfo, setPageInfo] = useState({ permissions: { Read_Rights: 0, Add_Rights: 0, Edit_Rights: 0, Delete_Rights: 0 } });
    const { compData } = useContext(CurrentCompany)
    const [open, setOpen] = useState(false)
    const [dropDown, setDropdown] = useState({ stock_group: [], group: [], brand: [], bag: [], inm: [] });
    const [allDropDown, setAllDropDown] = useState([])
    const [allReport, setAllReport] = useState(null);
    const allOption = { value: 'ALL', label: 'ALL' };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const dateFormatted = formatDate(today);
    const todateFormatted = formatDate(new Date());
    const [selectedValue, setSelectedValue] = useState({
        bag: allOption.value,
        group: allOption.value,
        brand: allOption.value,
        stock_group: allOption.value,
        inm: allOption.value,
        date: dateFormatted,
        todate: todateFormatted,
        zero: false
    });

    const includeZero = (array) => {
        if (selectedValue.zero === false) {
            let temp = [];
            array.map(obj => {
                if (obj.Bal_Qty !== 0 || obj.CL_Rate !== 0 || obj.Stock_Value !== 0) {
                    temp.push(obj)
                }
            });
            setAllReport(temp)
        } else {
            setAllReport(array)
        }
    }

    useEffect(() => {
        pageRights(2, 10).then(rights => {
            setPageInfo(rights);
        })
    }, [])

    useEffect(() => {
        if (pageInfo.permissions.Read_Rights === 1) {
            fetch(`${apihost}/api/listlos`, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageInfo.token,
                    'Db': compData.id
                }
            }).then(res => res.json())
                .then(data => {
                    setDropdown({
                        stock_group: data.sg,
                        group: data.g,
                        brand: data.bnd,
                        bag: data.bag,
                        inm: data.inm,
                    }); setAllDropDown(data.data)
                })
        }
    }, [pageInfo, compData])

    useEffect(() => {
        if (pageInfo.permissions.Read_Rights === 1) {
            setAllReport(null)
            fetch(`${apihost}/api/stockabstract?Fromdate=${selectedValue.date}&Todate=${selectedValue.todate}&Group_ST=${selectedValue.group}&Stock_Group=${selectedValue.stock_group}&Bag=${selectedValue.bag}&Brand=${selectedValue.brand}&Item_Name=${selectedValue.inm}`, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': pageInfo.token || localStorage.getItem('userToken'),
                    'Db': compData.id
                }
            }).then(res => res.json())
                .then(data => {
                    includeZero(data.data)
                }).catch(e => {
                    console.log(e)
                    setAllReport([])
                })
        }
    }, [selectedValue, compData, pageInfo])


    const table = useMaterialReactTable({
        columns: ReportMenu,
        data: allReport === null ? [] : allReport,
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableRowVirtualization: true,
        initialState: {
            density: 'compact',
            expanded: true,
            grouping: ['Stock_Group', 'month', 'Item_Name_Modified'],
            pagination: { pageIndex: 0, pageSize: 100 },
            sorting: [{ id: 'Stock_Group', desc: false }],
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: 440 } },
    })

    const brandOptions = () => {
        const query = Enumerable.from(allDropDown);
        return query
            .where(obj =>
                (selectedValue.stock_group === "ALL" || obj.Stock_Group === selectedValue.stock_group) &&
                (selectedValue.group === "ALL" || obj.Group_ST === selectedValue.group) &&
                (selectedValue.bag === "ALL" || obj.Bag === selectedValue.bag) &&
                (selectedValue.inm === "ALL" || obj.Item_Name_Modified === selectedValue.inm)
            )
            .select(obj => ({ value: obj.Brand, label: obj.Brand }))
            .distinct(o => o.value)
            .toArray();
    };

    const stockOptions = () => {
        const query = Enumerable.from(allDropDown);
        return query
            .where(obj =>
                (selectedValue.brand === "ALL" || obj.Brand === selectedValue.brand) &&
                (selectedValue.group === "ALL" || obj.Group_ST === selectedValue.group) &&
                (selectedValue.bag === "ALL" || obj.Bag === selectedValue.bag) &&
                (selectedValue.inm === "ALL" || obj.Item_Name_Modified === selectedValue.inm)
            )
            .select(obj => ({ value: obj.Stock_Group, label: obj.Stock_Group }))
            .distinct(o => o.value)
            .toArray();
    };

    const groupOptions = () => {
        const query = Enumerable.from(allDropDown);
        return query
            .where(obj =>
                (selectedValue.stock_group === "ALL" || obj.Stock_Group === selectedValue.stock_group) &&
                (selectedValue.brand === "ALL" || obj.Brand === selectedValue.brand) &&
                (selectedValue.bag === "ALL" || obj.Bag === selectedValue.bag) &&
                (selectedValue.inm === "ALL" || obj.Item_Name_Modified === selectedValue.inm)
            )
            .select(obj => ({ value: obj.Group_ST, label: obj.Group_ST }))
            .distinct(o => o.value)
            .toArray();
    };

    const bagOptions = () => {
        const query = Enumerable.from(allDropDown);
        return query
            .where(obj =>
                (selectedValue.stock_group === "ALL" || obj.Stock_Group === selectedValue.stock_group) &&
                (selectedValue.group === "ALL" || obj.Group_ST === selectedValue.group) &&
                (selectedValue.brand === "ALL" || obj.Brand === selectedValue.brand) &&
                (selectedValue.inm === "ALL" || obj.Bag === selectedValue.bag)
            )
            .select(obj => ({ value: obj.Bag, label: obj.Bag }))
            .distinct(o => o.value)
            .toArray();
    };
    
    const inmOptions = () => {
        const query = Enumerable.from(allDropDown);
        return query
            .where(obj =>
                (selectedValue.stock_group === "ALL" || obj.Stock_Group === selectedValue.stock_group) &&
                (selectedValue.group === "ALL" || obj.Group_ST === selectedValue.group) &&
                (selectedValue.brand === "ALL" || obj.Brand === selectedValue.brand) &&
                (selectedValue.bag === "ALL" || obj.Bag === selectedValue.bag)
            )
            .select(obj => ({ value: obj.Item_Name_Modified, label: obj.Item_Name_Modified }))
            .distinct(o => o.value)
            .toArray();
    };
    


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
                            <span style={{ color: 'rgb(66, 34, 225)' }}> &nbsp;{compData.Company_Name}</span> &nbsp;
                            FROM :
                            <span style={{ color: 'rgb(66, 34, 225)' }}> {selectedValue.date}</span> &nbsp;
                            TO :
                            <span style={{ color: 'rgb(66, 34, 225)' }}> {selectedValue.todate}</span>
                        </h5>
                        {allReport === null ? <Loader /> : <MaterialReactTable table={table} />}
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
                    <Dropdown
                        label="Select Stock Group"
                        options={
                            (selectedValue.group === "ALL" && selectedValue.brand === "ALL" && selectedValue.bag === "ALL" && selectedValue.inm === "ALL")
                                ? [allOption, ...dropDown.stock_group.map(obj => ({ value: obj.Stock_Group, label: obj.Stock_Group }))]
                                : [allOption, ...stockOptions()]
                        }
                        value={selectedValue.stock_group}
                        onChange={(value) => setSelectedValue({ ...selectedValue, stock_group: value })}
                        placeholder="Stock Group"
                    />
                    <Dropdown
                        label="Select Group"
                        options={
                            (selectedValue.stock_group === "ALL" && selectedValue.brand === "ALL" && selectedValue.bag === "ALL" && selectedValue.inm === "ALL")
                                ? [allOption, ...dropDown.group.map(obj => ({ value: obj.Group_ST, label: obj.Group_ST }))]
                                : [allOption, ...groupOptions()]
                        }
                        value={selectedValue.group}
                        onChange={(value) => setSelectedValue({ ...selectedValue, group: value })}
                        placeholder="Group"
                    />
                    <Dropdown
                        label="Select Brand"
                        options={
                            (selectedValue.stock_group === "ALL" && selectedValue.group === "ALL" && selectedValue.bag === "ALL" && selectedValue.inm === "ALL")
                                ? [allOption, ...dropDown.brand.map(obj => ({ value: obj.Brand, label: obj.Brand }))]
                                : [allOption, ...brandOptions()]
                        }
                        value={selectedValue.brand}
                        onChange={(value) => setSelectedValue({ ...selectedValue, brand: value })}
                        placeholder="Brand"
                    />
                    <Dropdown
                        label="Select Bag"
                        options={
                            (selectedValue.stock_group === "ALL" && selectedValue.group === "ALL" && selectedValue.brand === "ALL" && selectedValue.inm === "ALL")
                                ? [allOption, ...dropDown.bag.map(obj => ({ value: obj.Bag, label: obj.Bag }))]
                                : [allOption, ...bagOptions()]
                        }
                        value={selectedValue.bag}
                        onChange={(value) => setSelectedValue({ ...selectedValue, bag: value })}
                        placeholder="Bag"
                    />
                    <Dropdown
                        label="Select INM"
                        options={
                            (selectedValue.stock_group === "ALL" && selectedValue.group === "ALL" && selectedValue.brand === "ALL" && selectedValue.bag === "ALL")
                                ? [allOption, ...dropDown.inm.map(obj => ({ value: obj.Item_Name_Modified, label: obj.Item_Name_Modified }))]
                                : [allOption, ...inmOptions()]
                        }
                        value={selectedValue.inm}
                        onChange={(value) => setSelectedValue({ ...selectedValue, inm: value })}
                        placeholder="INM"
                    />
                    <div className="col-md-4 p-2">
                        <label className="p p-2">Include Zero Values</label>
                        <Select
                            options={[{ value: false, label: 'No' }, { value: true, label: 'Yes' }]}
                            isSearchable={false}
                            placeholder="Include Zero"
                            styles={customSelectStyles}
                            value={{ value: selectedValue.zero, label: selectedValue.zero === false ? "No" : "Yes" }}
                            onChange={(e) => {
                                setSelectedValue({ ...selectedValue, zero: e.value })
                                includeZero(allReport)
                            }}
                        />
                    </div>
                    <div className="col-md-12"><br /></div><hr />
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
                    <Button variant="contained" onClick={() => { setOpen(!open) }}>Apply</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default LOSReport;