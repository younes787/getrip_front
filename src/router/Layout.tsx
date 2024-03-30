import "primereact/resources/themes/lara-light-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import NavBar from "../components/Navbar";

const Layout = () =>{
 return(
    <div>
    <NavBar/>
    <Routes>
    <Route path="/" element={<Home />}></Route>
    </Routes>
    </div>
 )
}

export default Layout;