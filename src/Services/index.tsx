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
    const response = await api.post("/login", loginData);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
// Users
export const CreateUser = async (userData: any) => {
  try {
    const response = await api.post("/createuser", userData);
    return handleResponse(response, "Post");
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
    return handleResponse(response);
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
    return handleResponse(response);
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
    return handleResponse(response);
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
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
export const UpdateCity = async (CountryData: any) => {
  try {
    const response = await api.put("/updatecity", CountryData);
    return handleResponse(response);
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
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
export const UpdateProvince = async (ProvinceData: any) => {
  try {
    const response = await api.put("/updateprovince", ProvinceData);
    return handleResponse(response);
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

export default api;
