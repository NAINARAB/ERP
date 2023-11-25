import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { apihost } from "../../env";
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';


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
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '56vh', minHeight: '56vh' } },
    })


    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
}

export default ProductBased;
