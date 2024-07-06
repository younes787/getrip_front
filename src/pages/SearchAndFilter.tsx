import { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import SearchBar from "../components/SearchBar";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMapLocation, faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "primereact/checkbox";
import { GetCitiesbyid, GetCurrency, GetResidence, GetResidenceType } from "../Services";
import ServiceCard from "../components/ServiceCard";

const SearchAndFilter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [foundLenght, setFoundLenght] = useState<number>(519);
  const [selectedCountry, setSelectedCountry] = useState<string>('Fethiye');
  const [residenceType, setResidenceType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [currency, setCurrency] = useState<any>();
  const [residence, setResidence] = useState<any>();
  const [showAllCities, setShowAllCities] = useState(false);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      GetCitiesbyid(44),
      GetCurrency(),
      GetResidence(),
      GetResidenceType()
    ]).then(([citiesRes, currencyRes, residenceRes, residenceTypeRes]) => {
      setCities(citiesRes.data);
      setCurrency(currencyRes.data);
      setResidence(residenceRes.data);
      setResidenceType(residenceTypeRes.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const rangePrices = [
    { id: 'range1', label: '0 - 100' },
    { id: 'range2', label: '100 - 500' },
    { id: 'range3', label: '500 - 2000' },
    { id: 'range4', label: 'More than 2000' },
  ];

  const ratings = [
    { id: 'rating1', label: '1 star' },
    { id: 'rating2', label: '2 stars' },
    { id: 'rating3', label: '3 stars' },
    { id: 'rating4', label: '4 stars' },
    { id: 'rating5', label: '5 stars' },
    { id: 'rating5', label: 'Unrated' },
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

  return (
    <div className="container mx-auto px-12 search-and-filter">
     { loading ? <LoadingComponent/> : <div className="m-auto">
        <div id="image-container-filter-result" className="flex align-items-center section-one-search-and-filter">
          <SearchBar
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
                <Button rounded className="m-button mx-2" icon={<FontAwesomeIcon className="fa mr-2" icon={faArrowUpShortWide} size={"sm"} />}>Sort</Button>
                <Button rounded className="m-button mx-2" icon={<FontAwesomeIcon className="fa mr-2" icon={faFilter} size={"sm"} />}>Filters</Button>
                <Button rounded className="m-button mx-2" icon={<FontAwesomeIcon className="fa mr-2" icon={faMapLocation} size={"sm"} />}>Map</Button>
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
  );
};

export default SearchAndFilter;
