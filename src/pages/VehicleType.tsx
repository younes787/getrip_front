import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import {
  AddImageToVihcles,
  AddVehicle,
  AddVehicleType,
  GetAllMakers,
  GetAllVehicles,
  GetAllVehiclesTypes,
  UpdateVehicle,
  UpdateVehicleType,
} from "../Services";
import { useFormik } from "formik";
import { ImageDTO, VehicleTypeDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";

const VehicleType = () => {
  const [vehicle, setVehicle] = useState<any>();
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
    description: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
  });
  useEffect(() => {
    setLoading(true);
    GetAllVehiclesTypes()
      .then((res) => {
        setVehicle(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);
  const Vehicleform = useFormik<VehicleTypeDTO>({
    initialValues: new VehicleTypeDTO(),
    validateOnChange: true,
    onSubmit: () => {
      AddVehicleType(Vehicleform.values);
      setShow(false);
    },
  });

  const VehicleformEdit = useFormik<VehicleTypeDTO>({
    initialValues: new VehicleTypeDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateVehicleType(VehicleformEdit.values);
      setShowEdit(false);
    },
  });
  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    VehicleformEdit.setValues({
      id: rowData.id,
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
      {loading ? (
        <LoadingComponent />
      ) : (
        <div>
          <Button
            label="Add New Vehicle"
            onClick={() => setShow(true)}
            size="small"
            className="mt-4 ml-5 primary_btn"
          ></Button>
          <DataTable
            value={vehicle}
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
            <Column field="name" filter sortable header="Name"></Column>
            <Column
              field="description"
              sortable
              filter
              header="Description"
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
            header="Add New Vehicle Type"
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
                    onClick={() => Vehicleform.handleSubmit()}
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
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Vehicle type name{" "}
                  </label>
                </div>
                <InputText
                  name="name"
                  value={Vehicleform.values.name}
                  onChange={(e) =>
                    Vehicleform.setFieldValue("name", e.target.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Vehicle type description{" "}
                  </label>
                </div>
                <InputText
                  name="description"
                  value={Vehicleform.values.description}
                  onChange={(e) =>
                    Vehicleform.setFieldValue("description", e.target.value)
                  }
                />
              </div>
            </div>
          </Dialog>
          <></>
          <Dialog
            header="Edit Vehicle Type"
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
                    onClick={() => VehicleformEdit.handleSubmit()}
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
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Vehicle type name{" "}
                  </label>
                </div>
                <InputText
                  name="name"
                  value={VehicleformEdit.values.name}
                  onChange={(e) =>
                    VehicleformEdit.setFieldValue("name", e.target.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Vehicle type description{" "}
                  </label>
                </div>
                <InputText
                  name="description"
                  value={VehicleformEdit.values.description}
                  onChange={(e) =>
                    VehicleformEdit.setFieldValue("description", e.target.value)
                  }
                />
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default VehicleType;
