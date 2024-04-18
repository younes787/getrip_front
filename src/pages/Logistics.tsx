import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { CreateCountry, GetAllCountries, UpdateCountry } from "../Services";
import { useFormik } from "formik";
import { CountriesDTO } from "../modules/getrip.modules";

const Logistics = () => {
  const [countries, setCountries] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  useEffect(() => {
    GetAllCountries().then((res) => setCountries(res.data));
  }, []);
  const Countryform = useFormik<CountriesDTO>({
    initialValues: new CountriesDTO(),
    validateOnChange: true,
    onSubmit: () => {
      CreateCountry(Countryform.values);
      setShow(false);
    },
  });

  const CountryformEdit = useFormik<CountriesDTO>({
    initialValues: new CountriesDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateCountry(CountryformEdit.values);
      setShowEdit(false);
    },
  });
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    CountryformEdit.setValues({
      countryCode: rowData.countryCode,
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
        label="Add New Country"
        onClick={() => setShow(true)}
        size="small"
        className="mt-4 ml-5 pr_btn"
      ></Button>
      <DataTable
        value={countries}
        stripedRows
        showGridlines
        className=" p-5"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="countryCode" sortField="" header="Country Code"></Column>
        <Column field="name" header="Country Name"></Column>
        <Column field="" header="Actions" body={BodyTemplate}></Column>
      </DataTable>
      <></>
      <Dialog
        header="Add New Country"
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
                onClick={() => Countryform.handleSubmit()}
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
              value={Countryform?.values?.name}
              onChange={(e) =>
                Countryform.setFieldValue("name", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Country Code{" "}
            </label>
            <InputText
              placeholder="Country Code"
              name="countryCode"
              value={Countryform?.values?.countryCode}
              onChange={(e) =>
                Countryform.setFieldValue("countryCode", e.target.value)
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
                onClick={() => CountryformEdit.handleSubmit()}
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
              value={CountryformEdit?.values?.name}
              onChange={(e) =>
                CountryformEdit.setFieldValue("name", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Country Code{" "}
            </label>
            <InputText
              placeholder="Country Code"
              name="countryCode"
              value={CountryformEdit?.values?.countryCode}
              onChange={(e) =>
                CountryformEdit.setFieldValue("countryCode", e.target.value)
              }
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Logistics;
