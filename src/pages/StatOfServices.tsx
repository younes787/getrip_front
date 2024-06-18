import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { FilterMatchMode } from "primereact/api";
import LoadingComponent from "../components/Loading";
import { GetPendingServices, GetRejectedServices } from "../Services";

const StatOfServices = () => {
  const [loading, setLoading] = useState(false);
  const [pendingServices, setPendingServices] = useState([]);
  const [rejectedServices, setRejectedServices] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const [filters, setFilters] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
    name: { value: "", matchMode: FilterMatchMode.STARTS_WITH },
    description: { value: "", matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res1 = await GetPendingServices();
      setPendingServices(res1?.data || []);

      const res2 = await GetRejectedServices();
      setRejectedServices(res2?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onTabChange = async (event: any) => {
    setLoading(true);
    try {
      setActiveIndex(event.index);
      if (event.index === 0) {
        const res = await GetPendingServices();
        setPendingServices(res?.data || []);
      } else if (event.index === 1) {
        const res = await GetRejectedServices();
        setRejectedServices(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const onGlobalFilterChange = (event: any) => {
    const { value } = event.target;
    setGlobalFilterValue(value);
    setFilters({ ...filters, global: { ...filters.global, value } });
  };

  const renderHeader = () => (
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

  const serviceColumns = [
    { field: "name", header: "Name", sortable: true },
    { field: "description", header: "Description", sortable: true },
    {
      field: "fieldsAndValues",
      header: "Fields and Values",
      body: (rowData: any) => (
        <ul>
          {rowData.fieldsAndValues.map(({ fieldName, value }: any, index: number) => (
            <li key={index}>{`Field Name: ${fieldName},Value: ${value}`}</li>
          ))}
        </ul>
      ),
      sortable: false,
    },
    {
      field: "isActive",
      header: "Active",
      body: (rowData: any) =>
        rowData.isActive ? (
          <i className="pi pi-check-circle check-circle-services"></i>
        ) : (
          <i className="pi pi-times-circle times-circle-services"></i>
        ),
      sortable: true,
    },
    {
      field: "isApprovalRequired",
      header: "Approval Required",
      body: (rowData: any) =>
        rowData.isApprovalRequired ? (
          <i className="pi pi-check-circle check-circle-services"></i>
        ) : (
          <i className="pi pi-times-circle times-circle-services"></i>
        ),
      sortable: true,
    },
    {
      field: "isApproved",
      header: "Approved",
      body: (rowData: any) =>
        rowData.isApproved ? (
          <i className="pi pi-check-circle check-circle-services"></i>
        ) : (
          <i className="pi pi-times-circle times-circle-services"></i>
        ),
      sortable: true,
    },
    {
      field: "isArchived",
      header: "Archived",
      body: (rowData: any) =>
        rowData.isArchived ? (
          <i className="pi pi-check-circle check-circle-services"></i>
        ) : (
          <i className="pi pi-times-circle times-circle-services"></i>
        ),
      sortable: true,
    },
    {
      field: "isTaxIncluded",
      header: "Tax Included",
      body: (rowData: any) =>
        rowData.isTaxIncluded ? (
          <i className="pi pi-check-circle check-circle-services"></i>
        ) : (
          <i className="pi pi-times-circle times-circle-services"></i>
        ),
      sortable: true,
    },
  ];

  return (
    <div className="p-5">
      {loading ? (
        <LoadingComponent />
      ) : (
        <TabView
          activeIndex={activeIndex}
          onTabChange={onTabChange}
          className="p-0 text-center"
        >
          <TabPanel header="Pending Services">
            <DataTable
              value={pendingServices}
              header={renderHeader()}
              className="p-5"
              style={{ fontSize: "1.2rem", padding: "6px" }}
              resizableColumns
              rows={5}
              rowsPerPageOptions={[10, 15, 20, 50]}
              filters={filters}
              paginator
              rowHover
              sortMode="multiple"
              stripedRows
              showGridlines
              tableStyle={{ minWidth: "50rem" }}
            >
              {serviceColumns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  sortable={col.sortable}
                  className="text-center"
                />
              ))}
            </DataTable>
          </TabPanel>
          <TabPanel header="Rejected Services">
            <DataTable
              value={rejectedServices}
              header={renderHeader()}
              className="p-5"
              style={{ fontSize: "1.2rem", padding: "16px" }}
              resizableColumns
              rows={5}
              rowsPerPageOptions={[10, 15, 20, 50]}
              filters={filters}
              paginator
              rowHover
              sortMode="multiple"
              stripedRows
              showGridlines
              tableStyle={{ minWidth: "50rem" }}
            >
              {serviceColumns.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  sortable={col.sortable}
                  className="text-center"
                />
              ))}
            </DataTable>
          </TabPanel>
        </TabView>
      )}
    </div>
  );
};

export default StatOfServices;
