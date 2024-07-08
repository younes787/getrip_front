import { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import SearchBar from "../components/SearchBar";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation, faArrowUpShortWide } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "primereact/checkbox";
import { GetAllCountries, GetAllProvinces, GetCitiesbyid, GetCurrency, GetPaginatedServices, GetProvincebyCid, GetResidence, GetResidenceType } from "../Services";
import ServiceCard from "../components/ServiceCard";
import { Rating } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import GoogleMap from "../components/GoogleMap";
import { LocationFromMap, LocationFromSearch, QueryFilter, ServiceDTO, SidebarFilter } from "../modules/getrip.modules";
import { Paginator } from "primereact/paginator";

const SearchAndFilter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [foundLenght, setFoundLenght] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [residenceType, setResidenceType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [services, setServices] = useState<any>();
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
  const [selectedItems, setSelectedItems] = useState<{residenceType: any[], residence: any[], city: any[], rangePrice: any[], rating: any[], currency: any[]}>({residenceType: [], residence: [], city: [], rangePrice: [], rating: [], currency: []});

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

  const getAllService = () => {
    const queryParts: string[] = [];
    const { address, startDate, endDate, selectdTab, selectedFields, sidebarFilter } = selectFilterData || {};

    const addQueryPart = (key: string, value: string | string[]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParts.push(`${key}=${value.map(encodeURIComponent).join(',')}`);
        }
      } else if (value) {
        queryParts.push(`${key}=${encodeURIComponent(value)}`);
      }
    };

    if (address?.name) {
      addQueryPart('address', address.name.name ?? address.name);
    }

    if (startDate) {
      addQueryPart('start_date', formatDate(startDate));
    }

    if (endDate) {
      addQueryPart('end_date', formatDate(endDate));
    }

    if (selectdTab) {
      addQueryPart('tab', selectdTab.children[1]);
    }

    if (selectedFields?.length) {
      addQueryPart('fields', selectedFields.map((field: any) => field.name));
    }

    if (sidebarFilter) {
      Object.keys(sidebarFilter).forEach((key) => {
        addQueryPart(
          `sidebar_filter[${key}]`,
          sidebarFilter[key as keyof SidebarFilter]?.map((item: any) => key === 'rating' ? item.label.props.stars : item.name ?? item.label) || []
        );
      });
    }

    GetPaginatedServices(pageNumber, pageSize, queryParts.join('&')).then((res: any) => {
      setFoundLenght(services?.totalItems);
      setServices(res.data);
    });
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
    getAllService();
  }, [pageNumber, pageSize, selectFilterData]);

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

  return (<>
    <div className="container mx-auto px-12 search-and-filter">
     { loading ? <LoadingComponent/> : <div className="m-auto">
        <div id="image-container-filter-result" className="flex align-items-center section-one-search-and-filter">
          <SearchBar
            onLocationSelect={(location: LocationFromSearch) => { setSelectedLocationFromSearch(location) }}
            onSelectFilterData={(_filterData: QueryFilter) => {
              setSelectFilterData(_filterData);
              getAllService();
            }}
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
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
                >Map</Button>
              </div>
            </div>

            <div className="service-card-content">
              {services && services.totalItems > 0 ? services.items.map((service: ServiceDTO, index: number) => (
                <ServiceCard
                  key={index}
                  service={{
                    id: service.id ? service?.id : 0,
                    name: service.name,
                    location: `${findCountry(countries, undefined, service.countryId)?.name ?? 'No Country'}, ${findProvince(provinces, undefined, service.provincyId)?.name ?? 'No Province'}`,
                    pricePerNight: service.price,
                    rating: service.ratingAverage,
                    numberOfReviews: 900,
                    imageUrl: service?.photos ? service?.photos[0].imagePath : ''
                  }}
                  ServiceCardStyle={{ width: '100%', margin: '15px 0', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'}}
                />
              ))
              : 'no data'}

              <Paginator first={pageNumber} rows={pageSize} totalRecords={services?.totalItems} rowsPerPageOptions={[5, 10, 20, 30]} onPageChange={onPageChange} />
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
        onLocationSelect={(location: LocationFromMap) => { setSelectedLocationFromMap(location) }}
      />
    </Dialog>
  </>);
};

export default SearchAndFilter;
