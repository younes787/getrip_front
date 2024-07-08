import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { useNavigate } from 'react-router-dom';
import { GetAssignedFacilitiesByServiceId } from '../Services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

interface Service {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  numberOfReviews: number;
  imageUrl: string;
}

interface ServiceCardProps {
  service: Service;
  ServiceCardStyle?: React.CSSProperties;
}

const ServiceCard : React.FC<ServiceCardProps> = ({ ServiceCardStyle, service }) => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<any[]>([]);

  useEffect(() => {
    GetAssignedFacilitiesByServiceId(service.id)
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
  }, [service.id]);

  return (
    <Card style={{ ...ServiceCardStyle }}>
      <div className='grid grid-cols-12'>
        <div className="md:col-3 lg:col-3 sm:col-12">
          <img src={service.imageUrl} alt={service.name} className='px-2 py-4' style={{ height: '220px', maxHeight: '220px', width: '100%' }} />
        </div>

        <div className="md:col-9 lg:col-9 sm:col-12">
          <div className='pl-2 pr-4 py-4'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0' }}>{service.name}</h2>
                <p style={{ margin: '0 0 1rem 0', color: '#888' }}>
                  <FontAwesomeIcon icon={faMapLocationDot} style={{ color: 'rgb(102 101 101)' }} size={"sm"} className="mr-2" />
                  {service.location}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#FF6C00' }}>${service.pricePerNight}</h2>
                <p style={{ margin: '0', color: '#888' }}>Per Night</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginBottom: '1rem' }}>
              {facilities.map((facility: any, index: number) => (
                <span key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#555' }}>
                  <i className="pi pi-check-circle" style={{ marginRight: '0.5rem', color: '#FF6C00' }}></i>
                  {facility}
                </span>
              ))}
            </div>

            <hr style={{border: '1px solid #ddd'}} className='my-3'/>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={service.rating} readOnly stars={5} cancel={false} style={{ marginRight: '0.5rem' }} />
                <span style={{ fontSize: '0.9rem', color: '#888' }}>({service.numberOfReviews} REVIEWS)</span>
              </div>
              <Button
                label="View Details"
                className='view-details'
                style={{ backgroundColor: '#FF6C00', borderColor: '#FF6C00', borderRadius: '25px'}}
                onClick={() => { navigate(`/service-details/${service.id}`) }}
              />
            </div>
          </div>
        </div>
      </div>
  </Card>
  );
};

export default ServiceCard;
