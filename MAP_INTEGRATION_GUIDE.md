# Map Integration Guide - Optional Feature

## 📍 Overview

The `LocationMap` component is ready to use in the CompleteProfile form. It provides:
- Interactive map with OpenStreetMap tiles
- Click to select location
- Draggable marker
- Location search
- Reverse geocoding (coordinates → address)
- Current location detection

## 🚀 How to Enable Map Integration

### Step 1: Import the Component

In `frontend/src/pages/CompleteProfile.jsx`, add the import at the top:

```javascript
import LocationMap from '../components/LocationMap';
```

### Step 2: Add Map to the Form

Find the "Nationality & Residency Section" in the form (around line 700), and replace the address input section with:

```javascript
<div className="form-group">
  <label>Full Address</label>
  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleInputChange}
    placeholder="Street address, building, apartment number"
  />
</div>

{/* ADD THIS MAP COMPONENT */}
<div className="form-group">
  <label>Pin Your Location on Map</label>
  <div className="info-badge">
    <FontAwesomeIcon icon={faInfoCircle} />
    Click on the map to mark your exact location or search for a place
  </div>
  <LocationMap
    latitude={formData.latitude}
    longitude={formData.longitude}
    onLocationChange={(lat, lng) => {
      setFormData(prev => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString()
      }));
    }}
    address={formData.address}
    onAddressChange={(newAddress) => {
      setFormData(prev => ({
        ...prev,
        address: newAddress
      }));
    }}
  />
</div>
```

### Step 3: Add CSS Styles

Add these styles to `frontend/src/styles/CompleteProfile.css`:

```css
/* Map Styles */
.location-map-container {
  margin: 10px 0;
}

.map-search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.map-search-input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
}

.map-search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.map-search-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.map-search-button:hover {
  background: #5568d3;
}

.map-coordinates-display {
  margin-top: 10px;
  font-size: 13px;
  color: #666;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
}

.leaflet-map {
  z-index: 1;
}

/* Fix for Leaflet in React */
.leaflet-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

## ✨ Features

### 1. Interactive Map
- Click anywhere on the map to place a marker
- Marker is draggable - drag to adjust position
- Automatic map centering on marker placement

### 2. Location Search
- Type location name (e.g., "New York", "London", "Nairobi")
- Press Enter or click Search button
- Map automatically centers and places marker

### 3. Reverse Geocoding
- When you place a marker, it automatically:
  - Gets the full address
  - Updates the address field
  - Shows coordinates below map

### 4. Current Location
- On first load, asks for permission to use current location
- If granted, centers map on your location
- Places marker automatically

### 5. Coordinate Display
- Shows current coordinates below map
- Updates in real-time as you move marker
- Format: `Lat: -1.286389, Lng: 36.817223`

## 📱 Usage

### For Users:

1. **Search for Location**
   - Type city/place name in search box
   - Press Enter or click Search

2. **Click on Map**
   - Click anywhere to place marker
   - Address updates automatically

3. **Drag Marker**
   - Click and drag marker to adjust
   - Coordinates update in real-time

4. **Use Current Location**
   - Allow location permission when prompted
   - Map centers on your location

## 🔧 Customization

### Change Default Location

In `LocationMap.jsx`, line 19-20:

```javascript
// Default center (currently Nairobi, Kenya)
const defaultLat = latitude || -1.286389;  // Change this
const defaultLng = longitude || 36.817223; // Change this
```

### Change Default Zoom Level

Line 24:

```javascript
mapInstanceRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], 12); // Change 12 to your preferred zoom
```

Zoom levels:
- 1-5: World/Continent view
- 6-10: Country/Region view
- 11-14: City view (good default)
- 15-18: Street view
- 19+: Building level

### Change Map Style

You can use different tile providers. Replace line 26:

**Current (OpenStreetMap):**
```javascript
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(mapInstanceRef.current);
```

**Alternative Options:**

**1. CartoDB (Light theme):**
```javascript
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CartoDB',
  maxZoom: 19
}).addTo(mapInstanceRef.current);
```

**2. CartoDB (Dark theme):**
```javascript
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CartoDB',
  maxZoom: 19
}).addTo(mapInstanceRef.current);
```

**3. Satellite (Esri):**
```javascript
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri',
  maxZoom: 19
}).addTo(mapInstanceRef.current);
```

## 🌐 API Notes

The component uses **Nominatim API** (OpenStreetMap's geocoding service):
- **Free to use**
- **No API key required**
- **Rate limit:** 1 request per second
- **Usage policy:** https://operations.osmfoundation.org/policies/nominatim/

For production with high traffic, consider:
- Implementing request throttling
- Using a paid geocoding service (Google Maps, Mapbox)
- Self-hosting Nominatim

## 📦 Dependencies

Already installed in package.json:
- ✅ `leaflet` (^1.9.4)

## 🎨 Styling

The map integrates seamlessly with the form's purple gradient design:
- Rounded corners (8px)
- Purple focus states
- Matches input field styling
- Responsive container

## 🔒 Privacy

- Location permission is optional
- Only requested on first load
- User can decline and still use map manually
- Coordinates only sent to OpenStreetMap API
- No data stored on third-party servers

## 🐛 Troubleshooting

### Map Not Showing
1. Check console for errors
2. Verify Leaflet CSS is imported
3. Clear browser cache
4. Check map container has height set

### Marker Icons Missing
The component includes a fix for webpack marker icons. If still missing:
1. Ensure marker images are in `node_modules/leaflet/dist/images/`
2. Check browser network tab for 404 errors
3. Try clearing node_modules and reinstalling

### Search Not Working
1. Check internet connection
2. Nominatim API might be rate-limited (wait 1 second between searches)
3. Try more specific search terms
4. Check browser console for errors

## 📝 Example Integration

Complete example in CompleteProfile.jsx:

```javascript
// At the top of the file
import LocationMap from '../components/LocationMap';

// In the Nationality & Residency section
<div className="form-section">
  <h2 className="section-title">
    <FontAwesomeIcon icon={faPassport} />
    Nationality & Residency
  </h2>

  {/* ... other fields ... */}

  <div className="form-group">
    <label>Full Address</label>
    <input
      type="text"
      name="address"
      value={formData.address}
      onChange={handleInputChange}
      placeholder="Street address, building, apartment number"
    />
  </div>

  <div className="form-group">
    <label>Pin Your Location on Map</label>
    <div className="info-badge">
      <FontAwesomeIcon icon={faInfoCircle} />
      Click on the map to mark your exact location or search for a place
    </div>
    <LocationMap
      latitude={formData.latitude}
      longitude={formData.longitude}
      onLocationChange={(lat, lng) => {
        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));
      }}
      address={formData.address}
      onAddressChange={(newAddress) => {
        setFormData(prev => ({
          ...prev,
          address: newAddress
        }));
      }}
    />
  </div>
</div>
```

## ✅ Benefits

- ✅ Visual location selection
- ✅ Accurate coordinates
- ✅ Better user experience
- ✅ Reduces address entry errors
- ✅ Supports global locations
- ✅ Mobile-friendly
- ✅ No API key required
- ✅ Free to use

---

**Status:** Ready to integrate (optional feature)

The map component is complete and ready to add to the form whenever needed. All infrastructure is in place!

