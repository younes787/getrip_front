import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { FilterMatchMode } from "primereact/api";
import LoadingComponent from "../components/Loading";
import { ApproveService, RejectService, GetPendingServices, GetRejectedServices } from "../Services";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface ServiceType {
  pending: boolean;
  rejected: boolean;
}

const StatOfServices = () => {
  const [loading, setLoading] = useState(false);
  const [pendingServices, setPendingServices] = useState([]);
  const [rejectedServices, setRejectedServices] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentServiceId, setCurrentServiceId] = useState<any>(null);
  const [headerRejectionReason, setHeaderRejectionReason] = useState<string>('');

  const handleRejectClick = (serviceId: number) => {
    setHeaderRejectionReason('Service rejection reason');
    setCurrentServiceId(serviceId);
    setShowDialog(true);
  };

  const handleRejectConfirm = () => {
    if (currentServiceId !== null) {
      RejectService({
        id: currentServiceId,
        note: rejectionReason
      });
    }

    setShowDialog(false);
    setRejectionReason('');
  };

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

  const BodyTemplate = ({ rowData, serviceType }: { rowData: any; serviceType: ServiceType }) => (
    <div className="gap-3">
      {serviceType.pending && (
        <>
          <i
            onClick={() => ApproveService(rowData.id)}
            className="pi pi-check"
            style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
          ></i>
          <i
            onClick={() => handleRejectClick(rowData.id)}
            className="pi pi-times"
            style={{ color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
          ></i>
        </>
      )}
      {!serviceType.pending && (
        <i
          onClick={() => ApproveService(rowData.id)}
          className="pi pi-check"
          style={{ color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px', cursor: 'pointer' }}
        ></i>
      )}
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
          {rowData.fieldsAndValues ? rowData.fieldsAndValues.map(({ fieldName, value }: any, index: number) => (
            <li key={index}>{`Field Name: ${fieldName}, Value: ${value}`}</li>
          )): <p className="text-center text-red-500 text-sm italic">No Data</p>}
        </ul>
      ),
      sortable: false,
    },
    {
      field: "",
      header: "Actions",
      body: (rowData: any) => <BodyTemplate rowData={rowData} serviceType={{ pending: true, rejected: false }} />,
      sortable: false,
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
