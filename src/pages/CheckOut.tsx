import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddInstantOrder, AddRequest, GetServiceDetailsById, GetServiceTypes } from "../Services";
import LoadingComponent from "../components/Loading";
import { AddRequestDTO, PriceValuesDTO } from "../modules/getrip.modules";
import { useFormik } from "formik";
import { useAuth } from "../AuthContext/AuthContext";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import * as Yup from 'yup';
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { fas, faHandPointUp, faMapLocationDot, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Message } from "primereact/message";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { LahzaTransactionInitialize, LahzaTransactionVerify } from "../Services/providerRequests";
import { formatDate } from "../Helper/functions";

const validationSchema = Yup.object({
  name: Yup.string().required('Service Name is required'),
  lastName: Yup.string().required('Service Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]+$/, "Phone number is not valid").min(10, 'Phone number must be at least 10 digits').required('Phone number is required'),
});

const CheckOut = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState<any>();
  const [isForDifferentPerson, setIsForDifferentPerson] = useState<boolean>(false);
  const { serviceId, queryFilter } = useParams<{ serviceId: string, queryFilter: any }>();
  const { user } = useAuth();
  const today = new Date();
  const [ingredient, setIngredient] = useState<PriceValuesDTO>();
  const [date, setDate] = useState<any>([today, today]);
  const [daysCount, setDaysCount] = useState<any>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const parseQueryString = (queryString: string): any =>  {
    const params = new URLSearchParams(queryString);
    const result: any = {};

    params.forEach((value, key) => {
      if (key === 'startDate' || key === 'endDate') {
        try {
          const date = new Date(value);
          result[key] = formatDate(date);
        } catch (e) {
          console.error(`Error parsing date for ${key}:`, e);
          result[key] = undefined;
        }
      } else if (key === 'guests' || key === 'children') {
        result[key] = parseInt(value, 10);
      } else if (value === 'null') {
        result[key] = null;
      } else if (value === '[object Object]') {
        console.warn(`[object Object] detected for ${key}. You may need to stringify this object before adding to URL.`);
        result[key] = undefined;
      } else {
        result[key] = value;
      }
    });

    return result;
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      GetServiceDetailsById(Number(serviceId)),
      GetServiceTypes(),
    ]).then(([serviceDetailsRes, serviceTypesRes]) => {
      setIngredient(serviceDetailsRes.data.priceValues[0]);
      setServiceDetails({
        id: serviceDetailsRes.data.id,
        accountId: serviceDetailsRes.data.accountId,
        name: serviceDetailsRes.data.name,
        tags: serviceDetailsRes.data.tags,
        isPending: serviceDetailsRes.data.isPending,
        cancelationRefundable: serviceDetailsRes.data.isRefundable,
        cancelationRefundPerCentAmount: serviceDetailsRes.data.refundPerCentAmount,
        cancelationAllowRefundDays: serviceDetailsRes.data.allowRefundDays,
        serviceType: serviceTypesRes?.data?.find((_type: any) => _type.id === serviceDetailsRes.data.typeId),
        isApprovalRequired: serviceDetailsRes.data.isApprovalRequired,
        priceValues: serviceDetailsRes.data.priceValues,
        countryTaxPercent: serviceDetailsRes.data.countryTaxPercent,
        location: `${serviceDetailsRes.data.countryName ?? 'No Country'}, ${serviceDetailsRes.data.provinceName ?? 'No Province'}, ${serviceDetailsRes.data.cityName ?? 'No City'}`,
        images: serviceDetailsRes.data.photos,
        overview: serviceDetailsRes.data.description,
        facilities: serviceDetailsRes.data.serviceFacilities.flatMap((category: any, index: number) =>
          category.facilities
            .map((facility: any) => {
              return <div className="m-2">
                        {index === 0 ? <p style={{ fontWeight: 'bold'}}> - <FontAwesomeIcon icon={fas[category?.iconCode] ?? faHandPointUp} className="mr-2" style={{fontSize: '20px'}} /> {category.categoryName}</p> : null}
                        <span className="mx-4">
                          <FontAwesomeIcon icon={fas[facility?.iconCode] ?? faHandPointUp} className="mr-2" style={{fontSize: '20px'}} />
                          {facility.name}
                        </span>
                      </div>
            })
        ),
        prices: serviceDetailsRes.data.price,
        reviews: '900',
        address: `${serviceDetailsRes.data.countryName ?? 'No Country'}, ${serviceDetailsRes.data.provinceName ?? 'No Province'}, ${serviceDetailsRes.data.cityName ?? 'No City'}`,
        pricePerNight: serviceDetailsRes.data.price,
        dates: `${parseQueryString(queryFilter).startDate} - ${parseQueryString(queryFilter).endDate}`,
        guests: parseQueryString(queryFilter).guests,
        lat: serviceDetailsRes.data.lat,
        lng: serviceDetailsRes.data.lng,
        totalFees: serviceDetailsRes.data.price,
      });
    }).catch(error => {
      console.error('Error fetching data:', error);
    }).finally(() => {
      setLoading(false);
    });
  }, [])

  const [guests, setGuests] = useState<any>(parseQueryString(queryFilter).guests ?? 1);
  const [children, setChildren] = useState<any>(parseQueryString(queryFilter).children ?? 0);

  useEffect(() => {
    const calculateDays = (start: Date, end: Date) => {
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      const diffTime = endDate.getTime() - startDate.getTime();

      return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };


    if(date[0] && date[1]) {
      setDaysCount(calculateDays(date[0], date[1]));
    }
  }, [date]);

 const calculateTotalPrice = () => {
    if (!ingredient?.value) return 0;

    const { value } = ingredient;
    const countryTaxPercent = serviceDetails?.countryTaxPercent || 0;
    const childDiscount = serviceDetails?.childPercentage ? 1 - (serviceDetails?.childPercentage / 100) : 0;

    const childPricePerDay = parseFloat((value * childDiscount).toFixed(2));

    let total = value * guests * daysCount;

    if (!ingredient.isTaxIncluded) {
      total += (value * countryTaxPercent / 100);
    }

    if (children > 0) {
      total += (childPricePerDay * children * daysCount);
    }

    return total;
  };

  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    setTotalPrice(totalPrice);
  }, [ingredient, serviceDetails, guests, daysCount, children, setTotalPrice]);

  useEffect(() => {
    setFormInitialValues(prevValues => ({
      ...prevValues,
      adultPassengers: guests,
      childPassengers: children,
      startDate: date[0],
      endDate: date[1],
      senderAccountId: user?.data?.accountId,
      recieverAccountId: serviceDetails?.accountId,
      serviceId: serviceDetails?.id,
      totalPrice: totalPrice
    }));
  }, [guests, children, totalPrice, queryFilter, date, user?.data?.accountId, serviceDetails?.accountId, serviceDetails?.id]);

  const [formInitialValues, setFormInitialValues] = useState<AddRequestDTO>({
    senderAccountId: user?.data?.accountId,
    recieverAccountId: serviceDetails?.accountId,
    requestDate: new Date(),
    lastUpdateDate: new Date(),
    subject: '',
    notes: '',
    name: user?.data?.name,
    email: user?.data?.email,
    lastName: user?.data?.lastName,
    phone: user?.data?.phone,
    isForDifferentPerson: false,
    serviceId: serviceDetails?.id,
    adultPassengers: guests,
    childPassengers: children,
    startDate: date[0],
    endDate: date[1],
    totalPrice: totalPrice
  });

  const AddRequestForm = useFormik<AddRequestDTO>({
    initialValues: formInitialValues,
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: isForDifferentPerson ? validationSchema : undefined,
    onSubmit: async () => {
      setIsLoading(true);

      try {
        AddRequestForm.values.senderAccountId =  user.data.accountId;
        AddRequestForm.values.recieverAccountId =  serviceDetails.accountId;
        AddRequestForm.values.requestDate =  new Date();
        AddRequestForm.values.lastUpdateDate =  new Date();
        AddRequestForm.values.subject =  '';
        AddRequestForm.values.serviceId =  serviceDetails.id;

        if(serviceDetails.isApprovalRequired) {
          const AddRequestResponse = await AddRequest(AddRequestForm.values);
          if (AddRequestResponse.isSuccess) {
            setShowConfirmDialog(true);

              confirmDialog({
                header: 'Success!',
                message: 'Admin approval pending for this request..',
                icon: 'pi pi-check-circle',
                defaultFocus: 'accept',
                content: (props) => (
                  <CustomConfirmDialogContent {...props} resetForm={AddRequestForm.resetForm} />
                ),
              });
          }
        } else {
          const AddInstantOrderResponse = await AddInstantOrder(AddRequestForm.values);
          if (AddInstantOrderResponse.isSuccess) {
            setLoading(true);
            LahzaTransactionInitialize({
              email: User?.data?.email,
              mobile: User?.data?.phone ?? '',
              firstName: User?.data?.name,
              lastName: User?.data?.lastname,
              amount: String(AddInstantOrderResponse.data.amount || '0'),
              currency: 'USD',
              channels: ['card', 'bank'],
              metadata: {
                "custom_fields":[
                  {
                    "display_name": "Project Name",
                    "variable_name": "Project Name",
                    "value": "GeTrip"
                  },
                  {
                    "display_name":"OrderId",
                    "variable_name":"OrderId",
                    "value": AddInstantOrderResponse.data.id
                  },
                  {
                    "display_name":"UserID",
                    "variable_name":"UserID",
                    "value": User?.data?.id
                  },
              ]}
            })
            .then((res) => {
              if (res['status']) {
                const { authorization_url, reference } = res.data;
                openPaymentWindow(authorization_url, reference);
              }
            })
            .catch((error) => {
              console.error(error);
            }).finally(() => {
              setLoading(false);
            });
          }
        }

        AddRequestForm.resetForm();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const openPaymentWindow = (url: string, reference: string) => {
    const popup = window.open(url, '_blank');
    if (popup) {
      popup.focus();
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          checkPaymentStatus(reference);
        }
      }, 1000);
    } else {
      console.error('Popup blocked. Please allow popups and try again.');
    }
  };

  const checkPaymentStatus = (reference: string) => {
    LahzaTransactionVerify(reference)
      .then((res) => {
        // console.log(res.data, 'Payment completed');
      })
      .catch((error) => {
        console.error(error, 'Error verifying payment');
      })
      .finally(() => {
        navigate('/search-and-filter')
      });
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
          <Button label="Go Services Page" outlined onClick={(event) => { hide(event); navigate('/search-and-filter') }} className="w-full text-green border-green-500 text-green-500"></Button>
        </div>
      </div>
    );
  };

  const renderError = (error: any) => {
    if (typeof error === 'string') {
      return <div className="text-red-500 mt-2">{error}</div>;
    }
    if (Array.isArray(error)) {
      return error.map((err, index) => <div key={index} className="text-red-500 mt-2">{err}</div>);
    }
    return null;
  };

  return(
    loading ? <LoadingComponent /> :
    <div className="container check-out-page">
      {showConfirmDialog ?
        <ConfirmDialog content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <CustomConfirmDialogContent headerRef={headerRef} message={message} hide={hide} navigate={navigate} resetForm={AddRequestForm.resetForm} />
        )}/>
      : null}

      <div className="grid grid grid-cols-12">
        <div className="service-details-info md:col-12 lg:col-12 mt-2 col-12">
          <h1>{serviceDetails?.name}</h1>
          <p><FontAwesomeIcon icon={faMapLocationDot} size={"sm"} style={{ color: '#000' }} className="mr-2" /> {serviceDetails?.location}</p>
        </div>

        <hr className="w-full my-2" style={{borderColor: 'rgb(108 108 108 / 12%)'}}/>

        {serviceDetails &&
        <div className="md:col-12 lg:col-12 mt-2 col-12">
          <h4 className="my-2">price type</h4>
          {serviceDetails?.priceValues.map((priceValue: any, index: number) => (
            <div className="flex justify-content-start align-items-center w-full">
                <RadioButton
                  inputId={`priceValue-${index}`}
                  name="priceValue"
                  className="my-2"
                  value={priceValue}
                  onChange={(e) => setIngredient(e.value)}
                  checked={ingredient?.pricingTypeName === priceValue.pricingTypeName ?? false}
                />
                <label htmlFor="ingredient1" className="ml-2">{priceValue.pricingTypeName}</label>
            </div>
          ))}
        </div>
        }

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="Name">Name</label>
            <InputText
              placeholder="Name"
              name="name"
              className="w-full mt-1"
              value={AddRequestForm.values.name}
              onChange={(e) => AddRequestForm.setFieldValue("name", e.target.value)}
            />
              {renderError(AddRequestForm.errors.name)}
          </div>

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="Last Name">Last Name</label>
            <InputText
              placeholder="Last Name"
              name="lastName"
              className="w-full mt-1"
              value={AddRequestForm.values.lastName}
              onChange={(e) => AddRequestForm.setFieldValue("lastName", e.target.value)}
            />
              {renderError(AddRequestForm.errors.lastName)}
          </div>

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="Start Date">Start Date</label>
            <Calendar
              className='w-full  mt-1'
              placeholder='Start Date'
              dateFormat="dd/mm/yy"
              value={AddRequestForm.values.startDate}
              onChange={(e) => AddRequestForm.setFieldValue("startDate", e.value)}
              minDate={today}
            />
          </div>

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="End Date">End Date</label>
            <Calendar
              className='w-full  mt-1'
              placeholder='End Date'
              dateFormat="dd/mm/yy"
              value={AddRequestForm.values.endDate}
              onChange={(e) => AddRequestForm.setFieldValue("endDate", e.value)}
              minDate={today}
            />
          </div>

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="Adult Passengers">Adults</label>
            <InputNumber
              placeholder="Adult Passengers"
              name="adultPassengers"
              className="w-full mt-1"
              step={1}
              min={0}
              showButtons
              value={AddRequestForm.values.adultPassengers}
              onChange={(e) => {
                setGuests(e.value)
                AddRequestForm.setFieldValue("adultPassengers", e.value)
              }}
            />
          </div>

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="Child Passengers">Childs</label>
            <InputNumber
              placeholder="Child Passengers"
              name="childPassengers"
              className="w-full  mt-1"
              step={1}
              min={0}
              showButtons
              value={AddRequestForm.values.childPassengers}
              onChange={(e) => {
                setChildren(e.value)
                AddRequestForm.setFieldValue("childPassengers", e.value)
              }}
            />
          </div>

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="Email">Email</label>
            <InputText
              placeholder="Email"
              name="email"
              className="w-full mt-1"
              value={AddRequestForm.values.email}
              onChange={(e) => AddRequestForm.setFieldValue("email", e.target.value)}
            />
              {renderError(AddRequestForm.errors.email)}
          </div>

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="Phone">Phone</label>
            <InputText
              placeholder="Phone"
              name="phone"
              className="w-full mt-1"
              value={AddRequestForm.values.phone}
              onChange={(e) => AddRequestForm.setFieldValue("phone", e.target.value)}
            />
              {renderError(AddRequestForm.errors.phone)}
          </div>

          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <label htmlFor="Note">Note</label>
            <InputText
              placeholder="Add Note"
              name="note"
              className="w-full mt-1"
              value={AddRequestForm.values.notes}
              onChange={(e) => AddRequestForm.setFieldValue("notes", e.target.value)}
            />
          </div>

        {serviceDetails?.isApprovalRequired &&
          <div className="md:col-12 lg:col-12 mt-2 col-12">
            <Message
              style={{
                  border: 'solid #f1881f',
                  borderWidth: '0 0 0 6px',
                  color: '#f1881f'
              }}
              className="w-full justify-content-start"
              severity="warn"
              content={
                <div className="flex align-items-center">
                    <FontAwesomeIcon icon={faBell} />
                    <div className="ml-2">Please Note: Your Request will be sent to the admin for approval before processing.</div>
                </div>
              }
            />
          </div>
        }

        <div className="flex justify-content-start align-items-center" style={{width: '100%'}}>
          <p style={{fontSize: '18px', fontWeight: 'bold', color: '#f1881f', background: '#FFF'}}>Total Price: <span >{parseFloat(formInitialValues.totalPrice.toFixed(2))}</span></p>
        </div>

        <div className="flex justify-content-end align-items-center" style={{width: '100%'}}>
          <Button style={{fontSize: '22px', fontWeight: 'bold', color: '#FFF', background: 'red'}} label="Cancel" severity="danger" outlined onClick={() =>  navigate(-1)} className="m-1"></Button>
          <Button style={{fontSize: '22px', fontWeight: 'bold', color: '#FFF', background: '#f1881f'}} severity="warning" outlined onClick={() => AddRequestForm.handleSubmit()} className="m-1" disabled={isLoading}>
            {isLoading ? (
                <span>
                  <i className="pi pi-spin pi-spinner"></i>
                  {'  '}
                  Loading...
                </span>
              ) : serviceDetails?.isApprovalRequired ? 'Request Now' : 'Book Now'
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CheckOut;
