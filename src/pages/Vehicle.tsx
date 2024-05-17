import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddImageToVihcles, AddVehicle, GetAllMakers, GetAllVehicles, GetAllVehiclesTypes, UpdateVehicle } from "../Services";
import { useFormik } from "formik";
import { ImageDTO, VehicleDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";

const Vehicle = () => {
  const [vehicle, setVehicle] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [makers, setMakers] = useState<any>();
  const [vehicleType, setVehicleType] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentVehicleId, setCurrentVehicleId] = useState<number>(0);
  const [file, setFile] = useState<any>();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    model: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    passengersCount: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    isVip: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
  });
  useEffect(() => {
    setLoading(true);
    GetAllVehicles().then((res) =>{ setVehicle(res.data)
      setLoading(false)
    }).catch((error) => {
      setLoading(false);
    });
    GetAllMakers().then((res) => setMakers(res.data));
    GetAllVehiclesTypes().then((res)=>setVehicleType(res?.data))
  }, []);
  const Vehicleform = useFormik<VehicleDTO>({
    initialValues: new VehicleDTO(),
    validateOnChange: true,
    onSubmit: () => {
     AddVehicle(Vehicleform.values);
      setShow(false);
    },
  });
  const ImagePlaceform = useFormik<ImageDTO>({
    initialValues: new ImageDTO(),
    validateOnChange: true,
    onSubmit: () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ObjectId", JSON.stringify(currentVehicleId));
      AddImageToVihcles(formData);
    },
  });
  const VehicleformEdit = useFormik<VehicleDTO>({
    initialValues: new VehicleDTO(),
    validateOnChange: true,
    onSubmit: () => {
        UpdateVehicle(VehicleformEdit.values);
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
      makerId: rowData.makerId,
      model: rowData.model,
      isVip: rowData.isVip,
      passengersCount: rowData.passengersCount,
      vehicleTypeId: rowData.vehicleTypeId
    });
    setCurrentVehicleId(rowData.id);
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
  const imageBodyTemplate = (row: any) => {
    return (
      <Image src={Array.isArray( row?.photos)? row?.photos[0]?.imagePath : ''} width="80" height="40" preview />
    );
  };
  const handleOnChange = (e: any) => {
    setFile(e.files?.[0]);
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
          label="Add New Vehicle"
          onClick={() => setShow(true)}
          size="small"
          className="mt-4 ml-5 pr_btn"
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
         <Column sortable body={imageBodyTemplate} header="photos"></Column>
          <Column field="model" filter sortable header="Model"></Column>
          <Column
            field="passengersCount"
            sortable filter
            header="Passengers Count"
          ></Column>
          <Column
            field="isVip"
            sortable filter
            header="is Vip"
            body={(rowData)=> rowData.isVip === true ? 'Yes' : 'No'}
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
          header="Add New Vehicle"
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
              <label className="mb-2" htmlFor="Status">
                {" "}
                vehicle type{" "}
              </label>
              <Dropdown
                placeholder="Select a vehicle type"
                options={vehicleType}
                optionLabel="name"
                optionValue="id"
                name="vehicleTypeId"
                filter
                className="w-full"
                value={Vehicleform?.values?.vehicleTypeId}
                onChange={(e) => Vehicleform.setFieldValue("vehicleTypeId", e.value)}
              />
            </div>
            <div className="md:col-6 lg:col-6">
              <label className="mb-2" htmlFor="Status">
                {" "}
                Maker Name{" "}
              </label>
              <Dropdown
                placeholder="Select a Maker"
                options={makers}
                optionLabel="name"
                optionValue="id"
                name="makerId"
                filter
                className="w-full"
                value={Vehicleform?.values?.makerId}
                onChange={(e) => Vehicleform.setFieldValue("makerId", e.value)}
              />
            </div>
          </div>
          <div className="grid mt-3">
          <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Vehicle Model{" "}
                </label>
              </div>
              <InputText
                name="model"
                value={Vehicleform.values.model}
                onChange={(e) =>
                  Vehicleform.setFieldValue("model", e.target.value)
                }
                className="ml-0"
              />
            </div>
            <div className="md:col-6 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="Status">
                  {" "}
                  Passengers Count{" "}
                </label>
              </div>
              <InputNumber
               name="passengersCount"
               value={Vehicleform.values.passengersCount}
               onChange={(e) =>
                 Vehicleform.setFieldValue("passengersCount", e.value)
               } />
            </div>
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  is VIP{" "}
                </label>
              </div>
              <Checkbox
                name="isVip"
                checked={Vehicleform.values.isVip}
                onChange={(e) =>
                  Vehicleform.setFieldValue("isVip", e.checked)
                }
              />
            </div>
          </div>
        </Dialog>
        <></>
        <Dialog
          header="Edit Vehicle"
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
              <label className="mb-2" htmlFor="Status">
                {" "}
                vehicle type{" "}
              </label>
              <Dropdown
                placeholder="Select a vehicle type"
                options={vehicleType}
                optionLabel="name"
                optionValue="id"
                name="vehicleTypeId"
                className="w-full"
                filter
                value={VehicleformEdit?.values?.vehicleTypeId}
                onChange={(e) => VehicleformEdit.setFieldValue("vehicleTypeId", e.value)}
              />
            </div>
            <div className="md:col-6 lg:col-6">
              <label className="mb-2" htmlFor="Status">
                {" "}
                Maker Name{" "}
              </label>
              <Dropdown
                placeholder="Select a Maker"
                options={makers}
                optionLabel="name"
                optionValue="id"
                name="makerId"
                filter
                className="w-full"
                value={VehicleformEdit?.values?.makerId}
                onChange={(e) => VehicleformEdit.setFieldValue("makerId", e.value)}
              />
            </div>
          </div>
          <div className="grid mt-3">
          <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Vehicle Model{" "}
                </label>
              </div>
              <InputText
                name="model"
                value={VehicleformEdit.values.model}
                onChange={(e) =>
                    VehicleformEdit.setFieldValue("model", e.target.value)
                }
              />
            </div>
            <div className="md:col-6 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="Status">
                  {" "}
                  Passengers Count{" "}
                </label>
              </div>
              <InputNumber
               name="passengersCount"
               value={VehicleformEdit.values.passengersCount}
               onChange={(e) =>
                VehicleformEdit.setFieldValue("passengersCount", e.value)
               } />
            </div>
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  is VIP{" "}
                </label>
              </div>
              <Checkbox
                name="isVip"
                checked={VehicleformEdit.values.isVip}
                onChange={(e) =>
                    VehicleformEdit.setFieldValue("isVip", e.checked)
                }
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4">
              <div className="col-8">
                <FileUpload
                  name="imagePath"
                  multiple
                  accept="image/*"
                  onSelect={handleOnChange}
                  maxFileSize={1000000}
                  emptyTemplate={
                    <p className="m-0">
                      Drag and drop files to here to upload.
                    </p>
                  }
                  chooseOptions={chooseOptions}
                  uploadOptions={uploadOptions}
                  cancelOptions={cancelOptions}
                  customUpload
                  uploadHandler={() => ImagePlaceform.handleSubmit()}
                />
              </div>
              <div className="mt-3">
                {vehicle?.map((p: any) => (
                  <Image
                    src={Array.isArray(p?.photos) ? p?.photos[0]?.imagePath : ''}
                    width="300"
                    height="200"
                    preview
                  />
                ))}{" "}
              </div>
            </div>
        </Dialog>
      </div>}
    </div>
  );
};

export default Vehicle;
