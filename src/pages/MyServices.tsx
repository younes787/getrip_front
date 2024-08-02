import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { DeleteService, GetMyServices } from "../Services";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import LoadingComponent from "../components/Loading";
import { ServiceDTO } from "../modules/getrip.modules";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import { DataType } from "../enums";

const MyServices = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any);
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const navigate = useNavigate();

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

  const confirm = (id: any) => {
    confirmDialog({
      message: "Do you want to delete this user?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger py-2",
      rejectClassName: "p-button-outlined py-2",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      accept: () => DeleteService(id),
    });
  };

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
  };

  return (
    <div className="">
    <ConfirmDialog />

      {loading ? <LoadingComponent /> :
        <div className="grid grid-cols-12 m-3">
          {services.length > 0 ? (
            <>
              {services.map((service: ServiceDTO, index: number) => (
                <div key={index} className="md:col-3 lg:col-3 my-2">
                  <Card
                    title={service.name}
                    subTitle={<span><FontAwesomeIcon icon={faMapLocationDot} size="sm" style={{ color: 'rgb(102 101 101)' }} className="mr-2" />{service.description}</span>}
                    header={ <Image className="w-full" imageStyle={{borderRadius: '30px 30px 0 0', width: '100%', maxHeight: '220px'}} src={(service.photos && service?.photos[0]?.imagePath) ? service?.photos[0]?.imagePath : null} alt={(service.photos && service?.photos[0]?.imagePath) ? service?.photos[0]?.imagePath : null}  preview />}
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
                        bottom: '0',
                        right: '0'
                      }}
                      aria-label="Filter"
                      size="small"
                      onClick={() => navigate(`/service-details/${DataType.Service.toLowerCase()}/${service.id}`)}
                    >
                      Show details
                    </Button>

                    <Button
                      className="absolute delete-details"
                      icon={<span className="pi pi-times mx-1"></span>}
                      onClick={() => confirm(service.id)}
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: '0 30px 0 30px',
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        padding: '10px 25px',
                        bottom: '0',
                        left: '0'
                      }}
                      aria-label="Filter"
                      size="small"
                      severity="danger"
                    >
                      Delete
                    </Button>
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
  );
}

export default MyServices;
