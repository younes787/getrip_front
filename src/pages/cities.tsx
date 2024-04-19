import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddCity, CreateCountry, GetAllCities, GetAllCountries, UpdateCountry } from "../Services";
import { useFormik } from "formik";
import { CitiesDTO, CountriesDTO } from "../modules/getrip.modules";

const Cites = () => {
  const [cities, setcities] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  useEffect(() => {
    GetAllCities().then((res) => setcities(res.data));
  }, []);
  const Cityform = useFormik<CitiesDTO>({
    initialValues: new CitiesDTO(),
    validateOnChange: true,
    onSubmit: () => {
        AddCity(Cityform.values);
      setShow(false);
    },
  });

  const CityformEdit = useFormik<CitiesDTO>({
    initialValues: new CitiesDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateCountry(CityformEdit.values);
      setShowEdit(false);
    },
  });
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    CityformEdit.setValues({
      description: rowData.description,
      name: rowData.name,
    });
  };
  const BodyTemplate = (rowData: any) => {
    return (
      <div className="gap-3">
        <i
          className="pi pi-bold pi-pencil"
          onClick={() => ShowUser(rowData)}
          style={{
            fontSize: "1.2rem",
            color: "slateblue",
            padding: "7px",
            cursor: "pointer",
          }}
        ></i>
      </div>
    );
  };
  return (
    <>
      <Button
        label="Add New City"
        onClick={() => setShow(true)}
        size="small"
        className="mt-4 ml-5 pr_btn"
      ></Button>
      <DataTable
        value={cities}
        stripedRows
        showGridlines
        className=" p-5"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="name" header="Country Name"></Column>
        <Column field="description" sortField="" header="Description"></Column>
        <Column field="" header="Actions" body={BodyTemplate}></Column>
      </DataTable>
      <></>
      <Dialog
        header="Add New City"
        visible={show}
        style={{ width: "50vw" }}
        onHide={() => setShow(false)}
        footer={
          <>
            <div>
              <Button
                label="Save"
                size="small"
                severity="warning"
                outlined
                onClick={() => Cityform.handleSubmit()}
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
        <div className="grid gap-4">
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Status">
              {" "}
              Country Name{" "}
            </label>
            <InputText
              placeholder="Country Name"
              name="name"
              value={Cityform?.values?.name}
              onChange={(e) =>
                Cityform.setFieldValue("name", e.target.value)
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
              value={Cityform?.values?.description}
              onChange={(e) =>
                Cityform.setFieldValue("description", e.target.value)
              }
            />
          </div>
        </div>
      </Dialog>
      <></>
      <Dialog
        header="Edit Country"
        visible={showEdit}
        style={{ width: "50vw" }}
        onHide={() => setShowEdit(false)}
        footer={
          <>
            <div>
              <Button
                label="Edit"
                outlined
                severity="warning"
                size="small"
                onClick={() => CityformEdit.handleSubmit()}
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
        <div className="grid gap-4">
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Status">
              {" "}
              Country Name{" "}
            </label>
            <InputText
              placeholder="Country Name"
              name="name"
              value={CityformEdit?.values?.name}
              onChange={(e) =>
                CityformEdit.setFieldValue("name", e.target.value)
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
              value={CityformEdit?.values?.description}
              onChange={(e) =>
                CityformEdit.setFieldValue("description", e.target.value)
              }
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Cites;
