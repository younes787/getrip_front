import AppWidgetSummary from "../components/Summery";
import glassBag from "../Assets/glass/ic_glass_bag.png";
import glassbuy from "../Assets/glass/ic_glass_buy.png";
import glassUsers from "../Assets/glass/ic_glass_users.png";
import AppWebsiteVisits from "../components/Chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AppUsersVisits from "../components/Circle";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Image } from 'primereact/image';
import { Trans, useTranslation } from "react-i18next";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { GetAllRequests, GetPendingRequests, GetApprovedRequests, GetRejectedRequests, GetAllServices, GetAllUsers, DeleteRequest } from "../Services";
import { formatDate } from "../Helper/functions";

const Dashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState({
    all: [],
    pending: [],
    approved: [],
    rejected: []
  });
  const [allServices, setAllServices] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    subject: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    notes: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [
          allRequestsResponse,
          pendingRequestsResponse,
          approvedRequestsResponse,
          rejectedRequestsResponse,
          servicesResponse,
          usersResponse
        ] = await Promise.all([
          GetAllRequests(),
          GetPendingRequests(),
          GetApprovedRequests(),
          GetRejectedRequests(),
          GetAllServices(),
          GetAllUsers()
        ]);

        setRequests({
          all: allRequestsResponse.data,
          pending: pendingRequestsResponse.data,
          approved: approvedRequestsResponse.data,
          rejected: rejectedRequestsResponse.data
        });
        setAllServices(servicesResponse.data);
        setAllUsers(usersResponse.data);
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

  const BodyTemplate = (rowData: any) => (
    <div className="gap-3">
      <i className="pi pi-trash ml-3" onClick={() => DeleteRequest(rowData.id)} style={{fontSize: "1.2rem",color: "red",padding: "7px",cursor: "pointer"}} ></i>
    </div>
  );

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

  const header = renderHeader();

  const columns = [
    { field: "senderAccountId", header: "Sender Account", body: (row: any) => allUsers.find((user) => user.accountId === row.senderAccountId)?.name },
    { field: "serviceId", header: "Service", body: (row: any) => allServices.find((service) => service.id === row.serviceId)?.name },
    { field: "status", header: "Status" },
    { field: "subject", header: "Subject", body: (row: any) => <div style={{ textWrap: "wrap" }}>{truncateText(row.subject, 10)}</div> },
    { field: "notes", header: "Notes" },
    { field: "adultPassengers", header: "Adult Passengers" },
    { field: "childPassengers", header: "Child Passengers" },
    { field: "endDate", header: "End Date", body: (row: any) => formatDate(row.endDate) },
    { field: "isApproved", header: "Approved", body: (row: any) => showIcons(row.isApproved) },
    { field: "isPending", header: "Pending", body: (row: any) => showIcons(row.isPending) },
    { field: "lastUpdateDate", header: "Last Update Date", body: (row: any) => formatDate(row.endDate) },
    { field: "recieverAccountId", header: "Reciever Account", body: (row: any) => allUsers.find((user) => user.accountId === row.recieverAccountId)?.name },
    { field: "requestDate", header: "Request Date", body: (row: any) => formatDate(row.endDate) },
    { field: "startDate", header: "Start Date", body: (row: any) => formatDate(row.endDate) },
    { field: "rejectionNote", header: "Rejection Note" },
    { field: "", header: "Actions", body: BodyTemplate }
  ];

  return (
    <div className="dashboard">
      <span>
        <h1 className="text-center text-4xl get-rp ml-5">
          <Trans i18nKey="Dashboard.welcomeMessage" components={{ strongClass: <span className="secondery" /> }}>
            Ge<span className="secondery">t</span>rip
          </Trans>
        </h1>
      </span>

      <Accordion activeIndex={0} className="my-3">
        <AccordionTab header={t('Dashboard.Summery')}>
        <div className="grid mr-0 gap-5 mt-5">
            <AppWidgetSummary
              title={t('Dashboard.Weekly Sales')}
              total={714}
              color="success"
              icon={<Image src={glassBag} alt={`icon`}  />}
            />

            <AppWidgetSummary
              title={t('Dashboard.New Users')}
              total={1352831}
              color="info"
              icon={<Image src={glassUsers} alt={`icon`}  />}
            />

            <AppWidgetSummary
              title={t('Dashboard.Weekly Orders')}
              total={1723315}
              color="warning"
              icon={<Image src={glassbuy} alt={`icon`}  />}
            />
          </div>
          </AccordionTab>
      </Accordion>

      <Accordion activeIndex={0} className="my-3">
        <AccordionTab header={t('Dashboard.Requests')}>
          <div className="card">
            <TabView>
              {Object.entries(requests).map(([key, value]) => (
                <TabPanel key={key} header={`${key.charAt(0).toUpperCase() + key.slice(1)} Requests`} leftIcon={`pi pi-${key === 'all' ? 'calendar' : 'user'} m-2`}>
                  <DataTable
                    value={value}
                    stripedRows
                    showGridlines
                    className="p-5"
                    tableStyle={{ minWidth: "50rem" }}
                    size="small"
                    style={{ fontSize: "1.2rem", padding: "16px" }}
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
        </AccordionTab>
      </Accordion>

      <Accordion activeIndex={0} className="my-3">
        <AccordionTab header={t('Dashboard.Orders')} >
          <DataTable
            // value={UsersList}
            stripedRows
            showGridlines
            className=" p-5"
            tableStyle={{ minWidth: "50rem" }}
            sortMode="multiple"
            rows={5}
            rowsPerPageOptions={[10, 15, 20, 50]}
            paginator
            rowHover
          >
            <Column field="username" sortable sortField="" header="Customer"></Column>
            <Column field="name" sortable header="Service"></Column>
            <Column field="lastname" sortable header="Saler"></Column>
            <Column field="business" sortable header="Status"></Column>
          </DataTable>
        </AccordionTab>
      </Accordion>

      <Accordion activeIndex={0} className="my-3">
        <AccordionTab header={t('Dashboard.Charts')} >
          <div className="flex flex-wrap  mr-0 gap-5 mt-5" >
            <div className="grid grid-cols-2 w-full" style={{justifyContent:'center'}}>
              <AppWebsiteVisits
                title={t('Dashboard.Website Visits')}
                subheader={t('Dashboard.Last Year')}
              />
              <AppUsersVisits
                title={t('Website Visits')}
                subheader={t('Dashboard.Last Year')}
              />
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default Dashboard;
