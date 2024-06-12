import { useEffect, useState } from "react";
import { AssignFaciliesToServiceType, CreateServiceType, GetAllVehiclesTypes, GetAssignedFacilitiesByServiceTypeId, GetFacilitiesByCategoryId, GetFacilityCategories, GetResidenceType, GetServiceTypes, UpdateService } from "../Services";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { AssignFaciliesToServiceTypeDTO, ServicesTypeDTO } from "../modules/getrip.modules";
import LoadingComponent from "../components/Loading";
import { Tag } from "primereact/tag";
import ServiceAttributes from "./ServiceAttributes";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import ServicePricingtype from "./ServicePricingtype";
import { TabPanel, TabView } from "primereact/tabview";
import { Checkbox } from "primereact/checkbox";

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
  const [vehicleType, setVehicleType] = useState<any>();
  const [facilitiesByCategoryId, setFacilitiesByCategoryId] = useState<any>();
  const [facilityCategories, setFacilityCategories] = useState<any>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedAssignFaciliesToServiceType, setSelectedAssignFaciliesToServiceType] = useState<any[]>([]);

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

  useEffect(() => {
    setLoading(true);

    GetServiceTypes().then((res) => {
      setServiceType(res.data);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    });

    GetFacilityCategories().then((res) => {
        setFacilityCategories(res.data);

        GetFacilitiesByCategoryId(res.data[0]?.id).then((res)=> {
          setFacilitiesByCategoryId(res?.data || [])
        });

        setLoading(false);
    }).catch((error) => {
      setLoading(false);
    });

    GetResidenceType().then((res) => setResidenceType(res.data));
    GetAllVehiclesTypes().then((res)=> setVehicleType(res.data));
  }, []);

  const ServicesForm = useFormik<ServicesTypeDTO>({
    initialValues: new ServicesTypeDTO(),
    validateOnChange: true,
    onSubmit: async () => {
      try {
        const serviceType = await CreateServiceType(ServicesForm.values);

        setSelectedRadioOptionsPrimary(null);
        setSelectedRadioOptionsSecondary(null);

        if(serviceType) {
          await AssignFaciliesToServiceType(selectedAssignFaciliesToServiceType.map((afts: any) => ({
            serviceTypeId: serviceType.data.id,
            facilityId: afts
          })));
        }

        ServicesForm.resetForm();
        setServicesForm(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const ServicesFormUpdate = useFormik<ServicesTypeDTO>({
    initialValues: new ServicesTypeDTO(),
    validateOnChange: true,
    onSubmit: async () => {
      try {
        const serviceType = await UpdateService(ServicesFormUpdate.values);

        setSelectedRadioOptionsPrimary(null);
        setSelectedRadioOptionsSecondary(null);

        if(serviceType) {
          await AssignFaciliesToServiceType(selectedAssignFaciliesToServiceType.map((afts: any) => ({
            serviceTypeId: ServicesFormUpdate.values.id,
            facilityId: afts
          })));
        }

        ServicesFormUpdate.resetForm();
        setShowServicesFormUpdate(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleCheckboxChange = (facilityId: any) => {
    setSelectedAssignFaciliesToServiceType(prevSelected => {
      if (prevSelected.includes(facilityId)) {
        return prevSelected.filter(id => id !== facilityId);
      } else {
        return [...prevSelected, facilityId];
      }
    });
  };

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

    GetAssignedFacilitiesByServiceTypeId(serviceType.id).then((res) => {
      setSelectedAssignFaciliesToServiceType(res.data.map((fac: any) => fac.id));
    });

    ServicesFormUpdate.setValues({
      id: serviceType.id,
      description: serviceType.description,
      name: serviceType.name,
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

  const onTabChange = async (e: any) => {
    setLoading(true);
    const newIndex = e.index;
    setActiveIndex(newIndex);

    try {
      const cid = facilityCategories[newIndex]?.id;
      const res = await GetFacilitiesByCategoryId(cid);
      setFacilitiesByCategoryId(res?.data || []);
    } catch (error) {
      console.error('Error fetching facilities on tab change:', error);
    } finally {
      setLoading(false);
    }
  };

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
        style={{ maxWidth: '800px' }}
        onHide={() => setServicesForm(false)}
        footer={
          <>
            <div className="flex justify-end mt-4">
              <Button label="Save" size="small" severity="warning" outlined onClick={() => ServicesForm.handleSubmit()} className="mr-2"></Button>
              <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setServicesForm(false)}></Button>
            </div>
          </>
        }
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="md:col-12 lg:col-6">
            <label htmlFor="name" className="block mb-2">Name</label>
            <InputText
              placeholder="Name"
              name="name"
              className="w-full"
              value={ServicesForm?.values?.name}
              onChange={(e) => ServicesForm.setFieldValue("name", e.target.value)}
            />
          </div>
          <div className="md:col-12 lg:col-6">
            <label htmlFor="description" className="block mb-2">Description</label>
            <InputText
              placeholder="Description"
              name="description"
              className="w-full"
              value={ServicesForm?.values?.description}
              onChange={(e) => ServicesForm.setFieldValue("description", e.target.value)}
            />
          </div>
          <div className="md:col-12 lg:col-6">
            <h3>Select an Option</h3>
            {radioOptionsPrimary.map((radioOption) => (
              <div key={radioOption.value} className="flex items-center mb-2">
                <RadioButton
                  inputId={radioOption.value}
                  name="primaryOptions"
                  onChange={() => {
                    setSelectedRadioOptionsPrimary(radioOption);
                    ServicesForm.setFieldValue(radioOption.value, true);
                  }}
                  checked={selectedRadioOptionsPrimary?.value === radioOption.value}
                />
                <label htmlFor={radioOption.value} className="ml-2">
                  {radioOption.title}
                </label>
              </div>
            ))}
          </div>
          {selectedRadioOptionsPrimary && (
            <div className="md:col-12 lg:col-6">
              <h3>Select a Secondary Option</h3>
              {radioOptionsSecondary
                .filter((radioOption) =>
                  radioOption.showIf.includes(selectedRadioOptionsPrimary?.value || '')
                )
                .map((radioOption) => (
                  <div key={radioOption.value} className="flex items-center mb-2">
                    <RadioButton
                      inputId={radioOption.value}
                      name="secondaryOptions"
                      onChange={() => {
                        setSelectedRadioOptionsSecondary(radioOption);
                        ServicesForm.setFieldValue(radioOption.value, true);
                      }}
                      checked={selectedRadioOptionsSecondary?.value === radioOption.value}
                    />
                    <label htmlFor={radioOption.value} className="ml-2">
                      {radioOption.title}
                    </label>
                  </div>
                ))}
            </div>
          )}
          {selectedRadioOptionsPrimary?.value === 'isRental' && (
            <TabView className="md:col-12 lg:col-12 !rounded-md p-0" style={{ border: '1px solid #ddd' }} onTabChange={onTabChange} activeIndex={activeIndex}>
              {facilityCategories && facilityCategories.length > 0 && facilityCategories.map((facilityCategory: any, index: number) => (
                <TabPanel key={index} header={facilityCategory.name}>
                  {loading ? (
                    <LoadingComponent />
                  ) : (
                    <div className="grid grid-cols-12 gap-4">
                      {facilitiesByCategoryId && facilitiesByCategoryId.length > 0 && facilitiesByCategoryId.map((facility: any, idx: number) => (
                        <div className="md:col-4 lg:col-4 flex items-center" key={idx}>
                          <Checkbox
                            name={facility.name}
                            checked={selectedAssignFaciliesToServiceType.includes(facility.id)}
                            onChange={() => handleCheckboxChange(facility.id)}
                          />
                          <label className="ml-2" htmlFor="Status">{facility.name}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </TabPanel>
              ))}
            </TabView>
          )}
          {selectedRadioOptionsSecondary?.value === 'isResidence' && (
            <div className="md:col-12 lg:col-6">
              <label htmlFor="residenceTypeId" className="block mb-2">Residence Type</label>
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
          )}
          {selectedRadioOptionsSecondary?.value === 'isVehicle' && (
            <div className="md:col-12 lg:col-6">
              <label htmlFor="vehicleTypeId" className="block mb-2">Vehicle Type</label>
              <Dropdown
                placeholder="Select a Vehicle Type"
                options={vehicleType}
                optionLabel="name"
                optionValue="id"
                name="vehicleTypeId"
                className="w-full"
                filter
                value={ServicesForm?.values?.vehicleTypeId}
                onChange={(e) => ServicesForm.setFieldValue("vehicleTypeId", e.value)}
              />
            </div>
          )}
        </div>
      </Dialog>

      <Dialog
        header="Edit Service Type"
        visible={showServicesFormUpdate}
        className="md:w-50 lg:w-50"
        style={{ maxWidth: '800px' }}
        onHide={() => setShowServicesFormUpdate(false)}
        footer={
          <div className="flex justify-end mt-4">
            <Button label="Save" size="small" severity="warning" outlined onClick={() => ServicesFormUpdate.handleSubmit()} className="mr-2"></Button>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowServicesFormUpdate(false)}></Button>
          </div>
        }
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="md:col-12 lg:col-6">
            <label htmlFor="name" className="block mb-2">Name</label>
            <InputText
              placeholder="Name"
              name="name"
              className="w-full"
              value={ServicesFormUpdate?.values?.name}
              onChange={(e) => ServicesFormUpdate.setFieldValue("name", e.target.value)}
            />
          </div>
          <div className="md:col-12 lg:col-6">
            <label htmlFor="description" className="block mb-2">Description</label>
            <InputText
              placeholder="Description"
              name="description"
              className="w-full"
              value={ServicesFormUpdate?.values?.description}
              onChange={(e) => ServicesFormUpdate.setFieldValue("description", e.target.value)}
            />
          </div>
          <div className="md:col-12 lg:col-6">
            <h3>Select an Option</h3>
            {radioOptionsPrimary.map((radioOption) => (
              <div key={radioOption.value} className="flex items-center mb-2">
                <RadioButton
                  inputId={radioOption.value}
                  name="primaryOptions"
                  onChange={() => {
                    setSelectedRadioOptionsPrimary(radioOption);
                    ServicesFormUpdate.setFieldValue(radioOption.value, true);
                  }}
                  checked={selectedRadioOptionsPrimary?.value === radioOption.value}
                />
                <label htmlFor={radioOption.value} className="ml-2">
                  {radioOption.title}
                </label>
              </div>
            ))}
          </div>
          {selectedRadioOptionsPrimary && (
            <div className="md:col-12 lg:col-6">
              <h3>Select a Secondary Option</h3>
              {radioOptionsSecondary
                .filter((radioOption) =>
                  radioOption.showIf.includes(selectedRadioOptionsPrimary?.value || '')
                )
                .map((radioOption) => (
                  <div key={radioOption.value} className="flex items-center mb-2">
                    <RadioButton
                      inputId={radioOption.value}
                      name="secondaryOptions"
                      onChange={() => {
                        setSelectedRadioOptionsSecondary(radioOption);
                        ServicesFormUpdate.setFieldValue(radioOption.value, true);
                      }}
                      checked={selectedRadioOptionsSecondary?.value === radioOption.value}
                    />
                    <label htmlFor={radioOption.value} className="ml-2">
                      {radioOption.title}
                    </label>
                  </div>
                ))}
            </div>
          )}
          {selectedRadioOptionsPrimary?.value === 'isRental' && (
            <TabView className="md:col-12 lg:col-12 !rounded-md p-0" style={{ border: '1px solid #ddd' }} onTabChange={onTabChange} activeIndex={activeIndex}>
              {facilityCategories && facilityCategories.length > 0 && facilityCategories.map((facilityCategory: any, index: number) => (
                <TabPanel key={index} header={facilityCategory.name}>
                  {loading ? (
                    <LoadingComponent />
                  ) : (
                    <div className="grid grid-cols-12 gap-4">
                      {facilitiesByCategoryId && facilitiesByCategoryId.length > 0 && facilitiesByCategoryId.map((facility: any, idx: number) => (
                        <div className="md:col-4 lg:col-4 flex items-center" key={idx}>
                          <Checkbox
                            name={facility.name}
                            checked={selectedAssignFaciliesToServiceType.includes(facility.id)}
                            onChange={() => handleCheckboxChange(facility.id)}
                          />
                          <label className="ml-2" htmlFor="Status">{facility.name}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </TabPanel>
              ))}
            </TabView>
          )}
          {selectedRadioOptionsSecondary?.value === 'isResidence' && (
            <div className="md:col-12 lg:col-6">
              <label htmlFor="residenceTypeId" className="block mb-2">Residence Type</label>
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
          )}
          {selectedRadioOptionsSecondary?.value === 'isVehicle' && (
            <div className="md:col-12 lg:col-6">
              <label htmlFor="vehicleTypeId" className="block mb-2">Vehicle Type</label>
              <Dropdown
                placeholder="Select a Vehicle Type"
                options={vehicleType}
                optionLabel="name"
                optionValue="id"
                name="vehicleTypeId"
                className="w-full"
                filter
                value={ServicesFormUpdate?.values?.vehicleTypeId}
                onChange={(e) => ServicesFormUpdate.setFieldValue("vehicleTypeId", e.value)}
              />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Services;
