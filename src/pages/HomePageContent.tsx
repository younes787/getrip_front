import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { AddHomePageRow, AddImageTorRow, DeleteRow, GetHomePageRows, GetServiceTypes, UpdateHomePageRow } from "../Services";
import { useFormik } from "formik";
import { HomePageRowDTO } from "../modules/getrip.modules";
import { InputNumber } from "primereact/inputnumber";
import LoadingComponent from "../components/Loading";
import { FilterMatchMode } from "primereact/api";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { RadioButton } from "primereact/radiobutton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faMapLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { DataType } from "../enums";
import { Image } from "primereact/image";

const HomePageContent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [homePageRows, setHomePageRows] = useState<HomePageRowDTO[]>([]);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);
  const [fileImgs, setFileImgs] = useState<any[]>([]);
  const [serviceType, setServiceType] = useState<any>();
  const [syncServiceType, setShowSyncServiceType] = useState<boolean>(false);
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<any>(null);
  const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
  const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    price: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    apiKey: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    apiUrl: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    name: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
  });

  const [formValues, setFormValues] = useState<any>({
    isSlider: false,
    filterByProvinceId: false,
    filterByCityId: false,
    isService: false,
    isPlace: false,
    isActivity: false,
    isAd: false,
    isOnlyImage: false,
    isBanner: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [serviceTypes, homePageRows] = await Promise.all([
          GetServiceTypes(),
          GetHomePageRows()
        ]);

        setServiceType(serviceTypes.data);
        setHomePageRows([...homePageRows.data].sort((a, b) => a.placement - b.placement));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteRow = (rowId: number) => {
    setLoading(true);

    DeleteRow(rowId)
    .then((res) => {
      setLoading(false)
    }).catch((error) => {
      setLoading(false);
    });
  }

  const useHomePageRowsForm = (setShowAdd: (show: boolean) => void, fileimg: any[]) => {
    return useFormik<HomePageRowDTO>({
      initialValues: new HomePageRowDTO(),
      validateOnChange: true,
      onSubmit: async (values) => {
        const sanitizedValues = sanitizeFormValues({ ...values, ...formValues });

        try {
          sanitizedValues.serviceTypeId = selectedServiceTypeId;

          const res = await AddHomePageRow(sanitizedValues);

          if (res.isSuccess && (formValues.isAd || formValues.isOnlyImage || formValues.isBanner)) {
            await Promise.all(
              fileImgs.map(_file =>
                AddImageTorRow({
                  ObjectId: res.data.id,
                  file: _file
                })
              )
            );
          }

          setShowAdd(false);
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      },
    });
  };

  const homePageRowsForm = useHomePageRowsForm(setShowAdd, fileImgs);

  const homePageRowsFormEdit = useFormik<HomePageRowDTO>({
    initialValues: new HomePageRowDTO(),
    validateOnChange: true,
    onSubmit: () => {
      const sanitizedValues = sanitizeFormValues({ ...homePageRowsFormEdit.values, ...formValues });

      UpdateHomePageRow(sanitizedValues);
      setShowEdit(false);
    },
  });

  const sanitizeFormValues = (values: HomePageRowDTO): HomePageRowDTO => {
    const defaultValues: Partial<HomePageRowDTO> = {
      title: '',
      description: '',
      placement: 0,
      columnsCount: 0,
      itemsCount: 0,
      isSlider: false,
      isService: false,
      filterByProvinceId: false,
      filterByCityId: false,
      isPlace: false,
      isActivity: false,
      isAd: false,
      isOnlyImage: false,
      serviceTypeId: 0,
      cityId: 0,
      provinceId: 0,
      isBanner: false,
    };

    return { ...defaultValues, ...values };
  };

  const BodyTemplate = (rowData: any) => {
    return (
      <div className="gap-3">
        <i className="pi pi-bold pi-pencil" onClick={() => dialogEdit(rowData)  } style={{fontSize: "1.2rem", color: "slateblue", padding: "7px", cursor: "pointer"}}></i>
        <i className="pi pi-bold pi-trash" onClick={() => deleteRow(rowData.id) } style={{fontSize: "1.2rem", color: "red", padding: "7px", cursor: "pointer"}}></i>
      </div>
    );
  };

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const onTemplateSelect = (e: any) => {
      let _totalSize = totalSize;
      let files = e.files;

      Object.keys(files).forEach((key) => {
          _totalSize += files[key].size || 0;
      });

      setFileImgs(prevFiles => [...prevFiles, ...files]);
      setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e: any) => {
      let _totalSize = 0;

      e.files.forEach((file: any) => {
          _totalSize += file.size || 0;
      });

      setTotalSize(_totalSize);
  };

  const onTemplateRemove = (file: any, callback?: () => void) => {
      setTotalSize(totalSize - file.size);
      setFileImgs(fileImgs.filter((img) => img !== file));
      if (typeof callback === 'function') {
        callback();
      }
  };

  const onTemplateClear = () => {
      setTotalSize(0);
      setFileImgs([]);
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

  const showIcons = (check: any) => (
    <>{check ?
      <i className="pi pi-check" style={{color: 'green', border: '1px solid green', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i> :
      <i className="pi pi-times" style={{color: 'red', border: '1px solid red', fontSize: '14px', borderRadius: '50%', padding: '5px', margin: '2px'}}></i>
    }</>
  );

  const handleChange = (name: string) => (checked: boolean) => {
    setFormValues((prev: any) => {
      const newValues = { ...prev, [name]: checked };

      if (name === 'isService' || name === 'isPlace' || name === 'isActivity' || name === 'isAd' || name === 'isOnlyImage' || name === 'isBanner') {
        newValues.isService   = name === 'isService'   ? checked : false;
        newValues.isPlace     = name === 'isPlace'     ? checked : false;
        newValues.isActivity  = name === 'isActivity'  ? checked : false;
        newValues.isAd        = name === 'isAd'        ? checked : false;
        newValues.isOnlyImage = name === 'isOnlyImage' ? checked : false;
        newValues.isBanner    = name === 'isBanner'    ? checked : false;
      }

      return newValues;
    });
  };

  const renderImage = (image: string) => {
    return <Image src={image} alt="Product" style={{width: '100%', padding: '0 10px'}} imageStyle={{ width: '95%', height: '100%'}} />;
  };

  const renderServices = (service: any) => {
    return <Card
                title={service.name}
                subTitle={<span><FontAwesomeIcon icon={faMapLocationDot} size="sm" style={{ color: 'rgb(102 101 101)' }} className="mr-2" />{service.description}</span>}
                header={ <Image  src={service?.photos[0]?.imagePath && service?.photos[0]?.imagePath } imageStyle={{borderRadius: '30px 30px 0 0'}} alt={service.photos}  preview />}
                className="md:w-21rem m-2 m-home-card relative"
              >
              <div className="grid mb-3">
                <div className="col-8">
                  <p className="my-1" style={{ color: '#f1881f', fontWeight: '550'}}><FontAwesomeIcon icon={faStar} size="sm" className="mr-1" /> 9.0/10</p>
                  <p className="my-1" style={{fontSize: '14px'}}>(900 REVIEWS)</p>
                </div>

                <div className="col-4">
                  <p style={{ display: 'grid', margin: 0, justifyContent: 'center', alignItems: 'center', fontSize: '16px', color: 'rgb(98 98 98)'}}>
                    per night
                    <span className="mt-1" style={{fontSize: '30px', fontWeight: '550',  color: '#000'}}>${service?.price}</span>
                  </p>
                </div>
              </div>

              <Button
                className="absolute show-details"
                icon={<span className="pi pi-info mx-1"></span>}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '30px 0 30px 0',
                  borderColor: '#f1881f',
                  color: '#f1881f',
                  padding: '10px 15px',
                  bottom: '0px',
                  right: '0'
                }}
                aria-label="Filter"
                size="small"
                onClick={() => navigate(`/service-details/${DataType.Service.toLowerCase()}/${service.id}`)}
              >
                Show details
              </Button>
            </Card>;
  };

  const renderPlaces = (place: any) => {
    return  <Card
              title={place.name}
              subTitle={place.description}
              header={<img alt="Card" style={{ borderRadius: '30px 30px 0 0', height: "10rem"}} src={place.photos[0]?.imagePath ?? 'https://getripstorage2.blob.core.windows.net/uploads/bd65bd25-6fcf-4485-b29a-91aae287ab8c.jpg'} />}
              className="md:w-21rem m-2 m-home-card"
              style={{ height: "20rem"}}
            ></Card>;
  };

  const renderActivity = (activity: any) => {
    return <Card
              title={activity.name}
              subTitle={activity.description}
              header={<img alt="Card" style={{ borderRadius: '30px 30px 0 0', height: "10rem"}} src={activity.photos[0]?.imagePath ?? 'https://getripstorage2.blob.core.windows.net/uploads/bd65bd25-6fcf-4485-b29a-91aae287ab8c.jpg'} />}
              style={{ height: "20rem"}}
              className="md:w-21rem m-2 m-home-card"
            ></Card>;
  };

  const renderCarousel = (page: HomePageRowDTO) => {
    let itemTemplate;
    let value;

    if (page.isOnlyImage) {
      itemTemplate = renderImage;
      value = page.objects?.map((ob: any) => ob.item.imagePath);
    } else if (page.isService) {
      itemTemplate = renderServices;
      value = page.objects?.map((ob: any) => ob.item);
    } else if (page.isPlace) {
      itemTemplate = renderPlaces;
      value = page.objects?.map((ob: any) => ob.item);
    } else if (page.isActivity) {
      itemTemplate = renderActivity;
      value = page.objects?.map((ob: any) => ob.item);
    } else {
      return null;
    }

    return (
      <Carousel
        value={value}
        showIndicators={false}
        numVisible={page.columnsCount}
        numScroll={1}
        itemTemplate={itemTemplate}
      />
    );
  };

  const dialogEdit = (rowData: HomePageRowDTO) => {
    setShowEdit(true);

    setFormValues({
      isSlider: rowData.isSlider,
      filterByProvinceId: rowData.filterByProvinceId,
      filterByCityId: rowData.filterByCityId,
      isService: rowData.isService,
      isPlace: rowData.isPlace,
      isActivity: rowData.isActivity,
      isAd: rowData.isAd,
      isOnlyImage: rowData.isOnlyImage,
      isBanner: rowData.isBanner,
    })

    if(rowData.isAd || rowData.isOnlyImage || rowData.isBanner) {
      const images = rowData.objects.map(async (img: any) => {
        return {
          objectURL: img.item.imagePath,
          name: img.item.imagePath,
        };
      });
      setFileImgs(prevFiles => [...prevFiles, ...images]);
    }

    homePageRowsFormEdit.setValues({
      id: rowData.id,
      pageId: rowData.pageId,
      title: rowData.title,
      description: rowData.description,
      placement: rowData.placement,
      columnsCount: rowData.columnsCount,
      itemsCount: rowData.itemsCount,
      serviceTypeId: rowData.serviceTypeId,
      cityId: rowData.cityId,
      provinceId: rowData.provinceId,
      objects: rowData.objects,
      chosenName: rowData.chosenName,
      ...formValues
    });
  }

  return (
    <div>
     { loading ? <LoadingComponent/> : <div>
        <Button label="Add New Home Page Row" onClick={() => setShowAdd(true)} size="small" className="mt-4 ml-5 primary_btn"></Button>
        <Button label="Preview" icon={<FontAwesomeIcon icon={faEye} size={"lg"} className="mr-2" />} onClick={() => setShowPreview(true)} size="small" className="mt-4 ml-5 show_preview"></Button>

        <DataTable
          value={homePageRows}
          stripedRows
          showGridlines
          className=" p-5"
          tableStyle={{ minWidth: "50rem" }}
          size="small"
          style={{ fontSize: "1.2rem", padding: "16px" }}
          resizableColumns
          rows={5}
          rowsPerPageOptions={[5, 10, 15, 20, 50]}
          filters={filters}
          header={renderHeader()}
          paginator
          rowHover
          sortMode="multiple"
        >
          <Column field="title" sortable filter header="Title"></Column>
          <Column field="description" sortable filter header="Description"></Column>
          <Column field="placement" sortable filter header="Placement"></Column>
          <Column field="columnsCount" sortable filter header="Columns Count"></Column>
          <Column field="itemsCount" sortable filter header="Items Count"></Column>
          <Column field="isSlider" body={(rowData) => showIcons(rowData.isSlider)} sortable filter header="Slider"></Column>
          <Column field="isService" body={(rowData) => showIcons(rowData.isService)} sortable filter header="Service"></Column>
          <Column field="filterByProvinceId" body={(rowData) => showIcons(rowData.filterByProvinceId)} sortable filter header="Filter By Province"></Column>
          <Column field="filterByCityId" body={(rowData) => showIcons(rowData.filterByCityId)} sortable filter header="Filter By City"></Column>
          <Column field="isPlace" body={(rowData) => showIcons(rowData.isPlace)} sortable filter header="Place"></Column>
          <Column field="isActivity" body={(rowData) => showIcons(rowData.isActivity)} sortable filter header="Activity"></Column>
          <Column field="isAd" body={(rowData) => showIcons(rowData.isAd)} sortable filter header="Ad"></Column>
          <Column field="isOnlyImage" body={(rowData) => showIcons(rowData.isOnlyImage)} sortable filter header="Only Image"></Column>
          <Column field="isBanner" body={(rowData) => showIcons(rowData.isBanner)} sortable filter header="Banner"></Column>
          <Column field="serviceTypeId" sortable filter header="Service Type"></Column>
          <Column field="cityId" sortable filter header="City"></Column>
          <Column field="provinceId" sortable filter header="Province"></Column>
          <Column field="" sortable header="Actions" body={BodyTemplate}></Column>
        </DataTable>

        <Dialog
          header="Add New Home Page Row"
          visible={showAdd}
          className="md:w-50 lg:w-50"
          onHide={() => setShowAdd(false)}
          footer={
            <>
              <div>
                <Button label="Save" size="small" severity="warning" outlined onClick={() => homePageRowsForm.handleSubmit()} className="mt-4"></Button>
                <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowAdd(false)} className="mt-4"></Button>
              </div>
            </>
          }
        >
          <div className="grid grid-cols-12">
            <div className="md:col-12 lg:col-12">
              <label className="mb-2 block" htmlFor="Title">Title</label>
              <InputText
                name="title"
                className="w-full"
                value={homePageRowsForm.values.title}
                onChange={(e) => homePageRowsForm.setFieldValue("title", e.target.value)}
              />
            </div>

            <div className="md:col-12 lg:col-12">
              <label className="mb-2" htmlFor="Description">Description</label>
              <InputTextarea
                placeholder="Description"
                rows={5}
                cols={30}
                name="description"
                className="w-full"
                value={homePageRowsForm?.values.description}
                onChange={(e) => homePageRowsForm.setFieldValue("description", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 m-2">
            <div className="md:col-4 lg:col-4">
              <label className="mb-2 block" htmlFor="Placement">Placement</label>
              <InputNumber
                name="placement"
                className="w-full"
                value={homePageRowsForm.values.placement}
                onChange={(e) => homePageRowsForm.setFieldValue("placement", e.value)}
              />
            </div>

            <div className="md:col-4 lg:col-4">
              <label className="mb-2 block" htmlFor="Columns Count">Columns Count</label>
              <InputNumber
                name="columnsCount"
                className="w-full"
                value={homePageRowsForm.values.columnsCount}
                onChange={(e) => homePageRowsForm.setFieldValue("columnsCount", e.value)}
              />
            </div>

            <div className="md:col-4 lg:col-4">
              <label className="mb-2 block" htmlFor="Items Count">Items Count</label>
              <InputNumber
                name="itemsCount"
                className="w-full"
                value={homePageRowsForm.values.itemsCount}
                onChange={(e) => homePageRowsForm.setFieldValue("itemsCount", e.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 m-2">
            {Object.entries(formValues).map(([key, value]) => (
              <div key={key} className="md:col-4 lg:col-4">
                <Checkbox
                  name={key}
                  checked={value as boolean}
                  onChange={(e: any) => {
                    if(key === 'isService') {
                      setShowSyncServiceType(true);
                    }

                    handleChange(key)(e.checked)
                  }}
                />
                <label className="ml-2" htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </label>
              </div>
            ))}
          </div>

          {formValues.isAd || formValues.isOnlyImage || formValues.isBanner ?
            <div className="md:col-12 lg:col-12">
              <label htmlFor="Image">Image</label>
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
          : <></>}
        </Dialog>

        <Dialog
          header="Update Home Page Row"
          visible={showEdit}
          className="md:w-50 lg:w-50"
          onHide={() => setShowEdit(false)}
          footer={
            <>
              <div>
                <Button label="Save" size="small" severity="warning" outlined onClick={() => homePageRowsFormEdit.handleSubmit()} className="mt-4"></Button>
                <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowEdit(false)} className="mt-4"></Button>
              </div>
            </>
          }
        >
          <div className="grid grid-cols-12">
            <div className="md:col-12 lg:col-12">
              <label className="mb-2 block" htmlFor="Title">Title</label>
              <InputText
                name="title"
                className="w-full"
                value={homePageRowsFormEdit.values.title}
                onChange={(e) => homePageRowsFormEdit.setFieldValue("title", e.target.value)}
              />
            </div>

            <div className="md:col-12 lg:col-12">
              <label className="mb-2" htmlFor="Description">Description</label>
              <InputTextarea
                placeholder="Description"
                rows={5}
                cols={30}
                name="description"
                className="w-full"
                value={homePageRowsFormEdit?.values.description}
                onChange={(e) => homePageRowsFormEdit.setFieldValue("description", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 m-2">
            <div className="md:col-4 lg:col-4">
              <label className="mb-2 block" htmlFor="Placement">Placement</label>
              <InputNumber
                name="placement"
                className="w-full"
                value={homePageRowsFormEdit.values.placement}
                onChange={(e) => homePageRowsFormEdit.setFieldValue("placement", e.value)}
              />
            </div>

            <div className="md:col-4 lg:col-4">
              <label className="mb-2 block" htmlFor="Columns Count">Columns Count</label>
              <InputNumber
                name="columnsCount"
                className="w-full"
                value={homePageRowsFormEdit.values.columnsCount}
                onChange={(e) => homePageRowsFormEdit.setFieldValue("columnsCount", e.value)}
              />
            </div>

            <div className="md:col-4 lg:col-4">
              <label className="mb-2 block" htmlFor="Items Count">Items Count</label>
              <InputNumber
                name="itemsCount"
                className="w-full"
                value={homePageRowsFormEdit.values.itemsCount}
                onChange={(e) => homePageRowsFormEdit.setFieldValue("itemsCount", e.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 m-2">
            {Object.entries(formValues).map(([key, value]) => (
              <div key={key} className="md:col-4 lg:col-4">
                <Checkbox
                  name={key}
                  checked={value as boolean}
                  onChange={(e: any) => {
                    if(key === 'isService') {
                      setShowSyncServiceType(true);
                    }

                    handleChange(key)(e.checked)
                  }}
                />
                <label className="ml-2" htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </label>
              </div>
            ))}
          </div>

          {formValues.isAd || formValues.isOnlyImage || formValues.isBanner ?
            <>
              <div className="md:col-12 lg:col-12">
                <label htmlFor="Image">Image</label>
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

              <div className="image-gallery">
                {fileImgs.map((file, index) => (
                  <div key={index} className="image-item">{itemTemplate(file, { formatSize: 100 })}</div>
                ))}
              </div>
            </>
          : <></>}
        </Dialog>
      </div>}

      <Dialog
        header="select service type"
        visible={syncServiceType}
        style={{ width: "50vw" }}
        onHide={() => setShowSyncServiceType(false)}
        footer={<>
          <div>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowSyncServiceType(false)} className="mt-4"></Button>
          </div>
        </>}
      >
        <div className="grid gap-4 mt-2">
          {serviceType?.map((serviceType: any) => (
            <div key={serviceType.id} className="col-12 md:col-6 lg:col-4 flex align-items-center">
              <RadioButton
                inputId={`service-type-${serviceType.id}`}
                name="serviceType"
                value={serviceType.id}
                onChange={(e) => {
                  setSelectedServiceTypeId(e.value);
                  setShowSyncServiceType(false);
                }}
                checked={selectedServiceTypeId === serviceType.id}
              />
              <label htmlFor={`service-type-${serviceType.id}`} className="ml-2">
                {serviceType.name}
              </label>
            </div>
          ))}
        </div>
      </Dialog>

      <Dialog
        header="Preview Home Page"
        visible={showPreview}
        style={{ width: "50vw" }}
        onHide={() => setShowPreview(false)}
        footer={<>
          <div>
            <Button label="Cancel" severity="danger" outlined size="small" onClick={() => setShowPreview(false)} className="mt-4"></Button>
          </div>
        </>}
      >
        {homePageRows.map((page: HomePageRowDTO) => (
          <div key={page.id} className="home-card mb-5">
            {page.title && <h2 className="black mx-6">{page.title}</h2>}
            {page.description && <p className="black mx-6">{page.description}</p>}
            {page.isSlider && renderCarousel(page)}
          </div>
        ))}
      </Dialog>
    </div>
  );
};

export default HomePageContent;
