/**
 * Historical Climate Data (1950-2024)
 * Based on real climate trends from NASA GISS and NOAA
 */

// Global Temperature Anomaly Data (compared to 1951-1980 average)
export const temperatureAnomalyData = [
  { year: 1950, anomaly: -0.17, temp: 13.83 },
  { year: 1955, anomaly: -0.14, temp: 13.86 },
  { year: 1960, anomaly: -0.03, temp: 13.97 },
  { year: 1965, anomaly: -0.11, temp: 13.89 },
  { year: 1970, anomaly: 0.03, temp: 14.03 },
  { year: 1975, anomaly: -0.01, temp: 13.99 },
  { year: 1980, anomaly: 0.26, temp: 14.26 },
  { year: 1985, anomaly: 0.12, temp: 14.12 },
  { year: 1990, anomaly: 0.45, temp: 14.45 },
  { year: 1995, anomaly: 0.45, temp: 14.45 },
  { year: 2000, anomaly: 0.40, temp: 14.40 },
  { year: 2005, anomaly: 0.68, temp: 14.68 },
  { year: 2010, anomaly: 0.72, temp: 14.72 },
  { year: 2015, anomaly: 0.90, temp: 14.90 },
  { year: 2016, anomaly: 1.02, temp: 15.02 },
  { year: 2017, anomaly: 0.92, temp: 14.92 },
  { year: 2018, anomaly: 0.85, temp: 14.85 },
  { year: 2019, anomaly: 0.98, temp: 14.98 },
  { year: 2020, anomaly: 1.02, temp: 15.02 },
  { year: 2021, anomaly: 0.85, temp: 14.85 },
  { year: 2022, anomaly: 0.89, temp: 14.89 },
  { year: 2023, anomaly: 1.17, temp: 15.17 },
  { year: 2024, anomaly: 1.20, temp: 15.20 }
];

// CO₂ Concentration Data (ppm - parts per million)
export const co2Data = [
  { year: 1950, co2: 310 },
  { year: 1960, co2: 317 },
  { year: 1970, co2: 326 },
  { year: 1980, co2: 339 },
  { year: 1990, co2: 354 },
  { year: 2000, co2: 369 },
  { year: 2005, co2: 379 },
  { year: 2010, co2: 389 },
  { year: 2015, co2: 400 },
  { year: 2016, co2: 404 },
  { year: 2017, co2: 406 },
  { year: 2018, co2: 408 },
  { year: 2019, co2: 411 },
  { year: 2020, co2: 414 },
  { year: 2021, co2: 416 },
  { year: 2022, co2: 418 },
  { year: 2023, co2: 421 },
  { year: 2024, co2: 424 }
];

// Sea Level Rise Data (mm compared to 1993 baseline)
export const seaLevelData = [
  { year: 1993, level: 0 },
  { year: 1995, level: 10 },
  { year: 2000, level: 25 },
  { year: 2005, level: 45 },
  { year: 2010, level: 65 },
  { year: 2015, level: 85 },
  { year: 2018, level: 95 },
  { year: 2020, level: 102 },
  { year: 2022, level: 108 },
  { year: 2024, level: 115 }
];

// Arctic Sea Ice Extent (million square kilometers)
export const arcticIceData = [
  { year: 1980, extent: 7.9 },
  { year: 1985, extent: 7.7 },
  { year: 1990, extent: 7.4 },
  { year: 1995, extent: 7.0 },
  { year: 2000, extent: 6.5 },
  { year: 2005, extent: 6.0 },
  { year: 2010, extent: 5.5 },
  { year: 2015, extent: 5.0 },
  { year: 2020, extent: 4.5 },
  { year: 2024, extent: 4.2 }
];

// Climate Statistics
export const climateStats = {
  globalTempRise: 1.2, // °C since pre-industrial
  co2Current: 424, // ppm
  seaLevelRise: 115, // mm since 1993
  arcticIceLoss: 47, // % since 1980
  warmestYears: [2023, 2020, 2016, 2019, 2017], // Top 5 warmest years
  extremeEvents: {
    heatwaves: '+150% since 1980',
    floods: '+134% since 2000',
    droughts: '+29% since 1980'
  }
};

// Monthly temperature data for 2024 (example)
export const monthlyTemp2024 = [
  { month: 'Jan', temp: 14.8, anomaly: 1.3 },
  { month: 'Feb', temp: 15.1, anomaly: 1.4 },
  { month: 'Mar', temp: 15.3, anomaly: 1.5 },
  { month: 'Apr', temp: 15.2, anomaly: 1.4 },
  { month: 'May', temp: 15.4, anomaly: 1.3 },
  { month: 'Jun', temp: 15.6, anomaly: 1.2 },
  { month: 'Jul', temp: 15.8, anomaly: 1.4 },
  { month: 'Aug', temp: 15.7, anomaly: 1.3 },
  { month: 'Sep', temp: 15.5, anomaly: 1.2 },
  { month: 'Oct', temp: 15.3, anomaly: 1.1 },
  { month: 'Nov', temp: 15.0, anomaly: 1.0 }
];

// Regional temperature changes (compared to 1950)
export const regionalData = [
  { region: 'Arctic', change: 2.8, trend: 'up' },
  { region: 'Europe', change: 1.5, trend: 'up' },
  { region: 'Asia', change: 1.3, trend: 'up' },
  { region: 'North America', change: 1.4, trend: 'up' },
  { region: 'South America', change: 1.0, trend: 'up' },
  { region: 'Africa', change: 1.1, trend: 'up' },
  { region: 'Australia', change: 1.2, trend: 'up' },
  { region: 'Antarctica', change: 0.8, trend: 'up' }
];

// Prediction data (2025-2100)
export const predictionData = [
  { year: 2024, temp: 15.20, scenario: 'current' },
  { year: 2030, temp: 15.50, scenario: 'optimistic' },
  { year: 2030, temp: 15.80, scenario: 'moderate' },
  { year: 2030, temp: 16.10, scenario: 'pessimistic' },
  { year: 2050, temp: 16.20, scenario: 'optimistic' },
  { year: 2050, temp: 17.00, scenario: 'moderate' },
  { year: 2050, temp: 17.80, scenario: 'pessimistic' },
  { year: 2100, temp: 16.50, scenario: 'optimistic' },
  { year: 2100, temp: 18.00, scenario: 'moderate' },
  { year: 2100, temp: 19.50, scenario: 'pessimistic' }
];

// Helper function to get data for specific year range
export const getDataForYearRange = (startYear, endYear, dataset) => {
  return dataset.filter(item => item.year >= startYear && item.year <= endYear);
};

// Helper function to calculate average
export const calculateAverage = (data, key) => {
  const sum = data.reduce((acc, item) => acc + item[key], 0);
  return (sum / data.length).toFixed(2);
};

// Helper function to get trend
export const getTrend = (data, key) => {
  if (data.length < 2) return 'stable';
  const first = data[0][key];
  const last = data[data.length - 1][key];
  const change = last - first;
  if (change > 0.1) return 'increasing';
  if (change < -0.1) return 'decreasing';
  return 'stable';
};