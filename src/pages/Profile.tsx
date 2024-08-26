import { Avatar } from "primereact/avatar";
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import { UsersClientDTO, UsersServiceProviderDTO } from "../modules/getrip.modules";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { ChangePassword, UpdateServiceProvider, UpdateUser } from "../Services";
import { Dialog } from "primereact/dialog";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FileUpload } from "primereact/fileupload";
import { Image } from 'primereact/image';

const validationSchema = Yup.object({
  name:     Yup.string().required('Name is required'),
  lastname: Yup.string().required('Lastname is required'),
  business: Yup.string().required('Business is required'),
  // password: Yup.string().required('Password is required'),
  email:    Yup.string().email('Invalid email format').required('Email is required'),
});

const validationSchemaChangePassword = Yup.object({
  currentPassword: Yup.string().required('Current Password is required'),
  newPassword: Yup.string().required('New Password is required'),
});

const validationSchemaAvatar = Yup.object().shape({
  avatar: Yup.mixed().required('Avatar is required')
});

type UserDTO = UsersClientDTO | UsersServiceProviderDTO;

const Profile = () => {
  const [initialValues, setInitialValues] = useState<UserDTO>(JSON.parse(localStorage?.getItem('user')!)?.data);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [showUploadAvatar, setShowUploadAvatar] = useState<boolean>(false);
  const [avatarImage, setAvatarImage] = useState<string>(initialValues?.photos[0].imagePath);
  const fileUploadRef = useRef<FileUpload>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const formik = useFormik<UserDTO>({
    initialValues: initialValues || {},
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if(formik.values.role !== "Client") {
        const response = await UpdateServiceProvider(formik.values);
        const accessToken = response?.data.token;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(response));
      } else {
        const response = await UpdateUser(formik.values);
        const accessToken = response?.data.token;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(response));
      }
    },
  });

  const formikChangePassword = useFormik<any>({
    initialValues: {
      accountId: formik.values.accountId,
      currentPassword: formik.values.password,
      newPassword: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchemaChangePassword,
    onSubmit: (values) => {
      ChangePassword(formikChangePassword.values);
    },
  });


  const formikUploadAvatar = useFormik<{ avatar: File | null }>({
    initialValues: {
      avatar: null
    },
    enableReinitialize: true,
    validationSchema: validationSchemaAvatar,
    onSubmit: async (values) => {
      if (values.avatar) {
        try {
          const formData = new FormData();
          formData.append('avatar', values.avatar);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const result = await response.json();
            setAvatarImage(result.imageUrl);
            setShowUploadAvatar(false);
          } else {
            console.error('Upload failed');
          }
        } catch (error) {
          console.error('Error uploading avatar:', error);
        }
      }
    },
  });

  const handleFileUpload = (event: any) => {
    const file = event.files[0];
    formikUploadAvatar.setFieldValue('avatar', file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarImage(reader.result as string)
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const openUploadDialog = () => {
    setShowUploadAvatar(true);
    setPreviewImage(avatarImage);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  const closeUploadDialog = () => {
    setShowUploadAvatar(false);
    setPreviewImage(null);
    formikUploadAvatar.resetForm();
  };

  return(
    <>
      <div id="image-container-profile">
        <div className="flex">
          <div className="mt-4 ml-6">
            <Avatar
              image={avatarImage}
              className="ml-8"
              shape="circle"
              children={<FontAwesomeIcon icon={faFileUpload} onClick={openUploadDialog} className="absolute" style={{color: '#FFF', cursor: 'pointer'}} />}
              style={{ width:'90px' , height:'90px' }}
            />
          </div>

          <div className="md:col-5 lg:col-5 ml-3">
            <h2 style={{color:'#4a235a'}}>{formik.values.name} {formik.values.lastname}</h2>
            <h5 className="ml-1" style={{color:'#717171'}}>{formik.values.email}</h5>
          </div>
        </div>
      </div>

      <div className="p-5	mt-4">
        <div className="wizard-border">
            <h2 className="primary">My Info</h2>
            <div className="grid gap-3 w-full">
                <div className="md:col-12 lg:col-12">
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

                <div className="md:col-12 lg:col-12">
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

                <div className="md:col-12 lg:col-12">
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

                {formik.values.role !== "Client" &&
                  <div className="md:col-12 lg:col-12">
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
                }
            </div>
        </div>

        <div className="w-full d-flex justify-content-end">
          <Button
            rounded
            icon='pi pi-user-edit'
            severity="secondary"
            size="small"
            className="m-1"
            label="Update"
            onClick={() => formik.handleSubmit()}
          />

          <Button
            rounded
            icon="pi pi-password"
            label="Update Password"
            severity="danger"
            size="small"
            className="m-1"
            onClick={() => setVisiblePassword(true)}
            />
        </div>
      </div>

      <Dialog
        header="Change Password"
        visible={visiblePassword}
        style={{ width: '50vw' }}
        onHide={() => {if (!visiblePassword) return; setVisiblePassword(false); }}
        footer={
          <>
            <Button label="Save" size="small" severity="warning" outlined onClick={() => formikChangePassword.handleSubmit()} className="mt-4"></Button>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setVisiblePassword(false)} className="mt-4"></Button>
          </>
        }
      >
          <div className="grid gap-3">
              <div className="md:col-12 lg:col-12">
                <label htmlFor="Current Password">Current Password</label>
                <InputText
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  className="w-full mt-1"
                  value={formikChangePassword.values.currentPassword}
                  onChange={formikChangePassword.handleChange}
                  onBlur={formikChangePassword.handleBlur}
                />
                {formikChangePassword.touched.currentPassword && formikChangePassword.errors.currentPassword ? (
                  <div className="p-error">{formikChangePassword.errors.currentPassword as string}</div>
                ) : null}
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="New Password">New Password</label>
                <InputText
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  className="w-full mt-1"
                  value={formikChangePassword.values.newPassword}
                  onChange={formikChangePassword.handleChange}
                  onBlur={formikChangePassword.handleBlur}
                />
                {formikChangePassword.touched.newPassword && formikChangePassword.errors.newPassword ? (
                  <div className="p-error">{formikChangePassword.errors.newPassword as string}</div>
                ) : null}
              </div>
          </div>
      </Dialog>

      <Dialog
        header="Upload Avatar"
        visible={showUploadAvatar}
        style={{ width: '50vw' }}
        onHide={closeUploadDialog}
        footer={
          <>
            <Button label="Upload" size="small" severity="warning" outlined onClick={() => formikUploadAvatar.handleSubmit()} className="mt-4"></Button>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={closeUploadDialog} className="mt-4"></Button>
          </>
        }
      >
          <div className="grid gap-3">
              <div className="md:col-12 lg:col-12">
                {previewImage && (
                  <div className="mb-3">
                    <h3>Current Avatar:</h3>
                    <Image src={previewImage} alt="Avatar Preview" width="150" preview />
                  </div>
                )}

                <FileUpload
                  name="avatar"
                  accept="image/*"
                  maxFileSize={1000000}
                  onSelect={handleFileUpload}
                  ref={fileUploadRef}
                  emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                />
              </div>
          </div>
      </Dialog>
    </>
  )
}

export default Profile;
