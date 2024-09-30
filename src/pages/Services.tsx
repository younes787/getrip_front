import { useEffect, useState } from "react";
import { AssignFaciliesToServiceType, CreateServiceType, GetAllVehiclesTypes, GetAssignedFacilitiesByServiceTypeId, GetFacilitiesByCategoryId, GetFacilityCategories, GetResidenceType, GetServiceTypes, UpdateServiceType } from "../Services";
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
import ServicePricingtype from "./ServicePricingtype";
import { TabPanel, TabView } from "primereact/tabview";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import { SpeedDial } from "primereact/speeddial";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";

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
  const [showFacilities, setShowFacilities] = useState<boolean>(false);
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
  const [icons, setIcons] = useState<any>([]);
  const navigate = useNavigate();

  const radioOptionsPrimary: RadioOptionPrimary[] = [
    {
      title: 'Rental',
      value: 'isRental'
    },
    {
      title: 'Trip',
      value: 'isTrip'
    },
    {
      title: 'Other',
      value: 'isOther'
    },
  ];

  const radioOptionsSecondary: RadioOptionSecondary[] = [
    {
      title: 'Residence',
      value: 'isResidence',
      showIf: ['isRental']
    },
    {
      title: 'Vehicle',
      value: 'isVehicle',
      showIf: ['isRental']
    },
    {
      title: 'Cruise',
      value: 'isCruise',
      showIf: ['isTrip']
    },
    {
      title: 'Yacht',
      value: 'isYacht',
      showIf: ['isRental']
    },
  ];

  const addFacility = async () => {
    try {
      const facilitiesToAssign = selectedAssignFaciliesToServiceType.map((facilityId) => ({
        serviceTypeId: currentServiceId,
        facilityId
      }));
      await AssignFaciliesToServiceType(facilitiesToAssign);
    } catch (error) {
      console.error('Error assigning facilities to service type:', error);
    }
  };

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

    const _icons = Object.keys(fas).map(iconName =>  ({
      name: iconName,
      icon: fas[iconName]
    }));

    setIcons(_icons);
  }, []);

  const iconOption = (option: any) => {
    return (
      <div className="flex align-items-center">
        <FontAwesomeIcon icon={option.icon} className="mr-2" />
        <span>{option.name}</span>
      </div>
    );
  };

  const ServicesForm = useFormik<ServicesTypeDTO>({
    initialValues: new ServicesTypeDTO(),
    validateOnChange: true,
    onSubmit: async () => {
      try {
        const serviceType = await CreateServiceType(ServicesForm.values);

        setSelectedRadioOptionsPrimary(null);
        setSelectedRadioOptionsSecondary(null);

        confirmDialog({
          header: 'Success!',
          message: 'Your service is under review. Thank you for waiting.',
          icon: 'pi pi-check-circle',
          defaultFocus: 'accept',
          content: (props) => (
            <CustomConfirmDialogContent {...props} resetForm={ServicesForm.resetForm} />
          ),
        });

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
        const serviceType = await UpdateServiceType(ServicesFormUpdate.values);

        setSelectedRadioOptionsPrimary(null);
        setSelectedRadioOptionsSecondary(null);

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

  const ShowEditServiceType = (serviceType: ServicesTypeDTO) => {
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
      placement: serviceType.placement,
      name: serviceType.name,
      isRental: serviceType.isRental,
      isTrip: serviceType.isTrip,
      iconCode: serviceType.iconCode,
      isResidence: serviceType.isResidence,
      isFlightService: serviceType.isFlightService,
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
        <SpeedDial
          model={[
              {
                  label: 'Update',
                  icon: 'pi pi-pencil',
                  command: () => {
                    ShowEditServiceType(s)
                  }
              },
              {
                  label: 'Pricing',
                  icon: 'pi pi-tag',
                  command: () => {
                    setCurrentServiceId(s.id);
                    setPricingType(true)
                  }
              },
              {
                  label: 'Fields',
                  icon: 'pi pi-info-circle',
                  command: () => {
                    setCurrentServiceId(s.id);
                    setShowAtt(true);
                  }
              },
              ...(s?.isRental === true
                ? [
                    {
                      label: 'Facilities',
                      icon: 'pi pi-eject',
                      command: () => {
                        GetAssignedFacilitiesByServiceTypeId(s.id).then((res) => {
                          setSelectedAssignFaciliesToServiceType(res.data.map((fac: any) => fac.id));
                        });

                        setCurrentServiceId(s.id);
                        setShowFacilities(true);
                      },
                    },
                  ]
                : []),
          ]}
          radius={100}
          style={{ top: 'calc(50% - 2rem)', left: 0 }}
          className="speeddial-bottom-left sticky"
          type="quarter-circle"
          direction="up-left"
        />
    </div>
  );

  const onTabChange = async (e: any) => {
    // setLoading(true);
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

  const CustomConfirmDialogContent = ({ headerRef, message, hide, navigate, resetForm }: any) => {
    return (
      <div className="flex flex-column align-items-center p-5 surface-overlay border-round custom-widht">
        <div className="border-circle bg-green-500 text-white inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
          <i className="pi pi-check-circle text-5xl"></i>
        </div>
        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>{message.header}</span>
        <p className="mb-0">{message.message}</p>
        <div className="grid align-items-center gap-3 mt-4" >
          <Button label="Go home" outlined onClick={(event) => { hide(event); navigate('/') }} className="w-full text-green border-green-500 text-green-500"></Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ConfirmDialog content={({ headerRef, contentRef, footerRef, hide, message }) => (
        <CustomConfirmDialogContent headerRef={headerRef} message={message} hide={hide} navigate={navigate} resetForm={ServicesForm.resetForm} />
      )}/>

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

      <Dialog header="Add New Service Type"
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
            <label className="mb-2 block" htmlFor="Placement">Placement</label>
            <InputNumber
              name="placement"
              className="w-full"
              value={ServicesForm.values.placement}
              onChange={(e) => ServicesForm.setFieldValue("placement", e.value)}
            />
          </div>

          <div className="md:col-12 lg:col-6">
            <Dropdown
              onChange={(e) => ServicesForm.setFieldValue("iconCode", e.value.name)}
              options={icons}
              optionLabel="name"
              placeholder="Select an Icon"
              filter
              valueTemplate={<span>{<FontAwesomeIcon icon={fas[ServicesForm?.values?.iconCode]} className="mr-2" />}</span>}
              itemTemplate={iconOption}
              className="w-full"
            />
          </div>

          <div className="md:col-12 lg:col-12 flex justify-content-start align-items-center">
            <label htmlFor="Flight Service">Flight Service</label>
            <InputSwitch
              name="isFlightService"
              className="mx-2"
              checked={ServicesForm.values?.isFlightService}
              onChange={(e) => ServicesForm.setFieldValue("isFlightService", e.value)}
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

          {selectedRadioOptionsPrimary && selectedRadioOptionsPrimary.value !== 'isOther' && (
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

          {/* {selectedRadioOptionsSecondary?.value === 'isResidence' && (
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
          )} */}
        </div>
      </Dialog>

      <Dialog header="Edit Service Type"
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
            <label className="mb-2 block" htmlFor="Placement">Placement</label>
            <InputNumber
              name="placement"
              className="w-full"
              value={ServicesFormUpdate.values.placement}
              onChange={(e) => ServicesFormUpdate.setFieldValue("placement", e.value)}
            />
          </div>

          <div className="md:col-12 lg:col-6">
            <Dropdown
              onChange={(e) => ServicesFormUpdate.setFieldValue("iconCode", e.value.name)}
              options={icons}
              optionLabel="name"
              placeholder="Select an Icon"
              filter
              valueTemplate={<span>{<FontAwesomeIcon icon={fas[ServicesFormUpdate?.values?.iconCode]} className="mr-2" />}</span>}
              itemTemplate={iconOption}
              className="w-full"
            />
          </div>

          <div className="md:col-12 lg:col-12 flex justify-content-start align-items-center">
            <label htmlFor="Flight Service">Flight Service</label>
            <InputSwitch
              name="isFlightService"
              className="mx-2"
              checked={ServicesFormUpdate.values?.isFlightService}
              onChange={(e) => ServicesFormUpdate.setFieldValue("isFlightService", e.value)}
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

          {selectedRadioOptionsPrimary && selectedRadioOptionsPrimary.value !== 'isOther' && (
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

          {/* {selectedRadioOptionsSecondary?.value === 'isResidence' && (
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
          )} */}
          {/* {selectedRadioOptionsSecondary?.value === 'isVehicle' && (
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
          )} */}
        </div>
      </Dialog>

      <Dialog header="Add Facilities"
        visible={showFacilities}
        className="md:w-50 lg:w-50"
        style={{ maxWidth: '1000px' }}
        onHide={() => setShowFacilities(false)}
        footer={
          <div className="flex justify-end mt-4">
            <Button label="Save" size="small" severity="warning" outlined onClick={addFacility} className="mr-2"></Button>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowFacilities(false)}></Button>
          </div>
        }
        >
          <TabView className="md:col-12 lg:col-12 !rounded-md p-0" style={{ border: '1px solid #ddd' }} onTabChange={onTabChange} activeIndex={activeIndex}>
            {facilityCategories && facilityCategories.length > 0 && facilityCategories.map((facilityCategory: any, index: number) => (
              <TabPanel key={index} header={facilityCategory.name}>
                {loading ? (
                  <LoadingComponent />
                ) : (
                  <div className="grid grid-cols-12 gap-4">
                    {facilitiesByCategoryId && facilitiesByCategoryId.length > 0 && facilitiesByCategoryId.map((facility: any, idx: number) => (
                      <div className="md:col-3 lg:col-3 flex items-center" key={idx}>
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
      </Dialog>
    </div>
  );
};

export default Services;
