/* eslint-disable jsx-a11y/anchor-is-valid */
import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faServer, faUsers} from "@fortawesome/free-solid-svg-icons";
import { Menu } from "primereact/menu";
import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { CreateUser, GetCitiesbyid, GetAllCountries, GetAllLanguages, GetProvincebyCid, GetCurrency, RegisterServiceProvider, GetServiceTypes, GetPendingUsers, GetPendingServices, GetRejectedUsers, GetRejectedServices } from "../Services";
import { LoginDTO, RegisterDTO, RegisterServiceProviderDTO } from "../modules/getrip.modules";
import { useAuth } from "../AuthContext/AuthContext";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import AvatarImage from "../Assets/Ellipse.png";
import LoadingComponent from "./Loading";
import { Dropdown } from "primereact/dropdown";
import * as Yup from 'yup';
import { Fieldset } from "primereact/fieldset";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;

const NavBar = () => {
  const [show, setshow] = useState<boolean>(false);
  const [showsign, setshowsign] = useState<boolean>(false);
  const [showSelectLang, setshowSelectLang] = useState<boolean>(false);
  const [showsignPartner, setshowsignPartner] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>('');
  const [countries, setCountries] = useState<any>();
  const [selectedCountry, setSelectedCountry] = useState<number>(0);
  const [selectedProvince, setSelectedProvince] = useState<number>(0);
  const [cities, setCities] = useState<any>();
  const [serviceType, setServiceType] = useState<any>();
  const [languages, setLanguages] = useState<any>();
  const [currencies, setCurrencies] = useState<any>();
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const navigate = useNavigate();
  const { login } = useAuth();
  const { logout } = useAuth();
  const { user } = useAuth();
  const menuManeRoutes = useRef<any>(null);
  const [maneRoutes, setManeRoutes] = useState<any[]>([]);

  const initialState = {
    users: {
      pending: [],
      rejected: [],
      loading: false,
    },
    services: {
      pending: [],
      rejected: [],
      loading: false,
    },
    showMenuUsersCard: false,
    showMenuServicesCard: false,
    activeIndex: 0,
  };

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'SET_PENDING_USERS':
        return {
          ...state,
          users: {
            ...state.users,
            pending: action.payload,
            loading: false,
          },
        };
      case 'SET_REJECTED_USERS':
        return {
          ...state,
          users: {
            ...state.users,
            rejected: action.payload,
            loading: false,
          },
        };
      case 'SET_PENDING_SERVICES':
        return {
          ...state,
          services: {
            ...state.services,
            pending: action.payload,
            loading: false,
          },
        };
      case 'SET_REJECTED_SERVICES':
        return {
          ...state,
          services: {
            ...state.services,
            rejected: action.payload,
            loading: false,
          },
        };
      case 'SET_LOADING_USERS':
        return {
          ...state,
          users: {
            ...state.users,
            loading: true,
          },
        };
      case 'SET_LOADING_SERVICES':
        return {
          ...state,
          services: {
            ...state.services,
            loading: true,
          },
        };
      case 'SET_ACTIVE_INDEX':
        return {
          ...state,
          activeIndex: action.payload,
        };
      case 'SET_SHOW_MENU_USERS_CARD':
        return {
          ...state,
          showMenuUsersCard: action.payload,
          activeIndex: 0,
        };
      case 'SET_SHOW_MENU_SERVICES_CARD':
        return {
          ...state,
          showMenuServicesCard: action.payload,
          activeIndex: 0,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { users, services, showMenuUsersCard, showMenuServicesCard, activeIndex } = state;
  const { pending: pendingUsers, rejected: rejectedUsers, loading: loadingUsers } = users;
  const { pending: pendingServices, rejected: rejectedServices, loading: loadingServices } = services;
  const role = User?.data?.role;

  const [externalDataToLocalStorage, setExternalDataToLocalStorage] = useState<any>(() => {
    const { language, country, currency } = JSON.parse(localStorage.getItem('externalDataToLocalStorage') || '{}');

    return {
      language: language || '',
      country: country || '',
      currency: currency || ''
    };
  });

  const validationSchema = Yup.object({
    password: Yup.string()
    .matches(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  });

  useEffect(() => {
    GetAllLanguages().then((res) => setLanguages(res.data));
    GetCurrency().then((res) => setCurrencies(res.data));
    GetServiceTypes().then((res) => setServiceType(res.data));
    GetAllCountries().then((res) => setCountries(res.data));
  }, []);

  useEffect(() => {
    GetProvincebyCid(selectedCountry).then((res) => setProvinces(res.data));
    GetCitiesbyid(selectedProvince).then((res) => setCities(res.data));
  }, [selectedCountry, selectedProvince]);

  useEffect(() => {
    if(selectedCountry && countries) {
      const foundCountries = countries.find((country: any) => country.id === selectedCountry);
      setCountryCode(foundCountries.countryCode ?? countries[0].countryCode);
    }
  }, [selectedCountry, setCountryCode]);

  const handlePhoneChange = (e: any) => {
     const phone = e.target.value.replace(`(${countryCode}) `, '');
    Partneregister.setFieldValue('phone', phone);
  };

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
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
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
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
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

  const Partneregister = useFormik<RegisterServiceProviderDTO>({
    initialValues: new RegisterServiceProviderDTO(),
    validationSchema,
    validateOnChange: true,
    onSubmit: async () => {
      setLoading(true)
      Partneregister.values.role = "Service Provider";
      Partneregister.values.expiration = new Date();
      Partneregister.values.accountId = user?.data?.accountId;

      await RegisterServiceProvider(Partneregister.values).then((res)=> setLoading(false)).catch((error) => {
        setLoading(false);
      });
    },
  });

  const header = () => {
    return (
      <span className="ml-6 text-2xl get-rp flex justify-content-center">
        Ge<span className="secondery">t</span>rip
      </span>
    );
  }

  const ServiceTypeFieldset = ({ serviceTypes, formik }: any) => (
    <Fieldset legend="Service Types" className="md:col-12 lg:col-12 mb-3">
      <div className="grid grid-cols-12">
        {serviceTypes?.map((service_type: any) => (
          <div className="md:col-4 lg:col-4" key={service_type.id}>
            <div
              className="mb-2 rounded-full overflow-hidden flex justify-content-center align-items-center p-2"
              style={{
                width: '50px',
                height: '50px',
                maxWidth: '100px',
                maxHeight: '100px',
                backgroundImage: `url(${service_type?.photos[0]?.imagePath})`,
                backgroundSize: 'cover'
               }}>
            </div>

            <Checkbox
              name={service_type.name}
              checked={formik.values.allowedServiceTypes.some((st: any) => st.serviceTypeId === service_type.id)}
              onChange={(e) => {
                const selectedServiceTypes = [...formik.values.allowedServiceTypes];
                if (e.checked) {
                  selectedServiceTypes.push({ serviceTypeId: service_type.id, accountId: formik.values.accountId });
                } else {
                  const index = selectedServiceTypes.findIndex(st => st.serviceTypeId === service_type.id);
                  if (index > -1) {
                    selectedServiceTypes.splice(index, 1);
                  }
                }
                formik.setFieldValue('allowedServiceTypes', selectedServiceTypes);
              }}
            />
            <label className="m-2" htmlFor="Status">{service_type.name}</label>
          </div>
        ))}
      </div>
    </Fieldset>
  );

  const fetchManeRoutes = async (event: any) => {
    try {
      setManeRoutes([
        {
          label: "User Menu",
          items: [
            { label: "Dashboard", icon: "pi pi-chart-bar", command: () => navigate('/dashboard'), condition: role === 'Administrator' },
            { label: "My Profile", icon: "pi pi-user", command: () => navigate('/profile') },
            { label: "My services", icon: "pi pi-list", command: () => navigate('/my-services') },
            { label: "Add services", icon: "pi pi-plus", command: () => navigate('/add-services') },
            { label: "Log Out", icon: "pi pi-sign-out", command: () => logout() }
          ].filter(c => c.condition === undefined || c.condition)
        }
      ]);

      dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false });
      dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false });

      menuManeRoutes.current.toggle(event);
    } catch (error) {
      console.error("Error fetching mane routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const end = (
    <div className="flex align-items-center gap-2 mr-7">

    <div className="menu-items mr-7">
      <Button label="Expolre" className="border-none primary bg-transparent outline-0 shadow-none px-5"/>
      <Button label="Packages" className="border-none primary bg-transparent outline-0 shadow-none px-5"/>
      <Button label="EN. $" icon={'pi pi-fw pi-globe'} className="border-none primary bg-transparent outline-0 shadow-none" onClick={() => setshowSelectLang(true)}/>
    </div>

      {user?.isSuccess === true ?
        <></> :
        <Button rounded label="Become Our Partner" outlined className="outline_btn" onClick={() => setshowsignPartner(true)}/>
      }

      {user?.isSuccess === true ? (
        <>
          <Button
            className="border-1 primary bg-transparent outline-0 shadow-none mx-1"
            icon={<FontAwesomeIcon icon={faBell} size={"sm"} />}
            onClick={() => {navigate("/notifications")}}
            rounded
            style={{ borderColor: '#ddd', height: '2rem', width: '2rem', padding: '18px'}}
            size="small"
          />

          {role === "Administrator" && <>
            <Button
              className="border-1 primary bg-transparent outline-0 shadow-none mx-1"
              icon={<FontAwesomeIcon icon={faServer} size={"sm"} />}
              onClick={() => dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: !showMenuServicesCard })}
              rounded
              style={{ borderColor: '#ddd', height: '2rem', width: '2rem', padding: '18px'}}
              size="small"
            />

            <Button
              className="border-1 primary bg-transparent outline-0 shadow-none mx-1"
              icon={<FontAwesomeIcon icon={faUsers} size={"sm"} />}
              onClick={() => dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: !showMenuUsersCard })}
              rounded
              aria-controls="popup_menu_left"
              aria-haspopup
              style={{ borderColor: '#ddd', height: '2rem', width: '2rem', padding: '18px'}}
              size="small"
            />
          </>}

          <Avatar
            image={AvatarImage}
            className="mx-2"
            onClick={fetchManeRoutes}
            shape="circle"
            style={{ cursor: "pointer" }}
          />
        </>
      ) : (
        <Button rounded label="Log In" icon="pi pi-user" onClick={() => setshow(true)} className="primary_btn"/>
      )}
    </div>
  );

  const handleChangeIndex = (index: any) => {
    dispatch({ type: 'SET_ACTIVE_INDEX', payload: index });
  };

  useEffect(() => {
    if (showMenuUsersCard) {
      dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false });
      dispatch({ type: 'SET_LOADING_USERS' });
      fetchData('users');
    }
  }, [showMenuUsersCard]);

  useEffect(() => {
    if (showMenuServicesCard) {
      dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false });
      dispatch({ type: 'SET_LOADING_SERVICES' });
      fetchData('services');
    }
  }, [showMenuServicesCard]);

  const fetchData = async (dataType: any) => {
    try {
      let response;
      if (dataType === 'users') {
        response = await GetPendingUsers();
        dispatch({ type: 'SET_PENDING_USERS', payload: response.data.slice(0, 5) });
        response = await GetRejectedUsers();
        dispatch({ type: 'SET_REJECTED_USERS', payload: response.data.slice(0, 5) });
      } else if (dataType === 'services') {
        response = await GetPendingServices();
        dispatch({ type: 'SET_PENDING_SERVICES', payload: response.data.slice(0, 5) });
        response = await GetRejectedServices();
        dispatch({ type: 'SET_REJECTED_SERVICES', payload: response.data.slice(0, 5) });
      }
    } catch (error) {
      console.error(`Error fetching ${dataType}:`, error);
    }
  };

  const LoadingOverlay = () => (
    <div className="loading-overlay-users">
      <div className="spinner"></div>
    </div>
  );

  const UserList = ({ users }: any) => (
    <ul>
      {users.map((user: any, index: number) => (
        <li key={index} className="my-3">{user.name}</li>
      ))}
    </ul>
  );

  const ServiceList = ({ services }: any) => (
    <ul>
      {services.map((service: any, index: number) => (
        <li key={index} className="my-3">{service.name}</li>
      ))}
    </ul>
  );

  const UsersTabView = ({ loading, activeIndex, onChangeIndex }: any) => (
    <TabView activeIndex={activeIndex} onTabChange={(e) => onChangeIndex(e.index)}>
      <TabPanel header="Pending">
        {loading ? <LoadingOverlay /> : pendingUsers.length ? <UserList users={pendingUsers} /> : <p className="mt-3">No pending users</p>}
      </TabPanel>
      <TabPanel header="Rejected">
        {loading ? <LoadingOverlay /> : rejectedUsers.length ? <UserList users={rejectedUsers} /> : <p className="mt-3">No rejected users</p>}
      </TabPanel>
    </TabView>
  );

  const ServicesTabView = ({ loading, activeIndex, onChangeIndex }: any) => (
    <TabView activeIndex={activeIndex} onTabChange={(e) => onChangeIndex(e.index)}>
      <TabPanel header="Pending">
        {loading ? <LoadingOverlay /> : pendingServices.length ? <ServiceList services={pendingServices} /> : <p className="mt-3">No pending services</p>}
      </TabPanel>
      <TabPanel header="Rejected">
        {loading ? <LoadingOverlay /> : rejectedServices.length ? <ServiceList services={rejectedServices} /> : <p className="mt-3">No rejected services</p>}
      </TabPanel>
    </TabView>
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
              onChange={(e) => loginform.setFieldValue("password", e.target.value)}
              onBlur={loginform.handleBlur}
            />

            {loginform.touched.password && loginform.errors.password ? ( <div className="p-error mt-2 text-sm">{loginform.errors.password}</div>) : null}
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
              onBlur={register.handleBlur}
              onChange={(e) =>
                register.setFieldValue("password", e.target.value)
              }
            />
              {register.touched.password && register.errors.password ? ( <div className="p-error mt-2 text-sm">{register.errors.password}</div>) : null}
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
        <h4 className="primary flex justify-content-center">Join to become Our partner</h4>

        <div className="grid grid-cols-12 my-5 our-partner">
          <Fieldset legend="Register Info" className="md:col-12 lg:col-12 mb-3">
            <div className="grid grid-cols-12">
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
                    <label className="mb-2 primary" htmlFor="Password">Password</label>
                  </div>

                  <InputText
                    placeholder="Password"
                    name="password"
                    type="password"
                    className="mt-2	w-full"
                    value={Partneregister?.values?.password}
                    onBlur={Partneregister.handleBlur}
                    onChange={(e) => Partneregister.setFieldValue("password", e.target.value)}
                  />
                  {Partneregister.touched.password && Partneregister.errors.password ? ( <div className="p-error mt-2 text-sm">{Partneregister.errors.password}</div>) : null}
                </div>
            </div>
          </Fieldset>

          <Fieldset legend="Business" className="md:col-12 lg:col-12 mb-3">
            <div className="grid grid-cols-12">

              <div className="md:col-6 lg:col-6">
                <div>
                  <label className="primary" htmlFor="Status">Business Name</label>
                </div>
                <InputText
                  placeholder="Business Name"
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
                  onChange={(e) => {
                    setSelectedCountry(e.value);
                    Partneregister.setFieldValue("countryId", e.value)
                  }}
                />
              </div>

              <div className="md:col-6 lg:col-6">
                <div>
                  <label className=" primary" htmlFor="">Provinc</label>
                </div>

                <Dropdown
                  placeholder="Select a Provinc"
                  options={provinces}
                  optionLabel="name"
                  optionValue="id"
                  name="provincId"
                  filter
                  className="mt-2	w-full"
                  value={Partneregister?.values?.provincId}
                  onChange={(e) => {
                    setSelectedProvince(e.value)
                    Partneregister.setFieldValue("provincId", e.value)
                  }}
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
                  value={`(${countryCode}) ${Partneregister.values.phone}`}
                  onChange={handlePhoneChange}
                />
              </div>

              <div className="md:col-6 lg:col-6">
                <label className="primary" htmlFor="">Currency</label>
                <Dropdown
                  placeholder="Select a Currency"
                  options={currencies}
                  optionLabel="name"
                  optionValue="id"
                  name="currencyId"
                  filter
                  className="mt-2	w-full"
                  value={Partneregister?.values?.currencyId}
                  onChange={(e) =>  Partneregister.setFieldValue("currencyId", e.target.value)}
                />
              </div>

              <div className="md:col-6 lg:col-6">
                <div>
                  <label className=" primary" htmlFor="">Language</label>
                </div>

                <Dropdown
                  placeholder="Select a Languages"
                  options={languages}
                  optionLabel="name"
                  optionValue="id"
                  name="languageId"
                  filter
                  className="mt-2	w-full"
                  value={Partneregister?.values?.languageId}
                  onChange={(e) => Partneregister.setFieldValue('languageId', e.value)}
                />
              </div>
            </div>
          </Fieldset>

          <ServiceTypeFieldset serviceTypes={serviceType} formik={Partneregister} />
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
          <a
            className="mr-1 font-bold"
            onClick={() => {
              setshowsignPartner(false);
              setshow(true);
              }}
          >Log In</a>

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

      <Menu model={maneRoutes} popup ref={menuManeRoutes} />

      <div className="users-icon">
        {showMenuUsersCard && (
          <Card title="Users" className="p-mt-2 menu-users">
            <UsersTabView loading={loadingUsers} users={users} activeIndex={activeIndex} onChangeIndex={handleChangeIndex} />
            <div className="tab-footer" onClick={() => {
              dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false });
              navigate("/stat-of-users")
            }}>Viwe All</div>
          </Card>
        )}
      </div>

      <div className="services-icon">
        {showMenuServicesCard && (
          <Card title="Services" className="p-mt-2 menu-services">
            <ServicesTabView loading={loadingServices} services={services} activeIndex={activeIndex} onChangeIndex={handleChangeIndex} />
            <div className="tab-footer" onClick={() => {
              dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false });
              navigate("/stat-of-services")
            }}>Viwe All</div>
          </Card>
        )}
      </div>

      {loading ? <LoadingComponent/> :
        <Menubar
          start={
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
