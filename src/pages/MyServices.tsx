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
                    subTitle={service.description}
                    header={<Image src={(service.photos && service?.photos[0]?.imagePath) ? service?.photos[0]?.imagePath : null} alt={(service.photos && service?.photos[0]?.imagePath) ? service?.photos[0]?.imagePath : null} preview />}
                  >
                    <div className="grid mb-0">
                      <div className="col-8">
                        <p>9.0/10</p>
                        <p>(900 REVIEWS)</p>

                        <Button label="Show details" icon="pi pi-info" rounded outlined aria-label="Filter" size="small" severity="info" onClick={() => {
                            navigate(`/service-details/${service.id}`);
                          }}
                        />

                        <Button onClick={() => confirm(service.id)} icon="pi pi-times" label="Delete" className="mx-1" rounded outlined aria-label="Filter" size="small" severity="danger"/>
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
  );
}

export default MyServices;
