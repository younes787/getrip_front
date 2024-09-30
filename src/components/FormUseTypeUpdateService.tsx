import { useEffect, useRef, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { GetCitiesbyid, GetCurrency, GetFeildsbysid, GetPlacesbyid, GetResidencebyCottages, GetAllYachts, GetAllPricingTypes, GetAllCountries, GetProvincebyCid, GetAssignedFacilitiesByServiceTypeIdWithCategory, AddCity, AddProvince, GetServiceDetailsById, GetServiceTypes, UpdateService, UpdateTagsList, UpdateFacility } from "../Services";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { ServiceDTO, Address, StepsDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { useAuth } from "../AuthContext/AuthContext";
import { FileUpload } from "primereact/fileupload";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Fieldset } from "primereact/fieldset";
import { Tag } from "primereact/tag";
import { Image } from 'primereact/image';
import LoadingComponent from "./Loading";
import { ConfirmDialog } from "primereact/confirmdialog";
import GoogleMap from "./GoogleMap";
import { Editor } from "primereact/editor";
import { Timeline } from "primereact/timeline";
import { ProgressBar } from "primereact/progressbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { DataType } from "../enums";

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
  const [tags, setTags] = useState([{ id:0, name: '' }]);
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
  const [serviceInitialValues, setServiceInitialValues] = useState<ServiceDTO>(new ServiceDTO());

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

  const fetchCountries = async () => {
    try {
      const countriesRes = await GetAllCountries();
      return countriesRes.data;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  };

  const fetchProvinces = async (countryId: any) => {
    try {
      const provincesRes = await GetProvincebyCid(countryId);
      return provincesRes.data;
    } catch (error) {
      console.error("Error fetching provinces:", error);
      return [];
    }
  };

  const fetchCities = async (provinceId: any) => {
    try {
      const citiesRes = await GetCitiesbyid(provinceId);
      return citiesRes.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!country) return;

      let shouldUpdateCountry = true;

      const countries = await fetchCountries();
      setCountries(countries);

      const foundCountry = findByNameOrId(countries, country);

      if (foundCountry && foundCountry.id !== serviceInitialValues?.countryId) {
        setServiceInitialValues(prevState => ({
          ...prevState,
          countryId: foundCountry.id
        }));

        shouldUpdateCountry = false;
      }

      if (shouldUpdateCountry && foundCountry) {
        let shouldUpdateProvince = true;

        const provinces = await fetchProvinces(foundCountry.id);
        setProvinces(provinces);

        if (!province) return;

        const foundProvince = findByNameOrId(provinces, province);

        if (foundProvince && foundProvince.id !== serviceInitialValues?.provincyId) {
          setServiceInitialValues(prevState => ({
            ...prevState,
            provincyId: foundProvince.id
          }));

          shouldUpdateProvince = false;
        }

        if (shouldUpdateProvince && foundProvince) {
          let shouldUpdateCity = true;

          const cities = await fetchCities(foundProvince.id);
          setCities(cities);

          if (!city) return;

          const foundCity = findByNameOrId(cities, city);

          if (foundCity && foundCity.id !== serviceInitialValues?.cityId) {
            setServiceInitialValues(prevState => ({
              ...prevState,
              cityId: foundCity.id
            }));

            shouldUpdateCity = false;
          }
        }
      }
    };

    fetchData();
  }, [country, province, city]);

  const AddNewProvince = async () => {
    try {
      const newProvince = await AddProvince({ name: province, countryId: serviceInitialValues?.countryId });
      const res = await GetProvincebyCid(newProvince.data.countryId);
      setProvinces(res.data);
    } catch (error) {
      console.error("Error adding province:", error);
    }
  };

  const AddNewCity = async () => {
    try {
      const newCity = await AddCity({ name: city, description: city, provinceId: serviceInitialValues?.provincyId });
      const res = await GetCitiesbyid(newCity.data.provincyId);
      setCities(res.data);
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  const findByNameOrId = <T extends { id: number; name: string }>(items: T[], nameOrId?: string | number): T | undefined => {
    if (typeof nameOrId === 'string') {
      const searchTerm = nameOrId.toLowerCase().substring(0, 8);
      return items?.find(item =>
        item.name.toLowerCase().substring(0, 5) === searchTerm.substring(0, 5)
      );
    } else if (typeof nameOrId === 'number') {
      return items?.find(item => item.id === nameOrId);
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

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const serviceDetails = await GetServiceDetailsById(Number(serviceId));
        const { data } = serviceDetails;

        setServiceInitialValues({
          // isRental: [8, 9, 12].includes(serviceInitialValues?.typeId.id),
          // isYacht: serviceInitialValues?.typeId.id === 9,
          // isResidence: serviceInitialValues?.typeId.id === 8,
          // isVehicle: serviceInitialValues?.typeId.id === 12,
          // isTrip: [7, 10, 11, 13].includes(serviceInitialValues?.typeId.id),
          // isCruise: serviceInitialValues?.typeId.id === 10,


          id: data.id,
          name: data.name,
          description: data.description,
          typeId: data.typeId,
          cityId: data.cityId,
          countryId: data.countryId,
          provincyId: data.provincyId,
          placeId: data.placeId,
          accountId: data.accountId,
          vehicleTypeId: data.vehicleTypeId,
          residenceTypeId: data.residenceTypeId,
          price: data.price,
          ratingAverage: data.ratingAverage,
          isApprovalRequired: data.isApprovalRequired,
          currencyId: data.currencyId,
          isTrip: data.isTrip,
          photos: data.photos,
          images: data.photos.map((img: any) => img.imagePath),
          address: data.address,
          placeHasNewActivities: data.placeHasNewActivities,
          hasNewRentalPlace: data.hasNewRentalPlace,
          isRental: data.isRental,
          isTaxIncluded: data.isTaxIncluded,
          isActive: data.isActive,
          isArchived: data.isArchived,
          isApproved: data.isApproved,
          isYacht: data.isYacht,
          isCruise: data.isCruise,
          isVehicle: data.isVehicle,
          isResidence: data.isResidence,
          priceValues: data.priceValues,
          rentalPlaceName: data.rentalPlaceName,
          fields: data.fields,
          steps: data.steps,
          stepsActivities: data.stepsActivities,
          placeNewActivities: data.placeNewActivities,
          tags: data.tags,
          serviceFacilities: data.serviceFacilities,
          isRefundable: data.isRefundable,
          refundPerCentAmount: data.refundPerCentAmount,
          allowRefundDays: data.allowRefundDays,
          ChildPercentage: data.ChildPercentage,
        });

        setFileimg(data.photos.map((img: any) => img.imagePath));
        setTags(data.tags);

        GetServiceTypes().then( async (resType) => {
          const serviceType = resType.data.find((type: any) => type.id === data.typeId);
          setServiceInitialValues(prevState => ({
            ...prevState,
            typeId: serviceType,
            isRental: serviceType.isRental,
            isTrip: serviceType.isTrip,
          }));

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
    if(serviceInitialValues?.cityId) {
      GetPlacesbyid(serviceInitialValues?.cityId).then((res) => {
        setPlaces(res.data);
      });
    }
  }, [serviceInitialValues?.cityId]);

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      const updatedTags = [...tags, { id: 0, name: newTag }];
      setTags(updatedTags);
      setNewTag('');

      setServiceInitialValues(prevState => ({...prevState,
        tags: updatedTags
      }));
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);

    setServiceInitialValues(prevState => ({...prevState,
      tags: updatedTags
    }));
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const CustomConfirmDialogContent = ({ headerRef, message, hide, navigate }: any) => {
    return (
      <div className="flex flex-column align-items-center p-5 surface-overlay border-round custom-widht">
        <div className="border-circle bg-green-500 text-white inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
          <i className="pi pi-check-circle text-5xl"></i>
        </div>
        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>{message.header}</span>
        <p className="mb-0">{message.message}</p>
        <div className="grid align-items-center gap-3 mt-4" >
          <Button label="Continue adding services" onClick={(event) => { hide(event) }} className="w-full bg-green-500 border-green-500"></Button>
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
    setServiceInitialValues(prevState => ({
      ...prevState,
      countryId: e.value,
      provincyId: 0,
      cityId: 0,
    }));

    const provincesRes = await GetProvincebyCid(e.value);
    setProvinces(provincesRes.data);
    setCities([]);
  };

  const handleProvinceChange = async (e: any) => {
    setServiceInitialValues(prevState => ({
      ...prevState,
      provincyId: e.value,
      cityId: 0,
    }));

    const citiesRes = await GetCitiesbyid(e.value);
    setCities(citiesRes.data);
  };

  const handleCityChange = (e: any) => {
    setServiceInitialValues(prevState => ({
      ...prevState,
      cityId: e.value,
    }));
  };

  const updateBaseInfo = () => {
    // UpdateService(ServicesData: any)
  };

  const updateInputType = () => {
    // UpdateInputType(InputTypeData: any)
  };

  const updateTags = () => {
    // UpdateTagsList(tagsData: any)
  };

  const updatePrice = () => {
    // UpdatePrice(PriceData: any)
  };

  const updateFacilities = () => {
    // UpdateFacility(FacilityData: any)
  };

  const updateSteps = () => {
    // UpdateSteps(StepsData: any)
  };

  console.log(
    assignedFacilitiesByServiceTypeIdWithCategory
    ,selectShowFacilities
  );

  return (
    <div className="container mx-auto form-user-type">
      {loading ? <LoadingComponent/> : <>
        <div className="grid grid-cols-12 mt-3 mb-5">
          <div className="back md:col-1 lg:col-1 flex justify-content-start align-items-center">
            <Button icon="pi pi-angle-left" label="back" onClick={() => navigate('/add-services')} />
          </div>

          <div className="md:col-11 lg:col-11 getrip-type text-center flex justify-content-center align-items-center">
            {serviceInitialValues?.typeId?.photos &&
              <Image alt={serviceInitialValues?.typeId?.name} zoomSrc={serviceInitialValues?.typeId?.photos[0].imagePath} src={serviceInitialValues?.typeId?.photos[0].imagePath} width="90" height="90" preview />
            }
            <span className="primary mx-2 text-xl antialiased get-rp">{serviceInitialValues?.typeId?.name}</span>
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
                  value={serviceInitialValues?.name}
                  autoFocus={focusedField === 'name'}
                  onInput={() => handleInputFocus('name')}
                  onChange={(e) => {
                    setServiceInitialValues(prevState => ({
                      ...prevState,
                      name: e.target.value
                    }));
                  }}
                />
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
                  value={serviceInitialValues?.description ?? ''}
                  autoFocus={focusedField === 'description'}
                  onInput={() => handleInputFocus('description')}
                  onTextChange={(e) => {
                    setServiceInitialValues(prevState => ({
                      ...prevState,
                      description: e.textValue
                    }));
                  }}
                  style={{ height: "220px" }}
                />
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
              </div>

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
                  value={serviceInitialValues?.countryId}
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
                    value={serviceInitialValues?.provincyId}
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
                    value={serviceInitialValues?.cityId}
                    onChange={handleCityChange}
                  />
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
                    (serviceInitialValues?.countryId && countries && countries.find((er: any) => er.id === serviceInitialValues?.countryId))
                      ? countries.find((er: any) => er.id === serviceInitialValues?.countryId).name
                      : undefined
                  }
                  province={
                    (serviceInitialValues?.provincyId && provinces && provinces.find((er: any) => er.id === serviceInitialValues?.provincyId))
                      ? provinces.find((er: any) => er.id === serviceInitialValues?.provincyId).name
                      : undefined
                  }
                  city={
                    (serviceInitialValues?.cityId && cities && cities.find((er: any) => er.id === serviceInitialValues?.cityId))
                      ? cities.find((er: any) => er.id === serviceInitialValues?.cityId).name
                      : undefined
                  }
                  onLocationSelect={handleLocationSelect}
                />
              </div>

              <div className="md:col-12 lg:col-12 my-2 flex justify-content-start align-items-center">
                <InputSwitch
                  className="mx-2"
                  autoFocus={focusedField === `isRefundable`}
                  onInput={() => handleInputFocus(`isRefundable`)}
                  checked={serviceInitialValues?.isRefundable}
                  onChange={(e) => {
                    setServiceInitialValues(prevState => ({
                      ...prevState,
                      isRefundable: e.value
                    }));
                  }}
                />
                <label htmlFor="Wallet" className="mx-2">Refundable</label>
              </div>

              <div className="md:col-12 lg:col-12">
                 <label htmlFor="Refund Per Cent Amount" className="mx-2">Refund Per Cent Amount</label>
                <InputNumber
                  autoFocus={focusedField === 'refundPerCentAmount'}
                  onInput={() => handleInputFocus('refundPerCentAmount')}
                  value={serviceInitialValues?.refundPerCentAmount}
                  className="w-full mt-1"
                  onValueChange={(e) => {
                    setServiceInitialValues(prevState => ({
                      ...prevState,
                      refundPerCentAmount: e.value as number
                    }));
                  }}
                  placeholder={'Refund Per Cent Amount'}
                />
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="Allow Refund Days" className="mx-2">Allow Refund Days</label>
                <InputNumber
                  autoFocus={focusedField === 'allowRefundDays'}
                  onInput={() => handleInputFocus('allowRefundDays')}
                  value={serviceInitialValues?.allowRefundDays}
                  className="w-full mt-1"
                  onValueChange={(e) => {
                    setServiceInitialValues(prevState => ({
                      ...prevState,
                      allowRefundDays: e.value  as number
                    }));
                  }}
                  placeholder={'Allow Refund Days'}
                />
              </div>

              <div className="md:col-12 lg:col-12 flex align-items-center justify-content-end">
                <Button rounded icon='pi pi-plus' type="submit" severity="danger" size="small" className="mt-2" label="Update Base Info" onClick={updateBaseInfo} />
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Input Type" className="md:col-12 lg:col-12 mb-3" toggleable collapsed={true}>
            {FeildsType && FeildsType.length > 0 ?
              <div className="grid grid-cols-12">
                {FeildsType?.map((f: any, index: number) => (
                  <div key={f.name} className="md:col-6 lg:col-6">
                    <label className="mb-2 block" htmlFor={f.name}>{f.name}</label>

                    {f.fieldTypeName === 'Bool' && (
                      <InputSwitch
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        checked={serviceInitialValues?.fields?.[f.name]}
                        onChange={(e) => {
                          setServiceInitialValues(prevState => ({
                            ...prevState,
                            fields: {
                              ...(prevState.fields || {}),
                              [f.name]: e.value
                            }
                          }));
                        }}
                      />
                    )}
                    {f.fieldTypeName === 'Number' && (
                      <InputNumber
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        value={serviceInitialValues?.fields?.[f.name]}
                        onValueChange={(e) => {
                          setServiceInitialValues(prevState => ({
                            ...prevState,
                            fields: {
                              ...(prevState.fields || {}),
                              [f.name]: e.value
                            }
                          }));

                        }}
                        placeholder={f.name} />
                    )}
                    {f.fieldTypeName === 'Date' && (
                      <Calendar
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        value={serviceInitialValues?.fields?.[f.name]}
                        onChange={(e) => {
                          setServiceInitialValues(prevState => ({
                            ...prevState,
                            fields: {
                              ...(prevState.fields || {}),
                              [f.name]: e.value
                            }
                          }));
                        }}
                        placeholder={f.name} />
                    )}
                    {f.fieldTypeName === 'Text' && (
                      <InputText
                        value={serviceInitialValues?.fields?.[f.name]}
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        onChange={(e) => {
                          setServiceInitialValues(prevState => ({
                            ...prevState,
                            fields: {
                              ...(prevState.fields || {}),
                              [f.name]: e.target.value
                            }
                          }));
                        }}
                        placeholder={f.name} />
                    )}
                  </div>
                ))}

                <div className="md:col-12 lg:col-12 flex align-items-center justify-content-end">
                  <Button rounded icon='pi pi-plus' type="submit" severity="danger" size="small" className="mt-2" label="Update Input Type" onClick={updateInputType} />
                </div>
              </div>
              : <p className="text-center text-red-500 text-sm italic">No Data</p>}
          </Fieldset>

          <Fieldset legend="Tags" className="md:col-12 lg:col-12 mb-3" toggleable collapsed={true}>
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
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button
                  icon="pi pi-plus"
                  label="Add Tag"
                  onClick={handleAddTag}
                  rounded
                  severity="info"
                  size="small"
                  className="mt-2 col-span-12"
                />
              </div>

              <div className="md:col-12 lg:col-12 flex align-items-center justify-content-end">
                <Button rounded icon='pi pi-plus' type="submit" severity="danger" size="small" className="mt-2" label="Update Tags" onClick={updateTags} />
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Price" className="md:col-12 lg:col-12 mb-3" toggleable collapsed={true}>
            <div className="grid grid-cols-12">
              {pricingTypes && pricingTypes.length > 0 && <>
                {pricingTypes?.map((pricingType: any, index: number) => (
                  <>
                    <div className="md:col-6 lg:col-6 my-2">
                      <label htmlFor={pricingType.name}>{pricingType.name}</label>
                      <InputNumber
                        autoFocus={focusedField === pricingType.name}
                        onInput={() => handleInputFocus(pricingType.name)}
                        value={serviceInitialValues?.fields?.[pricingType.name]}
                        className="w-full mt-1"
                        onValueChange={(e) => {
                          setServiceInitialValues(prevState => {
                            const updatedPriceValues = [...(prevState.priceValues || [])];
                            updatedPriceValues[index] = {
                              ...updatedPriceValues[index],
                              pricingTypeId: pricingType.id,
                              pricingTypeName: pricingType.name,
                              value: e.value
                            };

                            return {
                              ...prevState,
                              priceValues: updatedPriceValues,
                              fields: {
                                ...(prevState.fields || {}),
                                [pricingType.name]: e.value
                              }
                            };
                          });
                        }}
                        placeholder={pricingType.name}
                      />
                    </div>

                    <div className="md:col-6 lg:col-6 my-2 flex justify-content-start align-items-center">
                      <InputSwitch
                        className="mx-2"
                        autoFocus={focusedField === `priceValues.${index}.isTaxIncluded`}
                        onInput={() => handleInputFocus(`priceValues.${index}.isTaxIncluded`)}
                        checked={serviceInitialValues?.priceValues ? serviceInitialValues?.priceValues[index]?.isTaxIncluded : false}
                        onChange={(e) => {
                          setServiceInitialValues(prevState => ({
                            ...prevState,
                            priceValues: prevState.priceValues.map((priceValue, i) =>
                              i === index
                                ? { ...priceValue, isTaxIncluded: e.value }
                                : priceValue
                            )
                          }));
                        }}
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
                  onChange={(e) => {
                    setServiceInitialValues(prevState => ({
                      ...prevState,
                      currencyId: user.data.currencyId
                    }));
                  }}
                />
              </div>

              <div className="md:col-12 lg:col-12 my-2 flex justify-content-start align-items-center">
                <InputSwitch
                  className="mx-2"
                  autoFocus={focusedField === `isApprovalRequired`}
                  onInput={() => handleInputFocus(`isApprovalRequired`)}
                  checked={serviceInitialValues?.isApprovalRequired}
                  onChange={(e) => {
                    setServiceInitialValues(prevState => ({
                      ...prevState,
                      isApprovalRequired: e.value
                    }));
                  }}
                />
                <label htmlFor="Wallet mx-2">Approval Required</label>
              </div>

              <div className="md:col-12 lg:col-12">
                <label htmlFor="Child price percentage" className="mx-2">Child price percentage</label>
                <InputNumber
                  autoFocus={focusedField === 'ChildPercentage'}
                  onInput={() => handleInputFocus('ChildPercentage')}
                  value={serviceInitialValues?.ChildPercentage}
                  className="w-full mt-1"
                  onValueChange={(e) => {
                    setServiceInitialValues(prevState => ({
                      ...prevState,
                      ChildPercentage: e.value as number
                    }));
                  }}
                  placeholder={'Child price percentage'}
                />
              </div>

              <div className="md:col-12 lg:col-12 flex align-items-center justify-content-end">
                <Button rounded icon='pi pi-plus' type="submit" severity="danger" size="small" className="mt-2" label="Update Price" onClick={updatePrice} />
              </div>
            </div>
          </Fieldset>

          {serviceInitialValues?.typeId?.isRental  === true &&  serviceInitialValues?.typeId?.isTrip === false ? (
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
                                  checked={serviceInitialValues?.serviceFacilities?.[facility.serviceTypeFacilityId]?.isPrimary || false}
                                  onChange={(e) => {
                                    setServiceInitialValues((prevState: ServiceDTO) => ({
                                      ...prevState,
                                      serviceFacilities: prevState?.serviceFacilities?.map(facility => ({
                                              ...facility,
                                              isPrimary: e.value,
                                              serviceTypeFacilityId: facility.serviceTypeFacilityId
                                            })
                                      )
                                    }));
                                  }}
                                />
                              </div>

                              <div className="flex items-center mt-2">
                                <label className="mr-2">Additional Charges</label>
                                <InputSwitch
                                  className="mr-4"
                                  name={`serviceFacilities[${facility.serviceTypeFacilityId}].isAdditionalCharges`}
                                  checked={serviceInitialValues?.serviceFacilities?.[facility.serviceTypeFacilityId]?.isAdditionalCharges || false}
                                  onChange={(e) => {
                                    setServiceInitialValues((prevState: ServiceDTO) => ({
                                      ...prevState,
                                      serviceFacilities: prevState?.serviceFacilities?.map(facility => ({
                                              ...facility,
                                              isAdditionalCharges: e.value,
                                              serviceTypeFacilityId: facility.serviceTypeFacilityId
                                            })
                                      )
                                    }));
                                  }}
                                />
                              </div>
                            </>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="md:col-12 lg:col-12 flex align-items-center justify-content-end">
                    <Button rounded icon='pi pi-plus' type="submit" severity="danger" size="small" className="mt-2" label="Update Facilities" onClick={updateFacilities} />
                  </div>
                </div>
              ) : <p className="text-center text-red-500 text-sm italic">No Data</p>}
            </Fieldset>
          ) : serviceInitialValues?.typeId?.isRental  === false &&  serviceInitialValues?.typeId?.isTrip === true ? (
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
                  ) : (
                    <div className="text-center">No steps available</div>
                  )}
                </div>

                <div className="md:col-12 lg:col-12 flex align-items-center justify-content-end">
                  <Button rounded icon='pi pi-plus' type="submit" severity="danger" size="small" className="mt-2" label="Update Steps" onClick={updateSteps} />
                </div>
              </div>
            </Fieldset>
          ) : null}
        </div>
      </>}

      <ConfirmDialog content={({ headerRef, contentRef, footerRef, hide, message }) => (
        <CustomConfirmDialogContent headerRef={headerRef} message={message} hide={hide} navigate={navigate} />
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
