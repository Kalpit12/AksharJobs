import React, { useEffect, useRef, useState } from 'react';

const MapComponent = ({ mapRef, onMapClick, onMarkerDrag }) => {
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      if (mapRef.current && !mapInstanceRef.current && !mapLoaded) {
        try {
          // Dynamic import of Leaflet
          const L = (await import('leaflet')).default;
          
          // Fix Leaflet default marker icon issue
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
          });

          mapInstanceRef.current = L.map(mapRef.current).setView([-1.286389, 36.817223], 12);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(mapInstanceRef.current);

          mapInstanceRef.current.on('click', (e) => {
            if (onMapClick) {
              onMapClick(e.latlng.lat, e.latlng.lng);
            }
          });

          // Try to get user's current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              mapInstanceRef.current.setView([lat, lng], 13);
              if (onMapClick) {
                onMapClick(lat, lng);
              }
            });
          }
          
          setMapLoaded(true);
        } catch (error) {
          console.error('Failed to load map:', error);
        }
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapRef, onMapClick, mapLoaded]);

  const setMarker = (lat, lng) => {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }
    
    if (mapInstanceRef.current) {
      // We need to get L from the map instance
      const L = mapInstanceRef.current.constructor;
      markerRef.current = L.marker([lat, lng], {
        draggable: true
      }).addTo(mapInstanceRef.current);

      markerRef.current.on('dragend', (e) => {
        const position = markerRef.current.getLatLng();
        if (onMarkerDrag) {
          onMarkerDrag(position.lat, position.lng);
        }
      });
    }
  };

  // Expose setMarker function to parent
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMarker = setMarker;
    }
  }, [mapRef]);

  return null; // This component only manages the map, doesn't render anything
};

export default MapComponent;
