import React, { Suspense, lazy } from 'react';

// Lazy load the map component
const MapComponent = lazy(() => import('./MapComponent'));

const LazyMap = ({ mapRef, onMapClick, onMarkerDrag }) => {
  return (
    <Suspense fallback={
      <div 
        ref={mapRef}
        style={{ 
          width: '100%', 
          height: '400px', 
          borderRadius: '8px', 
          border: '2px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa',
          color: '#666'
        }}
      >
        Loading map...
      </div>
    }>
      <MapComponent 
        mapRef={mapRef}
        onMapClick={onMapClick}
        onMarkerDrag={onMarkerDrag}
      />
    </Suspense>
  );
};

export default LazyMap;
