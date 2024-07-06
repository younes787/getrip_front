
import React, { useState } from 'react';
import { faCalendarAlt, faFireAlt, faHeart, faMapLocationDot, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
import LoadingComponent from './Loading';

interface ServiceDetailsData {
  name: string;
  location: string;
  images: string[];
  overview: string;
  facilities: string;
  prices: string;
  reviews: string;
  address: string;
  pricePerNight: number;
  dates: string;
  guests: string;
  totalFees: number;
}

const ServiceDetails: React.FC<{ loading: boolean, serviceDetails: ServiceDetailsData }> = ({ loading, serviceDetails }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const openTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <>
      { loading ? <LoadingComponent /> : <>
      <div className="service-details-container">
        <header className="service-details-header">
          <div className="service-details-info">
            <h1>{serviceDetails.name}</h1>
            <p><FontAwesomeIcon icon={faMapLocationDot} size={"sm"} style={{ color: '#000' }} className="mr-2" /> {serviceDetails.location}</p>
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
              src={serviceDetails.images[0]}
              alt={`Image`}
              className='w-full h-full slid-style'
            />
          </div>

          <div className="md:col-7 lg:col-7 sm:col-12">
            {serviceDetails.images.map((src, index) => (
              index > 0 && index <= 4 ? (
                  <img
                    key={index}
                    src={src}
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
                  <p>{serviceDetails.overview}</p>
                  <a href="#">See More</a>
                </div>
              )}

              {activeTab === 'Facilities' && (
                <div className="tab-pane active">
                  <h2>Facilities</h2>
                  <p>{serviceDetails.facilities}</p>
                </div>
              )}

              {activeTab === 'Prices' && (
                <div className="tab-pane active">
                  <h2>Prices</h2>
                  <p>{serviceDetails.prices}</p>
                </div>
              )}

              {activeTab === 'Reviews' && (
                <div className="tab-pane active">
                  <h2>Reviews</h2>
                  <p>{serviceDetails.reviews}</p>
                </div>
              )}

              {activeTab === 'Location' && (
                <div className="tab-pane active">
                  <h2>Location</h2>
                  <p>{serviceDetails.address}</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-4 lg:col-4 sm:col-12">
            <div className="sidebar">
              <div className="sidebar-info">
                <p style={{ display: 'grid', justifyContent: 'start', alignItems: 'center', fontSize: '14px', color: '#ccccccbd'}}>per night <span style={{fontSize: '20px', fontWeight: 'bolder',  color: '#000'}}>${serviceDetails.pricePerNight}</span></p>
                <p className='sidebar-border'><FontAwesomeIcon icon={faCalendarAlt} size={"sm"} style={{ color: '#ddd' }} className="mr-2" /> {serviceDetails.dates}</p>
                <p className='sidebar-border'><FontAwesomeIcon icon={faFireAlt} size={"sm"} style={{ color: '#ddd' }} className="mr-2" />{serviceDetails.guests}</p>
                <Button style={{fontSize: '15px', padding: '10px', width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}} rounded severity="warning" onClick={() => false}>Book Now</Button>

                <div className="sidebar-total-fees">
                  <p
                    style={{
                      fontSize: '17px',
                      fontWeight: 'bold',
                      padding: '10px',
                      width: '100%',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >Total Fees<span>${serviceDetails.totalFees}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></>
      }
    </>
  );
};

export default ServiceDetails;


// import { Fieldset } from 'primereact/fieldset';
// import LoadingComponent from './Loading';
// import { useEffect, useState } from 'react';
// import { Galleria } from 'primereact/galleria';
// import { ApproveService, RejectService } from "../Services";
// import { Dialog } from 'primereact/dialog';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';

// const ServiceDetails = ({ loading, serviceDetails }: any) => {
//   const [images, setImages] = useState<any>(null);
//   const [placeImages, setPlaceImages] = useState<any>([]);
//   const [showDialog, setShowDialog] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [currentServiceId, setCurrentServiceId] = useState<any>(null);
//   const [headerRejectionReason, setHeaderRejectionReason] = useState<string>('');

//   const {
//     id,
//     name,
//     description,
//     price,
//     isActive,
//     isArchived,
//     isApproved,
//     isApprovalRequired,
//     isTaxIncluded,
//     fieldsAndValues = [],
//     steps,
//     tags = [],
//     photos = [],
//     place,
//     priceValues = [],
//     serviceFacilities = [],
//   } = serviceDetails || {};

//   useEffect(() => {
//     setImages(photos ?? []);

//     if (place?.photos) {
//       const images = place.photos.map((photo: any) => ({
//         imagePath: photo.imagePath,
//       }));
//       setPlaceImages(images);
//     }
//   }, [photos, place?.photos]);

//   const itemTemplate = (item: any) => {
//     return <img src={item.imagePath} alt={item} style={{ width: '100%', height: '600px', display: 'block' }} />;
//   }

//   const placeItemTemplate = (item: any) => {
//     return (
//       <img
//         src={item.imagePath}
//         alt="Place"
//         style={{ width: '100%', height: '350px' }}
//       />
//     );
//   };

//   const handleRejectClick = (serviceId: number) => {
//     setHeaderRejectionReason('Service rejection reason');
//     setCurrentServiceId(serviceId);
//     setShowDialog(true);
//   };

//   const handleRejectConfirm = () => {
//     if (currentServiceId !== null) {
//       RejectService({
//         id: currentServiceId,
//         note: rejectionReason
//       });
//     }

//     setShowDialog(false);
//     setRejectionReason('');
//   };

//   return (
//     <div style={{ margin: '20px 100px'}}>
//       { loading ? <LoadingComponent /> : <>
//         {serviceDetails &&
//           <div className='grid grid-cols-12'>
//             <section className="md:col-8 lg:col-8" style={{ height: '100px'}}>
//               <div style={{ minHeight: '100%', display: 'grid', justifyContent: 'start', alignItems: 'center', borderRadius: '7px', borderColor: '#ddd'}}>
//                 <h2 className='m-2'>{name || 'No name'}</h2>
//                 <h3 className='m-2'>{description || 'No description'}</h3>
//               </div>
//             </section>

//             <section className='md:col-4 lg:col-4' style={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
//               <i onClick={() => ApproveService(id)}
//                 className="pi pi-check"
//                 style={{ color: 'green', border: '1px solid green', fontSize: '22px', borderRadius: '10%', padding: '15px', margin: '5px', cursor: 'pointer' }}
//               ></i>

//               <i onClick={() => handleRejectClick(id)}
//                 className="pi pi-times"
//                 style={{ color: 'red', border: '1px solid red', fontSize: '22px', borderRadius: '10%', padding: '15px', margin: '5px', cursor: 'pointer' }}
//               ></i>
//             </section>

//             <section className="md:col-12 lg:col-12">
//               <Galleria
//                 value={images}
//                 numVisible={5}
//                 circular
//                 showItemNavigators
//                 showItemNavigatorsOnHover
//                 showThumbnails={false}
//                 item={itemTemplate}
//                 thumbnailsPosition='top'
//               />
//             </section>

//             <section className='md:col-12 lg:col-12' style={{ height: '100px', display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
//               <div className="p-1" style={{ minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '7px', borderColor: '#ddd'}}>
//                 <span style={{ fontSize: '25px'}}>
//                   {price !== null ? price : 'No price'}
//                 </span>
//                 <i className='pi pi-money-bill mx-2' style={{ fontSize: '25px' }}></i>
//               </div>
//             </section>

//             <Fieldset legend="Basic Information" className="md:col-12 lg:col-12 mb-3">

//               <p>
//                 {isActive ?
//                   <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
//                   <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
//                 }
//                 <span className='mx-1'> Active </span>
//               </p>

//               <p>
//                 {isArchived ?
//                   <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
//                   <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
//                 }
//                 <span className='mx-1'> Archived </span>
//               </p>

//               <p>
//                 {isApproved ?
//                   <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
//                   <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
//                 }
//                 <span className='mx-1'> Approved </span>
//               </p>

//               <p>
//                 {isApprovalRequired ?
//                   <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
//                   <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
//                 }
//                 <span className='mx-1'> Approval Required </span>
//               </p>

//               <p>
//                 {isTaxIncluded ?
//                   <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
//                   <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
//                 }
//                 <span className='mx-1'> Tax Included </span>
//               </p>
//             </Fieldset>

//             <Fieldset legend="Fields and Values" className="md:col-12 lg:col-12 mb-3">
//               {fieldsAndValues && fieldsAndValues.length > 0 ? (
//                 <ul>
//                   {fieldsAndValues.map((field: any) => (
//                     <li key={field.fieldId}>
//                       <p>Field Name: {field.fieldName}</p>
//                       <p>Value: {field.value}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-red-500 text-sm italic">No Data</p>
//               )}
//             </Fieldset>

//             <Fieldset legend="Steps" className="md:col-12 lg:col-12 mb-3">
//               {steps ? <p>{steps}</p> : <p className="text-center text-red-500 text-sm italic">No Data</p>}
//             </Fieldset>

//             <Fieldset legend="Tags" className="md:col-12 lg:col-12 mb-3">
//               {tags && tags.length > 0 ? (
//                 <ul>
//                   {tags.map((tag: any, index: number) => (
//                     <li key={index}>{tag.name || 'No data'}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-red-500 text-sm italic">No Data</p>
//               )}
//             </Fieldset>

//             <Fieldset legend="Place" className="md:col-12 lg:col-12 mb-3">
//               {place ? (
//                 <div>
//                   <p>Name: {place.name}</p>
//                   <p>Description: {place.description}</p>
//                   <p>Google Maps URL: <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer">View Map</a></p>
//                   <p>Lang: {place.lang}</p>
//                   <p>Lot: {place.lot}</p>
//                   <h4>Place Photos</h4>
//                   {place.photos.length > 0 ? (
//                     <Galleria
//                     style={{width: '50%'}}
//                       value={placeImages}
//                       numVisible={5}
//                       circular
//                       showItemNavigators
//                       showItemNavigatorsOnHover
//                       showThumbnails={false}
//                       item={placeItemTemplate}
//                       thumbnailsPosition="top"
//                     />
//                   ) : (
//                     <p className="text-center text-red-500 text-sm italic">No Data</p>
//                   )}
//                   <h4>Activities</h4>
//                   {place.activities.length > 0 ? (
//                     <ul>
//                       {place.activities.map((activity: any) => (
//                         <li key={activity.id}>
//                           <p>Name: {activity.name}</p>
//                           <p>Description: {activity.description}</p>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-center text-red-500 text-sm italic">No Data</p>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-center text-red-500 text-sm italic">No Data</p>
//               )}
//             </Fieldset>

//             <Fieldset legend="Price Values" className="md:col-12 lg:col-12 mb-3">
//               {priceValues && priceValues.length > 0 ? (
//                 <ul>
//                   {priceValues.map((priceValue: any, index: number) => (
//                     <li key={index}>{priceValue}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-red-500 text-sm italic">No Data</p>
//               )}
//             </Fieldset>

//             <Fieldset legend="Service Facilities" className="md:col-12 lg:col-12 mb-3">
//               {serviceFacilities && serviceFacilities.length > 0 ? (
//                 <ul>
//                   {serviceFacilities.map((facility: any, index: number) => (
//                     <li className='my-2' key={index}>
//                       {facility.categoryName}
//                       {facility.facilities && facility.facilities.length > 0 && (
//                         <ul>
//                           {facility.facilities.map((_facility: any, _index: number) => (
//                             <li className='my-2' key={_index}>{_facility.name}</li>
//                           ))}
//                         </ul>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-red-500 text-sm italic">No Data</p>
//               )}
//             </Fieldset>
//           </div>
//         }
//       </>}

//       <Dialog
//         header={headerRejectionReason}
//         visible={showDialog}
//         style={{ width: '50vw' }}
//         footer={<div>
//             <Button label="Confirm" size="small" severity="warning" outlined onClick={handleRejectConfirm} className="mt-4"></Button>
//             <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowDialog(false)} className="mt-4"></Button>
//         </div>}
//         onHide={() => {if (!showDialog) return; setShowDialog(false); }}
//       >
//           <InputText
//             name="rejection_reason"
//             className="mt-2	w-full"
//             value={rejectionReason}
//             onChange={(e) => setRejectionReason(e.target.value)}
//             placeholder="Enter rejection reason"
//           />
//       </Dialog>
//     </div>
//   );
// }

// export default ServiceDetails;
