import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { LocationFromMap } from '../modules/getrip.modules';

interface MarkerProps {
  lat: number;
  lng: number;
  text: string | any;
  icon?: string | any;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface GoogleMapProps {
  markerData?: { lat: number; lng: number; text: string }[];
  country?: string;
  province?: string;
  city?: string;
  onLocationSelect: (location: LocationFromMap) => void;
}

const Marker: React.FC<MarkerProps> = ({ text, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ cursor: 'pointer', fontSize: '40px', color: 'red' }}
  >
    {text}
  </div>
);

const GoogleMap: React.FC<GoogleMapProps> = ({ markerData = [], country, province, city, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationInfo, setLocationInfo] = useState<string | null>(null);
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const initializeMapCenter = async () => {
      if (country || province || city) {
        try {
          const location = `${city ? city + ', ' : ''}${province ? province + ', ' : ''}${country || ''}`;
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
          const results = response.data.results;
          if (results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            setSelectedLocation({ lat, lng });
            setMapCenter({ lat: lat, lng: lng });
            fetchLocationInfo(lat, lng);
          }
        } catch (error) {
          console.error('Error initializing map center:', error);
        }
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          fetchLocationInfo(latitude, longitude);
        }, (error) => {
          console.error('Error getting current location:', error);
        });
      }

    };

    initializeMapCenter();
  }, [country, province, city]);

  const handleApiLoaded = (map: any, maps: any) => {
    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ lat, lng });
      setMapCenter({ lat: lat, lng: lng });
      fetchLocationInfo(lat, lng);
    });
  };

  const fetchLocationInfo = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
      const results = response.data.results;
      if (results.length > 0) {
        const locationDetails = results[0].formatted_address;
        setSearchQuery(locationDetails)

        setLocationInfo(`Location: ${locationDetails}`);
        setSelectedLocation({ lat, lng });
        setMapCenter({ lat: lat, lng: lng });
        onLocationSelect({ lat, lng, address: results });
      } else {
        setLocationInfo(`Latitude: ${lat}, Longitude: ${lng}`);
        onLocationSelect({ lat, lng, address: `Latitude: ${lat}, Longitude: ${lng}` });
      }
    } catch (error) {
      console.error('Error fetching location info:', error);
      setLocationInfo(`Latitude: ${lat}, Longitude: ${lng}`);
      onLocationSelect({ lat, lng, address: `Latitude: ${lat}, Longitude: ${lng}` });
    }
  };

  const handleMarkerHover = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
      const results = response.data.results;
      if (results.length > 0) {
        const locationDetails = results[0].formatted_address;
        setMapCenter({ lat: lat, lng: lng });
        setHoverInfo(`Location: ${locationDetails}`);
      } else {
        setHoverInfo(`Latitude: ${lat}, Longitude: ${lng}`);
      }
    } catch (error) {
      console.error('Error fetching location info:', error);
      setHoverInfo(`Latitude: ${lat}, Longitude: ${lng}`);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`);
      const results = response.data.results;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setMapCenter({ lat, lng });
        setSelectedLocation({ lat, lng });
        fetchLocationInfo(lat, lng);
      } else {
        console.error('Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  return (
    <>
      <div className="md:col-12 lg:col-12">
        <label htmlFor="Wallet">Address description</label>
        <InputText
          placeholder="Address description"
          name="name"
          className="w-full mt-3"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch()
          }}
        />
      </div>

      <div style={{ height: '400px', width: '100%', position: 'relative', borderRadius: '15px', padding: '10px'}}>
        <GoogleMapReact
          onClick={( e: any ) => fetchLocationInfo(e.lat, e.lng)}
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY as string }}
          center={mapCenter}
          defaultZoom={16}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >

          {markerData.map((marker, index) => (
            <div key={index} style={{ position: 'relative'}}>
              <Marker
                key={index}
                lat={marker.lat}
                lng={marker.lng}
                text={<i className='pi pi-map-marker' style={{ cursor: 'pointer', fontSize: '30px', color: 'red'}}></i>}
                onClick={() => setLocationInfo(`Latitude: ${marker.lat}, Longitude: ${marker.lng}, Info: ${marker.text}`)}
                onMouseEnter={() => handleMarkerHover(marker.lat, marker.lng)}
                onMouseLeave={() => setHoverInfo(null)}
              />
            </div>
          ))}

          {selectedLocation && (
            <div style={{ position: 'relative'}}>
              <Marker
                lat={selectedLocation.lat}
                lng={selectedLocation.lng}
                text={<i className='pi pi-map-marker' style={{ cursor: 'pointer', fontSize: '30px', color: 'red'}}></i>}
                onClick={() => setLocationInfo(`Latitude: ${selectedLocation.lat}, Longitude: ${selectedLocation.lng}`)}
                onMouseEnter={() => handleMarkerHover(selectedLocation.lat, selectedLocation.lng)}
                onMouseLeave={() => setHoverInfo(null)}
              />
            </div>
          )}

        </GoogleMapReact>
      </div>
    </>
  );
};

export default GoogleMap;
