const customStyles = {
    table: {
        style: {
            width: 'auto'
        }
    },
    rows: {
        style: {
            minHeight: '4.6em',
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
            backgroundColor: 'rgb(15, 11, 42)',
            color: 'white',
            fontSize: '14px',
        },
    },
};

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        height: '45px',
    }),
    menu: (provided, state) => ({
        ...provided,
        zIndex: 9999,
    }),
};

const users = [
    {
        name: 'UserId',
        selector: (row) => row.UserId,
        sortable: true,
        maxWidth: '50px'
    },
    {
        name: 'Name',
        selector: (row) => row.Name,
        sortable: true,
    },
    {
        name: 'Mobile',
        selector: (row) => row.Mobile,
        sortable: true,
    },
    {
        name: 'User Type',
        selector: (row) => row.UserType,
        sortable: true,
    },
    {
        name: 'Branch Name',
        selector: (row) => row.BranchName,
        sortable: true,
    },
    {
        name: 'Token',
        selector: (row) => row.Token,
        sortable: true,
    },

];

const prodetails = [
    {
        name: 'Product Code',
        selector: (row) => row.productCode,
        sortable: true,
    },
    {
        name: 'Product Name',
        selector: (row) => row.productName,
        sortable: true,
        width: '270px'
    },
    {
        name: 'Quantity',
        selector: (row) => row.billedQty,
        sortable: true,
    },
    {
        name: 'Rate',
        selector: (row) => row.rate,
        sortable: true,
    },
    {
        name: 'Amount',
        selector: (row) => row.amount,
        sortable: true,
    },
    {
        name: "Closeing Stock",
        selector: (row) => row.closeingStock,
        sortable: true
    },
    {
        name: 'Unit of Measure',
        selector: (row) => row.uom,
        sortable: true,
    },
]

const subtable = [
    {
        id: 1,
        headname: 'Product Code',
        width: 150
    },
    {
        id: 2,
        headname: 'Product Name',
        width: 370
    },
    {
        id: 3,
        headname: 'Quantity',
        width: 150
    },
    {
        id: 4,
        headname: 'Rate',
        width: 150
    },
    {
        id: 5,
        headname: 'Amount',
        width: 150
    },
    {
        id: 5,
        headname: 'Closeing Stock',
        width: 150
    },
    {
        id: 6,
        headname: 'uom',
    },
]

