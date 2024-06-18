import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { GetPendingUsers, GetRejectedUsers } from "../Services";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";
import { TabPanel, TabView } from "primereact/tabview";

const StatOfServices = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    name: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    lastname: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    email: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    business: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    position: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    role: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    taxNumber: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    zipCode: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
  });

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

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        setActiveIndex(0);
        const res = await GetPendingUsers();
        setPendingUsers(res?.data);
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, []);

  const header = renderHeader();

  const onTabChange = async (e: any) => {
    setLoading(true);

    try {
      if(e.index === 0) {
        const res = await GetPendingUsers();
        setPendingUsers(res?.data);
      } else if (e.index === 1) {
        const res = await GetRejectedUsers();
        setRejectedUsers(res?.data);
      }
    } catch (error) {
      console.error('Error fetching users on tab change:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-5">
     { loading ? <LoadingComponent/> : <div>

    <TabView onTabChange={onTabChange} activeIndex={activeIndex} className="p-0">
      <TabPanel header="Pending Users">
        <DataTable
          value={pendingUsers}
          stripedRows
          showGridlines
          className=" p-5"
          tableStyle={{ minWidth: "50rem" }}
          size="small"
          style={{ fontSize: "1.2rem", padding: "6px" }}
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
          <Column field="lastname" filter sortable header="Last Name"></Column>
          <Column field="email" filter sortable header="Email"></Column>
          <Column field="business" filter sortable header="Business"></Column>
          <Column field="position" filter sortable header="Position"></Column>
          <Column field="role" filter sortable header="Role"></Column>
          <Column field="taxNumber" filter sortable header="Tax Number"></Column>
          <Column field="zipCode" filter sortable header="Zip Code"></Column>
        </DataTable>
      </TabPanel>
      <TabPanel header="Rejected Users">
        <DataTable
          value={rejectedUsers}
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
          <Column field="lastname" filter sortable header="Last Name"></Column>
          <Column field="email" filter sortable header="Email"></Column>
          <Column field="business" filter sortable header="Business"></Column>
          <Column field="position" filter sortable header="Position"></Column>
          <Column field="role" filter sortable header="Role"></Column>
          <Column field="taxNumber" filter sortable header="Tax Number"></Column>
          <Column field="zipCode" filter sortable header="Zip Code"></Column>
        </DataTable>
      </TabPanel>
    </TabView>
      </div>}
    </div>
  );
};

export default StatOfServices;
