import { Menubar } from "primereact/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faChartArea, faChartBar, faHistory, faList, faPlaneDeparture, faPlus, faServer, faSignOut, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import { Menu } from "primereact/menu";
import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { CreateUser, GetCitiesbyid, GetAllCountries, GetAllLanguages, GetProvincebyCid, GetCurrency, RegisterServiceProvider, GetServiceTypes, GetPendingUsers, GetPendingServices, ApproveService, ApproveUser, RejectService, RejectUser } from "../Services";
import { LoginDTO, RegisterDTO, RegisterServiceProviderDTO } from "../modules/getrip.modules";
import { useAuth } from "../AuthContext/AuthContext";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "./Loading";
import { Dropdown } from "primereact/dropdown";
import * as Yup from 'yup';
import { Fieldset } from "primereact/fieldset";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Badge } from "primereact/badge";
import { DataType } from "../enums";
import { useTranslation } from "react-i18next";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;

const NavBar = ({navState}: any) => {
  const [show, setshow] = useState<boolean>(false);
  const [showsign, setshowsign] = useState<boolean>(false);
  const [showSelectLang, setshowSelectLang] = useState<boolean>(false);
  const [showsignPartner, setShowSignPartner] = useState<boolean>(false);
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
  const { user, login, logout } = useAuth();
  const menuMainRoutes = useRef<any>(null);
  const [mainRoutes, setMainRoutes] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showMenuNotificationsCard, setShowMenuNotificationsCard] = useState<any>(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [check, setCheck] = useState<boolean>(false);
  const [checkService, setCheckService] = useState<boolean>(false);
  const [checkUser, setCheckUser] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentUserId, setCurrentUserId] = useState<any>(null);
  const [currentServiceId, setCurrentServiceId] = useState<any>(null);
  const [headerRejectionReason, setHeaderRejectionReason] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleRejectClick = (id: number, fromUser: boolean = true) => {
    if(fromUser) {
      setHeaderRejectionReason('User rejection reason');
      setCurrentUserId(id);
    } else {
      setHeaderRejectionReason('Service rejection reason');
      setCurrentServiceId(id);
    }

    setShowDialog(true);
  };

  const handleRejectConfirm = () => {
    if (currentUserId !== null) {
      RejectUser({
        id: currentUserId,
        note: rejectionReason
      }).then((res) => {
        if (res.isSuccess) {
          setCheckUser(true);
          confirmDialog({
            header: 'Success!',
            message: 'User Rejection successfully.',
            icon: 'pi pi-check-circle',
            defaultFocus: 'accept',
            content: (props) => (
              <CustomConfirmDialogContent {...props} resetForm={false} />
            ),
          });
        }
      });
    }

    if (currentServiceId !== null) {
      RejectService({
        id: currentServiceId,
        note: rejectionReason
      }).then((res) => {
        if (res.isSuccess) {
          setCheckService(true);
          confirmDialog({
            header: 'Success!',
            message: 'Service Rejection successfully.',
            icon: 'pi pi-check-circle',
            defaultFocus: 'accept',
            content: (props) => (
              <CustomConfirmDialogContent {...props} resetForm={false} />
            ),
          });
        }
      });
    }

    setShowDialog(false);
    setRejectionReason('');
  };

  const initialState = {
    users: {
      pending: [],
      loading: false,
    },
    services: {
      pending: [],
      loading: false,
    },
    showMenuUsersCard: false,
    showMenuServicesCard: false,
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
      case 'SET_PENDING_SERVICES':
        return {
          ...state,
          services: {
            ...state.services,
            pending: action.payload,
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
      case 'SET_SHOW_MENU_USERS_CARD':
        return {
          ...state,
          showMenuUsersCard: action.payload,
        };
      case 'SET_SHOW_MENU_SERVICES_CARD':
        return {
          ...state,
          showMenuServicesCard: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { users, services, showMenuUsersCard, showMenuServicesCard } = state;
  const { pending: pendingUsers, loading: loadingUsers } = users;
  const { pending: pendingServices, loading: loadingServices } = services;
  const role = User?.data?.role;
  const hasOpenedRef = useRef<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!event.target.closest('.menu-users') &&
          !event.target.closest('.menu-services') &&
          !event.target.closest('.menu-notifications') &&
          !event.target.closest('.icon-services') &&
          !event.target.closest('.icon-users') &&
          !event.target.closest('.icon-notifications')) {
        dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false });
        dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false });
        setShowMenuNotificationsCard(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [externalDataToLocalStorage, setExternalDataToLocalStorage] = useState<any>(() => {
    const { language, country, currency } = JSON.parse(localStorage.getItem('externalDataToLocalStorage') || '{}');

    return {
      language: language || '',
      country: country || '',
      currency: currency || ''
    };
  });

  const validationSchemaLogin = Yup.object({
    password: Yup.string().matches(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character').min(8, 'Password must be at least 8 characters long').required('Password is required'),
  });

  const validationSchemaRegister = Yup.object({
    password: Yup.string().matches(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character').min(8, 'Password must be at least 8 characters long').required('Password is required'),
    confirm_password: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwords must match').required('Confirm password is required'),
  });

  useEffect(() => {
    GetAllLanguages().then((res) => setLanguages(res.data));
    GetCurrency().then((res) => setCurrencies(res.data));
    GetServiceTypes().then((res) => setServiceType(res.data));
    GetAllCountries().then((res) => setCountries(res.data));

    if(user) {
      dispatch({ type: 'SET_LOADING_USERS' });
      fetchData('users');

      dispatch({ type: 'SET_LOADING_SERVICES' });
      fetchData('services');
    }
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
    const languageMap: any = { 1: 'en', 2: 'ar', 3: 'tr'};

    if(name === "language") {
      const selectedLanguage = languageMap[value] || 'en';
      i18n.changeLanguage(selectedLanguage);
      localStorage.setItem('userLanguage', selectedLanguage);
    }

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
    validationSchema: validationSchemaRegister,
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
    validationSchema: validationSchemaLogin,
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
    validationSchema: validationSchemaRegister,
    validateOnChange: true,
    onSubmit: async () => {
      setLoading(true);
      Partneregister.values.role = "Service Provider";
      Partneregister.values.expiration = new Date();
      Partneregister.values.accountId = user?.data?.accountId;

    const registerServiceProviderResponse =  await RegisterServiceProvider(Partneregister.values)

      if(registerServiceProviderResponse.isSuccess) {
        setLoading(false);
        setShowSignPartner(false);
        setCheck(true);
        confirmDialog({
          header: 'Success!',
          message: 'The account has been created successfully. The account is awaiting admin approval. Thank you.',
          icon: 'pi pi-check-circle',
          defaultFocus: 'accept',
          content: (props) => (
            <CustomConfirmDialogContent {...props} resetForm={Partneregister.resetForm} />
          ),
        });
      }

      setLoading(false);
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

  const fetchmainRoutes = async (event: any) => {
    try {
      setMainRoutes([
        {
          label: "User Menu",
          items: [
            { label: "Dashboard", icon: <FontAwesomeIcon icon={faChartBar} className="mr-2" />, command: () => navigate('/dashboard'), condition: role === 'Administrator' },
            { label: "My Profile", icon: <FontAwesomeIcon icon={faUser} className="mr-2" />, command: () => navigate('/profile') },
            { label: "My Services", icon: <FontAwesomeIcon icon={faList} className="mr-2" />, command: () => navigate('/my-services'), condition: role === 'Administrator' || role === 'Service Provider' },
            { label: "Add Services", icon: <FontAwesomeIcon icon={faPlus} className="mr-2" />, command: () => navigate('/add-services'), condition: role === 'Administrator' || role === 'Service Provider' },
            { label: "My Orders", icon: <FontAwesomeIcon icon={faHistory} className="mr-2" />, command: () => navigate('/orders') },
            { label: "Flight Requests", icon: <FontAwesomeIcon icon={faPlaneDeparture} className="mr-2" />, command: () => navigate('/flight-requests') },
            { label: `My Requests`, icon: <FontAwesomeIcon icon={faUser} className="mr-2" />, command: () => navigate(`/${role}-requests`) },
            { label: "Log Out", icon: <FontAwesomeIcon icon={faSignOut} className="mr-2" />, command: () => logout() }
          ].filter(c => c.condition === undefined || c.condition)
        }
      ]);

      dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false });
      dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false });

      menuMainRoutes.current.toggle(event);
    } catch (error) {
      console.error("Error fetching mane routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const CustomConfirmDialogContent = ({ headerRef, message, hide, navigate, resetForm }: any) => {
    return (
      <div className="flex flex-column align-items-center p-5 surface-overlay border-round custom-widht">
        <div className="border-circle bg-green-500 text-white inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
          <i className="pi pi-check-circle text-5xl"></i>
        </div>
        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>{message.header}</span>
        <p className="mb-0">{message.message}</p>
        <div className="grid align-items-center gap-3 mt-4" >
          <Button label="Close" outlined onClick={(event) => { hide(event); }} className="w-full text-green border-green-500 text-green-500"></Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const MenuItems = () => (
    <>
      <Button
        label="Nearby Restaurants"
        className="border-none primary bg-transparent outline-0 shadow-none px-5"
        onClick={() => {
          localStorage.setItem('activeIndex', "12");
          localStorage.setItem('selectedTab', "Restaurants");
          navigate(`/search-and-filter`);
        }}
      />

      <Button label="EN. $" icon="pi pi-fw pi-globe" className="border-none primary bg-transparent outline-0 shadow-none" onClick={() => setshowSelectLang(true)}/>
      {role === "Administrator" && <>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Button
              className="border-1 primary bg-transparent outline-0 shadow-none mx-1 icon-services"
              icon={<FontAwesomeIcon icon={faServer} size={"sm"} />}
              onClick={() => {
                setShowMenuNotificationsCard(false)
                dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false })
                dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: !showMenuServicesCard })
              }}
              rounded
              style={{ borderColor: '#ddd', height: '2rem', width: '2rem', padding: '18px'}}
              size="small"
            />
            <Badge
              value={pendingServices.length}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#4a235a'
              }}
            />
        </div>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Button
              className="border-1 primary bg-transparent outline-0 shadow-none mx-1 icon-users"
              icon={<FontAwesomeIcon icon={faUsers} size={"sm"} />}
              onClick={() => {
                setShowMenuNotificationsCard(false)
                dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false })
                dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: !showMenuUsersCard })
              }}
              rounded
              aria-controls="popup_menu_left"
              aria-haspopup
              style={{ borderColor: '#ddd', height: '2rem', width: '2rem', padding: '18px'}}
              size="small"
            />
            <Badge
              value={pendingUsers.length}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#f1881f'
              }}
            />
        </div>
      </>}
    </>
  );

  const end = (
    <div className="flex align-items-center gap-2 mr-7">

      {isMobile ? (
        <Button
          icon={<FontAwesomeIcon icon={faBars} />}
          onClick={toggleMobileMenu}
          className="p-button-text"
          style={{color: '#000'}}
        />
      ) : (
        <div className="menu-items mr-5">
          <MenuItems />
          {!user?.isSuccess  && <>
            <Button rounded label="Become Our Partner" outlined className="outline_btn mx-1" onClick={() => setShowSignPartner(true)} />
            <Button rounded label="Log In" icon="pi pi-user" onClick={() => setshow(true)} className="primary_btn mx-1"/>
          </>}
        </div>
      )}

      {user?.isSuccess === true ? (
        <>

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button
              className="border-1 primary bg-transparent outline-0 shadow-none mx-1 icon-notifications"
              icon={<FontAwesomeIcon icon={faBell} size={"sm"} />}
              onClick={() => {
                dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false })
                dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false })
                setShowMenuNotificationsCard(!showMenuNotificationsCard)
              }}
              rounded
              style={{ borderColor: '#ddd', height: '2rem', width: '2rem', padding: '18px' }}
              size="small"
            />
            <Badge
              value="0"
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'red'
              }}
            />
          </div>

          <Avatar
            image={User?.data?.photos[0].imagePath}
            className="mx-2"
            onClick={fetchmainRoutes}
            shape="circle"
            style={{ cursor: "pointer" }}
          />
        </>
      ) : (<></>)}
    </div>
  );

  const fetchData = async (dataType: any) => {
    try {
      let response;
      if (dataType === 'users') {
        response = await GetPendingUsers();
        dispatch({ type: 'SET_PENDING_USERS', payload: response.data.slice(0, 5) });
      } else if (dataType === 'services') {
        response = await GetPendingServices();
        dispatch({ type: 'SET_PENDING_SERVICES', payload: response.data.slice(0, 5) });
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

  const getShortName = (name: string) => {
    if (name.length > 10) {
        return name.substring(0, 10) + '...';
    }
    return name;
  };

  const UserList = ({ users }: any) => {
    return (
      <ul className="py-0 pl-3 pr-1">
        {users.map((user: any, index: number) => (
          <li key={index} className="my-3 flex flex-wrap gap-2 align-items-center justify-content-between">
            <span
              className="hover:text-blue-400"
              onClick={() => {
                dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false });
                navigate(`/user-details/${user.accountId}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              - {getShortName(user.name)}
            </span>

            <div className="icons">
              <i
                onClick={() => {
                  ApproveUser(user.accountId).then((res) => {
                    if (res.isSuccess) {
                      setCheckUser(true);
                      dispatch({ type: 'SET_LOADING_USERS' });
                      fetchData('users');

                      confirmDialog({
                        header: 'Success!',
                        message: 'User Approved successfully.',
                        icon: 'pi pi-check-circle',
                        defaultFocus: 'accept',
                        content: (props) => (
                          <CustomConfirmDialogContent {...props} resetForm={false} />
                        ),
                      });
                    }
                  })
                }}
                className="pi pi-check"
                style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
              ></i>

              <i
                onClick={() => handleRejectClick(user.accountId, true)}
                className="pi pi-times"
                style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
              ></i>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const ServiceList = ({ services }: any) => {
    return (
      <ul className="py-0 pl-3 pr-1">
        {services.map((service: any, index: number) => (
          <li key={index} className="my-3 flex flex-wrap gap-2 align-items-center justify-content-between">
            <span
              className="hover:text-blue-400"
              onClick={() => {
                dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false });
                navigate(`/service-details/${DataType.Service.toLowerCase()}/${service.id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              - {getShortName(service.name)}
            </span>

            <div className="icons">
              <i
                onClick={() => {
                  ApproveService(service.id).then((res) => {
                    if (res.isSuccess) {
                      setCheckService(true);
                      dispatch({ type: 'SET_LOADING_SERVICES' });
                      fetchData('services');

                      confirmDialog({
                        header: 'Success!',
                        message: 'Service Approved successfully.',
                        icon: 'pi pi-check-circle',
                        defaultFocus: 'accept',
                        content: (props) => (
                          <CustomConfirmDialogContent {...props} resetForm={false} />
                        ),
                      });
                    }
                  })
                }}
                className="pi pi-check"
                style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
              ></i>

              <i
                onClick={() => handleRejectClick(service.id, false)}
                className="pi pi-times"
                style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
              ></i>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const NotificationList = ({ notifications }: any) => {
    return (
      <ul className="py-0 pl-3 pr-1">
        {notifications.map((notification: any, index: number) => (
          <li key={index} className="my-3 flex flex-wrap gap-2 align-items-center justify-content-between">
            <span
              className="hover:text-blue-400"
              // onClick={() => navigate(`//${DataType.Service.toLowerCase()}/${notification.id}`)}
              style={{ cursor: 'pointer' }}
            >
              - {getShortName(notification.name)}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  if (!hasOpenedRef.current && navState) {
    setshow(true);
    hasOpenedRef.current = true;
  }

  return (
    <div className="card">
      <Dialog
        header={headerRejectionReason}
        visible={showDialog}
        style={{ width: '50vw' }}
        footer={<div>
            <Button label="Confirm" size="small" severity="warning" outlined onClick={handleRejectConfirm} className="mt-4"></Button>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowDialog(false)} className="mt-4"></Button>
        </div>}
        onHide={() => {if (!showDialog) return; setShowDialog(false); }}
      >
          <InputText
            name="rejection_reason"
            className="mt-2	w-full"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason"
          />
      </Dialog>

      {check &&
        <ConfirmDialog content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <CustomConfirmDialogContent headerRef={headerRef} message={message} hide={hide} navigate={navigate} resetForm={Partneregister.resetForm} />
        )}/>
      }

      {(checkService || checkUser) &&
        <ConfirmDialog content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <CustomConfirmDialogContent headerRef={headerRef} message={message} hide={hide} navigate={navigate} resetForm={false} />
        )}/>
      }

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

            <span className="p-input-icon-right">
              <i
                className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', top: '30px' }}
              />
              <InputText
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="mt-2 w-24rem"
                value={loginform?.values?.password}
                onChange={(e) => loginform.setFieldValue("password", e.target.value)}
                onBlur={loginform.handleBlur}
              />
            </span>

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
            <span className="p-input-icon-right">
              <i
                className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', top: '30px' }}
              />
              <InputText
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="mt-2 w-24rem"
                value={register?.values?.password}
                onBlur={register.handleBlur}
                onChange={(e) =>
                  register.setFieldValue("password", e.target.value)
                }
              />
            </span>
            {register.touched.password && register.errors.password ? (
              <div className="p-error mt-2 text-sm">{register.errors.password}</div>
            ) : null}
          </div>

          <div className="col ml-3">
            <div>
              <label className="mb-2 primary" htmlFor="Confirm password">Confirm password</label>
            </div>

            <span className="p-input-icon-right">
              <i
                className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', top: '30px'}}
              />
              <InputText
                placeholder="Confirm password"
                name="confirm_password"
                type={showPassword ? "text" : "password"}
                className="mt-2 w-24rem"
                value={register?.values?.confirm_password}
                onBlur={register.handleBlur}
                onChange={(e) =>
                  register.setFieldValue("confirm_password", e.target.value)
                }
              />
            </span>
              {register.touched.confirm_password && register.errors.confirm_password ? ( <div className="p-error mt-2 text-sm">{register.errors.confirm_password}</div>) : null}
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
        style={isMobile ? { width: "100vw" } : { width: "50vw" }}
        onHide={() => setShowSignPartner(false)}
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

                  <span className="p-input-icon-right w-full">
                    <i
                      className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', top: '30px' }}
                    />
                    <InputText
                      placeholder="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="mt-2	w-full"
                      value={Partneregister?.values?.password}
                      onBlur={Partneregister.handleBlur}
                      onChange={(e) => Partneregister.setFieldValue("password", e.target.value)}
                    />
                  </span>

                  {Partneregister.touched.password && Partneregister.errors.password ? ( <div className="p-error mt-2 text-sm">{Partneregister.errors.password}</div>) : null}
                </div>

                <div className="md:col-6 lg:col-6">
                  <div>
                    <label className="mb-2 primary" htmlFor="Confirm password">Confirm password</label>
                  </div>
                  <span className="p-input-icon-right w-full">
                    <i
                      className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', top: '30px' }}
                    />
                    <InputText
                      placeholder="Confirm password"
                      name="confirm_password"
                      type={showPassword ? "text" : "confirm_password"}
                      className="mt-2	w-full"
                      value={Partneregister?.values?.confirm_password}
                      onBlur={Partneregister.handleBlur}
                      onChange={(e) => Partneregister.setFieldValue("confirm_password", e.target.value)}
                    />
                  </span>
                  {Partneregister.touched.confirm_password && Partneregister.errors.confirm_password ? ( <div className="p-error mt-2 text-sm">{Partneregister.errors.confirm_password}</div>) : null}
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
              setShowSignPartner(false);
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

      <Menu model={mainRoutes} popup ref={menuMainRoutes} />

      <div className="users-icon">
        {showMenuUsersCard && (
          <Card title="Pending Users" className="p-mt-2 menu-users">
            {loadingUsers ? <LoadingOverlay /> : pendingUsers.length ? <UserList users={pendingUsers} /> : <p className="mt-3">No pending users</p>}

            <div className="tab-footer">
              <span className="mx-2" onClick={() => dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false })}>close</span>
              <span className="mx-2" onClick={() => {
                dispatch({ type: 'SET_SHOW_MENU_USERS_CARD', payload: false });
                navigate("/stat-of-users")
              }}>View All</span>
            </div>
          </Card>
        )}
      </div>

      <div className="services-icon">
        {showMenuServicesCard && (
          <Card title="Pending Services" className="p-mt-2 menu-services">
            {loadingServices ? <LoadingOverlay /> : pendingServices.length ? <ServiceList services={pendingServices} /> : <p className="mt-3">No pending services</p>}

            <div className="tab-footer">
              <span className="mx-2" onClick={() => dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false })}>close</span>
              <span className="mx-2" onClick={() => {
                dispatch({ type: 'SET_SHOW_MENU_SERVICES_CARD', payload: false });
                navigate("/stat-of-services")
              }}>View All</span>
            </div>
          </Card>
        )}
      </div>

      <div className="notifications-icon">
        {showMenuNotificationsCard && (
          <Card title="Notifications" className="p-mt-2 menu-notifications">
            {notifications.length ? <NotificationList notifications={notifications} /> : <p className="mt-3">No notifications</p>}

            <div className="tab-footer">
              <span className="mx-2" onClick={() => { setShowMenuNotificationsCard(false)}}>close</span>
              <span className="mx-2" onClick={() => { setShowMenuNotificationsCard(false); navigate("/notifications")}}>View All</span>
            </div>
          </Card>
        )}
      </div>

      {loading ? <LoadingComponent/> :
        <>
          <Menubar
            start={
              <span className="text-2xl get-rp cursor-pointer" style={{marginLeft:'100px'}} onClick={() => navigate('/')}>
                  Ge<span className="secondery">t</span>rip
              </span>
            }
            end={end}
            className="navbar"
          />
          {isMobile && showMobileMenu && (
            <div className="mobile-menu p-3 bg-white shadow-2">
              <MenuItems />
              {!user?.isSuccess && (<>
                <Button rounded label="Become Our Partner" outlined className="outline_btn mt-2 w-full" onClick={() => setShowSignPartner(true)}/>
                <Button rounded label="Log In" icon="pi pi-user" onClick={() => setshow(true)} className="primary_btn  mt-2 w-full"/>
              </>)}
            </div>
          )}
        </>
      }
    </div>
  );
};

export default NavBar;
