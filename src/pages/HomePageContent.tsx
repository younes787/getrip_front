import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { AddHomePageRow, AddImageTorRow, GetHomePageRows } from "../Services";
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

const HomePageContent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [homePageRows, setHomePageRows] = useState<any>();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<any>(null);
  const [fileimg, setFileimg] = useState<any[]>([]);
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

  useEffect(() => {
    setLoading(true);
    GetHomePageRows().then((res) => {
      setHomePageRows(res.data)
      setLoading(false)
    }).catch((error) => {
      setLoading(false);
    });
  }, []);

  const useHomePageRowsForm = (setShowAdd: (show: boolean) => void, fileimg: any[]) => {
    return useFormik<HomePageRowDTO>({
      initialValues: new HomePageRowDTO(),
      validateOnChange: true,
      onSubmit: async (values) => {
        const sanitizedValues = sanitizeFormValues(values);

        try {
          const res = await AddHomePageRow(sanitizedValues);

          if (res.isSuccess && (values.isSlider || values.isOnlyImage || values.isBanner)) {
            await AddImageTorRow(fileimg.map((img: any) => ({
              ObjectId: res.data.id,
              file: img
            })));
          }

          setShowAdd(false);
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      },
    });
  };

  const homePageRowsForm = useHomePageRowsForm(setShowAdd, fileimg);

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
        <i
          className="pi pi-bold pi-pencil"
          onClick={() => false } // ShowUser(rowData)
          style={{
            fontSize: "1.2rem",
            color: "slateblue",
            padding: "7px",
            cursor: "pointer",
          }}
        ></i>
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

  return (
    <div>
     { loading ? <LoadingComponent/> : <div>
        <Button label="Add New Home Page Row" onClick={() => setShowAdd(true)} size="small" className="mt-4 ml-5 primary_btn"></Button>

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
          rowsPerPageOptions={[10, 15, 20, 50]}
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
          <Column field="isSlider" sortable filter header="Slider"></Column>
          <Column field="isService" sortable filter header="Service"></Column>
          <Column field="filterByProvinceId" sortable filter header="Filter By Province"></Column>
          <Column field="filterByCityId" sortable filter header="Filter By City"></Column>
          <Column field="isPlace" sortable filter header="Place"></Column>
          <Column field="isActivity" sortable filter header="Activity"></Column>
          <Column field="isAd" sortable filter header="Ad"></Column>
          <Column field="isOnlyImage" sortable filter header="Only Image"></Column>
          <Column field="serviceTypeId" sortable filter header="Service Type"></Column>
          <Column field="cityId" sortable filter header="City"></Column>
          <Column field="provinceId" sortable filter header="Province"></Column>
          <Column field="isBanner" sortable filter header="Banner"></Column>
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
            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="isSlider"
                checked={homePageRowsForm.values.isSlider ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("isSlider", e.checked)}
              />
              <label className="ml-2" htmlFor="isSlider">Slider</label>
            </div>

            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="filterByProvinceId"
                checked={homePageRowsForm.values.filterByProvinceId ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("filterByProvinceId", e.checked)}
              />
              <label className="ml-2" htmlFor="Filter By Province">Filter By Province</label>
            </div>

            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="filterByCityId"
                checked={homePageRowsForm.values.filterByCityId ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("filterByCityId", e.checked)}
              />
              <label className="ml-2" htmlFor="Filter By City">Filter By City</label>
            </div>

            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="isService"
                checked={homePageRowsForm.values.isService ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("isService", e.checked)}
              />
              <label className="ml-2" htmlFor="isService">Service</label>
            </div>

            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="isPlace"
                checked={homePageRowsForm.values.isPlace ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("isPlace", e.checked)}
              />
              <label className="ml-2" htmlFor="isPlace">Place</label>
            </div>

            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="isActivity"
                checked={homePageRowsForm.values.isActivity ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("isActivity", e.checked)}
              />
              <label className="ml-2" htmlFor="isActivity">Activity</label>
            </div>

            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="isAd"
                checked={homePageRowsForm.values.isAd ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("isAd", e.checked)}
              />
              <label className="ml-2" htmlFor="isAd">Ad</label>
            </div>

            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="isOnlyImage"
                checked={homePageRowsForm.values.isOnlyImage ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("isOnlyImage", e.checked)}
              />
              <label className="ml-2" htmlFor="isOnlyImage">Only Image</label>
            </div>

            <div className="md:col-4 lg:col-4">
              <Checkbox
                name="isBanner"
                checked={homePageRowsForm.values.isBanner ?? false}
                onChange={(e) => homePageRowsForm.setFieldValue("isBanner", e.checked)}
              />
              <label className="ml-2" htmlFor="isBanner">Banner</label>
            </div>
          </div>

          {homePageRowsForm.values.isSlider || homePageRowsForm.values.isOnlyImage || homePageRowsForm.values.isBanner ?
            <div className="md:col-12 lg:col-12">
              <label htmlFor="Wallet">Image</label>
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
      </div>}
    </div>
  );
};

export default HomePageContent;
