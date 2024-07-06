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

interface SearchBarProps {
  SearchBarStyle?: CSSProperties;
}

const SearchBar : React.FC<SearchBarProps> = ({ SearchBarStyle }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 30);
  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState<any>([startDate, today]);
  const [countries, setCountries] = useState<any>();
  const [selectedFeilds, setSelectedFeilds] = useState(null);
  const [feilds, setFeilds] = useState<any>();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [filteredCountries, setFilteredCountries] = useState<any>(null);
  const navigate = useNavigate();

  const [serviceType, setServiceType] = useState([
    { header: <span><FontAwesomeIcon icon={faSearch} size={"sm"} className="mr-2" />Search All</span> },
  ]);

  useEffect(() => {
    GetAllCountries().then((res) => setCountries(res.data));
    GetFeilds().then((res) => setFeilds(res.data));

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
            <AutoComplete className='failds' style={{width: '100%'}} placeholder='Choos Country' tooltip='At least one letter must be written' tooltipOptions={{position: 'bottom'}} field="name" value={selectedCountry} suggestions={filteredCountries} completeMethod={search} onChange={(e) => setSelectedCountry(e.value)} />
          </div>

          <div className="form__group">
            <FontAwesomeIcon icon={faCalendarAlt} size={"sm"} className="fa mr-2" />
            <Calendar className='failds' style={{width: '100%'}} placeholder='Select Start - End Date' value={date} onChange={(e) => setDate(e.value)} numberOfMonths={2} selectionMode="range"  />
          </div>

          <div className="form__group">
            <div className="flex justify-content-center align-items-center w-full">
              <FontAwesomeIcon icon={faFireAlt} size={"sm"} className="fa mr-2" />
              <MultiSelect className='failds' style={{width: '100%', border: 0}} value={selectedFeilds} onChange={(e) => setSelectedFeilds(e.value)} options={feilds} optionLabel="name" display="chip" placeholder="Select Feilds" maxSelectedLabels={3}/>
            </div>

            <Button label="Search" rounded severity="warning" style={{minWidth: 'max-content', margin: '7px -9px 0 0'}} onClick={() => navigate("/search-and-filter")} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
