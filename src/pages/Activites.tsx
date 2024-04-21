import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddMaker, GetAllMakers, UpdateMaker } from "../Services";
import { useFormik } from "formik";
import { MakerDTO } from "../modules/getrip.modules";


const Activites = () => {
  const [maker, setMaker] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  useEffect(() => {
    GetAllMakers().then((res) => setMaker(res.data));
  }, []);
  const Makerform = useFormik<MakerDTO>({
    initialValues: new MakerDTO(),
    validateOnChange: true,
    onSubmit: () => {
      AddMaker(Makerform.values);
      setShow(false);
    },
  });

  const MakerformEdit = useFormik<MakerDTO>({
    initialValues: new MakerDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateMaker(MakerformEdit.values);
      setShowEdit(false);
    },
  });
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    MakerformEdit.setValues({
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
          label="Add New Maker"
          onClick={() => setShow(true)}
          size="small"
          className="mt-4 ml-5 pr_btn"
        ></Button>
        <DataTable
          value={maker}
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
          header="Add New Maker"
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
                  onClick={() => Makerform.handleSubmit()}
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
                Maker Name{" "}
              </label>
              <InputText
                name="name"
                value={Makerform.values.name}
                onChange={(e) =>
                  Makerform.setFieldValue("name", e.target.value)
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
                value={Makerform.values.description}
                onChange={(e) =>
                  Makerform.setFieldValue("description", e.target.value)
                }
              />
            </div>
          </div>
        </Dialog>
        <></>
        <Dialog
          header="Edit Maker"
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
                  onClick={() => MakerformEdit.handleSubmit()}
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
                Maker Name{" "}
              </label>
              <InputText
                name="name"
                value={MakerformEdit.values.name}
                onChange={(e) =>
                    MakerformEdit.setFieldValue("name", e.target.value)
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
                value={MakerformEdit.values.description}
                onChange={(e) =>
                    MakerformEdit.setFieldValue("description", e.target.value)
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
