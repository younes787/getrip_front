import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Fragment, useEffect, useState } from "react";
import StepWizard from "react-step-wizard";
import {
  AddImageToService,
  AddService,
  GetAllCities,
  GetAllService,
  GetAllYachts,
  GetCurrency,
  GetFeildsbysid,
  GetPlacesbyid,
  GetResidencebyCottages,
  GetVehiclesbytid,
} from "../Services";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import Vehicle from "../pages/Vehicle";
import Residence from "../pages/Residencemain";
import { InputSwitch } from "primereact/inputswitch";
import { useFormik } from "formik";
import { ImageDTO, ServiceDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { useAuth } from "../AuthContext/AuthContext";
import { FileUpload } from "primereact/fileupload";

const Wizard = () => {
  const [state, updateState] = useState<any>({
    form: {},
  });
  const [fileimg, setFileimg] = useState<any>();
  const [serviceType, setServiceType] = useState<any>();
  const [FeildsType, setFeildsType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [places, setPlaces] = useState();
  const [residence, setResidence] = useState();
  const [vehicle, setVehicle] = useState();
  const [show, setshow] = useState<boolean>(false);
  const [showR, setshowR] = useState<boolean>(false);
  const [currency, setCurrency] = useState();
  const [tags, setTags] = useState([{ name: '' }]);
  const { user } = useAuth();

  const Serviceform = useFormik<ServiceDTO>({
    initialValues: new ServiceDTO(),
    validateOnChange: true,
    onSubmit: (values) => {
      Serviceform.values.typeId?.id === 8 ||  Serviceform.values.typeId?.id === 9 
      || Serviceform.values.typeId?.id === 12 
      ? Serviceform.values.isRental = true :  Serviceform.values.isRental = false
      Serviceform.values.typeId?.id === 9 ? Serviceform.values.isYacht = true : Serviceform.values.isYacht = false
      Serviceform.values.typeId?.id === 12 ? Serviceform.values.isVehicle = true : Serviceform.values.isVehicle = false
      Serviceform.values.accountId = user?.data?.accountId
      Serviceform.values.rentalPlaceName !== '' ? Serviceform.values.hasNewRentalPlace = true
       :Serviceform.values.hasNewRentalPlace = false
      const formattedFields = Object.keys(values.fields).map((key, index) => ({
        id: index,
        value: JSON.stringify(values.fields[key]),
        serviceTypeFieldId: FeildsType.find((f:any) => f.name === key)?.id,
      }));
      const formattedTags =  values.tags && values.tags.map((tag : any, index :any) => ({
        id: index,
        name: tag.name,
      }));
      values.tags = formattedTags //9
      values.fields = formattedFields
      Serviceform.values.typeId?.id === 8 ? Serviceform.values.residenceTypeId = 1 : Serviceform.values.residenceTypeId = 0
      AddService(Serviceform.values);
    },
  });
  useEffect(() => {
    if (Serviceform.values.typeId && Serviceform.values.typeId.id !== undefined) {
      Serviceform.setFieldValue('isRental', [8, 9, 12].includes(Serviceform.values.typeId.id));
      Serviceform.setFieldValue('isYacht', Serviceform.values.typeId.id === 9);
      Serviceform.setFieldValue('isResidence', Serviceform.values.typeId.id === 8);
      Serviceform.setFieldValue('isVehicle', Serviceform.values.typeId.id === 12);
      Serviceform.setFieldValue('isTrip', [7, 10, 11, 13].includes(Serviceform.values.typeId.id));
      Serviceform.setFieldValue('isCruise', Serviceform.values.typeId.id === 10);
    }
}, [Serviceform.values.typeId]);
console.log(Serviceform.values.isRental)
  const ImageServiceform = useFormik<ImageDTO>({
    initialValues: new ImageDTO(),
    validateOnChange: true,
    onSubmit: () => {
      const formData = new FormData();
      formData.append("file", fileimg);
      formData.append("ObjectId", Serviceform.values.typeId?.id);
      AddImageToService(formData);
    },
  });
  const updateForm = (key: any, value: any) => {
    const { form } = state;

    form[key] = value;
    updateState({
      ...state,
      form,
    });
  };
  useEffect(() => {
    GetAllService().then((res) => setServiceType(res?.data));
    GetAllCities().then((res) => setCities(res.data));
    GetCurrency().then((res) => setCurrency(res.data));

  }, []);
  const onStepChange = (stats: any) => {};

  const setInstance = (SW: any) =>
    updateState({
      ...state,
      SW,
    });

  const { SW, demo } = state;
  const handleChange = (e: any) => {
    Serviceform.setFieldValue("typeId", e.target.value)
    GetFeildsbysid(e.target.value.id).then((res) => setFeildsType(res.data));
    GetAllYachts().then((res) => setVehicle(res.data));
  };

  const handleCityChange = (e: any) => {
    Serviceform.setFieldValue("cityId", e.value)
    GetPlacesbyid(e.value).then((res) => setPlaces(res.data));
  };
  const handlePlaceChange = (e: any) => {
    Serviceform.setFieldValue("placeId", e.value)
    GetResidencebyCottages(e.value).then((res) => setResidence(res.data));
  };

  const handleAddTag = () => {
    setTags([...tags, { name: '' }]);
  };
  const handleTagChange = (index : any, value:any) => {
    const newTags = [...tags];
    newTags[index].name = value;
    setTags(newTags);
    Serviceform.setFieldValue('tags', newTags);
  };
  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };
  const handleImgChange = (e: any) => {
    // setFileimg(e.files?.[0]);
    console.log(e.files?.[0])
  };
  const Stats = ({
    currentStep,
    firstStep,
    goToStep,
    lastStep,
    nextStep,
    previousStep,
    totalSteps,
    step,
  }: any) => (
    <div>
      <div className="flex">
        {step > 1 && (
          <Button
            className="btn btn-default btn-block mr-3"
            size="small"
            rounded
            onClick={previousStep}
            severity="danger"
          >
            Go Back
          </Button>
        )}
        {step < totalSteps ? (
          <Button className="mr-3" size="small" rounded onClick={nextStep}>
            Continue
          </Button>
        ) : (
          <Button
            className="btn btn-success btn-block mr-3"
            size="small"
            rounded
            onClick={nextStep}
          >
            Finish
          </Button>
        )}
      </div>
    </div>
  );

  const InstanceDemo = ({ SW }: any) => (
    <Fragment>
      <h4>Control from outside component</h4>
      <Button
        className={"btn btn-secondary"}
        size="small"
        rounded
        onClick={SW.previousStep}
      >
        Previous Step
      </Button>
      &nbsp;
      <Button
        className={"btn btn-secondary"}
        size="small"
        rounded
        onClick={SW.nextStep}
      >
        Next Step
      </Button>
    </Fragment>
  );

  const First = (props: any) => {
    return (
      <div>
        <div className="wizard-border">
          <h2 className="primary"> First Step</h2>
        <div className="grid gap-4">
          <div className="md:col-4 lg:col-4">
            <div>
            <label className="mb-2" htmlFor="Wallet">
              Service Type
            </label></div>
            <Dropdown
              placeholder="Select a Service Type"
              options={serviceType as any}
              optionLabel="name"
              // optionValue="id"
              className="w-full"
              filter
              value={Serviceform.values.typeId}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="md:col-4 lg:col-4 ml-3">
            <div>
            <label className="mb-2" htmlFor="Wallet">
              Title
            </label></div>
            <InputText placeholder="Title" name="name"
             value={Serviceform.values.name}
             onChange={(e)=>Serviceform.setFieldValue("name", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 mt-3 mb-3">
          <div className="md:col-4 lg:col-4">
           <div><label className="mb-2" htmlFor="Wallet">
              Description
            </label></div> 
            <InputText placeholder="Description" name="description"
             value={Serviceform.values.description}
             onChange={(e)=>Serviceform.setFieldValue("description", e.target.value)}
            />
          </div>
          <div className="md:col-4 lg:col-4 ml-3">
            <div><label className="mb-2" htmlFor="Wallet">
              Price
            </label></div>
            <InputNumber placeholder="Price" name="price"
             value={Serviceform.values.price}
             onChange={(e)=>Serviceform.setFieldValue("price", e.value)}
            />
          </div>
        </div>
        <div className="grid gap-4">
        <div className="md:col-4 lg:col-4">
          <div>
            <label className="mb-2" htmlFor="Wallet">
            Currency
            </label></div>
            <Dropdown
              placeholder="Select a currency"
              options={currency}
              optionLabel="name"
              optionValue="id"
              className="w-full"
              filter
              value={Serviceform.values.currencyId}
              onChange={(e) => Serviceform.setFieldValue("currencyId", e.value)}
            />
          </div>
</div>
        </div>
       
        <Stats step={1} {...props} />
      </div>
    );
  };

  const Second = (props: any) => {
    const validate = () => {
      props.previousStep();
    };
    return (
      <div>
          <div className="wizard-border">
          <h2 className="primary"> Second Step</h2>
          <div className="flex gap-4">
          {FeildsType?.map((f:any) => (
        <div className="mb-3" key={f.name}>
          <div>
            <label>{f.name}</label>
          </div>
          {f.fieldTypeName === 'Bool' && (
            <InputSwitch
              checked={Serviceform.values.fields?.[f.name]}
              onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)}
            />
          )}
          {f.fieldTypeName === 'Number' && (
            <InputNumber
              value={Serviceform.values.fields?.[f.name]}
              onValueChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)}
              placeholder={f.name}
            />
          )}
          {f.fieldTypeName === 'Date' && (
            <Calendar
              value={Serviceform.values.fields?.[f.name]}
              onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)}
              placeholder={f.name}
            />
          )}
          {f.fieldTypeName === 'Text' && (
            <InputText
              value={Serviceform.values.fields?.[f.name]}
              onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.target.value)}
              placeholder={f.name}
            />
          )}
        </div>
      ))}
        </div>
        <div className="col">
                <FileUpload
                  name="imagePath"
                  accept="image/*"
                  onSelect={handleImgChange}
                  emptyTemplate={
                    <p className="m-0">
                      Drag and drop files to here to upload.
                    </p>
                  }
                  chooseOptions={chooseOptions}
                  uploadOptions={uploadOptions}
                  cancelOptions={cancelOptions}
                  customUpload
                  uploadHandler={() => ImageServiceform.handleSubmit()}
                />
              </div>
        </div>
        <Stats step={2} {...props} previousStep={validate} />
      </div>
    );
  };

  const Last = (props: any) => {
    const submit = () => {
      Serviceform.values.typeId =  Serviceform.values.typeId?.id
      Serviceform.handleSubmit()
    };

    return (
      <div>
      <div className="wizard-border">
      <h2 className="primary"> Third Step</h2>
      <div className="md:col-5 lg:col-5">
            <label className="mb-2" htmlFor="Status">
              {" "}
              City Name{" "}
            </label>
            <Dropdown
              placeholder="Select a City"
              options={cities}
              optionLabel="name"
              optionValue="id"
              name="cityId"
              filter
              className="w-full"
              value={Serviceform.values.cityId}
              onChange={(e) => handleCityChange(e)}
            />
          </div>
    {Serviceform.values.typeId?.name === "Cottages" ? (
      <div>
        <div className="grid mt-3 gap-2">
          {Serviceform.values.cityId && (
            <div className="md:col-6 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Place Name{" "}
                </label>
              </div>
              <Dropdown
                placeholder="Select a Place"
                options={places}
                optionLabel="name"
                optionValue="id"
                name="placeId"
                filter
                className="w-full"
                value={Serviceform.values.placeId}
                onChange={(e) => handlePlaceChange(e)}
              />
            </div>
          )}
           <div className="md:col-5 lg:col-5">
            <label className="mb-2" htmlFor="Status">
              {" "}
              New Place Name{" "}
            </label>
            <InputText
              placeholder="New Place"
              name="rentalPlaceName"
              className="w-full"
              value={Serviceform.values.rentalPlaceName}
              onChange={(e) => Serviceform.setFieldValue('rentalPlaceName',e.target.value )}
            />
          </div>
        </div>
        <div className="grid mt-3 gap-2">
          {Serviceform.values.typeId && Serviceform.values.placeId && (
            <div className="md:col-5 lg:col-5">
              <label className="mb-2" htmlFor="Status">
                {" "}
                Residence Name{" "}
              </label>
              <Dropdown
                placeholder="Select a Residence"
                options={residence}
                optionLabel="name"
                optionValue="id"
                  name="residenceTypeId"
                filter
                className="w-full"
                value={Serviceform.values.residenceTypeId}
                onChange={ (e)=>   Serviceform.setFieldValue("cityId", e.value)
              }
              />
            </div>
          )}
        </div>
        <>
          <Dialog
            header={"Add Residence"}
            visible={showR}
            className="md:w-40rem lg:w-40rem"
            onHide={() => setshowR(false)}
          >
            <Residence />
          </Dialog>
        </>
      </div>
    ) : Serviceform.values.typeId?.name === "Yacht Bookings" ? (
      <div>
        <div className="md:col-5 lg:col-5">
          <label className="mb-2" htmlFor="Status">
            {" "}
            Vehicle Name{" "}
          </label>
          <Dropdown
            placeholder="Select a Vehicle"
            options={vehicle}
            optionLabel="vehicleTypeName"
            optionValue="id"
            name="vehicleTypeId"
            filter
            className="w-full"
            value={Serviceform.values.vehicleTypeId}
            onChange={(e) => Serviceform.setFieldValue("vehicleTypeId", e.value)
          }
          />
        </div>
        <>
          <Dialog
            header={"Add Vehicle"}
            visible={show}
            className="md:w-40rem lg:w-40rem"
            onHide={() => setshow(false)}
          >
            <Vehicle />
          </Dialog>
        </>
      </div>
    ) : (
      <></>
    )}
     <div className="md:col-5 lg:col-5">
     {tags.map((tag, index) => (
          <div key={index} className="mb-2">
            <InputText
              placeholder={`Tag ${index + 1}`}
              value={tag.name}
              className="w-full"
              name="tags.name"
              onChange={(e) => handleTagChange(index, e.target.value)}
            />
          </div>
        ))}
       <Button icon='pi pi-plus' label="Add Tag" onClick={handleAddTag} rounded severity="info" size="small" className="mt-2" />

          </div>
    </div>
    <Stats step={5} {...props} nextStep={submit} />
  </div>
    );
  };

  // const Fourth = (props: any) => {
  //   return (
  //     <div>
  //         <div className="wizard-border">
  //         <h2 className="primary"> Third Step</h2>
  //       {Serviceform.values.typeId?.name === "Cottages" ? (
  //         <div>
  //           <div className="grid mt-3 gap-2">
  //             <div className="md:col-5 lg:col-5">
  //               <label className="mb-2" htmlFor="Status">
  //                 {" "}
  //                 City Name{" "}
  //               </label>
  //               <Dropdown
  //                 placeholder="Select a City"
  //                 options={cities}
  //                 optionLabel="name"
  //                 optionValue="id"
  //                 name="cityId"
  //                 filter
  //                 className="w-full"
  //                 value={Serviceform.values.cityId}
  //                 onChange={(e) => handleCityChange(e)}
  //               />
  //             </div>
  //             {Serviceform.values.cityId && (
  //               <div className="md:col-6 lg:col-6">
  //                 <div>
  //                   <label className="mb-2" htmlFor="">
  //                     {" "}
  //                     Place Name{" "}
  //                   </label>
  //                 </div>
  //                 <Dropdown
  //                   placeholder="Select a Place"
  //                   options={places}
  //                   optionLabel="name"
  //                   optionValue="id"
  //                   name="placeId"
  //                   filter
  //                   className="w-full"
  //                   value={Serviceform.values.placeId}
  //                   onChange={(e) => handlePlaceChange(e)}
  //                 />
  //               </div>
  //             )}
  //           </div>
  //           <div className="grid mt-3 gap-2">
  //             {Serviceform.values.typeId && Serviceform.values.placeId && (
  //               <div className="md:col-5 lg:col-5">
  //                 <label className="mb-2" htmlFor="Status">
  //                   {" "}
  //                   Residence Name{" "}
  //                 </label>
  //                 <Dropdown
  //                   placeholder="Select a Residence"
  //                   options={residence}
  //                   optionLabel="name"
  //                   optionValue="id"
  //                     name="residenceTypeId"
  //                   filter
  //                   className="w-full"
  //                   value={Serviceform.values.residenceTypeId}
  //                   onChange={ (e)=>   Serviceform.setFieldValue("cityId", e.value)
  //                 }
  //                 />
  //               </div>
  //             )}
  //           </div>
  //           <>
  //             <Dialog
  //               header={"Add Residence"}
  //               visible={showR}
  //               className="md:w-40rem lg:w-40rem"
  //               onHide={() => setshowR(false)}
  //             >
  //               <Residence />
  //             </Dialog>
  //           </>
  //         </div>
  //       ) : Serviceform.values.typeId?.name === "Yacht Bookings" ? (
  //         <div>
  //           <div className="md:col-5 lg:col-5">
  //             <label className="mb-2" htmlFor="Status">
  //               {" "}
  //               Vehicle Name{" "}
  //             </label>
  //             <Dropdown
  //               placeholder="Select a Vehicle"
  //               options={vehicle}
  //               optionLabel="vehicleTypeName"
  //               optionValue="id"
  //               name="vehicleTypeId"
  //               filter
  //               className="w-full"
  //               value={Serviceform.values.vehicleTypeId}
  //               onChange={(e) => Serviceform.setFieldValue("vehicleTypeId", e.value)
  //             }
  //             />
  //           </div>
  //           <>
  //             <Dialog
  //               header={"Add Vehicle"}
  //               visible={show}
  //               className="md:w-40rem lg:w-40rem"
  //               onHide={() => setshow(false)}
  //             >
  //               <Vehicle />
  //             </Dialog>
  //           </>
  //         </div>
  //       ) : (
  //         <></>
  //       )}
  //       </div>
  //       <Stats step={3} {...props} />
  //     </div>
  //   );
  // };

  return (
    <>
      <div className="container">
        <div className={"jumbotron"}>
          <div className="row">
            <div className={`col-12 col-sm-6 offset-sm-3 `}>
              <StepWizard
                onStepChange={onStepChange}
                isHashEnabled
                transitions={state.transitions}
                instance={setInstance}
              >
                <First hashKey={"FirstStep"} update={updateForm} />
                <Second form={state.form} />
                {/* <Fourth /> */}
                <Last hashKey={"TheEnd!"} />
              </StepWizard>
            </div>
          </div>
        </div>
        {demo && SW && <InstanceDemo SW={SW} />}
      </div>
    </>
  );
};

export default Wizard;
