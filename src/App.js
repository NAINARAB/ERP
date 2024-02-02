import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from './components/context/contextData';
import Login from './components/login/login';
import navRoutes from './roots';


function App() {
  return (
    <div>
      <CompanyProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Login />} />
            {navRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.comp} />
            ))}
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
    </div>
  );
}

export default App;
