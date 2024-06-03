import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { GetMyServices } from "../Services";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import LoadingComponent from "../components/Loading";
import { ServiceDTO } from "../modules/getrip.modules";

const MyServices = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

   useEffect(()=>{
     setLoading(true);

     GetMyServices(User?.data?.accountId, 1, 50).then((res)=> {
       setServices(res?.data?.items);
       setLoading(false);
     }).catch((error) => {
       setLoading(false);
     }).finally(() => {
       setLoading(false);
     });
   },[]);

    return(<>
      <div className="">
          {loading ? <LoadingComponent/> :
            <div className="grid grid-cols-12 m-3">
              {services?.map((service: ServiceDTO, index: number) => (
                <div className="md:col-3 lg:col-3 my-2">
                  <Card
                      key={index}
                      title={service.name}
                      subTitle={service.description}
                      header={ <Image  src={(service.photos && service?.photos[0]?.imagePath) ?  service?.photos[0]?.imagePath : null } alt={(service.photos && service?.photos[0]?.imagePath) ? service?.photos[0]?.imagePath : null}  preview />}
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
                  </Card>
                </div>
                ))
              }
            </div>
          }
      </div>
    </>)
}

export default MyServices;
