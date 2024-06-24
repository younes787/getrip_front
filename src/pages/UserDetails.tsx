import { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import { useParams } from "react-router-dom";
import { GetAccountById } from "../Services";
import { Fieldset } from "primereact/fieldset";
import { Image } from 'primereact/image';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const UserDetails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [accountDetails, setAccountDetails] = useState<any>();
  const { accountId } = useParams<{ accountId: string }>();

  useEffect(() => {
    setLoading(true);

    GetAccountById(Number(accountId))
    .then((res) => {
      setAccountDetails(res.data ?? []);
    }).catch((error) => {
      console.error("Error fetching account details:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [accountId]);

  const {
    address,
    allowedServiceTypes,
    authorized,
    business,
    cityId,
    currencyId,
    email,
    expiration,
    languageId,
    lastname,
    name,
    phone,
    photos = [],
    position,
    role,
    taxNumber,
    zipCode,
  } = accountDetails || {};

  return (
    <div className="p-5">
    {loading ? <LoadingComponent /> :
        <TransitionGroup className="data-container grid grid-cols-12">
            <CSSTransition key="photos" timeout={500} classNames="fade">
                <Fieldset legend="Photos" className="md:col-12 lg:col-12 mb-3">
                    {photos.length > 0 ? (
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
            </CSSTransition>

            <CSSTransition key="account-info" timeout={500} classNames="fade">
                <Fieldset legend="Account Information" className="md:col-12 lg:col-12 mb-3">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Last Name:</strong> {lastname}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                    <p><strong>Business:</strong> {business}</p>
                    <p><strong>Position:</strong> {position}</p>
                    <p><strong>Address:</strong> {address}</p>
                    <p><strong>Zip Code:</strong> {zipCode}</p>
                </Fieldset>
            </CSSTransition>

            <CSSTransition key="authorization-role" timeout={500} classNames="fade">
                <Fieldset legend="Authorization and Role" className="md:col-12 lg:col-12 mb-3">
                    <p><strong>Authorized:</strong> {authorized ? 'Yes' : 'No'}</p>
                    <p><strong>Role:</strong> {role || 'No data'}</p>
                    <p><strong>Tax Number:</strong> {taxNumber}</p>
                </Fieldset>
            </CSSTransition>

            <CSSTransition key="service-details" timeout={500} classNames="fade">
                <Fieldset legend="Service Details" className="md:col-12 lg:col-12 mb-3">
                    <p><strong>Allowed Service Types:</strong> {allowedServiceTypes || 'No data'}</p>
                    <p><strong>Expiration:</strong> {expiration || 'No data'}</p>
                </Fieldset>
            </CSSTransition>
        </TransitionGroup>
    }
</div>
  );
};

export default UserDetails;
