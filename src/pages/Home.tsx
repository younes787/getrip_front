import { Button } from "primereact/button";
import "../styles/home.scss";
import "../styles/Searchbar.scss";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { GetAllCountries, GetAllLanguages, GetAllProvinces, GetCurrency, GetHomePageRows, Getlogged } from "../Services";
import { Carousel } from "primereact/carousel";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faMapLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import { HomePageRowDTO, LocationFromSearch, QueryFilter } from "../modules/getrip.modules";
import { DataType } from "../enums";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../components/Loading";

const Home = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any);
  const [loading, setLoading] = useState<boolean>(false);
  const [country, setCountry] = useState<any>();
  const [language, setLanguage] = useState<any>();
  const [currency, setCurrency] = useState<any>();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState<any>();
  const [homePageRows, setHomePageRows] = useState<HomePageRowDTO[]>([]);
  const [selectedLocationFromSearch, setSelectedLocationFromSearch] = useState<LocationFromSearch | null>(null);
  const [selectFilterData, setSelectFilterData] = useState<QueryFilter | null>(null);
  const { t } = useTranslation();

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

  const queryString = selectFilterData
  ? Object.entries(selectFilterData)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')
  : '';

  useEffect(() => {
    setLoading(true);
    const { province, moreData } = selectedLocationFromSearch || {};

    if(moreData && moreData.provinceId) {
      GetHomePageRows(moreData.provinceId).then((res) => {
        setHomePageRows([...res.data].sort((a, b) => a.placement - b.placement));
        setLoading(false);
      });
    } else if(province) {
      GetAllProvinces().then((res) => {
        const foundProvince = province ? findProvince(res.data, province) : null;

        if(foundProvince && foundProvince.id) {
          GetHomePageRows(foundProvince.id).then((res) => {
            setHomePageRows([...res.data].sort((a, b) => a.placement - b.placement));
            setLoading(false);
          });
        }
      });
    } else {
      GetHomePageRows().then((res) => {
        setHomePageRows([...res.data].sort((a, b) => a.placement - b.placement));
        setLoading(false);
      });
    }

    const { language, country, currency } = JSON.parse(localStorage.getItem('externalDataToLocalStorage') || '{}');

    GetAllLanguages().then((res)=> {
      const foundLanguage = res.data.find((_language: any) => language && _language.id === language);
      setLanguage(foundLanguage ?? res.data[0]);
    });

    GetCurrency().then((res)=> {
      const foundCurrency = res.data.find((_currency: any) => currency && _currency.id === currency);
      setCurrency(foundCurrency ?? res.data[0]);
    });

    GetAllCountries().then((res)=> {
      const foundCountry = res.data.find((_country: any) => country && _country.id === country);
      setCountry(foundCountry ?? res.data[0]);
    });

    if(User) {
      Getlogged(User?.data?.email).then((res) => { return 200 })
    }
  },[]);

  const Footer = () => {
    return (
      <footer className="footer grid grid-cols-12 mt-5">
        <div className="footer-top md:col-3 lg:col-3">
          <div className="location">
            {country?.name} · {language?.name} ({language?.shortcut}) · {currency?.name}
          </div>
        </div>

        <div className="footer-middle md:col-9 lg:col-9">
          <div className="footer-column md:col-3 lg:col-3">
            <a href="#">Help</a>
            <a href="#">Privacy Settings</a>
            <a href="#">Log in</a>
          </div>

          <div className="footer-column md:col-3 lg:col-3">
            <a href="#">Cookie policy</a>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
            <a href="#">Company Details</a>
          </div>

          <div className="footer-column md:col-3 lg:col-3">
            <a href="#">Explore</a>
            <a href="#">Company</a>
            <a href="#">Partners</a>
            <a href="#">Trips</a>
            <a href="#">International Sites</a>
          </div>
        </div>

        <div className="footer-bottom md:col-12 lg:col-12">
          Compare and book cheap flights with  Ge<span className="secondery">t</span>rip
          <br />
          ©  Ge<span className="secondery">t</span>rip Ltd 2024 – 2024
        </div>
      </footer>
    );
  };

  const renderImage = (image: string) => {
    return <Image src={image} alt="Product" style={{width: '100%', padding: '0 10px'}} imageStyle={{ width: '95%', height: '400px'}} />;
  };

  const renderisAd = (image: string) => {
    return <Image src={image} alt="Product" style={{width: '100%', padding: '0 10px'}} imageStyle={{ width: '95%', height: '400px'}} />;
  };

  const renderServices = (service: any) => {
    return <Card
                title={service.name}
                subTitle={<span><FontAwesomeIcon icon={faMapLocationDot} size="sm" style={{ color: 'rgb(102 101 101)' }} className="mr-2" />{service.description}</span>}
                header={ <Image  src={service?.photos[0]?.imagePath && service?.photos[0]?.imagePath } imageStyle={{borderRadius: '30px 30px 0 0'}} alt={service.photos}  preview />}
                className="md:w-21rem m-2 m-home-card relative"
              >
              <div className="grid mb-3">
                <div className="col-8">
                  <p className="my-1" style={{ color: '#f1881f', fontWeight: '550'}}><FontAwesomeIcon icon={faStar} size="sm" className="mr-1" /> 9.0/10</p>
                  <p className="my-1" style={{fontSize: '14px'}}>(900 REVIEWS)</p>
                </div>

                <div className="col-4">
                  <p style={{ display: 'grid', margin: 0, justifyContent: 'center', alignItems: 'center', fontSize: '16px', color: 'rgb(98 98 98)'}}>
                    per night
                    <span className="mt-1" style={{fontSize: '30px', fontWeight: '550',  color: '#000'}}>${service?.price}</span>
                  </p>
                </div>
              </div>

              <Button
                className="absolute show-details"
                icon={<span className="pi pi-info mx-1"></span>}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '30px 0 30px 0',
                  borderColor: '#f1881f',
                  color: '#f1881f',
                  padding: '10px 15px',
                  bottom: '0px',
                  right: '0'
                }}
                aria-label="Filter"
                size="small"
                onClick={() => navigate(`/service-details/${DataType.Service.toLowerCase()}/${service.id}/${queryString}`)}
              >
                Show details
              </Button>
            </Card>;
  };

  const renderPlaces = (place: any) => {
    return  <Card
              title={place.name}
              subTitle={place.description}
              header={<img alt="Card" style={{ borderRadius: '30px 30px 0 0', height: "10rem"}} src={place.photos[0]?.imagePath ?? 'https://getripstorage2.blob.core.windows.net/uploads/bd65bd25-6fcf-4485-b29a-91aae287ab8c.jpg'} />}
              className="md:w-21rem m-2 m-home-card"
              style={{ height: "20rem"}}
            ></Card>;
  };

  const renderActivity = (activity: any) => {
    return <Card
              title={activity.name}
              subTitle={activity.description}
              header={<img alt="Card" style={{ borderRadius: '30px 30px 0 0', height: "10rem"}} src={activity.photos[0]?.imagePath ?? 'https://getripstorage2.blob.core.windows.net/uploads/bd65bd25-6fcf-4485-b29a-91aae287ab8c.jpg'} />}
              style={{ height: "20rem"}}
              className="md:w-21rem m-2 m-home-card"
            ></Card>;
  };

  const renderCarousel = (page: HomePageRowDTO) => {
    let itemTemplate;
    let value;

    if (page.isOnlyImage) {
      itemTemplate = renderImage;
      value = page.objects?.map((ob: any) => ob.item.imagePath);
    } else if (page.isService) {
      itemTemplate = renderServices;
      value = page.objects?.map((ob: any) => ob.item);
    } else if (page.isPlace) {
      itemTemplate = renderPlaces;
      value = page.objects?.map((ob: any) => ob.item);
    } else if (page.isActivity) {
      itemTemplate = renderActivity;
      value = page.objects?.map((ob: any) => ob.item);
    } else if (page.isAd) {
      itemTemplate = renderisAd;
      value = page.objects?.map((ob: any) => ob.item);
    } else {
      return null;
    }

    return (
      <>
        {value && value.length ?
          <Carousel
            value={value}
            showIndicators={false}
            numVisible={page.columnsCount}
            numScroll={1}
            itemTemplate={itemTemplate}
          />
          :
          <p className="m-auto text-center p-4">
            <span className="no-data-home-page flex justify-content-center align-items-center">
              <FontAwesomeIcon className="mr-2" style={{color: '#fff', fontSize: '2.5rem'}} icon={faDatabase} />
              no data
            </span>
          </p>
        }
      </>
    );
  };

  return (<>
  { loading ? <LoadingComponent/> :
    <>
    <div className="container md:mx-4 sm:mx-2 lg:mx-8 overflow-hidden">
      <div id="image-container-home">
        <div className="md:col-12 lg:col-12 md:w-full lg:w-full text-center home">
          <h1 className="my-6 get-rp">Get Your Trip With Ge<span className="secondery">t</span>rip</h1>
          <div className="md:w-9 lg:w-9 m-auto">
            <SearchBar
              onLocationSelect={(location: LocationFromSearch) =>  setSelectedLocationFromSearch(location)}
              onSelectFilterData={(_filterData: QueryFilter) => setSelectFilterData(_filterData)}
              SearchBarStyle={{width: '100%', border: '1px solid #ddd', backgroundColor: '#fff', padding: '15px 10px', borderRadius: '2px'}}
            />
          </div>
        </div>
      </div>

      {homePageRows.map((page: HomePageRowDTO) => (
        <div key={page.id} className="home-card mb-5">
          {page.title && <h2 className="black mx-6">{page.title}</h2>}
          {page.description && <p className="black mx-6">{page.description}</p>}
          {page.isSlider && renderCarousel(page)}
        </div>
      ))}
    </div>
    <Footer />
    </>
  }
  </>);
};

export default Home;
