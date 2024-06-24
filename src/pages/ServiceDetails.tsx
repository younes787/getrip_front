import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetServiceDetailsById } from "../Services";
import ServiceDetailsDialog from "../components/ServiceDetailsDialog";

const UserDetails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState<any>();
  let { serviceId } = useParams<{ serviceId: string }>();

  useEffect(() => {
    setLoading(true);

    GetServiceDetailsById(Number(serviceId))
    .then((res) => {
      setServiceDetails(res.data ?? []);
    }).catch((error) => {
      console.error("Error fetching service details:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [serviceId]);

  return (
    <ServiceDetailsDialog loading={loading} serviceDetails={serviceDetails} />
  );
};

export default UserDetails;
