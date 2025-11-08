import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Layers } from 'lucide-react';



const MapComponent = ({ onLocationSelect, currentWeatherData }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [mapStyle, setMapStyle] = useState('streets-v12');
  const [zoom, setZoom] = useState(2);
  const [showQuickJump, setShowQuickJump] = useState(false);

  useEffect(() => {
    // Fetch Mapbox token from backend
    fetch('http://localhost:5000/api/mapbox-token')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          mapboxgl.accessToken = data.token;
          initializeMap(data.token);
        }
      })
      .catch(err => {
        console.error('Failed to load Mapbox token:', err);
      });
  }, []);

  const initializeMap = (token) => {
    if (map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [0, 20],
      zoom: zoom,
      projection: 'globe'
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.current.on('style.load', () => {
      map.current.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      addMarker(lng, lat);
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    });

    map.current.on('zoom', () => {
      setZoom(map.current.getZoom().toFixed(2));
    });
  };

  const addMarker = (lng, lat, cityName = null) => {
    if (marker.current) {
      marker.current.remove();
    }

    const localTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const popupContent = `
      <div style="padding: 0.5rem;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #ff4444; font-weight: bold;">
          ${cityName || 'Selected Location'}
        </h4>
        <p style="margin: 0; font-size: 0.875rem; color: #000 ">
          🌐 ${lat.toFixed(4)}°, ${lng.toFixed(4)}°
        </p>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #000">
          🕐 Local Time: ${localTime}
        </p>
      </div>
    `;

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(popupContent);

    marker.current = new mapboxgl.Marker({
      color: '#00d4ff',
      draggable: false
    })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map.current);

    marker.current.togglePopup();

    map.current.flyTo({
      center: [lng, lat],
      zoom: 10,
      duration: 2000
    });
  };

  useEffect(() => {
    if (currentWeatherData && currentWeatherData.coordinates && map.current) {
      const { lat, lon } = currentWeatherData.coordinates;
      addMarker(lon, lat, currentWeatherData.city);
    }
  }, [currentWeatherData]);

  const changeMapStyle = (style) => {
    if (map.current) {
      setMapStyle(style);
      map.current.setStyle(`mapbox://styles/mapbox/${style}`);
    }
  };

  const goToLocation = (city) => {
    const locations = {
      'London': { coords: [-0.1276, 51.5074] },
      'New York': { coords: [-74.0060, 40.7128] },
      'Tokyo': { coords: [139.6917, 35.6895] },
      'Paris': { coords: [2.3522, 48.8566] },
      'Mumbai': { coords: [72.8777, 19.0760] },
      'Sydney': { coords: [151.2093, -33.8688] }
    };

    const location = locations[city];
    if (location && map.current) {
      map.current.flyTo({
        center: location.coords,
        zoom: 10,
        duration: 2000
      });
      addMarker(location.coords[0], location.coords[1], city);
    }
  };

  return (
    <>
      <style>{`
      .mapboxgl-map,
      .mapboxgl-canvas {
        filter: none !important;
        backdrop-filter: none !important;
        image-rendering: crisp-edges !important;
      }
    `}</style>
      <div style={styles.container}>
        <style>{`
        .mapbox-control-btn {
          transition: all 0.3s ease;
        }
        .mapbox-control-btn:hover {
          background: rgba(0, 212, 255, 0.2);
          transform: scale(1.05);
        }
      `}</style>


        <div style={styles.controlPanel}>
          <div style={styles.controlGroup}>
            <span style={styles.controlLabel}>
              <Layers size={16} />
              Map Style:
            </span>
            <button
              className="mapbox-control-btn"
              style={{
                ...styles.styleBtn,
                ...(mapStyle === 'streets-v12' ? styles.activeBtn : {})
              }}
              onClick={() => changeMapStyle('streets-v12')}
            >
              Streets
            </button>
            <button
              className="mapbox-control-btn"
              style={{
                ...styles.styleBtn,
                ...(mapStyle === 'satellite-v9' ? styles.activeBtn : {})
              }}
              onClick={() => changeMapStyle('satellite-v9')}
            >
              Satellite
            </button>
            <button
              className="mapbox-control-btn"
              style={{
                ...styles.styleBtn,
                ...(mapStyle === 'dark-v11' ? styles.activeBtn : {})
              }}
              onClick={() => changeMapStyle('dark-v11')}
            >
              Dark
            </button>
            <button
              className="mapbox-control-btn"
              style={{
                ...styles.styleBtn,
                ...(mapStyle === 'light-v11' ? styles.activeBtn : {})
              }}
              onClick={() => changeMapStyle('light-v11')}
            >
              Light
            </button>
          </div>



          <div style={styles.zoomInfo}>
            Zoom: {zoom}x
          </div>
          {/* ✅ Quick Jump Popup Section */}
          <div style={styles.controlGroup}>
            <span style={styles.controlLabel}>
              <MapPin size={16} />
              Quick Jump:
            </span>

            {/* Button to toggle popup */}
            <button
              className="mapbox-control-btn"
              style={styles.cityBtn}
              onClick={() => setShowQuickJump(!showQuickJump)}
            >
              🌍 Quick Jump
            </button>

            {/* Popup with city options */}
            {showQuickJump && (
              <div style={styles.popupMenu}>
                {['London', 'New York', 'Tokyo', 'Paris', 'Mumbai', 'Sydney'].map((city) => (
                  <button
                    key={city}
                    className="mapbox-control-btn"
                    style={styles.popupCityBtn}
                    onClick={() => {
                      goToLocation(city);
                      setShowQuickJump(false);
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        <div ref={mapContainer} style={styles.map} />

        <div style={styles.mapInfo}>
          <MapPin size={16} color="#00d4ff" />

        </div>

        {currentWeatherData && currentWeatherData.coordinates && (
          <div style={styles.locationCard}>
            <div style={styles.locationIcon}>📍</div>
            <div>
              <div style={styles.locationName}>
                {currentWeatherData.city || 'Unknown'}, {currentWeatherData.country || ''}
              </div>
              <div style={styles.locationCoords}>
                {currentWeatherData.coordinates.lat?.toFixed(4)}°N,
                {' '}{currentWeatherData.coordinates.lon?.toFixed(4)}°E
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '600px',
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'none',
    filter: 'none',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  controlPanel: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'none',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '90%'
  },
  popupMenu: {
    position: 'absolute',
    top: '2.5rem',
    left: '6.5rem',
    background: 'rgba(0, 0, 0, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    zIndex: 10,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  },

  popupCityBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
    textAlign: 'left',
    width: '120px',
  },
  controlGroup: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  controlLabel: {
    color: '#888',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 'bold',
    minWidth: '100px'
  },
  styleBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  activeBtn: {
    background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
    border: '1px solid rgba(0, 212, 255, 0.5)'
  },
  cityBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  zoomInfo: {
    color: '#888',
    fontSize: '0.75rem',
    textAlign: 'right'
  },
  mapInfo: {
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    zIndex: 1
  },
  locationCard: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    zIndex: 1,
    minWidth: '250px'
  },
  locationIcon: {
    fontSize: '2rem'
  },
  locationName: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  locationCoords: {
    color: '#888',
    fontSize: '0.75rem',
    marginTop: '0.25rem'
  }

};

export default MapComponent;