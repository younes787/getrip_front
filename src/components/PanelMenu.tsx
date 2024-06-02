import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { AddImageToService, AddService, GetAllCities, GetServiceTypes, GetCurrency, GetFeildsbysid, GetPlacesbyid, GetResidencebyCottages, GetAllYachts} from "../Services";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import Vehicle from "../pages/Vehicle";
import Residence from "../pages/Residencemain";
import { InputSwitch } from "primereact/inputswitch";
import { useFormik } from "formik";
import { FildsDTO, ImageDTO, ServiceDTO, TagsDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { useAuth } from "../AuthContext/AuthContext";
import { FileUpload } from "primereact/fileupload";
import { useNavigate } from "react-router-dom";
import { MegaMenu } from "primereact/megamenu";
import { Fieldset } from "primereact/fieldset";
import { Tag } from "primereact/tag";

const Panel = ({ onPassServiceData }: any) => {
  const [fileimg, setFileimg] = useState<any>();
  const [serviceType, setServiceType] = useState<any[]>([]);
  const [FeildsType, setFeildsType] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [places, setPlaces] = useState();
  const [residence, setResidence] = useState();
  const [vehicle, setVehicle] = useState();
  const [showResidence, setshowResidence] = useState<boolean>(false);
  const [showPlace, setshowPlace] = useState<boolean>(false);
  const [showVehicle, setshowVehicle] = useState<boolean>(false);
  const [currency, setCurrency] = useState();
  const [tags, setTags] = useState([{ name: '' }]);
  const { user } = useAuth();
  const handleImgChange = (e: any) => { setFileimg(e.files?.[0]); };
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [newTag, setNewTag] = useState<string>('');
  const nonEmptyTags = tags.filter(tag => tag.name.trim() !== '');

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
    validateOnChange: true,
    onSubmit: (values) => {
      console.log(values);

      Serviceform.values.isRental = true
      Serviceform.values.typeId?.id === 9 ? Serviceform.values.isYacht = true : Serviceform.values.isYacht = false
      Serviceform.values.typeId?.id === 12 ? Serviceform.values.isVehicle = true : Serviceform.values.isVehicle = false
      Serviceform.values.accountId = user?.data?.accountId
      Serviceform.values.rentalPlaceName !== '' ? Serviceform.values.hasNewRentalPlace = true :Serviceform.values.hasNewRentalPlace = false;

      const formattedFields: FildsDTO[] = Object.keys(values.fields).map((key, index) => ({
        id: index,
        value: JSON.stringify(values.fields[key]),
        serviceTypeFieldId: FeildsType.find((f:any) => f.name === key)?.id || 0,
        serviceId: Serviceform.values.typeId?.id || 0
      }));

      const formattedTags: TagsDTO[] =  values.tags && values.tags.map((tag : any, index :any) => ({
        id: index,
        name: tag.name,
        serviceId: Serviceform.values.typeId?.id
      }));

      values.tags = formattedTags;
      values.fields = formattedFields;
      Serviceform.values.residenceTypeId = 1;
      handleAddService();
    },
  });

  const handleAddService = async () => {
    try {
      const addServiceResponse = await AddService(Serviceform.values);
      if (addServiceResponse.isSuccess) {
        onPassServiceData(addServiceResponse.data)
        navigate('/profile');
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
    GetServiceTypes().then((res) => setServiceType(res?.data));
    GetAllCities().then((res) => setCities(res.data));
    GetCurrency().then((res) => setCurrency(res.data));
  }, []);

  const handleChange = (e: any) => {
    Serviceform.setFieldValue("typeId", e);
    GetFeildsbysid(e.id).then((res) => setFeildsType(res.data));
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

  const Component = () => {
    return (
      <div>
        <h2 className="primary">{Serviceform.values?.typeId?.name ?? ''}</h2>
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
                  onChange={(e) =>  Serviceform.setFieldValue('name', e.target.value)}
                />
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
                  onChange={(e) => Serviceform.setFieldValue('description', e.target.value)}
                />
              </div>

              <div className="md:col-6 lg:col-6">
                <label htmlFor="Wallet">Service Price</label>
                <InputNumber
                  placeholder="Price"
                  name="price"
                  className="w-full mt-1"
                  value={Serviceform.values.price}
                  autoFocus={focusedField === 'price'}
                  onInput={() => handleInputFocus('price')}
                  onChange={(e) => Serviceform.setFieldValue('price', e.value )}
                />
              </div>

              <div className="md:col-6 lg:col-6">
                <label htmlFor="Wallet">Service Currency</label>
                <Dropdown
                  placeholder="Select a currency"
                  options={currency}
                  optionLabel="name"
                  optionValue="id"
                  className="w-full mt-1"
                  filter
                  value={Serviceform.values.currencyId}
                  onChange={(e) => Serviceform.setFieldValue('currencyId', e.value )}
                />
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
                    uploadOptions={{style: { display: 'none'}}}
                    cancelOptions={{
                      icon: "pi pi-fw pi-times",
                      iconOnly: true,
                      className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
                    }}
                    customUpload
                    uploadHandler={() => ImageServiceform.handleSubmit()}
                  />
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Input Type" className="md:col-12 lg:col-12 mb-3" toggleable>
            <div className="grid grid-cols-12">
                {FeildsType?.map((f: any, index: number) => (
                  <div key={f.name} className="md:col-6 lg:col-6">
                    <label className="mb-2 block" htmlFor={f.name}>{f.name}</label>

                    {f.fieldTypeName === 'Bool' && (
                      <InputSwitch
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        checked={Serviceform.values.fields?.[f.name]}
                        onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)}
                      />
                    )}
                    {f.fieldTypeName === 'Number' && (
                      <InputNumber
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        value={Serviceform.values.fields?.[f.name]}
                        onValueChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)}
                        placeholder={f.name}
                      />
                    )}
                    {f.fieldTypeName === 'Date' && (
                      <Calendar
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        value={Serviceform.values.fields?.[f.name]}
                        onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.value)}
                        placeholder={f.name}
                      />
                    )}
                    {f.fieldTypeName === 'Text' && (
                      <InputText
                        value={Serviceform.values.fields?.[f.name]}
                        autoFocus={focusedField === f.name}
                        onInput={() => handleInputFocus(f.name)}
                        onChange={(e) => Serviceform.setFieldValue(`fields.${f.name}`, e.target.value)}
                        placeholder={f.name}
                      />
                    )}
                  </div>
                  ))
                }
            </div>
          </Fieldset>

          <Fieldset legend="Address" className="md:col-12 lg:col-12 mb-3" toggleable>
            <div className="grid grid-cols-12">

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
                      onChange={(e) => handleCityChange(e)}
                    />
              </div>

              {Serviceform.values.typeId?.name !== "VIP transfers" ? (
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
                      value={Serviceform.values.placeId}
                      onChange={(e) => handlePlaceChange(e)} />
                  </div>

                  {Serviceform.values.typeId && Serviceform.values.placeId && (
                    <div className="md:col-6 lg:col-6">
                      <label className="mb-2" htmlFor="Status">{" "}Residence Name{" "}</label>
                      <Dropdown
                        placeholder="Select a Residence"
                        options={residence}
                        optionLabel="name"
                        optionValue="id"
                        name="residenceTypeId"
                        filter
                        className="w-full"
                        value={Serviceform.values.residenceTypeId}
                        onChange={(e) => Serviceform.setFieldValue("cityId", e.value)} />
                    </div>
                   )}

                  <div className="md:col-6 lg:col-6">
                      <label className="mb-2" htmlFor="Status">{" "}Vehicle Name{" "}</label>
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

                    <div className="md:col-12 lg:col-12 mt-2 p-0">
                      <Button icon="pi pi-plus" label="Add Residence" onClick={() => setshowResidence(true)} rounded severity="info" size="small" className="m-2"/>
                      <Button icon="pi pi-plus" label="Add Place" onClick={() => setshowPlace(true)} rounded severity="info" size="small" className="m-2"/>
                      <Button icon="pi pi-plus" label="Add Vehicle" onClick={() => setshowVehicle(true)} rounded severity="info" size="small" className="m-2"/>
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
                      </div>
                    </Dialog>

                    <Dialog header={"Add Vehicle"} visible={showVehicle} className="md:w-40rem lg:w-40rem" onHide={() => setshowVehicle(false)}>
                      <Vehicle />
                    </Dialog>

                    </>
              ): <></>}
              </div>
          </Fieldset>

          <Fieldset legend="Tags" className="md:col-12 lg:col-12 mb-3" toggleable>
            <div className="grid grid-cols-12">
              {nonEmptyTags.length > 0 && (
                <div className="md:col-12 lg:col-12">
                  {nonEmptyTags.map((tag, index) => (
                    <Tag key={index} severity="info" value={tag.name} className="m-1 cursor-pointer" icon="pi pi-times"  onClick={() => handleRemoveTag(index)}/>
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
            </div>
          </Fieldset>

          <div className="md:col-12 lg:col-12">
            <Button rounded icon='pi pi-plus' severity="danger" size="small" className="mt-2" label="Add service"  onClick={() => {
                Serviceform.values.typeId =  Serviceform.values.typeId?.id
                Serviceform.handleSubmit()
            }}/>
          </div>
        </div>
      </div>
    );
  }

  const items: any = [];
  serviceType.map((fn) => {
    items.push({
        label: fn.name,
        style: activeStep === fn.id ? { backgroundColor: '#FA7070'} : {},
        command: () => {
          handleChange(fn)
          setActiveStep(fn.id)
        }
    })
  })

  return (
    <>
      <div className="grid gap-2 grid-cols-12 m-auto m-panel">
          <div className="md:col-2 lg:col-2">
            <MegaMenu model={items} orientation="vertical" breakpoint="960px" style={{backgroundColor: '#EE4E4E'}}/>
          </div>

          <div className="md:col-7 lg:col-7"><Component /></div>
      </div>
    </>
  );
};

export default Panel;
