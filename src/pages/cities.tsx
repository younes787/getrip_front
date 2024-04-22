import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddCity, GetAllCities, GetAllProvinces, GetCitiesbyid, UpdateCity } from "../Services";
import { useFormik } from "formik";
import { CitiesDTO } from "../modules/getrip.modules";
import SideBar from "../components/SideBar";
import LoadingComponent from "../components/Loading";

const Cites = () => {
  const [cities, setcities] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [provinces , setProvinces] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    GetAllCities().then((res) => {setcities(res.data)
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    });
    GetAllProvinces().then((res) => setProvinces(res.data));
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
        UpdateCity(CityformEdit.values);
      setShowEdit(false);
    },
  });
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    CityformEdit.setValues({
      description: rowData.description,
      name: rowData.name,
      provinceId: rowData.provinceId,
      id:rowData.id
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
    <div>
   {loading ? <LoadingComponent/> : <div>
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
        size="small"
        style={{ fontSize: "1.2rem", padding: '16px' }}
        resizableColumns
        rows={5}
        rowsPerPageOptions={[10, 15, 20, 50]}
        // filters={filters.value}
        filterDisplay="menu"
        globalFilterFields={['global']}
        paginator
        rowHover
        sortMode="multiple"
      >
        <Column field="name" sortable header="City Name"></Column>
        <Column field="description" sortable  header="Description"></Column>
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
        <div className="grid mt-3">
        <div className="md:col-6 lg:col-6">
        <label className="mb-2" htmlFor="Status">
              {" "}
              Province Name{" "}
            </label>
        <Dropdown
            placeholder="Select a Province"
            options={provinces as any}
            optionLabel="name"
            optionValue="id"
            name="provinceId"
            className="w-full"
            value={Cityform?.values?.provinceId}
            onChange={(e) => Cityform.setFieldValue("provinceId", e.target.value)
            }
          />
        </div>
          <div className="md:col-5 lg:col-5">
            <label className="mb-2" htmlFor="">
              {" "}
              City Name{" "}
            </label>
            <InputText 
          name="name"
          value={Cityform.values.name}
          onChange={(e)=> Cityform.setFieldValue('name' , e.target.value)} />
          </div>
          </div>

          <div className="grid gap-4">
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
        header="Edit City"
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
        <div className="grid">
        <div className="md:col-6 lg:col-6">
        <label className="mb-2" htmlFor="Status">
              {" "}
              Province Name{" "}
            </label>
          <Dropdown
            placeholder="Select a Province"
            options={provinces as any}
            optionLabel="name"
            optionValue="id"
            name="provinceId"
            className="w-full"
            value={CityformEdit?.values?.provinceId}
            onChange={(e) =>     CityformEdit.setFieldValue("provinceId", e.target.value)
          }
          />
          </div>
          <div className="md:col-6 lg:col-6">
            <label className="mb-2" htmlFor="Status">
              {" "}
              City Name{" "}
            </label>
          <InputText 
          name="name"
          value={CityformEdit.values.name}
          onChange={(e)=> CityformEdit.setFieldValue('name' , e.target.value)} />
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
      </div>}
    </div>
  );
};

export default Cites;
