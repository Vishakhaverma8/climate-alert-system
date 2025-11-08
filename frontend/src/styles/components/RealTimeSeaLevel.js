import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Waves, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { getCurrentSeaLevel, getCurrentCO2 } from '../services/api';

const RealTimeSeaLevel = () => {
  const [seaLevelData, setSeaLevelData] = useState(null);
  const [co2Data, setCO2Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchRealTimeData();
  }, []);

  const fetchRealTimeData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch sea level data
      const seaLevelResult = await getCurrentSeaLevel();
      if (seaLevelResult.success) {
        setSeaLevelData(seaLevelResult.data.data);
      } else {
        setError('Failed to fetch sea level data');
      }

      // Fetch CO2 data
      const co2Result = await getCurrentCO2();
      if (co2Result.success) {
        setCO2Data(co2Result.data.data);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError('Error fetching real-time data');
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipLabel}>Year: {payload[0].payload.year}</p>
          <p style={styles.tooltipValue}>
            Sea Level: {payload[0].value} mm
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <RefreshCw size={48} color="#00d4ff" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading real-time NASA data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <AlertCircle size={48} color="#ff4444" />
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryButton} onClick={fetchRealTimeData}>
            <RefreshCw size={20} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .refresh-btn:hover {
          transform: scale(1.1);
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Waves size={32} color="#00d4ff" />
          <div>
            <h3 style={styles.title}>🌊 Real-Time Sea Level Data</h3>
            <p style={styles.subtitle}>
              Live data from NASA/CU Sea Level Research Group
            </p>
          </div>
        </div>
        <button 
          className="refresh-btn"
          style={styles.refreshButton}
          onClick={fetchRealTimeData}
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Current Stats */}
      {seaLevelData && (
        <>
          <div style={styles.alert}>
            <TrendingUp size={24} color="#ffa500" />
            <div style={styles.alertText}>
              <strong>Latest Measurement:</strong> Global mean sea level is currently at{' '}
              <strong style={{ color: '#00d4ff' }}>+{seaLevelData.current_level}mm</strong>{' '}
              (relative to 1993 baseline). Rising at{' '}
              <strong style={{ color: '#ff4444' }}>{seaLevelData.rate_per_year}mm/year</strong>.
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🌊</div>
              <div style={styles.statValue}>
                +{seaLevelData.current_level} mm
              </div>
              <div style={styles.statLabel}>Current Level (1993 baseline)</div>
              <div style={styles.statSource}>Year: {seaLevelData.year}</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📈</div>
              <div style={styles.statValue}>
                {seaLevelData.rate_per_year} mm/yr
              </div>
              <div style={styles.statLabel}>Rate of Rise</div>
              <div style={styles.statSource}>Last 10 years average</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>⚠️</div>
              <div style={styles.statValue}>
                ±{seaLevelData.uncertainty} mm
              </div>
              <div style={styles.statLabel}>Measurement Uncertainty</div>
              <div style={styles.statSource}>95% confidence interval</div>
            </div>

            {co2Data && (
              <div style={styles.statCard}>
                <div style={styles.statIcon}>💨</div>
                <div style={styles.statValue}>
                  {co2Data.current_co2} ppm
                </div>
                <div style={styles.statLabel}>Current CO₂ Level</div>
                <div style={styles.statSource}>Mauna Loa Observatory</div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div style={styles.chartContainer}>
            <h4 style={styles.chartTitle}>Recent Sea Level Measurements (Last ~25 Years)</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={seaLevelData.recent_data}>
                <defs>
                  <linearGradient id="seaLevelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#888"
                  style={{ fontSize: '0.875rem' }}
                  tickFormatter={(value) => Math.floor(value)}
                />
                <YAxis 
                  stroke="#00d4ff"
                  style={{ fontSize: '0.875rem' }}
                  label={{ 
                    value: 'Sea Level Rise (mm)', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: '#00d4ff'
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="level"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  fill="url(#seaLevelGradient)"
                  dot={{ fill: '#00d4ff', r: 2 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* CO2 Recent Data */}
          {co2Data && co2Data.recent_data && (
            <div style={styles.chartContainer}>
              <h4 style={styles.chartTitle}>Recent CO₂ Measurements (Last Year)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={co2Data.recent_data.slice(-52)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888"
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="#4ecdc4"
                    style={{ fontSize: '0.875rem' }}
                    domain={[410, 430]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="#4ecdc4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Data Sources */}
          <div style={styles.sourceSection}>
            <h4 style={styles.sourceTitle}>📊 Data Sources</h4>
            <div style={styles.sourceGrid}>
              <div style={styles.sourceCard}>
                <div style={styles.sourceName}>Sea Level Data</div>
                <div style={styles.sourceInfo}>{seaLevelData.source}</div>
                <div style={styles.sourceBaseline}>Baseline: {seaLevelData.baseline}</div>
              </div>
              {co2Data && (
                <div style={styles.sourceCard}>
                  <div style={styles.sourceName}>CO₂ Data</div>
                  <div style={styles.sourceInfo}>{co2Data.source}</div>
                  <div style={styles.sourceBaseline}>Location: {co2Data.location}</div>
                </div>
              )}
            </div>
            {lastUpdated && (
              <div style={styles.lastUpdated}>
                Last updated: {lastUpdated.toLocaleString()}
              </div>
            )}
          </div>
        </>
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
  subtitle: {
    fontSize: '0.875rem',
    color: '#888',
    margin: '0.5rem 0 0 0'
  },
  refreshButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
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
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#fff',
    marginBottom: '0.25rem'
  },
  statSource: {
    fontSize: '0.75rem',
    color: '#666'
  },
  chartContainer: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem'
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
    marginBottom: '0.25rem',
    fontSize: '0.875rem'
  },
  tooltipValue: {
    color: '#00d4ff',
    fontSize: '0.875rem'
  },
  sourceSection: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px'
  },
  sourceTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem'
  },
  sourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  sourceCard: {
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  sourceName: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: '0.5rem'
  },
  sourceInfo: {
    fontSize: '0.875rem',
    color: '#fff',
    marginBottom: '0.25rem'
  },
  sourceBaseline: {
    fontSize: '0.75rem',
    color: '#888'
  },
  lastUpdated: {
    fontSize: '0.875rem',
    color: '#888',
    textAlign: 'center',
    marginTop: '1rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1rem'
  },
  loadingText: {
    fontSize: '1.1rem',
    color: '#888'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1rem'
  },
  errorText: {
    fontSize: '1.1rem',
    color: '#ff4444'
  },
  retryButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #ff4444, #ff6b6b)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500'
  }
};

export default RealTimeSeaLevel;