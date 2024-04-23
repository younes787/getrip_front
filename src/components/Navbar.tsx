import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faPlane,
  faTaxi,
  faTree,
} from "@fortawesome/free-solid-svg-icons";
import { Menu } from "primereact/menu";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { CreateUser, authRegister } from "../Services";
import { LoginDTO, RegisterDTO } from "../modules/getrip.modules";
import { useAuth } from "../AuthContext/AuthContext";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import AvatarImage from "../Assets/Ellipse.png";
import LoadingComponent from "./Loading";
const NavBar = () => {
  const menuLeft = useRef<any>(null);
  const [show, setshow] = useState<boolean>(false);
  const [showsign, setshowsign] = useState<boolean>(false);
  const { login } = useAuth();
  const { logout } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const register = useFormik<RegisterDTO>({
    initialValues: new RegisterDTO(),
    validateOnChange: true,
    onSubmit: async () => {
      setLoading(true)
      register.values.role = "Client";
      await CreateUser(register.values).then((res)=> setLoading(false)).catch((error) => {
        setLoading(false);
      });
    },
  });
  const loginform = useFormik<LoginDTO>({
    initialValues: new LoginDTO(),
    validateOnChange: true,
    onSubmit: async () => {
      setLoading(true)
      setshow(false)
      await login(loginform.values).then((res:any)=> setLoading(false)).catch((error:any) => {
        setLoading(false);
      });
    },
  });
  const itemRenderer = (item: any) => (
    <a className="flex align-items-center p-menuitem-link">
      <FontAwesomeIcon icon={faCar} />
      <span className="mx-2">{item.label}</span>
    </a>
  );
  const PlaneRender = (item: any) => (
    <a className="flex align-items-center p-menuitem-link">
      <FontAwesomeIcon icon={faPlane} />
      <span className="mx-2">{item.label}</span>
    </a>
  );
  const TaxiRender = (item: any) => (
    <a className="flex align-items-center p-menuitem-link">
      <FontAwesomeIcon icon={faTaxi} />
      <span className="mx-2">{item.label}</span>
    </a>
  );
  const TreeRender = (item: any) => (
    <a className="flex align-items-center p-menuitem-link">
      <FontAwesomeIcon icon={faTree} />
      <span className="mx-2">{item.label}</span>
    </a>
  );
  const items = [
    {
      label: "Air Flights",
      icon: <FontAwesomeIcon icon={faPlane} />,
      template: PlaneRender,
    },
    {
      label: "Renting Cars",
      icon: "pi pi-star",
      template: itemRenderer,
    },
    {
      label: "Airport taxi",
      icon: "pi pi-envelope",
      template: TaxiRender,
    },
    {
      label: "Tourism",
      icon: "pi pi-envelope",
      template: TreeRender,
    },
  ];
  const Menuitems = [
    {
      label: "User Menu",
      items: [
        {
          label: "My Profile",
          icon: "pi pi-user",
        },
        {
          label: "Dashboard",
          icon: "pi pi-chart-bar",
          command: ()=> navigate('/dashboard'),
        },
        {
          label: "Log Out",
          icon: "pi pi-sign-out",
          command: () => logout(),
        },
      ],
    },
  ];
  const end = (
    <div className="flex align-items-center gap-2 mr-7">
      {user ? <></> :<Button
        rounded
        label="Become A Partner"
        outlined
        className="outline_btn"
      />}
      {user ? (
        <>
          <i
            className="pi pi-bold pi-bell mx-2 "
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/notifications")}
          ></i>
          <Avatar
            image={AvatarImage}
            className="mx-2"
            onClick={(event) => menuLeft.current.toggle(event)}
            shape="circle"
            style={{ cursor: "pointer" }}
          />
        </>
      ) : (
        <Button
          rounded
          label="Account"
          icon="pi pi-user"
          onClick={() => setshow(true)}
          className="pr_btn"
        />
      )}
    </div>
  );
  return (
    <div className="card">
      <Dialog
        header={
          <span className="ml-6 text-2xl get-rp flex justify-content-center">
            Ge<span className="secondery">t</span>rip
          </span>
        }
        visible={show}
        className="md:w-30rem lg:w-30rem card-container"
        onHide={() => setshow(false)}
      >
        <span className="primary flex justify-content-center">
          {" "}
          Join to unlimited travel features
        </span>
        <div className=" mt-4">
          <div className="col ml-3">
            <div>
              <label className=" primary" htmlFor="Email">
                Email
              </label>
            </div>

            <InputText
              placeholder="Email"
              name="email"
              className="mt-2 w-24rem	"
              value={loginform?.values?.email}
              onChange={(e) => loginform.setFieldValue("email", e.target.value)}
            />
          </div>
          <div className="col ml-3">
            <div>
              <label className="mb-2 primary" htmlFor="password">
                Password
              </label>
            </div>

            <InputText
              placeholder="Password"
              name="password"
              type="password"
              className="mt-2 w-24rem	"
              value={loginform?.values?.password}
              onChange={(e) =>
                loginform.setFieldValue("password", e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex justify-content-center">
          <Button
            rounded
            label="Log In"
            className="pr_btn w-11 mt-3 "
            onClick={() => loginform.handleSubmit()}
          />
        </div>
        <div className="line-container">
          <hr className="line" />
          <span className="line-text">Don't have an account?</span>
        </div>
        <span className="flex justify-content-center primary">
          <a
            className="mr-1 font-bold"
            onClick={() => {
              setshow(false);
              setshowsign(true);
            }}
          >
            {" "}
            Create Account{" "}
          </a>{" "}
          <span> to unlock the best features</span>
        </span>
        <span className="flex justify-content-center ml-5 mt-3">
          By continuing, you agree to the Terms of Service and acknowledge
          you’ve read our Privacy Policy
        </span>
      </Dialog>
      <></>
      <Dialog
        header={
          <span className="ml-6 text-2xl get-rp flex justify-content-center">
            Ge<span className="secondery">t</span>rip
          </span>
        }
        visible={showsign}
        className="md:w-30rem lg:w-30rem card-container"
        onHide={() => setshowsign(false)}
      >
        <span className="primary flex justify-content-center">
          {" "}
          Join to unlimited travel features
        </span>
        <div className=" mt-4">
          <div className="col ml-3 ">
            <div>
              <label className="primary" htmlFor="Wallet">
                {" "}
                First Name{" "}
              </label>
            </div>
            <InputText
              placeholder="First Name"
              name="name"
              className="mt-2 w-24rem	"
              value={register?.values?.name}
              onChange={(e) => register.setFieldValue("name", e.target.value)}
            />
          </div>
          <div className="col ml-3 ">
            <div>
              <label className="primary" htmlFor="Wallet">
                {" "}
                Last Name{" "}
              </label>
            </div>
            <InputText
              placeholder="Last Name"
              name="lastname"
              value={register?.values?.lastname}
              className="mt-2 w-24rem	"
              onChange={(e) =>
                register.setFieldValue("lastname", e.target.value)
              }
            />
          </div>
          <div className="col ml-3">
            <div>
              <label className="primary" htmlFor="Status">
                {" "}
                Business{" "}
              </label>
            </div>
            <InputText
              placeholder="Business"
              name="business"
              className="mt-2 w-24rem	"
              value={register?.values?.business}
              onChange={(e) =>
                register.setFieldValue("business", e.target.value)
              }
            />
          </div>
          <div className="col ml-3">
            <div>
              <label className=" primary" htmlFor="">
                {" "}
                Username{" "}
              </label>
            </div>
            <InputText
              placeholder="Username"
              name="username"
              className="mt-2 w-24rem	"
              value={register?.values?.username}
              onChange={(e) =>
                register.setFieldValue("username", e.target.value)
              }
            />
          </div>
          <div className="col ml-3">
            <div>
              <label className=" primary" htmlFor="Email">
                Email
              </label>
            </div>

            <InputText
              placeholder="Email"
              name="email"
              className="mt-2 w-24rem	"
              value={register?.values?.email}
              onChange={(e) => register.setFieldValue("email", e.target.value)}
            />
          </div>
          <div className="col ml-3">
            <div>
              <label className="mb-2 primary" htmlFor="Password">
                Password
              </label>
            </div>

            <InputText
              placeholder="Password"
              name="password"
              type="password"
              className="mt-2 w-24rem	"
              value={register?.values?.password}
              onChange={(e) =>
                register.setFieldValue("password", e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex justify-content-center">
          <Button
            rounded
            label="Create Account"
            className="pr_btn w-11 mt-3 "
            onClick={() => register.handleSubmit()}
          />
        </div>
        <div className="line-container">
          <hr className="line" />
          <span className="line-text">Already a member?</span>
        </div>
        <span className="flex justify-content-center primary">
          <a
            className="mr-1 font-bold"
            onClick={() => {
              setshowsign(false);
              setshow(true);
            }}
          >
            {" "}
            Sign In{" "}
          </a>{" "}
          <span> with your account</span>
        </span>
        <span className="flex justify-content-center ml-5 mt-3">
          By continuing, you agree to the Terms of Service and acknowledge
          you’ve read our Privacy Policy.
        </span>
      </Dialog>
      <Menu model={Menuitems} popup ref={menuLeft} className="popup-left" />
      {loading ? <LoadingComponent/>: <Menubar
        end={end}
        start={
          <span className=" text-2xl get-rp" style={{marginLeft:'100px'}} onClick={()=>navigate('/')}>
            Ge<span className="secondery">t</span>rip
          </span>
        }
        className="navbar"
      />}
    </div>
  );
};

export default NavBar;
