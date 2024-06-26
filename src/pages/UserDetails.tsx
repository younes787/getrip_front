import { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import { useParams } from "react-router-dom";
import { ApproveUser, GetAccountById, RejectUser } from "../Services";
import { Fieldset } from "primereact/fieldset";
import { Image } from 'primereact/image';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const UserDetails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [accountDetails, setAccountDetails] = useState<any>();
  const { accountId } = useParams<{ accountId: string }>();
  const [showDialog, setShowDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentUserId, setCurrentUserId] = useState<any>(null);
  const [headerRejectionReason, setHeaderRejectionReason] = useState<string>('');

  const handleRejectClick = (userId: any) => {
    setHeaderRejectionReason('User rejection reason');
    setCurrentUserId(userId);
    setShowDialog(true);
  };

  const handleRejectConfirm = () => {
    if (currentUserId !== null) {
      RejectUser({
        id: currentUserId,
        note: rejectionReason
      });
    }

    setShowDialog(false);
    setRejectionReason('');
  };

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
    email,
    expiration,
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
    <div style={{ margin: '20px 100px'}}>
      {loading ? <LoadingComponent /> :
        <div className="grid grid-cols-12">

          <div className="md:col-12 lg:col-12" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
              <i onClick={() => ApproveUser(accountId)}
                className="pi pi-check"
                style={{ color: 'green', border: '1px solid green', fontSize: '22px', borderRadius: '50%', padding: '5px', margin: '5px', cursor: 'pointer' }}
              ></i>

              <i onClick={() => handleRejectClick(accountId)}
                className="pi pi-times"
                style={{ color: 'red', border: '1px solid red', fontSize: '22px', borderRadius: '50%', padding: '5px', margin: '5px', cursor: 'pointer' }}
              ></i>
          </div>

          <section className="md:col-12 lg:col-12 mb-3">
            {photos.length > 0 ? (
                <ul>
                    {photos.map((photo: any, index: number) => (
                        <Image src={photo.imagePath} alt={`Photo ${index + 1}`} width="250" />
                    ))}
                </ul>
            ) : (
                <p className="text-center text-red-500 text-sm italic">No Data</p>
            )}
          </section>

          <Fieldset legend="Account Information" className="md:col-12 lg:col-12 mb-3">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Last Name:</strong> {lastname}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Phone:</strong> {phone}</p>
              <p><strong>Business:</strong> {business}</p>
              <p><strong>Position:</strong> {position}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Zip Code:</strong> {zipCode}</p>
              <p><strong>Tax Number:</strong> {taxNumber}</p>
          </Fieldset>

          <Fieldset legend="Authorization and Role" className="md:col-12 lg:col-12 mb-3">
              <p><strong>Authorized:</strong> {authorized ? 'Yes' : 'No'}</p>
              <p><strong>Role:</strong> {role || 'No data'}</p>
          </Fieldset>

          <Fieldset legend="Service Details" className="md:col-12 lg:col-12 mb-3">
              <p><strong>Allowed Service Types:</strong> {allowedServiceTypes || 'No data'}</p>
              <p><strong>Expiration:</strong> {expiration || 'No data'}</p>
          </Fieldset>
        </div>
      }

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
};

export default UserDetails;
