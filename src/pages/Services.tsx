import { useEffect, useState } from "react";
import { CreateServiceType, GetAllVehiclesTypes, GetCurrency, GetResidenceType, GetServiceTypes, UpdateService } from "../Services";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { ServicesTypeDTO } from "../modules/getrip.modules";
import LoadingComponent from "../components/Loading";
import { Tag } from "primereact/tag";
import ServiceAttributes from "./ServiceAttributes";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import ServicePricingtype from "./ServicePricingtype";

interface RadioOptionPrimary {
  title: string,
  value: string,
}

interface RadioOptionSecondary {
  title: string,
  value: string,
  showIf: string[]
}

const Services = () => {
  const [serviceType, setServiceType] = useState<any>();
  const [showServicesForm, setServicesForm] = useState<boolean>(false);
  const [showServicesFormUpdate, setShowServicesFormUpdate] = useState<boolean>(false);
  const [ShowPricingType, setPricingType] = useState<boolean>(false);
  const [showAtt, setShowAtt] = useState<boolean>(false);
  const [currentServiceId, setCurrentServiceId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRadioOptionsPrimary, setSelectedRadioOptionsPrimary] = useState<RadioOptionPrimary | null>(null);
  const [selectedRadioOptionsSecondary, setSelectedRadioOptionsSecondary] = useState<RadioOptionSecondary | null>(null);
  const [residenceType, setResidenceType] = useState();
  const [currency, setCurrency] = useState();
  const [vehicleType, setVehicleType] = useState<any>();

  const radioOptionsPrimary: RadioOptionPrimary[] = [
    {
      title: 'Is Rental',
      value: 'isRental'
    },
    {
      title: 'Is Trip',
      value: 'isTrip'
    },
  ];

  const radioOptionsSecondary: RadioOptionSecondary[] = [
    {
      title: 'Is Residence',
      value: 'isResidence',
      showIf: ['isRental']
    },
    {
      title: 'Is Vehicle',
      value: 'isVehicle',
      showIf: ['isRental', 'isTrip']
    },
    {
      title: 'Is Cruise',
      value: 'isCruise',
      showIf: ['isRental', 'isTrip']
    },
    {
      title: 'Is Yacht',
      value: 'isYacht',
      showIf: ['isRental', 'isTrip']
    },
  ];

  const ServicesForm = useFormik<ServicesTypeDTO>({
    initialValues: new ServicesTypeDTO(),
    validateOnChange: true,
    onSubmit: () => {
      CreateServiceType(ServicesForm.values).then((res: any) => {
        ServicesForm.resetForm();
        setSelectedRadioOptionsPrimary(null);
        setSelectedRadioOptionsSecondary(null);
      });
      setServicesForm(false);
    },
  });

  const ServicesFormUpdate = useFormik<ServicesTypeDTO>({
    initialValues: new ServicesTypeDTO(),
    validateOnChange: true,
    onSubmit: () => {
      UpdateService(ServicesFormUpdate.values).then((res: any) => {
        ServicesFormUpdate.resetForm();
        setSelectedRadioOptionsPrimary(null);
        setSelectedRadioOptionsSecondary(null);
      });
      setShowServicesFormUpdate(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    GetServiceTypes().then((res) => {
      setServiceType(res.data);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    });

    GetCurrency().then((res) => setCurrency(res.data))
    GetResidenceType().then((res) => setResidenceType(res.data));
    GetAllVehiclesTypes().then((res)=> setVehicleType(res.data))
  }, []);

  const ShowEditServiceType = (serviceType: any) => {
    setShowServicesFormUpdate(true);

    const primaryOption = radioOptionsPrimary.find(option => serviceType[option.value as keyof typeof serviceType]);
    setSelectedRadioOptionsPrimary(primaryOption || null);

    if (primaryOption) {
      const secondaryOption = radioOptionsSecondary.find(option =>
        option.showIf.includes(primaryOption.value) && serviceType[option.value as keyof typeof serviceType]
      );
      setSelectedRadioOptionsSecondary(secondaryOption || null);
    }

    ServicesFormUpdate.setValues({
      id: serviceType.id,
      description: serviceType.description,
      name: serviceType.name,
      currencyId: serviceType.currencyId,
      isRental: serviceType.isRental,
      isTrip: serviceType.isTrip,
      isResidence: serviceType.isResidence,
      isVehicle: serviceType.isVehicle,
      isCruise: serviceType.isCruise,
      isYacht: serviceType.isYacht,
    });

    if(serviceType.residenceTypeId) {
      ServicesFormUpdate.setFieldValue('residenceTypeId', serviceType.residenceTypeId)
    }
    if(serviceType.vehicleTypeId) {
      ServicesFormUpdate.setFieldValue('vehicleTypeId', serviceType.vehicleTypeId)
    }
  };


  const footer = (s:any) => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button label="Update" size="small" icon="pi pi-pencil" className="mx-1" onClick={() => ShowEditServiceType(s)}/>
        <Button label="Pricing" size="small" icon="pi pi-tag" className="mx-1" onClick={() => {
          setCurrentServiceId(s.id);
          setPricingType(true)
        }}/>
        <Button label="Fields" size="small" severity="secondary" icon="pi pi-info-circle" className="mx-1" onClick={() => {
            setCurrentServiceId(s.id);
            setShowAtt(true);
          }}
        />
    </div>
  );

  return (
    <div>
      {loading ? <LoadingComponent /> :
        <div className="grid grid-cols-12">
          {serviceType?.map((service_type: any) => (
            <div className="md:col-3 lg:col-4">
              <Card
                title={
                  <div>{service_type?.name}{" "}</div>
                }
                subTitle={
                  <div style={{ color: "white" }}>
                    {service_type?.serviceTypeFields.map((a: any) => (
                      <Tag value={a.name} style={{ marginRight: "8px" }}></Tag>
                    ))}
                  </div>
                }
                className="service-card"
                footer={
                  footer(service_type)
                }
              >
              <div style={{ paddingBottom: "40px" }}>
                {service_type?.description}
              </div>
            </Card>

            </div>
          ))}

          <div className="md:col-3 lg:col-4">
            <Card
              title="Add New Service"
              className="service-card add-new"
              onClick={() => setServicesForm(true)}
            >
              <i className="pi pi-plus"></i>
            </Card>
          </div>
        </div>
      }

      <Dialog header="Add Field" visible={showAtt} className="md:w-50 lg:w-50" onHide={() => setShowAtt(false)}>
        <ServiceAttributes id={currentServiceId}/>
      </Dialog>

      <Dialog header="Add Pricing" visible={ShowPricingType} className="md:w-50 lg:w-50" onHide={() => setPricingType(false)}>
        <ServicePricingtype id={currentServiceId}/>
      </Dialog>

      <Dialog
        header="Add New Service Type"
        visible={showServicesForm}
        className="md:w-50 lg:w-50"
        onHide={() => setServicesForm(false)}
        footer={
          <>
            <div>
              <Button label="Save" size="small" severity="warning" outlined onClick={() => ServicesForm.handleSubmit()} className="mt-4"></Button>
              <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setServicesForm(false)} className="mt-4"></Button>
            </div>
          </>
        }
      >
        <div className="grid grid-cols-12">
          <div className="md:col-12 lg:col-6">
            <div>
              <label className="mb-2" htmlFor="Status">Name</label>
            </div>

            <InputText
              placeholder="Name"
              name="name"
              className="w-full"
              value={ServicesForm?.values?.name}
              onChange={(e) => ServicesForm.setFieldValue("name", e.target.value)}
            />
          </div>

          <div className="md:col-12 lg:col-6">
            <div>
              <label className="mb-2" htmlFor="Wallet">Description</label>
            </div>

            <InputText
              placeholder="Description"
              name="description"
              className="w-full"
              value={ServicesForm?.values?.description}
              onChange={(e) => ServicesForm.setFieldValue("description", e.target.value)}
            />
          </div>

          <div className="md:col-12 lg:col-6">
            <div>
              <label className="mb-2" htmlFor="">Currency</label>
            </div>

            <Dropdown
              placeholder="Select a currency"
              options={currency}
              optionLabel="name"
              optionValue="id"
              className="w-full"
              filter
              value={ServicesForm.values.currencyId}
              onChange={(e) => ServicesForm.setFieldValue('currencyId', e.value )}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <div className="md:col-6 lg:col-6">
              <h2>Select an Option</h2>
              {radioOptionsPrimary.map((radioOption) => (
                <div key={radioOption.value} className="flex align-items-center m-2">
                  <RadioButton
                    inputId={radioOption.value}
                    name="primaryOptions"
                    onChange={() => {
                      setSelectedRadioOptionsPrimary(radioOption)
                      ServicesForm.setFieldValue(radioOption.value, true)
                    }}
                    checked={selectedRadioOptionsPrimary?.value === radioOption.value}
                  />
                  <label htmlFor={radioOption.value} className="ml-2">
                    {radioOption.title}
                  </label>
                </div>
              ))}
            </div>

            {selectedRadioOptionsPrimary &&
              <div className="md:col-6 lg:col-6">
                <h2>Select a Secondary Option</h2>
                {radioOptionsSecondary
                  .filter((radioOption) =>
                    radioOption.showIf.includes(selectedRadioOptionsPrimary?.value || '')
                  )
                  .map((radioOption) => (
                    <div key={radioOption.value} className="flex align-items-center m-2">
                      <RadioButton
                        inputId={radioOption.value}
                        name="secondaryOptions"
                        onChange={() => {
                          setSelectedRadioOptionsSecondary(radioOption)
                          ServicesForm.setFieldValue(radioOption.value, true)
                        }}
                        checked={selectedRadioOptionsSecondary?.value === radioOption.value}
                      />
                      <label htmlFor={radioOption.value} className="ml-2">
                        {radioOption.title}
                      </label>
                    </div>
                  ))}
              </div>
            }
          </div>

          {selectedRadioOptionsSecondary?.value === 'isResidence' &&
            <div className="md:col-12 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="">Residence Type</label>
              </div>

              <Dropdown
                placeholder="Select a Residence Type"
                options={residenceType}
                optionLabel="name"
                optionValue="id"
                name="residenceTypeId"
                className="w-full"
                filter
                value={ServicesForm?.values?.residenceTypeId}
                onChange={(e) => ServicesForm.setFieldValue("residenceTypeId", e.value)}
              />
            </div>
          }

          {selectedRadioOptionsSecondary?.value === 'isVehicle' &&
            <div className="md:col-12 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="Status">vehicle type</label>
              </div>

              <Dropdown
                placeholder="Select a vehicle type"
                options={vehicleType}
                optionLabel="name"
                optionValue="id"
                name="vehicleTypeId"
                filter
                className="w-full"
                value={ServicesForm?.values?.vehicleTypeId}
                onChange={(e) => ServicesForm.setFieldValue("vehicleTypeId", e.value)}
              />
            </div>
          }
        </div>
      </Dialog>

      <Dialog
        header="Edit Service Type"
        visible={showServicesFormUpdate}
        className="md:w-50 lg:w-50"
        onHide={() => setShowServicesFormUpdate(false)}
        footer={
          <>
            <div>
              <Button label="Save" size="small" severity="warning" outlined onClick={() => ServicesFormUpdate.handleSubmit()} className="mt-4"></Button>
              <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowServicesFormUpdate(false)} className="mt-4"></Button>
            </div>
          </>
        }
      >
        <div className="grid grid-cols-12">
          <div className="md:col-12 lg:col-6">
            <div>
              <label className="mb-2" htmlFor="Status">Name</label>
            </div>

            <InputText
              placeholder="Name"
              name="name"
              className="w-full"
              value={ServicesFormUpdate?.values?.name}
              onChange={(e) => ServicesFormUpdate.setFieldValue("name", e.target.value)}
            />
          </div>

          <div className="md:col-12 lg:col-6">
            <div>
              <label className="mb-2" htmlFor="Wallet">Description</label>
            </div>

            <InputText
              placeholder="Description"
              name="description"
              className="w-full"
              value={ServicesFormUpdate?.values?.description}
              onChange={(e) => ServicesFormUpdate.setFieldValue("description", e.target.value)}
            />
          </div>

          <div className="md:col-12 lg:col-6">
            <div>
              <label className="mb-2" htmlFor="">Currency</label>
            </div>

            <Dropdown
              placeholder="Select a currency"
              options={currency}
              optionLabel="name"
              optionValue="id"
              className="w-full"
              filter
              value={ServicesFormUpdate.values.currencyId}
              onChange={(e) => ServicesFormUpdate.setFieldValue('currencyId', e.value )}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <div className="md:col-6 lg:col-6">
              <h2>Select an Option</h2>
              {radioOptionsPrimary.map((radioOption) => (
                <div key={radioOption.value} className="flex align-items-center m-2">
                  <RadioButton
                    inputId={radioOption.value}
                    name="primaryOptions"
                    onChange={() => {
                      setSelectedRadioOptionsPrimary(radioOption)
                      ServicesFormUpdate.setFieldValue(radioOption.value, true)
                    }}
                    checked={selectedRadioOptionsPrimary?.value === radioOption.value}
                  />
                  <label htmlFor={radioOption.value} className="ml-2">
                    {radioOption.title}
                  </label>
                </div>
              ))}
            </div>

            {selectedRadioOptionsPrimary &&
              <div className="md:col-6 lg:col-6">
                <h2>Select a Secondary Option</h2>
                {radioOptionsSecondary
                  .filter((radioOption) =>
                    radioOption.showIf.includes(selectedRadioOptionsPrimary?.value || '')
                  )
                  .map((radioOption) => (
                    <div key={radioOption.value} className="flex align-items-center m-2">
                      <RadioButton
                        inputId={radioOption.value}
                        name="secondaryOptions"
                        onChange={() => {
                          setSelectedRadioOptionsSecondary(radioOption)
                          ServicesFormUpdate.setFieldValue(radioOption.value, true)
                        }}
                        checked={selectedRadioOptionsSecondary?.value === radioOption.value}
                      />
                      <label htmlFor={radioOption.value} className="ml-2">
                        {radioOption.title}
                      </label>
                    </div>
                  ))}
              </div>
            }
          </div>

          {selectedRadioOptionsSecondary?.value === 'isResidence' &&
            <div className="md:col-12 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="">Residence Type</label>
              </div>

              <Dropdown
                placeholder="Select a Residence Type"
                options={residenceType}
                optionLabel="name"
                optionValue="id"
                name="residenceTypeId"
                className="w-full"
                filter
                value={ServicesFormUpdate?.values?.residenceTypeId}
                onChange={(e) => ServicesFormUpdate.setFieldValue("residenceTypeId", e.value)}
              />
            </div>
          }

          {selectedRadioOptionsSecondary?.value === 'isVehicle' &&
            <div className="md:col-12 lg:col-6">
              <div>
                <label className="mb-2" htmlFor="Status">vehicle type</label>
              </div>

              <Dropdown
                placeholder="Select a vehicle type"
                options={vehicleType}
                optionLabel="name"
                optionValue="id"
                name="vehicleTypeId"
                filter
                className="w-full"
                value={ServicesFormUpdate?.values?.vehicleTypeId}
                onChange={(e) => ServicesFormUpdate.setFieldValue("vehicleTypeId", e.value)}
              />
            </div>
          }
        </div>
      </Dialog>
    </div>
  );
};

export default Services;
