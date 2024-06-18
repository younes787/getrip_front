import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { GetMyServices } from "../Services";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import LoadingComponent from "../components/Loading";
import { ServiceDTO } from "../modules/getrip.modules";
import { Dialog } from "primereact/dialog";
import { Paginator } from "primereact/paginator";

const MyServices = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any);
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(null);

  useEffect(() => {
    setLoading(true);

    GetMyServices(User?.data?.accountId, currentPage, 10).then((res) => {
      setServices(res?.data?.items);
      setTotalRecords(res?.data?.totalItems);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    }).finally(() => {
      setLoading(false);
    });
  }, [currentPage]);

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
  };

  const onServiceDetailClick = (service: ServiceDTO) => {
    setSelectedService(service);
  };

  return (
    <>
      <div className="">
        {loading ? <LoadingComponent /> :
          <div className="grid grid-cols-12 m-3">
            {services.length > 0 ? (
              <>
                {services.map((service: ServiceDTO, index: number) => (
                  <div key={index} className="md:col-3 lg:col-3 my-2">
                    <Card
                      title={service.name}
                      subTitle={service.description}
                      header={<Image src={(service.photos && service?.photos[0]?.imagePath) ? service?.photos[0]?.imagePath : null} alt={(service.photos && service?.photos[0]?.imagePath) ? service?.photos[0]?.imagePath : null} preview />}
                    >
                      <div className="grid mb-0">
                        <div className="col-8">
                          <p>9.0/10</p>
                          <p>(900 REVIEWS)</p>
                          <Button icon="pi pi-info" rounded outlined aria-label="Filter" size="small" severity="info" onClick={() => onServiceDetailClick(service)} />
                        </div>
                        <div className="col-4">
                          <h3>{service?.price}</h3>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}

                <Paginator
                  first={(currentPage - 1) * 10}
                  rows={10}
                  totalRecords={totalRecords}
                  onPageChange={onPageChange}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                />
              </>
            ) : (
              <span className="w-full text-center flex justify-content-center align-items-center text-red-500 text-xl italic mt-4">You don't have services</span>
            )}
          </div>
        }
      </div>

      <Dialog header="Service Details" visible={selectedService !== null} style={{ width: '50vw' }} onHide={() => setSelectedService(null)}>
        {selectedService && (
          <>
            <h2>{selectedService.name}</h2>
            <p>{selectedService.description}</p>
            <Image
              src={(selectedService.photos && selectedService?.photos[0]?.imagePath) ? selectedService?.photos[0]?.imagePath : null}
              alt={(selectedService.photos && selectedService?.photos[0]?.imagePath) ? selectedService?.photos[0]?.imagePath : null}
              imageStyle={{width: '100%'}}
            />
            <p>Price: {selectedService.price}</p>
            <p>Rating: 9.0/10</p>
            <p>Reviews: (900 REVIEWS)</p>
          </>
        )}
      </Dialog>
    </>
  );
}

export default MyServices;
