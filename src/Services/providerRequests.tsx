import axios from "axios";



export const ProviderHandleCurrandLocation = async (latitude: number, longitude: number) => {
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
    const tokenResponse = await axios.post(`https://service.stage.paximum.com/v2/api/authenticationservice/login`, {
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
    const response = await axios.post(`https://service.stage.paximum.com/v2/api/${persistenceUrl}`, Query, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error: ', error);
  }
};
