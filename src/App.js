import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from './pages/sales/products';
import User from './pages/masters/user'
import SaleOrderList from './pages/sales/saleorderlist';
import Login from './components/login/login';
import UserAuthorization from './pages/masters/userauth';
import LOSReport from './pages/report/losreport';
import { CompanyProvider } from './components/context/contextData';

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
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
  );
}

export default App;
