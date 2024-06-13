import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import { Button } from "primereact/button";
import { AddImageToService, AddService, GetCitiesbyid, GetCurrency, GetFeildsbysid, GetPlacesbyid, GetResidencebyCottages, GetAllYachts, GetAllPricingTypes, GetAllCountries, GetProvincebyCid, GetAssignedFacilitiesByServiceTypeIdWithCategory} from "../Services";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import Vehicle from "../pages/Vehicle";
import Residence from "../pages/Residencemain";
import { InputSwitch } from "primereact/inputswitch";
import { FildsDTO, ImageDTO, ServiceDTO, ServiceFacilitiesDTO, TagsDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { useAuth } from "../AuthContext/AuthContext";
import { FileUpload } from "primereact/fileupload";
import { useLocation, useNavigate } from "react-router-dom";
import { Fieldset } from "primereact/fieldset";
import { Tag } from "primereact/tag";
import { Image } from 'primereact/image';
import LoadingComponent from "./Loading";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const validationSchema = Yup.object({
  name: Yup.string().required('Service Name is required'),
  description: Yup.string().required('Service Description is required'),
  // imagePath: Yup.mixed().required('Service Image is required'),
  price: Yup.number().required('Service Price is required').positive('Price must be a positive number'),
  cityId: Yup.number().required('City is required'),
  // placeId: Yup.number().required('Place is required'),
  // rentalPlaceName: Yup.string(),
  // fields: Yup.object().shape({
  //   someFieldName: Yup.string().required('This field is required')
  // }),
  // photos: Yup.object().shape({
  //   imagePath: Yup.string().required('This Image is required')
  // }),
  // tags: Yup.array().of(
  //   Yup.object().shape({
  //     name: Yup.string().required('Tag name is required')
  //   })
  // ),
  currencyId: Yup.number().required('Currency is required'),
});

const FormUseType = () => {
  const [fileimg, setFileimg] = useState<any>();
  const [FeildsType, setFeildsType] = useState<any>();
  const [assignedFacilitiesByServiceTypeIdWithCategory, setAssignedFacilitiesByServiceTypeIdWithCategory] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [places, setPlaces] = useState<any>([]);
  const [residence, setResidence] = useState();
  const [vehicle, setVehicle] = useState();
  const [currency, setCurrency] = useState();
  const [showResidence, setshowResidence] = useState<boolean>(false);
  const [showPlace, setshowPlace] = useState<boolean>(false);
  const [showVehicle, setshowVehicle] = useState<boolean>(false);
  const [otherPlace, setOtherPlace] = useState<any>();
  const [tags, setTags] = useState([{ name: '' }]);
  const { user } = useAuth();
  const handleImgChange = (e: any) => { setFileimg(e.files?.[0]); };
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState('');
  const [newTag, setNewTag] = useState<string>('');
  const nonEmptyTags = tags.filter(tag => tag.name.trim() !== '');
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [pricingTypes, setPricingTypes] = useState<any>();
  const [provinces, setProvinces] = useState<any>();
  const [countries, setCountries] = useState<any>();
  const [selectedCountry, setSelectedCountry] = useState<number>(0);
  const [selectedProvince, setSelectedProvince] = useState<number>(0);

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

  const Serviceform = useFormik<ServiceDTO>({
    initialValues: new ServiceDTO(),
    validationSchema,
    validateOnChange: true,
    onSubmit: (values) => {
      Serviceform.values.isRental = true
      Serviceform.values.typeId?.id === 9 ? Serviceform.values.isYacht = true : Serviceform.values.isYacht = false;
      Serviceform.values.typeId?.id === 12 ? Serviceform.values.isVehicle = true : Serviceform.values.isVehicle = false;
      Serviceform.values.accountId = user?.data?.accountId;
      Serviceform.values.rentalPlaceName !== '' ? Serviceform.values.hasNewRentalPlace = true :Serviceform.values.hasNewRentalPlace = false;
      Serviceform.values.typeId =  Serviceform.values.typeId?.id;

      const formattedFields: FildsDTO[] = Object.keys(values.fields).map((key, index) => ({
        id: index,
        value: JSON.stringify(values.fields[key]),
        serviceTypeFieldId: FeildsType.find((f:any) => f.name === key)?.id || 0,
        serviceId: 0
      }));

      const formattedTags: TagsDTO[] =  values.tags && values.tags.map((tag : any, index :any) => ({
        id: index,
        name: tag.name,
        serviceId: 0
      }));

      const serviceFacilities: ServiceFacilitiesDTO[] = values.serviceFacilities
      ?.filter((serviceFacility: any) => serviceFacility !== undefined)
      .map((serviceFacility: any) => ({
        name: '',
        serviceId: 0,
        serviceTypeFacilityId: serviceFacility.serviceTypeFacilityId,
        isPrimary: serviceFacility.isPrimary ?? false,
        isAdditionalCharges: serviceFacility.isAdditionalCharges ?? false,
      })) || [];

      values.tags = formattedTags;
      values.fields = formattedFields;
      values.serviceFacilities = serviceFacilities;
      Serviceform.values.residenceTypeId = 1;
      handleAddService();
    },
  });

  const handleAddService = async () => {
    try {
      const addServiceResponse = await AddService(Serviceform.values);
      if (addServiceResponse.isSuccess) {
          confirmDialog({
            header: 'Success!',
            message: 'Service added successfully.',
            icon: 'pi pi-check-circle',
            defaultFocus: 'accept',
            content: (props) => (
              <CustomConfirmDialogContent {...props} resetForm={Serviceform.resetForm} />
            ),
          });
      }
    } catch (error) {
      console.error('Error adding service or fetching all services:', error);
    }
  };

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

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        if (location.state == null) {
          navigate('/profile');
        } else {
          Serviceform.setFieldValue("typeId", location.state);

          const [feildsTypeRes, vehicleRes] = await Promise.all([
            GetFeildsbysid(location.state.id),
            GetAllYachts()
          ]);

          setFeildsType(feildsTypeRes.data);
          setVehicle(vehicleRes.data);

          const [getAssignedFacilitiesByServiceTypeIdWithCategoryRes] = await Promise.all([
            GetAssignedFacilitiesByServiceTypeIdWithCategory(location.state.id),
          ]);

          setAssignedFacilitiesByServiceTypeIdWithCategory(getAssignedFacilitiesByServiceTypeIdWithCategoryRes.data);
        }

        const [countriesRes, currencyRes] = await Promise.all([
          GetAllCountries(),
          GetCurrency(),
        ]);

        setCountries(countriesRes.data);
        setCurrency(currencyRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    GetAllPricingTypes().then((res) => {
      const filteredData = res?.data.filter((item: any) => item.serviceTypeId === location.state.id);
      setPricingTypes(filteredData);
    });

    fetchData();
  }, [location, navigate]);

  useEffect(() => {
    GetProvincebyCid(selectedCountry).then((res) => setProvinces(res.data));
    GetCitiesbyid(selectedProvince).then((res) => setCities(res.data));
  }, [selectedCountry, selectedProvince]);

  const handleCityChange = (e: any) => {
    Serviceform.setFieldValue("cityId", e.value)
    GetPlacesbyid(e.value).then((res) => {
      setPlaces([...res.data, { id: 'other', name: 'other', desciption: 'other'}])
    });
  };

  const handlePlaceChange = (e: any) => {
    if(e.target.value === 'other') {
      setOtherPlace(e.target)
      setshowPlace(true)
    } else {
      Serviceform.setFieldValue("placeId", e.value)
      GetResidencebyCottages(e.value).then((res) => setResidence(res.data));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      const updatedTags = [...tags, { name: newTag }];
      setTags(updatedTags);
      setNewTag('');
      Serviceform.setFieldValue('tags', updatedTags);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    Serviceform.setFieldValue('tags', updatedTags);
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const renderError = (error: any) => {
    if (typeof error === 'string') {
      return <div className="text-red-500 mt-2">{error}</div>;
    }
    if (Array.isArray(error)) {
      return error.map((err, index) => <div key={index} className="text-red-500 mt-2">{err}</div>);
    }
    return null;
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
          <Button label="Continue adding services" onClick={(event) => { hide(event); resetForm(); }} className="w-full bg-green-500 border-green-500"></Button>
          <Button label="Go home" outlined onClick={(event) => { hide(event); navigate('/') }} className="w-full text-green border-green-500 text-green-500"></Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-12">
      {loading ? <LoadingComponent/> : <>
        <div className="grid grid-cols-12 mt-3 mb-5">
          <div className="back md:col-1 lg:col-1 flex justify-content-start align-items-center">
            <Button icon="pi pi-angle-left" label="back" onClick={() => navigate('/add-services')} />
          </div>

          <div className="md:col-11 lg:col-11 getrip-type text-center flex justify-content-center align-items-center">
            <Image alt={Serviceform.values.typeId?.name} zoomSrc={Serviceform.values.typeId?.photos[0].imagePath} src={Serviceform.values.typeId?.photos[0].imagePath} width="90" height="90" preview />
            <span className="primary mx-2 text-xl antialiased get-rp">{Serviceform.values.typeId?.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-12">
          <Fieldset legend="Base Info" className="md:col-12 lg:col-12 mb-3" toggleable>
            <div className="grid grid-cols-12">
              <div className="md:col-6 lg:col-6">
                <label htmlFor="Wallet">Service Name</label>
                <InputText
                  placeholder="Service Name"
                  name="name"
                  className="w-full mt-1"
                  value={Serviceform.values.name}
                  autoFocus={focusedField === 'name'}
                  onInput={() => handleInputFocus('name')}
                  onChange={(e) => Serviceform.setFieldValue('name', e.target.value)} />
                  {renderError(Serviceform.errors.name)}
              </div>

              <div className="md:col-6 lg:col-6">
                <label htmlFor="Wallet">Service Description</label>
                <InputText
                  placeholder="Description"
                  name="description"
                  className="w-full mt-1"
                  value={Serviceform.values.description}
                  autoFocus={focusedField === 'description'}
                  onInput={() => handleInputFocus('description')}
                  onChange={(e) => Serviceform.setFieldValue('description', e.target.value)} />
                  {renderError(Serviceform.errors.description)}
              </div>

              <div className="md:col-6 lg:col-6">
                <label htmlFor="Wallet">Service Image</label>
                <FileUpload
                  name="imagePath"
                  accept="image/*"
                  onSelect={handleImgChange}
                  emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                  chooseOptions={{
                    icon: "pi pi-fw pi-images",
                    iconOnly: true,
                    className: "custom-choose-btn p-button-rounded p-button-outlined",
                  }}
                  uploadOptions={{ style: { display: 'none' } }}
                  cancelOptions={{
                    icon: "pi pi-fw pi-times",
                    iconOnly: true,
                    className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
                  }}
                  customUpload
                  uploadHandler={() => ImageServiceform.handleSubmit()} />
                  {renderError(Serviceform.errors.photos)}
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Input Type" className="md:col-12 lg:col-12 mb-3" toggleable>
            {FeildsType && FeildsType.length > 0 ?
              <div className="grid grid-cols-12">
                {FeildsType?.map((f: any, index: number) => (
                  <div key={f.name} className="md:col-6 lg:col-6">
                    <label className="mb-2 block" htmlFor={f.name}>{f.name}</label>

                    {f.fieldTypeName === 'Bool' && (
                      <InputSwitch
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        checked={Serviceform.values.fields?.[f.name]}
                        onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)} />
                    )}
                    {f.fieldTypeName === 'Number' && (
                      <InputNumber
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        value={Serviceform.values.fields?.[f.name]}
                        onValueChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)}
                        placeholder={f.name} />
                    )}
                    {f.fieldTypeName === 'Date' && (
                      <Calendar
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        value={Serviceform.values.fields?.[f.name]}
                        onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)}
                        placeholder={f.name} />
                    )}
                    {f.fieldTypeName === 'Text' && (
                      <InputText
                        value={Serviceform.values.fields?.[f.name]}
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.target.value)}
                        placeholder={f.name} />
                    )}
                    {renderError(Serviceform.errors.fields)}
                  </div>
                ))}
              </div>
              : <p className="text-center text-red-500 text-sm italic">No Data</p>}
          </Fieldset>

          <Fieldset legend="Address" className="md:col-12 lg:col-12 mb-3" toggleable>
            <div className="grid grid-cols-12">

              <div className="md:col-6 lg:col-6">
                <div>
                  <label className=" primary" htmlFor="">Country</label>
                </div>

                <Dropdown
                  placeholder="Select a Country"
                  options={countries}
                  optionLabel="name"
                  optionValue="id"
                  name="countryId"
                  filter
                  className="mt-2	w-full"
                  value={Serviceform?.values?.countryId}
                  onChange={(e) => {
                    setSelectedCountry(e.value);
                    Serviceform.setFieldValue("countryId", e.value)
                  }}
                />
              </div>

              <div className="md:col-6 lg:col-6">
                <div>
                  <label className=" primary" htmlFor="">Provinces</label>
                </div>

                <Dropdown
                  placeholder="Select a Provincy"
                  options={provinces}
                  optionLabel="name"
                  optionValue="id"
                  name="provincyId"
                  filter
                  className="mt-2	w-full"
                  value={Serviceform?.values?.provincyId}
                  onChange={(e) => {
                    setSelectedProvince(e.value);
                    Serviceform.setFieldValue("provincyId", e.value)
                  }}
                />
              </div>

              <div className="md:col-6 lg:col-6">
                <label className="mb-2" htmlFor="Status">{" "}City Name{" "}</label>
                <Dropdown
                  placeholder="Select a City"
                  options={cities}
                  optionLabel="name"
                  optionValue="id"
                  name="cityId"
                  filter
                  className="w-full"
                  value={Serviceform.values.cityId}
                  onChange={(e) => handleCityChange(e)} />
                  {renderError(Serviceform.errors.cityId)}
              </div>

              {Serviceform.values.typeId?.name !== "VIP transfers" &&
                Serviceform.values.typeId?.name !== 'Transfers' &&
                Serviceform.values.typeId?.name !== 'transfers' ? (
                <>
                  <div className="md:col-6 lg:col-6">
                    <label className="mb-2" htmlFor="">{" "}Place Name{" "}</label>
                    <Dropdown
                      placeholder="Select a Place"
                      options={places}
                      optionLabel="name"
                      optionValue="id"
                      name="placeId"
                      filter
                      className="w-full"
                      tooltip={"If you don't find the place you're looking for, you can add a new place by selecting 'Other'."}
                      tooltipOptions={{ event: 'both', position: 'left', showDelay: 100 }}
                      value={Serviceform.values.placeId ?? otherPlace?.value}
                      onChange={(e) => handlePlaceChange(e)} />
                      {renderError(Serviceform.errors.placeId)}
                  </div>

                  <Dialog header={"Add Residence"} visible={showResidence} className="md:w-40rem lg:w-40rem" onHide={() => setshowResidence(false)}>
                    <Residence />
                  </Dialog>

                  <Dialog header={"Add Place"} visible={showPlace} className="md:w-40rem lg:w-40rem" onHide={() => setshowPlace(false)}>
                    <div className="md:col-12 lg:col-12">
                      <label className="mb-2" htmlFor="Status">{" "}New Place Name{" "}</label>
                      <InputText
                        placeholder="New Place"
                        name="rentalPlaceName"
                        className="w-full"
                        autoFocus={focusedField === 'rentalPlaceName'}
                        onInput={() => handleInputFocus('rentalPlaceName')}
                        value={Serviceform.values.rentalPlaceName}
                        onChange={(e) => Serviceform.setFieldValue('rentalPlaceName', e.target.value)} />
                        {renderError(Serviceform.errors.rentalPlaceName)}
                    </div>

                    <Button rounded icon='pi pi-plus' severity="danger" size="small" className="mt-2" label="Add" onClick={() => setshowPlace(false)} />
                  </Dialog>

                  <Dialog header={"Add Vehicle"} visible={showVehicle} className="md:w-40rem lg:w-40rem" onHide={() => setshowVehicle(false)}>
                    <Vehicle />
                  </Dialog>

                </>
              ) : <></>}
            </div>
          </Fieldset>

          <Fieldset legend="Tags" className="md:col-12 lg:col-12 mb-3" toggleable>
            <div className="grid grid-cols-12">
              {nonEmptyTags.length > 0 && (
                <div className="md:col-12 lg:col-12">
                  {nonEmptyTags.map((tag, index) => (
                    <Tag key={index} severity="info" value={tag.name} className="m-1 cursor-pointer" icon="pi pi-times" onClick={() => handleRemoveTag(index)} />
                  ))}
                </div>
              )}

              <div className="md:col-12 lg:col-12">
                <InputText
                  placeholder="Tag"
                  className="w-full"
                  name="tags.name"
                  value={newTag}
                  autoFocus={focusedField === 'tags.name'}
                  onInput={() => handleInputFocus('tags.name')}
                  onChange={(e) => setNewTag(e.target.value)} />
                  {/* {renderError(Serviceform.errors.tags)} */}
                <Button
                  icon="pi pi-plus"
                  label="Add Tag"
                  onClick={handleAddTag}
                  rounded
                  severity="info"
                  size="small"
                  className="mt-2 col-span-12" />
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Price" className="md:col-12 lg:col-12 mb-3" toggleable>
            <div className="grid grid-cols-12">
              <div className="md:col-6 lg:col-6">
                <label htmlFor="Wallet">Service Price</label>
                <InputNumber
                  placeholder="Price"
                  name="price"
                  className="w-full mt-1"
                  value={Serviceform.values.price}
                  autoFocus={focusedField === 'price'}
                  onInput={() => handleInputFocus('price')}
                  onChange={(e) => Serviceform.setFieldValue('price', e.value)} />
                  {renderError(Serviceform.errors.price)}
              </div>

              <div className="md:col-6 lg:col-6">
                <label htmlFor="Wallet">Service Currency</label>
                <InputText
                  placeholder="currency"
                  name="currency"
                  className="w-full mt-1"
                  disabled
                  value={'USD'}
                  autoFocus={focusedField === 'currency'}
                  onInput={() => handleInputFocus('currency')}
                  onChange={(e) => Serviceform.setFieldValue('currencyId', user.data.currencyId)} />
                  {renderError(Serviceform.errors.currencyId)}
              </div>

              {pricingTypes && pricingTypes.length > 0 && <>
                {pricingTypes?.map((pricingType: any, index: number) => (
                    <div className=" md:col-6 lg:col-6my-2">
                    <label htmlFor={pricingType.name}>{pricingType.name}</label>
                    <InputNumber
                      autoFocus={focusedField === pricingType.name}
                      onInput={() => handleInputFocus(pricingType.name)}
                      value={Serviceform.values.fields?.[pricingType.name]}
                      className="w-full mt-1"
                      onValueChange={(e) => Serviceform.setFieldValue(`fields.${pricingType.name}`, e.value)}
                      placeholder={pricingType.name} />
                    </div>
                ))}
              </>}

            </div>
          </Fieldset>

          <Fieldset legend="Facilities" className="md:col-12 lg:col-12 mb-3 field-set-facilities" toggleable>
            {assignedFacilitiesByServiceTypeIdWithCategory && assignedFacilitiesByServiceTypeIdWithCategory.length > 0 ? (
              <div className="grid grid-cols-12 gap-4">
                {assignedFacilitiesByServiceTypeIdWithCategory.map((category: any, index: number) => (
                  <div key={index} className="col-span-12 py-2 px-4 border-1 border-gray-300 rounded-md" style={{borderRadius: '15px'}}>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">- {category.categoryName}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.facilities.map((facility: any, _index: number) => (
                        <div key={facility.serviceTypeFacilityId} className="p-2 border-1 border-gray-200 rounded-md" style={{borderRadius: '15px'}}>
                          <h4 className="text-md font-medium">*{facility.name}</h4>
                          <div className="flex items-center mt-2">
                            <label className="mr-2">Primary</label>
                            <InputSwitch
                               className="mr-4"
                               name={`serviceFacilities[${facility.serviceTypeFacilityId}].isPrimary`}
                               checked={Serviceform.values.serviceFacilities?.[facility.serviceTypeFacilityId]?.isPrimary || false}
                               onChange={(e) => {
                                Serviceform.setFieldValue(`serviceFacilities[${facility.serviceTypeFacilityId}].isPrimary`, e.value)
                                Serviceform.setFieldValue(`serviceFacilities[${facility.serviceTypeFacilityId}].serviceTypeFacilityId`, facility.serviceTypeFacilityId);
                                if (e.value) {
                                  Serviceform.setFieldValue(`serviceFacilities[${facility.serviceTypeFacilityId}].isAdditionalCharges`, false);
                                }
                              }}
                            />
                          </div>

                          <div className="flex items-center mt-2">
                            <label className="mr-2">Additional Charges</label>
                            <InputSwitch
                              className="mr-4"
                              name={`serviceFacilities[${facility.serviceTypeFacilityId}].isAdditionalCharges`}
                              checked={Serviceform.values.serviceFacilities?.[facility.serviceTypeFacilityId]?.isAdditionalCharges || false}
                              onChange={(e) => {
                                Serviceform.setFieldValue(`serviceFacilities[${facility.serviceTypeFacilityId}].isAdditionalCharges`, e.value);
                                Serviceform.setFieldValue(`serviceFacilities[${facility.serviceTypeFacilityId}].serviceTypeFacilityId`, facility.serviceTypeFacilityId);
                                if (e.value) {
                                  Serviceform.setFieldValue(`serviceFacilities[${facility.serviceTypeFacilityId}].isPrimary`, false);
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-center text-red-500 text-sm italic">No Data</p>}
          </Fieldset>

          <div className="md:col-12 lg:col-12 mb-8 flex align-items-center justify-content-end">
            <Button rounded icon='pi pi-plus' type="submit" severity="danger" size="small" className="mt-2" label="Add service" onClick={() => Serviceform.handleSubmit()} />
          </div>
        </div>
      </>}

      <ConfirmDialog content={({ headerRef, contentRef, footerRef, hide, message }) => (
        <CustomConfirmDialogContent headerRef={headerRef} message={message} hide={hide} navigate={navigate} resetForm={Serviceform.resetForm} />
      )}/>
    </div>
  );
};
export default FormUseType;
