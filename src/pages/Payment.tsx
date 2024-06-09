import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddCurrency, GetCurrency, UpdateCurrency } from "../Services";
import { useFormik } from "formik";
import { ImageDTO, CurrencyDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";


const Payment = () => {
  const [payment, setPayment] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    price: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    apiKey: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    apiUrl: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    name: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
  });
  useEffect(() => {
    setLoading(true);
    GetCurrency().then((res) =>{ setPayment(res.data)
      setLoading(false)
    }).catch((error) => {
      setLoading(false);
    });
  }, []);
  const Currencyform = useFormik<CurrencyDTO>({
    initialValues: new CurrencyDTO(),
    validateOnChange: true,
    onSubmit: () => {
     AddCurrency(Currencyform.values);
      setShow(false);
    },
  });

  const CurrencyformEdit = useFormik<CurrencyDTO>({
    initialValues: new CurrencyDTO(),
    validateOnChange: true,
    onSubmit: () => {
        UpdateCurrency(CurrencyformEdit.values);
      setShowEdit(false);
    },
  });

  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    CurrencyformEdit.setValues({
      id: rowData.id,
      name: rowData.name,
      price: rowData.price,
      apiUrl: rowData.apiUrl,
      apiKey: rowData.apiKey,
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
     { loading ? <LoadingComponent/> : <div>
        <Button
          label="Add New Currency"
          onClick={() => setShow(true)}
          size="small"
          className="mt-4 ml-5 primary_btn"
        ></Button>
        <DataTable
          value={payment}
          stripedRows
          showGridlines
          className=" p-5"
          tableStyle={{ minWidth: "50rem" }}
          size="small"
          style={{ fontSize: "1.2rem", padding: "16px" }}
          resizableColumns
          rows={5}
          rowsPerPageOptions={[10, 15, 20, 50]}
          filters={filters}
          header={header}
          paginator
          rowHover
          sortMode="multiple"
        >
          <Column field="name" filter sortable header="name"></Column>
          <Column
            field="price"
            sortable filter
            header="Price"
          ></Column>
          <Column
            field="previousPrice"
            sortable filter
            header="Previous Price"
          ></Column>
          <Column
            field=""
            sortable
            header="Actions"
            body={BodyTemplate}
          ></Column>
        </DataTable>
        <></>
        <Dialog
          header="Add New Currency"
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
                  onClick={() => Currencyform.handleSubmit()}
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
                Currency Name{" "}
              </label>
              <InputText
                name="name"
                value={Currencyform.values.name}
                onChange={(e) =>
                  Currencyform.setFieldValue("name", e.target.value)
                }
              />
            </div>
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Price{" "}
                </label>
              </div>
              <InputNumber
                name="price"
                value={Currencyform.values.price}
                onChange={(e) =>
                  Currencyform.setFieldValue("price", e.value)
                }
                mode="decimal" minFractionDigits={2} maxFractionDigits={5}
              />
            </div>
          </div>
          <div className="grid mt-3">
            <div className="md:col-6 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="Status">
                  {" "}
                  Api Url{" "}
                </label>
              </div>
              <InputText
               name="apiUrl"
               value={Currencyform.values.apiUrl}
               onChange={(e) =>
                 Currencyform.setFieldValue("apiUrl", e.target.value)
               } />
            </div>
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Api Key{" "}
                </label>
              </div>
              <InputText
               name="apiKey"
               value={Currencyform.values.apiKey}
               onChange={(e) =>
                 Currencyform.setFieldValue("apiKey", e.target.value)
               } />
            </div>
          </div>
        </Dialog>
        <></>
        <Dialog
          header="Edit Currency"
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
                  onClick={() => CurrencyformEdit.handleSubmit()}
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
        <div className="grid mt-3">
            <div className="md:col-6 lg:col-6">
              <label className="mb-2" htmlFor="Status">
                {" "}
                Currency Name{" "}
              </label>
              <InputText
                name="name"
                value={CurrencyformEdit.values.name}
                onChange={(e) =>
                    CurrencyformEdit.setFieldValue("name", e.target.value)
                }
              />
            </div>
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Price{" "}
                </label>
              </div>
              <InputNumber
                name="price"
                value={CurrencyformEdit.values.price}
                onChange={(e) =>
                    CurrencyformEdit.setFieldValue("price", e.value)
                }
                mode="decimal" minFractionDigits={2} maxFractionDigits={5}
              />
            </div>
          </div>
          <div className="grid mt-3">
            <div className="md:col-6 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="Status">
                  {" "}
                  Api Url{" "}
                </label>
              </div>
              <InputText
               name="apiUrl"
               value={CurrencyformEdit.values.apiUrl}
               onChange={(e) =>
                CurrencyformEdit.setFieldValue("apiUrl", e.target.value)
               } />
            </div>
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Api Key{" "}
                </label>
              </div>
              <InputText
               name="apiKey"
               value={CurrencyformEdit.values.apiKey}
               onChange={(e) =>
                CurrencyformEdit.setFieldValue("apiKey", e.target.value)
               } />
            </div>
          </div>
        </Dialog>
      </div>}
    </div>
  );
};

export default Payment;
