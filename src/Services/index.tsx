import axios from "axios";
import { handleResponse, handleError } from "./handleResponse";

const getToken = () => {
  return typeof window !== "undefined" && window.localStorage ? localStorage.getItem("token") : "";
};

const createAxiosInstance = (contentType: string) => {
  const headers = {
    "Content-Type": contentType,
    Authorization: `Bearer ${getToken()}`,
  };

  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers,
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      } else {
        handleError(error);
      }
    }
  );

  return instance;
};

const api = createAxiosInstance("application/json");
const apiForm = createAxiosInstance("multipart/form-data");

export const Getlogged = async (email: string) => {
  try {
    const response = await api.get(`/getlogged/${email}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const authRegister = async (registerData: any) => {
  try {
    const response = await api.post("/register", registerData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const authLogin = async (loginData: any) => {
  try {
    const response = await api.post("/loginuser", loginData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const CreateUser = async (userData: any) => {
  try {
    const response = await api.post("/createuser", userData);
    return handleResponse(response, "Post");
  } catch (error) {
    handleError(error);
  }
};

export const RegisterServiceProvider = async (Data: any) => {
  try {
    const response = await api.post("/registerserviceprovider", Data);
    return handleResponse(response, "");
  } catch (error) {
    handleError(error);
  }
};

export const UpdateUser = async (userData: any) => {
  try {
    const response = await api.put("/updateuser", userData);
    return handleResponse(response, "Post");
  } catch (error) {
    handleError(error);
  }
};

export const DeleteUser = async (email: any) => {
  try {
    const response = await api.delete(`/deleteuser/${email}`);
    return handleResponse(response, "Post");
  } catch (error) {
    handleError(error);
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await api.get("/getallusers");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAccountById = async (accountId: number) => {
  try {
    const response = await api.get(`/getaccountbyid/${accountId}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllRoles = async () => {
  try {
    const response = await api.get("/getallroles");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetUsersInRole = async (role: string) => {
  try {
    const response = await api.get(`/usersinrole/${role}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const CreateServiceType = async (ServicesData: any) => {
  try {
    const response = await api.post("/createservicetype", ServicesData);
    return handleResponse(response , '');
  } catch (error) {
    handleError(error);
  }
};

export const GetServiceTypes = async () => {
  try {
    const response = await api.get("/getallservicetypes");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetServiceDetailsById = async (sid: number) => {
  try {
    const response = await api.get(`/getservicedetailsbyid/${sid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllServices = async () => {
  try {
    const response = await api.get("/getallservices");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetMyServices = async (aid: number, pn: number, ps: number) => {
  try {
    const response = await api.get(`/getpaginatedservicesbyaccountid/${aid}/${pn}/${ps}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetPaginatedServices = async (pn: number, ps: number, _filterData: string) => {
  try {
    const response = await api.get(`/getpaginatedservices/${pn}/${ps}?${_filterData}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAssignedServiceTypeByAccountId = async (aid: number) => {
  try {
    const response = await api.get(`/getassignedservicetypebyaccountid/${aid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AssignServiceTypeListToAccount = async (ServiceData: any) => {
  try {
    const response = await api.post(`/assignservicetypelisttoaccount`, ServiceData);
    return handleResponse(response, 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const AddService = async (ServiceData: any) => {
  try {
    const response = await api.post(`/addservice` , ServiceData);
    return handleResponse(response , '');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateService = async (ServicesData: any) => {
  try {
    const response = await api.put("/updateservicetype", ServicesData);
    return handleResponse(response , '');
  } catch (error) {
    handleError(error);
  }
};

export const AddImageToService = async (imageData:any) => {
  try {
    const response = await apiForm.post(`/addimagetoservice`, imageData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const CreateCountry = async (CountryData: any) => {
  try {
    const response = await api.post("/createcountry", CountryData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const CreatePricingType = async (PricingTypeData: any) => {
  try {
    const response = await api.post("/createpricingtype", PricingTypeData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdatePricingType = async (PricingTypeData: any) => {
  try {
    const response = await api.put("/updatepricingtype", PricingTypeData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetAllPricingTypes = async () => {
  try {
    const response = await api.get("/getallpricingtypes");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const UpdateCountry = async (CountryData: any) => {
  try {
    const response = await api.put("/updatecountry", CountryData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetAllCountries = async () => {
  try {
    const response = await api.get("/getallcountries");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetProvimcesByName = async (name: string) => {
  try {
    const response = await api.get(`/getprovimcesbyname/${name}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetProvincebyCid = async (cid:number) => {
  try {
    const response = await api.get(`/getprovincesbycid/${cid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddCity = async (CityData: any) => {
  try {
    const response = await api.post("/addcity", CityData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateCity = async (CountryData: any) => {
  try {
    const response = await api.put("/updatecity", CountryData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetCitiesbyid = async (pid: number) => {
  try {
    const response = await api.get(`/getcitiesbypid/${pid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllCities = async () => {
  try {
    const response = await api.get(`/getallcities`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddProvince = async (ProvinceData: any) => {
  try {
    const response = await api.post("/addprovince", ProvinceData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateProvince = async (ProvinceData: any) => {
  try {
    const response = await api.put("/updateprovince", ProvinceData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetProvincesbyid = async (cid: number) => {
  try {
    const response = await api.get(`/getprovincesbycid/${cid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllProvinces = async () => {
  try {
    const response = await api.get(`/getallprovinces`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddPlace = async (PlaceData: any) => {
  try {
    const response = await api.post("/addplace", PlaceData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdatePlace = async (PlaceData: any) => {
  try {
    const response = await api.put("/updateplace", PlaceData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetPlacesbyid = async (cid: number) => {
  try {
    const response = await api.get(`/getplacesbycid/${cid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllPlaces = async () => {
  try {
    const response = await api.get(`/getallplaceswithimages`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddActivity = async (ActivityData: any) => {
  try {
    const response = await api.post("/addactivity", ActivityData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateActivity = async (ActivityData: any) => {
  try {
    const response = await api.put("/updateactivity", ActivityData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetActivitiesbyid = async (pid: number) => {
  try {
    const response = await api.get(`/getactivitiesbypid/${pid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllActivities = async () => {
  try {
    const response = await api.get(`/getallactivities`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddAttributeToSt = async (AttributeData: any) => {
  try {
    const response = await api.post("/addatributetost", AttributeData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const AddAttributeToV = async (AttributeData: any) => {
  try {
    const response = await api.post("/addatributetov", AttributeData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateAttributeToSt = async (AttributeData: any) => {
  try {
    const response = await api.put("/updateattributetost", AttributeData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateAttributeToV = async (AttributeData: any) => {
  try {
    const response = await api.put("/updatteatributetov", AttributeData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const Getattributesbysid = async (sid: number) => {
  try {
    const response = await api.get(`/getattributesbystid/${sid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const Getattributesbyvid = async (vid: number) => {
  try {
    const response = await api.get(`/getattributesbyvid/${vid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddFeilds = async (FeildsData: any) => {
  try {
    const response = await api.post("/addservicetypefield", FeildsData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateFeilds = async (FeildsData: any) => {
  try {
    const response = await api.put("/updateservicetypefield", FeildsData);
    return handleResponse(response , '');
  } catch (error) {
    handleError(error);
  }
};

export const GetFeilds = async () => {
  try {
    const response = await api.get("/getallservicetypefield");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetFeildsbysid = async (sid: number) => {
  try {
    const response = await api.get(`/getfieldsbyservicetypeid/${sid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetFeildType = async () => {
  try {
    const response = await api.get(`/getfieldtypes`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddVehicle = async (VehicleData: any) => {
  try {
    const response = await api.post("/addvehicle", VehicleData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const AddVehicleType = async (VehicleData: any) => {
  try {
    const response = await api.post("/addvehicletype", VehicleData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateVehicle = async (VehicleData: any) => {
  try {
    const response = await api.put("/updatevehicle", VehicleData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateVehicleType = async (VehicleData: any) => {
  try {
    const response = await api.put("/updatevehicletype", VehicleData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetVehiclesbyid = async (mid: number) => {
  try {
    const response = await api.get(`/getvehiclebymid/${mid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetVehiclesbytid = async (tid: number) => {
  try {
    const response = await api.get(`/getvehiclebytypeid/${tid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllVehicles = async () => {
  try {
    const response = await api.get(`/getallvehicles`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllVehiclesTypes = async () => {
  try {
    const response = await api.get(`/getallvehicletypes`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddMaker = async (MakerData: any) => {
  try {
    const response = await api.post("/createmaker", MakerData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateMaker = async (MakerData: any) => {
  try {
    const response = await api.put("/updatemaker", MakerData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetAllMakers = async () => {
  try {
    const response = await api.get(`/getallmakers`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllMakersWithvehicles = async () => {
  try {
    const response = await api.get(`/getmakerswithvehicles`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddImageToPlace = async (imageData:any) => {
  try {
    const response = await apiForm.post(`/addimagetoplace`, imageData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddImageToVihcles = async (imageData:any) => {
  try {
    const response = await apiForm.post(`/addimagetovehicle`, imageData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddImageToResidence = async (imageData:any) => {
  try {
    const response = await apiForm.post(`/addimagetoresidence`, imageData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetimagesByPlaceid = async (pid:any) => {
  try {
    const response = await apiForm.get(`/getimagesbyplaceid/${pid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetimagesByResidanceid = async (pid:any) => {
  try {
    const response = await apiForm.get(`/getimagesbyresidenceid/${pid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddResidence = async (residenceData:any) => {
  try {
    const response = await api.post(`/addresidence`, residenceData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const AddResidenceType = async (residenceData:any) => {
  try {
    const response = await api.post(`/addresidencetype`, residenceData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateResidenceType = async (residenceData:any) => {
  try {
    const response = await api.put(`/updateresidencetype`, residenceData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateResidence = async (residenceData:any) => {
  try {
    const response = await api.put(`/updateresidence`, residenceData);
    return handleResponse(response, 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetResidence = async () => {
  try {
    const response = await api.get(`/getallresidences`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetResidenceType = async () => {
  try {
    const response = await api.get(`/getallresidencetypes`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetResidencebyCottages = async (tid:number) => {
  try {
    const response = await api.get(`/getcottagesbyplaceid/${tid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddCurrency = async (CurrencyData: any) => {
  try {
    const response = await api.post(`/createcurrency` , CurrencyData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetCurrency = async () => {
  try {
    const response = await api.get(`/getcurrencies`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const UpdateCurrency = async (CurrencyData:any) => {
  try {
    const response = await api.put(`/updatecurrency`,CurrencyData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetAllYachts = async () => {
  try {
    const response = await api.get(`/getallyachts`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAllLanguages = async () => {
  try {
    const response = await api.get(`/getalllanguages`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetFacilityCategories = async () => {
  try {
    const response = await api.get(`/getfacilitycategoties`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetFacilities = async () => {
  try {
    const response = await api.get(`/getfacilities`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetFacilitiesByCategoryId = async (cid: number) => {
  try {
    const response = await api.get(`/getfacilitiesbycategoryid/${cid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAssignedFacilitiesByServiceId = async (sid: number) => {
  try {
    const response = await api.get(`/getassignedfacilitiesbyserviceid/${sid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AddFacilityCategory = async (FacilityData: any) => {
  try {
    const response = await api.post(`/addfacilitycategory` , FacilityData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateFacilityCategory = async (FacilityData: any) => {
  try {
    const response = await api.put(`/updatefacilitycategory`,FacilityData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const AddFacility = async (FacilityData: any) => {
  try {
    const response = await api.post(`/addfacility` , FacilityData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const UpdateFacility = async (FacilityData: any) => {
  try {
    const response = await api.put(`/updatefacility`,FacilityData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetAssignedFacilitiesByServiceTypeId = async (sid: number) => {
  try {
    const response = await api.get(`/getassignedfacilitiesbyservicetypeid/${sid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetAssignedFacilitiesByServiceTypeIdWithCategory = async (stid: number) => {
  try {
    const response = await api.get(`/getassignedfacilitiesbyservicetypeidwithcategory/${stid}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const AssignFaciliesToServiceType = async (Data: any) => {
  try {
    const response = await api.post(`/assignfaciliestoservicetype` , Data);
    return handleResponse(response , '');
  } catch (error) {
    handleError(error);
  }
};

export const GetPendingUsers = async () => {
  try {
    const response = await api.get(`/getpendingusers`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetPendingServices = async () => {
  try {
    const response = await api.get(`/getpendingservices`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetRejectedUsers = async () => {
  try {
    const response = await api.get(`/getrejectedusers`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetNearByRestaurants = async (data: any) => {
  try {
    const response = await api.get(`/getnearbyrestaurants${data}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const GetRejectedServices = async () => {
  try {
    const response = await api.get(`/getrejectedservices`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const ApproveUser = async (spid: any) => {
  try {
    const response = await api.post(`/approveuser/${spid}`);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const RejectUser = async (data: any) => {
  try {
    const response = await api.post("/rejectuser", data);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const ApproveService = async (sid: any) => {
  try {
    const response = await api.post(`/approveservice/${sid}`);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const DeleteService = async (sid: any) => {
  try {
    const response = await api.delete(`/deleteservice/${sid}`);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const RejectService = async (data: any) => {
  try {
    const response = await api.post("/rejectservice", data);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export default api;
