import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddPlace, GetAllCities, GetAllPlaces, UpdatePlace } from "../Services";
import { useFormik } from "formik";
import { PlaceDTO } from "../modules/getrip.modules";
import { Editor } from "primereact/editor";
import { useNavigate } from "react-router-dom";

const Places = () => {
  const [places, setPlaces] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [cities, setCities] = useState<any>();

  useEffect(() => {
    GetAllPlaces().then((res) => setPlaces(res.data));
    GetAllCities().then((res) => setCities(res.data));
  }, []);
  const navigate = useNavigate()
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
  };
  const truncateText = (text: any, wordCount: any) => {
    const words = text?.split(" ");
    if (words?.length <= wordCount) {
      return text;
    }
    const truncated = words?.slice(0, wordCount)?.join(" ");
    return `${truncated}...`;
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
          onClick={() => navigate(`activites/${rowData.id}`)}
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
          // filters={filters.value}
          filterDisplay="menu"
          globalFilterFields={["global"]}
          paginator
          rowHover
          sortMode="multiple"
        >
          <Column field="name" sortable header="Place Name"></Column>
          <Column
            field="description"
            sortable
            header="Description"
            body={(row) => (
              <div style={{ textWrap: "wrap" }}>
                {truncateText(row.description, 10)}
              </div>
            )} // Use the truncate function
          ></Column>
          <Column
            field="googleMapsUrl"
            sortable
            header="Google Maps Url"
          ></Column>
          <Column field="lang" sortable header="Lang"></Column>
          <Column field="lot" sortable header="Lot"></Column>
          <Column
            field=""
            sortable
            header="Actions"
            body={BodyTemplate}
          ></Column>
        </DataTable>
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
                onChange={(e) => Placeform.setFieldValue("lot", e.target.value)}
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
                className="w-full"
                value={PlaceformEdit?.values?.cityId}
                onChange={(e) => PlaceformEdit.setFieldValue("cityId", e.value)}
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
        </Dialog>
      </div>
    </div>
  );
};

export default Places;
