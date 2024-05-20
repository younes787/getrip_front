import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Fragment, useEffect, useState } from "react";
import StepWizard from "react-step-wizard";
import {
  GetAllCities,
  GetAllPlaces,
  GetAllService,
  GetFeildsbysid,
  GetPlacesbyid,
  GetResidencebyType,
  GetVehiclesbytid,
} from "../Services";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import Vehicle from "../pages/Vehicle";
import Residence from "../pages/Residencemain";

const Wizard = () => {
  const [state, updateState] = useState<any>({
    form: {},
  });
  const [serviceType, setServiceType] = useState<any>();
  const [serviceValue, setServiceValue] = useState<any>();
  const [FeildsType, setFeildsType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [Cvalue, setCvalue] = useState<any>();
  const [Rvalue, setRvalue] = useState<any>();
  const [Vvalue, setVvalue] = useState<any>();
  const [Pvalue, setPvalue] = useState<any>();
  const [isDaily, setisDaily] = useState<any>();
  const [isHourly, setisHourly] = useState<any>();
  const [places, setPlaces] = useState();
  const [residence, setResidence] = useState();
  const [vehicle, setVehicle] = useState();
  const [show, setshow] = useState<boolean>(false);
  const [showR, setshowR] = useState<boolean>(false);

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
  }, []);
  console.log(serviceValue);
  const onStepChange = (stats: any) => {};

  const setInstance = (SW: any) =>
    updateState({
      ...state,
      SW,
    });

  const { SW, demo } = state;
  const handleChange = (e: any) => {
    setServiceValue(e.target.value);
    GetFeildsbysid(e.target.value.id).then((res) => setFeildsType(res.data));
    GetVehiclesbytid(e.target.value.id).then((res) => setVehicle(res.data));
  };

  const handleCityChange = (e: any) => {
    setCvalue(e.value);
    GetPlacesbyid(e.value).then((res) => setPlaces(res.data));
  };
  const handlePlaceChange = (e: any) => {
    setPvalue(e.value);
    GetResidencebyType(serviceValue?.id).then((res) => setResidence(res.data));
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
        <Button
          className="btn btn-block btn-default"
          size="small"
          rounded
          onClick={firstStep}
        >
          First Step
        </Button>
        <Button
          className="btn btn-block btn-default mr-3 ml-3"
          size="small"
          rounded
          onClick={lastStep}
        >
          Last Step
        </Button>
        {step > 1 && (
          <Button
            className="btn btn-default btn-block mr-3"
            size="small"
            rounded
            onClick={previousStep}
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
              value={serviceValue}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              Type
            </label>
            <InputText placeholder="Type" name="description" />
          </div>
        </div>
        <div className="grid gap-4 mt-3 mb-3">
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              Title
            </label>
            <InputText placeholder="Title" name="description" />
          </div>
          <div className="md:col-4 lg:col-4">
            <label className="mb-2" htmlFor="Wallet">
              Description
            </label>
            <InputText placeholder="Description" name="description" />
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
        {FeildsType?.map((f: any) => (
          <div className=" mb-3">
            <div>
              {" "}
              <label> {f?.name}</label>
            </div>
            <InputText placeholder={f?.name} />
          </div>
        ))}
        <Stats step={2} {...props} previousStep={validate} />
      </div>
    );
  };

  const Last = (props: any) => {
    const submit = () => {
      alert("You did it! Yay!"); // eslint-disable-line
    };

    return (
      <div>
        <div className="grid gap-4 mb-2">
          <div className="md:col-5 lg:col-5">
            <div>
              <label className="mb-2" htmlFor="">
                {" "}
                is Daily{" "}
              </label>
            </div>
            <Checkbox
              name="isDaily"
              checked={isDaily}
              onChange={(e: any) => setisDaily(e.checked)}
            />
          </div>
          <div className="md:col-5 lg:col-5">
            <div>
              <label className="mb-2" htmlFor="">
                {" "}
                is Hourly{" "}
              </label>
            </div>
            <Checkbox
              name="isHourly"
              checked={isHourly}
              onChange={(e: any) => setisHourly(e.checked)}
            />
          </div>
        </div>
        <div className="grid gap-4 mb-2">
          {isDaily && (
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Price Per Day{" "}
                </label>
              </div>
              <InputText placeholder="Price Per Day" />
            </div>
          )}
          {isHourly && (
            <div className="md:col-5 lg:col-5">
              <div>
                <label className="mb-2" htmlFor="">
                  {" "}
                  Price Per Hour{" "}
                </label>
              </div>
              <InputText placeholder="Price Per Hour" />
            </div>
          )}
        </div>
        <Stats step={5} {...props} nextStep={submit} />
      </div>
    );
  };

  const Fourth = (props: any) => {
    return (
      <div>
        {serviceValue?.name === "Cottages" ? (
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
                  value={Cvalue}
                  onChange={(e) => handleCityChange(e)}
                />
              </div>
              {Cvalue && (
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
                    value={Pvalue}
                    onChange={(e) => handlePlaceChange(e)}
                  />
                </div>
              )}
            </div>
            <div className="grid mt-3 gap-2">
              {serviceValue && Pvalue && (
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
                    //   name="cityId"
                    filter
                    className="w-full"
                    value={Rvalue}
                    onChange={(e) => setRvalue(e.value)}
                  />
                </div>
              )}
            </div>
            <div>
              <h4>
                If You don't find Residence in options you can add it here and
                rechoose it in Residence name{" "}
              </h4>
              <Button
                rounded
                label="Add Residence"
                icon="pi pi-home"
                onClick={() => setshowR(true)}
                className=" mb-3 mt-2 ml-2"
                severity="warning"
              />
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
        ) : serviceValue?.name === "Yacht Bookings" ? (
          <div>
            <div className="md:col-5 lg:col-5">
              <label className="mb-2" htmlFor="Status">
                {" "}
                Vehicle Name{" "}
              </label>
              <Dropdown
                placeholder="Select a Vehicle"
                options={vehicle}
                optionLabel="name"
                optionValue="id"
                name="cityId"
                filter
                className="w-full"
                value={Vvalue}
                onChange={(e) => setVvalue(e.value)}
              />
            </div>
            <div>
              <h4>
                If You don't find Vehicle in options you can add it here and
                rechoose it in Vehicle name{" "}
              </h4>
              <Button
                rounded
                label="Add Vehicle"
                icon="pi pi-car"
                onClick={() => setshow(true)}
                className=" mb-3 mt-2 ml-2"
                severity="warning"
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
        <Stats step={3} {...props} />
      </div>
    );
  };

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
                <Fourth />
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
