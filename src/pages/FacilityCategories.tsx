import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddFacilityCategory,  GetFacilityCategories, UpdateFacilityCategory} from "../Services";
import { useFormik } from "formik";
import { FacilityCategotiesDTO} from "../modules/getrip.modules";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

const FacilityCategories = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [facilityCategories, setFacilityCategories] = useState<any>();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditFrom, setShowEditForm] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [icons, setIcons] = useState<any>([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
  });

  useEffect(() => {
    setLoading(true);

    GetFacilityCategories().then((res) => {
        setFacilityCategories(res.data);
        setLoading(false);
    }).catch((error) => {
       setLoading(false);
    });


    const _icons = Object.keys(fas).map(iconName =>  ({
      name: iconName,
      icon: fas[iconName]
    }));

    setIcons(_icons);
  }, []);

  const FacilityCategotiesForm = useFormik<FacilityCategotiesDTO>({
    initialValues: new FacilityCategotiesDTO(),
    validateOnChange: true,
    onSubmit: () => {
      AddFacilityCategory(FacilityCategotiesForm.values);
      setShowAddForm(false);
    },
  });

  const FacilityCategotiesFormEdit = useFormik<FacilityCategotiesDTO>({
    initialValues: new FacilityCategotiesDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateFacilityCategory(FacilityCategotiesFormEdit.values);
      setShowEditForm(false);
    },
  });

  const ShowEditFormTDO = (rowData: FacilityCategotiesDTO) => {
    setShowEditForm(true);

    FacilityCategotiesFormEdit.setValues({
      id: rowData.id,
      name: rowData.name,
      iconCode: rowData.iconCode,
    });
  };

  const BodyTemplate = (rowData: any) => {
    return (
      <div className="gap-3">
        <i
          className="pi pi-bold pi-pencil"
          onClick={() => ShowEditFormTDO(rowData)}
          style={{ fontSize: "1.2rem", color: "slateblue", padding: "7px", cursor: "pointer"}}
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

  const iconOption = (option: any) => {
    return (
      <div className="flex align-items-center">
        <FontAwesomeIcon icon={option.icon} className="mr-2" />
        <span>{option.name}</span>
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div>
          <Button label="Add New Facility Categories" onClick={() => setShowAddForm(true)} size="small" className="mt-4 ml-5 primary_btn"></Button>

          <DataTable
            value={facilityCategories}
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
            <Column field="name" filter sortable header="Name"></Column>
            <Column field="" sortable header="Actions" body={BodyTemplate}></Column>
          </DataTable>

          <Dialog
            header="Add New Facility Categories"
            visible={showAddForm}
            className="md:w-50 lg:w-50"
            onHide={() => setShowAddForm(false)}
            footer={
              <>
                <div>
                  <Button label="Save" size="small" severity="warning" outlined onClick={() => FacilityCategotiesForm.handleSubmit()} className="mt-4"></Button>
                  <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowAddForm(false)} className="mt-4"></Button>
                </div>
              </>
            }
          >
            <div className="grid mt-3">
              <div className="md:col-12 lg:col-12">
                <label className="mb-2 block" htmlFor="">Facility Categoties Name</label>
                <InputText
                  name="name"
                  className="w-full"
                  value={FacilityCategotiesForm.values.name}
                  onChange={(e) => FacilityCategotiesForm.setFieldValue("name", e.target.value)}
                />
              </div>

              <div className="md:col-12 lg:col-12">
                <label className="mb-2 block" htmlFor="Icon">Icon</label>
                <Dropdown
                  onChange={(e) => FacilityCategotiesForm.setFieldValue("iconCode", e.value.name)}
                  options={icons}
                  optionLabel="name"
                  placeholder="Select an Icon"
                  filter
                  valueTemplate={<span>{<FontAwesomeIcon icon={fas[FacilityCategotiesForm?.values?.iconCode]} className="mr-2" />}</span>}
                  itemTemplate={iconOption}
                  className="w-full"
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            header="Edit Facility Categoties"
            visible={showEditFrom}
            className="md:w-50 lg:w-50"
            onHide={() => setShowEditForm(false)}
            footer={
              <>
                <div>
                  <Button label="Save" size="small" severity="warning" outlined onClick={() => FacilityCategotiesFormEdit.handleSubmit()} className="mt-4"></Button>
                  <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowEditForm(false)} className="mt-4"></Button>
                </div>
              </>
            }
          >
            <div className="grid mt-3">
              <div className="md:col-12 lg:col-12">
                <label className="mb-2 block" htmlFor="">Facility Categoties Name</label>
                <InputText
                  name="name"
                  className="w-full"
                  value={FacilityCategotiesFormEdit.values.name}
                  onChange={(e) => FacilityCategotiesFormEdit.setFieldValue("name", e.target.value)}
                />
              </div>

              <div className="md:col-12 lg:col-12">
                <label className="mb-2 block" htmlFor="Icon">Icon</label>
                <Dropdown
                  onChange={(e) => FacilityCategotiesFormEdit.setFieldValue("iconCode", e.value.name)}
                  options={icons}
                  optionLabel="name"
                  placeholder="Select an Icon"
                  filter
                  valueTemplate={<span>{<FontAwesomeIcon icon={fas[FacilityCategotiesFormEdit?.values?.iconCode]} className="mr-2" />}</span>}
                  itemTemplate={iconOption}
                  className="w-full"
                />
              </div>
            </div>
          </Dialog>

        </div>
      )}
    </div>
  );
};

export default FacilityCategories;
