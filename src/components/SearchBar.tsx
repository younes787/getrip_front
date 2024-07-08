import React, { CSSProperties, useEffect, useState } from 'react';
import { faHotel, faSearch, faPlane, faBowlFood, faMapMarkerAlt, faCalendarAlt, faFireAlt, faHandPointUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetAllCountries, GetFeilds, GetServiceTypes } from '../Services';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { MultiSelect } from 'primereact/multiselect';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QueryFilter } from '../modules/getrip.modules';

interface SearchBarProps {
  SearchBarStyle?: CSSProperties;
  onLocationSelect: (location: {lat: number; lng: number; country: string; province: string}) => void;
  onSelectFilterData: (_filterData: QueryFilter) => void;
}

const SearchBar : React.FC<SearchBarProps> = ({ SearchBarStyle, onLocationSelect, onSelectFilterData }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 30);
  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState<any>([startDate, today]);
  const [countries, setCountries] = useState<any>();
  const [selectedFields, setSelectedFields] = useState([]);
  const [fields, setFields] = useState<any>();
  const [selectedLocation, setSelectedLocation] = useState<{ name: string }>({ name: '' });
  const [filteredCountries, setFilteredCountries] = useState<any>(null);
  const navigate = useNavigate();

  const [serviceType, setServiceType] = useState([
    { header: <span><FontAwesomeIcon icon={faSearch} size={"sm"} className="mr-2" />Search All</span> },
  ]);

  const handleCurrandLocation = async ({latitude, longitude}: any) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBEXkQBNQVfF3uHq7f34_9D_jH6ava1ZCY`
      );

      if (response.data.status === 'OK') {
        const results = response.data.results;
        let country = '';
        let province = '';

        for (const component of results[0].address_components) {
          if (component.types.includes('country')) {
            country = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            province = component.long_name;
          }
        }

        setSelectedLocation({name: `${country}, ${province}`});
        onLocationSelect({lat: latitude, lng: longitude, country, province })
      } else {
        console.error('Geocoding API error: ', response.data.status);
      }
    } catch (error) {
      console.error('Error fetching geocoding data: ', error);
    }
  };

  useEffect(() => {
    onSelectFilterData({
      selectdTab: serviceType[activeIndex].header.props ?? null,
      address: selectedLocation ?? null,
      startDate: date[0] ?? null,
      endDate: date[1] ?? null,
      selectedFields: selectedFields ?? null,
    });

  }, [selectedFields, selectedLocation, date,  activeIndex]);

  useEffect(() => {
    GetAllCountries().then((res) => setCountries(res.data));
    GetFeilds().then((res) => setFields(res.data));

    GetServiceTypes().then((res) => {
      const serviceTypes = res.data.map((service: any) => ({
        header: <span><FontAwesomeIcon icon={faHandPointUp} size={"sm"} className="mr-2" />{service.name}</span>
      }));

      setServiceType(prevTabs => [...prevTabs, ...serviceTypes]);
    }).then(() => {
      setServiceType(prevTabs => [...prevTabs,
        { header: <span><FontAwesomeIcon icon={faHotel} size={"sm"} className="mr-2" />Hotels</span> },
        { header: <span><FontAwesomeIcon icon={faBowlFood} size={"sm"} className="mr-2" />Restaurants</span> },
        { header: <span><FontAwesomeIcon icon={faPlane} size={"sm"} className="mr-2" />Flight</span> },
      ]);
    });

    navigator.geolocation.getCurrentPosition((position) => {
      handleCurrandLocation(position.coords)
    }, (error) => {
      console.error('Error getting current location:', error);
    });
  }, []);

  const search = (event: any) => {
    setTimeout(() => {
        let _filteredCountries;

        if (!event.query.trim().length) {
            _filteredCountries = [...countries];
        }
        else {
            _filteredCountries = countries.filter((country: any) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }

        setFilteredCountries(_filteredCountries);
    }, 250);
  }

  const titleTemplate = (item: any) => {
    const index = serviceType.indexOf(item);
    return (
      <button
        className={`px-3 py-2 p-link ${activeIndex === index ? 'active-tab' : ''}`}
        style={{ width: 'max-content', fontSize: '18px', fontWeight: '500', color: '#4a235a'}}
        onClick={() => {
          setActiveIndex(index)
        }}
      >
        {item.header}
      </button>
    )
  };

  return (
    <div style={SearchBarStyle}>
      <Carousel
        style={{backgroundColor: '#fff', padding: '12px', margin: 'auto'}}
        value={serviceType}
        showIndicators={false}
        showNavigators={true}
        numVisible={6}
        numScroll={1}
        itemTemplate={titleTemplate}
      />

      <div className="search__bar">
        <form className="grid w-full">
          <div className="form__group">
            <FontAwesomeIcon icon={faMapMarkerAlt} size={"sm"} className="fa mr-2" />
            <AutoComplete className='failds' style={{width: '100%'}} placeholder='Choos Country' tooltip='At least one letter must be written' tooltipOptions={{position: 'bottom'}} field="name" value={selectedLocation.name} suggestions={filteredCountries} completeMethod={search}
              onChange={(e) => {
                onLocationSelect({lat: 0, lng: 0, country: e.value.name, province: '' });
                setSelectedLocation({name: e.value});
              }}
            />
          </div>

          <div className="form__group">
            <FontAwesomeIcon icon={faCalendarAlt} size={"sm"} className="fa mr-2" />
            <Calendar className='failds' style={{width: '100%'}} placeholder='Select Start - End Date' value={date} onChange={(e) => setDate(e.value)} numberOfMonths={2} selectionMode="range"  />
          </div>

          <div className="form__group">
            <div className="flex justify-content-center align-items-center w-full">
              <FontAwesomeIcon icon={faFireAlt} size={"sm"} className="fa mr-2" />
              <MultiSelect className='failds' style={{width: '100%', border: 0}} value={selectedFields} onChange={(e) => setSelectedFields(e.value)} options={fields} optionLabel="name" display="chip" placeholder="Select Feilds" maxSelectedLabels={10}/>
            </div>

            <Button label="Search" rounded severity="warning" style={{minWidth: 'max-content', margin: '7px -9px 0 0'}} onClick={() => navigate("/search-and-filter")} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
