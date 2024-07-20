import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetAllCountries, GetAllProvinces, GetServiceDetailsById } from "../Services";
import { DataType } from "../enums";
import LoadingComponent from "../components/Loading";
import { Dialog } from "primereact/dialog";
import { LocationFromMap } from "../modules/getrip.modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCalendarAlt, faFireAlt, faHeart, faMapLocation, faMapLocationDot, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "primereact/button";
import GoogleMap from "../components/GoogleMap";
import { ProviderAuthenticationservice, ProviderServiceTourVisio } from "../Services/providerRequests";

const ServiceDetailsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState<any>();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showMapLocation, setShowMapLocation] = useState(false);
  const [markerData, setMarkerData] = useState<{lat: any, lng: any, text: any}[]>([]);
  const [selectedLocationFromMap, setSelectedLocationFromMap] = useState<LocationFromMap | null>(null);
  const { serviceType, serviceId } = useParams<{ serviceType: DataType, serviceId: string }>();

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
        setServiceDetails({
          name: serviceDetailsRes.data.name,
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
          dates: '',
          guests: '',
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
      .then((token) => {
        ProviderServiceTourVisio('productservice/getproductinfo', {
          productType: 2,
          ownerProvider: 2,
          product: serviceId,
          culture: 'en-US',
        }, token)
        .then((resProductInfo: any) => {
          console.log(resProductInfo, 'resProductInfo');
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
            <Button style={{fontSize: '16px', padding: '5px 18px'}} rounded severity="warning" onClick={() => false}>Book Now</Button>
          </div>
        </header>

        <div className="grid grid-cols-12 my-2">
          {serviceDetails?.images.length === 1 ? (
            <div className="md:col-12 lg:col-12 sm:col-12">
             <img src={serviceDetails?.images[0]?.imagePath} alt={`Image`} className='w-full h-full slid-style'/>
           </div>
          ) : serviceDetails?.images.length > 1  ? (
            <>
              <div className="md:col-5 lg:col-5 sm:col-12">
                <img src={serviceDetails?.images[0]?.imagePath} alt={`Image`} className='w-full h-full slid-style'/>
              </div>

              <div className="md:col-7 lg:col-7 sm:col-12">
                {serviceDetails?.images.map((src: any, index: number) => (
                  index > 0 && index <= 4 ? (
                    <img key={index} src={src.imagePath} alt={`Image ${index + 1}`} className={`col-6 object-cover slid-style ${index === 1 || index === 2 ? 'pt-0' : ''} ${index === 3 || index === 4 ? 'pb-0' : ''} ${index === 4 ? 'service-details-last-img' : ''}`} />
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
                <p style={{ display: 'grid', justifyContent: 'start', alignItems: 'center', fontSize: '14px', color: '#ccccccbd'}}>per night <span style={{fontSize: '20px', fontWeight: 'bolder',  color: '#000'}}>${serviceDetails?.pricePerNight}</span></p>
                <p className='sidebar-border'><FontAwesomeIcon icon={faCalendarAlt} size={"sm"} style={{ color: '#ddd' }} className="mr-2" /> {serviceDetails?.dates}</p>
                <p className='sidebar-border'><FontAwesomeIcon icon={faFireAlt} size={"sm"} style={{ color: '#ddd' }} className="mr-2" />{serviceDetails?.guests}</p>
                <Button style={{fontSize: '15px', marginTop: '10px', padding: '10px', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}} rounded severity="warning" icon={ <FontAwesomeIcon className="mr-2" icon={faMapLocation} size={"sm"} />} onClick={() => setShowMapLocation(true)}>Show On Map</Button>
                <Button style={{fontSize: '15px', marginTop: '10px', padding: '10px', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}} rounded severity="warning" icon={ <FontAwesomeIcon className="mr-2" icon={faBook} size={"sm"} />} onClick={() => false}>Book Now</Button>
                <div className="sidebar-total-fees">
                  <p style={{ fontSize: '17px', fontWeight: 'bold', padding: '10px', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>Total Fees<span>${serviceDetails?.totalFees}</span></p>
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
          // country={}
          // province={}
          // city={}
          onLocationSelect={(location: LocationFromMap) => { setSelectedLocationFromMap(location) }}
        />
      </Dialog>
    </>}
  </>);
};

export default ServiceDetailsPage;
