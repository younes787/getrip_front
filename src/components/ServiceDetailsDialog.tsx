import { Fieldset } from 'primereact/fieldset';
import LoadingComponent from './Loading';
import { useEffect, useState } from 'react';
import { Galleria } from 'primereact/galleria';
import { ApproveService, RejectService } from "../Services";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const ServiceDetailsDialog = ({ loading, serviceDetails }: any) => {
  const [images, setImages] = useState<any>(null);
  const [placeImages, setPlaceImages] = useState<any>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentServiceId, setCurrentServiceId] = useState<any>(null);
  const [headerRejectionReason, setHeaderRejectionReason] = useState<string>('');

  const {
    id,
    name,
    description,
    price,
    isActive,
    isArchived,
    isApproved,
    isApprovalRequired,
    isTaxIncluded,
    fieldsAndValues = [],
    steps,
    tags = [],
    photos = [],
    place,
    priceValues = [],
    serviceFacilities = [],
  } = serviceDetails || {};

  useEffect(() => {
    setImages(photos ?? []);

    if (place?.photos) {
      const images = place.photos.map((photo: any) => ({
        imagePath: photo.imagePath,
      }));
      setPlaceImages(images);
    }
  }, [photos, place?.photos]);

  const itemTemplate = (item: any) => {
    return <img src={item.imagePath} alt={item} style={{ width: '100%', height: '600px', display: 'block' }} />;
  }

  const placeItemTemplate = (item: any) => {
    return (
      <img
        src={item.imagePath}
        alt="Place"
        style={{ width: '100%', height: '350px' }}
      />
    );
  };

  const handleRejectClick = (serviceId: number) => {
    setHeaderRejectionReason('Service rejection reason');
    setCurrentServiceId(serviceId);
    setShowDialog(true);
  };

  const handleRejectConfirm = () => {
    if (currentServiceId !== null) {
      RejectService({
        id: currentServiceId,
        note: rejectionReason
      });
    }

    setShowDialog(false);
    setRejectionReason('');
  };

  return (
    <div style={{ margin: '20px 100px'}}>
      { loading ? <LoadingComponent /> : <>
        {serviceDetails &&
          <div className='grid grid-cols-12'>
            <section className='md:col-12 lg:col-12' style={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
              <i onClick={() => ApproveService(id)}
                className="pi pi-check"
                style={{ color: 'green', border: '1px solid green', fontSize: '22px', borderRadius: '50%', padding: '5px', margin: '5px', cursor: 'pointer' }}
              ></i>

              <i onClick={() => handleRejectClick(id)}
                className="pi pi-times"
                style={{ color: 'red', border: '1px solid red', fontSize: '22px', borderRadius: '50%', padding: '5px', margin: '5px', cursor: 'pointer' }}
              ></i>
            </section>

            <section className="md:col-8 lg:col-8" style={{ height: '100px'}}>
              <div style={{ minHeight: '100%', display: 'grid', justifyContent: 'start', alignItems: 'center', borderRadius: '7px', borderColor: '#ddd'}}>
                <h2 className='m-2'>{name || 'No name'}</h2>
                <h3 className='m-2'>{description || 'No description'}</h3>
              </div>
            </section>

            <section className='md:col-4 lg:col-4' style={{ height: '100px', display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
              <div className="p-1" style={{ minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '7px', borderColor: '#ddd'}}>
                <span style={{ fontSize: '25px'}}>
                  {price !== null ? price : 'No price'}
                </span>
                <i className='pi pi-money-bill mx-2' style={{ fontSize: '25px' }}></i>
              </div>
            </section>

            <section className="md:col-12 lg:col-12">
              <Galleria
                value={images}
                numVisible={5}
                circular
                showItemNavigators
                showItemNavigatorsOnHover
                showThumbnails={false}
                item={itemTemplate}
                thumbnailsPosition='top'
              />
            </section>

            <Fieldset legend="Basic Information" className="md:col-12 lg:col-12 mb-3">

              <p>
                {isActive ?
                  <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
                  <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
                }
                <span className='mx-1'> Active </span>
              </p>

              <p>
                {isArchived ?
                  <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
                  <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
                }
                <span className='mx-1'> Archived </span>
              </p>

              <p>
                {isApproved ?
                  <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
                  <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
                }
                <span className='mx-1'> Approved </span>
              </p>

              <p>
                {isApprovalRequired ?
                  <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
                  <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
                }
                <span className='mx-1'> Approval Required </span>
              </p>

              <p>
                {isTaxIncluded ?
                  <i className="pi pi-check" style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
                  <i className="pi pi-times" style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
                }
                <span className='mx-1'> Tax Included </span>
              </p>
            </Fieldset>

            <Fieldset legend="Fields and Values" className="md:col-12 lg:col-12 mb-3">
              {fieldsAndValues && fieldsAndValues.length > 0 ? (
                <ul>
                  {fieldsAndValues.map((field: any) => (
                    <li key={field.fieldId}>
                      <p>Field Name: {field.fieldName}</p>
                      <p>Value: {field.value}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-red-500 text-sm italic">No Data</p>
              )}
            </Fieldset>

            <Fieldset legend="Steps" className="md:col-12 lg:col-12 mb-3">
              {steps ? <p>{steps}</p> : <p className="text-center text-red-500 text-sm italic">No Data</p>}
            </Fieldset>

            <Fieldset legend="Tags" className="md:col-12 lg:col-12 mb-3">
              {tags && tags.length > 0 ? (
                <ul>
                  {tags.map((tag: any, index: number) => (
                    <li key={index}>{tag.name || 'No data'}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-red-500 text-sm italic">No Data</p>
              )}
            </Fieldset>

            <Fieldset legend="Place" className="md:col-12 lg:col-12 mb-3">
              {place ? (
                <div>
                  <p>Name: {place.name}</p>
                  <p>Description: {place.description}</p>
                  <p>Google Maps URL: <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer">View Map</a></p>
                  <p>Lang: {place.lang}</p>
                  <p>Lot: {place.lot}</p>
                  <h4>Place Photos</h4>
                  {place.photos.length > 0 ? (
                    <Galleria
                    style={{width: '50%'}}
                      value={placeImages}
                      numVisible={5}
                      circular
                      showItemNavigators
                      showItemNavigatorsOnHover
                      showThumbnails={false}
                      item={placeItemTemplate}
                      thumbnailsPosition="top"
                    />
                  ) : (
                    <p className="text-center text-red-500 text-sm italic">No Data</p>
                  )}
                  <h4>Activities</h4>
                  {place.activities.length > 0 ? (
                    <ul>
                      {place.activities.map((activity: any) => (
                        <li key={activity.id}>
                          <p>Name: {activity.name}</p>
                          <p>Description: {activity.description}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-red-500 text-sm italic">No Data</p>
                  )}
                </div>
              ) : (
                <p className="text-center text-red-500 text-sm italic">No Data</p>
              )}
            </Fieldset>

            <Fieldset legend="Price Values" className="md:col-12 lg:col-12 mb-3">
              {priceValues && priceValues.length > 0 ? (
                <ul>
                  {priceValues.map((priceValue: any, index: number) => (
                    <li key={index}>{priceValue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-red-500 text-sm italic">No Data</p>
              )}
            </Fieldset>

            <Fieldset legend="Service Facilities" className="md:col-12 lg:col-12 mb-3">
              {serviceFacilities && serviceFacilities.length > 0 ? (
                <ul>
                  {serviceFacilities.map((facility: any, index: number) => (
                    <li className='my-2' key={index}>
                      {facility.categoryName}
                      {facility.facilities && facility.facilities.length > 0 && (
                        <ul>
                          {facility.facilities.map((_facility: any, _index: number) => (
                            <li className='my-2' key={_index}>{_facility.name}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-red-500 text-sm italic">No Data</p>
              )}
            </Fieldset>
          </div>
        }
      </>}

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
    </div>
  );
}

export default ServiceDetailsDialog;
