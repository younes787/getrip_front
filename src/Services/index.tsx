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

  export default api;
