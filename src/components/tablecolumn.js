const customStyles = {
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
            color: 'white'
        },
    },
};

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        height: '45px',
    }),
};

const users = [
    {
        name: 'UserId',
        selector: (row) => row.UserId,
        sortable: true,
    },
    {
        name: 'Name',
        selector: (row) => row.Name,
        sortable: true,
    },
    {
        name: 'Password',
        selector: (row) => row.Password,
        sortable: true,
    },
    {
        name: 'UserName',
        selector: (row) => row.UserName,
        sortable: true,
    },
    {
        name: 'BranchId',
        selector: (row) => row.BranchId,
        sortable: true,
    },
];

const prodetails = [
    {
        name: 'Product Name',
        selector: (row) => row.productName,
        sortable: true,
    },
    {
        name: 'Rate',
        selector: (row) => row.rate,
        sortable: true,
    },
    {
        name: 'Billed Quantity',
        selector: (row) => row.billedQty,
        sortable: true,
    },
    {
        name: 'Unit of Measure',
        selector: (row) => row.umo,
        sortable: true,
    },
    {
        name: 'Amount',
        selector: (row) => row.amount,
        sortable: true,
    }
]

const subtable = [
    {
        id: 1,
        headname: 'actualQty',
        width: 50,
    },
    {
        id: 2,
        headname: 'amount',
    },
    {
        id: 3,
        headname: 'billedQty',
    },
    {
        id: 4,
        headname: 'closeingStock',
    },
    {
        id: 5,
        headname: 'productCode',
    },
    {
        id: 6,
        headname: 'rate',
    },
    {
        id: 7,
        headname: 'taxAmount',
    },
    {
        id: 8,
        headname: 'taxCode',
    },
    {
        id: 9,
        headname: 'umo',
    },
]

const products = [
    {
        name: 'Billing Address',
        selector: (row) => row.billingAddress,
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'Customer',
        selector: (row) => row.customerName,
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'Distributor Code',
        selector: (row) => row.distributorCode,
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'docDate',
        selector: (row) => row.docDate,
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'docNumber',
        selector: (row) => row.docNumber,
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'Order Date',
        selector: (row) => row.orderDate,
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'orderNo',
        selector: (row) => row.orderNo,
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'orderValue',
        selector: (row) => row.orderValue,
        sortable: true,
        maxWidth: '100px'
    },    
    {
        name: 'shippingAddress',
        selector: (row) => row.shippingAddress,
        sortable: true,
        maxWidth: '150px'
    },
    {
        name: 'transType',
        selector: (row) => row.transType,
        sortable: true,
        maxWidth: '150px'
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
        headname: 'Delete_Rights'
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
        width: 300
    },
    {
        header: 'INM',
        accessorKey: 'Item_Name_Modified',
        width: 300
    },
    {
        header: 'Date',
        accessorKey: 'Trans_Date',
    },
    {
        header: 'Balance Quantity',
        accessorKey: 'Bal_Qty',
    },
    {
        header: 'Closing Rate',
        accessorKey: 'CL_Rate',
    },
    {
        header: 'Stock Value',
        accessorKey: 'Stock_Value',
    },
    {
        header: 'Month',
        accessorKey: 'month',
    }
];

export { users, products, prodetails, MainMenu, customStyles, customSelectStyles, ReportMenu, subtable };