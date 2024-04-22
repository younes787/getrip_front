import { useEffect, useState } from "react";
import { CreateServiceType, GetAllService, UpdateService } from "../Services";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { ServicesDTO } from "../modules/getrip.modules";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/Loading";
import { Tag } from "primereact/tag";

const Services = () => {
  const [serviceType, setServiceType] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate()
  const Servicesform = useFormik<ServicesDTO>({
    initialValues: new ServicesDTO(),
    validateOnChange: true,
    onSubmit: () => {
      CreateServiceType(Servicesform.values);
      setShow(false);
    },
  });

  const ServicesformEdit = useFormik<ServicesDTO>({
    initialValues: new ServicesDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateService(ServicesformEdit.values);
      setShowEdit(false);
    },
  });
  useEffect(() => {
    setLoading(true);
    GetAllService()
      .then((res) => {
        setServiceType(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);
  
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    ServicesformEdit.setValues({
      description: rowData.description,
      name: rowData.name,
    });
  };
  const footer = (s:any) => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button label="Update" size="small" icon="pi pi-pencil" onClick={() => ShowUser(s)} />
        <Button label="Attribute" size="small" severity="secondary" icon="pi pi-info-circle" style={{ marginLeft: '0.5em' }}  onClick={() => navigate(`attribute/${s.id}`)} />
    </div>
);

  return (
    <div>

     {loading ? <LoadingComponent />: <div>
      <Dialog
        header="Add New Service"
        visible={show}
        className="md:w-50 lg:w-50"
        onHide={() => setShow(false)}
        footer={
          <>
            <div>
              <Button
                label="Save"
                size="small"
                severity="warning"
                outlined
                onClick={() => Servicesform.handleSubmit()}
                className="mt-4"
              ></Button>
              <Button
                label="Cancel"
                severity="danger"
                outlined
                size="small"
                onClick={() => setShow(false)}
                className="mt-4"
              ></Button>
            </div>
          </>
        }
      >
        <div className="grid gap-4 mt-3">
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Status">
              {" "}
              Name{" "}
            </label>
            <InputText
              placeholder="Name"
              name="name"
              value={Servicesform?.values?.name}
              onChange={(e) =>
                Servicesform.setFieldValue("name", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Description{" "}
            </label>
            <InputText
              placeholder="Description"
              name="description"
              value={Servicesform?.values?.description}
              onChange={(e) =>
                Servicesform.setFieldValue("description", e.target.value)
              }
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Edit Service"
        visible={showEdit}
        className="md:w-50 lg:w-50"
        onHide={() => setShowEdit(false)}
        footer={
          <>
            <div>
              <Button
                label="Save"
                size="small"
                severity="warning"
                outlined
                onClick={() => ServicesformEdit.handleSubmit()}
                className="mt-4"
              ></Button>
              <Button
                label="Cancel"
                severity="danger"
                outlined
                size="small"
                onClick={() => setShowEdit(false)}
                className="mt-4"
              ></Button>
            </div>
          </>
        }
      >
        <div className="grid gap-4 mt-3">
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Status">
              {" "}
              Name{" "}
            </label>
            <InputText
              placeholder="Name"
              name="name"
              value={ServicesformEdit?.values?.name}
              onChange={(e) =>
                ServicesformEdit.setFieldValue("name", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Description{" "}
            </label>
            <InputText
              placeholder="Description"
              name="description"
              value={ServicesformEdit?.values?.description}
              onChange={(e) =>
                ServicesformEdit.setFieldValue("description", e.target.value)
              }
            />
          </div>
        </div>
      </Dialog>

      <div className="grid">
        {serviceType?.map((s: any) => (
          <Card
            title={
              <div>
                {s?.name}{" "}
              
              </div>
            }
            subTitle={<div style={{ color: "white" }}> {s?.attributes.map((a: any) => (
              <Tag  value={a.value} style={{ marginRight: "8px" }}
              > </Tag>
            ))}</div>}
            className="mt-5 ml-5 mb-5 service-card"
            footer={footer(s)}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
 <div style={{ paddingBottom: "40px" }}> 
    {s?.description}
  </div>          </Card>
        ))}
        <Card
          title="Add New Service"
          className="mt-5 ml-5 mb-5 service-card"
          onClick={() => setShow(true)}
        >
          <div className="text-center mt-5">
            <i className="pi pi-plus"></i>
          </div>
        </Card>
      </div>
      </div>}
    </div>
  );
};

export default Services;
