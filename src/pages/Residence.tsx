import { useEffect, useState } from "react";
import LoadingComponent from "../components/Loading";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import {
  AddResidenceType,
  GetResidenceType,
  UpdateResidenceType,
} from "../Services";
import { ResidenceTypeDTO } from "../modules/getrip.modules";
import { useFormik } from "formik";
import { FilterMatchMode } from "primereact/api";

const ResidenceType = () => {
  const [residenceType, setresidenceType] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlaceId, setCurrentPlaceId] = useState<number>(0);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
  });
  const ResidenceTypeform = useFormik<ResidenceTypeDTO>({
    initialValues: new ResidenceTypeDTO(),
    validateOnChange: true,
    onSubmit: () => {
      AddResidenceType(ResidenceTypeform.values);
      setShow(false);
    },
  });

  const ResidenceTypeformEdit = useFormik<ResidenceTypeDTO>({
    initialValues: new ResidenceTypeDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateResidenceType(ResidenceTypeformEdit.values);
      setShowEdit(false);
    },
  });
  useEffect(() => {
    setLoading(true);
    GetResidenceType()
      .then((res) => {
        setresidenceType(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    ResidenceTypeformEdit.setValues({
      name: rowData.name,
      id: rowData.id,
    });
    setCurrentPlaceId(rowData.id);
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
            label="Add New Residence Type"
            onClick={() => setShow(true)}
            size="small"
            className="mt-4 ml-5 pr_btn"
          ></Button>
          <DataTable
            value={residenceType}
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
            <Column field="name" filter sortable header="Residence Name"></Column>
            <Column
              field=""
              sortable
              header="Actions"
              body={BodyTemplate}
            ></Column>
          </DataTable>
          <></>
          <Dialog
            header="Add New Residence Type"
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
                    onClick={() => ResidenceTypeform.handleSubmit()}
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
              <div className="md:col-5 lg:col-5">
                <div>
                  <label className="mb-2" htmlFor="">
                    {" "}
                    Residence Name{" "}
                  </label>
                </div>
                <InputText
                  name="name"
                  value={ResidenceTypeform.values.name}
                  onChange={(e) =>
                    ResidenceTypeform.setFieldValue("name", e.target.value)
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
                    onClick={() => ResidenceTypeformEdit.handleSubmit()}
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
                  value={ResidenceTypeformEdit.values.name}
                  onChange={(e) =>
                    ResidenceTypeformEdit.setFieldValue("name", e.target.value)
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

export default ResidenceType;
