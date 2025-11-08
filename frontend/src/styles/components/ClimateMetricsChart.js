import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CloudRain, Waves, Wind, Thermometer } from 'lucide-react';
import { co2Data, seaLevelData, arcticIceData, regionalData } from '../../data/climateData';

const ClimateMetricsChart = () => {
  const [activeChart, setActiveChart] = useState('co2');

  // Custom colors for bars based on value
  const getBarColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage < 40) return '#00c851';
    if (percentage < 70) return '#ffa500';
    return '#ff4444';
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ ...styles.tooltipValue, color: entry.color }}>
              {entry.name}: {entry.value} {entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'co2':
        return (
          <div style={styles.chartWrapper}>
            <div style={styles.chartHeader}>
              <Wind size={24} color="#4ecdc4" />
              <div>
                <h4 style={styles.chartTitle}>CO₂ Concentration (1950-2024)</h4>
                <p style={styles.chartSubtitle}>Atmospheric CO₂ in parts per million (ppm)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={co2Data}>
                <defs>
                  <linearGradient id="co2Color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#888"
                  style={{ fontSize: '0.875rem' }}
                />
                <YAxis 
                  stroke="#4ecdc4"
                  style={{ fontSize: '0.875rem' }}
                  domain={[300, 430]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="co2"
                  stroke="#4ecdc4"
                  strokeWidth={3}
                  fill="url(#co2Color)"
                  dot={{ fill: '#4ecdc4', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="CO₂"
                  unit="ppm"
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={styles.chartInfo}>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>1950 Level:</span>
                <span style={styles.infoValue}>310 ppm</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>2024 Level:</span>
                <span style={styles.infoValue}>424 ppm</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Increase:</span>
                <span style={{...styles.infoValue, color: '#ff4444'}}>+36.8%</span>
              </div>
            </div>
          </div>
        );

      case 'sealevel':
        return (
          <div style={styles.chartWrapper}>
            <div style={styles.chartHeader}>
              <Waves size={24} color="#00d4ff" />
              <div>
                <h4 style={styles.chartTitle}>Sea Level Rise (1993-2024)</h4>
                <p style={styles.chartSubtitle}>Rise in millimeters compared to 1993 baseline</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={seaLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#888"
                  style={{ fontSize: '0.875rem' }}
                />
                <YAxis 
                  stroke="#00d4ff"
                  style={{ fontSize: '0.875rem' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="level" 
                  name="Sea Level Rise"
                  unit="mm"
                  radius={[8, 8, 0, 0]}
                >
                  {seaLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.level, 115)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={styles.chartInfo}>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>1993 Baseline:</span>
                <span style={styles.infoValue}>0 mm</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>2024 Level:</span>
                <span style={styles.infoValue}>+115 mm</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Rate:</span>
                <span style={{...styles.infoValue, color: '#ffa500'}}>3.7 mm/year</span>
              </div>
            </div>
          </div>
        );

      case 'ice':
        return (
          <div style={styles.chartWrapper}>
            <div style={styles.chartHeader}>
              <CloudRain size={24} color="#7b68ee" />
              <div>
                <h4 style={styles.chartTitle}>Arctic Sea Ice Extent (1980-2024)</h4>
                <p style={styles.chartSubtitle}>September minimum extent in million km²</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={arcticIceData}>
                <defs>
                  <linearGradient id="iceColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7b68ee" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7b68ee" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#888"
                  style={{ fontSize: '0.875rem' }}
                />
                <YAxis 
                  stroke="#7b68ee"
                  style={{ fontSize: '0.875rem' }}
                  domain={[4, 8]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="extent"
                  stroke="#7b68ee"
                  strokeWidth={3}
                  fill="url(#iceColor)"
                  dot={{ fill: '#7b68ee', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Ice Extent"
                  unit=" million km²"
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={styles.chartInfo}>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>1980 Extent:</span>
                <span style={styles.infoValue}>7.9 M km²</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>2024 Extent:</span>
                <span style={styles.infoValue}>4.2 M km²</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Loss:</span>
                <span style={{...styles.infoValue, color: '#ff4444'}}>-46.8%</span>
              </div>
            </div>
          </div>
        );

      case 'regional':
        return (
          <div style={styles.chartWrapper}>
            <div style={styles.chartHeader}>
              <Thermometer size={24} color="#ff6b6b" />
              <div>
                <h4 style={styles.chartTitle}>Regional Temperature Changes</h4>
                <p style={styles.chartSubtitle}>Temperature increase by region (°C since 1950)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={regionalData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number"
                  stroke="#888"
                  style={{ fontSize: '0.875rem' }}
                />
                <YAxis 
                  type="category"
                  dataKey="region"
                  stroke="#888"
                  style={{ fontSize: '0.875rem' }}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="change" 
                  name="Temperature Change"
                  unit="°C"
                  radius={[0, 8, 8, 0]}
                >
                  {regionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.change, 3)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={styles.chartInfo}>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Highest:</span>
                <span style={styles.infoValue}>Arctic +2.8°C</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Lowest:</span>
                <span style={styles.infoValue}>Antarctica +0.8°C</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Average:</span>
                <span style={{...styles.infoValue, color: '#ffa500'}}>+1.2°C</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        .metric-btn {
          transition: all 0.3s ease;
        }
        .metric-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Chart Selector */}
      <div style={styles.selector}>
        <button
          className="metric-btn"
          style={{
            ...styles.selectorBtn,
            ...(activeChart === 'co2' ? styles.selectorBtnActive : {})
          }}
          onClick={() => setActiveChart('co2')}
        >
          <Wind size={20} />
          <span>CO₂ Levels</span>
        </button>
        <button
          className="metric-btn"
          style={{
            ...styles.selectorBtn,
            ...(activeChart === 'sealevel' ? styles.selectorBtnActive : {})
          }}
          onClick={() => setActiveChart('sealevel')}
        >
          <Waves size={20} />
          <span>Sea Level</span>
        </button>
        <button
          className="metric-btn"
          style={{
            ...styles.selectorBtn,
            ...(activeChart === 'ice' ? styles.selectorBtnActive : {})
          }}
          onClick={() => setActiveChart('ice')}
        >
          <CloudRain size={20} />
          <span>Arctic Ice</span>
        </button>
        <button
          className="metric-btn"
          style={{
            ...styles.selectorBtn,
            ...(activeChart === 'regional' ? styles.selectorBtnActive : {})
          }}
          onClick={() => setActiveChart('regional')}
        >
          <Thermometer size={20} />
          <span>Regional</span>
        </button>
      </div>

      {/* Active Chart */}
      {renderChart()}

      {/* Warning Message */}
      <div style={styles.warning}>
        <span style={styles.warningIcon}>⚠️</span>
        <div style={styles.warningText}>
          <strong>Scientific Consensus:</strong> These changes are primarily driven by human activities, 
          particularly greenhouse gas emissions. Without immediate action, trends will continue to accelerate.
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
  selector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  selectorBtn: {
    flex: 1,
    minWidth: '150px',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500'
  },
  selectorBtnActive: {
    background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
    border: '1px solid #00d4ff',
    boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)'
  },
  chartWrapper: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  chartHeader: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    alignItems: 'flex-start'
  },
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
    marginBottom: '0.25rem'
  },
  chartSubtitle: {
    fontSize: '0.875rem',
    color: '#888',
    margin: 0
  },
  chartInfo: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  infoBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: '#888'
  },
  infoValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#00d4ff'
  },
  tooltip: {
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  tooltipLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    fontSize: '0.875rem'
  },
  tooltipValue: {
    margin: '0.25rem 0',
    fontSize: '0.875rem'
  },
  warning: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid rgba(255, 68, 68, 0.3)',
    borderRadius: '8px',
    alignItems: 'flex-start'
  },
  warningIcon: {
    fontSize: '1.5rem'
  },
  warningText: {
    flex: 1,
    color: '#fff',
    fontSize: '0.875rem',
    lineHeight: '1.6'
  }
};

export default ClimateMetricsChart;