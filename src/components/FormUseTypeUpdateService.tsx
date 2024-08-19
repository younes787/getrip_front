import { useEffect, useRef, useState } from "react";
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import { Button } from "primereact/button";
import { AddService, GetCitiesbyid, GetCurrency, GetFeildsbysid, GetPlacesbyid, GetResidencebyCottages, GetAllYachts, GetAllPricingTypes, GetAllCountries, GetProvincebyCid, GetAssignedFacilitiesByServiceTypeIdWithCategory, AddCity, AddProvince, GetServiceDetailsById, GetServiceTypes, UpdateService } from "../Services";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { FildsDTO, ServiceDTO, ServiceFacilitiesDTO, Address, TagsDTO, StepsDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { useAuth } from "../AuthContext/AuthContext";
import { FileUpload } from "primereact/fileupload";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Fieldset } from "primereact/fieldset";
import { Tag } from "primereact/tag";
import { Image } from 'primereact/image';
import LoadingComponent from "./Loading";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import GoogleMap from "./GoogleMap";
import { Editor } from "primereact/editor";
import { Timeline } from "primereact/timeline";
import { ProgressBar } from "primereact/progressbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { DataType } from "../enums";

const validationSchema = Yup.object({
  name: Yup.string().required('Service Name is required'),
  description: Yup.string().required('Service Description is required'),
  // files: Yup.mixed().required('Service Image is required'),
  // price: Yup.number().required('Service Price is required').positive('Price must be a positive number'),
  cityId: Yup.number().required('City is required'),
  // placeId: Yup.number().required('Place is required'),
  // newPLaceName: Yup.string(),
  // fields: Yup.object().shape({
  //   someFieldName: Yup.string().required('This field is required')
  // }),
  // images: Yup.object().shape({
  //   files: Yup.string().required('This Image is required')
  // }),
  // tags: Yup.array().of(
  //   Yup.object().shape({
  //     name: Yup.string().required('Tag name is required')
  //   })
  // ),
  currencyId: Yup.number().required('Currency is required'),
});

