import { Fieldset } from 'primereact/fieldset';
import { Image } from 'primereact/image';
import LoadingComponent from './Loading';

const ServiceDetailsDialog = ({ loading, serviceDetails }: any) => {
  const {
    id,
    typeId,
    cityId,
    placeId,
    accountId,
    currencyId,
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

  return (
    <div className="p-5">
     { loading ? <LoadingComponent/> : <div className="p-5">
        <div className="data-container grid grid-cols-12">
          {serviceDetails && <>
            <Fieldset legend="Basic Information" className="md:col-12 lg:col-12 mb-3">
              <p><strong>Name:</strong> {name || 'No data'}</p>
              <p><strong>Description:</strong> {description || 'No data'}</p>
              <p><strong>Price:</strong> {price !== null ? price : 'No data'}</p>
              <p><strong>Is Active:</strong> {isActive ? 'Yes' : 'No'}</p>
              <p><strong>Is Archived:</strong> {isArchived ? 'Yes' : 'No'}</p>
              <p><strong>Is Approved:</strong> {isApproved ? 'Yes' : 'No'}</p>
              <p><strong>Is Approval Required:</strong> {isApprovalRequired ? 'Yes' : 'No'}</p>
              <p><strong>Is Tax Included:</strong> {isTaxIncluded ? 'Yes' : 'No'}</p>
            </Fieldset>

            <Fieldset legend="Fields and Values" className="md:col-12 lg:col-12 mb-3">
              {fieldsAndValues && fieldsAndValues.length > 0 ? (
                <ul>
                  {fieldsAndValues.map((field: any) => (
                    <li key={field.fieldId}>
                      <p><strong>Field Name:</strong> {field.fieldName}</p>
                      <p><strong>Value:</strong> {field.value}</p>
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

            <Fieldset legend="Photos" className="md:col-12 lg:col-12 mb-3">
              {photos && photos.length > 0 ? (
                <ul>
                  {photos.map((photo: any, index: number) => (
                    <li key={index}>
                      <Image src={photo.imagePath} alt={`Photo ${index + 1}`} width="250" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-red-500 text-sm italic">No Data</p>
              )}
            </Fieldset>

            <Fieldset legend="Place" className="md:col-12 lg:col-12 mb-3">
              {place ? (
                <div>
                  <p><strong>Name:</strong> {place.name}</p>
                  <p><strong>Description:</strong> {place.description}</p>
                  <p><strong>Google Maps URL:</strong> <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer">View Map</a></p>
                  <p><strong>Lang:</strong> {place.lang}</p>
                  <p><strong>Lot:</strong> {place.lot}</p>
                  <h4>Place Photos</h4>
                  {place.photos.length > 0 ? (
                    <ul>
                      {place.photos.map((photo: any, index: number) => (
                        <li key={index}>
                          <Image src={photo.imagePath} alt={`Place Photo ${index + 1}`} width="250" />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-red-500 text-sm italic">No Data</p>
                  )}
                  <h4>Activities</h4>
                  {place.activities.length > 0 ? (
                    <ul>
                      {place.activities.map((activity: any) => (
                        <li key={activity.id}>
                          <p><strong>Name:</strong> {activity.name}</p>
                          <p><strong>Description:</strong> {activity.description}</p>
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
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-red-500 text-sm italic">No Data</p>
              )}
            </Fieldset>
          </>}
        </div>
      </div>}
    </div>
  );
}

export default ServiceDetailsDialog;
