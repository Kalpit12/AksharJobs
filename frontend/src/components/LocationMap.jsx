import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMap = ({ latitude, longitude, onLocationChange, address, onAddressChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      // Default center (Nairobi, Kenya - can be changed)
      const defaultLat = latitude || -1.286389;
      const defaultLng = longitude || 36.817223;
      
      mapInstanceRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Add click event to map
      mapInstanceRef.current.on('click', (e) => {
        setMarker(e.latlng.lat, e.latlng.lng);
      });

      // Try to get user's current location
      if (navigator.geolocation && !latitude && !longitude) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          mapInstanceRef.current.setView([lat, lng], 13);
          setMarker(lat, lng);
        });
      } else if (latitude && longitude) {
        setMarker(latitude, longitude);
      }
    }

    // Update marker if coordinates change externally
    if (mapInstanceRef.current && latitude && longitude) {
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        setMarker(latitude, longitude);
      }
      mapInstanceRef.current.setView([latitude, longitude], 13);
    }
  }, [latitude, longitude]);

  const setMarker = (lat, lng) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }
    
    // Create new draggable marker
    markerRef.current = L.marker([lat, lng], {
      draggable: true
    }).addTo(mapInstanceRef.current);

    // Update coordinates on drag
    markerRef.current.on('dragend', (e) => {
      const position = markerRef.current.getLatLng();
      setMarker(position.lat, position.lng);
    });

    // Call the callback with new coordinates
    if (onLocationChange) {
      onLocationChange(lat, lng);
    }

    // Reverse geocode to get address
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        if (data.display_name && onAddressChange) {
          onAddressChange(data.display_name);
        }
      })
      .catch(error => console.log('Geocoding error:', error));
  };

  const searchLocation = (query) => {
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          mapInstanceRef.current.setView([lat, lng], 13);
          setMarker(lat, lng);
        } else {
          alert('Location not found. Please try a different search term.');
        }
      })
      .catch(error => {
        console.log('Search error:', error);
        alert('Error searching location. Please try again.');
      });
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchLocation(searchInputRef.current.value);
    }
  };

  return (
    <div className="location-map-container">
      <div className="map-search-container">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a location..."
          onKeyPress={handleSearchKeyPress}
          className="map-search-input"
        />
        <button 
          type="button" 
          onClick={() => searchLocation(searchInputRef.current.value)}
          className="map-search-button"
        >
          Search
        </button>
      </div>
      
      <div 
        ref={mapRef} 
        className="leaflet-map"
        style={{ 
          width: '100%', 
          height: '400px', 
          borderRadius: '8px', 
          border: '2px solid #e0e0e0',
          marginTop: '10px'
        }}
      />
      
      <div className="map-coordinates-display">
        <strong>Selected Coordinates:</strong>{' '}
        {latitude && longitude 
          ? `Lat: ${parseFloat(latitude).toFixed(6)}, Lng: ${parseFloat(longitude).toFixed(6)}`
          : 'Click on the map to select a location'
        }
      </div>
    </div>
  );
};

export default LocationMap;

