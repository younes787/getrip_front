import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import NavBar from "../components/Navbar";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Layout = () =>{
 return(
    <div>
    <NavBar/>
    <Routes>
    <Route path="/" element={<Home />}></Route>
    <Route path="/login" element={<Login/>} ></Route>
    <Route path="/register" element={<Register/>} ></Route>
    </Routes>
    </div>
 )
}

export default Layout;