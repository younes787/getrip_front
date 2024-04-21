import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddPlace, AddVehicle, GetAllCities, GetAllMakers, GetAllPlaces, GetAllVehicles, UpdatePlace, UpdateVehicle } from "../Services";
import { useFormik } from "formik";
import { PlaceDTO, VehicleDTO } from "../modules/getrip.modules";
import { Editor } from "primereact/editor";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";

const Vehicle = () => {
  const [vehicle, setVehicle] = useState();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [makers, setMakers] = useState<any>();

  useEffect(() => {
    GetAllVehicles().then((res) => setVehicle(res.data));
    GetAllMakers().then((res) => setMakers(res.data));
  }, []);
  const Vehicleform = useFormik<VehicleDTO>({
    initialValues: new VehicleDTO(),
    validateOnChange: true,
    onSubmit: () => {
     AddVehicle(Vehicleform.values);
      setShow(false);
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
  const ShowUser = (rowData: any) => {
    setShowEdit(true);
    VehicleformEdit.setValues({
      id: rowData.id,
      makerId: rowData.makerId,
      model: rowData.model,
      isVip: rowData.isVip,
      passengersCount: rowData.passengersCount,
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
          label="Add New Vichel"
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
          // filters={filters.value}
          filterDisplay="menu"
          globalFilterFields={["global"]}
          paginator
          rowHover
          sortMode="multiple"
        >
          <Column field="model" sortable header="Model"></Column>
          <Column
            field="passengersCount"
            sortable
            header="Passengers Count"
          ></Column>
          <Column
            field="isVip"
            sortable
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
                Maker Name{" "}
              </label>
              <Dropdown
                placeholder="Select a Maker"
                options={makers}
                optionLabel="name"
                optionValue="id"
                name="makerId"
                className="w-full"
                value={Vehicleform?.values?.makerId}
                onChange={(e) => Vehicleform.setFieldValue("makerId", e.value)}
              />
            </div>
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
              />
            </div>
          </div>
          <div className="grid mt-3">
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
                Maker Name{" "}
              </label>
              <Dropdown
                placeholder="Select a Maker"
                options={makers}
                optionLabel="name"
                optionValue="id"
                name="makerId"
                className="w-full"
                value={VehicleformEdit?.values?.makerId}
                onChange={(e) => VehicleformEdit.setFieldValue("makerId", e.value)}
              />
            </div>
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
          </div>
          <div className="grid mt-3">
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
        </Dialog>
      </div>
    </div>
  );
};

export default Vehicle;
