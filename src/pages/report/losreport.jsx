import React, { useEffect, useState, useContext } from "react";
import { apihost } from "../../env";
import Header from '../../components/header/header';
import Sidebar from "../../components/sidenav/sidebar";
import { pageRights } from "../../components/rightsCheck";
import { NavigateNext, Sort, LastPage, FirstPage, KeyboardArrowLeft, KeyboardArrowRight,  KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { customSelectStyles } from "../../components/tablecolumn";
import Select from 'react-select';
import { CurrentCompany } from "../../components/context/contextData";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TableContainer, Table, TableHead, 
    TableBody, TableCell, TableRow, TableFooter, Paper, IconButton, Box, useTheme, TablePagination } from "@mui/material";
import { ReportMenu } from "../../components/tablecolumn";
import PropTypes from 'prop-types';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
        </IconButton>
      </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


const LOSReport = () => {
    const today = new Date();
    const todaydate = today.toISOString().split('T')[0];
    const [pageInfo, setPageInfo] = useState({ permissions: { Read_Rights: 0, Add_Rights: 0, Edit_Rights: 0, Delete_Rights: 0 } });
    const { compData } = useContext(CurrentCompany)
    const [open, setOpen] = useState(false)
    const [dropDown, setDropdown] = useState([]);
    const [report, setReport] = useState([]);
    const [selectedValue, setSelectedValue] = useState({ bag: "ALL", group: "ALL", brand: "ALL", stock_group: "ALL", inm: "ALL", date: todaydate});
    
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
                .then(data =>
                    data.status === 200 ? setDropdown(data) : null
                )
        }
    }, [pageInfo, compData])


    useEffect(() => {
        fetch(`${apihost}/api/stockabstract?Fromdate=${selectedValue.date}&Group_ST=${selectedValue.group}&Stock_Group=${selectedValue.stock_group}&Bag=${selectedValue.bag}&Brand=${selectedValue.brand}&Item_Name=${selectedValue.inm}`, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': pageInfo.token,
                'Db': compData.id
            }
        }).then(res => res.json())
          .then(data => {
            let resdata = data.data;
            const uniqeGroup = new Set(); const uniqeGroupId = new Set();
            for (let i = 0; i < resdata.length; i++) {
                resdata[i].id = i + 1;
                try{
                    uniqeGroup.add(resdata[i].Group_Name)
                } catch(e) {
                    console.log(e)
                } finally {
                    uniqeGroupId.add(resdata[i].id)
                }
            } 
            console.log(uniqeGroupId)
            setReport(resdata)
          }).catch(e => console.log(e))
        
    }, [selectedValue,compData])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - report.length) : 0;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
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
                        <button className="comadbtn filticon" onClick={() => setOpen(!open)}><Sort sx={{ color: 'white' }} /></button>
                        <h5>LOS Report</h5>
                        <h6>REPORTS &nbsp;<NavigateNext fontSize="small" />&nbsp; LOS REPORT</h6>
                    </div>

                    <div className="row p-3">
                        <h4 className="pb-2">{"REPORT OF " + compData.Company_Name}</h4>
                        <TableContainer component={Paper} sx={{ maxHeight: 530 }}>
                            <Table stickyHeader aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {ReportMenu.map(obj => (
                                            <TableCell
                                                key={obj.id}
                                                variant={obj.variant}
                                                align={obj.align}
                                                width={obj.width}
                                                sx={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}>
                                                {obj.headname}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {(rowsPerPage > 0 ? report.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : report
                                ).map(obj => (
                                    <TRow key={obj.id} data={obj} />
                                ))}
                                </TableBody>
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                            colSpan={3} sx={{padding: '20px 0px'}}
                                            count={report.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                              inputProps: {
                                                'aria-label': 'rows per page',
                                              },
                                              native: true,
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions} 
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
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
                            styles={customSelectStyles} value={{value: selectedValue.group, label: selectedValue.group}}
                            onChange={(e) => setSelectedValue({ ...selectedValue, group: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select Brand</label>
                        <Select
                            options={dropDown.brand && dropDown.brand.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))}
                            isSearchable={true}
                            placeholder="Brand"
                            styles={customSelectStyles} value={{value: selectedValue.brand, label: selectedValue.brand}}
                            onChange={(e) => setSelectedValue({ ...selectedValue, brand: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select Stock Group</label>
                        <Select
                            options={dropDown.stock_group && dropDown.stock_group.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))}
                            isSearchable={true}
                            placeholder="Stock Group"
                            styles={customSelectStyles} value={{value: selectedValue.stock_group, label: selectedValue.stock_group}}
                            onChange={(e) => setSelectedValue({ ...selectedValue, stock_group: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select INM</label>
                        <Select
                            options={dropDown.inm && dropDown.inm.map(obj => ({ value: obj.Master_Name, label: obj.Master_Name }))}
                            isSearchable={true}
                            placeholder="INM"
                            styles={customSelectStyles} value={{value: selectedValue.inm, label: selectedValue.inm}}
                            onChange={(e) => setSelectedValue({ ...selectedValue, inm: e.value })}
                        />
                    </div>
                    <div className="col-md-6 p-2">
                        <label className="p p-2">Select DATE</label>
                        <input 
                            type="date"
                            className="form-control" 
                            style={{padding:'0.64em', borderColor: 'lightgray', borderRadius: '4px'}} value={selectedValue.date}
                            onChange={(e) => setSelectedValue({...selectedValue, date: e.target.value})} />
                    </div> <div className="p-5 mb-5"></div>
                </DialogContent><hr />
                <DialogActions>
                    <Button  variant="outlined" onClick={() => setOpen(!open)}>Apply</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const TRow = ({data}) => {
    const [open, setOpen] = useState(false);
    return(
    <>
        <TableRow onClick={() => {setOpen(!open)}} hover={true}>
            <TableCell>{data.id}</TableCell>
            <TableCell>{data.Group_Name}</TableCell>
            <TableCell align="right" sx={{padding: '0px'}}><IconButton>{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</IconButton></TableCell>
        </TableRow>
    </>
    )
}

export default LOSReport;