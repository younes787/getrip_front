import React, { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import SearchBar from "../components/SearchBar";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation, faArrowUpShortWide, faForward, faBackward, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "primereact/checkbox";
import { GetAllCountries, GetAllProvinces, GetCitiesbyid, GetCurrency, GetNearByRestaurants, GetPaginatedServices, GetProvincebyCid, GetResidence, GetResidenceType } from "../Services";
import ServiceCard from "../components/ServiceCard";
import { Rating } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import GoogleMap from "../components/GoogleMap";
import { Flight, Hotel, LocationFromMap, LocationFromSearch, QueryFilter, Restaurant, Service, SidebarFilter } from "../modules/getrip.modules";
import { Paginator } from "primereact/paginator";
import { mapHotelData, mapFlightData, mapRestaurantData, mapServiceData } from "../utils/mapData";
import { DataType } from "../enums";
import { ProviderAuthenticationservice, ProviderServiceTourVisio } from "../Services/providerRequests";

const SearchAndFilter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cardTypeLoading, setCardTypeLoading] = useState<boolean>(false);
  const [foundLenght, setFoundLenght] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [residenceType, setResidenceType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [cardType, setCardType] = useState<DataType>();
  const [currency, setCurrency] = useState<any>();
  const [residence, setResidence] = useState<any>();
  const [showAllCities, setShowAllCities] = useState(false);
  const [showMapLocation, setShowMapLocation] = useState(false);
  const [selectedLocationFromMap, setSelectedLocationFromMap] = useState<LocationFromMap | null>(null);
  const [selectedLocationFromSearch, setSelectedLocationFromSearch] = useState<LocationFromSearch | null>(null);
  const [selectFilterData, setSelectFilterData] = useState<QueryFilter | null>(null);
  const [provinces, setProvinces] = useState<any>();
  const [countries, setCountries] = useState<any>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [selectedItems, setSelectedItems] = useState<{
    residenceType: any[],
    residence: any[],
    city: any[],
    rangePrice: any[],
    rating: any[],
    currency: any[]
  }>({
    residenceType: [],
    residence: [],
    city: [],
    rangePrice: [],
    rating: [],
    currency: []
  });

 const handleCheckboxChange = (category: any, item: any) => {
    setSelectedItems((prevState: any) => {
      const isSelected = prevState[category]?.some((selectedItem: any) => selectedItem.id === item.id);
      const updatedCategory = isSelected
        ? prevState[category].filter((selectedItem: any) => selectedItem.id !== item.id)
        : [...prevState[category], item];

      return {
        ...prevState,
        [category]: updatedCategory
      };
    });
  };

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
    { id: 0, label: '0 - 100' },
    { id: 1, label: '100 - 500' },
    { id: 2, label: '500 - 2000' },
    { id: 3, label: 'More than 2000' },
  ];

  const dropDownSort = [
    { id: 0, label: 'Lowest price' },
    { id: 1, label: 'Highest price' },
    { id: 2, label: 'Best sellers' },
    { id: 3, label: 'Most reviewed' },
    { id: 4, label: 'Highest rated' },
    { id: 5, label: 'Discount rate' },
    { id: 6, label: 'Newly added' },
  ];

  const ratings = [
    { id: 1,  label: <Rating value={1}  readOnly  stars={1}  cancel={false} className="rat-icon-filter" />},
    { id: 2,  label: <Rating value={2}  readOnly  stars={2}  cancel={false} className="rat-icon-filter" />},
    { id: 3,  label: <Rating value={3}  readOnly  stars={3}  cancel={false} className="rat-icon-filter" />},
    { id: 4,  label: <Rating value={4}  readOnly  stars={4}  cancel={false} className="rat-icon-filter" />},
    { id: 5,  label: <Rating value={5}  readOnly  stars={5}  cancel={false} className="rat-icon-filter" />},
    { id: 6,  label: <Rating value={6}  readOnly  stars={6}  cancel={false} className="rat-icon-filter" />},
    { id: 7,  label: <Rating value={7}  readOnly  stars={7}  cancel={false} className="rat-icon-filter" />},
    { id: 8,  label: <Rating value={8}  readOnly  stars={8}  cancel={false} className="rat-icon-filter" />},
    { id: 9,  label: <Rating value={9}  readOnly  stars={9}  cancel={false} className="rat-icon-filter" />},
    { id: 10, label: <Rating value={10} readOnly  stars={10} cancel={false} className="rat-icon-filter" />},
    { id: 0,  label: 'Unrated' },
  ];

  const toggleShowAllCities = () => {
    setShowAllCities(!showAllCities);
  };

  const formatDate = (date: any) => {
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
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

  const findCountry = (countries: any[], selectedCountry?: string, countryId?: number) => {
    if(selectedCountry) {
      return countries.find((country) => country.name.toLowerCase() === selectedCountry.toLowerCase());
    } else {
      return countries.find((country) => country.id === countryId);
    }
  };

  const findProvince = (provinces: any[], selectedProvince?: string, provinceId?: number) => {
    if(selectedProvince) {
      const searchProvinceLower = selectedProvince.substring(0, 8).toLowerCase();
      return provinces.find((province) => {
        const provinceNameLower = province.name.toLowerCase();
        return (
          provinceNameLower.substring(0, 4) === searchProvinceLower.substring(0, 4) ||
          provinceNameLower.substring(0, 5) === searchProvinceLower.substring(0, 5)
        );
      });
    } else {
      return provinces.find((province) => province.id === provinceId);
    }
  };

  useEffect(() => {
    const { country, province } = selectedLocationFromSearch || {};

    if (country && countries && provinces) {
      const foundCountry = findCountry(countries, country);
      const foundProvince = province ? findProvince(provinces, province) : null;

      if (foundProvince && foundProvince.id) {
        fetchCitiesByProvinceId(foundProvince.id, setCities);
      } else if (foundCountry && foundCountry.id) {
        fetchProvincesAndCitiesByCountryId(foundCountry.id, setCities);
      }
    }
  }, [selectedLocationFromSearch, countries, provinces, setCities]);

  const onPageChange = (event: any) => {
    setPageNumber(event.page + 1);
    setPageSize(event.rows);
  };

  useEffect(() => {
    setSelectFilterData((prevState: any) => ({
      ...prevState,
      sidebarFilter: selectedItems
    }));
  }, [selectedItems]);

  const CheckboxList = ({ title, category, items, selectedItems }: any) => (
    <div className={category}>
      <h4>{title}</h4>
      <div className="options">
        {items && items.length > 0 ? items.map((item: any, index: number) => (
          <div key={item.id} className="my-2 flex justify-content-between align-items-center">
            <div className="checkbox">
              <Checkbox
                name={`${item}-${index}`}
                checked={selectedItems.some((selectedItem: any) => selectedItem.id === item.id)}
                onChange={() => handleCheckboxChange(category, item)}
              />
              <label className="ml-2" htmlFor={item.id}>{item.name || item.label}</label>
            </div>
            <div className="number-filter">0</div>
          </div>
        )) : <span className="no-data">No {title.toLowerCase()} available</span>}
      </div>
    </div>
  );

  const fetchDataToCard = async () => {
    const queryParts: string[] = [];
    const {
      address,
      startDate,
      endDate,
      selectdTab,
      selectedFields,
      sidebarFilter,
      arrivalCity,
      departureDate,
      guests,
      departureCity,
      returnDate,
      flightServiceType
    } = selectFilterData || {};

    const addQueryPart = (key: string, value: string | string[]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParts.push(`${key}=${value.map(encodeURIComponent).join(',')}`);
        }
      } else if (value) {
        queryParts.push(`${key}=${encodeURIComponent(value)}`);
      }
    };

    if (selectdTab) {
      setFoundLenght(0);
      setHotels([]);
      setFlights([]);
      setRestaurants([]);
      setServices([]);

      setCardTypeLoading(true);

      switch (selectdTab.children[1]) {
        case DataType.Hotel:
        case 'Hotels':
          if (guests) addQueryPart('guests', guests.toString() ?? '1');
          const HotelsPersistenceUrl = 'productservice/getarrivalautocomplete';
          const HotelsQuery = {
            ProductType: 2,
            Query: typeof address?.name === 'string' ? address?.name : address?.name?.countryName,
            Culture: 'en-US',
          };

          ProviderAuthenticationservice()
          .then((res) => {
            ProviderServiceTourVisio(HotelsPersistenceUrl, HotelsQuery, res)
            .then((resPro) => {
              setCardTypeLoading(false);
              if(resPro?.data?.body?.items) {

                console.log(resPro?.data);

                // ProviderServiceTourVisio(
                //   'productservice/pricesearch', {
                //     checkAllotment: true,
                //     checkStopSale: true,
                //     getOnlyDiscountedPrice: false,
                //     getOnlyBestOffers:  true,
                //     productType: 2,
                //     arrivalLocations: [
                //         {
                //           id: resProductInfo?.city?.id,
                //           type: 2
                //       }
                //     ],
                //     roomCriteria: [
                //       {
                //           adult: 2,
                //           childAges: [
                //             2,
                //             5
                //           ]
                //       },
                //       {
                //           adult: 1,
                //           childAges: [
                //             3
                //           ]
                //       }
                //     ],
                //     nationality: "DE",
                //     checkIn: new Date(),
                //     night: 7,
                //     currency: "EUR",
                //     culture: "en-US"
                //   }, token
                // )
                // .then((resPriceSearch: any) => {
                //   console.log(resPriceSearch, 'resPriceSearch');
                // });

                setCardType(DataType.Hotel);
                setFoundLenght(resPro?.data?.body?.items.length);
                setHotels(mapHotelData(resPro));
              }
            });
          });
          break;
        case  DataType.Flight:
        case 'Flight':
          if (departureDate) addQueryPart('departure_date', formatDate(departureDate));
          if (arrivalCity) addQueryPart('arrival_city', arrivalCity);
          if (departureCity) addQueryPart('departure_city', departureCity);
          if (returnDate) addQueryPart('return_date', formatDate(returnDate));
          if (flightServiceType) addQueryPart('flight_service_type', formatDate(flightServiceType));

          const FlightPersistenceUrl = 'productservice/getdepartureautocomplete';
          const FlightQuery = {
            ProductType: 3,
            Query: typeof address?.name === 'string' ? address?.name : address?.name?.countryName,
            ServiceType: flightServiceType,
            DepartureLocations: [{
                Id: departureCity,
                Type: 5
            }],
            ArrivalLocations: [{
                Id: arrivalCity,
                Type: 5
            }],
            Culture: 'en-US',
          };

          ProviderAuthenticationservice()
          .then((res) => {
            ProviderServiceTourVisio(FlightPersistenceUrl, FlightQuery, res)
            .then((resPro) => {
              setCardTypeLoading(false);
              if(resPro?.data?.body?.items) {
                setCardType(DataType.Flight);
                setFoundLenght(resPro?.data?.body?.items.length);
                setFlights(mapFlightData(resPro));
              }
            });
          });
          break;
        case  DataType.Restaurant:
        case 'Restaurants':
          if (selectedLocationFromSearch?.lat && selectedLocationFromSearch?.lng) {
            let query = `?latitude=${selectedLocationFromSearch.lat}&longitude=${selectedLocationFromSearch.lng}&radius=5000&type=restaurant|cafe`;

            if (nextPageToken) { query += `&nextPageToken=${nextPageToken}`; }

            GetNearByRestaurants(query)
            .then((resRes) => {
              setCardTypeLoading(false);
              if(resRes.data.next_page_token) {
                setNextPageToken(resRes.data.next_page_token);
              } else {
                setNextPageToken(null);
              }
              setCardType(DataType.Restaurant);
              setFoundLenght(resRes.data.results.length);
              setRestaurants(mapRestaurantData(resRes));
            });
          }
          break;
        default: // case  DataType.Service:
          if (address?.name) addQueryPart('address', address.name.name ?? address.name);
          if (startDate) addQueryPart('start_date', formatDate(startDate));
          if (endDate) addQueryPart('end_date', formatDate(endDate));
          if (selectdTab) addQueryPart('tab', selectdTab.children[1]);

          if (selectedFields?.length) {
            addQueryPart('fields', selectedFields.map((field: any) => field.id));
          }

          if (sidebarFilter) {
            Object.keys(sidebarFilter).forEach((key) => {
              addQueryPart(
                `sidebar_filter[${key}]`,
                sidebarFilter[key as keyof SidebarFilter]?.map((item: any) => (key === 'rating' ? item.label.props.stars : item.id)) || []
              );
            });
          }

          GetPaginatedServices(pageNumber, pageSize, queryParts.join('&'))
          .then((resSer) => {
            setCardTypeLoading(false);
            setCardType(DataType.Service);
            setFoundLenght(resSer.data?.totalItems);
            setServices(mapServiceData(resSer));
          });
          break;
      }
    }
  };

  useEffect(() => {
    fetchDataToCard();
  }, [pageNumber, pageSize, selectFilterData]);

  return (<>
    <div className="container mx-auto px-12 search-and-filter">
     { loading ? <LoadingComponent/> : <div className="m-auto">
        <div id="image-container-filter-result" className="flex align-items-center section-one-search-and-filter">
          <SearchBar
            onLocationSelect={(location: LocationFromSearch) => setSelectedLocationFromSearch(location) }
            onSelectFilterData={(_filterData: QueryFilter) =>  setSelectFilterData(_filterData) }
            SearchBarStyle={{width: '100%',border: '1px solid #ddd',backgroundColor: '#fff',padding: '15px 10px',margin: '10px 0',borderRadius: '2px'}}
          />
        </div>

        <div className="grid grid-cols-12 my-5 section-tow-search-and-filter">
          <div className="md:col-3 lg:col-3 sm:col-12 m-filter">
            <h2 className="px-2">Filters</h2>
            <div className="m-block-filters">
              <CheckboxList
                title="Residence"
                category="residence"
                items={residence}
                selectedItems={selectedItems.residence}
              />

              <CheckboxList
                title="Residence Type"
                category="residenceType"
                items={residenceType}
                selectedItems={selectedItems.residenceType}
              />

              <CheckboxList
                title="City"
                category="city"
                items={cities && cities.length > 0 ? cities.slice(0, showAllCities ? cities.length : 7) : []}
                selectedItems={selectedItems.city}
              />
              {cities && cities.length > 7 && (
                <button className="show-more-btn" onClick={toggleShowAllCities}>
                  {showAllCities ? 'Show Less' : `Show More (${cities.length - 7} more)`}
                </button>
              )}

              <CheckboxList
                title="Range Price"
                category="rangePrice"
                items={rangePrices}
                selectedItems={selectedItems.rangePrice}
              />

              <CheckboxList
                title="Rating"
                category="rating"
                items={ratings}
                selectedItems={selectedItems.rating}
              />

              <CheckboxList
                title="Currency"
                category="currency"
                items={currency}
                selectedItems={selectedItems.currency}
              />
            </div>
          </div>

          <div className="md:col-9 lg:col-9 sm:col-12 px-3">
            <b className="p-button p-component p-button-outlined p-button-danger">{ cardType }</b>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <p className="m-p-filter-result">{selectedCountry}: ({foundLenght}) properties found</p>
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
                >
                  Map
                </Button>
              </div>
            </div>

            <div className="service-card-content">
              { cardType === DataType.Hotel && hotels.length > 0 ? (
                  hotels.map(hotel => (
                    <ServiceCard
                      key={hotel.hotel.id}
                      service={hotel}
                      ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}}
                      type={DataType.Hotel}
                    />
                  ))
              ) : cardType === DataType.Flight && flights.length > 0 ? (
                flights.map(flight => (
                  <ServiceCard
                    key={flight.geolocation.longitude}
                    service={flight}
                    ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}}
                    type={DataType.Flight}
                  />
                ))
              ) : cardType === DataType.Restaurant && restaurants.length > 0 ? (
                restaurants.map(restaurant => (
                  <ServiceCard
                    key={restaurant.place_id}
                    service={restaurant}
                    ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}}
                    type={DataType.Restaurant}
                  />
                ))
              ) : cardType === DataType.Service && services.length > 0 ? (
                services.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}}
                    type={DataType.Service}
                  />
                ))
              ) : (<>
              {cardTypeLoading ?
                <p className="text-center text-red-500 text-lg italic p-5 relative">
                  <div className="spinner mx-2" style={{ width: '80px', height: '80px'}}></div>
                  <div className="absolute" style={{top: '50%', left: '50%', transform: 'translate(-17px, -23px)'}}>
                    <FontAwesomeIcon className="mr-2" style={{color: '#4a235a', fontSize: '2.5rem'}} icon={faDatabase} />
                  </div>
                </p>
              : <span>no data </span>}
              </>)}

              { cardType === DataType.Hotel && hotels.length > 0 ? (
                <></>
              ) : cardType === DataType.Flight && flights.length > 0 ? (
                <></>
              ) : cardType === DataType.Restaurant && restaurants.length > 0 ? (
                <div className="flex justify-content-center align-items-center w-full">
                  <Button
                    raised
                    className="mx-2 py-2"
                    severity="info"
                    iconPos="right"
                    visible={nextPageToken == null ? true : false}
                    icon={<FontAwesomeIcon className="mr-2" icon={faBackward} size={"sm"} />}
                    onClick={fetchDataToCard}
                  >
                    Priv
                  </Button>

                  <Button
                    raised
                    className="mx-2 py-2"
                    severity="info"
                    iconPos="left"
                    visible={nextPageToken !== null ? true : false}
                    icon={<FontAwesomeIcon className="mr-2" icon={faForward} size={"sm"} />}
                    onClick={fetchDataToCard}
                  >
                    Next
                  </Button>
                </div>
              ) : cardType === DataType.Service && services.length > 0 ? (
                <Paginator first={pageNumber} rows={pageSize} totalRecords={foundLenght} rowsPerPageOptions={[5, 10, 20, 30]} onPageChange={onPageChange} />
              ) : null}
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
        // country={}
        // province={}
        // city={}
        onLocationSelect={(location: LocationFromMap) => { setSelectedLocationFromMap(location) }}
      />
    </Dialog>
  </>);
};

export default SearchAndFilter;
