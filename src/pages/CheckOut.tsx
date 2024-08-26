import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddInstantOrder, AddRequest, GetAllCountries, GetAllProvinces, GetServiceDetailsById, GetServiceTypes } from "../Services";
import { DataType } from "../enums";
import LoadingComponent from "../components/Loading";
import { AddRequestDTO, LocationFromMap, PriceValuesDTO } from "../modules/getrip.modules";
import { useFormik } from "formik";
import { useAuth } from "../AuthContext/AuthContext";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import * as Yup from 'yup';
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { fas, faHandPointUp, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const validationSchema = Yup.object({
  name: Yup.string().required('Service Name is required'),
  lastName: Yup.string().required('Service Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]+$/, "Phone number is not valid").min(10, 'Phone number must be at least 10 digits').required('Phone number is required'),
});

const CheckOut = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState<any>();
  const [pendingServicesIds, setPendingServicesIds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showMapLocation, setShowMapLocation] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [markerData, setMarkerData] = useState<{lat: any, lng: any, text: any}[]>([]);
  const [isForDifferentPerson, setIsForDifferentPerson] = useState<boolean>(false);
  const [selectedLocationFromMap, setSelectedLocationFromMap] = useState<LocationFromMap | null>(null);
  const { serviceType, serviceId, queryFilter, moreParams } = useParams<{ serviceType: DataType, serviceId: string, queryFilter: any, moreParams: any }>();
  const { user } = useAuth();
  const today = new Date();
  const [ingredient, setIngredient] = useState<PriceValuesDTO>();
  const [date, setDate] = useState<any>([today, today]);
  const [daysCount, setDaysCount] = useState<any>(1);
  const [facilities, setFacilities] = useState<any>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  const formatDate = (date: any) => {
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

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

    let total;
    if (!ingredient.isTaxIncluded) {
      total = (
        (ingredient.value * guests * daysCount) +
        (ingredient.value * (serviceDetails?.countryTaxPercent || 0) / 100) +
        (children > 0 ? ((ingredient.value / 2) * children * daysCount) : 0)
      );
    } else {
      total = (
        (ingredient.value * guests * daysCount) +
        (children > 0 ? ((ingredient.value / 2) * children * daysCount) : 0)
      );
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
      try {
        AddRequestForm.values.senderAccountId =  user.data.accountId;
        AddRequestForm.values.recieverAccountId =  serviceDetails.accountId;
        AddRequestForm.values.requestDate =  new Date();
        AddRequestForm.values.lastUpdateDate =  new Date();
        AddRequestForm.values.subject =  '';
        AddRequestForm.values.serviceId =  serviceDetails.id;

        if(serviceDetails.isApprovalRequired) {
          await AddRequest(AddRequestForm.values);
        } else {
          await AddInstantOrder(AddRequestForm.values);
        }

        AddRequestForm.resetForm();
        setShowBooking(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

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

        {/* <div className="md:col-12 lg:col-12 my-2 flex justify-content-start align-items-center">
          <InputSwitch
            className="mx-2"
            checked={AddRequestForm.values?.isForDifferentPerson}
            onChange={(e) => {
              AddRequestForm.setFieldValue(`isForDifferentPerson`, e.value);
              setIsForDifferentPerson(true);
            }}
          />
          <label htmlFor="Wallet mx-2">For Different Person</label>
        </div> */}

        {/* {AddRequestForm.values?.isForDifferentPerson && <> */}
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
        {/* </>} */}

        <div className="md:col-12 lg:col-12 mt-2 col-12">
          <label htmlFor="Adult Passengers">Adult Passengers</label>
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
          <label htmlFor="Child Passengers">Child Passengers</label>
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
          <label htmlFor="Start Date">Start Date</label>
          <Calendar
            className='w-full  mt-1'
            placeholder='Start Date'
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
            value={AddRequestForm.values.endDate}
            onChange={(e) => AddRequestForm.setFieldValue("endDate", e.value)}
            minDate={today}
          />
        </div>

        <div className="md:col-12 lg:col-12 mt-2 col-12">
          <label htmlFor="Total Price">Total Price</label>
          <InputNumber
            placeholder="Total Price"
            name="totalPrice"
            disabled
            className="w-full mt-1"
            value={formInitialValues.totalPrice}
          />
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

        <div className="md:col-12 lg:col-12 mt-2 col-12">
          <Button label="Book" size="small" severity="warning" outlined onClick={() => AddRequestForm.handleSubmit()} className="mt-4"></Button>
        </div>
      </div>
    </div>
  )
}

export default CheckOut;
