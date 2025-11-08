import React from 'react';
import { Cloud, Droplets, Wind, Eye, Sunrise, Sunset, Gauge } from 'lucide-react';

const WeatherCard = ({ weatherData, loading, error }) => {
  if (loading) {
    return (
      <div style={styles.loadingCard}>
        <div style={styles.spinner}></div>
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorCard}>
        <Cloud size={48} color="#ff4444" />
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div style={styles.emptyCard}>
        <Cloud size={48} color="#888" />
        <p>Search for a city to see weather data</p>
      </div>
    );
  }

  const { city, country, weather, temperature, humidity, wind, visibility, sunrise, sunset, pressure } = weatherData;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Main Weather Card */}
      <div style={styles.mainCard}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.cityName}>{city}, {country}</h2>
            <p style={styles.description}>{weather?.description}</p>
          </div>
          {weather?.icon_url && (
            <img 
              src={weather.icon_url} 
              alt={weather.description}
              style={styles.weatherIcon}
            />
          )}
        </div>

        <div style={styles.temperature}>
          <span style={styles.tempValue}>{temperature?.current}°C</span>
          <span style={styles.feelsLike}>Feels like {temperature?.feels_like}°C</span>
        </div>

        <div style={styles.minMax}>
          <span>↑ {temperature?.max}°C</span>
          <span>↓ {temperature?.min}°C</span>
        </div>
      </div>

      {/* Details Grid */}
      <div style={styles.detailsGrid}>
        <div style={styles.detailCard}>
          <Droplets size={24} color="#00d4ff" />
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Humidity</span>
            <span style={styles.detailValue}>{humidity}%</span>
          </div>
        </div>

        <div style={styles.detailCard}>
          <Wind size={24} color="#00ff88" />
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Wind Speed</span>
            <span style={styles.detailValue}>{wind?.speed} km/h</span>
          </div>
        </div>

        <div style={styles.detailCard}>
          <Eye size={24} color="#ffa500" />
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Visibility</span>
            <span style={styles.detailValue}>{visibility} km</span>
          </div>
        </div>

        <div style={styles.detailCard}>
          <Gauge size={24} color="#ff4444" />
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Pressure</span>
            <span style={styles.detailValue}>{pressure} hPa</span>
          </div>
        </div>

        <div style={styles.detailCard}>
          <Sunrise size={24} color="#ffeb3b" />
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Sunrise</span>
            <span style={styles.detailValue}>{sunrise}</span>
          </div>
        </div>

        <div style={styles.detailCard}>
          <Sunset size={24} color="#ff9800" />
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Sunset</span>
            <span style={styles.detailValue}>{sunset}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    animation: 'fadeIn 0.5s ease-in-out'
  },
  mainCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '2rem',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  cityName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#fff'
  },
  description: {
    fontSize: '1.1rem',
    color: '#b0b0b0',
    margin: '0.5rem 0 0 0',
    textTransform: 'capitalize'
  },
  weatherIcon: {
    width: '80px',
    height: '80px',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
  },
  temperature: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem 0'
  },
  tempValue: {
    fontSize: '5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  feelsLike: {
    fontSize: '1rem',
    color: '#888',
    marginTop: '0.5rem'
  },
  minMax: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    fontSize: '1.2rem',
    color: '#fff'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem'
  },
  detailCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  detailLabel: {
    fontSize: '0.875rem',
    color: '#888',
    marginBottom: '0.25rem'
  },
  detailValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fff'
  },
  loadingCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid #00d4ff',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    animation: 'spin 1s linear infinite'
  },
  errorCard: {
    background: 'rgba(255, 68, 68, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 68, 68, 0.3)',
    color: '#ff4444'
  },
  emptyCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '3rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#888'
  }
};

export default WeatherCard;