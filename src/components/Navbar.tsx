import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faPlane, faTaxi, faTree} from "@fortawesome/free-solid-svg-icons";
import { Menu } from "primereact/menu";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { CreateUser, GetAllCities, GetAllCountries, GetAllLanguages, GetCurrency } from "../Services";
import { LoginDTO, RegisterDTO } from "../modules/getrip.modules";
import { useAuth } from "../AuthContext/AuthContext";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import AvatarImage from "../Assets/Ellipse.png";
import LoadingComponent from "./Loading";
import { Dropdown } from "primereact/dropdown";

const NavBar = () => {
  const menuLeft = useRef<any>(null);
  const [show, setshow] = useState<boolean>(false);
  const [showsign, setshowsign] = useState<boolean>(false);
  const [showSelectLang, setshowSelectLang] = useState<boolean>(false);
  const [showsignPartner, setshowsignPartner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [languages, setLanguages] = useState<any>();
  const [currencies, setCurrencies] = useState<any>();
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const navigate = useNavigate();
  const { login } = useAuth();
  const { logout } = useAuth();
  const { user } = useAuth();
  const role = User?.data?.role;
  const [externalDataToLocalStorage, setExternalDataToLocalStorage] = useState<any>(() => {
    const { language, country, currency } = JSON.parse(localStorage.getItem('externalDataToLocalStorage') || '{}');

    return {
      language: language || '',
      country: country || '',
      currency: currency || ''
    };
  });

  useEffect(() => {
    GetAllLanguages().then((res) => setLanguages(res.data));
    GetCurrency().then((res) => setCurrencies(res.data));
    GetAllCountries().then((res) => setCountries(res.data));
    GetAllCities().then((res) => setCities(res.data));
  }, []);

  const handleSelectionChange = (name: any, value: any) => {
    setExternalDataToLocalStorage((prevState: any) => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSave = () => {
      localStorage.setItem('externalDataToLocalStorage', JSON.stringify(externalDataToLocalStorage));
      setshowSelectLang(false);
  };

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
      try{
        setLoading(true)
        setshow(false)
        await login(loginform.values).then((res:any)=> {
          setLoading(false)
        }).catch((error:any) => {
          setLoading(false);
        });
      }
     catch(e){
      console.error(e)
     }
    },
  });

  const Partneregister = useFormik<RegisterDTO>({
    initialValues: new RegisterDTO(),
    validateOnChange: true,
    onSubmit: async () => {
      setLoading(true)
      Partneregister.values.role = "Service Provider";
      await CreateUser(Partneregister.values).then((res)=> setLoading(false)).catch((error) => {
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
          label: "Dashboard",
          icon: "pi pi-chart-bar",
          command: ()=> navigate('/dashboard'),
          condition :  role === 'Administrator'
        },
        {
          label: "My Profile",
          icon: "pi pi-user",
          command: ()=> navigate('/profile'),
        },
        {
          label: "My services",
          icon: "pi pi-list",
          command: ()=> navigate('/my-services'),
          condition :  role === 'Administrator'
        },
        {
          label: "Add services",
          icon: "pi pi-plus",
          command: ()=> navigate('/add-services'),
          condition :  role === 'Administrator'
        },
        {
          label: "Log Out",
          icon: "pi pi-sign-out",
          command: () => logout(),
        },
      ].filter((c)=> c.condition === undefined ? true : c.condition),
    },
  ];

  const header = () => {
    return (
      <span className="ml-6 text-2xl get-rp flex justify-content-center">
        Ge<span className="secondery">t</span>rip
      </span>
    );
  }

  const end = (
    <div className="flex align-items-center gap-2 mr-7">

    <div className="menu-items mr-7">
      <Button label="Expolre" className="border-none primary bg-transparent outline-0 shadow-none px-5"/>
      <Button label="Packages" className="border-none primary bg-transparent outline-0 shadow-none px-5"/>
      <Button label="Support" className="border-none primary bg-transparent outline-0 shadow-none px-5"/>
      <Button label="EN. $" icon={'pi pi-fw pi-globe'} className="border-none primary bg-transparent outline-0 shadow-none" onClick={() => setshowSelectLang(true)}/>
    </div>

      {user?.isSuccess === true ? <></> :<Button
        rounded
        label="Become A Partner"
        outlined
        className="outline_btn"
        onClick={() => setshowsignPartner(true)}
      />}

      {user?.isSuccess === true ? (
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
          className="primary_btn"
        />
      )}
    </div>
  );

  return (
    <div className="card">
      <Dialog
        header={header}
        visible={show}
        className="md:w-30rem lg:w-30rem card-container"
        onHide={() => setshow(false)}
      >
        <h4 className="primary flex justify-content-center">Join to unlimited travel features</h4>

        <div className=" mt-4">
          <div className="col ml-3">
            <div>
              <label className=" primary" htmlFor="Email">
                Email
              </label>
            </div>

            <InputText
              placeholder="Email"
              name="username"
              className="mt-2 w-24rem	"
              value={loginform?.values?.username}
              onChange={(e) => loginform.setFieldValue("username", e.target.value)}
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
            className="primary_btn w-11 mt-3 "
            onClick={() => loginform.handleSubmit()}
          />
        </div>
        <div className="line-container">
          <hr className="line" />
          <span className="line-text">Don't have an account?</span>
        </div>
        <span className="flex justify-content-center primary" style={{ cursor: "pointer"}}>
          <a
            className="mr-1 font-bold"
            onClick={() => {
              setshow(false);
              setshowsign(true);
            }}>Create Account</a>

          <span> to unlock the best features</span>
        </span>
        <span className="flex justify-content-center ml-5 mt-3">
          By continuing, you agree to the Terms of Service and acknowledge
          you’ve read our Privacy Policy
        </span>
      </Dialog>

      <Dialog
        header={header}
        visible={showsign}
        className="md:w-30rem lg:w-30rem card-container"
        onHide={() => setshowsign(false)}
      >
        <h4 className="primary flex justify-content-center">Join to unlimited travel features</h4>

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
        <div className="flex justify-content-center" style={{ cursor: "pointer"}}>
          <Button
            rounded
            label="Create Account"
            className="primary_btn w-11 mt-3 "
            onClick={() => register.handleSubmit()}
          />
        </div>
        <div className="line-container">
          <hr className="line" />
          <span className="line-text">Already a member?</span>
        </div>
        <span className="flex justify-content-center primary" style={{ cursor: "pointer"}}>
          <a className="mr-1 font-bold" onClick={() => {
              setshowsign(false);
              setshow(true);
            }}>Log In</a>
          <span> with your account</span>
        </span>
        <span className="flex justify-content-center ml-5 mt-3">
          By continuing, you agree to the Terms of Service and acknowledge
          you’ve read our Privacy Policy.
        </span>
      </Dialog>

      <Dialog
        header={header}
        visible={showsignPartner}
        className="card-container"
        style={{ width: "50vw" }}
        onHide={() => setshowsignPartner(false)}
      >
        <h4 className="primary flex justify-content-center">Join to become a partner</h4>

        <div className="grid grid-cols-12 my-5">
          <div className="md:col-6 lg:col-6">
            <div>
              <label className="primary" htmlFor="Wallet">First Name</label>
            </div>
            <InputText
              placeholder="First Name"
              name="name"
              className="mt-2	w-full"
              value={Partneregister?.values?.name}
              onChange={(e) => Partneregister.setFieldValue("name", e.target.value)}
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className="primary" htmlFor="Wallet">Last Name</label>
            </div>
            <InputText
              placeholder="Last Name"
              name="lastname"
              value={Partneregister?.values?.lastname}
              className="mt-2	w-full"
              onChange={(e) =>
                Partneregister.setFieldValue("lastname", e.target.value)
              }
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">Username</label>
            </div>
            <InputText
              placeholder="Username"
              name="username"
              className="mt-2	w-full"
              value={Partneregister?.values?.username}
              onChange={(e) =>
                Partneregister.setFieldValue("username", e.target.value)
              }
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="Email">Email</label>
            </div>

            <InputText
              placeholder="Email"
              name="email"
              className="mt-2	w-full"
              value={Partneregister?.values?.email}
              onChange={(e) => Partneregister.setFieldValue("email", e.target.value)}
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className="primary" htmlFor="Status">Business</label>
            </div>
            <InputText
              placeholder="Business"
              name="business"
              className="mt-2	w-full"
              value={Partneregister?.values?.business}
              onChange={(e) =>
                Partneregister.setFieldValue("business", e.target.value)
              }
            />

          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">Position</label>
            </div>
            <InputText
              placeholder="Position"
              name="position"
              className="mt-2	w-full"
              value={Partneregister?.values?.position}
              onChange={(e) =>
                Partneregister.setFieldValue("position", e.target.value)
              }
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">Address</label>
            </div>
            <InputText
              placeholder="Address"
              name="address"
              className="mt-2	w-full"
              value={Partneregister?.values?.address}
              onChange={(e) =>
                Partneregister.setFieldValue("address", e.target.value)
              }
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">Country</label>
            </div>
            <Dropdown
              placeholder="Select a Country"
              options={countries}
              optionLabel="name"
              optionValue="id"
              name="countryId"
              filter
              className="mt-2	w-full"
              value={Partneregister?.values?.countryId}
              onChange={(e) => Partneregister.setFieldValue("countryId", e.value)}
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">City</label>
            </div>
            <Dropdown
              placeholder="Select a City"
              options={cities}
              optionLabel="name"
              optionValue="id"
              name="cityId"
              filter
              className="mt-2	w-full"
              value={Partneregister.values.cityId}
              onChange={(e) => Partneregister.setFieldValue("cityId", e.value)}
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">Zip Code</label>
            </div>
            <InputText
              placeholder="Zip Code"
              name="zipCode"
              className="mt-2	w-full"
              value={Partneregister?.values?.zipCode}
              onChange={(e) =>
                Partneregister.setFieldValue("zipCode", e.target.value)
              }
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">Language</label>
            </div>
            <InputText
              placeholder="Language"
              name="language"
              className="mt-2	w-full"
              value={Partneregister?.values?.language}
              onChange={(e) =>
                Partneregister.setFieldValue("language", e.target.value)
              }
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">Tax Number</label>
            </div>
            <InputText
              placeholder="Tax Number"
              name="taxNumber"
              className="mt-2	w-full"
              value={Partneregister?.values?.taxNumber}
              onChange={(e) =>
                Partneregister.setFieldValue("taxNumber", e.target.value)
              }
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className=" primary" htmlFor="">Phone</label>
            </div>
            <InputText
              placeholder="Phone"
              name="phone"
              className="mt-2	w-full"
              value={Partneregister?.values?.phone}
              onChange={(e) =>
                Partneregister.setFieldValue("phone", e.target.value)
              }
            />
          </div>

          <div className="md:col-6 lg:col-6">
            <div>
              <label className="mb-2 primary" htmlFor="Password">Password</label>
            </div>

            <InputText
              placeholder="Password"
              name="password"
              type="password"
              className="mt-2	w-full"
              value={Partneregister?.values?.password}
              onChange={(e) =>
                Partneregister.setFieldValue("password", e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex justify-content-center" style={{ cursor: "pointer"}}>
          <Button
            rounded
            label="Create Account"
            className="primary_btn w-11 mt-3 "
            onClick={() => Partneregister.handleSubmit()}
          />
        </div>

        <div className="line-container">
          <hr className="line" />
          <span className="line-text">Already a member?</span>
        </div>

        <span className="flex justify-content-center primary" style={{ cursor: "pointer"}}>
          <a className="mr-1 font-bold" onClick={() => {
              setshowsignPartner(false);
              setshow(true);
            }}>Log In</a>

          <span>to your account</span>
        </span>

        <span className="flex justify-content-center ml-5 mt-3">
          By continuing, you agree to the Terms of Service and acknowledge
          you’ve read our Privacy Policy.
        </span>
      </Dialog>

      <Dialog
        header={<span className="text-xl get-rp">Regional settings</span>}
        visible={showSelectLang}
        className="md:w-30rem lg:w-30rem card-container"
        onHide={() => setshowSelectLang(false)}
      >

        <div className="grid grid-cols-12 mb-2">
          <div className="md:col-12 lg:col-12">
            <label className="primary" htmlFor="">
              <i className="pi pi-globe mx-2"></i> Languages
            </label>
            <Dropdown
              placeholder="Select a Languages"
              options={languages}
              optionLabel="name"
              optionValue="id"
              name="language"
              filter
              className="mt-2	w-full"
              value={externalDataToLocalStorage.language}
              onChange={(e) => handleSelectionChange('language', e.value)}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label className="primary" htmlFor="">
              <i className="pi pi-flag mx-2"></i> Country
            </label>
            <Dropdown
              placeholder="Select a Country"
              options={countries}
              optionLabel="name"
              optionValue="id"
              name="country"
              filter
              className="mt-2	w-full"
              value={externalDataToLocalStorage.country}
              onChange={(e) => handleSelectionChange('country', e.value)}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label className="primary" htmlFor="">
              <i className="pi pi-bold pi-money-bill mx-2"></i> Currency
            </label>
            <Dropdown
              placeholder="Select a Currency"
              options={currencies}
              optionLabel="name"
              optionValue="id"
              name="currency"
              filter
              className="mt-2	w-full"
              value={externalDataToLocalStorage.currency}
              onChange={(e) => handleSelectionChange('currency', e.value)}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <Button rounded label="Save" className="primary_btn w-full mt-3" onClick={handleSave}/>
            <Button rounded label="Cancel" outlined className="outline_btn w-full mt-3" onClick={() => setshowSelectLang(false)}/>
          </div>
        </div>

      </Dialog>

      <Menu model={Menuitems} popup ref={menuLeft} className="popup-left" />
      {loading ? <LoadingComponent/> :
        <Menubar start={
            <span className="text-2xl get-rp cursor-pointer" style={{marginLeft:'100px'}} onClick={() => navigate('/')}>
              Ge<span className="secondery">t</span>rip
            </span>
          }
          end={end}
          className="navbar"
        />
      }
    </div>
  );
};

export default NavBar;
