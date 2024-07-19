import { Button } from "primereact/button";
import imageCardCarouselOne from "../Assets/b.png";
import imageCardCarouselTow from "../Assets/3.png";
import icon1 from "../Assets/car.png";
import icon2 from "../Assets/gps.png";
import icon3 from "../Assets/limousine.png";
import icon4 from "../Assets/fi.png";
import nature1 from "../Assets/n1.png";
import nature2 from "../Assets/n2.png";
import nature3 from "../Assets/n3.png";
import nature4 from "../Assets/n4.png";
import "../styles/home.scss";
import "../styles/Searchbar.scss";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { GetAllCountries, GetAllLanguages, GetAllServices, GetCurrency, Getlogged } from "../Services";
import { Carousel } from "primereact/carousel";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import { LocationFromSearch, QueryFilter } from "../modules/getrip.modules";
import { DataType } from "../enums";

const Home = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const [services, setServices] = useState<any>();
  const [country, setCountry] = useState<any>();
  const [language, setLanguage] = useState<any>();
  const [currency, setCurrency] = useState<any>();
  const navigate = useNavigate();
  const [selectedLocationFromSearch, setSelectedLocationFromSearch] = useState<LocationFromSearch | null>(null);
  const [selectFilterData, setSelectFilterData] = useState<QueryFilter | null>(null);

  useEffect(() => {
    const { language, country, currency } = JSON.parse(localStorage.getItem('externalDataToLocalStorage') || '{}');

    GetAllServices().then((res)=> setServices(res?.data));

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

  const opportunities = [
    {
      title: "Drive Around Istanbul",
      subTitle: "Rent a car for easy exploration and flexibility during your trip",
      header: <Image src={icon1} alt={'Card'} style={{ width: "30%", paddingTop: "40px", paddingLeft: "20px" }} imageStyle={{ width: '30%', height: '30%'}} />
    },
    {
      title: "Discover Dining Spots",
      subTitle: "Find the best restaurants and cafés for delightful experiences",
      header: <Image src={icon2} alt={'Card'} style={{ width: "30%", paddingTop: "40px", paddingLeft: "20px" }} imageStyle={{ width: '30%', height: '30%'}} />
    },
    {
      title: "Luxury Airport Transfer",
      subTitle: "Exclusive transportation from the airport to your destination",
      header: <Image src={icon3} alt={'Card'} style={{ width: "30%", paddingTop: "40px", paddingLeft: "20px" }} imageStyle={{ width: '30%', height: '30%'}} />
    },
    {
      title: "Plan Your Trip",
      subTitle: "Browse hotels and plan your Istanbul itinerary hassle-free",
      header: <Image src={icon4} alt={'Card'} style={{ width: "30%", paddingTop: "40px", paddingLeft: "20px" }} imageStyle={{ width: '30%', height: '30%'}} />
    }
  ];

  const reconnects = [
    {
      title: "Belgrad Forest",
      subTitle: "Northern Istanbul",
      header: <Image src={nature1} alt={'Card'} />,
      description: "Lush woodland for tranquil walks and picnics."
    },
    {
      title: "Polonezköy Nature Park",
      subTitle: "Eastern Istanbul",
      header: <Image src={nature2} alt={'Card'} />,
      description: "Forested area with hiking trails and horseback riding."
    },
    {
      title: "Yoros Castle and Anadolu Kavağı",
      subTitle: "Northern Istanbul, the Asian side",
      header: <Image src={nature3} alt={'Card'} />,
      description: "Historic castle ruins with coastal walks and seafood dining."
    },
    {
      title: "Atatürk Arboretum",
      subTitle: "Western Istanbul, in Sarıyer district",
      header: <Image src={nature4} alt={'Card'} />,
      description: "Botanical garden with diverse plant species for leisurely strolls."
    }
  ];

  const images = [
    imageCardCarouselOne,
    imageCardCarouselTow,
    imageCardCarouselOne,
    imageCardCarouselTow
  ];

  const renderImage = (image: string) => {
    return <Image src={image} alt="Product" style={{width: '100%', padding: '0 10px'}} imageStyle={{ width: '95%', height: '100%'}} />;
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
                onClick={() => navigate(`/service-details/${DataType.Service.toLowerCase()}/${service.id}`)}
              >
                Show details
              </Button>
            </Card>;
  };

  const renderOpportunities = (opportunitie: any) => {
    return  <Card
              title={opportunitie.title}
              subTitle={opportunitie.subTitle}
              header={opportunitie.header}
              className="md:w-21rem m-2 m-home-card pt-4"
              style={{ height: "17rem"}}
            ></Card>;
  };

  const renderReconnects = (reconnect: any) => {
    return <Card
              title={reconnect.title}
              subTitle={reconnect.subTitle}
              header={reconnect.header}
              style={{ height: "30rem" }}
              className="md:w-21rem m-2 m-home-card"
            >
              <div className=" mb-0"><p>{reconnect.description}</p></div>
            </Card>;
  };

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
  }

  return (<>
    <div className="container mx-8 overflow-hidden">
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

      <div className="home-card mb-5">
        <Carousel
          value={images}
          showIndicators={false}
          numVisible={2}
          numScroll={1}
          itemTemplate={renderImage} />
      </div>

      {services && services.length > 0 &&
        <div className="text-xl home-card service-home-card mb-5">
          <h2 className="black mx-6">Last-minute weekend deals</h2>
          <Carousel
            value={services}
            showIndicators={false}
            numVisible={4}
            numScroll={1}
            itemTemplate={renderServices} />
        </div>
      }

      <div className="text-xl home-card mb-5">
        <h2 className="black mx-6">Explore your travel opportunities with GE<span className="secondery">T</span>RIP!</h2>
        <Carousel
          value={opportunities}
          showIndicators={false}
          numVisible={4}
          numScroll={1}
          itemTemplate={renderOpportunities} />
      </div>

      <div className="text-xl home-card mb-5">
        <h2 className="black mx-6">Reconnect with the Earth</h2>
        <Carousel
          value={reconnects}
          showIndicators={false}
          numVisible={4}
          numScroll={1}
          itemTemplate={renderReconnects} />
      </div>
    </div>
    <Footer />
  </>);
};

export default Home;
