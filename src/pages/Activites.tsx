import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddActivity, AddMaker, GetActivitiesbyid, GetAllActivities, GetAllMakers, UpdateActivity, UpdateMaker } from "../Services";
import { useFormik } from "formik";
import { ActivityDTO, MakerDTO } from "../modules/getrip.modules";
import { useParams } from "react-router-dom";


const Activites = () => {
  const [activity, setActivity] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
   const params = useParams()
  useEffect(() => {
    GetActivitiesbyid(parseInt(params.id as any)).then((res) => setActivity(res.data));
  }, []);
  const Activityform = useFormik<ActivityDTO>({
    initialValues: new ActivityDTO(),
    validateOnChange: true,
    onSubmit: () => {
    Activityform.values.pLaceId = parseInt(params.id as any)
     AddActivity(Activityform.values);
      setShow(false);
    },
  });

  const ActivityformEdit = useFormik<ActivityDTO>({
    initialValues: new ActivityDTO(),
    validateOnChange: true,
    onSubmit: () => {
    ActivityformEdit.values.pLaceId = parseInt(params.id as any)
    UpdateActivity(ActivityformEdit.values);
      setShowEdit(false);
    },
  });
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    ActivityformEdit.setValues({
      id: rowData.id,
      name: rowData.name,
      description: rowData.description
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
          label="Add New Activity"
          onClick={() => setShow(true)}
          size="small"
          className="mt-4 ml-5 pr_btn"
        ></Button>
        <DataTable
          value={activity}
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
          <Column field="name" sortable header="Name"></Column>
          <Column
            field="description"
            sortable
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
          header="Add New Activity"
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
                  onClick={() => Activityform.handleSubmit()}
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
                Activity Name{" "}
              </label>
              <InputText
                name="name"
                value={Activityform.values.name}
                onChange={(e) =>
                  Activityform.setFieldValue("name", e.target.value)
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
                value={Activityform.values.description}
                onChange={(e) =>
                  Activityform.setFieldValue("description", e.target.value)
                }
              />
            </div>
          </div>
        </Dialog>
        <></>
        <Dialog
          header="Edit Activity"
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
                  onClick={() => ActivityformEdit.handleSubmit()}
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
                Activity Name{" "}
              </label>
              <InputText
                name="name"
                value={ActivityformEdit.values.name}
                onChange={(e) =>
                    ActivityformEdit.setFieldValue("name", e.target.value)
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
                value={ActivityformEdit.values.description}
                onChange={(e) =>
                    ActivityformEdit.setFieldValue("description", e.target.value)
                }
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Activites;
