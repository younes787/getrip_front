import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { FilterMatchMode } from "primereact/api";
import { AddTicketOffer, GetAllFlightRequests, GetAllUsers, GetCurrency, GetFlightsRequestsByClientId, GetTicketOffersByrRequestId } from "../Services";
import { InputText } from "primereact/inputtext";
import LoadingComponent from "../components/Loading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { AddTicketOfferDTO } from "../modules/getrip.modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight, faCodePullRequest } from "@fortawesome/free-solid-svg-icons";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Sidebar } from 'primereact/sidebar';
import { Card } from "primereact/card";

const FlightRequests = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const role = User?.data?.role;
  const [loading, setLoading] = useState<boolean>(false);
  const [flightRequests, setFlightRequests] = useState<any[]>([]);
  const [ticketOffers, setTicketOffers] = useState<any[]>([]);
  const [isOfferLoading, setIsOfferLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { user } = useAuth();
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [requestId, setRequestId] = useState<number>(0);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    subject: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    notes: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [visibleOffer, setVisibleOffer] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const AddTicketOfferPopupForm = useFormik<AddTicketOfferDTO>({
    initialValues: {
      id: 0,
      serviceProviderId: user.data.accountId,
      ticketRequestId: 0,
      price: 0,
      isTaxIncluded: false,
      note: '',
      currencyId: 0,
    },
    validateOnChange: true,
    onSubmit: () => {
      setIsLoading(true);
      AddTicketOfferPopupForm.values.serviceProviderId = user.data.accountId;
      AddTicketOfferPopupForm.values.ticketRequestId = requestId;

      AddTicketOffer(AddTicketOfferPopupForm.values)
      .then((res) => {
        console.log(res, 'res');
      })
      .catch((error) => {
        console.error(error);
        setRequestId(0)
        setShowAddOffer(false);
      }).finally(() => {
        setRequestId(0)
        setIsLoading(false);
        setShowAddOffer(false);
      });
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        switch (role) {
          case 'Administrator':
            GetAllFlightRequests().then(res => { setFlightRequests(res.data); setLoading(false); }).catch(error => { setLoading(false); });
            break;
          case 'Service Provider':
            GetFlightsRequestsByClientId(user.data.accountId).then(res => { setFlightRequests(res.data); setLoading(false); }).catch(error => { setLoading(false); });
            break;
          case 'Client':
            GetFlightsRequestsByClientId(user.data.accountId).then(res => { setFlightRequests(res.data); setLoading(false); }).catch(error => { setLoading(false); });
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    GetAllUsers().then((res) => setAllUsers(res.data));
    GetCurrency().then((res) => setCurrencies(res.data));
    fetchData();
  }, [user.data.accountId]);

  const formatDate = (date: any) => {
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const BodyTemplate = (rowData: any) => {
      return (
        <div className="actions-cell" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div
            onClick={() => {
              setRequestId(rowData.id)
              setShowAddOffer(true)
            }}
            style={{
              color: 'green',
              border: '1px solid green',
              fontSize: '14px',
              borderRadius: '7px',
              padding: '10px',
              margin: '2px',
              cursor: 'pointer'
            }}
          >
            Add Offer
            <FontAwesomeIcon icon={faCodePullRequest} className="mx-2"/>
          </div>

          <Button
            onClick={() => {
              setVisibleOffer(true)
              setIsOfferLoading(true);
              GetTicketOffersByrRequestId(rowData.id).then(res => {
                setTicketOffers(res.data);
                setIsOfferLoading(false);
              });
            }}
            style={{
              color: '#f1881f',
              border: '1px solid #f1881f',
              fontSize: '14px',
              borderRadius: '7px',
              padding: '10px',
              margin: '2px',
              cursor: 'pointer',
              backgroundColor: 'transparent'
            }}
          >
            Show Offers
            <FontAwesomeIcon icon={faArrowAltCircleRight} className="mx-2"/>
          </Button>
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

  const header = renderHeader();

  const columns = [
    { field: "senderAccountId", header: "Sender Account", body: (row: any) => allUsers.find((user) => user.accountId === row.senderAccountId)?.name },
    { field: "adultPassengers", header: "Adult Passengers" },
    { field: "childPassengers", header: "Child Passengers" },
    { field: "country", header: "Country" },
    { field: "departureCity", header: "Departure City" },
    { field: "arrivalCity", header: "Arrival City" },
    { field: "departureDate", header: "Departure Date", body: (row: any) => formatDate(row.departureDate) },
    { field: "flightType", header: "Flight Type" },
    { field: "requestDate", header: "Request Date", body: (row: any) => formatDate(row.requestDate) },
    { field: "returnDate", header: "Return Date", body: (row: any) => formatDate(row.returnDate) },
    { field: "", header: "Actions", body: BodyTemplate, className: 'actions-column' }
  ];

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

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="card" style={{ margin: '0 200px'}}>
          <DataTable
            value={flightRequests}
            stripedRows
            showGridlines
            className="mt-5 orders-table"
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
            {columns.map(({ field, header, body, className }) => (
              <Column key={field} field={field} filter sortable header={header} body={body} className={className} />
            ))}
          </DataTable>
        </div>
      )}

      <Sidebar visible={visibleOffer} onHide={() => setVisibleOffer(false)}>
        <h2>Offers</h2>

        {isOfferLoading ? (
          <span>
            <i className="pi pi-spin pi-spinner"></i>
            {'  '}
            Loading...
          </span>
        ) : (
          ticketOffers && ticketOffers.length > 0 ? (
            ticketOffers.map((ticketOffer) => (
              <Card key={ticketOffer.id} className="my-2">
                <p className="m-0">Currency: {currencies?.find(cod => cod.id === ticketOffer.currencyId).name}</p>
                <p className="m-0">Tax Included: {showIcons(ticketOffer.isTaxIncluded)}</p>
                <p className="m-0">Price: {ticketOffer.price}</p>
                <p className="m-0">Note: {ticketOffer.note}</p>
              </Card>
            ))
          ) : <p className="text-center text-red-500 text-sm italic">No Offers</p>
        )}
      </Sidebar>

      <Dialog
        header="Add Add Offer"
        visible={showAddOffer}
        style={isMobile ? { width: "100vw" } : { width: "50vw" }}
        footer={
          <div>
            <Button size="small" severity="warning" outlined onClick={() => AddTicketOfferPopupForm.handleSubmit()} className="mt-4">
              {isLoading ? (
                  <span>
                    <i className="pi pi-spin pi-spinner"></i>
                    {'  '}
                    Loading...
                  </span>
                ) : 'Add'
              }
            </Button>

            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowAddOffer(false)} className="mt-4"></Button>
          </div>
        }
        onHide={() => setShowAddOffer(false)}
      >
        <div className="grid grid-cols-12">
          <div className="md:col-12 lg:col-12">
            <label htmlFor="Currency">Currency</label>
            <Dropdown
              placeholder="Select a Currency"
              options={currencies}
              optionLabel="name"
              optionValue="id"
              name="currencyId"
              filter
              className="w-full"
              value={AddTicketOfferPopupForm.values.currencyId}
              onChange={(e) => AddTicketOfferPopupForm.setFieldValue('currencyId', e.value)}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label htmlFor="Price">Price</label>
            <InputNumber
              placeholder="Price"
              name="price"
              className="w-full"
              step={1}
              min={1}
              showButtons
              value={AddTicketOfferPopupForm.values.price}
              onChange={(e) => AddTicketOfferPopupForm.setFieldValue('price', e.value)}
            />
          </div>

          <div className="md:col-12 lg:col-12 flex justify-content-start align-items-center">
            <label htmlFor="Tax Included">Tax Included</label>
            <InputSwitch
              name="isTaxIncluded"
              className="mx-2"
              checked={AddTicketOfferPopupForm.values?.isTaxIncluded}
              onChange={(e) => AddTicketOfferPopupForm.setFieldValue("isTaxIncluded", e.value)}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label htmlFor="Note">Note</label>
            <InputText
              placeholder="Note"
              name="note"
              className="w-full"
              value={AddTicketOfferPopupForm.values.note}
              onChange={(e) => AddTicketOfferPopupForm.setFieldValue('note', e.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default FlightRequests;
