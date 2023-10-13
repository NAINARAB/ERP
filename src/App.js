import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from './components/pages/products';
import User from './components/pages/user';
import SaleOrderList from './components/pages/saleorderlist';
import Login from './components/login/login';
import UserAuthorization from './components/pages/userauth';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/saleorder' element={<Product />} />
          <Route path='/users' element={<User />} />
          <Route path='/sales' element={<SaleOrderList />} />
          <Route path='/userauthorization' element={<UserAuthorization />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
