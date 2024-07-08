
import React, { useState } from 'react';
import { faBook, faCalendarAlt, faFireAlt, faHeart, faMapLocation, faMapLocationDot, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
import LoadingComponent from './Loading';
import GoogleMap from './GoogleMap';
import { Dialog } from 'primereact/dialog';
import { LocationFromMap } from '../modules/getrip.modules';

interface ServiceDetailsData {
  name: string;
  location: string;
  images: any[];
  overview: string;
  facilities: any[];
  prices: string;
  reviews: string;
  address: string;
  pricePerNight: number;
  dates: string;
  guests: string;
  totalFees: number;
  lat: number,
  lng: number,
}

const ServiceDetails: React.FC<{ loading: boolean, serviceDetails: ServiceDetailsData }> = ({ loading, serviceDetails }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showMapLocation, setShowMapLocation] = useState(false);
  const [selectedLocationFromMap, setSelectedLocationFromMap] = useState<LocationFromMap | null>(null);

  const openTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const markerData = [
    {
      lat: serviceDetails?.lat ?? 0,
      lng: serviceDetails?.lng ?? 0,
      text: serviceDetails?.address ?? ''
    },
  ] || [];

  return (
    <>
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
          <div className="md:col-5 lg:col-5 sm:col-12">
            <img
              src={serviceDetails?.images[0]?.imagePath}
              alt={`Image`}
              className='w-full h-full slid-style'
            />
          </div>

          <div className="md:col-7 lg:col-7 sm:col-12">
            {serviceDetails?.images.map((src, index) => (
              index > 0 && index <= 4 ? (
                  <img
                    key={index}
                    src={src.imagePath}
                    alt={`Image ${index + 1}`}
                    className={`col-6 object-cover slid-style
                      ${index === 1 || index === 2 ? 'pt-0' : ''}
                      ${index === 3 || index === 4 ? 'pb-0' : ''}
                      ${index === 4 ? 'service-details-last-img' : ''}
                    `}
                  />
              ): null
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 my-2">
          <div className="md:col-8 lg:col-8 sm:col-12">
            <div className="tabs">
              {['Overview', 'Facilities', 'Prices', 'Reviews', 'Location'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => openTab(tab)}
                >
                  {tab}
                </button>
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
          // country={
          //   (Serviceform.values.countryId && countries.find((er: any) => er.id === Serviceform.values.countryId))
          //     ? countries.find((er: any) => er.id === Serviceform.values.countryId).name
          //     : undefined
          // }
          // province={
          //   (Serviceform.values.provincyId && provinces.find((er: any) => er.id === Serviceform.values.provincyId))
          //     ? provinces.find((er: any) => er.id === Serviceform.values.provincyId).name
          //     : undefined
          // }
          // city={
          //   (Serviceform.values.cityId && cities.find((er: any) => er.id === Serviceform.values.cityId))
          //     ? cities.find((er: any) => er.id === Serviceform.values.cityId).name
          //     : undefined
          // }
          onLocationSelect={(location: LocationFromMap) => { setSelectedLocationFromMap(location) }}
        />
      </Dialog>
    </>}
    </>
  );
};

export default ServiceDetails;
