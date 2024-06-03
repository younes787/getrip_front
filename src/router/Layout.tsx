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
import Services from "../pages/Services";
import Logistics from "../pages/Logistics";
import Cites from "../pages/cities";
import LayoutWithSidebar from "../pages/layoutWithSidebar";
import Provinces from "../pages/provinces";
import Places from "../pages/Places";
import Vehicle from "../pages/Vehicle";
import Maker from "../pages/Maker";
import ResidenceType from "../pages/Residence";
import Residence from "../pages/Residencemain";
import Payment from "../pages/Payment";
import Profile from "../pages/Profile";
import VehicleType from "../pages/VehicleType";
import FormUseType from "../components/FormUseType";

const Layout = () => {
  const { user } = useAuth();
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const role = User?.data?.role;

  return (
    <div>
      <NavBar />
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
        {user  ? (
          <>
        { role === 'Administrator' ? <Route element={<LayoutWithSidebar />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/services-type" element={<Services />} />
          <Route path="/countries" element={<Logistics />} />
          <Route path="/cities" element={<Cites />} />
          <Route path="/provinces" element={<Provinces />} />
          <Route path="/places" element={<Places />} />
          <Route path="/vehicle" element={<Vehicle />} />
          <Route path="/vehicle-type" element={<VehicleType />} />
          <Route path="/makers" element={<Maker />} />
          <Route path="/residence-type" element={<ResidenceType />} />
          <Route path="/residence" element={<Residence />} />
          <Route path="/currency" element={<Payment />} />
        </Route> :<></>}
        <Route path="/" element={<Home />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/form-use-type" element={<FormUseType />} />
        </>
        ) : (
          <>
            <Route path="/" element={<Home />}></Route>
          </>
        )}
      </Routes>
    </div>
  );
};

export default Layout;
