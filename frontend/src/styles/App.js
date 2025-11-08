import React, { useState, useEffect } from 'react';
import { MapPin } from "lucide-react";
import { Globe, Cloud, Droplets, Wind, AlertTriangle, TrendingUp, Map as MapIcon, Bell, Search } from 'lucide-react';
import { getWeather, searchCity, getWeatherByCoords } from './services/api';
import WeatherCard from './components/WeatherCard';
import CitySearch from './components/CitySearch';
import MapComponent from './components/MapComponent';
import TemperatureChart from './components/TemperatureChart';
import ClimateMetricsChart from './components/ClimateMetricsChart';
import SeaLevelPrediction from './components/SeaLevelPrediction';
import RealTimeSeaLevel from './components/RealTimeSeaLevel';

import CitySeaLevelPredictor from './components/CitySeaLevelPredictor';



/** ✅ Reusable timezone resolver (moved to top-level so all functions can use it) */
const getCityTimezone = (cityName) => {
  const timezoneMap = {
    'london': 'Europe/London',
    'new york': 'America/New_York',
    'tokyo': 'Asia/Tokyo',
    'paris': 'Europe/Paris',
    'dubai': 'Asia/Dubai',
    'sydney': 'Australia/Sydney',
    'mumbai': 'Asia/Kolkata',
    'delhi': 'Asia/Kolkata',
    'singapore': 'Asia/Singapore',
    'los angeles': 'America/Los_Angeles',
    'cairo': 'Africa/Cairo',
    'moscow': 'Europe/Moscow',
    'beijing': 'Asia/Shanghai',
    'toronto': 'America/Toronto',
    'chicago': 'America/Chicago',
    'bangkok': 'Asia/Bangkok',
    'amsterdam': 'Europe/Amsterdam',
    'berlin': 'Europe/Berlin',
    'rome': 'Europe/Rome',
    'madrid': 'Europe/Madrid',
    'barcelona': 'Europe/Madrid',
    'mexico city': 'America/Mexico_City',
    'sao paulo': 'America/Sao_Paulo',
    'buenos aires': 'America/Argentina/Buenos_Aires',
    'hong kong': 'Asia/Hong_Kong',
    'shanghai': 'Asia/Shanghai',
    'seoul': 'Asia/Seoul',
    'jakarta': 'Asia/Jakarta',
    'manila': 'Asia/Manila',
    'karachi': 'Asia/Karachi',
    'lagos': 'Africa/Lagos',
    'nairobi': 'Africa/Nairobi',
    'johannesburg': 'Africa/Johannesburg',
    'riyadh': 'Asia/Riyadh',
    'tel aviv': 'Asia/Jerusalem',
    'athens': 'Europe/Athens',
    'vienna': 'Europe/Vienna',
    'prague': 'Europe/Prague',
    'warsaw': 'Europe/Warsaw',
    'stockholm': 'Europe/Stockholm',
    'oslo': 'Europe/Oslo',
    'copenhagen': 'Europe/Copenhagen',
    'helsinki': 'Europe/Helsinki',
    'dublin': 'Europe/Dublin',
    'lisbon': 'Europe/Lisbon',
    'brussels': 'Europe/Brussels',
    'zurich': 'Europe/Zurich',
    'geneva': 'Europe/Zurich',
    'milan': 'Europe/Rome',
    'venice': 'Europe/Rome',
    'florence': 'Europe/Rome',
    'vancouver': 'America/Vancouver',
    'montreal': 'America/Toronto',
    'boston': 'America/New_York',
    'miami': 'America/New_York',
    'san francisco': 'America/Los_Angeles',
    'seattle': 'America/Los_Angeles',
    'denver': 'America/Denver',
    'phoenix': 'America/Phoenix',
    'atlanta': 'America/New_York',
    'dallas': 'America/Chicago',
    'houston': 'America/Chicago',
    'washington': 'America/New_York',
    'las vegas': 'America/Los_Angeles',
    'auckland': 'Pacific/Auckland',
    'wellington': 'Pacific/Auckland',
    'melbourne': 'Australia/Melbourne',
    'brisbane': 'Australia/Brisbane',
    'perth': 'Australia/Perth',
    'adelaide': 'Australia/Adelaide'
  };

  const cityLower = (cityName || '').toLowerCase().trim();
  return timezoneMap[cityLower] || 'Asia/Kolkata'; // Default to India time
};

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Weather state
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [currentCity, setCurrentCity] = useState('London');
  const [cityTimezone, setCityTimezone] = useState('Asia/Kolkata'); // Default timezone
  const [displayCity, setDisplayCity] = useState('Delhi');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load default city weather on mount
  useEffect(() => {
    handleSearchCity('Delhi');
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: cityTimezone
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: cityTimezone
    });
  };

  /** ✅ Search flow by city name */
  const handleSearchCity = async (cityName) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      setCurrentCity(cityName);

      const timezone = getCityTimezone(cityName);
      setCityTimezone(timezone);
      setDisplayCity(cityName);

      const result = await getWeather(cityName);
      if (result.success) {
        setWeatherData(result.data);
      } else {
        setWeatherError(result.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      console.error('Error in handleSearchCity:', err);
      setWeatherError('An unexpected error occurred');
    } finally {
      setWeatherLoading(false);
    }
  };

  /** ✅ Selection flow from map or search when coords are known */
  const handleCitySelect = async (cityName, lat, lon) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      setCurrentCity(cityName);

      const timezone = getCityTimezone(cityName);
      setCityTimezone(timezone);
      setDisplayCity(cityName);

      const result = await getWeatherByCoords(lat, lon);
      if (result.success) {
        setWeatherData(result.data);
        if (result.data.city) {
          setDisplayCity(result.data.city);
        }
      } else {
        setWeatherError(result.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      console.error('Error in handleCitySelect:', err);
      setWeatherError('An unexpected error occurred');
    } finally {
      setWeatherLoading(false);
    }
  };

  return (
    <div className={isDarkMode ? 'app dark-mode' : 'app light-mode'}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }

        .app {
          min-height: 100vh;
          transition: all 0.3s ease;
        }

        .dark-mode {
          background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
          color: #eaeaea;
        }

        .light-mode {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
        }

        .navbar {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
        }

        .nav-brand-icon {
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .nav-menu {
          display: flex;
          gap: 1rem;
          list-style: none;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #fff;
          border: 1px solid transparent;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .theme-toggle {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          padding: 0.75rem;
          border-radius: 50%;
          cursor: pointer;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .hero {
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(0, 0, 0, 0.2);
          margin: 2rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #b0b0b0;
          margin-bottom: 2rem;
        }

        .time-display {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .time-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem 2rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 200px;
        }

        .time-label {
          font-size: 0.875rem;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .time-value {
          font-size: 2rem;
          font-weight: bold;
          color: #00d4ff;
        }

        .main-content {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .weather-section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .dashboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .card-content {
          color: #b0b0b0;
          line-height: 1.6;
        }

        .card-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #00d4ff;
          margin: 1rem 0;
        }

        .card-label {
          font-size: 0.875rem;
          color: #888;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .status-green { background: #00c851; }
        .status-yellow { background: #ffa500; }
        .status-red { background: #ff4444; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .coming-soon {
          display: inline-block;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
          margin-left: 0.5rem;
        }

        .live-badge {
          display: inline-block;
          background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
          margin-left: 0.5rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .alert-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ff4444;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .dashboard {
            grid-template-columns: 1fr;
          }
          
          .time-display {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <Globe className="nav-brand-icon" size={32} />
          <span>Climate Alert System</span>
        </div>

        <ul className="nav-menu">
          <li
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={20} />
            <span>Dashboard</span>
          </li>
          <li
            className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <MapIcon size={20} />
            <span>Global Map</span>
          </li>
          <li
            className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <div style={{ position: 'relative' }}>
              <Bell size={20} />
              <span className="alert-badge">3</span>
            </div>
            <span>Alerts</span>
          </li>
        </ul>

        <button
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">🌍 Global Climate Monitoring</h1>
        <p className="hero-subtitle">
          Real-Time Weather Data & Climate Predictions
        </p>

        <div className="time-display">
          <div className="time-card">
            <div className="time-label">📅 Current Date</div>
            <div className="time-value" style={{ fontSize: '1.25rem' }}>
              {formatDate(currentTime)}
            </div>
          </div>
          <div className="time-card">
            <div className="time-label">🕐 Current Time</div>
            <div className="time-value">
              {formatTime(currentTime)}
            </div>
          </div>
          <div className="time-card">
            <div className="time-label">📍 Viewing</div>
            <div className="time-value" style={{ fontSize: '1.25rem' }}>
              {displayCity}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        {/* Weather Section */}
        <section className="weather-section">
          <h2 className="section-title">
            <Cloud size={32} />
            Real-Time Weather
            <span className="live-badge">LIVE</span>
          </h2>

          <CitySearch
            onCitySelect={handleCitySelect}
            onSearch={handleSearchCity}
          />

          <WeatherCard
            weatherData={weatherData}
            loading={weatherLoading}
            error={weatherError}
          />
        </section>

        {/* Map Section - NEW for Day 2 */}
        <section className="weather-section">
          <h2 className="section-title">
            <MapPin size={32} />
            Interactive Global Map
            <span className="live-badge">3D GLOBE</span>
          </h2>

          <MapComponent
            onLocationSelect={async (lat, lon) => {
              // When user clicks on map, fetch weather for that location
              const result = await getWeatherByCoords(lat, lon);
              if (result.success) {
                setWeatherData(result.data);
              }
            }}
            currentWeatherData={weatherData}
          />
        </section>

        {/* Climate Trends Section - NEW for Day 3 */}
        <section className="weather-section">
          <h2 className="section-title">
            <TrendingUp size={32} />
            Historical Climate Data
            <span className="live-badge">1950-2024</span>
          </h2>

          <TemperatureChart />
        </section>

        {/* Real-Time Sea Level Data - NEW */}
        <section className="weather-section">
          <RealTimeSeaLevel />
        </section>
        {/* City-Specific Sea Level Predictions - ML Powered */}
        <section className="weather-section">
          <h2 className="section-title">
            <Droplets size={32} />
            City Sea Level Predictions
            <span className="live-badge">🤖 ML POWERED</span>
          </h2>

          <CitySeaLevelPredictor />
        </section>
        {/* Climate Metrics Section */}
        <section className="weather-section">
          <ClimateMetricsChart />
        </section>



        {/* Dashboard Cards */}
        <section>
          <h2 className="section-title">
            <TrendingUp size={32} />
            Climate Dashboard
          </h2>

          <div className="dashboard">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <Droplets size={24} />
                </div>
                <div>
                  <h3 className="card-title">Sea Level Rise</h3>
                  <span className="coming-soon">Coming Day 4</span>
                </div>
              </div>
              <div className="card-content">
                <div className="card-value">+-- cm</div>
                <div className="card-label">Projected by 2030</div>
                <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                  AI-powered predictions for coastal cities worldwide
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="card-title">Flood Risk</h3>
                  <span className="coming-soon">Coming Day 5</span>
                </div>
              </div>
              <div className="card-content">
                <div className="status-grid">
                  <div className="status-item">
                    <div className="status-dot status-green"></div>
                    <span>Low Risk Areas</span>
                  </div>
                  <div className="status-item">
                    <div className="status-dot status-yellow"></div>
                    <span>Medium Risk</span>
                  </div>
                  <div className="status-item">
                    <div className="status-dot status-red"></div>
                    <span>High Risk Zones</span>
                  </div>
                  <div className="status-item">
                    <div className="status-dot status-red"></div>
                    <span>Critical Alert</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <Wind size={24} />
                </div>
                <div>
                  <h3 className="card-title">Climate Trends</h3>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon">
                        <Wind size={24} />
                      </div>
                      <div>
                        <span className="live-badge">LIVE</span>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-value">+1.2°C</div>
                      <div className="card-label">Global Temperature Rise Since 1950</div>
                      <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                        View complete historical data visualization above
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="card-value">+1.2°C</div>
                <div className="card-label">Global Temperature Rise Since 1950</div>
                <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                  Historical data visualization with CO₂ correlation
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="card-title">Landslide Risk</h3>
                  <span className="coming-soon">Coming Day 5</span>
                </div>
              </div>
              <div className="card-content">
                <div className="card-label">Risk Assessment Based On:</div>
                <ul style={{ marginTop: '1rem', listStyle: 'none', lineHeight: '2' }}>
                  <li>📊 Terrain Slope Analysis</li>
                  <li>🌧️ Rainfall Intensity</li>
                  <li>🌳 Vegetation Coverage</li>
                  <li>💧 Soil Moisture Levels</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="card-title">Smart Alerts</h3>
                  <span className="coming-soon">Coming Day 6</span>
                </div>
              </div>
              <div className="card-content">
                <div className="card-value">3</div>
                <div className="card-label">Active Weather Warnings</div>
                <div style={{ marginTop: '1rem' }}>
                  <div className="status-item" style={{ marginBottom: '0.5rem' }}>
                    <div className="status-dot status-yellow"></div>
                    <span>Heavy Rainfall Expected</span>
                  </div>
                  <div className="status-item" style={{ marginBottom: '0.5rem' }}>
                    <div className="status-dot status-red"></div>
                    <span>Flood Watch Active</span>
                  </div>
                  <div className="status-item">
                    <div className="status-dot status-yellow"></div>
                    <span>High Temperature Alert</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">
                  <MapIcon size={24} />
                </div>
                <div>
                  <h3 className="card-title">Interactive Map</h3>

                </div>
              </div>
              <div className="card-content">
                <div className="card-label">Features:</div>
                <ul style={{ marginTop: '1rem', listStyle: 'none', lineHeight: '2' }}>
                  <li>🌐 3D Globe Visualization</li>
                  <li>🎯 Location-based Weather</li>
                  <li>📍 City Markers</li>
                  <li>🗺️ Multiple Map Styles</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
