import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';

import { temperatureAnomalyData, co2Data } from '../../data/climateData';


const TemperatureChart = () => {
  const [showCO2, setShowCO2] = useState(false);
  const [yearRange, setYearRange] = useState([1950, 2024]);

  // Filter data based on year range
  const filteredTempData = temperatureAnomalyData.filter(
    d => d.year >= yearRange[0] && d.year <= yearRange[1]
  );

  const filteredCO2Data = co2Data.filter(
    d => d.year >= yearRange[0] && d.year <= yearRange[1]
  );

  // Merge temperature and CO2 data
  const mergedData = filteredTempData.map(tempItem => {
    const co2Item = filteredCO2Data.find(c => c.year === tempItem.year);
    return {
      ...tempItem,
      co2: co2Item ? co2Item.co2 : null
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipYear}>Year: {payload[0].payload.year}</p>
          <p style={styles.tooltipTemp}>
            🌡️ Temperature: {payload[0].payload.temp}°C
          </p>
          <p style={styles.tooltipAnomaly}>
            📊 Anomaly: {payload[0].payload.anomaly > 0 ? '+' : ''}{payload[0].payload.anomaly}°C
          </p>
          {showCO2 && payload[0].payload.co2 && (
            <p style={styles.tooltipCO2}>
              💨 CO₂: {payload[0].payload.co2} ppm
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <style>{`
        .chart-btn {
          transition: all 0.3s ease;
        }
        .chart-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .range-slider {
          width: 100%;
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <TrendingUp size={28} color="#ff6b6b" />
          <h3 style={styles.title}>Global Temperature Rise (1950-2024)</h3>
        </div>
        <div style={styles.controls}>
          <button
            className="chart-btn"
            style={{
              ...styles.toggleBtn,
              ...(showCO2 ? styles.toggleBtnActive : {})
            }}
            onClick={() => setShowCO2(!showCO2)}
          >
            {showCO2 ? '📊 Hide CO₂' : '💨 Show CO₂'}
          </button>
        </div>
      </div>

      {/* Warning Alert */}
      <div style={styles.alert}>
        <AlertCircle size={20} color="#ffa500" />
        <div style={styles.alertText}>
          <strong>Climate Alert:</strong> Global temperature has increased by 
          <strong style={{ color: '#ff6b6b' }}> +1.2°C</strong> since pre-industrial times. 
          The last 9 years (2015-2023) were the warmest on record.
        </div>
      </div>

      {/* Main Chart */}
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={mergedData}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="year" 
              stroke="#888"
              style={{ fontSize: '0.875rem' }}
            />
            <YAxis 
              yAxisId="temp"
              stroke="#ff6b6b"
              style={{ fontSize: '0.875rem' }}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#ff6b6b' }}
            />
            {showCO2 && (
              <YAxis 
                yAxisId="co2"
                orientation="right"
                stroke="#4ecdc4"
                style={{ fontSize: '0.875rem' }}
                label={{ value: 'CO₂ (ppm)', angle: 90, position: 'insideRight', fill: '#4ecdc4' }}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Area
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              stroke="#ff6b6b"
              strokeWidth={3}
              fill="url(#tempGradient)"
              name="Global Temperature"
              dot={{ fill: '#ff6b6b', r: 4 }}
              activeDot={{ r: 6 }}
            />
            {showCO2 && (
              <Line
                yAxisId="co2"
                type="monotone"
                dataKey="co2"
                stroke="#4ecdc4"
                strokeWidth={2}
                name="CO₂ Concentration"
                dot={{ fill: '#4ecdc4', r: 3 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Year Range Slider */}
      <div style={styles.sliderContainer}>
        <div style={styles.sliderLabel}>
          <span>📅 Year Range: {yearRange[0]} - {yearRange[1]}</span>
        </div>
        <div style={styles.sliderControls}>
          <input
            type="range"
            min="1950"
            max="2024"
            value={yearRange[0]}
            onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
            style={styles.slider}
            className="range-slider"
          />
          <input
            type="range"
            min="1950"
            max="2024"
            value={yearRange[1]}
            onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
            style={styles.slider}
            className="range-slider"
          />
        </div>
        <div style={styles.presetButtons}>
          <button 
            className="chart-btn"
            style={styles.presetBtn}
            onClick={() => setYearRange([1950, 1980])}
          >
            1950-1980
          </button>
          <button 
            className="chart-btn"
            style={styles.presetBtn}
            onClick={() => setYearRange([1980, 2000])}
          >
            1980-2000
          </button>
          <button 
            className="chart-btn"
            style={styles.presetBtn}
            onClick={() => setYearRange([2000, 2024])}
          >
            2000-2024
          </button>
          <button 
            className="chart-btn"
            style={styles.presetBtn}
            onClick={() => setYearRange([1950, 2024])}
          >
            All Years
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🌡️</div>
          <div style={styles.statValue}>+1.2°C</div>
          <div style={styles.statLabel}>Temperature Rise</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💨</div>
          <div style={styles.statValue}>424 ppm</div>
          <div style={styles.statLabel}>Current CO₂</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statValue}>+36%</div>
          <div style={styles.statLabel}>CO₂ Increase</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔥</div>
          <div style={styles.statValue}>2023</div>
          <div style={styles.statLabel}>Warmest Year</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '2rem',
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0
  },
  controls: {
    display: 'flex',
    gap: '1rem'
  },
  toggleBtn: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  toggleBtnActive: {
    background: 'linear-gradient(135deg, #4ecdc4, #44a3a1)',
    border: '1px solid #4ecdc4'
  },
  alert: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    borderRadius: '8px',
    marginBottom: '2rem',
    alignItems: 'flex-start'
  },
  alertText: {
    flex: 1,
    color: '#fff',
    fontSize: '0.95rem',
    lineHeight: '1.6'
  },
  chartContainer: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  tooltip: {
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  tooltipYear: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  tooltipTemp: {
    color: '#ff6b6b',
    margin: '0.25rem 0'
  },
  tooltipAnomaly: {
    color: '#ffa500',
    margin: '0.25rem 0'
  },
  tooltipCO2: {
    color: '#4ecdc4',
    margin: '0.25rem 0'
  },
  sliderContainer: {
    marginBottom: '2rem'
  },
  sliderLabel: {
    color: '#fff',
    marginBottom: '1rem',
    fontSize: '1rem',
    fontWeight: '500'
  },
  sliderControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.2)'
  },
  presetButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  presetBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem'
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: '0.25rem'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#888'
  }
};

export default TemperatureChart;