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
import { TabPanel, TabView } from "primereact/tabview";
import { Carousel } from "primereact/carousel";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const [services, setServices] = useState<any>();
  const [country, setCountry] = useState<any>();
  const [language, setLanguage] = useState<any>();
  const [currency, setCurrency] = useState<any>();
  const navigate = useNavigate();

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
                subTitle={service.description}
                header={ <Image  src={service?.photos[0]?.imagePath && service?.photos[0]?.imagePath } alt={service.photos}  preview />}
                className="md:w-21rem"
              >
              <div className="grid mb-0">
                <div className="col-8">
                  <p>9.0/10</p>
                  <p>(900 REVIEWS)</p>
                  <Button
                    label="Show details"
                    className="my-2"
                    rounded
                    outlined
                    aria-label="Filter"
                    size="small"
                    severity="info"
                    onClick={() => {
                      navigate(`/service-details/${service.id}`);
                    }}
                  />
                </div>
                <div className="col-4">
                  <h3>{service?.price}</h3>
                </div>
              </div>
            </Card>;
  };

  const renderOpportunities = (opportunitie: any) => {
    return  <Card
              title={opportunitie.title}
              subTitle={opportunitie.subTitle}
              header={opportunitie.header}
              className="md:w-21rem"
              style={{ height: "17rem" }}
            ></Card>;
  };

  const renderReconnects = (reconnect: any) => {
    return <Card
              title={reconnect.title}
              subTitle={reconnect.subTitle}
              header={reconnect.header}
              style={{ height: "27rem" }}
              className="md:w-21rem"
            >
              <div className=" mb-0"><p>{reconnect.description}</p></div>
            </Card>;
  };

  const Footer = () => {
    return (
      <footer className="footer grid grid-cols-12">
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
      <div id="image-container-home" className="mb-5">
        <div className="md:col-12 lg:col-12 md:w-full lg:w-full text-center home">

          <h1 className="my-6 get-rp">Get Your Trip With Ge<span className="secondery">t</span>rip</h1>

          <div className="md:w-7 lg:w-7 m-auto border-1" style={{ borderColor: '#ddd' }}>
            <TabView>
              <TabPanel header={<span><i className="pi pi-search mr-2"></i> Search All</span>}>
                <div className="search__bar justify-content-center align-items-center">
                  <form className="grid justify-content-center gap-4">
                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className="ml-4 pi pi-map-marker"></i>
                      </span>

                      <div>
                        <input type="text" className="mt-3" placeholder="Search By Hotel Name" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className=""></i>
                      </span>
                      <div>
                        <input type="datetime-local" className="mt-3" placeholder="Date" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-last">
                      <span>
                        <i className="ri-group-line"></i>
                      </span>
                      <div>
                        <input type="number" className="mt-4" placeholder="0" />
                      </div>
                    </div>

                    <span className="search__icon">
                      <Button label="Search" rounded severity="warning" className="mt-2" />
                    </span>
                  </form>
                </div>
              </TabPanel>

              <TabPanel header={<span><i className="pi pi-building mr-2"></i> Yacht Bookings</span>}>
                <div className="search__bar justify-content-center align-items-center">
                  <form className="grid justify-content-center gap-4">
                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className="ml-4 pi pi-map-marker"></i>
                      </span>

                      <div>
                        <input type="text" className="mt-3" placeholder="Search By Hotel Name" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className=""></i>
                      </span>
                      <div>
                        <input type="datetime-local" className="mt-3" placeholder="Date" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-last">
                      <span>
                        <i className="ri-group-line"></i>
                      </span>
                      <div>
                        <input type="number" className="mt-4" placeholder="0" />
                      </div>
                    </div>

                    <span className="search__icon">
                      <Button label="Search" rounded severity="warning" className="mt-2" />
                    </span>
                  </form>
                </div>
              </TabPanel>

              <TabPanel header={<span><i className="pi pi-building mr-2"></i> Restaurants</span>}>
                <div className="search__bar justify-content-center align-items-center">
                  <form className="grid justify-content-center gap-4">
                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className="ml-4 pi pi-map-marker"></i>
                      </span>

                      <div>
                        <input type="text" className="mt-3" placeholder="Search By Hotel Name" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className=""></i>
                      </span>
                      <div>
                        <input type="datetime-local" className="mt-3" placeholder="Date" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-last">
                      <span>
                        <i className="ri-group-line"></i>
                      </span>
                      <div>
                        <input type="number" className="mt-4" placeholder="0" />
                      </div>
                    </div>

                    <span className="search__icon">
                      <Button label="Search" rounded severity="warning" className="mt-2" />
                    </span>
                  </form>
                </div>
              </TabPanel>

              <TabPanel header={<span><i className="pi pi-car mr-2"></i> Cottages</span>}>
                <div className="search__bar justify-content-center align-items-center">
                  <form className="grid justify-content-center gap-4">
                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className="ml-4 pi pi-map-marker"></i>
                      </span>

                      <div>
                        <input type="text" className="mt-3" placeholder="Search By Hotel Name" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className=""></i>
                      </span>
                      <div>
                        <input type="datetime-local" className="mt-3" placeholder="Date" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-last">
                      <span>
                        <i className="ri-group-line"></i>
                      </span>
                      <div>
                        <input type="number" className="mt-4" placeholder="0" />
                      </div>
                    </div>

                    <span className="search__icon">
                      <Button label="Search" rounded severity="warning" className="mt-2" />
                    </span>
                  </form>
                </div>
              </TabPanel>

              <TabPanel header={<span><i className="pi pi-caret-down mr-2"></i> Packages</span>}>
                <div className="search__bar justify-content-center align-items-center">
                  <form className="grid justify-content-center gap-4">
                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className="ml-4 pi pi-map-marker"></i>
                      </span>

                      <div>
                        <input type="text" className="mt-3" placeholder="Search By Hotel Name" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-fast">
                      <span>
                        <i className=""></i>
                      </span>
                      <div>
                        <input type="datetime-local" className="mt-3" placeholder="Date" />
                      </div>
                    </div>

                    <div className="grid gap-3 form__group form__group-last">
                      <span>
                        <i className="ri-group-line"></i>
                      </span>
                      <div>
                        <input type="number" className="mt-4" placeholder="0" />
                      </div>
                    </div>

                    <span className="search__icon">
                      <Button label="Search" rounded severity="warning" className="mt-2" />
                    </span>
                  </form>
                </div>
              </TabPanel>
            </TabView>
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
        <div className="text-xl home-card mb-5">
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
        <h2 className="black mx-6">Explore your travel opportunities with GETIP!</h2>
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