const FormUseTypeUpdateService = () => {
  const [fileimg, setFileimg] = useState<any>();
  const [FeildsType, setFeildsType] = useState<any>(null);
  const [assignedFacilitiesByServiceTypeIdWithCategory, setAssignedFacilitiesByServiceTypeIdWithCategory] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [places, setPlaces] = useState<any>([]);
  const [steps, setSteps] = useState<StepsDTO[]>([]);
  const [stepsDelagData, setStepsDelagData] = useState<any>(null);
  const [residence, setResidence] = useState();
  const [vehicle, setVehicle] = useState();
  const [currency, setCurrency] = useState();
  const [showResidence, setshowResidence] = useState<boolean>(false);
  const [showPlace, setshowPlace] = useState<boolean>(false);
  const [showVehicle, setshowVehicle] = useState<boolean>(false);
  const [otherPlace, setOtherPlace] = useState<any>();
  const [tags, setTags] = useState([{ name: '' }]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState('');
  const [newTag, setNewTag] = useState<string>('');
  const nonEmptyTags = tags.filter(tag => tag.name.trim() !== '');
  const location = useLocation();
  const [addFrom, setAddFrom] = useState<string>('');
  const [showAddProvincyOrCity, setShowAddProvincyOrCity] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectShowFacilities, setSelectShowFacilities] = useState<{index: string, checked: boolean}[]>([]);
  const [pricingTypes, setPricingTypes] = useState<any>();
  const [provinces, setProvinces] = useState<any>();
  const [countries, setCountries] = useState<any>();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: any } | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<any>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const { serviceType, serviceId } = useParams<{ serviceType: DataType, serviceId: string }>();
  const [serviceInitialValues, setServiceInitialValues] = useState<ServiceDTO>();

  const handleLocationSelect = (location: { lat: number; lng: number; address: any }) => {
    const results = location.address;
    let newCountry = '', newProvince = '', newCity = '';

    for (const component of results[0].address_components) {
      if (component.types.includes('country')) {
        newCountry = component.long_name;
      }

      if (component.types.includes('administrative_area_level_1')) {
        newProvince = component.long_name.replace(/Governorate|state/g, '').trim();
      }

      if (component.types.includes('administrative_area_level_2')) {
        newCity = component.long_name.replace(/Governorate|state/g, '').trim();
      }
    }

    setSelectedLocation(location);
    setCountry(newCountry);
    setProvince(newProvince);
    setCity(newCity);
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      if (country) {
        const countriesRes = await GetAllCountries();
        setCountries(countriesRes.data);

        const foundCountry = findByNameOrId(countriesRes.data, country);
        if (foundCountry) {
          Serviceform.setFieldValue("countryId", foundCountry.id);

          try {
            const provincesRes = await GetProvincebyCid(foundCountry.id);
            setProvinces(provincesRes.data);

            if (province) {
              const foundProvince = findByNameOrId(provincesRes.data, province);
              if (foundProvince) {
                Serviceform.setFieldValue("provincyId", foundProvince.id);

                try {
                  const citiesRes = await GetCitiesbyid(foundProvince.id);
                  setCities(citiesRes.data);

                  if (city) {
                    const foundCity = findByNameOrId(citiesRes.data, city);
                    if (foundCity) {
                      Serviceform.setFieldValue("cityId", foundCity.id);
                    }
                  }
                } catch (error) {
                  console.error("Error fetching cities:", error);
                }
              }
            }
          } catch (error) {
            console.error("Error fetching provinces:", error);
          }
        }
      }
    };

    fetchLocationData();
  }, [country, province, city]);

  const AddNewProvince = async () => {
    try {
      const newProvince = await AddProvince({ name: province, countryId: Serviceform.values.countryId });
      const res = await GetProvincebyCid(newProvince.data.countryId);
      setProvinces(res.data);
    } catch (error) {
      console.error("Error adding province:", error);
    }
  };

  const AddNewCity = async () => {
    try {
      const newCity = await AddCity({ name: city, description: city, provinceId: Serviceform.values.provincyId });
      const res = await GetCitiesbyid(newCity.data.provincyId);
      setCities(res.data);
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  const findByNameOrId = <T extends { id: number; name: string }>(items: T[], nameOrId?: string | number): T | undefined => {
    if (typeof nameOrId === 'string') {
      const searchTerm = nameOrId.toLowerCase().substring(0, 8);
      return items.find(item =>
        item.name.toLowerCase().substring(0, 5) === searchTerm.substring(0, 5)
      );
    } else if (typeof nameOrId === 'number') {
      return items.find(item => item.id === nameOrId);
    }
  };

  const extractLocationDetails = (selectedLocation: any): Address => {
    const lat = selectedLocation.lat;
    const lng = selectedLocation.lng;

    let country = '';
    let province = '';
    let city = '';
    let description = '';

    selectedLocation.address.forEach((addr: any) => {
      addr.address_components.forEach((component: any) => {
        if (component.types.includes('country')) {
          country = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          province = component.long_name;
        }
        if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
          city = component.long_name;
        }
      });
      description += addr.formatted_address + '\n';
    });

    return { lat, lng, country, province, city, description };
  };

  const Serviceform = useFormik<ServiceDTO>({
    initialValues: serviceInitialValues || new ServiceDTO(),
    validationSchema,
    validateOnChange: true,
    onSubmit: (values) => {
      values.typeId?.id === 9 ? Serviceform.values.isYacht = true : Serviceform.values.isYacht = false;
      values.typeId?.id === 12 ? Serviceform.values.isVehicle = true : Serviceform.values.isVehicle = false;
      values.accountId = user?.data?.accountId;
      values.rentalPlaceName !== '' ? Serviceform.values.hasNewRentalPlace = true :Serviceform.values.hasNewRentalPlace = false;
      values.typeId =  Serviceform.values.typeId?.id;
      values.images = { ObjectId: 0, file: fileimg}
      values.steps = steps;

      if (selectedLocation) { values.address = extractLocationDetails(selectedLocation); }

      const formattedFields: FildsDTO[] = Object.keys(values.fields).map((key, index) => ({
        id: index,
        value: JSON.stringify(values.fields[key]),
        serviceTypeFieldId: FeildsType.find((f:any) => f.name === key)?.id || 0,
        serviceId: 0
      })) || [];

      const formattedTags: TagsDTO[] =  values.tags && values.tags.map((tag : any, index :any) => ({
        id: index,
        name: tag.name,
        serviceId: 0
      })) || [];

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
      values.residenceTypeId = 1;

      handleUpdateService();
    },
  });

  const handleUpdateService = async () => {
    try {
      const formData = new FormData();

      const appendToFormData = (key: any, value: any) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      };

      Object.entries(Serviceform.values).forEach(([key, value]) => {
        appendToFormData(key, value);
      });

      appendToFormData('Lat', Serviceform.values.address?.lat);
      appendToFormData('Lng', Serviceform.values.address?.lng);
      appendToFormData('AddressDescription', Serviceform.values.address?.description);
      appendToFormData('AccountId', user?.data?.accountId);
      appendToFormData('CurrencyId', user?.data?.currencyId);

      const imagesArray = fileimg ? Object.values(fileimg) : [];
      imagesArray.forEach((file: any, index) => {
        formData.append(`Images.file`, file);
      });

      formData.append('Id', '0');
      formData.append('Images.ObjectId', '0');

      const addServiceResponse = await UpdateService(formData);
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
        const serviceDetails = await GetServiceDetailsById(Number(serviceId));
        const { data } = serviceDetails;
        Serviceform.setValues(data);
        setServiceInitialValues(data);

        GetServiceTypes().then( async (resType) => {
          const serviceType = resType.data.find((type: any) => type.id === data.typeId);
          Serviceform.setFieldValue("typeId", serviceType);
          Serviceform.setFieldValue("isRental", serviceType.isRental);
          Serviceform.setFieldValue("isTrip", serviceType.isTrip);

          const [feildsTypeRes, vehicleRes] = await Promise.all([
            GetFeildsbysid(serviceType.id),
            GetAllYachts()
          ]);

          setFeildsType(feildsTypeRes.data);
          setVehicle(vehicleRes.data);

          const [getAssignedFacilitiesByServiceTypeIdWithCategoryRes] = await Promise.all([
            GetAssignedFacilitiesByServiceTypeIdWithCategory(serviceType.id),
          ]);

          GetAllPricingTypes().then((res) => {
            const filteredData = res?.data.filter((item: any) => item.serviceTypeId === serviceType.id);
            setPricingTypes(filteredData);
          });

          setAssignedFacilitiesByServiceTypeIdWithCategory(getAssignedFacilitiesByServiceTypeIdWithCategoryRes.data);
        });

        const [currencyRes] = await Promise.all([
          GetCurrency(),
        ]);

        setCurrency(currencyRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if(Serviceform?.values?.cityId) {
      GetPlacesbyid(Serviceform?.values?.cityId).then((res) => {
        setPlaces(res.data);
      });
    }
  }, [Serviceform.values.cityId]);

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

  const handleToggle = (index: string, checked: boolean) => {
    setSelectShowFacilities(prevState => {
      const facilityIndex = prevState.findIndex((facility: any) => facility.index === index);
      if (facilityIndex >= 0) {
        const newState = [...prevState];
        newState[facilityIndex].checked = checked;
        return newState.filter(facility => facility.checked);
      } else {
        return [...prevState, { index, checked }];
      }
    });
  };

  const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
  const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

  const onTemplateSelect = (e: any) => {
      let _totalSize = totalSize;
      let files = e.files;

      Object.keys(files).forEach((key) => {
          _totalSize += files[key].size || 0;
      });

      setFileimg(files);
      setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e: any) => {
      let _totalSize = 0;

      e.files.forEach((file: any) => {
          _totalSize += file.size || 0;
      });

      setTotalSize(_totalSize);
  };

  const onTemplateRemove = (file: any, callback: any) => {
      setTotalSize(totalSize - file.size);
      callback();
  };

  const onTemplateClear = () => {
      setTotalSize(0);
  };

  const headerTemplate = (options: any) => {
      const { className, chooseButton, uploadButton, cancelButton } = options;
      const value = totalSize / 10000;
      const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current?.formatSize(totalSize) : '0 B';

      return (
          <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
              {chooseButton}
              {uploadButton}
              {cancelButton}
              <div className="flex align-items-center gap-3 ml-auto">
                  <span>{formatedValue} / 1 MB</span>
                  <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
              </div>
          </div>
      );
  };

  const itemTemplate = (file: any, props: any) => {
      return (
          <div className="flex align-items-center flex-wrap">
              <div className="flex align-items-center" style={{ width: '40%' }}>
                  <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                  <span className="flex flex-column text-left ml-3">
                      {file.name}
                      <small>{new Date().toLocaleDateString()}</small>
                  </span>
              </div>
              <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
              <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
          </div>
      );
  };

  const emptyTemplate = () => {
      return (
          <div className="flex align-items-center flex-column">
              <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
              <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                  Drag and Drop Image Here
              </span>
          </div>
      );
  };

  const cardFooter = (step: StepsDTO, index: number) => (
    <>
      <Button
        label="Actiivites"
        icon="pi pi-check"
        size="small"
      />

      <Button
        label="remove"
        size="small"
        severity="secondary"
        icon="pi pi-times"
        onClick={() => { setSteps(steps.filter((_, i) => i !== index)); }}
        style={{ marginLeft: '0.5em' }}
      />
    </>
  );

  const customizedMarker = (item: StepsDTO) => {
    return (
        <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" style={{ backgroundColor: '#673AB7' }}>
            <i className={`pi pi-cog`}></i>
        </span>
    );
  };

  const customizedContent = (step: StepsDTO) => {
    const index = steps?.findIndex((_step: StepsDTO) => _step?.name === step?.name);
    return (
        <Card
          subTitle={
            <>
              <p>Departure Time: {new Date(step?.departureTime).toLocaleString()}</p>
              <b>Step Count: {step?.stepCount}</b>
            </>
          }
          title={step?.name}
          key={index}
          footer={() => cardFooter(step, index)}
        >
          <p>{step?.description}</p>
          <p>City: {cities.find((cit:any) => cit.id === step?.cityId)?.name}</p>
          <p>Has New Place: {step?.hasNewPlace ? 'Yes' : 'No'}</p>
          {step?.hasNewPlace && <p>New Place Name: {step?.newPlaceName}</p>}
          <p>Arrival Time: {new Date(step?.arrivalTime).toLocaleString()}</p>
        </Card>
    );
  };

  const handleCountryChange = async (e: any) => {
    Serviceform.setFieldValue("countryId", e.value);
    Serviceform.setFieldValue("provincyId", null);
    Serviceform.setFieldValue("cityId", null);
    const provincesRes = await GetProvincebyCid(e.value);
    setProvinces(provincesRes.data);
    setCities([]);
  };

  const handleProvinceChange = async (e: any) => {
    Serviceform.setFieldValue("provincyId", e.value);
    Serviceform.setFieldValue("cityId", null);
    const citiesRes = await GetCitiesbyid(e.value);
    setCities(citiesRes.data);
  };

  const handleCityChange = (e: any) => {
    Serviceform.setFieldValue("cityId", e.value);
  };

  return (
    <div className="container mx-auto form-user-type">
      {loading ? <LoadingComponent/> : <>
        <div className="grid grid-cols-12 mt-3 mb-5">
          <div className="back md:col-1 lg:col-1 flex justify-content-start align-items-center">
            <Button icon="pi pi-angle-left" label="back" onClick={() => navigate('/add-services')} />
          </div>

          <div className="md:col-11 lg:col-11 getrip-type text-center flex justify-content-center align-items-center">
            {Serviceform?.values?.typeId?.photos &&
              <Image alt={Serviceform?.values?.typeId?.name} zoomSrc={Serviceform?.values?.typeId?.photos[0].imagePath} src={Serviceform?.values?.typeId?.photos[0].imagePath} width="90" height="90" preview />
            }
            <span className="primary mx-2 text-xl antialiased get-rp">{Serviceform?.values?.typeId?.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-12">
          <Fieldset legend="Base Info" className="md:col-12 lg:col-12 mb-3" toggleable collapsed={true}>
            <div className="grid grid-cols-12">
              <div className="md:col-12 lg:col-12">
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

              <div className="md:col-12 lg:col-12">
                <label htmlFor="Wallet">Service Description</label>
                <Editor
                  name="description"
                  headerTemplate={
                    <span className="ql-formats">
                      <Button className="ql-bold"></Button>
                      <Button className="ql-italic"></Button>
                      <Button className="ql-underline"></Button>
                      <Button className="ql-strike"></Button>
                      <Button className="ql-list" value="ordered"></Button>
                      <Button className="ql-list" value="bullet"></Button>
                      <Button className="ql-align" value=""></Button>
                      <Button className="ql-align" value="center"></Button>
                      <Button className="ql-align" value="right"></Button>
                      <Button className="ql-align" value="justify"></Button>
                      <Button className="ql-link"></Button>
                      <Button className="ql-clean"></Button>
                    </span>
                  }
                  value={Serviceform.values.description}
                  autoFocus={focusedField === 'description'}
                  onInput={() => handleInputFocus('description')}
                  onTextChange={(e) => Serviceform.setFieldValue('description', e.textValue)}
                  style={{ height: "220px" }}
                />
                {renderError(Serviceform.errors.description)}
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="Wallet">Service Image</label>
                <FileUpload
                  ref={fileUploadRef}
                  name="images[]"
                  multiple
                  accept="image/*"
                  maxFileSize={1000000}
                  onUpload={onTemplateUpload}
                  onSelect={onTemplateSelect}
                  onError={onTemplateClear}
                  onClear={onTemplateClear}
                  headerTemplate={headerTemplate}
                  itemTemplate={itemTemplate}
                  emptyTemplate={emptyTemplate}
                  chooseOptions={chooseOptions}
                  cancelOptions={cancelOptions}
                  uploadOptions={{ style: { display: 'none' } }}
                />
                {renderError(Serviceform.errors.images)}
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Input Type" className="md:col-12 lg:col-12 mb-3" toggleable  collapsed={true}>
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

          <Fieldset legend="Address" className="md:col-12 lg:col-12 mb-3" toggleable collapsed={true}>
            <div className="grid grid-cols-12">

              <div className="md:col-12 lg:col-12">
                <div>
                  <label className=" primary" htmlFor="">Country</label>
                </div>

                <Dropdown
                  placeholder="Select a Country"
                  options={countries ?? []}
                  optionLabel="name"
                  optionValue="id"
                  name="countryId"
                  filter
                  className="mt-2	w-full"
                  value={Serviceform?.values?.countryId}
                  onChange={handleCountryChange}
                />
              </div>

              <div className="md:col-12 lg:col-12" style={{display: 'contents'}}>
                <div className="md:col-8 lg:col-8">
                  <label className="mb-2" htmlFor="Provinces">Provinces</label>
                  <Dropdown
                    placeholder="Select a Provincy"
                    options={provinces ?? []}
                    optionLabel="name"
                    optionValue="id"
                    name="provincyId"
                    filter
                    className="mt-2	w-full md:col-8 lg:col-8"
                    value={Serviceform?.values?.provincyId}
                    onChange={handleProvinceChange}
                  />
                </div>

                <div className="md:col-4 lg:col-4" style={{ display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                  <Button rounded icon='pi pi-plus' severity="danger" size="small" className="mt-2" label="Add Provincy" onClick={() => {
                    setAddFrom('Provincy')
                    setShowAddProvincyOrCity(true);
                  }} />
                </div>

                <div className="md:col-8 lg:col-8">
                  <label className="mb-2" htmlFor="Cities">Cities</label>
                  <Dropdown
                    placeholder="Select a City"
                    options={cities ?? []}
                    optionLabel="name"
                    optionValue="id"
                    name="cityId"
                    filter
                    className="w-full"
                    value={Serviceform.values.cityId}
                    onChange={handleCityChange}
                  />
                  {renderError(Serviceform.errors.cityId)}
                </div>

                <div className="md:col-4 lg:col-4" style={{ display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                  <Button rounded icon='pi pi-plus' severity="danger" size="small" className="mt-2" label="Add City" onClick={() => {
                    setAddFrom('City')
                    setShowAddProvincyOrCity(true);
                  }} />
                </div>
              </div>

              <div className="md:col-12 lg:col-12">
                <GoogleMap
                  country={
                    (Serviceform.values.countryId && countries && countries.find((er: any) => er.id === Serviceform.values.countryId))
                      ? countries.find((er: any) => er.id === Serviceform.values.countryId).name
                      : undefined
                  }
                  province={
                    (Serviceform.values.provincyId && provinces && provinces.find((er: any) => er.id === Serviceform.values.provincyId))
                      ? provinces.find((er: any) => er.id === Serviceform.values.provincyId).name
                      : undefined
                  }
                  city={
                    (Serviceform.values.cityId && cities && cities.find((er: any) => er.id === Serviceform.values.cityId))
                      ? cities.find((er: any) => er.id === Serviceform.values.cityId).name
                      : undefined
                  }
                  onLocationSelect={handleLocationSelect}
                />
              </div>

              {/* {Serviceform.values.typeId?.name !== "VIP transfers" &&
                Serviceform.values.typeId?.name !== 'Transfers' &&
                Serviceform.values.typeId?.name !== 'transfers' ? (
                <>
                  <Dialog header={"Add Residence"} visible={showResidence} className="md:w-40rem lg:w-40rem" onHide={() => setshowResidence(false)}>
                    <Residence />
                  </Dialog>

                  <Dialog header={"Add Vehicle"} visible={showVehicle} className="md:w-40rem lg:w-40rem" onHide={() => setshowVehicle(false)}>
                    <Vehicle />
                  </Dialog>
                </>
              ) : <></>} */}
            </div>
          </Fieldset>

          <Fieldset legend="Tags" className="md:col-12 lg:col-12 mb-3" toggleable  collapsed={true}>
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

          <Fieldset legend="Price" className="md:col-12 lg:col-12 mb-3" toggleable  collapsed={true}>
            <div className="grid grid-cols-12">
              {pricingTypes && pricingTypes.length > 0 && <>
                {pricingTypes?.map((pricingType: any, index: number) => (
                  <>
                    <div className="md:col-6 lg:col-6 my-2">
                      <label htmlFor={pricingType.name}>{pricingType.name}</label>
                      <InputNumber
                        autoFocus={focusedField === pricingType.name}
                        onInput={() => handleInputFocus(pricingType.name)}
                        value={Serviceform.values.fields?.[pricingType.name]}
                        className="w-full mt-1"
                        onValueChange={(e) => {

                          Serviceform.setFieldValue(`priceValues.${index}.pricingTypeId`, pricingType.id);
                          Serviceform.setFieldValue(`priceValues.${index}.pricingTypeName`, pricingType.name);
                          Serviceform.setFieldValue(`priceValues.${index}.value`, e.value);

                          Serviceform.setFieldValue(`fields.${pricingType.name}`, e.value);
                        }}
                        placeholder={pricingType.name}
                      />
                    </div>

                    <div className="md:col-6 lg:col-6 my-2 flex justify-content-start align-items-center">
                      <InputSwitch
                        className="mx-2"
                        autoFocus={focusedField === `priceValues.${index}.isTaxIncluded`}
                        onInput={() => handleInputFocus(`priceValues.${index}.isTaxIncluded`)}
                        checked={Serviceform.values.priceValues ? Serviceform.values.priceValues[index]?.isTaxIncluded : false}
                        onChange={(e) => Serviceform.setFieldValue(`priceValues.${index}.isTaxIncluded`, e.value)}
                      />
                      <label htmlFor="Wallet mx-2">Tax Included</label>
                    </div>
                  </>
                ))}
              </>}

              <div className="md:col-12 lg:col-12">
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

              <div className="md:col-12 lg:col-12 my-2 flex justify-content-start align-items-center">
                <InputSwitch
                  className="mx-2"
                  autoFocus={focusedField === `isApprovalRequired`}
                  onInput={() => handleInputFocus(`isApprovalRequired`)}
                  checked={Serviceform.values?.isApprovalRequired}
                  onChange={(e) => Serviceform.setFieldValue(`isApprovalRequired`, e.value)}
                />
                <label htmlFor="Wallet mx-2">Approval Required</label>
              </div>
            </div>
          </Fieldset>

          {Serviceform.values.typeId?.isRental  === true &&  Serviceform.values.typeId?.isTrip === false ? (
            <Fieldset legend="Facilities" className="md:col-12 lg:col-12 mb-3 field-set-facilities" toggleable collapsed={true}>
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
                            <h4 className="text-md font-medium flex justify-content-start align-items-center">
                              *{facility.name}
                              <InputSwitch
                                className="mx-2"
                                name={`facility_name_${index}_${_index}`}
                                checked={!!selectShowFacilities.find((fac: any) => fac.index === `${index}_${_index}_${facility.name}`)?.checked}
                                onChange={(e) => handleToggle(`${index}_${_index}_${facility.name}`, e.value)}
                              />
                            </h4>

                            {!!selectShowFacilities.find((fac: any) => fac.index === `${index}_${_index}_${facility.name}`)?.checked && <>
                              <div className="flex items-center mt-2">
                                <label className="mr-2">Primary</label>
                                <InputSwitch
                                  className="mr-4"
                                  name={`serviceFacilities[${facility.serviceTypeFacilityId}].isPrimary`}
                                  checked={Serviceform.values.serviceFacilities?.[facility.serviceTypeFacilityId]?.isPrimary || false}
                                  onChange={(e) => {
                                    Serviceform.setFieldValue(`serviceFacilities[${facility.serviceTypeFacilityId}].isPrimary`, e.value)
                                    Serviceform.setFieldValue(`serviceFacilities[${facility.serviceTypeFacilityId}].serviceTypeFacilityId`, facility.serviceTypeFacilityId);
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
                                  }}
                                />
                              </div>
                            </>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center text-red-500 text-sm italic">No Data</p>}
            </Fieldset>
          ) : Serviceform.values.typeId?.isRental  === false &&  Serviceform.values.typeId?.isTrip === true ? (
            <Fieldset legend="Steps" className="md:col-12 lg:col-12 mb-3 field-set-steps" toggleable collapsed={true}>

              <div className="grid grid-cols-12">
                <div className="md:col-12 lg:col-12 flex justify-content-end align-items-center">
                  <Button rounded icon='pi pi-plus' type="button" severity="secondary" size="small" label="Add step" onClick={() => setShowSteps(true)} />
                </div>

                <div className="md:col-12 lg:col-12">
                  {steps && steps.length > 0 ? (
                    <Timeline
                      value={steps}
                      align="alternate"
                      className="customized-timeline"
                      marker={customizedMarker}
                      content={customizedContent}
                    />

                    // steps.map((step, index) => (
                    //   <div className="md:col-4 lg:col-4">
                    //     <Card title={step?.name} key={index} footer={() => cardFooter(step, index)}>
                          // <p>{step?.description}</p>
                          // <p>City: {cities.find((cit:any) => cit.id === step?.cityId).name}</p>
                          // <p>Step Count: {step?.stepCount}</p>
                          // <p>Place ID: {step?.placeId}</p>
                          // <p>Has New Place: {step?.hasNewPlace ? 'Yes' : 'No'}</p>
                          // {step?.hasNewPlace && <p>New Place Name: {step?.newPlaceName}</p>}
                          // <p>Arrival Time: {new Date(step.arrivalTime).toLocaleString()}</p>
                          // <p>Departure Time: {new Date(step.departureTime).toLocaleString()}</p>
                    //     </Card>
                    //   </div>
                    // ))
                  ) : (
                    <div className="text-center">No steps available</div>
                  )}
                </div>
              </div>
            </Fieldset>
          ) : null}

          <Fieldset legend="Cancelation Policy" className="md:col-12 lg:col-12 mb-3" toggleable collapsed={true}>
            <div className="grid grid-cols-12">
              <div className="md:col-12 lg:col-12 my-2 flex justify-content-start align-items-center">
                <InputSwitch
                  className="mx-2"
                  autoFocus={focusedField === `isRefundable`}
                  onInput={() => handleInputFocus(`isRefundable`)}
                  checked={Serviceform.values?.isRefundable}
                  onChange={(e) => Serviceform.setFieldValue(`isRefundable`, e.value)}
                />
                <label htmlFor="Wallet" className="mx-2">Refundable</label>
              </div>

              <div className="md:col-12 lg:col-12">
                 <label htmlFor="Refund Per Cent Amount" className="mx-2">Refund Per Cent Amount</label>
                <InputNumber
                  autoFocus={focusedField === 'refundPerCentAmount'}
                  onInput={() => handleInputFocus('refundPerCentAmount')}
                  value={Serviceform.values.refundPerCentAmount}
                  className="w-full mt-1"
                  onValueChange={(e) => Serviceform.setFieldValue(`refundPerCentAmount`, e.value)}
                  placeholder={'Refund Per Cent Amount'}
                />
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="Allow Refund Days" className="mx-2">Allow Refund Days</label>
                <InputNumber
                  autoFocus={focusedField === 'allowRefundDays'}
                  onInput={() => handleInputFocus('allowRefundDays')}
                  value={Serviceform.values.allowRefundDays}
                  className="w-full mt-1"
                  onValueChange={(e) => Serviceform.setFieldValue(`allowRefundDays`, e.value)}
                  placeholder={'Allow Refund Days'}
                />
              </div>
            </div>
          </Fieldset>

          <div className="md:col-12 lg:col-12 mb-8 flex align-items-center justify-content-end">
            <Button rounded icon='pi pi-plus' type="submit" severity="danger" size="small" className="mt-2" label="Add service" onClick={() => Serviceform.handleSubmit()} />
          </div>
        </div>
      </>}

      <ConfirmDialog content={({ headerRef, contentRef, footerRef, hide, message }) => (
        <CustomConfirmDialogContent headerRef={headerRef} message={message} hide={hide} navigate={navigate} resetForm={Serviceform.resetForm} />
      )}/>

      <Dialog
        header="Add Step"
        visible={showSteps}
        style={{ width: "50vw", minWidth: '50vw' }}
        footer={<div>
         <Button
            label="Add"
            size="small"
            severity="info"
            outlined
            onClick={() => {
              setSteps(prevState => [ ...prevState, {
                  name: stepsDelagData?.name,
                  description: stepsDelagData?.description,
                  cityId: stepsDelagData?.cityId,
                  stepCount: stepsDelagData?.stepCount,
                  placeId: stepsDelagData?.placeId,
                  serviceId: 0,
                  hasNewPlace: stepsDelagData?.newPlaceName ? true : false,
                  newPlaceName: stepsDelagData?.newPlaceName,
                  arrivalTime: stepsDelagData?.arrivalTime,
                  departureTime: stepsDelagData?.departureTime,
                }
              ]);

              setStepsDelagData(null);
              setShowSteps(false);
            }}
            className="mt-4"
          ></Button>
          <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowSteps(false)} className="mt-4"></Button>
        </div>}
        onHide={() => setShowSteps(false)}
      >
        <div className="grid grid-cols-12">
          <div className="md:col-12 lg:col-12">
            <label className="mb-2" htmlFor="Status">Name</label>
            <InputText
              placeholder="Step name"
              name="stepName"
              className="w-full"
              autoFocus={focusedField === 'stepName'}
              onInput={() => handleInputFocus('stepName')}
              value={stepsDelagData?.name}
              onChange={(e) => setStepsDelagData({...stepsDelagData, name: e.target.value})}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label className="mb-2" htmlFor="Status">Description</label>
            <InputTextarea
              placeholder="step description"
              rows={5}
              cols={30}
              name="stepDescription"
              className="w-full"
              autoFocus={focusedField === 'stepsDescription'}
              onInput={() => handleInputFocus('stepsDescription')}
              value={stepsDelagData?.description}
              onChange={(e) => setStepsDelagData({...stepsDelagData, description: e.target.value})}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label className="mb-2" htmlFor="Country">Country</label>
            <Dropdown
              placeholder="Select a Country"
              options={countries}
              optionLabel="name"
              optionValue="id"
              name="countryId"
              filter
              className="mt-2	w-full"
              value={stepsDelagData?.countryId}
              onChange={async (e) => {
                try {
                  await GetProvincebyCid(e.value).then((res) => setProvinces(res.data));
                  setStepsDelagData({...stepsDelagData, countryId: e.value})
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label className="mb-2" htmlFor="Provinces">Provinces</label>
            <Dropdown
              placeholder="Select a Provincy"
              options={provinces}
              optionLabel="name"
              optionValue="id"
              name="provincyId"
              filter
              className="mt-2	w-full"
              value={stepsDelagData?.provincyId}
              onChange={async (e) => {
                try {
                  await GetCitiesbyid(e.value).then((res) => setCities(res.data));
                  setStepsDelagData({...stepsDelagData, provincyId: e.value})
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label className="mb-2" htmlFor="City">City</label>
            <Dropdown
              placeholder="Select a City"
              options={cities}
              optionLabel="name"
              optionValue="id"
              name="cityId"
              filter
              className="w-full"
              value={stepsDelagData?.cityId}
              onChange={async (e) => {
                try {
                 await GetPlacesbyid(e.value).then((res) => setPlaces(res.data) );
                  setStepsDelagData({...stepsDelagData, cityId: e.value})
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <InputNumber
              placeholder="Step Count"
              name="stepCount"
              className="w-full"
              step={1}
              min={1}
              showButtons
              value={stepsDelagData?.stepCount}
              onChange={(e) => setStepsDelagData({...stepsDelagData, stepCount: e.value})}
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <Calendar
              name="departureTime"
              className='departureTime w-full'
              placeholder='Departure Time'
              value={stepsDelagData?.departureTime}
              onChange={(e) => setStepsDelagData({...stepsDelagData, departureTime: e.value})}
              showIcon={true}
              showTime
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <Calendar
              name="arrivalTime"
              className='arrivalTime w-full'
              placeholder='Arrival Time'
              value={stepsDelagData?.arrivalTime}
              onChange={(e) => setStepsDelagData({...stepsDelagData, arrivalTime: e.value})}
              showIcon={true}
              showTime
            />
          </div>

          <div className="md:col-12 lg:col-12">
            <label className="mb-2" htmlFor="Place">Place Name</label>
            <Dropdown
              placeholder="Select a Place"
              options={[...places, { id: 'other', name: 'other', desciption: 'other'}]}
              optionLabel="name"
              optionValue="id"
              name="placeId"
              filter
              className="w-full"
              tooltip={"If you don't find the place you're looking for, you can add a new place by selecting 'Other'."}
              tooltipOptions={{ event: 'both', position: 'left', showDelay: 100 }}
              value={stepsDelagData?.placeId}
              onChange={(e) => {
                if(e.target.value === 'other') {
                  setOtherPlace(e.target)
                  setshowPlace(true)
                } else {
                  setStepsDelagData({...stepsDelagData, placeId: e.value})
                  GetResidencebyCottages(e.value).then((res) => setResidence(res.data));
                }
              }}
            />
              {renderError(Serviceform.errors.placeId)}
          </div>
        </div>
      </Dialog>

      <Dialog header={"Add Place"} visible={showPlace} className="md:w-40rem lg:w-40rem" onHide={() => setshowPlace(false)}>
        <div className="md:col-12 lg:col-12">
          <label className="mb-2" htmlFor="Status">New Place Name</label>
          <InputText
            placeholder="New Place"
            name="newPlaceName"
            className="w-full"
            autoFocus={focusedField === 'newPlaceName'}
            onInput={() => handleInputFocus('newPlaceName')}
            value={stepsDelagData?.newPlaceName}
            onChange={(e) => setStepsDelagData({...stepsDelagData, newPlaceName: e.target.value})}
          />
        </div>

        <Button rounded icon='pi pi-plus' severity="danger" size="small" className="mt-2" label="Add" onClick={() => setshowPlace(false)} />
      </Dialog>

      <Dialog header={`Add ${addFrom}`} visible={showAddProvincyOrCity} className="md:w-40rem lg:w-40rem" onHide={() => setShowAddProvincyOrCity(false)}>
        <div className="md:col-12 lg:col-12">
          <label className="mb-2" htmlFor={`New ${addFrom}`}>New {addFrom}</label>
          <InputText
            placeholder={`New ${addFrom}`}
            name={`new${addFrom}`}
            className="w-full"
            autoFocus={focusedField === `new${addFrom}`}
            onInput={() => handleInputFocus(`new${addFrom}`)}
            value={addFrom === 'Provincy' ? province as string : city as string}
            onChange={(e) => {
              console.log(addFrom, province, city);
            }}
          />
        </div>

        <Button rounded icon='pi pi-plus' severity="danger" size="small" className="mt-2" label="Add" onClick={() => {
          if(addFrom === 'Provincy') {
            AddNewProvince()
          } else {
            AddNewCity()
          }
          setShowAddProvincyOrCity(false)
        }}
        />
      </Dialog>
    </div>
  );
};

export default FormUseTypeUpdateService;
