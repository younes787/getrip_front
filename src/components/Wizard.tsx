import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Fragment, useEffect, useState } from "react";
import StepWizard from "react-step-wizard";
import {
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
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import Vehicle from "../pages/Vehicle";
import Residence from "../pages/Residencemain";
import { InputSwitch } from "primereact/inputswitch";
import { useFormik } from "formik";
import { ServiceDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";

const Wizard = () => {
  const [state, updateState] = useState<any>({
    form: {},
  });
  const [serviceType, setServiceType] = useState<any>();
  const [FeildsType, setFeildsType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [places, setPlaces] = useState();
  const [residence, setResidence] = useState();
  const [vehicle, setVehicle] = useState();
  const [show, setshow] = useState<boolean>(false);
  const [showR, setshowR] = useState<boolean>(false);
  const [currency, setCurrency] = useState();

  const Serviceform = useFormik<ServiceDTO>({
    initialValues: new ServiceDTO(),
    validateOnChange: true,
    onSubmit: () => {
      AddService(Serviceform.values);
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
            <label className="mb-2" htmlFor="Wallet">
              Service Type
            </label>
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
            <label className="mb-2" htmlFor="Wallet">
              Title
            </label>
            <InputText placeholder="Title" name="name"
             value={Serviceform.values.name}
             onChange={(e)=>Serviceform.setFieldValue("name", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 mt-3 mb-3">
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              Description
            </label>
            <InputText placeholder="Description" name="description"
             value={Serviceform.values.description}
             onChange={(e)=>Serviceform.setFieldValue("description", e.target.value)}
            />
          </div>
          <div className="md:col-4 lg:col-4 ml-3">
            <label className="mb-2" htmlFor="Wallet">
              Price
            </label>
            <InputNumber placeholder="Price" name="price"
             value={Serviceform.values.price}
             onChange={(e)=>Serviceform.setFieldValue("price", e.value)}
            />
          </div>
        </div>
        <div className="grid gap-4">
        <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
            Currency
            </label>
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
        {FeildsType?.map((f: any) => (
          <div className=" mb-3">
            <div>
              {" "}
              <label> {f?.name}</label>
            </div>
            {/* <InputSwitch checked={Serviceform.values.isActive} placeholder={f?.name} 
            onChange={(e)=>Serviceform.setFieldValue('isActive' , e.value)}
            /> */}
            <InputText 
            placeholder={f?.name} 
            value={Serviceform.values.fields?.value}
            onChange={(e)=>Serviceform.setFieldValue('fields.value' , e.target.value)} />
          </div>
        ))}
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
    {Serviceform.values.typeId?.name === "Cottages" ? (
      <div>
        <div className="grid mt-3 gap-2">
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
