import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddRequest, GetAllCountries, GetAllProvinces, GetServiceDetailsById } from "../Services";
import { DataType } from "../enums";
import LoadingComponent from "../components/Loading";
import { Dialog } from "primereact/dialog";
import { AddRequestDTO, LocationFromMap, PriceValuesDTO } from "../modules/getrip.modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCalendarAlt, faHeart, faMapLocation, faMapLocationDot, faShareAlt, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "primereact/button";
import GoogleMap from "../components/GoogleMap";
import { ProviderAuthenticationservice, ProviderServiceTourVisio } from "../Services/providerRequests";
import { useFormik } from "formik";
import { useAuth } from "../AuthContext/AuthContext";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";

const ServiceDetailsPage = ({onCheckAuth}: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState<any>();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showMapLocation, setShowMapLocation] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [markerData, setMarkerData] = useState<{lat: any, lng: any, text: any}[]>([]);
  const [selectedLocationFromMap, setSelectedLocationFromMap] = useState<LocationFromMap | null>(null);
  const { serviceType, serviceId, queryFilter, moreParams } = useParams<{ serviceType: DataType, serviceId: string, queryFilter: any, moreParams: any }>();
  const { user } = useAuth();
  const today = new Date();
  const [ingredient, setIngredient] = useState<PriceValuesDTO>();
  const [date, setDate] = useState<any>([today, today]);
  const [daysCount, setDaysCount] = useState<any>(1);
  const [guests, setGuests] = useState<any>(serviceDetails?.guests ?? 1);

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

  const parseMoreQueryString = (moreParams: string): any =>  {
    const params = new URLSearchParams(moreParams);
    const result: any = {};
    params.forEach((value, key) => { result[key] = value;});
    return result;
  }

  const [formInitialValues, setFormInitialValues] = useState<AddRequestDTO>({
    senderAccountId: user?.data?.accountId,
    recieverAccountId: serviceDetails?.accountId,
    requestDate: new Date(),
    lastUpdateDate: new Date(),
    subject: '',
    notes: '',
    serviceId: serviceDetails?.id,
    adultPassengers: guests,
    childPassengers: parseQueryString(queryFilter).children,
    startDate: date[0],
    endDate: date[1],
  });

  const type = serviceType?.toUpperCase();

  const findCountry = (countries: any[], countryId?: number) => {
    return countries.find((country) => country.id === countryId);
  };

  const findProvince = (provinces: any[], provinceId?: number) => {
    return provinces.find((province) => province.id === provinceId);
  };

  useEffect(() => {
    setLoading(true);
    if (type === DataType.Service) {
      Promise.all([
        GetServiceDetailsById(Number(serviceId)),
        GetAllCountries(),
        GetAllProvinces(),
      ]).then(([serviceDetailsRes, countriesRes, provincesRes]) => {
        setIngredient(serviceDetailsRes.data.priceValues[0]);

        setServiceDetails({
          id: serviceDetailsRes.data.id,
          accountId: serviceDetailsRes.data.accountId,
          name: serviceDetailsRes.data.name,
          priceValues: serviceDetailsRes.data.priceValues,
          countryTaxPercent: serviceDetailsRes.data.countryTaxPercent,
          location: `${findCountry(countriesRes.data, serviceDetailsRes.data.countryId)?.name ?? 'No Country'}, ${findProvince(provincesRes.data, serviceDetailsRes.data.provincyId)?.name ?? 'No Province'}`,
          images: serviceDetailsRes.data.photos,
          overview: serviceDetailsRes.data.description,
          facilities: serviceDetailsRes.data.serviceFacilities.flatMap((category: any) =>
            category.facilities
              // .filter((facility: any) => facility.isPrimary)
              .map((facility: any) => { return <div className="m-2">- {facility.name}</div>})
          ),
          prices: serviceDetailsRes.data.price,
          reviews: '900',
          address: `${findCountry(countriesRes.data, serviceDetailsRes.data.countryId)?.name ?? 'No Country'}, ${findProvince(provincesRes.data, serviceDetailsRes.data.provincyId)?.name ?? 'No Province'}`,
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
    } else if (type === DataType.Hotel) {

      ProviderAuthenticationservice()
      .then((tokenRes) => {
        ProviderServiceTourVisio('productservice/getproductinfo', {
          productType: 2,
          ownerProvider: 2,
          product: serviceId,
          culture: 'en-US',
        }, tokenRes)
        .then((resProductInfo: any) => {

          ProviderServiceTourVisio('productservice/getofferdetails', {
            offerIds: [parseMoreQueryString(moreParams).offer_id],
            currency: "USD",
          }, tokenRes).then((resGetOffersDetails: any) => {

            setMarkerData([{
              lat: resProductInfo.data.body.hotel.address.geolocation.latitude,
              lng: resProductInfo.data.body.hotel.address.geolocation.longitude,
              text:  `${resProductInfo.data.body.hotel.address.addressLines[0]},
                      ${resProductInfo.data.body.hotel.address.addressLines[1]},
                      ${resProductInfo.data.body.hotel.address.addressLines[2]}`,
            }]);

            setServiceDetails({
              name: resProductInfo.data.body.hotel.name,
              location: `${resProductInfo.data.body.hotel.address.addressLines[0]},
                         ${resProductInfo.data.body.hotel.address.addressLines[1]},
                         ${resProductInfo.data.body.hotel.address.addressLines[2]}`,
              images: [resProductInfo.data.body.hotel.thumbnailFull],
              overview: resProductInfo.data.body.hotel.description.text,
              // facilities: serviceDetailsRes.data.serviceFacilities.flatMap((category: any) =>
              //   category.facilities
              //     // .filter((facility: any) => facility.isPrimary)
              //     .map((facility: any) => { return <div className="m-2">- {facility.name}</div>})
              // ),
              prices: resGetOffersDetails?.data?.body?.offerDetails[0].price.amount,
              reviews: resProductInfo.data.body.hotel.rating,
              address: `${resProductInfo.data.body.hotel.country.name ?? 'No Country'}, ${resProductInfo.data.body.hotel.city.name ?? 'No Province'}`,
              pricePerNight: resGetOffersDetails?.data?.body?.offerDetails[0].price.amount,
              dates: `${parseQueryString(queryFilter).startDate} - ${parseQueryString(queryFilter).endDate}`,
              guests: parseQueryString(queryFilter).guests,
              lat: resProductInfo.data.body.hotel.geolocation['latitude'],
              lng: resProductInfo.data.body.hotel.geolocation['longitude'],
              totalFees: resGetOffersDetails?.data?.body?.offerDetails[0].price.amount * parseQueryString(queryFilter).guests,
            });
          });
        }).finally(() => {
          setLoading(false);
        });
      });
    } else if (type === DataType.Flight) {
      ProviderAuthenticationservice()
      .then((res) => {
        ProviderServiceTourVisio('productservice/', {
          ProductType: 3,
          Query: '',
          ServiceType: '',
          Culture: 'en-US',
        }, res)
        .then((resPro) => {
          console.log(resPro);
        }).finally(() => {
          setLoading(false);
        });
      });
    }
  }, [serviceId]);

  useEffect(() => {
    setFormInitialValues(prevValues => ({
      ...prevValues,
      adultPassengers: guests,
      childPassengers: parseQueryString(queryFilter).children,
      startDate: date[0],
      endDate: date[1],
      senderAccountId: user?.data?.accountId,
      recieverAccountId: serviceDetails?.accountId,
      serviceId: serviceDetails?.id,
    }));
  }, [guests, queryFilter, date, user?.data?.accountId, serviceDetails?.accountId, serviceDetails?.id]);

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

  const AddRequestForm = useFormik<AddRequestDTO>({
    initialValues: formInitialValues,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async () => {
      try {
        AddRequestForm.values.senderAccountId =  user.data.accountId;
        AddRequestForm.values.recieverAccountId =  serviceDetails.accountId;
        AddRequestForm.values.requestDate =  new Date();
        AddRequestForm.values.lastUpdateDate =  new Date();
        AddRequestForm.values.subject =  '';
        AddRequestForm.values.serviceId =  serviceDetails.id;

        await AddRequest(AddRequestForm.values);
        AddRequestForm.resetForm();
        setShowBooking(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (<>
      { loading ? <LoadingComponent /> : <>
        <div className="service-details-container">
          <header className="service-details-header">
            <div className="service-details-info">
              <h1>{serviceDetails?.name}</h1>
              <p><FontAwesomeIcon icon={faMapLocationDot} size={"sm"} style={{ color: '#000' }} className="mr-2" /> {serviceDetails?.location}</p>
            </div>
            <div className="service-details-actions">
              <Button style={{backgroundColor: '#fff', color: '#000', border: 'none', fontSize: '16px'}} icon={<FontAwesomeIcon icon={faShareAlt} size={"sm"} className="mr-2" />} onClick={() => false}>Share</Button>
              <Button style={{backgroundColor: '#fff', color: '#000', border: 'none', fontSize: '16px'}} icon={<FontAwesomeIcon icon={faHeart} size={"sm"} className="mr-2" />} onClick={() => false}>Save</Button>
              <Button
                style={{fontSize: '16px', padding: '5px 18px'}}
                rounded
                severity="warning"
                onClick={() => user ? setShowBooking(true) : onCheckAuth() }
              >Book Now</Button>
            </div>
          </header>

          <div className="grid grid-cols-12 my-2">
            {serviceDetails?.images.length === 1 ? (
              <div className="md:col-12 lg:col-12 sm:col-12">
              <img src={serviceDetails?.images[0]?.imagePath ?? serviceDetails?.images[0]} alt={`Image`} className='w-full h-full slid-style'/>
            </div>
            ) : serviceDetails?.images.length > 1  ? (
              <>
                <div className="md:col-5 lg:col-5 sm:col-12">
                  <img src={serviceDetails?.images[0]?.imagePath ?? serviceDetails?.images[0]} alt={`Image`} className='w-full h-full slid-style'/>
                </div>

                <div className="md:col-7 lg:col-7 sm:col-12">
                  {serviceDetails?.images.map((src: any, index: number) => (
                    index > 0 && index <= 4 ? (
                      <img key={index} src={src.imagePath ?? serviceDetails?.images[0]} alt={`Image ${index + 1}`} className={`col-6 object-cover slid-style ${index === 1 || index === 2 ? 'pt-0' : ''} ${index === 3 || index === 4 ? 'pb-0' : ''} ${index === 4 ? 'service-details-last-img' : ''}`} />
                    ): null
                  ))}
                </div>
              </>
            ) :
              <div className="md:col-12 lg:col-12 sm:col-12">
                <img src={`https://getripstorage2.blob.core.windows.net/uploads/bd65bd25-6fcf-4485-b29a-91aae287ab8c.jpg`} alt={`Image`} className='w-full h-full slid-style'/>
              </div>
            }
          </div>

          <div className="grid grid-cols-12 my-2">
            <div className="md:col-8 lg:col-8 sm:col-12">
              <div className="tabs">
                {['Overview', 'Facilities', 'Prices', 'Reviews', 'Location'].map((tab) => (
                  <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                ))}
              </div>

              <div className="tab-content mt-4">
                {activeTab === 'Overview' && (
                  <div className="tab-pane active">
                    <h2>Overview</h2>
                    <p>{serviceDetails?.overview}</p>
                    <a href="#">See More</a>
                  </div>
                )}

                {activeTab === 'Facilities' && (
                  <div className="tab-pane active">
                    <h2>Facilities</h2>
                    <p>{serviceDetails?.facilities}</p>
                  </div>
                )}

                {activeTab === 'Prices' && (
                  <div className="tab-pane active">
                    <h2>Prices</h2>
                    <p>{serviceDetails?.prices}</p>
                  </div>
                )}

                {activeTab === 'Reviews' && (
                  <div className="tab-pane active">
                    <h2>Reviews</h2>
                    <p>{serviceDetails?.reviews}</p>
                  </div>
                )}

                {activeTab === 'Location' && (
                  <div className="tab-pane active">
                    <h2>Location</h2>
                    <p>{serviceDetails?.address}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-4 lg:col-4 sm:col-12">
              <div className="sidebar">
                <div className="sidebar-info">
                  {type === DataType.Service && serviceDetails &&
                  <>
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
                    <hr style={{ border: '1px dashed #ddd'}} className="my-2" />
                  </>
                  }

                  <p style={{ display: 'grid', justifyContent: 'start', alignItems: 'center', fontSize: '14px', color: '#ccccccbd'}}>
                      per {ingredient?.pricingTypeName}
                      <span className="mb-1" style={{fontSize: '20px', fontWeight: 'bolder',  color: '#000'}}>
                        ${ingredient?.value ?? serviceDetails?.pricePerNight}
                      </span>
                  </p>

                  <p className='sidebar-border flex justify-content-center align-items-center'>
                    <FontAwesomeIcon icon={faCalendarAlt} size={"sm"} style={{ color: '#ddd' }} className="mr-2" />

                    <Calendar
                      className='failds'
                      style={{ width: '100%', height: '30px' }}
                      inputStyle={{ border: 'none' }}
                      placeholder='Select Start - End Date'
                      value={date}
                      onChange={(e) => setDate(e.value)}
                      numberOfMonths={2}
                      selectionMode="range"
                      minDate={today}
                    />
                  </p>

                  <p className='sidebar-border flex justify-content-center align-items-center w-full'>
                    <FontAwesomeIcon icon={faUserAlt} size={"sm"} style={{ color: '#ddd' }} className="mr-2" />
                    <InputNumber
                      inputId="guests"
                      value={guests}
                      onValueChange={(e) => setGuests(e.value)}
                      showButtons
                      buttonLayout="horizontal"
                      step={1}
                      min={0}
                      className="w-full"
                      style={{width: '100%', height: '30px'}}
                      inputStyle={{  width: '100%', height: '100%'}}
                      decrementButtonClassName="p-button-secondery"
                      incrementButtonClassName="p-button-secondery"
                      incrementButtonIcon="pi pi-plus"
                      decrementButtonIcon="pi pi-minus"
                    />
                  </p>

                  <Button
                    style={{fontSize: '15px', marginTop: '10px', padding: '10px', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    rounded
                    severity="warning"
                    icon={ <FontAwesomeIcon className="mr-2" icon={faMapLocation} size={"sm"} />}
                    onClick={() => setShowMapLocation(true)}
                  >
                    Show On Map
                  </Button>

                  <Button
                    style={{fontSize: '15px', marginTop: '10px', padding: '10px', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    rounded
                    severity="warning"
                    icon={ <FontAwesomeIcon className="mr-2" icon={faBook} size={"sm"} />}
                    onClick={() => user ? setShowBooking(true) : onCheckAuth() }
                  >
                    Book Now
                  </Button>

                  <div className="sidebar-total-fees">
                    {!ingredient?.isTaxIncluded && (
                      <span className="mt-1" style={{ fontSize: '17px', fontWeight: 'bold', padding: '10px', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Tax: {serviceDetails?.countryTaxPercent} %
                      </span>
                    )}
                    <p className="m-0" style={{ fontSize: '17px', fontWeight: 'bold', padding: '10px', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      Total Fees
                      {!ingredient?.isTaxIncluded ? (
                        <span>
                          ${(
                            (ingredient?.value * guests * daysCount) +
                            (ingredient?.value * serviceDetails?.countryTaxPercent / 100) +
                            (AddRequestForm.values.childPassengers > 0 ? ((ingredient?.value / 2) * AddRequestForm.values.childPassengers * daysCount) : 0)
                          ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span>
                          ${(
                            (ingredient?.value * guests * daysCount) +
                            (AddRequestForm.values.childPassengers > 0 ? ((ingredient?.value / 2) * AddRequestForm.values.childPassengers * daysCount) : 0)
                          ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          header="Map Location"
          visible={showMapLocation}
          style={{ minWidth: '70%', minHeight: '70%', padding: '0', margin: '0', backgroundColor: 'transparent'}}
          footer={<div>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowMapLocation(false)} className="mt-4"></Button>
          </div>}
          onHide={() => setShowMapLocation(false)}
        >
          <GoogleMap
            markerData={markerData}
            onLocationSelect={(location: LocationFromMap) => { setSelectedLocationFromMap(location) }}
          />
        </Dialog>

        <Dialog
          header="Book Now"
          visible={showBooking}
          style={{maxWidth: '70%', padding: '0', margin: '0', backgroundColor: 'transparent'}}
          footer={
            <div>
              <Button label="Save" size="small" severity="warning" outlined onClick={() => AddRequestForm.handleSubmit()} className="mt-4"></Button>
              <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowBooking(false)} className="mt-4"></Button>
            </div>
          }
          onHide={() => setShowBooking(false)}
        >
          {type === DataType.Service ?
            <div className="grid w-full grid grid-cols-12">
              <div className="md:col-12 lg:col-12">
                <label htmlFor="Adult Passengers">Adult Passengers</label>
                <InputNumber
                  placeholder="Adult Passengers"
                  name="adultPassengers"
                  className="w-full"
                  step={1}
                  min={0}
                  showButtons
                  value={AddRequestForm.values.adultPassengers}
                  onChange={(e) => AddRequestForm.setFieldValue("adultPassengers", e.value)}
                />
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="Child Passengers">Child Passengers</label>
                <InputNumber
                  placeholder="Child Passengers"
                  name="childPassengers"
                  className="w-full"
                  step={1}
                  min={0}
                  showButtons
                  value={AddRequestForm.values.childPassengers}
                  onChange={(e) => AddRequestForm.setFieldValue("childPassengers", e.value)}
                />
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="Start Date">Start Date</label>
                <Calendar
                  className=''
                  style={{width: '100%'}}
                  placeholder='Start Date'
                  value={AddRequestForm.values.startDate}
                  onChange={(e) => AddRequestForm.setFieldValue("startDate", e.value)}
                  minDate={today}
                />
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="End Date">End Date</label>
                <Calendar
                  className=''
                  style={{width: '100%'}}
                  placeholder='End Date'
                  value={AddRequestForm.values.endDate}
                  onChange={(e) => AddRequestForm.setFieldValue("endDate", e.value)}
                  minDate={today}
                />
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="Note">Note</label>
                <InputText
                  placeholder="Add Note"
                  name="note"
                  className="w-full mt-1"
                  value={AddRequestForm.values.notes}
                  onChange={(e) => AddRequestForm.setFieldValue("notes", e.target.value)}
                />
              </div>
            </div>
          : <></>}
        </Dialog>
    </>}
  </>);
};

export default ServiceDetailsPage;
