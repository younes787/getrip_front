import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddProvince, GetAllCountries, GetAllProvinces, UpdateProvince } from "../Services";
import { useFormik } from "formik";
import { EditProvincesDTO, ProvincesDTO } from "../modules/getrip.modules";

const Provinces = () => {
  const [provinces, setProvinces] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [countries , setCountries] = useState<any>()

  useEffect(() => {
    GetAllProvinces().then((res) => setProvinces(res.data));
    GetAllCountries().then((res) => setCountries(res.data));
  }, []);
  const Provincesform = useFormik<ProvincesDTO>({
    initialValues: new ProvincesDTO(),
    validateOnChange: true,
    onSubmit: () => {
        AddProvince(Provincesform.values);
      setShow(false);
    },
  });

  const ProvinceformEdit = useFormik<EditProvincesDTO>({
    initialValues: new EditProvincesDTO(),
    validateOnChange: true,
    onSubmit: () => {
        UpdateProvince(ProvinceformEdit.values);
      setShowEdit(false);
    },
  });
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    ProvinceformEdit.setValues({
      name: rowData.name,
      countryId: rowData.countryId,
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
    <div>
      <Button
        label="Add New Province"
        onClick={() => setShow(true)}
        size="small"
        className="mt-4 ml-5 pr_btn"
      ></Button>
      <DataTable
        value={provinces}
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
        <Column field="name" sortable header="Province Name"></Column>
        <Column field="" sortable header="Actions" body={BodyTemplate}></Column>
      </DataTable>
      <></>
      <Dialog
        header="Add New Province"
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
                onClick={() => Provincesform.handleSubmit()}
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
              Country Name{" "}
            </label>
        <Dropdown
            placeholder="Select a Country"
            options={countries}
            optionLabel="name"
            optionValue="id"
            name="countryId"
            className="w-full"
            value={(Provincesform?.values?.countryId)}
            onChange={(e) => Provincesform.setFieldValue('countryId' , e.value)
            }
          />
        </div>
          <div className="md:col-5 lg:col-5">
            <label className="mb-2" htmlFor="">
              {" "}
              Province Name{" "}
            </label>
            <InputText 
          name="name"
          value={Provincesform.values.name}
          onChange={(e)=> Provincesform.setFieldValue('name' , e.target.value)} />
          </div>
          </div>
      </Dialog>
      <></>
      <Dialog
        header="Edit Province"
        visible={showEdit}
        className="md:w-50 lg:w-50"
        onHide={() => setShowEdit(false)}
        footer={
          <>
            <div>
              <Button
                label="Edit"
                outlined
                severity="warning"
                size="small"
                onClick={() => ProvinceformEdit.handleSubmit()}
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
            placeholder="Select a Country"
            options={countries as any}
            optionLabel="name"
            optionValue="id"
            name="countryId"
            className="w-full"
            value={ProvinceformEdit?.values?.countryId}
            onChange={(e) => ProvinceformEdit.setFieldValue('countryId', e.value)}
          />
          </div>
          <div className="md:col-6 lg:col-6">
            <label className="mb-2" htmlFor="Status">
              {" "}
              Province Name{" "}
            </label>
          <InputText 
          name="name"
          value={ProvinceformEdit.values.name}
          onChange={(e)=> ProvinceformEdit.setFieldValue('name' , e.target.value)} />
          </div>
        </div>
      </Dialog>
      </div>
    </div>
  );
};

export default Provinces;
