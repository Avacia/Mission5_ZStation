// MapComponent.jsx
import React, { useState, useEffect } from 'react';
import styles from './Mapcomponent.module.css'; 

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import StationPin from '/StationPin.png';

const MapComponent = () => {
  const [address, setAddress] = useState('');
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState({ lat: -40.88694417577929, lng: 172.25732675689105 });
  const [zoom, setZoom] = useState(5.6);
  const apiKey = process.env.REACT_APP_API_KEY;


  useEffect(() => {
    // Simulating data fetch - replace this with actual data fetching logic
    const fetchData = async () => {
      const mockData = {
        address: "123 Example St, Wellington",
        locationData: [
          {
            name: "Z 15th Ave",
            address: "10-18 Fifteenth Avenue, Tauranga",
            region: "Bay of Plenty",
            latitude: -37.6964,
            longitude: 176.1581,
            payAtPump: true,
            hours: "Open 24 hours",
            fuelPrice: "$2.00"
          },
          {
            name: "Z Aerodrone Road truck stop",
            address: "Aerodrone Road",
            region: "Canterbury",
            latitude: -43.4832,
            longitude: 172.5369,
            payAtPump: false,
            hours: "Open 24 hours",
            fuelPrice: "$2.00"
          },
          {
            name: "Z Hornby North truck stop",
            address: "74 Carmen Road",
            region: "Canterbury",
            latitude: -43.5372,
            longitude: 172.5269,
            payAtPump: false,
            hours: "Open 24 hours",
            fuelPrice: "$2.00"
          }
        ]
      };

      setAddress(mockData.address);
      processLocationData(mockData.locationData);
    };

    fetchData();
  }, []);

  const processLocationData = (data) => {
    if (Array.isArray(data)) {
      const processedLocations = data.map(location => ({
        name: location.name,
        address: location.address,
        region: location.region,
        lat: location.latitude,
        lng: location.longitude,
        payAtPump: location.payAtPump,
        hours: location.hours,
        fuelPrice: location.fuelPrice
      }));
      setLocations(processedLocations);
    } else {
      console.error("Location data is not available or is not an array.");
    }
  };

  const handleMarkerClick = (location) => {
    setCenter({ lat: location.lat, lng: location.lng });
    setZoom(12);
  };

  const LocationDetails = () => (
    <div className="location-details">
      {locations.map((location) => (
        <div key={location.name} className="location-item">
          <h2>{location.name}</h2>
          <p>{location.address}</p>
          {location.payAtPump && <p>24/7 pay at pump</p>}
          <p>{location.hours}</p>
          <p>Services</p>
          <p>Fuel Prices: {location.fuelPrice} per litre</p>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '600px', margin: '20px 0' }}>
      <div style={{ width: '30%', overflowY: 'auto' }}>
        <LocationDetails />
      </div>
      <div style={{ width: '70%', height: '100%' }}>

        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={zoom}
            onClick={() => setZoom(5.6)}
          >
            {locations.map((location) => (
              <Marker
                key={`${location.lat}-${location.lng}`}
                position={{ lat: location.lat, lng: location.lng }}
                onClick={() => handleMarkerClick(location)}
              />
            ))}
            {address && (
              <Marker
                position={center}
                icon={StationPin}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};


export default MapComponent;