import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from './pages/sales/sfsaleorder';
import User from './pages/masters/user'
import SaleOrderList from './pages/sales/saleorderlist';
import Login from './components/login/login';
import UserAuthorization from './pages/masters/userauth';
import TypeAuthorization from './pages/masters/typeauth';
import LOSReport from './pages/report/losreport';
import { CompanyProvider } from './components/context/contextData';
import SFProducts from './pages/masters/sf/sfproducts';
import SFRetailers from './pages/masters/sf/sfretailers';
import SFDetails from './pages/masters/sf/sfdetails';
import SFRoutes from './pages/masters/sf/routes';
import SFDistributors from './pages/masters/sf/distributors';
import HomeComp from './pages/home';
import LOSReport2 from './pages/report/rep2';


function App() {
  return (
      <CompanyProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Login />} />
            <Route path='/home' element={<HomeComp />} />
            <Route path='/saleorder' element={<Product />} />
            <Route path='/users' element={<User />} />
            <Route path='/sales' element={<SaleOrderList />} />
            <Route path='/userauthorization' element={<UserAuthorization />} />
            <Route path='/usertypeauthorization' element={<TypeAuthorization />} />
            <Route path='/losreport' element={<LOSReport />} />
            {/* <Route path='/losreport' element={<LOSReport2 />} /> */}
            <Route path='/salesforce/products' element={<SFProducts />} />
            <Route path='/salesforce/retailers' element={<SFRetailers />} />
            <Route path='/salesforce/sfdetails' element={<SFDetails />} />
            <Route path='/salesforce/routes' element={<SFRoutes />} />
            <Route path='/salesforce/distributor' element={<SFDistributors />} />
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
  );
}

export default App;
