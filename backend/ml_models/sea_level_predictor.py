"""
Machine Learning Sea Level Prediction Model
Uses Linear Regression and Polynomial Regression for predictions
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import r2_score, mean_squared_error
import math

class SeaLevelPredictor:
    def __init__(self):
        self.linear_model = LinearRegression()
        self.poly_model = None
        self.poly_features = PolynomialFeatures(degree=2)
        self.is_trained = False
        
        # Historical global sea level data (mm above 1900 baseline)
        self.historical_years = np.array([
            1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990,
            2000, 2005, 2010, 2015, 2020, 2021, 2022, 2023, 2024
        ])
        
        self.historical_levels = np.array([
            0, 10, 15, 25, 40, 50, 70, 95, 120, 155,
            205, 225, 245, 270, 282, 287, 291, 298, 305
        ])
        
        # City-specific factors (multipliers based on location)
        self.city_factors = {
            # High risk coastal cities
            'Miami': {'factor': 1.8, 'elevation': 2, 'vulnerability': 'critical'},
            'Venice': {'factor': 2.0, 'elevation': 1, 'vulnerability': 'critical'},
            'Amsterdam': {'factor': 1.6, 'elevation': -2, 'vulnerability': 'critical'},
            'Mumbai': {'factor': 1.5, 'elevation': 14, 'vulnerability': 'critical'},
            'Shanghai': {'factor': 1.7, 'elevation': 4, 'vulnerability': 'critical'},
            'Jakarta': {'factor': 1.9, 'elevation': 8, 'vulnerability': 'critical'},
            'New York': {'factor': 1.4, 'elevation': 10, 'vulnerability': 'high'},
            'London': {'factor': 1.3, 'elevation': 11, 'vulnerability': 'high'},
            'Tokyo': {'factor': 1.2, 'elevation': 40, 'vulnerability': 'moderate'},
            'Sydney': {'factor': 1.1, 'elevation': 58, 'vulnerability': 'moderate'},
            'Los Angeles': {'factor': 1.2, 'elevation': 93, 'vulnerability': 'moderate'},
            'San Francisco': {'factor': 1.3, 'elevation': 16, 'vulnerability': 'high'},
            'Singapore': {'factor': 1.6, 'elevation': 15, 'vulnerability': 'high'},
            'Hong Kong': {'factor': 1.4, 'elevation': 32, 'vulnerability': 'high'},
            'Dubai': {'factor': 1.5, 'elevation': 5, 'vulnerability': 'high'},
            'Bangkok': {'factor': 1.7, 'elevation': 1.5, 'vulnerability': 'critical'},
            'Manila': {'factor': 1.6, 'elevation': 16, 'vulnerability': 'high'},
            'Rio de Janeiro': {'factor': 1.3, 'elevation': 30, 'vulnerability': 'moderate'},
            'Buenos Aires': {'factor': 1.2, 'elevation': 25, 'vulnerability': 'moderate'},
            'Copenhagen': {'factor': 1.4, 'elevation': 14, 'vulnerability': 'high'},
            'Stockholm': {'factor': 1.2, 'elevation': 28, 'vulnerability': 'moderate'},
            'Boston': {'factor': 1.4, 'elevation': 43, 'vulnerability': 'high'},
            'Seattle': {'factor': 1.3, 'elevation': 52, 'vulnerability': 'moderate'},
            'Barcelona': {'factor': 1.3, 'elevation': 12, 'vulnerability': 'high'},
            'Lisbon': {'factor': 1.3, 'elevation': 111, 'vulnerability': 'low'},
        }
    
    def train(self):
        """Train the models on historical data"""
        X = self.historical_years.reshape(-1, 1)
        y = self.historical_levels
        
        # Train linear regression
        self.linear_model.fit(X, y)
        
        # Train polynomial regression
        X_poly = self.poly_features.fit_transform(X)
        self.poly_model = LinearRegression()
        self.poly_model.fit(X_poly, y)
        
        self.is_trained = True
        
        # Calculate model accuracy
        linear_pred = self.linear_model.predict(X)
        poly_pred = self.poly_model.predict(X_poly)
        
        linear_r2 = r2_score(y, linear_pred)
        poly_r2 = r2_score(y, poly_pred)
        
        return {
            'linear_r2': round(linear_r2, 4),
            'poly_r2': round(poly_r2, 4),
            'linear_rmse': round(math.sqrt(mean_squared_error(y, linear_pred)), 2),
            'poly_rmse': round(math.sqrt(mean_squared_error(y, poly_pred)), 2)
        }
    
    def predict_global(self, target_years, scenario='moderate'):
        """Predict global sea level for target years"""
        if not self.is_trained:
            self.train()
        
        target_years = np.array(target_years).reshape(-1, 1)
        
        # Get base predictions from polynomial model (more accurate)
        X_poly = self.poly_features.transform(target_years)
        base_predictions = self.poly_model.predict(X_poly)
        
        # Apply scenario adjustments
        scenario_multipliers = {
            'optimistic': 0.85,  # Strong climate action
            'moderate': 1.0,     # Current trajectory
            'pessimistic': 1.35  # High emissions
        }
        
        multiplier = scenario_multipliers.get(scenario, 1.0)
        
        # Calculate predictions with scenario adjustment
        predictions = []
        for i, year in enumerate(target_years.flatten()):
            base_pred = base_predictions[i]
            
            # Add acceleration factor for future years
            years_from_now = year - 2024
            if years_from_now > 0:
                # Sea level rise is accelerating (~0.08mm/year²)
                acceleration = (years_from_now ** 1.5) * 0.08 * multiplier
                adjusted_pred = base_pred * multiplier + acceleration
            else:
                adjusted_pred = base_pred
            
            # Calculate confidence interval
            uncertainty = 5 + (years_from_now * 0.5)  # Uncertainty increases with time
            
            predictions.append({
                'year': int(year),
                'prediction': round(adjusted_pred, 2),
                'lower_bound': round(adjusted_pred - uncertainty, 2),
                'upper_bound': round(adjusted_pred + uncertainty, 2),
                'uncertainty': round(uncertainty, 2)
            })
        
        return predictions
    
    def predict_city(self, city_name, target_years, scenario='moderate'):
        """Predict sea level rise for specific city"""
        # Get global predictions first
        global_predictions = self.predict_global(target_years, scenario)
        
        # Get city-specific factor
        city_data = self.city_factors.get(city_name, {
            'factor': 1.0,
            'elevation': 50,
            'vulnerability': 'moderate'
        })
        
        city_factor = city_data['factor']
        elevation = city_data['elevation']
        vulnerability = city_data['vulnerability']
        
        # Adjust predictions for city
        city_predictions = []
        for pred in global_predictions:
            year = pred['year']
            global_rise = pred['prediction']
            
            # Apply city-specific factor
            local_rise = global_rise * city_factor
            
            # Calculate risk based on elevation and rise
            if elevation <= 5:
                risk_multiplier = 1.5
            elif elevation <= 15:
                risk_multiplier = 1.2
            elif elevation <= 30:
                risk_multiplier = 1.0
            else:
                risk_multiplier = 0.8
            
            adjusted_rise = local_rise * risk_multiplier
            
            # Calculate impact metrics
            if elevation > 0:
                flooding_risk = min(100, (adjusted_rise / (elevation * 1000)) * 100)
            else:
                flooding_risk = min(100, 80 + (adjusted_rise / 10))
            
            # Population impact (simplified calculation)
            impact_percentage = min(50, flooding_risk * 0.4)
            
            city_predictions.append({
                'year': year,
                'global_rise': round(global_rise, 2),
                'local_rise': round(adjusted_rise, 2),
                'elevation': elevation,
                'flooding_risk': round(flooding_risk, 2),
                'impact_percentage': round(impact_percentage, 2),
                'vulnerability': vulnerability,
                'lower_bound': round(adjusted_rise - pred['uncertainty'], 2),
                'upper_bound': round(adjusted_rise + pred['uncertainty'], 2)
            })
        
        return {
            'city': city_name,
            'predictions': city_predictions,
            'city_factor': city_factor,
            'elevation': elevation,
            'vulnerability': vulnerability
        }
    
    def get_available_cities(self):
        """Get list of cities with sea level data"""
        return sorted(list(self.city_factors.keys()))
    
    def compare_cities(self, cities, target_year, scenario='moderate'):
        """Compare sea level predictions for multiple cities"""
        comparisons = []
        
        for city in cities:
            if city in self.city_factors:
                result = self.predict_city(city, [target_year], scenario)
                if result['predictions']:
                    pred = result['predictions'][0]
                    comparisons.append({
                        'city': city,
                        'local_rise': pred['local_rise'],
                        'flooding_risk': pred['flooding_risk'],
                        'vulnerability': pred['vulnerability'],
                        'elevation': result['elevation']
                    })
        
        # Sort by flooding risk (highest first)
        comparisons.sort(key=lambda x: x['flooding_risk'], reverse=True)
        
        return comparisons
    
    def get_model_info(self):
        """Get information about the trained model"""
        if not self.is_trained:
            metrics = self.train()
        else:
            X = self.historical_years.reshape(-1, 1)
            y = self.historical_levels
            X_poly = self.poly_features.transform(X)
            
            linear_pred = self.linear_model.predict(X)
            poly_pred = self.poly_model.predict(X_poly)
            
            metrics = {
                'linear_r2': round(r2_score(y, linear_pred), 4),
                'poly_r2': round(r2_score(y, poly_pred), 4),
                'linear_rmse': round(math.sqrt(mean_squared_error(y, linear_pred)), 2),
                'poly_rmse': round(math.sqrt(mean_squared_error(y, poly_pred)), 2)
            }
        
        return {
            'model_type': 'Polynomial Regression (degree 2)',
            'training_data_points': len(self.historical_years),
            'training_period': f"{self.historical_years[0]}-{self.historical_years[-1]}",
            'metrics': metrics,
            'available_cities': len(self.city_factors)
        }