import axios from "axios";
import { handleResponse, handleError } from "./handleResponse";

const api = axios.create({
  baseURL: "https://getrip.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      typeof window !== "undefined" ? localStorage.getItem("token") : ""
    }`,
  },
});
const apiForm = axios.create({
  baseURL: "https://getrip.azurewebsites.net",
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${
      typeof window !== "undefined" ? localStorage.getItem("token") : ""
    }`,
  },
});
// Auth
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
// Users
export const CreateUser = async (userData: any) => {
  try {
    const response = await api.post("/createuser", userData);
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
export const GetAllRoles = async () => {
  try {
    const response = await api.get("/getallroles");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
// Services
export const CreateServiceType = async (ServicesData: any) => {
  try {
    const response = await api.post("/createservicetype", ServicesData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};

export const GetAllService = async () => {
  try {
    const response = await api.get("/getallservicetypes");
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const UpdateService = async (ServicesData: any) => {
  try {
    const response = await api.put("/updateservicetype", ServicesData);
    return handleResponse(response , 'Post');
  } catch (error) {
    handleError(error);
  }
};
// Logistics
export const CreateCountry = async (CountryData: any) => {
  try {
    const response = await api.post("/createcountry", CountryData);
    return handleResponse(response , 'Post');
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
// Cites
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

// Province
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

// places
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

// activity
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

//Attributes

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
// Feilds
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
    return handleResponse(response , 'Post');
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
// Vehicle
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
// Maker
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

// Photos 
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
// Residence
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
// Currency
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

export default api;
