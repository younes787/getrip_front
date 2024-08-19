import React, { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import SearchBar from "../components/SearchBar";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation, faArrowUpShortWide, faForward, faBackward, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "primereact/checkbox";
import { GetAllCountries, GetAllMakers, GetAllPlaces, GetAllProvinces, GetAllVehicles, GetAllVehiclesTypes, GetCitiesbyid, GetCurrency, GetFeildsbysid, GetNearByRestaurants, GetPaginatedServicesBySearchFilter, GetProvincebyCid, GetResidenceType, GetServiceTypes } from "../Services";
import ServiceCard from "../components/ServiceCard";
import { Rating } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import GoogleMap from "../components/GoogleMap";
import { Flight, Hotel, LocationFromMap, LocationFromSearch, QueryFilter, Restaurant, SearchFilterParams, Service, SidebarFilter } from "../modules/getrip.modules";
import { Paginator } from "primereact/paginator";
import { mapFlightData, mapHotelData, mapRestaurantData, mapServiceData } from "../utils/mapData";
import { DataType } from "../enums";
import { ProviderAuthenticationservice, ProviderInitializeMapCenter, ProviderServiceTourVisio } from "../Services/providerRequests";
import { Slider } from "primereact/slider";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { Image } from 'primereact/image';
import Search7526301 from '../Assets/search_7526301.png';

const SearchAndFilter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cardTypeLoading, setCardTypeLoading] = useState<boolean>(false);
  const [showFields, setShowFields] = useState<boolean>(false);
  const [showVehicles, setShowVehicles] = useState<boolean>(false);
  const [showResidenceType, setShowResidenceType] = useState<boolean>(false);
  const [foundLenght, setFoundLenght] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [residenceType, setResidenceType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [fields, setFields] = useState<any>();
  const [services, setServices] = useState<Service[]>([]);
  const [cardType, setCardType] = useState<DataType>();
  const [currency, setCurrency] = useState<any>();
  const [showAllCities, setShowAllCities] = useState(false);
  const [showMapLocation, setShowMapLocation] = useState(false);
  const [selectedLocationFromMap, setSelectedLocationFromMap] = useState<LocationFromMap | null>(null);
  const [selectedLocationFromSearch, setSelectedLocationFromSearch] = useState<LocationFromSearch>(() => {
    const storedLocation = localStorage.getItem('selectedLocation');
    return storedLocation ? JSON.parse(storedLocation) : { name: '', country: '', province: '' };
  });
  const [localStorageAddressData, setLocalStorageAddressData] = useState<any>((() => {
      const item = localStorage.getItem('addressData');
      return item ? JSON.parse(item) : undefined;
    })()
  );
  const [markerData, setMarkerData] = useState<{lat: any, lng: any, text: any}[]>([]);
  const [selectFilterData, setSelectFilterData] = useState<QueryFilter | null>(null);
  const [provinces, setProvinces] = useState<any>();
  const [countries, setCountries] = useState<any>();
  const [hotelSearchId, setHotelSearchId] = useState<any>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState(5);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [vehicles, setVehicles] = useState<any>();
  const [vehicleTypes, setVehicleTypes] = useState<any>();
  const [places, setPlaces] = useState<any>();
  const [makers, setMakers] = useState<any>();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SidebarFilter>({
    residence_type: [],
    vehicles: [],
    vehicleTypes: [],
    places: [],
    makers: [],
    fields: [],
    city: [],
    minMaxPrice: [0, 5000],
    ratings: 2,
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

  const handleSliderChange = (e: any) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      minMaxPrice: e.value
    }));
  };

  const handleInputChange = (value: number, index: number) => {
    const newMinMaxPrice = [...selectedItems.minMaxPrice];
    newMinMaxPrice[index] = value;

    setSelectedItems((prevState) => ({
      ...prevState,
      minMaxPrice: newMinMaxPrice
    }));
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([
      GetAllCountries(),
      GetAllProvinces(),
      GetCurrency(),
      GetResidenceType(),
      GetAllPlaces(),
      GetAllMakers(),
    ]).then(([countriesRes, provincesRes, currencyRes, residenceTypeRes, palcesRes, makersRes]) => {
      setCountries(countriesRes.data);
      setProvinces(provincesRes.data);
      setCurrency(currencyRes.data);
      setResidenceType(residenceTypeRes.data);
      setPlaces(palcesRes.data);
      setMakers(makersRes.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedLocationFromSearch) {
      if (selectedLocationFromSearch?.country && selectedLocationFromSearch?.province) {
        setSelectedCountry(`${selectedLocationFromSearch.country}, ${selectedLocationFromSearch.province}`);
      } else if (selectedLocationFromSearch.name || selectedLocationFromSearch.moreData) {
        if (selectedLocationFromSearch?.name?.countryName && selectedLocationFromSearch?.name?.provinceName) {
          setSelectedCountry(`${selectedLocationFromSearch.name.countryName}, ${selectedLocationFromSearch.name.provinceName}`);
        } else if(selectedLocationFromSearch.moreData) {
          setSelectedCountry(`${selectedLocationFromSearch.moreData.countryName}, ${selectedLocationFromSearch.moreData.provinceName}`);
        } else {
          setSelectedCountry(selectedLocationFromSearch.name);
        }
      } else {
        setSelectedCountry('');
      }
    } else {
      setSelectedCountry('');
    }
  }, [selectedLocationFromSearch]);

  const dropDownSort = [
    { id: 0, label: 'Lowest price' },
    { id: 1, label: 'Highest price' },
    { id: 2, label: 'Best sellers' },
    { id: 3, label: 'Most reviewed' },
    { id: 4, label: 'Highest rated' },
    { id: 5, label: 'Discount rate' },
    { id: 6, label: 'Newly added' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      return provinces?.find((province) => {
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
    const { country, province, lat, lng, moreData } = selectedLocationFromSearch || {};

    if (country && countries && provinces) {
      const foundCountry = findCountry(countries, country);
      const foundProvince = province ? findProvince(provinces, province) : null;

      if (foundProvince && foundProvince.id) {
        fetchCitiesByProvinceId(foundProvince.id, setCities);
      } else if (foundCountry && foundCountry.id) {
        fetchProvincesAndCitiesByCountryId(foundCountry.id, setCities);
      } else if(moreData) {
        fetchCitiesByProvinceId(moreData.provinceId, setCities);
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
            {/* <div className="number-filter">0</div> */}
          </div>
        )) : <span className="no-data">No {title.toLowerCase()} available</span>}
      </div>
    </div>
  );

  const fetchDataToCard = async () => {
    if (selectFilterData?.selectedTab) {
      const { province, moreData } = selectedLocationFromSearch || {};
      const foundProvince = province ? findProvince(provinces, province) : null;

      let provId;
      if(foundProvince?.id) {
        provId = foundProvince?.id;
      } else if(moreData?.provinceId) {
        provId = moreData?.provinceId;
      } else if(localStorageAddressData && localStorageAddressData[0]?.provinceId) {
        provId = localStorageAddressData[0]?.provinceId;
      } else {
        provId = 0;
      }

      const queryParts: SearchFilterParams = {
        ProvinceId: provId,
        CityIds: selectFilterData?.sidebarFilter?.city?.map((res) => res.id),
        ResidenceTypeIds: selectFilterData?.sidebarFilter?.residence_type?.map((res) => res.id),
        VehicleTypeIds: selectFilterData?.sidebarFilter?.vehicleTypes?.map((res) => res.id),
        MakerIds: selectFilterData?.sidebarFilter?.makers?.map((res) => res.id),
        VehicleIds: selectFilterData?.sidebarFilter?.vehicles?.map((res) => res.id),
        PlaceIds: selectFilterData?.sidebarFilter?.places?.map((res) => res.id),
        CurrencyIds: selectFilterData?.sidebarFilter?.currency?.map((res) => res.id),
        StartDate: formatDate(selectFilterData?.startDate),
        EndDate: formatDate(selectFilterData?.endDate),
        AdultPassengers: selectFilterData?.guests,
        ChildPassengers: selectFilterData?.children,
        MinAmount: selectFilterData?.sidebarFilter?.minMaxPrice[0] ?? 0,
        MaxAmount: selectFilterData?.sidebarFilter?.minMaxPrice[1] ?? 0,
        MaxRating: selectFilterData?.sidebarFilter?.ratings ?? 0,
        MinRating: 0,
      };

      setFoundLenght(0);
      setHotels([]);
      setFlights([]);
      setRestaurants([]);
      setServices([]);
      setCardTypeLoading(true);

      switch ((selectFilterData.selectedTab as string).trim().replace(/['"]+/g, '')) {
        case DataType.Hotel:
        case 'Hotels':
          setCardType(DataType.Hotel);
          ProviderAuthenticationservice()
          .then((tokenRes) => {
            ProviderServiceTourVisio('productservice/getarrivalautocomplete', {
            ProductType: 2,
            Query: typeof selectFilterData?.address?.name === 'string' ? selectFilterData?.address?.name : selectFilterData?.address?.name?.countryName,
            Culture: 'en-US',
          }, tokenRes)
            .then((resPro) => {
              if(resPro?.data?.body?.items) {
                ProviderServiceTourVisio('productservice/pricesearch', {
                  checkAllotment: true,
                  checkStopSale: true,
                  getOnlyDiscountedPrice: false,
                  getOnlyBestOffers:  true,
                  productType: 2,
                  arrivalLocations: [
                      {
                        id: resPro?.data?.body?.items[0]?.city?.id,
                        type: 2
                      }
                  ],
                  roomCriteria: [
                    {
                        adult: 2,
                        childAges: [
                          2,
                          5
                        ]
                    },
                    {
                        adult: 1,
                        childAges: [
                          3
                        ]
                    }
                  ],
                  nationality: "DE",
                  checkIn: formatDate(selectFilterData?.startDate),
                  night: 1,
                  currency: "USD",
                  culture: "en-US"
                }, tokenRes)
                .then((resPriceSearch: any) => {
                  setCardTypeLoading(false);
                  if (resPriceSearch?.data?.body?.hotels) {
                    setHotelSearchId(resPriceSearch.data.body.searchId);
                    setFoundLenght(resPriceSearch.data.body.hotels.length);
                    setHotels(mapHotelData(resPriceSearch));
                  }
                });
              }
            });
          });
          break;
        case  DataType.Flight:
        case 'Flight':
          setCardType(DataType.Flight);
          ProviderAuthenticationservice()
          .then((tokenRes) => {
            ProviderServiceTourVisio('productservice/getdepartureautocomplete', {
              ProductType: 3,
              Query: typeof selectFilterData?.address?.name === 'string' ? selectFilterData?.address?.name : selectFilterData?.address?.name?.countryName,
              ServiceType: selectFilterData?.flightServiceType,
              Culture: 'en-US',
            }, tokenRes).then((resDepartureAutoComplete) => {
              setCardTypeLoading(false);
              if(resDepartureAutoComplete?.data?.body?.items) {
                setFoundLenght(resDepartureAutoComplete?.data?.body?.items.length);
                setFlights(mapFlightData(resDepartureAutoComplete));
              }
            });

            // ProviderServiceTourVisio('productservice/getarrivalautocomplete', {
            //   ProductType: 3,
            //   Query: typeof selectFilterData?.address?.name === 'string' ? selectFilterData?.address?.name : selectFilterData?.address?.name?.countryName,
            //   ServiceType: selectFilterData?.flightServiceType,
            //   DepartureLocations: [{
            //       Id: selectFilterData?.departureCity,
            //       Type: 5
            //   }],
            //   // ArrivalLocations: [{
            //   //     Id: selectFilterData?.arrivalCity,
            //   //     Type: 5
            //   // }],
            //   Culture: 'en-US',
            // }, tokenRes).then((resArrivalAutoComplete) => {
            //   console.log(resArrivalAutoComplete, 'res Arrival Auto Complete');
            // });

            // ProviderServiceTourVisio('productservice/getcheckindates', {
            //   ProductType: 3,
            //   ServiceType: selectFilterData?.flightServiceType,
            //   DepartureLocations: [{
            //       Id: selectFilterData?.departureCity,
            //       Type: 5
            //   }],
            //   ArrivalLocations: [{
            //       Id: selectFilterData?.arrivalCity,
            //       Type: 5
            //   }],
            // }, tokenRes).then((resCheckinDates) => {
            //   console.log(resCheckinDates, 'res Checkin Dates');
            // });

            // console.log(selectFilterData?.departureCity, selectFilterData?.arrivalCity);

            // ProviderServiceTourVisio('productservice/pricesearch', {
            //   ProductType: 3,
            //   ServiceTypes: [selectFilterData?.flightServiceType ?? 1],
            //   CheckIn: "2024-07-29T00:00:00+03:00",
            //   DepartureLocations: [{
            //       id: selectFilterData?.departureCity?.slice(0, 3).toUpperCase(),
            //       type: 5
            //   }],
            //   ArrivalLocations: [{
            //       id: selectFilterData?.arrivalCity?.slice(0, 3).toUpperCase(),
            //       type: 5
            //   }],
            //   Passengers: [
            //     {
            //       type: 1,
            //       count: 1
            //     },
            //     {
            //       type: 2,
            //       count: 1
            //     },
            //     {
            //       type: 3,
            //       count: 1
            //     },
            //     {
            //       type: 4,
            //       count: 1
            //     }
            //   ],
            //   showOnlyNonStopFlight: false,
            //   additionalParameters: {
            //     getOptionsParameters: {
            //       flightBaggageGetOption: 0
            //     }
            //   },
            //   acceptPendingProviders: false,
            //   forceFlightBundlePackage: false,
            //   disablePackageOfferTotalPrice: true,
            //   calculateFlightFees: false,
            //   flightClasses: [0],
            //   Culture: "en-US",
            //   Currency: "EUR"
            // }, tokenRes).then((resPriceSearch) => {
            //   console.log(resPriceSearch, 'res Price Search');
            // });
          });
          break;
        case  DataType.Restaurant:
        case 'Restaurants':
          setCardType(DataType.Restaurant);
          const fetchRestaurants = async (lat: number, lng: number) => {
            let query = `?latitude=${lat}&longitude=${lng}&radius=5000&type=restaurant|cafe`;

            if (nextPageToken) {
              query += `&nextPageToken=${nextPageToken}`;
            }

            const resRes = await GetNearByRestaurants(query);
            setCardTypeLoading(false);

            if (resRes.data.next_page_token) {
              setNextPageToken(resRes.data.next_page_token);
            } else {
              setNextPageToken(null);
            }

            setFoundLenght(resRes.data.results.length);

            setMarkerData(resRes?.data.results.map((res: any) => ({
              lat: res.geometry.location.lat,
              lng: res.geometry.location.lng,
              text: `${res.vicinity}`,
            })));

            setRestaurants(mapRestaurantData(resRes));


          };

          if (selectedLocationFromSearch?.lat && selectedLocationFromSearch?.lng) {
            fetchRestaurants(selectedLocationFromSearch.lat, selectedLocationFromSearch.lng);
          } else {
            ProviderInitializeMapCenter(selectedCountry).then((res) => {
              const results = res?.data.results;
              if (results && results.length > 0) {
                fetchRestaurants(results[0].geometry.location.lat, results[0].geometry.location.lng);
              }
            });
          }
          break;
        default:
            setCardType(DataType.Service);
            const SUPPORTED_TABS = ['Search All', 'Hotels', 'Restaurants', 'Flight'];
            const isSupportedTab = (tab: any) => SUPPORTED_TABS.includes(tab);
            const selectedTab = selectFilterData?.selectedTab;

            if(!isSupportedTab(selectedTab)) {
              GetServiceTypes().then((res) => {
                setShowFields(true);

                queryParts.ServiceTypeId = res.data.find((s: any) => s.name === selectedTab)?.id;
                const serviceType = res.data.find((s: any) => s.name === selectedTab);

                if(serviceType?.id) GetFeildsbysid(serviceType?.id).then((res) => setFields(res.data));

                if(serviceType?.isVehicle && serviceType.isVehicle) {
                  setShowVehicles(true);
                  GetAllVehicles().then((res) => setVehicles(res.data) );
                  GetAllVehiclesTypes().then((res)=> setVehicleTypes(res.data));
                } else {
                  setShowVehicles(false);
                }

                if(!serviceType?.isRental && serviceType?.isTrip) {
                  setShowResidenceType(false);
                } else if(serviceType?.isYacht) {
                  setShowResidenceType(false);
                } else {
                  setShowResidenceType(true);
                }

                GetPaginatedServicesBySearchFilter(pageNumber, pageSize, queryParts)
                .then((resSer) => {
                  setCardTypeLoading(false);
                  if(resSer?.data?.items) {

                    setMarkerData(resSer?.data?.items?.filter((res: any) => res.lat !== null && res.lng !== null).map((res: any) => ({
                      lat: res.lat,
                      lng: res.lng,
                      text: `${res.countryName}, ${res.provinceName}, ${res.cityName}`,
                    })));

                    setFoundLenght(resSer?.data?.totalItems);
                    setServices(mapServiceData(resSer));
                  }
                });
              });
            } else {
              GetPaginatedServicesBySearchFilter(pageNumber, pageSize, queryParts)
              .then((resSer) => {
                setCardTypeLoading(false);
                if(resSer?.data?.items) {
                  setMarkerData(resSer?.data?.items?.filter((res: any) => res.lat !== null && res.lng !== null).map((res: any) => ({
                    lat: res.lat,
                    lng: res.lng,
                    text: `${res.countryName}, ${res.provinceName}, ${res.cityName}`,
                  })));

                  setCardType(DataType.Service);
                  setFoundLenght(resSer?.data?.totalItems);
                  setServices(mapServiceData(resSer));
                }
              });

              setShowFields(false);
              setShowVehicles(false);
            }
          break;
      }
    }
  };

  useEffect(() => {
    fetchDataToCard();
  }, [pageNumber, pageSize, selectFilterData]);

  const containerClass = cardType !== DataType.Service
  ? "md:col-12 lg:col-12 sm:col-12 px-3"
  : "md:col-9 lg:col-9 sm:col-12 px-3";

  return (<>
    <div className="container mx-auto search-and-filter">
     { loading ? <LoadingComponent/> : <div className="m-auto">
        <div id="image-container-filter-result" className="flex align-items-center section-one-search-and-filter">
          <SearchBar
            onLocationSelect={(location: LocationFromSearch) => setSelectedLocationFromSearch(location) }
            onSelectFilterData={(_filterData: QueryFilter) =>  setSelectFilterData(_filterData) }
            SearchBarStyle={{width: '100%',border: '1px solid #ddd',backgroundColor: '#fff',padding: '15px 10px',margin: '10px 0',borderRadius: '2px'}}
          />
        </div>

        <div className="grid grid-cols-12 my-5 section-tow-search-and-filter">
          {cardType === DataType.Service &&
            <div className="md:col-3 lg:col-3 sm:col-12 m-filter">
              <h2 className="px-2">Filters</h2>
              <div className="m-block-filters overflow-hidden w-full">

                {/* {showFields &&
                  <div className='fields-x w-full'>
                    <h4>Fields</h4>
                    <div className="my-2 flex justify-content-between align-items-center w-full">
                      <div className="checkbox">
                        <MultiSelect
                          className='fields w-full'
                          value={selectedItems.fields}
                          onChange={(e) => {
                            setSelectedItems((prevState) => ({
                              ...prevState,
                              fields: e.value
                            }));
                          }}
                          options={fields}
                          optionLabel="name"
                          display="chip"
                          placeholder="Select Fields"
                          maxSelectedLabels={100}
                        />
                      </div>

                      <div className="number-filter">0</div>
                    </div>
                  </div>
                } */}

                {showVehicles &&
                  <>
                    <div className='vehicles-x w-full'>
                      <h4>Vehicles</h4>
                      <div className="my-2 flex justify-content-between align-items-center w-full">
                        <div className="checkbox">
                          <MultiSelect
                            className='vehicles w-full'
                            value={selectedItems.vehicles}
                            onChange={(e) => {
                              setSelectedItems((prevState) => ({
                                ...prevState,
                                vehicles: e.value
                              }));
                            }}
                            options={vehicles}
                            optionLabel="model"
                            display="chip"
                            placeholder="Select Vehicles"
                            maxSelectedLabels={100}
                          />
                        </div>

                        {/* <div className="number-filter">0</div> */}
                      </div>
                    </div>

                    <div className='vehicles-type-x w-full'>
                      <h4>Vehicle Types</h4>
                      <div className="my-2 flex justify-content-between align-items-center w-full">
                        <div className="checkbox">
                          <MultiSelect
                            className='vehicle-types w-full'
                            value={selectedItems.vehicleTypes}
                            onChange={(e) => {
                              setSelectedItems((prevState) => ({
                                ...prevState,
                                vehicleTypes: e.value
                              }));
                            }}
                            options={vehicleTypes}
                            optionLabel="name"
                            display="chip"
                            placeholder="Select Vehicle Types"
                            maxSelectedLabels={100}
                          />
                        </div>

                        {/* <div className="number-filter">0</div> */}
                      </div>
                    </div>

                    <div className='makers-x w-full'>
                      <h4>Makers</h4>
                      <div className="my-2 flex justify-content-between align-items-center w-full">
                        <div className="checkbox">
                          <MultiSelect
                            className='makers w-full'
                            value={selectedItems.makers}
                            onChange={(e) => {
                              setSelectedItems((prevState) => ({
                                ...prevState,
                                makers: e.value
                              }));
                            }}
                            options={makers}
                            optionLabel="name"
                            display="chip"
                            placeholder="Select Makers"
                            maxSelectedLabels={100}
                          />
                        </div>

                        {/* <div className="number-filter">0</div> */}
                      </div>
                    </div>
                  </>
                }

                <div className='places-x w-full'>
                  <h4>Places</h4>
                  <div className="my-2 flex justify-content-between align-items-center w-full">
                    <div className="checkbox">
                      <MultiSelect
                        className='places w-full'
                        value={selectedItems.places}
                        onChange={(e) => {
                          setSelectedItems((prevState) => ({
                            ...prevState,
                            places: e.value
                          }));
                        }}
                        options={places}
                        optionLabel="name"
                        display="chip"
                        placeholder="Select Places"
                        maxSelectedLabels={100}
                      />
                    </div>

                    {/* <div className="number-filter">0</div> */}
                  </div>
                </div>

                {showResidenceType &&
                  <CheckboxList
                    title="Residence Type"
                    category="residence_type"
                    items={residenceType}
                    selectedItems={selectedItems.residence_type}
                  />
                }

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

                <div className='rating-x my-2'>
                  <h4>Rating</h4>
                  <div className="my-2 flex justify-content-between align-items-center">
                    <div className="checkbox">
                      <Rating
                        className="rat-icon-filter mx-2 border-0"
                        value={selectedItems.ratings}
                        stars={10}
                        onChange={(e) => {
                          setSelectedItems((prevState) => ({
                            ...prevState,
                            ratings: e.value
                          }));
                        }}
                      />
                    </div>

                    {/* <div className="number-filter">0</div> */}
                  </div>
                </div>

                <div className='slider-x my-2'>
                  <h4>Min - Max Price</h4>
                  <div className="my-2 flex justify-content-between align-items-center">
                      <InputNumber inputClassName="w-3 mx-2" value={selectedItems.minMaxPrice[0]} onValueChange={(e) => handleInputChange(e.value as number, 0)} placeholder="Min" />
                      <InputNumber inputClassName="w-3 mx-2" value={selectedItems.minMaxPrice[1]} onValueChange={(e) => handleInputChange(e.value as number, 1)} placeholder="Max" />
                    </div>

                  <div className="my-2 flex justify-content-between align-items-center">
                    <div className="w-full pr-3">
                      <Slider
                        min={0}
                        max={20000}
                        className="w-full"
                        step={1}
                        value={selectedItems.minMaxPrice}
                        onChange={(e) => handleSliderChange(e)}
                        range
                      />
                    </div>

                    {/* <div className="number-filter">0</div> */}
                  </div>
                </div>

                {/* <CheckboxList
                  title="Currency"
                  category="currency"
                  items={currency}
                  selectedItems={selectedItems.currency}
                /> */}
              </div>
            </div>
          }

          <div className={containerClass}>
            <b className="p-button p-component p-button-outlined p-button-danger">{ cardType }</b>
            <div
              style={isMobile ? {} : {
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
                      key={hotel.id}
                      service={hotel}
                      moreData={hotelSearchId}
                      QueryFilter={selectFilterData ?? undefined}
                      ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}}
                      type={DataType.Hotel}
                    />
                  ))
              ) : cardType === DataType.Flight && flights.length > 0 ? (
                flights.map(flight => (
                  <ServiceCard
                    key={flight.geolocation.longitude}
                    service={flight}
                    QueryFilter={selectFilterData ?? undefined}
                    ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}}
                    type={DataType.Flight}
                  />
                ))
              ) : cardType === DataType.Restaurant && restaurants.length > 0 ? (
                restaurants.map(restaurant => (
                  <ServiceCard
                    key={restaurant.place_id}
                    service={restaurant}
                    QueryFilter={selectFilterData ?? undefined}
                    ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}}
                    type={DataType.Restaurant}
                  />
                ))
              ) : cardType === DataType.Service && services.length > 0 ? (
                services.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    QueryFilter={selectFilterData ?? undefined}
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
              :
                <div className="nop-x" style={{display: 'grid', justifyContent: 'center', alignItems: 'center'}}>
                  <Image style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} alt={Search7526301} imageStyle={{width: '50%', height: '100%'}} zoomSrc={Search7526301} src={Search7526301} />
                  <span className="no-data-services">no {cardType} found</span>
                </div>
              } </>)}

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
        onLocationSelect={(location: LocationFromMap) => { setSelectedLocationFromMap(location) }}
      />
    </Dialog>
  </>);
};

export default SearchAndFilter;
