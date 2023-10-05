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

export {users, products};