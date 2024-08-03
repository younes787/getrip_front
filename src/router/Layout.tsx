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
import Cities from "../pages/cities";
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
import MyServices from "../pages/MyServices";
import AddServices from "../pages/AddServices";
import FacilityCategories from "../pages/FacilityCategories";
import Facility from "../pages/Facility";
import StatOfServices from "../pages/StatOfServices";
import StatOfUsers from "../pages/StatOfUsers";
import UserDetails from "../pages/UserDetails";
import ServiceDetailsPage from "../pages/ServiceDetailsPage";
import SearchAndFilter from "../pages/SearchAndFilter";
import Orders from "../pages/Orders";
import HomePageContent from "../pages/HomePageContent";
import { useState } from "react";
import Requests from "../pages/Requests";

const Layout = () => {
  const { user } = useAuth();
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const role = User?.data?.role;
  const [navState, setNavState] = useState<boolean>(false);

  return (
    <div className="h-full">
        <NavBar navState={navState} />
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
      {user ? (
          <>
            {role === 'Administrator' && ( //  || role === 'Service Provider'
              <Route element={<LayoutWithSidebar />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/services-type" element={<Services />} />
                <Route path="/countries" element={<Logistics />} />
                <Route path="/cities" element={<Cities />} />
                <Route path="/provinces" element={<Provinces />} />
                <Route path="/places" element={<Places />} />
                <Route path="/vehicle" element={<Vehicle />} />
                <Route path="/vehicle-type" element={<VehicleType />} />
                <Route path="/facility-categories" element={<FacilityCategories />} />
                <Route path="/facility" element={<Facility />} />
                <Route path="/makers" element={<Maker />} />
                <Route path="/residence-type" element={<ResidenceType />} />
                <Route path="/residence" element={<Residence />} />
                <Route path="/currency" element={<Payment />} />
                <Route path="/home-page-content" element={<HomePageContent />} />
              </Route>
            )}

            <Route path="/" element={<Home />} />
            <Route path="/stat-of-users" element={<StatOfUsers />} />
            <Route path="/stat-of-services" element={<StatOfServices />} />
            <Route path="/user-details/:accountId" element={<UserDetails />} />
            <Route path="/service-details/:serviceType/:serviceId/:queryFilter?/:moreParams?" element={<ServiceDetailsPage onCheckAuth={() => setNavState(true)} />} />
            <Route path="/search-and-filter" element={<SearchAndFilter />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-services" element={<MyServices />} />
            <Route path="/add-services" element={<AddServices />} />
            <Route path="/orders" element={<Orders />} />
            <Route path={`/${role}-requests`} element={<Requests />} />
            <Route path="/form-use-type" element={<FormUseType />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/service-details/:serviceType/:serviceId/:queryFilter?/:moreParams?" element={<ServiceDetailsPage onCheckAuth={() => setNavState(true)} />} />
            <Route path="/search-and-filter" element={<SearchAndFilter />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default Layout;
