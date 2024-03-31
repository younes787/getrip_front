import "primereact/resources/themes/lara-light-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import NavBar from "../components/Navbar";
import { Bounce, ToastContainer } from "react-toastify";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import { useAuth } from "../AuthContext/AuthContext";

const Layout = () =>{
  const { user } = useAuth();

 return(
    <div>
    <NavBar/>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <ToastContainer />
    <Routes>
    {user ? 
   (  <>
    <Route path="/dashboard" element={<Dashboard />}></Route>
    <Route path="/users" element={<Users />}></Route>
    </>):
    <>
        <Route path="/" element={<Home />}></Route>
    </>
    }
    </Routes>
    </div>
 )
}

export default Layout;