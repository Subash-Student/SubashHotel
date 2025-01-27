import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import LogIn from "./page/login/Login.jsx"; // Check if Login.jsx is correctly exported
import Home from "./page/home/Home.jsx";   // Check if Home.jsx is correctly exported
import { StoreContext } from './context/context.js'; // Check if StoreContext is correctly exported

function App() {
  const { token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    token ? navigate("/") : navigate("/login");
  }, [token, navigate]);

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </div>
  );
}

export default App;
