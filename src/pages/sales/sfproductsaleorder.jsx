import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../env";
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
// import { FileDownload } from '@mui/icons-material';
// import { Box, Button } from "@mui/material";
// import * as XLSX from 'xlsx';


const ProductBased = ({ from, to }) => {
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0)
    const token = localStorage.getItem('userToken');

    const subtable2 = [
        {
            header: 'Date',
            accessorKey: 'orderDate',
            size: 100
        },
        {
            header: 'Customer',
            accessorKey: 'customerName',
            size: 250
        },
        {
            header: 'Product Code',
            accessorKey: 'productCode',
            size: 100
        },
        {
            header: 'Product Name',
            accessorKey: 'productName',
            size: 380
        },
        {
            header: 'Quantity',
            accessorKey: 'billedQty',
            size: 150,
        },
        {
            header: 'Rate',
            accessorKey: 'rate',
            size: 120,
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            size: 150,
            AggregatedCell: ({ cell }) => <div style={{ color: 'blue', fontWeight: 'bold', float: 'right', width: '100%' }}>{parseInt(cell.getValue())}</div>,
            Footer: () => <div style={{ color: 'blue' }}> {totalAmount} </div>,
        },
        {
            header: 'Customer ID',
            accessorKey: 'customerId'
        },
        {
            header: 'Closeing Stock',
            accessorKey: 'closeingStock',
            size: 150
        },

        {
            header: 'Unit Of Measure',
            accessorKey: 'uom',
        },
        {
            header: 'OrderTaken',
            accessorKey: 'orderTakenBy',
        },
    ]

    useEffect(() => {
        axios.get(`${apihost}/api/SaleOrder?from=${from}&to=${to}`, {
            headers: {
                'Authorization': token,
            }
        }).then(data => {
            let temptotal = 0;
            data.data.data.map(obj => {
                obj.amount = parseInt(obj.amount)
                temptotal += obj.amount
            })
            setTotalAmount(temptotal)
            setData(data.data.data);
        }).catch(e => console.log(e))
    }, [from, to]);

    // const XLExport = (rows) => {
    //     const keysToExport = ['orderDate', 'orderTakenBy', 'docNumber', 'productName', 'customerName', 'billedQty', 'rate', 'amount', 'closeingStock', 'orderValue'];
    //     const rowData = rows.map((row) => row.original);
    //     const filteredData = rowData.map((item) => {
    //         return Object.fromEntries(
    //             Object.entries(item).filter(([key]) => keysToExport.includes(key))
    //         );
    //     });
    //     const ws = XLSX.utils.json_to_sheet(filteredData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    //     XLSX.writeFile(wb, 'output.xlsx');
    // }


    const table = useMaterialReactTable({
        columns: subtable2,
        data: data,
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableColumnOrdering: true,
        enableRowNumbers: true,
        initialState: {
            density: 'compact',
            pagination: { pageIndex: 0, pageSize: 100 },
            columnVisibility: { orderTakenBy: false, uom: false, productCode: false, orderTakenBy: false, customerId: false },
        },
        muiPaginationProps: {
            rowsPerPageOptions: ['5', '10', '20', '50', '100', '200', '300', '500', '1000'],
            showFirstButton: true,
            showLastButton: true,
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '56vh', minHeight: '56vh' } },
        // renderTopToolbarCustomActions: ({ table }) => {
        //     return (
        //         <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}
        //             disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}>
        //             <Button onClick={() => XLExport(table.getRowModel().rows)} startIcon={<FileDownload />}>
        //                 Export to Excel
        //             </Button>
        //         </Box>
        //     )
        // },
    })


    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
}

export default ProductBased;
