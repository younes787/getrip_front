import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddFacility, GetFacilities, GetFacilityCategories, UpdateFacility } from "../Services";
import { useFormik } from "formik";
import { FacilityDTO } from "../modules/getrip.modules";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";

const Facility = () => {
  const [facilityCategories, setFacilityCategories] = useState<any>();
  const [facilities, setFacilities] = useState<any>();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    categoryId: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
  });

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const [categoriesRes, facilitiesRes] = await Promise.all([
          GetFacilityCategories(),
          GetFacilities()
        ]);

        setFacilityCategories(categoriesRes.data);
        setFacilities(facilitiesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const FacilityForm = useFormik<FacilityDTO>({
    initialValues: new FacilityDTO(),
    validateOnChange: true,
    onSubmit: () => {
      AddFacility(FacilityForm.values);
      setShowAddForm(false);
    },
  });

  const FacilityFormEdit = useFormik<FacilityDTO>({
    initialValues: new FacilityDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateFacility(FacilityFormEdit.values);
      setShowEditForm(false);
    },
  });

  const showFacilityFormEdit = (rowData: any) => {
    setShowEditForm(true);

    FacilityFormEdit.setValues({
      id: rowData.id,
      name: rowData.name,
      categoryId: rowData.categoryId,
    });
  };

  const BodyTemplate = (rowData: any) => {
    return (
      <div className="gap-3">
        <i
          className="pi pi-bold pi-pencil"
          onClick={() => showFacilityFormEdit(rowData)}
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

  const getCategoryName = (categoryId: number) => {
    const category = facilityCategories.find((cat: any) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div>
     { loading ? <LoadingComponent/> : <div>
        <Button label="Add New Facility" onClick={() => setShowAddForm(true)} size="small" className="mt-4 ml-5 primary_btn"></Button>

        <DataTable
          value={facilities}
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
          <Column field="categoryId" sortable filter header="Category"  body={(rowData) => getCategoryName(rowData.categoryId)}></Column>
          <Column field="" sortable header="Actions" body={BodyTemplate}></Column>
        </DataTable>

        <Dialog
          header="Add New Facility"
          visible={showAddForm}
          className="md:w-50 lg:w-50"
          onHide={() => setShowAddForm(false)}
          footer={
            <>
              <div>
                <Button label="Save" size="small" severity="warning" outlined onClick={() => FacilityForm.handleSubmit()} className="mt-4"></Button>
                <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowAddForm(false)} className="mt-4"></Button>
              </div>
            </>
          }
        >
          <div className="grid mt-3">
            <div className="md:col-6 lg:col-6">
              <label className="mb-2" htmlFor="Status">Name</label>
              <InputText
                name="name"
                value={FacilityForm.values.name}
                onChange={(e) => FacilityForm.setFieldValue("name", e.target.value)}
              />
            </div>

            <div className="md:col-6 lg:col-6">
                <label className="mb-2" htmlFor="Status">Categories</label>
                <Dropdown
                  placeholder="Select a Category"
                  options={facilityCategories}
                  optionLabel="name"
                  optionValue="id"
                  name="categoryId"
                  filter
                  className="w-full"
                  value={FacilityForm?.values?.categoryId}
                  onChange={(e) => FacilityForm.setFieldValue("categoryId", e.value)}
                />
            </div>
          </div>
        </Dialog>

        <Dialog
          header="Edit Vehicle"
          visible={showEditForm}
          className="md:w-50 lg:w-50"
          onHide={() => setShowEditForm(false)}
          footer={
            <>
              <div>
                <Button label="Save" size="small" severity="warning" outlined onClick={() => FacilityFormEdit.handleSubmit()} className="mt-4"></Button>
                <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowEditForm(false)} className="mt-4"></Button>
              </div>
            </>
          }
        >
          <div className="grid mt-3">
            <div className="md:col-6 lg:col-6">
              <label className="mb-2" htmlFor="Status">Name</label>
              <InputText
                name="name"
                value={FacilityFormEdit.values.name}
                onChange={(e) => FacilityFormEdit.setFieldValue("name", e.target.value)}
              />
            </div>

            <div className="md:col-6 lg:col-6">
                <label className="mb-2" htmlFor="Status">Categories</label>
                <Dropdown
                  placeholder="Select a Category"
                  options={facilityCategories}
                  optionLabel="name"
                  optionValue="id"
                  name="categoryId"
                  filter
                  className="w-full"
                  value={FacilityFormEdit?.values?.categoryId}
                  onChange={(e) => FacilityFormEdit.setFieldValue("categoryId", e.value)}
                />
            </div>
          </div>
        </Dialog>
      </div>}
    </div>
  );
};

export default Facility;
