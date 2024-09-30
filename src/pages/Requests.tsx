import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { FilterMatchMode } from "primereact/api";
import { ApproveRequest, GetAllServices, GetAllUsers, GetClientApprovedRequests, GetClienterAllrequests, GetClientPendingRequests, GetClientRejectedRequests, GetServiceProviderAllRequests, GetServiceProviderApprovedRequests, GetServiceProviderPendingRequests, GetServiceProviderRejectedRequests, RejectRequest } from "../Services";
import { InputText } from "primereact/inputtext";
import LoadingComponent from "../components/Loading";
import { TabPanel, TabView } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { faCheck, faInfo, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Requests = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const name = User?.data?.name + ' ' + User?.data?.lastname
  const role = User?.data?.role;
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState({
    all: [],
    pending: [],
    approved: [],
    rejected: []
  });
  const [allServices, setAllServices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [showRequestsDetails, setShowRequestsDetails] = useState<boolean>(false);
  const [dataRequestsDetails, setDataRequestsDetails] = useState<any>();
  const [rejectionReason, setRejectionReason] = useState('');
  const [headerRejectionReason, setHeaderRejectionReason] = useState<string>('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    subject: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    notes: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const [currentRequestId, setCurrentRequestId] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const isServiceProvider = role === 'Administrator' || role === 'Service Provider';
        const isClient = role === 'Client';

        const getRequestsFunctions = (accountId: any) => {
          if (isServiceProvider) {
            return [
              GetServiceProviderAllRequests(accountId),
              GetServiceProviderPendingRequests(accountId),
              GetServiceProviderApprovedRequests(accountId),
              GetServiceProviderRejectedRequests(accountId),
            ];
          } else if (isClient) {
            return [
              GetClienterAllrequests(accountId),
              GetClientPendingRequests(accountId),
              GetClientApprovedRequests(accountId),
              GetClientRejectedRequests(accountId),
            ];
          } else {
            return [null, null, null, null];
          }
        };

        const [
          allRequestsResponse,
          pendingRequestsResponse,
          approvedRequestsResponse,
          rejectedRequestsResponse,
          servicesResponse,
        ] = await Promise.all([
          ...getRequestsFunctions(user.data.accountId),
          GetAllServices(),
        ]);

        setRequests({
          all: allRequestsResponse?.data || [],
          pending: pendingRequestsResponse?.data || [],
          approved: approvedRequestsResponse?.data || [],
          rejected: rejectedRequestsResponse?.data || [],
        });

        setAllServices(servicesResponse.data);
        GetAllUsers().then((res) => setUsers(res.data))
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.data.accountId]);

  const truncateText = (text: string, wordCount: number) => {
    const words = text?.split(" ");
    if (words?.length <= wordCount) return text;
    return `${words.slice(0, wordCount).join(" ")}...`;
  };

  const formatDate = (date: any) => {
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const showIcons = (check: boolean) => (
    <i
      className={`pi ${check ? "pi-check" : "pi-times"}`}
      style={{
        color: check ? "green" : "red",
        border: `1px solid ${check ? "green" : "red"}`,
        fontSize: "14px",
        borderRadius: "50%",
        padding: "5px",
        margin: "2px"
      }}
    ></i>
  );

  const handleRejectClick = (RequestId: any) => {
    setHeaderRejectionReason('Request rejection reason');
    setCurrentRequestId(RequestId);
    setShowDialog(true);
  };

  const handleRejectConfirm = () => {
    if (currentRequestId !== null) {
      RejectRequest({
        id: currentRequestId,
        note: rejectionReason
      });
    }

    setShowDialog(false);
    setRejectionReason('');
  };

  const BodyTemplate = (rowData: any) => {
      return (
        <div className="actions-cell flex">
          {rowData.status === "Pending, Waiting for Provider's Approval" && (role === 'Administrator' || role === 'Service Provider') &&
          <>
            <div
              onClick={() => ApproveRequest(rowData.id)}
              style={{
                width: 'max-content',
                color: 'green',
                border: '1px solid green',
                fontSize: '14px',
                borderRadius: '7px',
                padding: '10px',
                margin: '2px',
                cursor: 'pointer'
              }}
            >
              Approve
              <FontAwesomeIcon icon={faCheck} className="mx-2"/>
            </div>

            <div
              onClick={() => handleRejectClick(rowData.id)}
              style={{
                width: 'max-content',
                color: 'red',
                border: '1px solid red',
                fontSize: '14px',
                borderRadius: '7px',
                padding: '10px',
                margin: '2px',
                cursor: 'pointer'
              }}
            >
              Reject
              <FontAwesomeIcon icon={faTimes} className="mx-2"/>
            </div>
          </>
          }
           <div
              onClick={() => {
                setShowRequestsDetails(true);
                setDataRequestsDetails(rowData);
              }}
              style={{
                width: 'max-content',
                color: 'orange',
                border: '1px solid orange',
                fontSize: '14px',
                borderRadius: '7px',
                padding: '10px',
                margin: '2px',
                cursor: 'pointer'
              }}
            >
              Details
              <FontAwesomeIcon icon={faInfo} className="mx-2"/>
            </div>
        </div>
      );
  };

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      global: { ...prevFilters.global, value }
    }));
    setGlobalFilterValue(value);
  };

  const renderHeader = () => (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
      </span>
    </div>
  );

  const AccountName = ({ accountId }: { accountId: any }) => {
    let name;
    if(users) {
      name = users.find(_use => _use.accountId === accountId)?.name;
    }

    return <span>{name}</span>;
  };

  const header = renderHeader();

  const columns = [
    { field: "senderAccountId", header: "Sender Account", body: (row: any) => name },
    { field: "serviceId", header: "Service", body: (row: any) => allServices.find((service) => service.id === row.serviceId)?.name },
    { field: "status", header: "Status" },
    { field: "subject", header: "Subject", body: (row: any) => <div style={{ textWrap: "wrap" }}>{truncateText(row.subject, 10)}</div> },
    // { field: "notes", header: "Notes" },
    // { field: "adultPassengers", header: "Adult Passengers" },
    // { field: "childPassengers", header: "Child Passengers" },
    // { field: "endDate", header: "End Date", body: (row: any) => formatDate(row.endDate) },
    // { field: "isApproved", header: "Approved", body: (row: any) => showIcons(row.isApproved) },
    // { field: "isPending", header: "Pending", body: (row: any) => showIcons(row.isPending) },
    // { field: "lastUpdateDate", header: "Last Update Date", body: (row: any) => formatDate(row.endDate) },
    // { field: "recieverAccountId", header: "Receiver Account", body: (row: any) => <AccountName accountId={row.recieverAccountId} /> || 'Loading...'},
    // { field: "requestDate", header: "Request Date", body: (row: any) => formatDate(row.endDate) },
    // { field: "startDate", header: "Start Date", body: (row: any) => formatDate(row.endDate) },
    // { field: "rejectionNote", header: "Rejection Note" },
    { field: "", header: "Actions", body: BodyTemplate }
  ];

  const RequestInfoTable = ({ dataRequestsDetails }: any) => {
    const data = [
      {
        label: 'Adult Passengers',
        value: dataRequestsDetails.adultPassengers
      },
      {
        label: 'Child Passengers',
        value: dataRequestsDetails.childPassengers
      },
      {
        label: 'End Date',
        value: formatDate(dataRequestsDetails.endDate)
      },
      {
        label: 'Approved',
        value: showIcons(dataRequestsDetails.isApproved)
      },
      {
        label: 'Pending',
        value: showIcons(dataRequestsDetails.isPending)
      },
      {
        label: 'Last Update Date',
        value: formatDate(dataRequestsDetails.lastUpdateDate)
      },
      {
        label: 'Notes',
        value: dataRequestsDetails.notes
      },
      {
        label: 'Reciever Account',
        value: <AccountName accountId={dataRequestsDetails.recieverAccountId} /> || 'Loading...'
      },
      {
        label: 'Rejection Note',
        value: dataRequestsDetails.rejectionNote
      },
      {
        label: 'Request Date',
        value: formatDate(dataRequestsDetails.requestDate)
      },
      {
        label: 'Sender Account',
        value: name
      },
      {
        label: 'Service',
        value: allServices.find((service) => service.id === dataRequestsDetails.serviceId)?.name
      },
      {
        label: 'Start Date',
        value: formatDate(dataRequestsDetails.startDate)
      },
      {
        label: 'Status',
        value: dataRequestsDetails.status
      },
      {
        label: 'Subject',
        value: dataRequestsDetails.subject
      },
      {
        label: 'Total Price',
        value: dataRequestsDetails.totalPrice
      },
    ];

    return (
      <DataTable value={data} tableStyle={{ width: '100%' }}>
        <Column field="label" header="Policy" />
        <Column field="value" header="Details" />
      </DataTable>
    );
  };

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="card" style={{ margin: '0 200px'}}>
          <TabView className="p-0">
            {Object.entries(requests).map(([key, value]) => (
              <TabPanel key={key} header={`${key.charAt(0).toUpperCase() + key.slice(1)} Requests`} leftIcon={`pi pi-${key === 'all' ? 'calendar' : 'user'} m-2`}>
                <DataTable
                  value={value}
                  stripedRows
                  showGridlines
                  className="mt-5"
                  tableStyle={{ minWidth: "50rem" }}
                  size="small"
                  style={{ fontSize: "1.2rem"}}
                  resizableColumns
                  rows={5}
                  rowsPerPageOptions={[5, 10, 15, 20, 50]}
                  filters={filters}
                  header={header}
                  paginator
                  rowHover
                  sortMode="multiple"
                >
                  {columns.map(({ field, header, body }) => (
                    <Column key={field} field={field} filter sortable header={header} body={body} />
                  ))}
                </DataTable>
              </TabPanel>
            ))}
          </TabView>
        </div>
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

      <Dialog
        header={'Request Info'}
        visible={showRequestsDetails}
        style={{ width: '50vw' }}
        footer={<div>
            <Button label="Hide" severity="danger" outlined size="small" onClick={() => setShowRequestsDetails(false)} className="mt-4"></Button>
        </div>}
        onHide={() => setShowRequestsDetails(false)}
      >
        <div className="grid grid-cols-12">
          <div className="md:col-12 lg:col-12 sm:col-12">
            {dataRequestsDetails && <>
              <RequestInfoTable dataRequestsDetails={dataRequestsDetails} />
            </>}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Requests;
