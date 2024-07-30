import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { faHotel, faSearch, faPlane, faBowlFood, faMapMarkerAlt, faCalendarAlt, faHandPointUp, faUserAlt, faArrowAltCircleDown, faPlaneArrival, faPlaneDeparture, faPlaceOfWorship } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetProvimcesByName, GetServiceTypes, GetProvincebyCid, GetAllCountries } from '../Services';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { useNavigate } from 'react-router-dom';
import { QueryFilter } from '../modules/getrip.modules';
import { InputNumber } from 'primereact/inputnumber';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import { ProviderHandleCurrandLocation } from '../Services/providerRequests';
import { fas } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  SearchBarStyle?: CSSProperties;
  onLocationSelect: (location: {lat: number; lng: number; country: string; province: string, moreData?: any}) => void;
  onSelectFilterData: (_filterData: QueryFilter) => void;
}

const SearchBar : React.FC<SearchBarProps> = ({ SearchBarStyle, onLocationSelect, onSelectFilterData }) => {
  const today = new Date();
  const minSelectableDate = new Date(today);
  minSelectableDate.setDate(today.getDate() + 10);
  const [date, setDate] = useState<any>([today, minSelectableDate]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [addressData, setAddressData] = useState<{
    countryId: number,
    countryName: string,
    name: string,
    provinceId: number,
    provinceName: string,
  }[]>([]);
  const [keySearch, setKeySearch] = useState<string>('A');
  const [selectedLocation, setSelectedLocation] = useState<{ name: string }>({ name: '' });
  const [filteredQuery, setFilteredQuery] = useState<any>(null);
  const [guests, setGuests] = useState<any>(0);
  const [children, setChildren] = useState<any>(0);
  const [departureCity, setDepartureCity] = useState<any>(null);
  const [arrivalCity, setArrivalCity] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState<any>(null);
  const [returnDate, setReturnDate] = useState<any>(null);
  const menuLeft = useRef<any>(null);
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<any>('');
  const [provinces, setProvinces] = useState<any>();
  const [country, setCountry] = useState<any>(null);
  const [flightServiceType, setFlightServiceType] = useState<any>();
  const [numVisible, setNumVisible] = useState(6);
  const [countries, setCountries] = useState<any>();
  const [serviceType, setServiceType] = useState([
    { header: <span><FontAwesomeIcon icon={faSearch} size={"sm"} className="mr-2" />Search All</span> },
  ]);

  const FlightTemplate = ({ icon, label, inputComponent }: any) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FontAwesomeIcon icon={icon} size={"sm"} className="fa mr-2" />
      <span className='mx-2' style={{width: '200px'}}>{label}</span>
      {inputComponent}
    </div>
  );

  const handleCurrandLocation = async ({latitude, longitude}: any) => {
    try {
      ProviderHandleCurrandLocation(latitude, longitude)
      .then((res) => {
        if (res?.data.status === 'OK') {
          const results = res?.data.results;
          let country = '';
          let province = '';

          for (const component of results[0].address_components) {
            if (component.types.includes('country')) {
              country = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              province = component.long_name.replace(/Governorate|state/g, '').trim();
            }
          }

          setSelectedLocation({name: `${country}, ${province}`});
          onLocationSelect({lat: latitude, lng: longitude, country, province });
          setKeySearch(province);
        } else {
          console.error('Geocoding API error: ', res?.data.status);
        }
      });
    } catch (error) {
      console.error('Error fetching geocoding data: ', error);
    }
  };

  useEffect(() => {
    if(addressData[0]?.countryId) {
      GetProvincebyCid(addressData[0]?.countryId)
      .then((res) => {
        setProvinces(res.data);
      });
    }
  }, [addressData]);

  useEffect(() => {
    GetServiceTypes().then((res) => {
      const serviceTypes = res.data.map((service: any) => ({
        header: <span><FontAwesomeIcon icon={fas[service.iconCode] ?? faHandPointUp} size={"sm"} className="mr-2" />{service.name}</span>
      }));

      setServiceType(prevTabs => [...prevTabs, ...serviceTypes]);
    }).then(() => {
      setServiceType(prevTabs => [...prevTabs,
        { header: <span><FontAwesomeIcon icon={faHotel} size={"sm"} className="mr-2" />Hotels</span> },
        { header: <span><FontAwesomeIcon icon={faPlane} size={"sm"} className="mr-2" />Flight</span> },
        { header: <span><FontAwesomeIcon icon={faBowlFood} size={"sm"} className="mr-2" />Restaurants</span> },
      ]);
    });

    navigator.geolocation.getCurrentPosition((position) => {
      handleCurrandLocation(position.coords)
    }, (error) => {
      console.error('Error getting current location:', error);
    });

    GetAllCountries().then((res)=> setCountries(res.data));
  }, []);

  useEffect(() => {
    onSelectFilterData({
      selectdTab: serviceType[activeIndex].header.props ?? null,
      address: selectedLocation ?? null,
      startDate: date[0] ?? null,
      endDate: date[1] ?? null,
      guests: guests ?? null,
      children: children ?? null,
      departureCity: departureCity ?? null,
      arrivalCity: arrivalCity ?? null,
      departureDate: departureDate ?? null,
      returnDate: returnDate ?? null,
      flightServiceType: flightServiceType ?? null,
    });
  }, [selectedLocation, date,  activeIndex, guests, children, arrivalCity, departureDate, departureCity, returnDate, flightServiceType]);

  useEffect(() => {
    GetProvimcesByName(keySearch).then((res) => {
      const _fullProvinceName = res.data.map((_res: any) => {
        return {
          countryId: _res.countryId,
          countryName: _res.countryName,
          name: _res.fullProvinceName,
          provinceId: _res.id,
          provinceName: _res.name,
        };
      });

      setAddressData(_fullProvinceName);
    }).catch((error) => {
      console.error(error);
    });
  }, [keySearch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        setNumVisible(2);
      } else {
        setNumVisible(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const search = (event: any) => {
    setTimeout(() => {
        let _filteredQuery;

        if (!event.query.trim().length) {
          _filteredQuery = [...addressData];
        }
        else {
          setKeySearch(event.query.toLowerCase());
          _filteredQuery = addressData;
        }

        setFilteredQuery(_filteredQuery);
    }, 250);
  }

  const titleTemplate = (item: any) => {
    const index = serviceType.indexOf(item);
    return (
      <button
        className={`px-3 py-2 p-link ${activeIndex === index ? 'active-tab' : ''}`}
        style={{ width: 'max-content', fontSize: '18px', fontWeight: '500', color: '#4a235a'}}
        onClick={() => setActiveIndex(index)}
      >
        {item.header}
      </button>
    )
  };

  const handleGuestsChange = (e: any) => {
    const value = e.value;

    if (value && value > 0) {
      setGuests(value);
    } else {
      setGuests(1);
    }
  };

  const handleChildrenChange = (e: any) => {
    const value = e.value;

    if (value && value > 0) {
      setChildren(value);
    } else {
      setChildren(1);
    }
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const getMenuModel = () => {
    const serviceTypeName = serviceType[activeIndex].header.props.children[1];

    const commonCloseButton = (
      <div className="close w-full mt-5" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Button
          label="Close"
          severity="danger"
          type='button'
          style={{ padding: '5px' }}
          onClick={(event) => menuLeft.current.hide(event)}
          aria-controls="popup_menu_left"
          aria-haspopup
        />
      </div>
    );

    if (!['Restaurants', 'Flight'].includes(serviceTypeName)) {
      return [
        {
          label: 'Fields',
          template: () => (
            <>
              <div className="gus m-2 w-full" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesomeIcon icon={faUserAlt} size={"sm"} className="fa mr-2" />
                <span className='mx-2' style={{width: '100px'}}>Guests</span>
                <InputNumber
                  inputId="guests"
                  value={guests}
                  onValueChange={handleGuestsChange}
                  showButtons
                  buttonLayout="horizontal"
                  step={1}
                  min={0}
                  inputClassName="input-template"
                  decrementButtonClassName="p-button-secondery"
                  incrementButtonClassName="p-button-secondery"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                />
              </div>

              <div className="chi m-2 w-full" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesomeIcon icon={faUserAlt} size={"sm"} className="fa mr-2" />
                <span className='mx-2' style={{width: '100px'}}>children</span>
                <InputNumber
                  inputId="children"
                  value={children}
                  onValueChange={handleChildrenChange}
                  showButtons
                  buttonLayout="horizontal"
                  step={1}
                  min={0}
                  inputClassName="input-template"
                  decrementButtonClassName="p-button-secondery"
                  incrementButtonClassName="p-button-secondery"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                />
              </div>
              {commonCloseButton}
            </>
          )
        }
      ];
    } else if(serviceTypeName === 'Flight') {
      return [
        {
          label: 'Departure City',
          template: () => (
            <>
              <div className='m-2 w-full departure'>
                <FlightTemplate
                  icon={faPlaceOfWorship}
                  label="Flight Service Type"
                  inputComponent={
                    <Dropdown
                      placeholder="Select a Flight Service Type"
                      options={[
                        {id: 1, name: 'One Way'},
                        {id: 2, name: 'Round Trip'},
                        {id: 3, name: 'Multi City'},
                      ]}
                      optionLabel="name"
                      optionValue="id"
                      name="flightServiceType"
                      filter
                      className="mt-2	w-full"
                      value={flightServiceType}
                      onChange={(e) => setFlightServiceType(e.value)}
                    />
                  }
                />
              </div>

              <Dropdown
                placeholder="Select a Country"
                options={countries}
                optionLabel="name"
                optionValue="id"
                name="country_name"
                filter
                className="mt-2	w-full"
                value={country}
                onChange={(e) => {
                  setCountry(e.value);
                  GetProvincebyCid(e.value).then((res) => setProvinces(res.data));
                }}
              />

              <div className='m-2 w-full departure'>
                <FlightTemplate
                  icon={faPlaneDeparture}
                  label="Departure City"
                  inputComponent={
                    <Dropdown
                      placeholder="Select a Departure city"
                      options={provinces}
                      optionLabel="name"
                      optionValue="name"
                      name="departureCity"
                      filter
                      className="mt-2	w-full"
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.value)}
                    />
                  }
                />
              </div>

              <div className='m-2 w-full departure'>
                <FlightTemplate
                  icon={faPlaneArrival}
                  label="Arrival City"
                  inputComponent={
                    <Dropdown
                      placeholder="Select a Arrival city"
                      options={provinces}
                      optionLabel="name"
                      optionValue="name"
                      name="arrivalCity"
                      filter
                      className="mt-2	w-full"
                      value={arrivalCity}
                      onChange={(e) => setArrivalCity(e.value)}
                    />
                  }
                />
              </div>

              <div className='m-2 w-full departure'>
                <FlightTemplate
                  icon={faCalendarAlt}
                  label="Departure Date"
                  inputComponent={
                    <Calendar
                      className="w-full"
                      inputId="departureDate"
                      autoFocus={focusedField === 'departureDate'}
                      onInput={() => handleInputFocus('departureDate')}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.value)}
                      showIcon
                    />
                  }
                />
              </div>

              <div className='m-2 w-full departure'>
                <FlightTemplate
                  icon={faCalendarAlt}
                  label="Return Date"
                  inputComponent={
                    <Calendar
                      className="w-full"
                      inputId="returnDate"
                      autoFocus={focusedField === 'returnDate'}
                      onInput={() => handleInputFocus('returnDate')}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.value)}
                      showIcon
                    />
                  }
                />
              </div>
              {commonCloseButton}
            </>
          )
        }
      ];
    }

    return [
      {
        label: 'No Filter',
        template: () => (
          <>
            <div className='text-center p-button p-component p-button-outlined p-button-danger' style={{ padding: '10px 70px'}}>No Filter Found</div>
            {commonCloseButton}
          </>
        )
      }
    ];
  };

  const responsiveOptions = [
    {
      breakpoint: '1700px',
      numVisible: 6,
      numScroll: 2
    },
    {
      breakpoint: '1500px',
      numVisible: 5,
      numScroll: 2
    },
    {
      breakpoint: '1200px',
      numVisible: 4,
      numScroll: 2
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  return (
    <div style={SearchBarStyle}>
      <Carousel
        style={{backgroundColor: '#fff', padding: '12px', margin: 'auto'}}
        value={serviceType}
        showIndicators={false}
        showNavigators={true}
        numVisible={numVisible}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={titleTemplate}
      />

      <div className="search__bar">
        <form className="grid w-full grid grid-cols-12">
          <div className="form__group lg:border-x-2 sm:col-12 md:col-12 lg:col-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} size={"sm"} className="fa mr-2" />
            <AutoComplete
              className='failds'
              style={{width: '100%'}}
              placeholder='Type to search address...'
              tooltip='At least one letter must be written'
              tooltipOptions={{position: 'bottom'}}
              field="name"
              value={selectedLocation.name}
              suggestions={filteredQuery}
              completeMethod={search}
              onChange={(e) => {
                onLocationSelect({lat: 0, lng: 0, country: e.value.name, province: '', moreData: e.value });
                setSelectedLocation({name: e.value});
              }}
            />
          </div>

          <div className="form__group lg:border-x-2 sm:col-12 md:col-12 lg:col-4">
            <FontAwesomeIcon icon={faCalendarAlt} size={"sm"} className="fa mr-2" />
            <Calendar
              className='failds'
              style={{width: '100%'}}
              placeholder='Select Start - End Date'
              value={date}
              onChange={(e) => setDate(e.value)}
              numberOfMonths={2}
              selectionMode="range"
              minDate={today}
            />
          </div>

          <div className="form__group sm:col-12 md:col-12 lg:col-4">
            <div className="flex justify-content-center align-items-center w-full">
              <div className="w-full mx-3 relative">
                <Menu
                  model={getMenuModel()}
                  popup
                  ref={menuLeft}
                  style={{
                    width: 'max-content',
                    overflow: 'hidden',
                    padding: '20px',
                  }}
                  id="popup_menu_left"
                />
                <Button
                  label={`${guests} guests. ${children} children`}
                  icon={<FontAwesomeIcon icon={faUserAlt} size={"sm"} className="more-filter-icon fa p-0" />}
                  type='button'
                  style={{minWidth: 'max-content', margin: '7px -9px 0 0'}}
                  className="mr-2 more-filter w-full"
                  onClick={(event) => menuLeft.current.show(event)}
                  aria-controls="popup_menu_left"
                  aria-haspopup
                />
              </div>
            </div>

            <Button label="Search" rounded severity="warning" style={{minWidth: 'max-content', margin: '7px -9px 0 0'}} onClick={() => navigate("/search-and-filter")} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