const subtable2 = [
    {
        header: 'Code',
        accessorKey: 'productCode',
        size: 100
    },
    {
        header: 'Product Name',
        accessorKey: 'productName',
        size: 270
    },
    {
        header: 'Quantity',
        accessorKey: 'billedQty',
        size: 150,
        align: 'center'
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
    },
    {
        header: 'Customer',
        accessorKey: 'customerName',
    },
    {
        header: 'Closeing Stock',
        accessorKey: 'closeingStock',
        size: 150
    },
    {
        header: 'Date',
        accessorKey: 'orderDate',
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

const products = [
    {
        header: 'Order Taken By',
        accessorKey: 'orderTakenBy',
    },
    {
        header: 'Cus-ID',
        accessorKey: 'customerId',
        size: 150
    },
    {
        header: 'Customer',
        accessorKey: 'customerName',
    },
    {
        header: 'Order Value',
        accessorKey: 'orderValue',
    },
    {
        header: 'Date',
        accessorKey: 'orderDate',
    },
    {
        header: 'Order No',
        accessorKey: 'orderNo',
        size: 230
    },
    {
        header: 'Billing Address',
        accessorKey: 'billingAddress',
        size: 350
    },
];

const MainMenu = [
    {
        id: 1,
        headname: 'Menu ID',
        variant: 'head',
        align: 'left',
        width: 100
    },
    {
        id: 2,
        headname: 'MenuName',
    },
    {
        id: 3,
        headname: 'Read Rights'
    },
    {
        id: 4,
        headname: 'Add Rights'
    },
    {
        id: 5,
        headname: 'Edit Rights'
    },
    {
        id: 6,
        headname: 'Delete Rights'
    },
    {
        id: 7,
        headname: 'Print Rights'
    },
    {
        id: 8,
        headname: 'Action'
    }
];

const ReportMenu = [
    {
        header: 'Stock Group',
        accessorKey: 'Stock_Group',
    },
    {
        header: 'INM',
        accessorKey: 'Item_Name_Modified',
        size: 300
    },
    {
        header: 'Date',
        accessorKey: 'Trans_Date',
    },
    {
        header: 'Balance Quantity',
        accessorKey: 'Bal_Qty',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div style={{ color: 'red' }}>{parseInt(cell.getValue())}</div>
    },
    {
        header: 'Closing Rate',
        accessorKey: 'CL_Rate',
    },
    {
        header: 'Stock Value',
        accessorKey: 'Stock_Value',
        aggregationFn: 'sum',
        AggregatedCell: ({ cell }) => <div style={{ color: 'red' }}>{parseInt(cell.getValue())}</div>
    },
    {
        header: 'Month',
        accessorKey: 'month',
        hide: true
    },
];

const SF_Product = [
    {
        name: 'Product Code',
        selector: (row) => row.productCode,
        sortable: true,
        minWidth: '120px'
    },
    {
        name: 'Name',
        selector: (row) => row.productName,
        sortable: true,
        minWidth: '270px'
    },
    {
        name: 'Description',
        selector: (row) => row.productDescription,
        sortable: true,
    },
    {
        name: 'Category Name',
        selector: (row) => row.product_Cat_Name,
        sortable: true,
    },
    {
        name: 'UMO',
        selector: (row) => row.base_UOM,
        sortable: true,
    },
    {
        name: 'Gross Weight',
        selector: (row) => row.grossweight,
        sortable: true,
    },
    {
        name: 'Net Weight',
        selector: (row) => row.netweight,
        sortable: true,
    },
    {
        name: 'Brand',
        selector: (row) => row.brand,
        sortable: true,
        minWidth: '150px'
    },
    {
        name: 'ERP CODE',
        selector: (row) => row.erP_Code,
        sortable: true,
    }
]

const SF_Retailers = [
    {
        name: 'Retailer Name',
        selector: (row) => row.retailer_Name,
        sortable: true,
        minWidth: '190px'
    },
    {
        name: 'Mobile',
        selector: (row) => row.mobile_No,
        sortable: true,
        maxWidth: '130px'
    },
    {
        name: 'Address',
        selector: (row) => row.address,
        sortable: true,
    },
    {
        name: 'Route',
        selector: (row) => row.route_Name,
        sortable: true,
    },
    {
        name: 'Created',
        selector: (row) => row.created_Date,
        sortable: true,
    },
    {
        name: 'Retailer Code',
        selector: (row) => row.retailer_code,
        sortable: true,
    },
    {
        name: 'Latitude',
        selector: (row) => row.latitude,
        sortable: true,
    },
    {
        name: 'Longitude',
        selector: (row) => row.longitude,
        sortable: true,
    },
    {
        name: 'Pincode',
        selector: (row) => row.pinCode,
        sortable: true,
        minWidth: '150px'
    },
    {
        name: 'ERP CODE',
        selector: (row) => row.erP_Code,
        sortable: true,
    }
]

const SF_Details = [
    {
        name: 'Emp Id',
        selector: (row) => row.employee_Id,
        sortable: true,
        maxWidth: '130px'
    },
    {
        name: 'Employee Name',
        selector: (row) => row.employee_Name,
        sortable: true,
        minWidth: '170px'
    },
    {
        name: 'Mobile',
        selector: (row) => row.mobileNumber,
        sortable: true,
        minWidth: '130px'
    },
    {
        name: 'Designation',
        selector: (row) => row.designation,
        sortable: true,
    },
    {
        name: 'DOB',
        selector: (row) => row.dob,
        sortable: true,
    },
    {
        name: 'DOJ',
        selector: (row) => row.doj,
        sortable: true,
    },
    {
        name: 'EMail',
        selector: (row) => row.email,
        sortable: true,
    },
    {
        name: 'Manager',
        selector: (row) => row.manager_Name,
        sortable: true,
    },
    {
        name: 'Territory',
        selector: (row) => row.territory,
        sortable: true,
    },
    {
        name: 'Total Beats',
        selector: (row) => row.total_Beats,
        sortable: true,
        minWidth: '150px'
    },
    {
        name: 'Status',
        selector: (row) => row.status,
        sortable: true,
    }
]

const SF_Distributors = [
    {
        name: 'Name',
        selector: (row) => row.distributor_Name,
        sortable: true,
        maxWidth: '130px'
    },
    {
        name: 'Contact Person',
        selector: (row) => row.contactPerson,
        sortable: true,
        minWidth: '170px'
    },
    {
        name: 'Mobile',
        selector: (row) => row.mobile,
        sortable: true,
        minWidth: '130px'
    },
    {
        name: 'Type',
        selector: (row) => row.type,
        sortable: true,
    },
    {
        name: 'EMail',
        selector: (row) => row.emailID,
        sortable: true,
    },
    {
        name: 'UserName',
        selector: (row) => row.username,
        sortable: true,
    },
    {
        name: 'ERP CODE',
        selector: (row) => row.erP_Code,
        sortable: true,
    },
    {
        name: 'Territory',
        selector: (row) => row.territory,
        sortable: true,
    },
    {
        name: 'Address',
        selector: (row) => row.address,
        sortable: true,
    }
]

const SF_Routes = [
    {
        name: 'Code',
        selector: (row) => row.route_Code,
        sortable: true,
        maxWidth: '130px'
    },
    {
        name: 'Route Name',
        selector: (row) => row.route_Name,
        sortable: true,
        maxWidth: '200px'
    },
    {
        name: 'SF Name',
        selector: (row) => row.sF_Name,
        sortable: true,
        minWidth: '600px'
    },
    {
        name: 'Territory',
        selector: (row) => row.territory_name,
        sortable: true,
    },
    {
        name: 'State',
        selector: (row) => row.stateName,
        sortable: true,
    },
    {
        name: 'Created At',
        selector: (row) => row.create_Date,
        sortable: true,
    },
]

export {
    users,
    products,
    prodetails,
    MainMenu,
    customStyles,
    customSelectStyles,
    ReportMenu,
    subtable,
    SF_Product,
    SF_Retailers,
    SF_Details,
    SF_Distributors,
    SF_Routes,
    subtable2
};