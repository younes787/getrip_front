import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddAttributeToSt, Getattributesbysid, UpdateAttributeToSt} from "../Services";
import { useFormik } from "formik";
import { ServiceAttributeDTO } from "../modules/getrip.modules";
import { useParams } from "react-router-dom";
import { Type } from "react-toastify/dist/utils";

type Props ={
  id : number
}
const ServiceAttributes = (props:Props) => {
  const [attributes, setAttributes] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  useEffect(() => {
    Getattributesbysid(props.id).then((res) => setAttributes(res.data));
  }, []);
  const Attributeform = useFormik<ServiceAttributeDTO>({
    initialValues: new ServiceAttributeDTO(),
    validateOnChange: true,
    onSubmit: () => {
    Attributeform.values.serviceTypeId = props.id
    AddAttributeToSt(Attributeform.values);
      setShow(false);
    },
  });

  const AttributeformEdit = useFormik<ServiceAttributeDTO>({
    initialValues: new ServiceAttributeDTO(),
    validateOnChange: true,
    onSubmit: () => {
    AttributeformEdit.values.serviceTypeId = props.id
    UpdateAttributeToSt(AttributeformEdit.values);
      setShowEdit(false);
    },
  });
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    AttributeformEdit.setValues({
      id: rowData.id,
      name: rowData.name,
      value: rowData.value
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
          label="Add New Attribute"
          onClick={() => setShow(true)}
          size="small"
          className="mt-4 ml-5 pr_btn"
        ></Button>
        <DataTable
          value={attributes}
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
            field="value"
            sortable
            header="value"
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
          header="Add New Attribute"
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
                  onClick={() => Attributeform.handleSubmit()}
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
                Attribute Name{" "}
              </label>
              <InputText
                name="name"
                value={Attributeform.values.name}
                onChange={(e) =>
                  Attributeform.setFieldValue("name", e.target.value)
                }
              />
            </div>
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Value{" "}
                </label>
              </div>
              <InputText
                name="value"
                value={Attributeform.values.value}
                onChange={(e) =>
                  Attributeform.setFieldValue("value", e.target.value)
                }
              />
            </div>
          </div>
        </Dialog>
        <></>
        <Dialog
          header="Edit Attribute"
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
                  onClick={() => AttributeformEdit.handleSubmit()}
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
                Attribute Name{" "}
              </label>
              <InputText
                name="name"
                value={AttributeformEdit.values.name}
                onChange={(e) =>
                    AttributeformEdit.setFieldValue("name", e.target.value)
                }
              />
            </div>
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Value{" "}
                </label>
              </div>
              <InputText
                name="value"
                value={AttributeformEdit.values.value}
                onChange={(e) =>
                    AttributeformEdit.setFieldValue("value", e.target.value)
                }
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ServiceAttributes;
