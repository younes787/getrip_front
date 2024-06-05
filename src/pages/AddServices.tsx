import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { GetAssignedServiceTypeByAccountId} from "../Services";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";

const AddServices = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const [serviceType, setServiceType] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetAssignedServiceTypeByAccountId(User?.data?.accountId).then((res) => setServiceType(res?.data));
  }, []);

  return (
    <>
      <div className="grid gap-12 grid-cols-12 text-center p-5">
          { serviceType.map((type) => (
            <Card
              title={type.name}
              className="md:col-4 lg:col-4 !border-0 getrip-shadow-none"
              footer={
                <Button
                  className="pr_btn border-none"
                  label="Choose"
                  severity="warning"
                  icon="pi pi-chevron-circle-right"
                  iconPos="right"
                  onClick={() => navigate('/form-use-type', { state: type })}
                />
              }
              header={
                <div className="getrip-card-image">
                  <img alt={type.name} src={type.photos[0].imagePath} />
                </div>
              }
            >
                <p className="m-0">{type.description}</p>
            </Card>
          ))}
      </div>
    </>
  );
};

export default AddServices;
