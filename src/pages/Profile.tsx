import { Avatar } from "primereact/avatar";
import AvatarImage from "../Assets/Ellipse.png";
import { useEffect, useState } from "react";
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import { UsersDTO } from "../modules/getrip.modules";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { UpdateUser } from "../Services";

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  name: Yup.string().required('Name is required'),
  lastname: Yup.string().required('Lastname is required'),
  business: Yup.string().required('Business is required'),
  password: Yup.string().required('Password is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

const Profile = () => {
 const User = JSON.parse(localStorage?.getItem('user') as any)
 const name = User?.data?.name + ' ' + User?.data?.lastname
 const email = User?.data?.email
 const [initialValues, setInitialValues] = useState(new UsersDTO());

useEffect(() => {
  const user = JSON.parse(localStorage?.getItem('user') as any);
  if (user) {
    setInitialValues(user);
  }
}, []);

const formik = useFormik<UsersDTO>({
  initialValues,
  enableReinitialize: true,
  validationSchema,
  onSubmit: (values) => {
    UpdateUser(formik.values);
  },
});

  return(
    <>
      <div id="imageContainer1">
        <div className="flex">
          <div className="mt-4 ml-6">
            <Avatar
              image={AvatarImage}
              className="ml-8"
              shape="circle"
              style={{ width:'80px' , height:'80px' }}
            />
          </div>

          <div className="md:col-5 lg:col-5 ml-3">
            <h2 style={{color:'#4a235a'}}>{name}</h2>
            <h5 className="ml-1" style={{color:'#717171'}}>{email}</h5>
          </div>
        </div>
      </div>

      <div className="p-5	mt-4">
        <div className="wizard-border">
            <h2 className="primary">My Info</h2>
            <div className="grid gap-3 w-full">
                <div className="md:col-3 lg:col-3">
                  <label htmlFor="username">Username</label>
                  <InputText
                    id="username"
                    name="username"
                    className="w-full mt-1"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="p-error">{formik.errors.username}</div>
                  ) : null}
                </div>

                <div className="md:col-3 lg:col-3">
                    <label htmlFor="name">Name</label>
                    <InputText
                      id="name"
                      name="name"
                      className="w-full mt-1"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="p-error">{formik.errors.name}</div>
                    ) : null}
                </div>

                <div className="md:col-3 lg:col-3">
                  <label htmlFor="lastname">Lastname</label>
                  <InputText
                    id="lastname"
                    name="lastname"
                    className="w-full mt-1"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.lastname && formik.errors.lastname ? (
                    <div className="p-error">{formik.errors.lastname}</div>
                  ) : null}
                </div>

                <div className="md:col-3 lg:col-3">
                  <label htmlFor="business">Business</label>
                  <InputText
                    id="business"
                    name="business"
                    className="w-full mt-1"
                    value={formik.values.business}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.business && formik.errors.business ? (
                    <div className="p-error">{formik.errors.business}</div>
                  ) : null}
                </div>

                <div className="md:col-3 lg:col-3">
                  <label htmlFor="password">Password</label>
                  <InputText
                    id="password"
                    name="password"
                    type="password"
                    className="w-full mt-1"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="p-error">{formik.errors.password}</div>
                  ) : null}
                </div>

                <div className="md:col-3 lg:col-3">
                  <label htmlFor="email">Email</label>
                  <InputText
                    id="email"
                    name="email"
                    className="w-full mt-1"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="p-error">{formik.errors.email}</div>
                  ) : null}
                </div>

                <div className="md:col-3 lg:col-3">
                  <Button rounded icon='pi pi-user-edit' severity="secondary" size="small" className="mt-2" label="Update"  onClick={() => formik.handleSubmit()}/>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Profile;
