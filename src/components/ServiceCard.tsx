import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { useNavigate } from 'react-router-dom';
import { GetAssignedFacilitiesByServiceId } from '../Services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Service, Hotel, Flight, Restaurant, QueryFilter } from '../modules/getrip.modules';
import { DataType } from '../enums';
import { Dialog } from 'primereact/dialog';
import GoogleMap from './GoogleMap';

interface ServiceCardProps {
  service: Service | Hotel | Flight | Restaurant;
  type: DataType;
  ServiceCardStyle?: React.CSSProperties;
  QueryFilter?: QueryFilter,
  moreData?: any
}

const ServiceCard : React.FC<ServiceCardProps> = ({ ServiceCardStyle, service, type, QueryFilter, moreData }) => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [moreQueryString, setMoreQueryString] = useState<any>();
  const [showMapLocation, setShowMapLocation] = useState<{
    markerLat?: any
    markerLng?: any
    markerText?: any
    country?: any
    province?: any
    city?: any
  } | null>(null);

  useEffect(() => {
    if (type === DataType.Service) {
      GetAssignedFacilitiesByServiceId((service as Service).id)
        .then((res: any) => {
          if (res.isSuccess && res.data) {
            const primaryFacilities = res.data.flatMap((category: any) =>
              category.facilities
                .filter((facility: any) => facility.isPrimary)
                .map((facility: any) => facility.name)
            );
            setFacilities(primaryFacilities);
          }
        })
        .catch((error: any) => {
          console.error('Error fetching facilities:', error);
        });
    }
  }, [service, type]);

  const renderContent = () => {
    switch (type) {
      case DataType.Hotel:
        const moreQuery = {search_id: moreData, offer_id: (service as Hotel).offers[0].offerId, product_id: (service as Hotel).id}
        setMoreQueryString(moreQuery ? Object.entries(moreQuery).filter(([_, value]) => value !== undefined).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join('&'): '');

        const hotel = service as Hotel;
        return (
          <>
            <div style={{ margin: '0 0 0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{hotel.name}</h2>
              <span style={{ color: '#f1881f', fontWeight: 'bold'}}>{hotel.offers[0].price.amount} {hotel.offers[0].price.currency}</span>
            </div>
            <p style={{ margin: '0 0 4rem 0', color: '#888' }}>
              <FontAwesomeIcon icon={faMapLocationDot} style={{ color: 'rgb(102 101 101)' }} size={"sm"} className="mr-2" />
              {hotel.city.name}, {hotel.country.name}
            </p>
          </>
        );
      case DataType.Flight:
        const flight = service as Flight;
        return (
          <>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>{flight.airport?.name ?? flight.city?.name}</h2>
            <p style={{ margin: '0 0 4rem 0', color: '#888' }}>
              <FontAwesomeIcon icon={faMapLocationDot} style={{ color: 'rgb(102 101 101)' }} size={"sm"} className="mr-2" />
              {flight.city ? flight.city.name : flight.airport?.name}
            </p>
          </>
        );
      case DataType.Restaurant:
        const restaurant = service as Restaurant;
        return (
          <>
            <h2 style={{ margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>{restaurant.name}</span>
              <span className='p-button p-component p-button-outlined p-button-danger p-2 text-sm' style={{minWidth: 'max-content', height: '40px'}}>
                <span style={{color: '#000'}} className='mr-2'>Business Status: </span>{restaurant.business_status.replace(/_/g, ' ')}
              </span>
            </h2>
            <p style={{ margin: '0 0 1rem 0', color: '#888' }}>
              <FontAwesomeIcon icon={faMapLocationDot} style={{ color: 'rgb(102 101 101)' }} size={"sm"} className="mr-2" />
              {restaurant.vicinity}
            </p>
          </>
        );
      case DataType.Service:
        const serviceData = service as Service;
        return (
          <>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>{serviceData.name}</h2>
            <p style={{ margin: '0 0 1rem 0', color: '#888' }}>
              <FontAwesomeIcon icon={faMapLocationDot} style={{ color: 'rgb(102 101 101)' }} size={"sm"} className="mr-2" />
              {serviceData.description}
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const queryString = QueryFilter ? Object.entries(QueryFilter).filter(([_, value]) => value !== undefined).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join('&'): '';

  return (
    <>
      <Card style={{ ...ServiceCardStyle }}>
        <div className='grid grid-cols-12'>
          <div className="md:col-3 lg:col-3 sm:col-12">
            <img
              src={service?.image}
              alt={service?.name}
              className='px-2 py-4'
              style={{ height: '220px', maxHeight: '220px', width: '100%' }}
            />
          </div>
          <div className="md:col-9 lg:col-9 sm:col-12">
            <div className='pl-2 pr-4 py-4'>
              {renderContent()}
              {type === DataType.Service ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginBottom: '1rem' }}>
                  {facilities.map((facility, index) => (
                    <span key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#555' }}>
                      <i className="pi pi-check-circle" style={{ marginRight: '0.5rem', color: '#FF6C00' }}></i>
                      {facility}
                    </span>
                  ))}
                </div>
              ) : type === DataType.Hotel ?
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginBottom: '1rem' }}>
                  {(service as Hotel).facilities.map((facility, index) => (
                    <span key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#555' }}>
                      <i className="pi pi-check-circle" style={{ marginRight: '0.5rem', color: '#FF6C00' }}></i>
                      {facility.name}
                    </span>
                  ))}
                </div>
                : <></>}
              {type === DataType.Restaurant && service.hasOwnProperty('types') && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginBottom: '1rem' }}>
                  {(service as Restaurant).types.map((type: string, index: number) => (
                    <span key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#555' }}>
                      <i className="pi pi-check-circle" style={{ marginRight: '0.5rem', color: '#FF6C00' }}></i>
                      {type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
              <hr style={{ border: '1px solid #ddd' }} className='my-3' />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {service.hasOwnProperty('ratingAverage') && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={(service as Service).ratingAverage} readOnly stars={5} cancel={false} style={{ marginRight: '0.5rem' }} />
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>({(service as Service).isApproved ? 'APPROVED' : 'NOT APPROVED'})</span>
                  </div>
                )}
                {service.hasOwnProperty('rating') && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={(service as Restaurant).rating} readOnly stars={5} cancel={false} style={{ marginRight: '0.5rem' }} />
                    <span style={{ fontSize: '0.9rem', color: '#888', width: 'max-content' }}>({(service as Restaurant).user_ratings_total ?? (service as Hotel).rating}) <b>User Ratings Total</b></span>
                  </div>
                )}

                {type === DataType.Service ? (
                  <Button
                    label="View Details"
                    className='view-details'
                    style={{ backgroundColor: '#FF6C00', borderColor: '#FF6C00', borderRadius: '25px' }}
                    onClick={() => {
                      navigate(`/service-details/${DataType.Service.toLowerCase()}/${(service as Service).id}/${queryString}`)
                    }}
                  />
                ): type === DataType.Flight ? (
                  <div style={{width:'100%', display:'flex', justifyContent: 'end', alignItems: 'center'}}>
                    {(service as Flight).airport &&
                      <Button
                        label="View Details"
                        className='view-details'
                        style={{ backgroundColor: '#FF6C00', borderColor: '#FF6C00', borderRadius: '25px' }}
                        onClick={() => {
                          navigate(`/service-details/${DataType.Flight.toLowerCase()}/${(service as Flight)?.airport?.id}/${queryString}`)
                        }}
                      />
                    }

                    <Button
                      label="View In Map"
                      className='view-details mx-1'
                      style={{ backgroundColor: '#FF6C00', borderColor: '#FF6C00', borderRadius: '25px' }}
                      onClick={() => setShowMapLocation({
                        markerLat: (service as Flight).geolocation.latitude,
                        markerLng: (service as Flight).geolocation.longitude,
                        markerText: `${(service as Flight).city?.name}`,
                        city:`${(service as Flight).city?.name}`,
                      })}
                    />
                  </div>
                ): type === DataType.Hotel ? (
                  <div style={{width:'100%', display:'flex', justifyContent: 'end', alignItems: 'center'}}>
                    {(service as Hotel).id &&
                      <Button
                        label="View Details"
                        className='view-details mx-1'
                        style={{ backgroundColor: '#FF6C00', borderColor: '#FF6C00', borderRadius: '25px' }}
                        onClick={() => {
                          navigate(`/service-details/${DataType.Hotel.toLowerCase()}/${(service as Hotel)?.id}/${queryString}/${moreQueryString}`)
                        }}
                      />
                    }

                    <Button
                      label="View In Map"
                      className='view-details mx-1'
                      style={{ backgroundColor: '#FF6C00', borderColor: '#FF6C00', borderRadius: '25px' }}
                      onClick={() => setShowMapLocation({
                        markerLat: (service as Hotel).geolocation.latitude,
                        markerLng: (service as Hotel).geolocation.longitude,
                        markerText: `${(service as Hotel).city.name}, ${(service as Hotel).country.name}`,
                        country:`${(service as Hotel).country?.name}`,
                        city:`${(service as Hotel).city?.name}`,
                      })}
                    />
                  </div>
                ): type === DataType.Restaurant ? (
                  <Button
                    label="View In Map"
                    className='view-details'
                    style={{ backgroundColor: '#FF6C00', borderColor: '#FF6C00', borderRadius: '25px' }}
                    onClick={() =>  setShowMapLocation({
                      markerLat: (service as Restaurant).geometry.location.lat,
                      markerLng: (service as Restaurant).geometry.location.lng,
                      markerText: (service as Restaurant).vicinity,
                      country:`${(service as Restaurant).vicinity}`,
                    })}
                  />
                ): null }
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Dialog
        header="Map Location"
        visible={showMapLocation !== null}
        style={{
          minWidth: '70%',
          minHeight: '70%',
          padding: '0',
          margin: '0',
          backgroundColor: 'transparent'
        }}
        footer={<div>
          <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowMapLocation(null)} className="mt-4"></Button>
        </div>}
        onHide={() => setShowMapLocation(null)}
      >
        <GoogleMap
          country={showMapLocation?.country ?? ''}
          province={showMapLocation?.province ?? ''}
          city={showMapLocation?.city ?? ''}
        />
      </Dialog>
    </>
  );
};

export default ServiceCard;
