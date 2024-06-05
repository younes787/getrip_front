import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { CreateCountry, GetAllCountries, UpdateCountry } from "../Services";
import { useFormik } from "formik";
import { CountriesDTO } from "../modules/getrip.modules";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";
import { InputNumber } from "primereact/inputnumber";

const Logistics = () => {
  const [countries, setCountries] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    countryCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    setLoading(true);
    GetAllCountries().then((res) => {setCountries(res.data)
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    });
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
      id: rowData.id,
      name: rowData.name,
      countryCode: rowData.countryCode,
      taxRate: rowData.taxRate,
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

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div>
      {loading ? <LoadingComponent/> : <>
        <Button label="Add New Country" onClick={() => setShow(true)} size="small" className="mt-4 ml-5 pr_btn"></Button>

        <DataTable
          value={countries}
          stripedRows
          showGridlines
          className=" p-5"
          tableStyle={{ minWidth: "50rem" }}
          size="small"
          style={{ fontSize: "1.2rem", padding: '16px' }}
          resizableColumns
          rows={5}
          rowsPerPageOptions={[10, 15, 20, 50]}
          filters={filters}
          header={header}
          paginator
          rowHover
          sortMode="multiple"
        >
          <Column sortable filter field="name" header="Country Name"></Column>
          <Column sortable filter field="countryCode" sortField="" header="Country Code"></Column>
          <Column sortable filter field="taxRate" sortField="" header="Tax Rate"></Column>
          <Column   field="" header="Actions" body={BodyTemplate}></Column>
        </DataTable>

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
              <label className="mb-2" htmlFor="Status">{" "}Country Name{" "}</label>
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
              <label className="mb-2" htmlFor="Wallet">{" "}Country Code{" "}</label>
              <InputText
                placeholder="Country Code"
                name="countryCode"
                value={Countryform?.values?.countryCode}
                onChange={(e) => Countryform.setFieldValue("countryCode", e.target.value)}
              />
            </div>

            <div className="md:col-4 lg:col-4">
              <label className="mb-2" htmlFor="Status">{" "}Tax Rate{" "}</label>
              <InputNumber
                placeholder="Tax Rate"
                name="taxRate"
                value={Countryform.values.taxRate}
                onChange={(e) => Countryform.setFieldValue("taxRate", e.value)}
              />
            </div>
          </div>
        </Dialog>

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
              <label className="mb-2" htmlFor="Status">{" "}Country Name{" "}</label>
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
              <label className="mb-2" htmlFor="Wallet">{" "}Country Code{" "}</label>
              <InputText
                placeholder="Country Code"
                name="countryCode"
                value={CountryformEdit?.values?.countryCode}
                onChange={(e) =>
                  CountryformEdit.setFieldValue("countryCode", e.target.value)
                }
              />
            </div>

            <div className="md:col-4 lg:col-4">
              <label className="mb-2" htmlFor="Status">{" "}Tax Rate{" "}</label>
              <InputNumber
                placeholder="Tax Rate"
                name="taxRate"
                value={Countryform.values.taxRate}
                onChange={(e) => Countryform.setFieldValue("taxRate", e.value)}
              />
            </div>
          </div>
        </Dialog></>
      }
    </div>
  );
};

export default Logistics;
