import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import {
  AddImageToPlace,
  AddPlace,
  GetAllCities,
  GetAllPlaces,
  GetimagesByPlaceid,
  UpdatePlace,
} from "../Services";
import { useFormik } from "formik";
import { PlaceDTO, ImageDTO } from "../modules/getrip.modules";
import { Editor } from "primereact/editor";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/Loading";
import Activites from "./Activites";
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";
import { FilterMatchMode } from "primereact/api";

const Places = () => {
  const [places, setPlaces] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showAct, setShowAct] = useState<boolean>(false);
  const [cities, setCities] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlaceId, setCurrentPlaceId] = useState<number>(0);
  const [ placeImage, setPlaceImage] = useState<any>();
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
  useEffect(() => {
    setLoading(true);
    GetAllPlaces()
      .then((res) => {
        setPlaces(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });

    GetAllCities().then((res) => setCities(res.data));
  }, []);
  const navigate = useNavigate();
  const Placeform = useFormik<PlaceDTO>({
    initialValues: new PlaceDTO(),
    validateOnChange: true,
    onSubmit: () => {
      AddPlace(Placeform.values);
      setShow(false);
    },
  });

  const PlaceformEdit = useFormik<PlaceDTO>({
    initialValues: new PlaceDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdatePlace(PlaceformEdit.values);
      setShowEdit(false);
    },
  });

  const ImagePlaceform = useFormik<ImageDTO>({
    initialValues: new ImageDTO(),
    validateOnChange: true,
    onSubmit: () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ObjectId", JSON.stringify(currentPlaceId));
      AddImageToPlace(formData);
    },
  });

  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    PlaceformEdit.setValues({
      name: rowData.name,
      description: rowData.description,
      id: rowData.id,
      cityId: rowData.cityId,
      lang: rowData.lang,
      lot: rowData.lot,
      googleMapsUrl: rowData.googleMapsUrl,
    });
    setCurrentPlaceId(rowData.id);
    GetimagesByPlaceid(rowData?.id).then((res)=>setPlaceImage(res?.data)) 
  };
  const imageBodyTemplate = (row: any) => {
    return (
      <Image src={row.photos[0]?.imagePath} width="80" height="40" preview />
    );
  };
  const handleOnChange = (e: any) => {
    setFile(e.files?.[0]);
  };

  const truncateText = (text: any, wordCount: any) => {
    const words = text?.split(" ");
    if (words?.length <= wordCount) {
      return text;
    }
    const truncated = words?.slice(0, wordCount)?.join(" ");
    return `${truncated}...`;
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
        <i
          className="pi pi-bold pi-info-circle"
          onClick={() => {
            setCurrentPlaceId(rowData.id);
            setShowAct(true);
          }}
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
            label="Add New Place"
            onClick={() => setShow(true)}
            size="small"
            className="mt-4 ml-5 pr_btn"
          ></Button>
          <DataTable
            value={places}
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
            <Column field="name" filter sortable header="Place Name"></Column>
            <Column
              field="description"
              sortable
              filter
              header="Description"
              body={(row) => (
                <div style={{ textWrap: "wrap" }}>
                  {truncateText(row.description, 10)}
                </div>
              )} // Use the truncate function
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
            header="Add New Activity"
            visible={showAct}
            className="md:w-50 lg:w-50"
            onHide={() => setShowAct(false)}
          >
            <Activites id={currentPlaceId} />
          </Dialog>
          <></>
          <Dialog
            header="Add New Place"
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
                    onClick={() => Placeform.handleSubmit()}
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
                  City Name{" "}
                </label>
                <Dropdown
                  placeholder="Select a City"
                  options={cities}
                  optionLabel="name"
                  optionValue="id"
                  name="cityId"
                  className="w-full"
                  filter
                  value={Placeform?.values?.cityId}
                  onChange={(e) => Placeform.setFieldValue("cityId", e.value)}
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Place Name{" "}
                  </label>
                </div>
                <InputText
                  name="name"
                  value={Placeform.values.name}
                  onChange={(e) =>
                    Placeform.setFieldValue("name", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid mt-3">
              <div className="md:col-6 lg:col-6">
                <div>
                  <label className="mb-2" htmlFor="Status">
                    {" "}
                    Description{" "}
                  </label>
                </div>
                <Editor
                  name="description"
                  value={Placeform.values.description}
                  onTextChange={(e) => {
                    Placeform.setFieldValue("description", e.textValue);
                  }}
                  style={{ height: "220px" }}
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Google Maps Url{" "}
                  </label>
                </div>
                <InputText
                  name="googleMapsUrl"
                  value={Placeform.values.googleMapsUrl}
                  onChange={(e) =>
                    Placeform.setFieldValue("googleMapsUrl", e.target.value)
                  }
                  className="md:w-25rem lg:w-25rem"
                />
              </div>
            </div>
            <div className="grid mt-3">
              <div className="md:col-6 lg:col-6">
                <div>
                  <label className="mb-2" htmlFor="Status">
                    {" "}
                    Lang{" "}
                  </label>
                </div>
                <InputText
                  name="lang"
                  value={Placeform.values.lang}
                  onChange={(e) =>
                    Placeform.setFieldValue("lang", e.target.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Lot{" "}
                  </label>
                </div>
                <InputText
                  name="lot"
                  value={Placeform.values.lot}
                  onChange={(e) =>
                    Placeform.setFieldValue("lot", e.target.value)
                  }
                />
              </div>
            </div>
          </Dialog>
          <></>
          <Dialog
            header="Edit Place"
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
                    onClick={() => PlaceformEdit.handleSubmit()}
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
                  City Name{" "}
                </label>
                <Dropdown
                  placeholder="Select a City"
                  options={cities}
                  optionLabel="name"
                  optionValue="id"
                  name="cityId"
                  filter
                  className="w-full"
                  value={PlaceformEdit?.values?.cityId}
                  onChange={(e) =>
                    PlaceformEdit.setFieldValue("cityId", e.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  {" "}
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Place Name{" "}
                  </label>
                </div>
                <InputText
                  name="name"
                  value={PlaceformEdit.values.name}
                  onChange={(e) =>
                    PlaceformEdit.setFieldValue("name", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid mt-3">
              <div className="md:col-6 lg:col-6">
                <label className="mb-2" htmlFor="Status">
                  {" "}
                  Description{" "}
                </label>
                <Editor
                  name="description"
                  value={PlaceformEdit.values.description}
                  onTextChange={(e) => {
                    PlaceformEdit.setFieldValue("description", e.textValue);
                  }}
                  style={{ height: "220px" }}
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Google Maps Url{" "}
                  </label>
                </div>
                <InputText
                  name="googleMapsUrl"
                  value={PlaceformEdit.values.googleMapsUrl}
                  onChange={(e) =>
                    PlaceformEdit.setFieldValue("googleMapsUrl", e.target.value)
                  }
                  className="md:w-25rem lg:w-25rem"
                />
              </div>
            </div>
            <div className="grid mt-3">
              <div className="md:col-6 lg:col-6">
                <div>
                  <label className="mb-2" htmlFor="Status">
                    {" "}
                    Lang{" "}
                  </label>
                </div>
                <InputText
                  name="lang"
                  value={PlaceformEdit.values.lang}
                  onChange={(e) =>
                    PlaceformEdit.setFieldValue("lang", e.target.value)
                  }
                />
              </div>
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Lot{" "}
                  </label>
                </div>
                <InputText
                  name="lot"
                  value={PlaceformEdit.values.lot}
                  onChange={(e) =>
                    PlaceformEdit.setFieldValue("lot", e.target.value)
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
                {placeImage?.map((p: any) => (
                  <Image
                    src={p.imagePath}
                    width="300"
                    height="200"
                    preview
                  />
                ))}{" "}
              </div>
            </div>
            <div className="mt-5 ml-2"></div>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Places;
