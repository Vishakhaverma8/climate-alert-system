import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Waves, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';
import { seaLevelProjections, globalSeaLevelStats, coastalCities } from '../../data/seaLevelPredictions';

const SeaLevelPrediction = () => {
  const [selectedScenario, setSelectedScenario] = useState('all');
  const [selectedYear, setSelectedYear] = useState(2050);
  const [showCities, setShowCities] = useState(true);

  // Filter data based on selected scenario
  const getChartData = () => {
    if (selectedScenario === 'all') {
      return seaLevelProjections;
    }
    return seaLevelProjections.filter(d => 
      d.scenario === 'historical' || d.scenario === selectedScenario
    );
  };

  // Get affected cities for selected year
  const getAffectedCities = () => {
    return coastalCities
      .sort((a, b) => {
        const aAffected = a.projectedImpact[selectedYear]?.affected || 0;
        const bAffected = b.projectedImpact[selectedYear]?.affected || 0;
        return bAffected - aAffected;
      })
      .slice(0, 5);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipYear}>Year: {payload[0].payload.year}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ ...styles.tooltipValue, color: entry.color }}>
              {entry.name}: +{entry.value}mm
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return '#ff4444';
      case 'high': return '#ffa500';
      case 'moderate': return '#ffd700';
      case 'low': return '#00c851';
      default: return '#888';
    }
  };

  const getScenarioColor = (scenario) => {
    switch (scenario) {
      case 'optimistic': return '#00c851';
      case 'moderate': return '#ffa500';
      case 'pessimistic': return '#ff4444';
      default: return '#00d4ff';
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        .scenario-btn {
          transition: all 0.3s ease;
        }
        .scenario-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        .city-card {
          transition: all 0.3s ease;
        }
        .city-card:hover {
          transform: translateX(5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Waves size={32} color="#00d4ff" />
          <div>
            <h3 style={styles.title}>Sea Level Rise Predictions</h3>
            <p style={styles.subtitle}>Projections from 1900 to 2100</p>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div style={styles.alert}>
        <AlertTriangle size={24} color="#ff4444" />
        <div style={styles.alertText}>
          <strong>Critical Warning:</strong> Sea levels have risen {globalSeaLevelStats.currentRise}mm since 1900. 
          Current rate: <strong>{globalSeaLevelStats.ratePerYear}mm/year</strong> and accelerating. 
          By 2100, rise could reach <strong>0.8m to 1.6m</strong> depending on emissions.
        </div>
      </div>

      {/* Scenario Selector */}
      <div style={styles.scenarioSelector}>
        <span style={styles.selectorLabel}>Select Scenario:</span>
        <button
          className="scenario-btn"
          style={{
            ...styles.scenarioBtn,
            ...(selectedScenario === 'all' ? styles.scenarioBtnActive : {})
          }}
          onClick={() => setSelectedScenario('all')}
        >
          📊 All Scenarios
        </button>
        <button
          className="scenario-btn"
          style={{
            ...styles.scenarioBtn,
            ...(selectedScenario === 'optimistic' ? styles.scenarioBtnActive : {}),
            borderColor: '#00c851'
          }}
          onClick={() => setSelectedScenario('optimistic')}
        >
          🟢 Optimistic (1.5°C)
        </button>
        <button
          className="scenario-btn"
          style={{
            ...styles.scenarioBtn,
            ...(selectedScenario === 'moderate' ? styles.scenarioBtnActive : {}),
            borderColor: '#ffa500'
          }}
          onClick={() => setSelectedScenario('moderate')}
        >
          🟡 Moderate (2-3°C)
        </button>
        <button
          className="scenario-btn"
          style={{
            ...styles.scenarioBtn,
            ...(selectedScenario === 'pessimistic' ? styles.scenarioBtnActive : {}),
            borderColor: '#ff4444'
          }}
          onClick={() => setSelectedScenario('pessimistic')}
        >
          🔴 Pessimistic (4°C+)
        </button>
      </div>

      {/* Main Chart */}
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={450}>
          <AreaChart data={getChartData()}>
            <defs>
              <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="optimisticGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c851" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00c851" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="moderateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffa500" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffa500" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="pessimisticGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="year" 
              stroke="#888"
              style={{ fontSize: '0.875rem' }}
            />
            <YAxis 
              stroke="#00d4ff"
              style={{ fontSize: '0.875rem' }}
              label={{ value: 'Sea Level Rise (mm)', angle: -90, position: 'insideLeft', fill: '#00d4ff' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {(selectedScenario === 'all' || selectedScenario === 'optimistic') && (
              <Area
                type="monotone"
                dataKey="level"
                data={getChartData().filter(d => d.scenario === 'optimistic')}
                stroke="#00c851"
                strokeWidth={2}
                fill="url(#optimisticGradient)"
                name="Optimistic"
              />
            )}
            
            {(selectedScenario === 'all' || selectedScenario === 'moderate') && (
              <Area
                type="monotone"
                dataKey="level"
                data={getChartData().filter(d => d.scenario === 'moderate')}
                stroke="#ffa500"
                strokeWidth={2}
                fill="url(#moderateGradient)"
                name="Moderate"
              />
            )}
            
            {(selectedScenario === 'all' || selectedScenario === 'pessimistic') && (
              <Area
                type="monotone"
                dataKey="level"
                data={getChartData().filter(d => d.scenario === 'pessimistic')}
                stroke="#ff4444"
                strokeWidth={2}
                fill="url(#pessimisticGradient)"
                name="Pessimistic"
              />
            )}
            
            <Line
              type="monotone"
              dataKey="level"
              data={getChartData().filter(d => d.scenario === 'historical')}
              stroke="#00d4ff"
              strokeWidth={3}
              dot={{ fill: '#00d4ff', r: 4 }}
              name="Historical"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Year Selector for Cities */}
      <div style={styles.yearSelector}>
        <span style={styles.selectorLabel}>View Impact for Year:</span>
        <button
          style={{
            ...styles.yearBtn,
            ...(selectedYear === 2030 ? styles.yearBtnActive : {})
          }}
          onClick={() => setSelectedYear(2030)}
        >
          2030
        </button>
        <button
          style={{
            ...styles.yearBtn,
            ...(selectedYear === 2050 ? styles.yearBtnActive : {})
          }}
          onClick={() => setSelectedYear(2050)}
        >
          2050
        </button>
        <button
          style={{
            ...styles.yearBtn,
            ...(selectedYear === 2100 ? styles.yearBtnActive : {})
          }}
          onClick={() => setSelectedYear(2100)}
        >
          2100
        </button>
      </div>

      
      {/* Top Affected Cities */}
      {showCities && (
        <div style={styles.citiesSection}>
          <h4 style={styles.citiesTitle}>
            <MapPin size={24} color="#00d4ff" />
            Top 5 Most Affected Cities by {selectedYear}
          </h4>
          <div style={styles.citiesGrid}>
            {getAffectedCities().map((city, index) => (
              <div key={city.name} className="city-card" style={styles.cityCard}>
                <div style={styles.cityHeader}>
                  <div>
                    <div style={styles.cityName}>
                      {index + 1}. {city.name}
                    </div>
                    <div style={styles.cityCountry}>{city.country}</div>
                  </div>
                  <div style={{
                    ...styles.riskBadge,
                    background: getRiskColor(city.riskLevel)
                  }}>
                    {city.riskLevel.toUpperCase()}
                  </div>
                </div>
                <div style={styles.cityStats}>
                  <div style={styles.cityStat}>
                    <span style={styles.cityStatLabel}>Population:</span>
                    <span style={styles.cityStatValue}>
                      {(city.population / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div style={styles.cityStat}>
                    <span style={styles.cityStatLabel}>Elevation:</span>
                    <span style={styles.cityStatValue}>{city.elevation}m</span>
                  </div>
                  <div style={styles.cityStat}>
                    <span style={styles.cityStatLabel}>Area Flooded:</span>
                    <span style={{...styles.cityStatValue, color: '#ff4444'}}>
                      {city.projectedImpact[selectedYear]?.flooded}
                    </span>
                  </div>
                  <div style={styles.cityStat}>
                    <span style={styles.cityStatLabel}>People Affected:</span>
                    <span style={{...styles.cityStatValue, color: '#ffa500'}}>
                      {(city.projectedImpact[selectedYear]?.affected / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
    marginBottom: '2rem'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0
  },
  subtitle: {
    fontSize: '1rem',
    color: '#888',
    margin: '0.5rem 0 0 0'
  },
  alert: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid rgba(255, 68, 68, 0.3)',
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
  scenarioSelector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  selectorLabel: {
    color: '#fff',
    fontWeight: '500',
    minWidth: '150px'
  },
  scenarioBtn: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  scenarioBtnActive: {
    background: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#00d4ff',
    boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)'
  },
  chartContainer: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  tooltip: {
    background: 'rgba(0, 0, 0, 0.95)',
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
  tooltipValue: {
    margin: '0.25rem 0',
    fontSize: '0.875rem'
  },
  yearSelector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  yearBtn: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500'
  },
  yearBtnActive: {
    background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
    border: 'none'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: '0.25rem'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#888'
  },
  citiesSection: {
    marginTop: '2rem'
  },
  citiesTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1.5rem'
  },
  citiesGrid: {
    display: 'grid',
    gap: '1rem'
  },
  cityCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  cityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  cityName: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '0.25rem'
  },
  cityCountry: {
    fontSize: '0.875rem',
    color: '#888'
  },
  riskBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  cityStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
  },
  cityStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  cityStatLabel: {
    fontSize: '0.875rem',
    color: '#888'
  },
  cityStatValue: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#fff'
  }
};

export default SeaLevelPrediction;