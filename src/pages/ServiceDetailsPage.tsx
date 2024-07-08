import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetAllCountries, GetAllProvinces, GetServiceDetailsById } from "../Services";
import ServiceDetails from "../components/ServiceDetails";

const ServiceDetailsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceDetails, setServiceDetails] = useState<any>();

  let { serviceId } = useParams<{ serviceId: string }>();

  const findCountry = (countries: any[], countryId?: number) => {
    return countries.find((country) => country.id === countryId);
  };

  const findProvince = (provinces: any[], provinceId?: number) => {
    return provinces.find((province) => province.id === provinceId);
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([
      GetServiceDetailsById(Number(serviceId)),
      GetAllCountries(),
      GetAllProvinces(),
    ]).then(([serviceDetailsRes, countriesRes, provincesRes]) => {
      setServiceDetails({
        name: serviceDetailsRes.data.name,
        location: `${findCountry(countriesRes.data, serviceDetailsRes.data.countryId)?.name ?? 'No Country'}, ${findProvince(provincesRes.data, serviceDetailsRes.data.provincyId)?.name ?? 'No Province'}`,
        images: serviceDetailsRes.data.photos,
        overview: serviceDetailsRes.data.description,
        facilities: serviceDetailsRes.data.serviceFacilities.flatMap((category: any) =>
          category.facilities
            .filter((facility: any) => facility.isPrimary)
            .map((facility: any) => { return <div className="m-2">- {facility.name}</div>})
        ),
        prices: serviceDetailsRes.data.price,
        reviews: '',
        address: `${findCountry(countriesRes.data, serviceDetailsRes.data.countryId)?.name ?? 'No Country'}, ${findProvince(provincesRes.data, serviceDetailsRes.data.provincyId)?.name ?? 'No Province'}`,
        pricePerNight: serviceDetailsRes.data.price,
        dates: '',
        guests: '',
        lat: serviceDetailsRes.data.lat,
        lng: serviceDetailsRes.data.lng,
        totalFees: serviceDetailsRes.data.price,
      });
    }).catch(error => {
      console.error('Error fetching data:', error);
    }).finally(() => {
      setLoading(false);
    });
  }, [serviceId]);

  return (
    <ServiceDetails loading={loading} serviceDetails={serviceDetails} />
  );
};

export default ServiceDetailsPage;
