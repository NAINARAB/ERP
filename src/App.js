import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from './components/pages/products';
import User from './components/pages/user';
import SaleOrderList from './components/pages/saleorderlist';
import Login from './components/login/login';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/saleordersync' element={<Product />} />
          <Route path='/users' element={<User />} />
          <Route path='/saleorder' element={<SaleOrderList />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
