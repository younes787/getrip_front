import { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import {
  AddImageToResidence,
  AddResidence,
  GetAllPlaces,
  GetResidence,
  GetResidenceType,
  GetimagesByResidanceid,
  UpdateResidence,
} from "../Services";
import { ImageDTO, ResidenceDTO } from "../modules/getrip.modules";
import { useFormik } from "formik";
import { FilterMatchMode } from "primereact/api";
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";


const Residence = () => {
  const [residence, setresidence] = useState();
  const [places, setPlaces] = useState();
  const [residenceType, setResidenceType] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlaceId, setCurrentPlaceId] = useState<number>(0);
  const [residenceimage, setresidenceimage] = useState<any>();
  const [file, setFile] = useState<any>();
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
  const Residenceform = useFormik<ResidenceDTO>({
    initialValues: new ResidenceDTO(),
    validateOnChange: true,
    onSubmit: () => {
      AddResidence(Residenceform.values);
      setShow(false);
    },
  });
  const ImagePlaceform = useFormik<ImageDTO>({
    initialValues: new ImageDTO(),
    validateOnChange: true,
    onSubmit: () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ObjectId", JSON.stringify(currentPlaceId));
      AddImageToResidence(formData);
    },
  });
  const ResidenceformEdit = useFormik<ResidenceDTO>({
    initialValues: new ResidenceDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateResidence(ResidenceformEdit.values);
      setShowEdit(false);
    },
  });
  useEffect(() => {
    setLoading(true);
    GetResidence()
      .then((res) => {
        setresidence(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });

    GetAllPlaces().then((res) => setPlaces(res.data));
    GetResidenceType().then((res) => setResidenceType(res.data));
  }, []);

  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    ResidenceformEdit.setValues({
      name: rowData.name,
      id: rowData.id,
      description: rowData.description,
      placeId: rowData.placeId,
      residenceTypeId: rowData.residenceTypeId,
    });
    setCurrentPlaceId(rowData.id);
    GetimagesByResidanceid(rowData.id).then((res)=>setresidenceimage(res?.data))

  };
  const BodyTemplate = (rowData: any) => {
    return (
      <div className="gap-3">
        <i
          className="pi pi-bold pi-pencil ml-3"
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
      {loading ? (
        <LoadingComponent />
      ) : (
        <div>
          <Button
            label="Add New Residence"
            onClick={() => setShow(true)}
            size="small"
            className="mt-4 ml-5 primary_btn"
          ></Button>
          <DataTable
            value={residence}
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
            <Column field="name" filter sortable header="Residence Name"></Column>
            <Column field="description" filter sortable header="Description"></Column>
            <Column
              field=""
              sortable
              header="Actions"
              body={BodyTemplate}
            ></Column>
          </DataTable>
          <></>
          <Dialog
            header="Add New Residence"
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
                    onClick={() => Residenceform.handleSubmit()}
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
            <div className="grid mt-3 gap-2">
              <div className="md:col-6 lg:col-6">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Residence Name{" "}
                  </label>
                </div>
                <InputText
                  name="name"
                  value={Residenceform.values.name}
                  onChange={(e) =>
                    Residenceform.setFieldValue("name", e.target.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Description{" "}
                  </label>
                </div>
                <InputText
                  name="description"
                  value={Residenceform.values.description}
                  onChange={(e) =>
                    Residenceform.setFieldValue("description", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid mt-3 gap-2">
              <div className="md:col-6 lg:col-6">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Place Name{" "}
                  </label>
                </div>
                <Dropdown
                  placeholder="Select a Place"
                  options={places}
                  optionLabel="name"
                  optionValue="id"
                  name="placeId"
                  filter
                  className="w-full"
                  value={Residenceform?.values?.placeId}
                  onChange={(e) =>
                    Residenceform.setFieldValue("placeId", e.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Residence Type{" "}
                  </label>
                </div>
                <Dropdown
                  placeholder="Select a Residence Type"
                  options={residenceType}
                  optionLabel="name"
                  optionValue="id"
                  name="residenceTypeId"
                  className="w-full"
                  filter
                  value={Residenceform?.values?.residenceTypeId}
                  onChange={(e) =>
                    Residenceform.setFieldValue("residenceTypeId", e.value)
                  }
                />
              </div>
            </div>
          </Dialog>
          <></>
          <Dialog
            header="Edit Residence"
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
                    onClick={() => ResidenceformEdit.handleSubmit()}
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
            <div className="grid mt-3 gap-2">
              <div className="md:col-6 lg:col-6">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Residence Name{" "}
                  </label>
                </div>
                <InputText
                  name="name"
                  value={ResidenceformEdit.values.name}
                  onChange={(e) =>
                    ResidenceformEdit.setFieldValue("name", e.target.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Description{" "}
                  </label>
                </div>
                <InputText
                  name="description"
                  value={ResidenceformEdit.values.description}
                  onChange={(e) =>
                    ResidenceformEdit.setFieldValue(
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="grid mt-3 gap-2">
              <div className="md:col-6 lg:col-6">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Place Name{" "}
                  </label>
                </div>
                <Dropdown
                  placeholder="Select a Place"
                  options={places}
                  optionLabel="name"
                  optionValue="id"
                  name="placeId"
                  filter
                  className="w-full"
                  value={ResidenceformEdit?.values?.placeId}
                  onChange={(e) =>
                    ResidenceformEdit.setFieldValue("placeId", e.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Residence Type{" "}
                  </label>
                </div>
                <Dropdown
                  placeholder="Select a Residence Type"
                  options={residenceType}
                  optionLabel="name"
                  optionValue="id"
                  name="residenceTypeId"
                  filter
                  className="w-full"
                  value={ResidenceformEdit?.values?.residenceTypeId}
                  onChange={(e) =>
                    ResidenceformEdit.setFieldValue("residenceTypeId", e.value)
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
                {residenceimage?.map((p: any) => (
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
        </div>
      )}
    </div>
  );
};

export default Residence;
