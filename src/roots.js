import TaskLogout from './components/tasklogout';
import Product from './pages/sales/sfsaleorder';
import User from './pages/masters/user'
import SaleOrderList from './pages/sales/saleorderlist';
import UserAuthorization from './pages/masters/userauth';
import TypeAuthorization from './pages/masters/typeauth';
// import LOSReport from './pages/report/losreport';
import SFProducts from './pages/masters/sf/sfproducts';
import SFRetailers from './pages/masters/sf/sfretailers';
import SFDetails from './pages/masters/sf/sfdetails';
import SFRoutes from './pages/masters/sf/routes';
import SFDistributors from './pages/masters/sf/distributors';
import HomeComp from './pages/dashboard/home';
import Employees from './pages/masters/emp';
import EmpMyAttendance from './pages/dashboard/empattendance';
import AttendanceManagement from './pages/masters/attendencemanagement';
// import PurchaseReport from './pages/report/purchasereport';
import CustomerCategories from './pages/masters/customers/customerCategories';
import ChangePassword from './pages/dashboard/changePassword';
import PendingInvoice from './pages/payments/pendingInvoice';
import PaymentSuccess from './pages/payments/paymentSuccess';
import PaymentFailure from './pages/payments/paymentFailure';
import PaymentReport from './pages/payments/paymentsReport';
import TableueComp from './pages/tablu/reporting';
import StockReport2 from './pages/report/newStockReport';
import PurchaseReport2 from './pages/report/newPurchaseReport';


const navRoutes = [
    {
      comp: <HomeComp />,
      path: '/home',
    },
    {
      comp: <TaskLogout />,
      path: '/tasklogout',
    },
    {
      comp: <Product />,
      path: '/saleorder',
    },
    {
      comp: <User />,
      path: '/users',
    },
    {
      comp: <SaleOrderList />,
      path: '/sales',
    },
    {
      comp: <UserAuthorization />,
      path: '/userauthorization',
    },
    {
      comp: <TypeAuthorization />,
      path: '/usertypeauthorization',
    },
    {
      comp: <StockReport2 />,
      path: '/losreport',
    },
    {
      comp: <SFProducts />,
      path: '/salesforce/products',
    },
    {
      comp: <SFRetailers />,
      path: '/salesforce/retailers',
    },
    {
      comp: <SFDetails />,
      path: '/salesforce/sfdetails',
    },
    {
      comp: <SFRoutes />,
      path: '/salesforce/routes',
    },
    {
      comp: <SFDistributors />,
      path: '/salesforce/distributor',
    },
    {
      comp: <Employees />,
      path: '/empmaster',
    },
    {
      comp: <EmpMyAttendance />,
      path: '/empattendance',
    },
    {
      comp: <AttendanceManagement />,
      path: '/attendencemanagement',
    },
    // {
    //   comp: <PurchaseReport />,
    //   path: '/purchasereport',
    // },
    {
      comp: <CustomerCategories />,
      path: '/masters/customers',
    },
    {
      comp: <ChangePassword />,
      path: '/changepassword',
    },
    {
      comp: <PendingInvoice />,
      path: '/payments/pendingInvoice',
    },
    {
      comp: <PaymentSuccess />,
      path: '/Payment_Success',
    },
    {
      comp: <PaymentFailure />,
      path: '/Payment_Failure',
    },
    {
      comp: <PaymentReport />,
      path: '/payments/PaymentHistory',
    },
    {
      comp: <TableueComp />,
      path: '/tableaureports',
    },
    {
      comp: <PurchaseReport2 />,
      path: '/purchasereport'
    }
  ];

  export default navRoutes;