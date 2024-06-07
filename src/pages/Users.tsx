import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { UsersDTO } from "../modules/getrip.modules";
import { CreateUser, DeleteUser, GetAllRoles, GetUsersInRole, UpdateUser} from "../Services";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";
import { TabPanel, TabView } from "primereact/tabview";

const Users = () => {
  const [UsersList, setUsersList] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [rolesList, setRolesList] = useState<any>();
  const [rolesName, setRolesName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    setLoading(true);

    GetAllRoles().then((res) => {
      setRolesList(res.data)
      setRolesName(res.data[0].name);
    }).finally(() => {
      fetchUsersList();
    });
  }, [rolesName]);

  const fetchUsersList = () => {
    if(rolesName) {
      GetUsersInRole(rolesName).then((res) => {
        setUsersList(res?.data);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
      });
    }
  };

  const onTabChange = (e: any) => {
    setLoading(true);
    setRolesName(rolesList[e.index].name);
    setActiveIndex(e.index);
    GetUsersInRole(rolesList[e.index].name).then((res) => {
      setUsersList(res?.data);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    });
  };

  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    lastname: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    business: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH
    },
    email: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH
    },
    role: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH
    },
  });

  const Usersform = useFormik<UsersDTO>({
    initialValues: new UsersDTO(),
    validateOnChange: true,
    onSubmit: () => {
      Usersform.values.role = rolesName;
      CreateUser(Usersform.values);
      setShow(false);
    },
  });

  const UsersformEdit = useFormik<UsersDTO>({
    initialValues: new UsersDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UsersformEdit.values.role = rolesName;
      UpdateUser(UsersformEdit.values);
      setShowEdit(false);
    },
  });

  const ShowUser = (rowData: any) => {
    setShowEdit(true);

    UsersformEdit.setValues({
      username: rowData.username,
      name: rowData.name,
      lastname: rowData.lastname,
      business: rowData.business,
      password: rowData.password,
      email: rowData.email,
      role: rowData.role,
    });
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

  const DeleteUsers = (Email: string) => {
    DeleteUser(Email);
  };

  const confirm = (email: string) => {
    confirmDialog({
      message: "Do you want to delete this user?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger py-2",
      rejectClassName: "p-button-outlined py-2",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      accept: () => DeleteUsers(email),
    });
  };

  const BodyTemplate = (rowData: any) => {
    return (
      <div className="gap-3">
        <i
          className="pi pi-bold pi-pencil"
          onClick={() => ShowUser(rowData)}
          style={{
            fontSize: "1.2rem",
            color: "slateblue",
            padding: "7px",
            cursor: "pointer",
          }}
        ></i>
        <i
          className="pi pi-bold pi-trash"
          onClick={() => confirm(rowData?.email)}
          style={{ fontSize: "1.2rem", color: "red", cursor: "pointer" }}
        ></i>
      </div>
    );
  };

  return (
    <div> {loading ? <LoadingComponent/> :
      <div>
        <ConfirmDialog />

        <TabView className="p-5" onTabChange={onTabChange} activeIndex={activeIndex}>
          {rolesList && rolesList.length > 0 &&
            rolesList.map((role: any, index: number) => (
              <TabPanel key={index} header={role.name}>
                <Button label="Add New User" onClick={() => setShow(true)} size="small" className="pr_btn"></Button>

                <DataTable
                  value={UsersList}
                  stripedRows
                  showGridlines
                  className="mt-4"
                  tableStyle={{ minWidth: "50rem" }}
                  sortMode="multiple"
                  rows={5}
                  rowsPerPageOptions={[10, 15, 20, 50]}
                  paginator
                  rowHover
                  filters={filters}
                  header={header}
                >
                  <Column field="lastname" filter sortable body={(rowData) => (<div> {rowData.name + ' ' + rowData.lastname}</div>)} header="Full Name"></Column>
                  <Column field="business" filter sortable header="Business"></Column>
                  <Column field="email" filter sortable header="Email"></Column>
                  <Column field="" header="Actions" sortable body={BodyTemplate}></Column>
                </DataTable>
              </TabPanel>
            ))
          }
        </TabView>

          <Dialog
            header="Add New User"
            visible={show}
            style={{ width: "50vw" }}
            onHide={() => setShow(false)}
            footer={<>
              <div>
                <Button label="Save" size="small" severity="warning" outlined onClick={() => Usersform.handleSubmit()} className="mt-4"></Button>
                <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShow(false)} className="mt-4"></Button>
              </div>
            </>}
          >
            <div className="grid gap-4 mt-2">
              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Status">UserName</label>
                <InputText
                  placeholder="UserName"
                  name="username"
                  value={Usersform?.values?.username}
                  onChange={(e) => Usersform.setFieldValue("username", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Wallet">First Name</label>
                <InputText
                  placeholder="First Name"
                  name="name"
                  value={Usersform?.values?.name}
                  onChange={(e) => Usersform.setFieldValue("name", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4 ">
                <label className="mb-2" htmlFor="Wallet">Last Name</label>
                <InputText
                  placeholder="Last Name"
                  name="lastname"
                  value={Usersform?.values?.lastname}
                  onChange={(e) => Usersform.setFieldValue("lastname", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Status">Business</label>
                <InputText
                  placeholder="Business"
                  name="business"
                  value={Usersform?.values?.business}
                  onChange={(e) => Usersform.setFieldValue("business", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Wallet">Password</label>
                <InputText
                  placeholder="Password"
                  name="password"
                  value={Usersform?.values?.password}
                  onChange={(e) => Usersform.setFieldValue("password", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Wallet">Email</label>
                <InputText
                  placeholder="Email"
                  name="email"
                  value={Usersform?.values?.email}
                  onChange={(e) => Usersform.setFieldValue("email", e.target.value)} />
              </div>
            </div>
          </Dialog>

          <Dialog
            header="Edit User"
            visible={showEdit}
            style={{ width: "50vw" }}
            onHide={() => setShowEdit(false)}
            footer={<>
              <div>
                <Button label="Edit" outlined severity="warning" size="small" onClick={() => UsersformEdit.handleSubmit()} className="mt-4"></Button>
                <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowEdit(false)} className="mt-4"></Button>
              </div>
            </>}
          >

            <div className="grid gap-4 mt-2">
              <div className="md:col-4 lg:col-4 ">
                <label className="mb-2" htmlFor="Status">UserName</label>
                <InputText
                  placeholder="UserName"
                  name="username"
                  value={UsersformEdit?.values?.username}
                  onChange={(e) => UsersformEdit.setFieldValue("username", e.target.value)}
                  readOnly />
              </div>

              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Wallet">First Name</label>
                <InputText
                  placeholder="First Name"
                  name="name"
                  value={UsersformEdit?.values?.name}
                  onChange={(e) => UsersformEdit.setFieldValue("name", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Wallet">Last Name</label>
                <InputText
                  placeholder="Last Name"
                  name="lastname"
                  value={UsersformEdit?.values?.lastname}
                  onChange={(e) => UsersformEdit.setFieldValue("lastname", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4 ">
                <label className="mb-2" htmlFor="Status">Business</label>
                <InputText
                  placeholder="Business"
                  name="business"
                  value={UsersformEdit?.values?.business}
                  onChange={(e) => UsersformEdit.setFieldValue("business", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Wallet">Password</label>
                <InputText
                  placeholder="Password"
                  name="password"
                  value={UsersformEdit?.values?.password}
                  onChange={(e) => UsersformEdit.setFieldValue("password", e.target.value)} />
              </div>

              <div className="md:col-4 lg:col-4">
                <label className="mb-2" htmlFor="Wallet">Email</label>
                <InputText
                  placeholder="Email"
                  name="email"
                  value={UsersformEdit?.values?.email}
                  onChange={(e) => UsersformEdit.setFieldValue("email", e.target.value)}
                  readOnly />
              </div>
            </div>
          </Dialog>
        </div>
    }
    </div>
  );
};

export default Users;
