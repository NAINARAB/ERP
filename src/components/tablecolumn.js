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

const products = [
    {
        name: 'actualQty',
        selector: (row) => row.actualQty,
        sortable: true,
    },
    {
        name: 'amount',
        selector: (row) => row.amount,
        sortable: true,
    },
    {
        name: 'billedQty',
        selector: (row) => row.billedQty,
        sortable: true,
    },
    {
        name: 'billingAddress',
        selector: (row) => row.billingAddress,
        sortable: true,
    },
    {
        name: 'customerName',
        selector: (row) => row.customerName,
        sortable: true,
    },
    {
        name: 'distributorCode',
        selector: (row) => row.distributorCode,
        sortable: true,
    },
    {
        name: 'docDate',
        selector: (row) => row.docDate,
        sortable: true,
    },
    {
        name: 'docNumber',
        selector: (row) => row.docNumber,
        sortable: true,
    },
    {
        name: 'gstinNo',
        selector: (row) => row.gstinNo,
        sortable: true,
    },
    {
        name: 'orderDate',
        selector: (row) => row.orderDate,
        sortable: true,
    },
    {
        name: 'orderNo',
        selector: (row) => row.orderNo,
        sortable: true,
    },
    {
        name: 'orderValue',
        selector: (row) => row.orderValue,
        sortable: true,
    },
    {
        name: 'productName',
        selector: (row) => row.productName,
        sortable: true,
    },
    {
        name: 'rate',
        selector: (row) => row.rate,
        sortable: true,
    },
    {
        name: 'shippingAddress',
        selector: (row) => row.shippingAddress,
        sortable: true,
    },
    {
        name: 'taxAmount',
        selector: (row) => row.taxAmount,
        sortable: true,
    },
    {
        name: 'transType',
        selector: (row) => row.transType,
        sortable: true,
    },
];

const MainMenu = [
    {
        id: 1,
        headname : 'Menu ID',
        variant : 'head',
        align : 'left',
        width : 100
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
        header: 'S.No',
        accessorKey: 'id',
        enableGrouping: false, 
      },
      {
        header: 'Stock Group',
        accessorKey: 'Stock_Group',
      },
      {
        header: 'INM',
        accessorKey: 'Item_Name_Modified',
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
];

export {users, products, prodetails, MainMenu, customStyles, customSelectStyles, ReportMenu};