import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from './pages/sales/sfsaleorder';
import User from './pages/masters/user'
import SaleOrderList from './pages/sales/saleorderlist';
import Login from './components/login/login';
import UserAuthorization from './pages/masters/userauth';
import LOSReport from './pages/report/losreport';
import { CompanyProvider } from './components/context/contextData';
import SFProducts from './pages/masters/sf/sfproducts';
import SFRetailers from './pages/masters/sf/sfretailers';
import SFDetails from './pages/masters/sf/sfdetails';

function App() {
  return (
      <CompanyProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Login />} />
            <Route path='/saleorder' element={<Product />} />
            <Route path='/users' element={<User />} />
            <Route path='/sales' element={<SaleOrderList />} />
            <Route path='/userauthorization' element={<UserAuthorization />} />
            <Route path='/losreport' element={<LOSReport />} />
            <Route path='/salesforce/products' element={<SFProducts />} />
            <Route path='/salesforce/retailers' element={<SFRetailers />} />
            <Route path='/salesforce/sfdetails' element={<SFDetails />} />
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
  );
}

export default App;
