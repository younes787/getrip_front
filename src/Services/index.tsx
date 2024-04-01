import axios from "axios";
import { handleResponse, handleError } from "./handleResponse";


const api = axios.create({
  baseURL: 'https://getrip.azurewebsites.net',
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
    return handleResponse(response,'Post');
  } catch (error) {
    handleError(error);
  }
};
export const UpdateUser = async (userData: any) => {
  try {
    const response = await api.put("/updateuser", userData);
    return handleResponse(response ,'Post');
  } catch (error) {
    handleError(error);
  }
};
export const DeleteUser = async (email: any) => {
  try {
    const response = await api.delete(`/deleteuser/${email}`);
    return handleResponse(response , 'Post');
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
  export default api;
