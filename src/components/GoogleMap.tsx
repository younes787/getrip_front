import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { InputText } from 'primereact/inputtext';
import { LocationFromMap } from '../modules/getrip.modules';
import { ProviderFetchLocationInfo, ProviderHandleMarkerHover, ProviderHandleSearch, ProviderInitializeMapCenter } from '../Services/providerRequests';

interface MarkerProps {
  lat: number;
  lng: number;
  text?: string | any;
  icon?: string | any;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface GoogleMapProps {
  markerData?: { lat: number; lng: number; text?: string }[];
  country?: string;
  province?: string;
  city?: string;
  onLocationSelect?: (location: LocationFromMap) => void;
}

const Marker: React.FC<MarkerProps> = ({ lat, lng, text, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -100%)',
      cursor: 'pointer',
    }}
  >
    <svg height="24" width="24" viewBox="0 0 24 24">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 16 8 16s8-10.5 8-16c0-4.42-3.58-8-8-8z" fill="red" />
    </svg>
    {text && <div style={{ textAlign: 'center', marginTop: '-5px' }}>{text}</div>}
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
        const location = `${city ? city + ', ' : ''}${province ? province + ', ' : ''}${country || ''}`;
        ProviderInitializeMapCenter(location)
        .then((res) => {
          const results = res?.data.results;
          if (results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            fetchLocationInfo(lat, lng);
          }
        });
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
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
      fetchLocationInfo(lat, lng);
    });
  };

  const fetchLocationInfo = async (lat: number, lng: number) => {
    try {
      ProviderFetchLocationInfo(lat, lng)
      .then((res) => {
        const results = res?.data.results;
        if (results.length > 0) {
          const locationDetails = results[0].formatted_address;
          setSearchQuery(locationDetails);
          setLocationInfo(`Location: ${locationDetails}`);
          setSelectedLocation({ lat, lng });
          setMapCenter({ lat, lng });
          if(onLocationSelect) {
            onLocationSelect({ lat, lng, address: results });
          }
        } else {
          setLocationInfo(`Latitude: ${lat}, Longitude: ${lng}`);
          if(onLocationSelect) {
            onLocationSelect({ lat, lng, address: `Latitude: ${lat}, Longitude: ${lng}` });
          }
        }
      });
    } catch (error) {
      console.error('Error fetching location info:', error);
      setLocationInfo(`Latitude: ${lat}, Longitude: ${lng}`);
      if(onLocationSelect) {
        onLocationSelect({ lat, lng, address: `Latitude: ${lat}, Longitude: ${lng}` });
      }
    }
  };

  const handleMarkerHover = async (lat: number, lng: number) => {
    try {
      ProviderHandleMarkerHover(lat, lng)
      .then((res) => {
        const results = res?.data.results;
        if (results.length > 0) {
          const locationDetails = results[0].formatted_address;
          setHoverInfo(`Location: ${locationDetails}`);
        } else {
          setHoverInfo(`Latitude: ${lat}, Longitude: ${lng}`);
        }
      });
    } catch (error) {
      console.error('Error fetching location info:', error);
      setHoverInfo(`Latitude: ${lat}, Longitude: ${lng}`);
    }
  };

  const handleSearch = async () => {
    try {
      ProviderHandleSearch(searchQuery)
      .then((res) => {
        const results = res?.data.results;
        if (results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          fetchLocationInfo(lat, lng);
        } else {
          console.error('Location not found');
        }
      });
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
            handleSearch();
          }}
        />
      </div>

      <div style={{ height: '400px', width: '100%', position: 'relative', borderRadius: '15px', padding: '10px'}}>
        <GoogleMapReact
          onClick={(e: any) => fetchLocationInfo(e.lat, e.lng)}
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY as string }}
          center={mapCenter}
          defaultZoom={16}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >
          {markerData.map((marker, index) => (
            <Marker
              key={index}
              lat={marker.lat}
              lng={marker.lng}
              text={marker.text}
              onClick={() => setLocationInfo(`Latitude: ${marker.lat}, Longitude: ${marker.lng}, Info: ${marker.text}`)}
              onMouseEnter={() => handleMarkerHover(marker.lat, marker.lng)}
              onMouseLeave={() => setHoverInfo(null)}
            />
          ))}

          {selectedLocation && (
            <Marker
              lat={selectedLocation.lat}
              lng={selectedLocation.lng}
              onClick={() => setLocationInfo(`Latitude: ${selectedLocation.lat}, Longitude: ${selectedLocation.lng}`)}
              onMouseEnter={() => false}
              onMouseLeave={() => false}
            />
          )}
        </GoogleMapReact>
      </div>
      <div>{locationInfo}</div>
      <div>{hoverInfo}</div>
    </>
  );
};


export default GoogleMap;
