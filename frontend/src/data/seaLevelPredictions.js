/**
 * Sea Level Rise Predictions and Coastal Risk Data
 * Based on IPCC reports and NOAA projections
 */

// Historical and predicted sea level rise (mm above 1900 baseline)
export const seaLevelProjections = [
  // Historical data
  { year: 1900, level: 0, scenario: 'historical' },
  { year: 1950, level: 50, scenario: 'historical' },
  { year: 1980, level: 120, scenario: 'historical' },
  { year: 1993, level: 180, scenario: 'historical' },
  { year: 2000, level: 205, scenario: 'historical' },
  { year: 2010, level: 245, scenario: 'historical' },
  { year: 2020, level: 282, scenario: 'historical' },
  { year: 2024, level: 295, scenario: 'historical' },
  
  // Optimistic scenario (low emissions, 1.5°C warming)
  { year: 2030, level: 330, scenario: 'optimistic' },
  { year: 2040, level: 380, scenario: 'optimistic' },
  { year: 2050, level: 440, scenario: 'optimistic' },
  { year: 2075, level: 600, scenario: 'optimistic' },
  { year: 2100, level: 800, scenario: 'optimistic' },
  
  // Moderate scenario (current policies, 2-3°C warming)
  { year: 2030, level: 350, scenario: 'moderate' },
  { year: 2040, level: 430, scenario: 'moderate' },
  { year: 2050, level: 530, scenario: 'moderate' },
  { year: 2075, level: 800, scenario: 'moderate' },
  { year: 2100, level: 1100, scenario: 'moderate' },
  
  // Pessimistic scenario (high emissions, 4°C+ warming)
  { year: 2030, level: 380, scenario: 'pessimistic' },
  { year: 2040, level: 500, scenario: 'pessimistic' },
  { year: 2050, level: 650, scenario: 'pessimistic' },
  { year: 2075, level: 1100, scenario: 'pessimistic' },
  { year: 2100, level: 1600, scenario: 'pessimistic' }
];

// Coastal cities at risk with elevation data
export const coastalCities = [
  {
    name: 'Mumbai',
    country: 'India',
    population: 20961000,
    elevation: 14, // meters above sea level
    coordinates: { lat: 19.0760, lon: 72.8777 },
    riskLevel: 'critical',
    projectedImpact: {
      2030: { flooded: '5%', affected: 1000000 },
      2050: { flooded: '15%', affected: 3000000 },
      2100: { flooded: '35%', affected: 7500000 }
    }
  },
  {
    name: 'Shanghai',
    country: 'China',
    population: 27058000,
    elevation: 4,
    coordinates: { lat: 31.2304, lon: 121.4737 },
    riskLevel: 'critical',
    projectedImpact: {
      2030: { flooded: '8%', affected: 2000000 },
      2050: { flooded: '20%', affected: 5500000 },
      2100: { flooded: '40%', affected: 11000000 }
    }
  },
  {
    name: 'Miami',
    country: 'USA',
    population: 6139000,
    elevation: 2,
    coordinates: { lat: 25.7617, lon: -80.1918 },
    riskLevel: 'critical',
    projectedImpact: {
      2030: { flooded: '12%', affected: 700000 },
      2050: { flooded: '30%', affected: 1800000 },
      2100: { flooded: '60%', affected: 3700000 }
    }
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    population: 1149000,
    elevation: -2, // Below sea level!
    coordinates: { lat: 52.3676, lon: 4.9041 },
    riskLevel: 'high',
    projectedImpact: {
      2030: { flooded: '3%', affected: 30000 },
      2050: { flooded: '8%', affected: 90000 },
      2100: { flooded: '20%', affected: 230000 }
    }
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    population: 37977000,
    elevation: 40,
    coordinates: { lat: 35.6762, lon: 139.6503 },
    riskLevel: 'moderate',
    projectedImpact: {
      2030: { flooded: '2%', affected: 750000 },
      2050: { flooded: '5%', affected: 1900000 },
      2100: { flooded: '12%', affected: 4500000 }
    }
  },
  {
    name: 'New York',
    country: 'USA',
    population: 18867000,
    elevation: 10,
    coordinates: { lat: 40.7128, lon: -74.0060 },
    riskLevel: 'high',
    projectedImpact: {
      2030: { flooded: '4%', affected: 750000 },
      2050: { flooded: '12%', affected: 2300000 },
      2100: { flooded: '25%', affected: 4700000 }
    }
  },
  {
    name: 'London',
    country: 'UK',
    population: 9541000,
    elevation: 11,
    coordinates: { lat: 51.5074, lon: -0.1278 },
    riskLevel: 'moderate',
    projectedImpact: {
      2030: { flooded: '3%', affected: 280000 },
      2050: { flooded: '8%', affected: 760000 },
      2100: { flooded: '18%', affected: 1700000 }
    }
  },
  {
    name: 'Jakarta',
    country: 'Indonesia',
    population: 10770000,
    elevation: 8,
    coordinates: { lat: -6.2088, lon: 106.8456 },
    riskLevel: 'critical',
    projectedImpact: {
      2030: { flooded: '10%', affected: 1000000 },
      2050: { flooded: '25%', affected: 2700000 },
      2100: { flooded: '50%', affected: 5400000 }
    }
  },
  {
    name: 'Sydney',
    country: 'Australia',
    population: 5367000,
    elevation: 58,
    coordinates: { lat: -33.8688, lon: 151.2093 },
    riskLevel: 'low',
    projectedImpact: {
      2030: { flooded: '1%', affected: 50000 },
      2050: { flooded: '3%', affected: 160000 },
      2100: { flooded: '7%', affected: 375000 }
    }
  },
  {
    name: 'Venice',
    country: 'Italy',
    population: 260000,
    elevation: 1,
    coordinates: { lat: 45.4408, lon: 12.3155 },
    riskLevel: 'critical',
    projectedImpact: {
      2030: { flooded: '15%', affected: 40000 },
      2050: { flooded: '40%', affected: 105000 },
      2100: { flooded: '80%', affected: 210000 }
    }
  }
];

