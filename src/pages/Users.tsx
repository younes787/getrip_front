import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { UsersDTO } from "../modules/getrip.modules";
import { CreateUser, DeleteUser, GetAllRoles, GetAllUsers, UpdateUser } from "../Services";

const Users = () => {
  const [UsersList, setUsersList] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [RolesList, setRolesList] = useState<any>();
  const getUsers = () => {
    GetAllUsers().then((res) => {
      if (res !== undefined ){
        setUsersList(res?.data);
    }
    });
    GetAllRoles().then((res) => setRolesList(res.data));
  };
  const options = Array.isArray(RolesList) ? RolesList?.map((role: any) => ({
    label: role.name,
    value: role.name,
  })) : ''
  const Usersform = useFormik<UsersDTO>({
    initialValues: new UsersDTO(),
    validateOnChange: true,
    onSubmit: () => {
        CreateUser(Usersform.values);
      setShow(false);
    },
  });

  const UsersformEdit = useFormik<UsersDTO>({
    initialValues: new UsersDTO(),
    validateOnChange: true,
    onSubmit: () => {
        UpdateUser(UsersformEdit.values);
      setShowEdit(false);
    },
  });
const ShowUser = (rowData:any) =>{
  setShowEdit(true)
  UsersformEdit.setValues({
    username: rowData.username,
    name: rowData.name,
    lastname:rowData.lastname,
    business:rowData.business,
    password:rowData.password,
    email:rowData.email,
    role:rowData.role
  });
}
  useEffect(() => {
    getUsers();
  }, []);
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
    
    <div>
      <ConfirmDialog />
      <Button
        label="Add New User"
        onClick={() => setShow(true)}
        size="small"
        className="mt-4 ml-5 pr_btn"
      ></Button>
      <DataTable
        value={UsersList}
        stripedRows
        showGridlines
        className=" p-5"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="username" sortField="" header="UserName"></Column>
        <Column field="name" header="First Name"></Column>
        <Column field="lastname" header="Last Name"></Column>
        <Column field="business" header="Business"></Column>
        <Column field="password" header="Password"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="role" header="Role"></Column>
        <Column field="" header="Actions" body={BodyTemplate}></Column>
      </DataTable>
      <></>
      <Dialog
        header="Add New User"
        visible={show}
        style={{ width: "50vw" }}
        onHide={() => setShow(false)}
        footer={
          <>
            <div>
              <Button
                label="Save"
                size="small"
                severity="warning"
                outlined
                onClick={() => Usersform.handleSubmit()}
                className="mt-4"
              ></Button>
              <Button
                label="Cancel"
                severity="danger"
                outlined
                size="small"
                onClick={() => setShow(false)}
                className="mt-4"
              ></Button>
            </div>
          </>
        }
      >
  <div className="grid gap-4">
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Status">
              {" "}
              UserName{" "}
            </label>
            <InputText
              placeholder="UserName"
              name="username"
              value={Usersform?.values?.username}
              onChange={(e) =>
                Usersform.setFieldValue("username", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
             First  Name{" "}
            </label>
            <InputText
              placeholder="First Name"
              name="name"
              value={Usersform?.values?.name}
              onChange={(e) =>
                Usersform.setFieldValue("name", e.target.value)
              }
            />
          </div>
        </div>
        <div className="grid gap-4 mt-2">
        <div className="md:col-4 lg:col-4 ">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Last Name{" "}
            </label>
            <InputText
              placeholder="Last Name"
              name="lastname"
              value={Usersform?.values?.lastname}
              onChange={(e) =>
                Usersform.setFieldValue("lastname", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4" >
            <label className="mb-2" htmlFor="Status">
              {" "}
              Business{" "}
            </label>
            <InputText
              placeholder="Business"
              name="business"
              value={Usersform?.values?.business}
              onChange={(e) =>
                Usersform.setFieldValue("business", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Password{" "}
            </label>
            <InputText
              placeholder="Password"
              name="password"
              value={Usersform?.values?.password}
              onChange={(e) =>
                Usersform.setFieldValue("password", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Email{" "}
            </label>
            <InputText
              placeholder="Email"
              name="email"
              value={Usersform?.values?.email}
              onChange={(e) => Usersform.setFieldValue("email", e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-4 lg:col-4">
          <div>
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Role{" "}
            </label>
            </div>
            <Dropdown
              placeholder="Role"
              options={options as any}
              optionLabel="label"
              optionValue="value"
              name="role"
              className="w-full"
              value={Usersform?.values?.role}
              onChange={(e) => Usersform.setFieldValue("role", e.target.value)}
            />
          </div>
      
      </Dialog>
      <></>
      <Dialog
        header="Edit User"
        visible={showEdit}
        style={{ width: "50vw" }}
        onHide={() => setShowEdit(false)}
        footer={
          <>
            <div>
              <Button
                label="Edit"
                outlined
                severity="warning"
                size="small"
                onClick={() => UsersformEdit.handleSubmit()}
                className="mt-4"
              ></Button>
              <Button
                label="Cancel"
                severity="danger"
                outlined
                size="small"
                onClick={() => setShowEdit(false)}
                className="mt-4"
              ></Button>
            </div>
          </>
        }
      >
       <div className="grid gap-4">
          <div className="md:col-4 lg:col-4 ">
            <label className="mb-2" htmlFor="Status">
              {" "}
              UserName{" "}
            </label>
            <InputText
              placeholder="UserName"
              name="username"
              value={UsersformEdit?.values?.username}
              onChange={(e) =>
                UsersformEdit.setFieldValue("username", e.target.value)
              }
              readOnly
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              First Name{" "}
            </label>
            <InputText
              placeholder="First Name"
              name="name"
              value={UsersformEdit?.values?.name}
              onChange={(e) =>
                UsersformEdit.setFieldValue("name", e.target.value)
              }
            />
          </div>
        </div>
        <div className="grid gap-4 mt-2">
        <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Last Name{" "}
            </label>
            <InputText
              placeholder="Last Name"
              name="lastname"
              value={UsersformEdit?.values?.lastname}
              onChange={(e) =>
                UsersformEdit.setFieldValue("lastname", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4 " >
            <label className="mb-2" htmlFor="Status">
              {" "}
              Business{" "}
            </label>
            <InputText
              placeholder="Business"
              name="business"
              value={UsersformEdit?.values?.business}
              onChange={(e) =>
                UsersformEdit.setFieldValue("business", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Password{" "}
            </label>
            <InputText
              placeholder="Password"
              name="password"
              value={UsersformEdit?.values?.password}
              onChange={(e) =>
                UsersformEdit.setFieldValue("password", e.target.value)
              }
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Email{" "}
            </label>
            <InputText
              placeholder="Email"
              name="email"
              value={UsersformEdit?.values?.email}
              onChange={(e) => UsersformEdit.setFieldValue("email", e.target.value)}
              readOnly
            />
            
          </div>
        </div>
        <div className="md:col-4 lg:col-4">
          <div>
            <label className="mb-2" htmlFor="Wallet">
              {" "}
              Role{" "}
            </label>
            </div>
            <Dropdown
              placeholder="Role"
              options={options as any}
              optionLabel="label"
              optionValue="value"
              name="role"
              className="w-full"
              value={UsersformEdit?.values?.role}
              onChange={(e) => UsersformEdit.setFieldValue("role", e.target.value)}
            />
          </div>
      </Dialog>
    </div>
  );
};

export default Users;
