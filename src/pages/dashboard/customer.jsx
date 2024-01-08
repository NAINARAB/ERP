import React, { useEffect, useMemo, useState } from "react";
import { apihost } from "../../backendAPI";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CustomerBalance } from "../../components/tablecolumn";


const CustomerScreen = () => {
    const [isCustomer, setIsCustomer] = useState(false)
    const [dataArray, setDataArray] = useState([])
    const UserId = localStorage.getItem('UserId');
    const token = localStorage.getItem('userToken');
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetch(`${apihost}/api/getBalance?UserId=${UserId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            if (data.status === 'Success') {
                setDataArray(data.data)
                let temp = 0;
                data.data.map(obj => {
                    temp += parseInt(obj.Bal_Amount)
                })
                setTotal(temp)
            }
            if (data?.isCustomer) {
                setIsCustomer(true)
            } else {
                setIsCustomer(false)
            }
        })
    }, [])

    const table = useMaterialReactTable({
        columns: CustomerBalance,
        data: dataArray,
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableRowVirtualization: true,
        enableColumnOrdering: true,
        enableColumnPinning: true,
        enableRowNumbers: true,
        initialState: {
            density: 'compact',
            expanded: true,
            grouping: [],
            pagination: { pageIndex: 0, pageSize: 100 },
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '60vh' } },
    })

    return isCustomer ? (
        <>
            <div className="card">
                <div className="card-header py-3 bg-white" >
                    <h5 className="mb-0">
                        Balance of {localStorage.getItem('Name') + ' ' + total.toLocaleString('en-IN') + (total < 0 ? ' CR' : ' DR')}
                    </h5>
                </div>
                <div className="card-body p-0">
                    <MaterialReactTable table={table} />
                </div>
            </div>
        </>
    ) : (
        <>
        </>
    )
}

export default CustomerScreen;