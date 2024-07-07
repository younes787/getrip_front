import { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import SearchBar from "../components/SearchBar";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation, faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "primereact/checkbox";
import { GetAllCountries, GetAllProvinces, GetCitiesbyid, GetCurrency, GetProvincebyCid, GetResidence, GetResidenceType } from "../Services";
import ServiceCard from "../components/ServiceCard";
import { Rating } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import GoogleMap from "../components/GoogleMap";

const SearchAndFilter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [foundLenght, setFoundLenght] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [residenceType, setResidenceType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [currency, setCurrency] = useState<any>();
  const [residence, setResidence] = useState<any>();
  const [showAllCities, setShowAllCities] = useState(false);
  const [showMapLocation, setShowMapLocation] = useState(false);
  const [selectedLocationFromMap, setSelectedLocationFromMap] = useState<{ lat: number; lng: number; address: any } | null>(null);
  const [selectedLocationFromSearch, setSelectedLocationFromSearch] = useState<{lat: number; lng: number; country: string; province: string} | null>(null);
  const [provinces, setProvinces] = useState<any>();
  const [countries, setCountries] = useState<any>();

  useEffect(() => {
    setLoading(true);

    Promise.all([
      GetAllCountries(),
      GetAllProvinces(),
      GetCurrency(),
      GetResidence(),
      GetResidenceType()
    ]).then(([countriesRes, provincesRes, currencyRes, residenceRes, residenceTypeRes]) => {
      setCountries(countriesRes.data);
      setProvinces(provincesRes.data);
      setCurrency(currencyRes.data);
      setResidence(residenceRes.data);
      setResidenceType(residenceTypeRes.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setSelectedCountry(`${selectedLocationFromSearch?.country}, ${selectedLocationFromSearch?.province}`);
  }, [selectedLocationFromSearch]);

  const rangePrices = [
    { id: '0', label: '0 - 100' },
    { id: '1', label: '100 - 500' },
    { id: '2', label: '500 - 2000' },
    { id: '3', label: 'More than 2000' },
  ];

  const dropDownSort = [
    { id: '0', label: 'Lowest price' },
    { id: '1', label: 'Highest price' },
    { id: '2', label: 'Best sellers' },
    { id: '3', label: 'Most reviewed' },
    { id: '4', label: 'Highest rated' },
    { id: '5', label: 'Discount rate' },
    { id: '6', label: 'Newly added' },
  ];

  const ratings = [
    { id: '1',  label: <Rating value={1}  readOnly  stars={1}  cancel={false} className="rat-icon-filter" />},
    { id: '2',  label: <Rating value={2}  readOnly  stars={2}  cancel={false} className="rat-icon-filter" />},
    { id: '3',  label: <Rating value={3}  readOnly  stars={3}  cancel={false} className="rat-icon-filter" />},
    { id: '4',  label: <Rating value={4}  readOnly  stars={4}  cancel={false} className="rat-icon-filter" />},
    { id: '5',  label: <Rating value={5}  readOnly  stars={5}  cancel={false} className="rat-icon-filter" />},
    { id: '6',  label: <Rating value={6}  readOnly  stars={6}  cancel={false} className="rat-icon-filter" />},
    { id: '7',  label: <Rating value={7}  readOnly  stars={7}  cancel={false} className="rat-icon-filter" />},
    { id: '8',  label: <Rating value={8}  readOnly  stars={8}  cancel={false} className="rat-icon-filter" />},
    { id: '9',  label: <Rating value={9}  readOnly  stars={9}  cancel={false} className="rat-icon-filter" />},
    { id: '10', label: <Rating value={10} readOnly  stars={10} cancel={false} className="rat-icon-filter" />},
    { id: '0',  label: 'Unrated' },
  ];

  const toggleShowAllCities = () => {
    setShowAllCities(!showAllCities);
  };

  const sampleService = {
    id: 8,
    name: 'Hotel Oludeniz',
    location: 'Oludeniz, Fethiye',
    pricePerNight: 274,
    amenities: ['Free Wi-Fi', 'Restaurant', 'Outdoor Swimming Pool', 'Bar', 'Air Conditioning'],
    rating: 4.5,
    numberOfReviews: 900,
    imageUrl: 'https://as2.ftcdn.net/v2/jpg/01/03/19/25/1000_F_103192538_F7yBInvL7o3D7DgkhU6UyjXI6L8w6RLB.jpg'
  };

  const handleLocationSelectFromMap = (location: { lat: number; lng: number; address: any }) => {
    setSelectedLocationFromMap(location);
  };

  const handleLocationSelectFromSearch = (location: {lat: number; lng: number; country: string; province: string}) => {
    setSelectedLocationFromSearch(location);
  };

  const markerData = [
    {
      lat: selectedLocationFromSearch?.lat ?? 0,
      lng: selectedLocationFromSearch?.lng ?? 0,
      text: `${selectedLocationFromSearch?.country}, ${selectedLocationFromSearch?.province}`
    },
  ] || [];

  const fetchCitiesByProvinceId = async (provinceId: number, setCities: (cities: any) => void) => {
    try {
      const res = await GetCitiesbyid(provinceId);
      setCities(res.data);
    } catch (error) {
      console.error('Error fetching cities: ', error);
    }
  };

  const fetchProvincesAndCitiesByCountryId = async (countryId: number, setCities: (cities: any) => void) => {
    try {
      const res = await GetProvincebyCid(countryId);
      if (res.data.length > 0 && res.data[0].id) {
        await fetchCitiesByProvinceId(res.data[0].id, setCities);
      }
    } catch (error) {
      console.error('Error fetching provinces and cities: ', error);
    }
  };

  const findCountry = (selectedCountry: string, countries: any[]) => {
    return countries.find((country) => country.name.toLowerCase() === selectedCountry.toLowerCase());
  };

  const findProvince = (selectedProvince: string, provinces: any[]) => {
    const searchProvinceLower = selectedProvince.substring(0, 8).toLowerCase();
    return provinces.find((province) => {
      const provinceNameLower = province.name.toLowerCase();
      return (
        provinceNameLower.substring(0, 4) === searchProvinceLower.substring(0, 4) ||
        provinceNameLower.substring(0, 5) === searchProvinceLower.substring(0, 5)
      );
    });
  };

  useEffect(() => {
    const { country, province } = selectedLocationFromSearch || {};

    if (country && countries && provinces) {
      const foundCountry = findCountry(country, countries);
      const foundProvince = province ? findProvince(province, provinces) : null;

      if (foundProvince && foundProvince.id) {
        fetchCitiesByProvinceId(foundProvince.id, setCities);
      } else if (foundCountry && foundCountry.id) {
        fetchProvincesAndCitiesByCountryId(foundCountry.id, setCities);
      }
    }
  }, [selectedLocationFromSearch, countries, provinces, setCities]);

  return (
    <>
    <div className="container mx-auto px-12 search-and-filter">
     { loading ? <LoadingComponent/> : <div className="m-auto">
        <div id="image-container-filter-result" className="flex align-items-center section-one-search-and-filter">
          <SearchBar
            onLocationSelect={handleLocationSelectFromSearch}
            SearchBarStyle={{
              width: '100%',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              padding: '15px 10px',
              margin: '10px 0',
              borderRadius: '2px'
            }}
          />
        </div>

        <div className="grid grid-cols-12 my-5 section-tow-search-and-filter">
          <div className="md:col-3 lg:col-3 sm:col-12 m-filter">
            <h2 className="px-2">Filters</h2>
            <div className="m-block-filters">
              <div className="resdins">
                <p style={{ color: '#000', fontSize: '18px' }}>Residence</p>
                <div className="options">
                  {residence && residence.length > 0 ? residence.map((item: any) => (
                    <div key={item.id} className="my-2 flex justify-content-between align-items-center">
                      <div className="checkbox">
                        <Checkbox
                          name={item.id}
                          checked={false}
                          // onChange={() => handleCheckboxChange(item.id)}
                        />
                        <label className="ml-2" htmlFor={item.id}>{item.name}</label>
                      </div>
                      <div className="number-filter">0</div>
                    </div>
                  )) : <span className="no-data">No Residence available</span>}
                </div>
              </div>

              <div className="resdins-type">
                <h4>Residence Type</h4>
                <div className="options">
                  {residenceType && residenceType.length > 0 ? residenceType.map((item: any) => (
                    <div key={item.id} className="my-2 flex justify-content-between align-items-center">
                      <div className="checkbox">
                        <Checkbox
                          name={item.id}
                          checked={false}
                          // onChange={() => handleCheckboxChange(item.id)}
                        />
                        <label className="ml-2" htmlFor={item.id}>{item.name}</label>
                      </div>
                      <div className="number-filter">0</div>
                    </div>
                  )) : <span className="no-data">No Residence Type available</span>}
                </div>
              </div>

              <div className="city">
                <h4>City</h4>
                <div className="options">
                {cities && cities.length > 0 ? (
                  <>
                    {cities.slice(0, showAllCities ? cities.length : 7).map((item: any) => (
                      <div key={item.id} className="my-2 flex justify-content-between align-items-center">
                        <div className="checkbox">
                          <Checkbox
                            name={`city-${item.id}`}
                            checked={false}
                            // onChange={() => handleCheckboxChange(`city-${item.id}`)}
                          />
                          <label className="ml-2" htmlFor={`city-${item.id}`}>{item.name}</label>
                        </div>
                        <div className="number-filter">0</div>
                      </div>
                    ))}
                    {cities.length > 7 && (
                      <button className="show-more-btn" onClick={toggleShowAllCities}>
                        {showAllCities ? 'Show Less' : `Show More (${cities.length - 7} more)`}
                      </button>
                    )}
                  </>
                ) : (
                  <span className="no-data">No cities available</span>
                )}
                </div>
              </div>

              <div className="rang-price">
                <h4>Range Price</h4>
                <div className="options">
                 {rangePrices.map((range) => (
                  <div key={range.id} className="my-2 flex justify-content-between align-items-center">
                    <div className="checkbox">
                      <Checkbox
                        name={range.id}
                        checked={false}
                        // onChange={() => handleCheckboxChange(range.id)}
                      />
                      <label className="ml-2" htmlFor={range.id}>{range.label}</label>
                    </div>
                      <div className="number-filter">0</div>
                  </div>
                ))}
                </div>
              </div>

              <div className="rating">
                <h4>Rating</h4>
                <div className="options">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="my-2 flex justify-content-between align-items-center">
                      <div className="checkbox">
                        <Checkbox
                          name={rating.id}
                          checked={false}
                          // onChange={() => handleCheckboxChange(rating.id)}
                        />
                        <label className="ml-2" htmlFor={rating.id}>{rating.label}</label>
                      </div>
                      <div className="number-filter">0</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="currency">
                <h4>Currency</h4>
                <div className="options">
                  {currency && currency.length > 0 ?  currency.map((item: any) => (
                    <div key={item.id} className="my-2 flex justify-content-between align-items-center">
                      <div className="checkbox">
                        <Checkbox
                          name={item.id}
                          checked={false}
                          // onChange={() => handleCheckboxChange(item.id)}
                        />
                        <label className="ml-2" htmlFor={item.id}>{item.name}</label>
                      </div>
                      <div className="number-filter">0</div>
                    </div>
                  )) : <span className="no-data">No Currency available</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-9 lg:col-9 sm:col-12 px-3">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <p className="m-p-filter-result">{selectedCountry}: {foundLenght} properties found</p>

              <div className="actions">
                <Dropdown
                  placeholder="Sort"
                  options={dropDownSort}
                  optionLabel="label"
                  optionValue="id"
                  className="m-button m-button-sort"
                  style={{
                    padding: '0',
                    borderRadius: '2rem',
                    flexDirection: 'row-reverse'
                  }}
                  dropdownIcon={<FontAwesomeIcon className="fa mr-2" icon={faArrowUpShortWide} size={"sm"} />}
                />

                <Button
                rounded
                className="m-button mx-2"
                icon={
                  <FontAwesomeIcon
                    className="fa mr-2"
                    icon={faMapLocation}
                    size={"sm"}
                  />
                }
                onClick={() => setShowMapLocation(true)}
                >Map</Button>
              </div>
            </div>

            <div className="service-card-content">
              <ServiceCard service={sampleService} ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}} />
              <ServiceCard service={sampleService} ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}} />
              <ServiceCard service={sampleService} ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}} />
              <ServiceCard service={sampleService} ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}} />
              <ServiceCard service={sampleService} ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}} />
            </div>
          </div>
        </div>
      </div>}
    </div>

    <Dialog
      header="Map Location"
      visible={showMapLocation}
      style={{
        minWidth: '70%',
        minHeight: '70%',
        padding: '0',
        margin: '0',
        backgroundColor: 'transparent'
      }}
      footer={<div>
        <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowMapLocation(false)} className="mt-4"></Button>
      </div>}
      onHide={() => setShowMapLocation(false)}
    >
      <GoogleMap
        markerData={markerData}
        // country={
        //   (Serviceform.values.countryId && countries.find((er: any) => er.id === Serviceform.values.countryId))
        //     ? countries.find((er: any) => er.id === Serviceform.values.countryId).name
        //     : undefined
        // }
        // province={
        //   (Serviceform.values.provincyId && provinces.find((er: any) => er.id === Serviceform.values.provincyId))
        //     ? provinces.find((er: any) => er.id === Serviceform.values.provincyId).name
        //     : undefined
        // }
        // city={
        //   (Serviceform.values.cityId && cities.find((er: any) => er.id === Serviceform.values.cityId))
        //     ? cities.find((er: any) => er.id === Serviceform.values.cityId).name
        //     : undefined
        // }
        onLocationSelect={handleLocationSelectFromMap}
      />
    </Dialog>
  </>
  );
};

export default SearchAndFilter;
