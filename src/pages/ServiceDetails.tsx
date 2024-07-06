import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetServiceDetailsById } from "../Services";
import ServiceDetails from "../components/ServiceDetails";

const UserDetails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState<any>();
  let { serviceId } = useParams<{ serviceId: string }>();

  useEffect(() => {
    // setLoading(true);

    // GetServiceDetailsById(Number(serviceId))
    // .then((res) => {
    //   setServiceDetails(res.data ?? []);
    // }).catch((error) => {
    //   console.error("Error fetching service details:", error);
    // }).finally(() => {
    //   setLoading(false);
    // });
  }, [serviceId]);

  const testData = {
    name: 'Liberty Hotels Lykia',
    location: 'Ölüdeniz, Fethiye',
    images: [
      'https://unicodetechnologies.in/assets/wp-content/themes/newave-theme/images/blog21.jpg',
      'https://unicodetechnologies.in/assets/wp-content/themes/newave-theme/images/blog21.jpg',
      'https://unicodetechnologies.in/assets/wp-content/themes/newave-theme/images/blog21.jpg',
      'https://unicodetechnologies.in/assets/wp-content/themes/newave-theme/images/blog21.jpg',
      'https://unicodetechnologies.in/assets/wp-content/themes/newave-theme/images/blog21.jpg'
    ],
    overview: 'Located Above Ortaköy, This Private Apartment Is Close To Everything...',
    facilities: 'The hotel offers various facilities...',
    prices: 'The price details are as follows...',
    reviews: 'No reviews available.',
    address: 'Ölüdeniz, Fethiye',
    pricePerNight: 199,
    dates: '07.05.2024 - 10.05.2024',
    guests: '2 Guests, 1 Room',
    totalFees: 627
  };

  return (
    <ServiceDetails loading={loading} serviceDetails={testData} />
  );
};

export default UserDetails;
