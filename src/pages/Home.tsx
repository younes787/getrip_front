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
import { TabPanel, TabView } from "primereact/tabview";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { GetAllServices } from "../Services";
import { Carousel } from "primereact/carousel";

const Home = () => {
  const [services, setServices] = useState<any>();

  useEffect(()=>{
    GetAllServices().then((res)=> setServices(res?.data))
  },[]);

  const opportunities = [
    {
      title: "Drive Around Istanbul",
      subTitle: "Rent a car for easy exploration and flexibility during your trip",
      header: <img alt="Card" src={icon1} style={{ width: "30%", paddingTop: "40px", paddingLeft: "20px" }}/>,
    },
    {
      title: "Discover Dining Spots",
      subTitle: "Find the best restaurants and cafés for delightful experiences",
      header: <img alt="Card" src={icon2} style={{ width: "30%", paddingTop: "40px", paddingLeft: "20px" }}/>,
    },
    {
      title: "Luxury Airport Transfer",
      subTitle: "Exclusive transportation from the airport to your destination",
      header: <img alt="Card" src={icon3} style={{ width: "30%", paddingTop: "40px", paddingLeft: "20px" }}/>,
    },
    {
      title: "Plan Your Trip",
      subTitle: "Browse hotels and plan your Istanbul itinerary hassle-free",
      header: <img alt="Card" src={icon4} style={{ width: "30%", paddingTop: "40px", paddingLeft: "20px" }}/>,
    }
  ];

  const reconnects = [
    {
      title: "Belgrad Forest",
      subTitle: "Northern Istanbul",
      header: <img alt="Card" src={nature1} />,
      description: "Lush woodland for tranquil walks and picnics."
    },
    {
      title: "Polonezköy Nature Park",
      subTitle: "Eastern Istanbul",
      header: <img alt="Card" src={nature2} />,
      description: "Forested area with hiking trails and horseback riding."
    },
    {
      title: "Yoros Castle and Anadolu Kavağı",
      subTitle: "Northern Istanbul, the Asian side",
      header: <img alt="Card" src={nature3} />,
      description: "Historic castle ruins with coastal walks and seafood dining."
    },
    {
      title: "Atatürk Arboretum",
      subTitle: "Western Istanbul, in Sarıyer district",
      header: <img alt="Card" src={nature4} />,
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
    return <img src={image} alt="Product" className="mx-2"/>;
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
                  <Button icon="pi pi-info" rounded outlined aria-label="Filter"  size="small" severity="info"/>
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

  return (
    <>
      <div className="container mx-8 overflow-hidden">
        <div id="imageContainer" className="mb-5">
          <div className="md:col-12 lg:col-12 md:w-full lg:w-full text-center home">

            <h1 className="my-6 get-rp">Get Your Trip With Ge<span className="secondery">t</span>rip</h1>

            <div className="md:w-7 lg:w-7 m-auto border-1" style={{ borderColor: '#ddd'}}>
              <TabView>
                <TabPanel header={<span><i className="pi pi-search mr-2"></i> Search All</span>}>
                  <div className="search__bar justify-content-center align-items-center">
                    <form className="grid justify-content-center gap-4">
                      <div className="grid gap-3 form__group form__group-fast">
                        <span>
                          <i className="ml-4 pi pi-map-marker"></i>
                        </span>

                        <div>
                          <input type="text" className="mt-3" placeholder="Search By Hotel Name"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-fast">
                        <span>
                          <i className=""></i>
                        </span>
                        <div>
                          <input type="datetime-local" className="mt-3" placeholder="Date"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-last">
                        <span>
                          <i className="ri-group-line"></i>
                        </span>
                        <div>
                          <input type="number" className="mt-4" placeholder="0"/>
                        </div>
                      </div>

                      <span className="search__icon">
                        <Button label="Search" rounded severity="warning" className="mt-2"/>
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
                          <input type="text" className="mt-3" placeholder="Search By Hotel Name"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-fast">
                        <span>
                          <i className=""></i>
                        </span>
                        <div>
                          <input type="datetime-local" className="mt-3" placeholder="Date"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-last">
                        <span>
                          <i className="ri-group-line"></i>
                        </span>
                        <div>
                          <input type="number" className="mt-4" placeholder="0"/>
                        </div>
                      </div>

                      <span className="search__icon">
                        <Button label="Search" rounded severity="warning" className="mt-2"/>
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
                          <input type="text" className="mt-3" placeholder="Search By Hotel Name"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-fast">
                        <span>
                          <i className=""></i>
                        </span>
                        <div>
                          <input type="datetime-local" className="mt-3" placeholder="Date"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-last">
                        <span>
                          <i className="ri-group-line"></i>
                        </span>
                        <div>
                          <input type="number" className="mt-4" placeholder="0"/>
                        </div>
                      </div>

                      <span className="search__icon">
                        <Button label="Search" rounded severity="warning" className="mt-2"/>
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
                          <input type="text" className="mt-3" placeholder="Search By Hotel Name"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-fast">
                        <span>
                          <i className=""></i>
                        </span>
                        <div>
                          <input type="datetime-local" className="mt-3" placeholder="Date"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-last">
                        <span>
                          <i className="ri-group-line"></i>
                        </span>
                        <div>
                          <input type="number" className="mt-4" placeholder="0"/>
                        </div>
                      </div>

                      <span className="search__icon">
                        <Button label="Search" rounded severity="warning" className="mt-2"/>
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
                          <input type="text" className="mt-3" placeholder="Search By Hotel Name"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-fast">
                        <span>
                          <i className=""></i>
                        </span>
                        <div>
                          <input type="datetime-local" className="mt-3" placeholder="Date"/>
                        </div>
                      </div>

                      <div className="grid gap-3 form__group form__group-last">
                        <span>
                          <i className="ri-group-line"></i>
                        </span>
                        <div>
                          <input type="number" className="mt-4" placeholder="0"/>
                        </div>
                      </div>

                      <span className="search__icon">
                        <Button label="Search" rounded severity="warning" className="mt-2"/>
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
              itemTemplate={renderImage}
            />
        </div>

        <div className="text-xl home-card mb-5">
            <h2 className="black mx-6">Last-minute weekend deals</h2>
            <Carousel
              value={services}
              showIndicators={false}
              numVisible={4}
              numScroll={4}
              itemTemplate={renderServices}
            />
        </div>

        <div className="text-xl home-card mb-5">
            <h2 className="black mx-6">Explore your travel opportunities with GETIP!</h2>
            <Carousel
              value={opportunities}
              showIndicators={false}
              numVisible={4}
              numScroll={4}
              itemTemplate={renderOpportunities}
            />
        </div>

        <div className="text-xl home-card mb-5">
            <h2 className="black mx-6">Reconnect with the Earth</h2>
            <Carousel
              value={reconnects}
              showIndicators={false}
              numVisible={4}
              numScroll={4}
              itemTemplate={renderReconnects}
            />
        </div>
      </div>
    </>
  );
};

export default Home;
