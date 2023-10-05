import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/home';
import Product from './components/pages/products';
import User from './components/pages/user';
import SaleOrderList from './components/pages/saleorderlist';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/saleordersync' element={<Product />} />
        <Route path='/users' element={<User />} />
        <Route path='/saleorder' element={<SaleOrderList />} />
        {/* <Route path='/trip/:id' element={<TripDetails />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
