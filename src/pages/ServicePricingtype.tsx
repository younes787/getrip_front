import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { CreatePricingType, GetAllPricingTypes, UpdatePricingType} from "../Services";
import { useFormik } from "formik";
import { PricingDTO, ServiceAttributeDTO } from "../modules/getrip.modules";

type Props = { id : number }

const ServicePricingtype = (props: Props) => {
  const [pricingTypes, setPricingTypes] = useState();
  const [showPricingTypes, setShowPricingTypes] = useState<boolean>(false);
  const [showPricingTypesEdit, setShowPricingTypesEdit] = useState<boolean>(false);

  useEffect(() => {
    GetAllPricingTypes().then((res) => {
      const filteredData = res?.data.filter((item: any) => item.serviceTypeId === props.id);
      setPricingTypes(filteredData);
    });
  }, []);

  const pricingTypeform = useFormik<PricingDTO>({
    initialValues: new PricingDTO(),
    validateOnChange: true,
    onSubmit: () => {
      pricingTypeform.values.serviceTypeId = props.id
      CreatePricingType(pricingTypeform.values);
      setShowPricingTypes(false);
    },
  });

  const pricingTypeformformEdit = useFormik<ServiceAttributeDTO>({
    initialValues: new ServiceAttributeDTO(),
    validateOnChange: true,
    onSubmit: () => {
      pricingTypeformformEdit.values.serviceTypeId = props.id
      UpdatePricingType(pricingTypeformformEdit.values);
      setShowPricingTypesEdit(false);
    },
  });

  const pricingTypesModal = (rowData: any) => {
    setShowPricingTypesEdit(true);

    pricingTypeformformEdit.setValues({
      id: rowData.id,
      name: rowData.name,
      serviceTypeId: rowData.serviceTypeId
    });
  };

  const BodyTemplate = (rowData: any) => {
    return (
      <div className="gap-3">
        <i
          className="pi pi-bold pi-pencil"
          onClick={() => pricingTypesModal(rowData)} style={{ fontSize: "1.2rem", color: "slateblue", padding: "7px", cursor: "pointer"}}
        ></i>
      </div>
    );
  };

  return (
    <div>
      <Button label="Add New Pricing Types" onClick={() => setShowPricingTypes(true)} size="small" className="mt-4 ml-5 primary_btn"></Button>

      <DataTable
        value={pricingTypes}
        stripedRows
        showGridlines
        className=" p-5"
        tableStyle={{ minWidth: "50rem" }}
        size="small"
        style={{ fontSize: "1.2rem", padding: "16px" }}
        resizableColumns
        rows={5}
        rowsPerPageOptions={[10, 15, 20, 50]}
        filterDisplay="menu"
        globalFilterFields={["global"]}
        paginator
        rowHover
        sortMode="multiple"
      >
        <Column field="name" sortable header="Name"></Column>
        <Column field="" sortable header="Actions" body={BodyTemplate}></Column>
      </DataTable>

      <Dialog
        header="Add New Pricing Types"
        visible={showPricingTypes}
        className="md:w-50 lg:w-50"
        onHide={() => setShowPricingTypes(false)}
        footer={
          <>
            <div>
              <Button label="Save" size="small" severity="warning" outlined onClick={() => pricingTypeform.handleSubmit()} className="mt-4"></Button>
              <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowPricingTypes(false)} className="mt-4"></Button>
            </div>
          </>
        }
      >
        <div className="grid mt-3">
          <div className="md:col-6 lg:col-6">
            <label className="mb-2" htmlFor="Status">Name</label>
            <InputText
              name="name"
              value={pricingTypeform.values.name}
              onChange={(e) => pricingTypeform.setFieldValue("name", e.target.value)}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Edit Pricing Types"
        visible={showPricingTypesEdit}
        className="md:w-50 lg:w-50"
        onHide={() => setShowPricingTypesEdit(false)}
        footer={
          <>
            <div>
              <Button label="Save" size="small" severity="warning" outlined onClick={() => pricingTypeformformEdit.handleSubmit()} className="mt-4"></Button>
              <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowPricingTypesEdit(false)} className="mt-4"></Button>
            </div>
          </>
        }
      >
        <div className="grid mt-3">
          <div className="md:col-6 lg:col-6">
            <label className="mb-2" htmlFor="Status">Name</label>
            <InputText
              name="name"
              value={pricingTypeformformEdit.values.name}
              onChange={(e) => pricingTypeformformEdit.setFieldValue("name", e.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ServicePricingtype;
