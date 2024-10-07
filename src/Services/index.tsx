import axios, { AxiosInstance } from "axios";
import { handleResponse, handleError } from "./handleResponse";
import { ImageToRowDTO, SearchFilterParams } from "../modules/getrip.modules";
import { createContext, ReactNode, useContext, useState } from "react";

const getToken = () => {
  return typeof window !== "undefined" && window.localStorage ? localStorage.getItem("token") : "";
};

const LoadingContext = createContext<{
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isLoading: false,
  setIsLoading: () => {},
});

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

const createAxiosInstanceWithLoading = (contentType: string): AxiosInstance => {
  const headers = {
    "Content-Type": contentType,
    Authorization: `Bearer ${getToken()}`,
  };

  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers,
  });

  instance.interceptors.request.use((config) => {
    window.dispatchEvent(new CustomEvent('api-call-start'));
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      window.dispatchEvent(new CustomEvent('api-call-end'));
      return response;
    },
    (error) => {
      window.dispatchEvent(new CustomEvent('api-call-end'));
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      } else {
        handleError(error);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createAxiosInstanceWithLoading("application/json");
const apiForm = createAxiosInstanceWithLoading("multipart/form-data");

const FetchWithLoading = async (request: Promise<any>, requestType?: string) => {
  try {
    const response = await request;
    return handleResponse(response, requestType);
  } catch (error) {
    handleError(error);
  }
};

export const Getlogged = async (email: string) => {
  return FetchWithLoading(api.get(`/getlogged/${email}`));
};

export const AuthRegister = async (registerData: any) => {
  return FetchWithLoading(api.post("/register", registerData), 'Post');
};

export const AuthLogin = (loginData: any) => {
  return FetchWithLoading(api.post("/loginuser", loginData));
};

export const ChangePassword = (passwordData: any) => {
  return FetchWithLoading(api.post("/changepassword", passwordData), 'Post');
};

export const CreateUser = (userData: any) => {
  return FetchWithLoading(api.post("/createuser", userData), 'Post');
};

export const RegisterServiceProvider = (Data: any) => {
  return FetchWithLoading(api.post("/registerserviceprovider", Data), 'Post');
};

export const UpdateUser = (userData: any) => {
  return FetchWithLoading(api.put("/updateuser", userData), 'Post');
};

export const UpdateService = (serviceData: any) => {
  return FetchWithLoading(api.put("/updateservice", serviceData));
};

export const UpdateTagsList = (tagsData: any) => {
  return FetchWithLoading(api.put("/updatetagslist", tagsData));
};

export const UpdateFieldValuesList = (fieldValueData: any) => {
  return FetchWithLoading(api.post("/updatefieldvalueslist", fieldValueData));
};

export const UpdatePricingValuesList = (updatepricingvalueslistData: any) => {
  return FetchWithLoading(api.put("/updatepricingvalueslist", updatepricingvalueslistData));
};

export const UpdateServiceProvider = (userData: any) => {
  return FetchWithLoading(api.put("/updateserviceprovider", userData), 'Post');
};

export const DeleteUser = (email: any) => {
  return FetchWithLoading(api.delete(`/deleteuser/${email}`));
};

export const GetAllUsers = () => {
  return FetchWithLoading(api.get("/getallusers"));
};

export const GetAccountById = async (accountId: number) => {
  return FetchWithLoading(api.get(`/getaccountbyid/${accountId}`));
};

export const GetAllRoles = async () => {
  return FetchWithLoading(api.get("/getallroles"));
};

export const GetUsersInRole = async (role: string) => {
  return FetchWithLoading(api.get(`/usersinrole/${role}`));
};

export const CreateServiceType = async (ServicesData: any) => {
  return FetchWithLoading(api.post("/createservicetype", ServicesData), 'Post');
};

export const GetServiceTypes = async () => {
  return FetchWithLoading(api.get("/getallservicetypes"));
};

export const GetServiceDetailsById = async (sid: number) => {
  return FetchWithLoading(api.get(`/getservicedetailsbyid/${sid}`));
};

export const GetAllServices = async () => {
  return FetchWithLoading(api.get("/getallservices"));
};

export const GetMyServices = async (aid: number, pn: number, ps: number) => {
  return FetchWithLoading(api.get(`/getpaginatedservicesbyaccountid/${aid}/${pn}/${ps}`));
};

export const GetPaginatedServices = async (pn: number, ps: number, _filterData: string) => {
  return FetchWithLoading(api.get(`/getpaginatedservices/${pn}/${ps}?${_filterData}`));
};

export const GetPaginatedServicesBySearchFilter = async (pageNumber: number, pageSize: number, filterData: SearchFilterParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append('pn', pageNumber.toString());
  queryParams.append('ps', pageSize.toString());

  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return FetchWithLoading(api.get(`/getpaginatedservicesbysearchfilter?${queryParams.toString()}`));
};

export const GetAssignedServiceTypeByAccountId = async (aid: number) => {
  return FetchWithLoading(api.get(`/getassignedservicetypebyaccountid/${aid}`));
};

export const AssignServiceTypeListToAccount = async (ServiceData: any) => {
  return FetchWithLoading(api.post(`/assignservicetypelisttoaccount`, ServiceData), 'Post');
};

export const AddService = async (ServiceData: any) => {
  return FetchWithLoading(apiForm.post(`/addservice` , ServiceData));
};

export const UpdateServiceType = async (ServicesData: any) => {
  return FetchWithLoading(api.put("/updateservicetype", ServicesData), 'Post');
};

export const AddImageToService = async (imageData:any) => {
  return FetchWithLoading(apiForm.post(`/addimagetoservice`, imageData));
};

export const CreateCountry = async (CountryData: any) => {
  return FetchWithLoading(api.post("/createcountry", CountryData), 'Post');
};

export const CreatePricingType = async (PricingTypeData: any) => {
  return FetchWithLoading(api.post("/createpricingtype", PricingTypeData), 'Post');
};

export const UpdatePricingType = async (PricingTypeData: any) => {
  return FetchWithLoading(api.put("/updatepricingtype", PricingTypeData), 'Post');
};

export const GetAllPricingTypes = async () => {
  return FetchWithLoading(api.get("/getallpricingtypes"));
};

export const UpdateCountry = async (CountryData: any) => {
  return FetchWithLoading(api.put("/updatecountry", CountryData), 'Post');
};

export const GetAllCountries = async () => {
  return FetchWithLoading(api.get("/getallcountries"));
};

export const GetProvimcesByName = async (name: string) => {
  return FetchWithLoading(api.get(`/getprovimcesbyname/${name}`));
};

export const GetProvincebyCid = async (cid:number) => {
  return FetchWithLoading(api.get(`/getprovincesbycid/${cid}`));
};

export const AddCity = async (CityData: any) => {
  return FetchWithLoading(api.post("/addcity", CityData));
};

export const UpdateCity = async (CountryData: any) => {
  return FetchWithLoading(api.put("/updatecity", CountryData), 'Post');
};

export const GetCitiesbyid = async (pid: number) => {
  return FetchWithLoading(api.get(`/getcitiesbypid/${pid}`));
};

export const GetAllCities = async () => {
  return FetchWithLoading(api.get(`/getallcities`));
};

export const AddProvince = async (ProvinceData: any) => {
  return FetchWithLoading(api.post("/addprovince", ProvinceData), 'Post');
};

export const UpdateProvince = async (ProvinceData: any) => {
  return FetchWithLoading(api.put("/updateprovince", ProvinceData), 'Post');
};

export const GetProvincesbyid = async (cid: number) => {
  return FetchWithLoading(api.get(`/getprovincesbycid/${cid}`));
};

export const GetAllProvinces = async () => {
  return FetchWithLoading(api.get(`/getallprovinces`));
};

export const AddPlace = async (PlaceData: any) => {
  return FetchWithLoading(api.post("/addplace", PlaceData), 'Post');
};

export const UpdatePlace = async (PlaceData: any) => {
  return FetchWithLoading(api.put("/updateplace", PlaceData), 'Post');
};

export const GetPlacesbyid = async (cid: number) => {
  return FetchWithLoading(api.get(`/getplacesbycid/${cid}`));
};

export const GetAllPlaces = async () => {
  return FetchWithLoading(api.get(`/getallplaceswithimages`));
};

export const AddActivity = async (ActivityData: any) => {
  return FetchWithLoading(api.post("/addactivity", ActivityData), 'Post');
};

export const UpdateActivity = async (ActivityData: any) => {
  return FetchWithLoading(api.put("/updateactivity", ActivityData), 'Post');
};

export const GetActivitiesbyid = async (pid: number) => {
  return FetchWithLoading(api.get(`/getactivitiesbypid/${pid}`));
};

export const GetAllActivities = async () => {
  return FetchWithLoading(api.get(`/getallactivities`));
};

export const AddAttributeToSt = async (AttributeData: any) => {
  return FetchWithLoading(api.post("/addatributetost", AttributeData), 'Post');
};

export const AddAttributeToV = async (AttributeData: any) => {
  return FetchWithLoading(api.post("/addatributetov", AttributeData), 'Post');
};

export const UpdateAttributeToSt = async (AttributeData: any) => {
  return FetchWithLoading(api.put("/updateattributetost", AttributeData), 'Post');
};

export const UpdateAttributeToV = async (AttributeData: any) => {
  return FetchWithLoading(api.put("/updatteatributetov", AttributeData), 'Post');
};

export const Getattributesbysid = async (sid: number) => {
  return FetchWithLoading(api.get(`/getattributesbystid/${sid}`));
};

export const Getattributesbyvid = async (vid: number) => {
  return FetchWithLoading(api.get(`/getattributesbyvid/${vid}`));
};

export const AddFeilds = async (FeildsData: any) => {
  return FetchWithLoading(api.post("/addservicetypefield", FeildsData), 'Post');
};

export const UpdateFeilds = async (FeildsData: any) => {
  return FetchWithLoading(api.put("/updateservicetypefield", FeildsData), 'Post');
};

export const GetFeilds = async () => {
  return FetchWithLoading(api.get("/getallservicetypefield"));
};

export const GetFeildsbysid = async (sid: number) => {
  return FetchWithLoading(api.get(`/getfieldsbyservicetypeid/${sid}`));
};

export const GetFeildType = async () => {
  return FetchWithLoading(api.get(`/getfieldtypes`));
};

export const AddVehicle = async (VehicleData: any) => {
  return FetchWithLoading(api.post("/addvehicle", VehicleData), 'Post');
};

export const AddVehicleType = async (VehicleData: any) => {
  return FetchWithLoading(api.post("/addvehicletype", VehicleData), 'Post');
};

export const UpdateVehicle = async (VehicleData: any) => {
  return FetchWithLoading(api.put("/updatevehicle", VehicleData), 'Post');
};

export const UpdateVehicleType = async (VehicleData: any) => {
  return FetchWithLoading(api.put("/updatevehicletype", VehicleData), 'Post');
};

export const GetVehiclesbyid = async (mid: number) => {
  return FetchWithLoading(api.get(`/getvehiclebymid/${mid}`));
};

export const GetVehiclesbytid = async (tid: number) => {
  return FetchWithLoading(api.get(`/getvehiclebytypeid/${tid}`));
};

export const GetAllVehicles = async () => {
  return FetchWithLoading(api.get(`/getallvehicles`));
};

export const GetAllVehiclesTypes = async () => {
  return FetchWithLoading(api.get(`/getallvehicletypes`));
};

export const AddMaker = async (MakerData: any) => {
  return FetchWithLoading(api.post("/createmaker", MakerData), 'Post');
};

export const UpdateMaker = async (MakerData: any) => {
  return FetchWithLoading(api.put("/updatemaker", MakerData), 'Post');
};

export const GetAllMakers = async () => {
  return FetchWithLoading(api.get(`/getallmakers`));
};

export const GetAllMakersWithvehicles = async () => {
  return FetchWithLoading(api.get(`/getmakerswithvehicles`));
};

export const AddImageToPlace = async (imageData:any) => {
  return FetchWithLoading(apiForm.post(`/addimagetoplace`, imageData));
};

export const AddImageToVihcles = async (imageData:any) => {
  return FetchWithLoading(apiForm.post(`/addimagetovehicle`, imageData));
};

export const AddImageToResidence = async (imageData:any) => {
  return FetchWithLoading(apiForm.post(`/addimagetoresidence`, imageData));
};

export const GetimagesByPlaceid = async (pid:any) => {
  return FetchWithLoading(apiForm.get(`/getimagesbyplaceid/${pid}`));
};

export const GetimagesByResidanceid = async (pid:any) => {
  return FetchWithLoading(apiForm.get(`/getimagesbyresidenceid/${pid}`));
};

export const AddResidence = async (residenceData:any) => {
  return FetchWithLoading(api.post(`/addresidence`, residenceData), 'Post');
};

export const AddResidenceType = async (residenceData:any) => {
  return FetchWithLoading(api.post(`/addresidencetype`, residenceData), 'Post');
};

export const UpdateResidenceType = async (residenceData:any) => {
  return FetchWithLoading(api.put(`/updateresidencetype`, residenceData), 'Post');
};

export const UpdateResidence = async (residenceData:any) => {
  return FetchWithLoading(api.put(`/updateresidence`, residenceData), 'Post');
};

export const GetResidence = async () => {
  return FetchWithLoading(api.get(`/getallresidences`));
};

export const GetResidenceType = async () => {
  return FetchWithLoading(api.get(`/getallresidencetypes`));
};

export const GetResidencebyCottages = async (tid:number) => {
  return FetchWithLoading(api.get(`/getcottagesbyplaceid/${tid}`));
};

export const AddCurrency = async (CurrencyData: any) => {
  return FetchWithLoading(api.post(`/createcurrency` , CurrencyData), 'Post');
};

export const GetCurrency = async () => {
  return FetchWithLoading(api.get(`/getcurrencies`));
};

export const UpdateCurrency = async (CurrencyData:any) => {
  return FetchWithLoading(api.put(`/updatecurrency`,CurrencyData), 'Post');
};

export const GetAllYachts = async () => {
  return FetchWithLoading(api.get(`/getallyachts`));
};

export const GetAllLanguages = async () => {
  return FetchWithLoading(api.get(`/getalllanguages`));
};

export const GetFacilityCategories = async () => {
  return FetchWithLoading(api.get(`/getfacilitycategoties`));
};

export const GetFacilities = async () => {
  return FetchWithLoading(api.get(`/getfacilities`));
};

export const GetFacilitiesByCategoryId = async (cid: number) => {
  return FetchWithLoading(api.get(`/getfacilitiesbycategoryid/${cid}`));
};

export const GetAssignedFacilitiesByServiceId = async (sid: number) => {
  return FetchWithLoading(api.get(`/getassignedfacilitiesbyserviceid/${sid}`));
};

export const AddFacilityCategory = async (FacilityData: any) => {
  return FetchWithLoading(api.post(`/addfacilitycategory` , FacilityData), 'Post');
};

export const UpdateFacilityCategory = async (FacilityData: any) => {
  return FetchWithLoading(api.put(`/updatefacilitycategory`,FacilityData), 'Post');
};

export const AddFacility = async (FacilityData: any) => {
  return FetchWithLoading(api.post(`/addfacility` , FacilityData), 'Post');
};

export const UpdateFacility = async (FacilityData: any) => {
  return FetchWithLoading(api.put(`/updatefacility`,FacilityData), 'Post');
};

export const GetAssignedFacilitiesByServiceTypeId = async (sid: number) => {
  return FetchWithLoading(api.get(`/getassignedfacilitiesbyservicetypeid/${sid}`));
};

export const GetAssignedFacilitiesByServiceTypeIdWithCategory = async (stid: number) => {
  return FetchWithLoading(api.get(`/getassignedfacilitiesbyservicetypeidwithcategory/${stid}`));
};

export const AssignFaciliesToServiceType = async (Data: any) => {
  return FetchWithLoading(api.post(`/assignfaciliestoservicetype` , Data), 'Post');
};

export const GetPendingUsers = async () => {
  return FetchWithLoading(api.get(`/getpendingusers`));
};

export const GetPendingServices = async () => {
  return FetchWithLoading(api.get(`/getpendingservices`));
};

export const GetRejectedUsers = async () => {
  return FetchWithLoading(api.get(`/getrejectedusers`));
};

export const GetNearByRestaurants = async (data: any) => {
  return FetchWithLoading(api.get(`/getnearbyrestaurants${data}`));
};

export const GetRejectedServices = async () => {
  return FetchWithLoading(api.get(`/getrejectedservices`));
};

export const ApproveUser = async (spid: any) => {
  return FetchWithLoading(api.post(`/approveuser/${spid}`), 'Post');
};

export const RejectUser = async (data: any) => {
  return FetchWithLoading(api.post("/rejectuser", data), 'Post');
};

export const ApproveService = async (sid: any) => {
  return FetchWithLoading(api.post(`/approveservice/${sid}`), 'Post');
};

export const DeleteService = async (sid: any) => {
  return FetchWithLoading(api.delete(`/deleteservice/${sid}`), 'Post');
};

export const RejectService = async (data: any) => {
  return FetchWithLoading(api.post("/rejectservice", data));
};

export const AddHomePageRow = async (data: any) => {
  return FetchWithLoading(api.post("/addhomepagerow", data), 'Post');
};

export const UpdateHomePageRow = async (data: any) => {
  return FetchWithLoading(api.put("/updatehomepagerow", data), 'Post');
};

export const DeleteRow = async (id: any) => {
  return FetchWithLoading(api.delete(`/deleterow/${id}`), 'Post');
};

export const AddImageTorRow = async (data: ImageToRowDTO) => {
  return FetchWithLoading(apiForm.post("/addimagetorrow", data));
};

export const GetHomePageRows = async (ProvinceId?: number, CityId?: number) => {
  const queryParams = new URLSearchParams();
  if (ProvinceId) queryParams.append('ProvinceId', ProvinceId.toString());
  if (CityId) queryParams.append('CityId', CityId.toString());

  return FetchWithLoading(api.get(`/gethomepagerows${queryParams.toString() ? `?${queryParams.toString()}` : ''}`));
};

export const AddRequest = async (data: any) => {
  return FetchWithLoading(api.post("/addrequest", data));
};

export const AddInstantOrder = async (data: any) => {
  return FetchWithLoading(api.post("/addinstantorder", data));
};

export const ApproveRequest = async (rid: any) => {
  return FetchWithLoading(api.post(`/approverequest/${rid}`), 'Post');
};

export const RejectRequest = async (data: any) => {
  return FetchWithLoading(api.post("/rejectrequest", data), 'Post');
};

export const UpdateRequest = async (data: any) => {
  return FetchWithLoading(api.put("/updaterequest", data), 'Post');
};

export const DeleteRequest = async (rid: any) => {
  return FetchWithLoading(api.delete(`/deleterequest/${rid}`), 'Post');
};

export const GetAllRequestsByServiceId = async (sid: any) => {
  return FetchWithLoading(api.get(`/getallrequestsbyserviceid/${sid}`));
};

export const GetServiceProviderAllRequests = async (spid: any) => {
  return FetchWithLoading(api.get(`/getserviceproviderallrequests/${spid}`));
};

export const GetServiceProviderPendingRequests = async (spid: any) => {
  return FetchWithLoading(api.get(`/getserviceproviderpendingrequests/${spid}`));
};

export const GetServiceProviderApprovedRequests = async (spid: any) => {
  return FetchWithLoading(api.get(`/getserviceproviderapprovedrequests/${spid}`));
};

export const GetServiceProviderRejectedRequests = async (spid: any) => {
  return FetchWithLoading(api.get(`/getserviceproviderrejectedrequests/${spid}`));
};

export const GetClienterAllrequests = async (cid: any) => {
  return FetchWithLoading(api.get(`/getclienterallrequests/${cid}`));
};

export const GetClientPendingRequests = async (cid: any) => {
  return FetchWithLoading(api.get(`/getclientpendingrequests/${cid}`));
};

export const GetClientApprovedRequests = async (cid: any) => {
  return FetchWithLoading(api.get(`/getclientapprovedrequests/${cid}`));
};

export const GetClientRejectedRequests = async (cid: any) => {
  return FetchWithLoading(api.get(`/getclientrejectedrequests/${cid}`));
};

export const GetAllRequests = async () => {
  return FetchWithLoading(api.get(`/getallrequests`));
};

export const GetPendingRequests = async () => {
  return FetchWithLoading(api.get(`/getpendingrequests`));
};

export const GetApprovedRequests = async () => {
  return FetchWithLoading(api.get(`/getapprovedrequests`));
};

export const GetRejectedRequests = async () => {
  return FetchWithLoading(api.get(`/getrejectedrequests`));
};

export const GetOrderstsByRecieverId = async (recieverId: number) => {
  return FetchWithLoading(api.get(`/getorderstsbyrecieverid/${recieverId}`));
};

export const GetOrderstsBySenderId = async (senderId: number) => {
  return FetchWithLoading(api.get(`/getorderstsbysenderid/${senderId}`));
};

export const GetAllOrders = async () => {
  return FetchWithLoading(api.get(`/getallorders`));
};

export const InitializePopup = async (data: any) => {
  return FetchWithLoading(api.post("/initialize_popup", data));
};

export const VerifyPaid = async (reference: any) => {
  return FetchWithLoading(api.post(`/verify/${reference}`));
};

export const AddFlightRequest = async (data: any) => {
  return FetchWithLoading(api.post("/addflightrequest", data));
};

export const AddTicketOffer = async (data: any) => {
  return FetchWithLoading(api.post("/addticketoffer", data));
};

export const GetAllFlightRequests = async () => {
  return FetchWithLoading(api.get(`/getallflightrequests`));
};

export const GetAllTicketOffers = async () => {
  return FetchWithLoading(api.get(`/getallticketoffers`));
};

export const GetFlightsRequestsByClientId = async (cid: number) => {
  return FetchWithLoading(api.get(`/getflightsrequestsbyclientid/${cid}`));
};

export const GetTicketOffersByrRequestId = async (rid: number) => {
  return FetchWithLoading(api.get(`/getticketoffersbyrequestid/${rid}`));
};

export const GetTicketOffersByProviderId = async (pid: number) => {
  return FetchWithLoading(api.get(`/getticketoffersbyproviderid/${pid}`));
};
