import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { FilterMatchMode } from "primereact/api";
import { GetAllOrders, GetAllServices, GetAllUsers, GetCurrency, GetOrderstsByRecieverId, GetOrderstsBySenderId } from "../Services";
import { InputText } from "primereact/inputtext";
import LoadingComponent from "../components/Loading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InitializePopupDTO } from "../modules/getrip.modules";
import { LahzaTransactionInitialize, LahzaTransactionVerify } from "../Services/providerRequests";

const Orders = () => {
  const User = JSON.parse(localStorage?.getItem('user') as any)
  const role = User?.data?.role;
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currency, setCurrency] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { user } = useAuth();
  const [showPaid, setShowPaid] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    subject: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    notes: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });

  const InitializePopupForm = useFormik<InitializePopupDTO>({
    initialValues: {
      email: User?.data?.email,
      mobile: User?.data?.phone ?? '',
      firstName: User?.data?.name,
      lastName: User?.data?.lastname,
      amount: '',
      currency: 'USD',
      channels: ['card', 'bank'],
      metadata: {
        "custom_fields":[
        {
          "display_name": "Project Name",
          "variable_name": "Project Name",
          "value": "GeTrip"
        },
        {
          "display_name":"OrderId",
          "variable_name":"OrderId",
          "value": orderId
        },
      ]
      },
      label: '',
    },
    validateOnChange: true,
    onSubmit: () => {
      InitializePopupForm.values.amount = String(orders?.find((order: any) => order.id === orderId)?.amount || '0');
      InitializePopupForm.values.currency = 'USD';
      InitializePopupForm.values.channels = ['card', 'bank'];
      InitializePopupForm.values.metadata = {
        "custom_fields":[
          {
            "display_name": "Project Name",
            "variable_name": "Project Name",
            "value": "GeTrip"
          },
          {
            "display_name":"OrderId",
            "variable_name":"OrderId",
            "value": orderId
          },
      ]};

      LahzaTransactionInitialize(InitializePopupForm.values)
      .then((res) => {
        if (res['status']) {
          const { authorization_url, reference } = res.data;
          openPaymentWindow(authorization_url, reference);
        }
      })
      .catch((error) => {
        console.error(error);
        setOrderId(null)
        setShowPaid(false);
      }).finally(() => {
        setOrderId(null)
        setShowPaid(false);
      });
    },
  });

  const openPaymentWindow = (url: string, reference: string) => {
    const popup = window.open(url, 'PaymentWindow', 'width=600,height=600');
    if (popup) {
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          checkPaymentStatus(reference);
        }
      }, 1000);
    } else {
      console.error('Popup blocked. Please allow popups and try again.');
    }
  };

  const checkPaymentStatus = (reference: string) => {
    LahzaTransactionVerify(reference)
      .then((res) => {
        console.log(res.data, 'Payment completed');
      })
      .catch((error) => {
        console.error(error, 'Error verifying payment');
      })
      .finally(() => {
        setOrderId(null)
        setShowPaid(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        switch (role) {
          case 'Administrator':
            GetAllOrders().then(res => { setOrders(res.data); setLoading(false); }).catch(error => { setLoading(false); });
            break;
          case 'Service Provider':
            GetOrderstsByRecieverId(user.data.accountId).then(res => { setOrders(res.data); setLoading(false); }).catch(error => { setLoading(false); });
            break;
          case 'Client':
            GetOrderstsBySenderId(user.data.accountId).then(res => { setOrders(res.data); setLoading(false); }).catch(error => { setLoading(false); });
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

    GetAllServices().then((res) => setAllServices(res.data));
    GetAllUsers().then((res) => setAllUsers(res.data));
    GetCurrency().then((res) => setCurrency(res.data));
    fetchData();
  }, [user.data.accountId]);

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

  const BodyTemplate = (rowData: any) => {
    if (!rowData.isCanceled && !rowData.isPayed) {
      return (
        <div className="gap-3">
          <i
            onClick={() => {
              setOrderId(rowData.id)
              setShowPaid(true)
            }}
            className="pi pi-check"
            style={{color: 'green',border: '1px solid green',fontSize: '14px',borderRadius: '50%',padding: '5px',margin: '2px',cursor: 'pointer'}}
          ></i>
        </div>
      );
    }
    return null;
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
    { field: "requestId", header: "Request", body: (row: any) => allUsers.find((user) => user.accountId === row.requestId)?.name},
    { field: "serviceId", header: "Service", body: (row: any) => allServices.find((service) => service.id === row.serviceId)?.name},
    { field: "orderStatus", header: "Order status" },
    { field: "currencyId", header: "Currency", body: (row: any) => currency.find((currenc) => currenc.id === row.currencyId)?.name },
    { field: "isCanceled", header: "Canceled", body: (row: any) => showIcons(row.isCanceled) },
    { field: "isPayed", header: "Payed", body: (row: any) => showIcons(row.isPayed) },
    { field: "amount", header: "Amount" },
    { field: "orderDate", header: "Order date", body: (row: any) => formatDate(row.orderDate)},
    { field: "", header: "Actions", body: BodyTemplate }
  ];

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="card" style={{ margin: '0 200px'}}>
          <DataTable
            value={orders}
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
        </div>
      )}

    <Dialog
      header="Pay"
      visible={showPaid}
      style={{maxWidth: '50%', padding: '0', margin: '0', backgroundColor: 'transparent'}}
      footer={<div>
        <Button label="Cancel" severity="danger" outlined size="small" onClick={() => {
          setOrderId(null)
          setShowPaid(false)
          }} className="mt-4"></Button>
        <Button label="Pay" severity="success" outlined size="small" onClick={() => InitializePopupForm.submitForm()} className="mt-4"></Button>
      </div>}
      onHide={() => {
        setOrderId(null)
        setShowPaid(false)
      }}
    >
      <div className="grid mt-3">
        <div className="md:col-12 lg:col-12">
          <label className="mb-2" htmlFor="Email">Email</label>
          <InputText
            name="email"
            className="w-full"
            value={InitializePopupForm.values.email}
            onChange={(e) => InitializePopupForm.setFieldValue("email", e.target.value)}
          />
        </div>

        <div className="md:col-12 lg:col-12">
          <label className="mb-2" htmlFor="Mobile">Mobile</label>
          <InputText
            name="mobile"
            className="w-full"
            value={InitializePopupForm.values.mobile}
            onChange={(e) => InitializePopupForm.setFieldValue("mobile", e.target.value)}
          />
        </div>

        <div className="md:col-12 lg:col-12">
          <label className="mb-2" htmlFor="First Name">First Name</label>
          <InputText
            name="firstName"
            className="w-full"
            value={InitializePopupForm.values.firstName}
            onChange={(e) => InitializePopupForm.setFieldValue("firstName", e.target.value)}
          />
        </div>

        <div className="md:col-12 lg:col-12">
          <label className="mb-2" htmlFor="Last Name">Last Name</label>
          <InputText
            name="Last Name"
            className="w-full"
            value={InitializePopupForm.values.lastName}
            onChange={(e) => InitializePopupForm.setFieldValue("lastName", e.target.value)}
          />
        </div>

        <div className="md:col-12 lg:col-12">
          <label className="mb-2" htmlFor="Label">Label</label>
          <InputText
            name="label"
            className="w-full"
            value={InitializePopupForm.values.label}
            onChange={(e) => InitializePopupForm.setFieldValue("label", e.target.value)}
          />
        </div>
      </div>
    </Dialog>
    </div>
  );
}

export default Orders;
