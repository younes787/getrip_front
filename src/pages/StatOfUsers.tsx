import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { ApproveUser, RejectUser, GetPendingUsers, GetRejectedUsers } from "../Services";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface UserType {
  pending: boolean;
  rejected: boolean;
}

const StatOfServices = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showDialog, setShowDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentUserId, setCurrentUserId] = useState<any>(null);
  const [headerRejectionReason, setHeaderRejectionReason] = useState<string>('');

  const handleRejectClick = (userId: number) => {
    setHeaderRejectionReason('User rejection reason');
    setCurrentUserId(userId);
    setShowDialog(true);
  };

  const handleRejectConfirm = () => {
    if (currentUserId !== null) {
      RejectUser({
        id: currentUserId,
        note: rejectionReason
      });
    }

    setShowDialog(false);
    setRejectionReason('');
  };

  useEffect(() => {
    fetchData();
  }, [activeIndex]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeIndex === 0) {
        const res = await GetPendingUsers();
        setPendingUsers(res?.data || []);
      } else if (activeIndex === 1) {
        const res = await GetRejectedUsers();
        setRejectedUsers(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const header = renderHeader();

  const BodyTemplate = ({ rowData, userType }: { rowData: any, userType: UserType }) => {
    return (
      <div className="gap-3">
        {userType.pending ? (
          <>
            <i
              onClick={() => ApproveUser(rowData.accountId)}
              className="pi pi-check"
              style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
            ></i>
            <i
              onClick={() => handleRejectClick(rowData.accountId)}
              className="pi pi-times"
              style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
            ></i>
          </>
        ) : (
          <i
            onClick={() => ApproveUser(rowData.accountId)}
            className="pi pi-check"
            style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
          ></i>
        )}
      </div>
    );
  };

  return (
    <div className="p-5">
     { loading ? <LoadingComponent/> : <div>
      <TabView onTabChange={(e) => setActiveIndex(e.index)} activeIndex={activeIndex} className="p-0">
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
            <Column field="lastname" filter sortable body={(rowData) => (<div> {rowData.name + ' ' + rowData.lastname}</div>)} header="Full Name"></Column>
            <Column field="business" filter sortable header="Business"></Column>
            <Column field="email" filter sortable header="Email"></Column>
            <Column
              header="Actions"
              body={(rowData) => <BodyTemplate rowData={rowData} userType={{ pending: true, rejected: false }} />}
            />
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
            <Column field="lastname" filter sortable body={(rowData) => (<div> {rowData.name + ' ' + rowData.lastname}</div>)} header="Full Name"></Column>
            <Column field="business" filter sortable header="Business"></Column>
            <Column field="email" filter sortable header="Email"></Column>
            <Column
              header="Actions"
              body={(rowData) => <BodyTemplate rowData={rowData} userType={{ pending: false, rejected: true }} />}
            />
            </DataTable>
        </TabPanel>
      </TabView>
      </div>}

      <Dialog
        header={headerRejectionReason}
        visible={showDialog}
        style={{ width: '50vw' }}
        footer={<div>
            <Button label="Confirm" size="small" severity="warning" outlined onClick={handleRejectConfirm} className="mt-4"></Button>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowDialog(false)} className="mt-4"></Button>
        </div>}
        onHide={() => {if (!showDialog) return; setShowDialog(false); }}
      >
          <InputText
            name="rejection_reason"
            className="mt-2	w-full"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason"
          />
      </Dialog>
    </div>
  );
};

export default StatOfServices;