// Global statistics
export const globalSeaLevelStats = {
  currentRise: 295, // mm since 1900
  ratePerYear: 3.7, // mm/year
  accelerating: true,
  accelerationRate: 0.08, // mm/year²
  
  predictions2030: {
    optimistic: 330,
    moderate: 350,
    pessimistic: 380
  },
  
  predictions2050: {
    optimistic: 440,
    moderate: 530,
    pessimistic: 650
  },
  
  predictions2100: {
    optimistic: 800,
    moderate: 1100,
    pessimistic: 1600
  },
  
  globalImpact: {
    citiesAtRisk: 136,
    populationAtRisk: 410000000, // 410 million people
    landArea: 1790000, // square km
    economicValue: 12000000000000 // $12 trillion
  }
};

// Factors contributing to sea level rise
export const seaLevelFactors = [
  { factor: 'Thermal Expansion', contribution: 42, description: 'Ocean water expands as it warms' },
  { factor: 'Greenland Ice Sheet', contribution: 21, description: 'Melting ice from Greenland' },
  { factor: 'Antarctic Ice Sheet', contribution: 15, description: 'Melting ice from Antarctica' },
  { factor: 'Glaciers', contribution: 19, description: 'Mountain glaciers melting worldwide' },
  { factor: 'Other', contribution: 3, description: 'Land water storage changes' }
];

// Regional sea level variations
export const regionalSeaLevel = [
  { region: 'Western Pacific', rise: 1.2, unit: 'relative to global average' },
  { region: 'Indian Ocean', rise: 1.1, unit: 'relative to global average' },
  { region: 'North Atlantic', rise: 0.9, unit: 'relative to global average' },
  { region: 'South Atlantic', rise: 1.0, unit: 'relative to global average' },
  { region: 'Southern Ocean', rise: 0.8, unit: 'relative to global average' }
];

// Helper function to get prediction for specific year and scenario
export const getPrediction = (year, scenario) => {
  return seaLevelProjections.find(
    p => p.year === year && p.scenario === scenario
  );
};

// Helper function to calculate risk level based on elevation
export const calculateRiskLevel = (elevation) => {
  if (elevation <= 5) return 'critical';
  if (elevation <= 15) return 'high';
  if (elevation <= 30) return 'moderate';
  return 'low';
};

// Helper function to get cities by risk level
export const getCitiesByRisk = (riskLevel) => {
  return coastalCities.filter(city => city.riskLevel === riskLevel);
};

// Helper function to calculate total affected population
export const getTotalAffectedPopulation = (year) => {
  return coastalCities.reduce((total, city) => {
    const yearStr = year.toString();
    return total + (city.projectedImpact[yearStr]?.affected || 0);
  }, 0);
};