import React, { useEffect, useState } from "react";
import { apihost } from "../../backendAPI";
import { CustomerBalance } from "../../components/tablecolumn";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';


const CustomerScreen = () => {
    const [isCustomer, setIsCustomer] = useState(false)
    const [dataArray, setDataArray] = useState([])
    const UserId = localStorage.getItem('UserId');
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        fetch(`${apihost}/api/getBalance?UserId=${UserId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            if (data.status === 'Success') {
                setDataArray(data.data)
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
            // sorting: [{ id: 'Item_Name_Modified', desc: false }],
            // columnVisibility: { month: false },
        },
        muiToolbarAlertBannerChipProps: { color: 'primary' },
        muiTableContainerProps: { sx: { maxHeight: '60vh' } },
    })

    return isCustomer ? (
        <>
            <div className="card">
                <div className="card-header py-3 bg-white" >
                    <h5 className="mb-0">Customer Ballance</h5>
                </div>
                <div className="card-body p-0">
                    {/* <DataTable
                        title={'Completed Tasks List'}
                        columns={TaskDone}
                        data={dataArray}
                        pagination
                        highlightOnHover={true}
                        fixedHeader={true}
                        fixedHeaderScrollHeight={'35vh'}
                        customStyles={customStyles} /> */}
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