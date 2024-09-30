import axios from "axios";

export const ProviderhandleCurrentLocation = async (latitude: number, longitude: number) => {
  try {
    return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
  }
};

export const ProviderInitializeMapCenter = async (location: string) => {
  try {
    return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
  } catch (error) {
    console.error('Error getting current location:', error);
  }
};

export const ProviderFetchLocationInfo = async (lat: number, lng: number) => {
  try {
    return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
  } catch (error) {
    console.error('Error fetching location info:', error);
  }
};

export const ProviderHandleMarkerHover = async (lat: number, lng: number) => {
  try {
    return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
  } catch (error) {
    console.error('Error fetching location info:', error);
  }
};

export const ProviderHandleSearch = async (searchQuery: any) => {
  try {
    return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
  } catch (error) {
    console.error('Error searching location:', error);
  }
};

export const ProviderAuthenticationservice = async () => {
  try {
    const tokenResponse = await axios.post(`http://service.stage.paximum.com/v2/api/authenticationservice/login`, {
      Agency: "PXM25730",
      User: "USR1",
      Password: "Admin01."
    });

    return tokenResponse.data.body.token;
  } catch (error) {
    console.error('Error: ', error);
  }
};

export const ProviderServiceTourVisio = async (persistenceUrl: string, Query: any, token: string) => {
  try {
    const response = await axios.post(`http://service.stage.paximum.com/v2/api/${persistenceUrl}`, Query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error: ', error);
  }
};

const API_BASE_URL = 'https://api.lahza.io';
const SECRET_KEY = 'sk_test_KDx5Me4PklChUH7tceyQCjJrvqiyBdjz9';
const PUBLICK_KEY = 'pk_test_DHJf84O6tLz4OrIZZjU0jepVpykDiWyEK';

export const LahzaTransactionInitialize = async (transactionData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transaction/initialize`, transactionData, {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error initializing Lahza transaction:', error);
    throw error;
  }
};

export const LahzaTransactionVerify = async (reference: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error verifying Lahza transaction:', error);
    throw error;
  }
};
