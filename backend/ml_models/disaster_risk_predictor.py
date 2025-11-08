"""
Flood and Landslide Risk Prediction System
Simple, focused implementation
"""

import math

class DisasterRiskPredictor:
    def __init__(self):
        # Historical disaster data for cities
        self.city_risk_data = {
            'Mumbai': {'flood_history': 9, 'landslide_history': 6, 'drainage': 'poor'},
            'Bangkok': {'flood_history': 9, 'landslide_history': 3, 'drainage': 'poor'},
            'Jakarta': {'flood_history': 8, 'landslide_history': 5, 'drainage': 'poor'},
            'New York': {'flood_history': 5, 'landslide_history': 2, 'drainage': 'good'},
            'Venice': {'flood_history': 10, 'landslide_history': 1, 'drainage': 'poor'},
            'Miami': {'flood_history': 8, 'landslide_history': 1, 'drainage': 'moderate'},
            'Shanghai': {'flood_history': 7, 'landslide_history': 3, 'drainage': 'moderate'},
            'Tokyo': {'flood_history': 6, 'landslide_history': 5, 'drainage': 'good'},
            'Rio de Janeiro': {'flood_history': 6, 'landslide_history': 8, 'drainage': 'poor'},
            'Hong Kong': {'flood_history': 5, 'landslide_history': 7, 'drainage': 'moderate'},
            'Seattle': {'flood_history': 4, 'landslide_history': 6, 'drainage': 'good'},
            'San Francisco': {'flood_history': 3, 'landslide_history': 5, 'drainage': 'good'},
        }
    
    def calculate_flood_risk(self, city_name, elevation, rainfall_mm, humidity=70):
        """
        Calculate flood risk (0-100)
        
        Factors:
        1. Rainfall (40%) - Most important
        2. Elevation (30%) - Low areas flood more
        3. Drainage (20%) - City infrastructure
        4. Humidity (10%) - Saturation level
        """
        
        # 1. Rainfall Score (0-40)
        if rainfall_mm > 150:
            rainfall_score = 40
        elif rainfall_mm > 100:
            rainfall_score = 35
        elif rainfall_mm > 75:
            rainfall_score = 30
        elif rainfall_mm > 50:
            rainfall_score = 25
        elif rainfall_mm > 25:
            rainfall_score = 20
        else:
            rainfall_score = (rainfall_mm / 25) * 20
        
        # 2. Elevation Score (0-30)
        if elevation <= 0:
            elevation_score = 30
        elif elevation <= 5:
            elevation_score = 28
        elif elevation <= 10:
            elevation_score = 25
        elif elevation <= 20:
            elevation_score = 20
        elif elevation <= 50:
            elevation_score = 15
        else:
            elevation_score = max(0, 15 - (elevation / 50))
        
        # 3. Drainage Score (0-20)
        city_data = self.city_risk_data.get(city_name, {})
        drainage = city_data.get('drainage', 'moderate')
        
        if drainage == 'poor':
            drainage_score = 20
        elif drainage == 'moderate':
            drainage_score = 12
        else:  # good
            drainage_score = 5
        
        # 4. Humidity Score (0-10)
        if humidity > 85:
            humidity_score = 10
        elif humidity > 70:
            humidity_score = 7
        else:
            humidity_score = (humidity / 100) * 10
        
        # Total Risk
        total_score = rainfall_score + elevation_score + drainage_score + humidity_score
        flood_risk = min(100, total_score)
        
        # Risk Level
        if flood_risk >= 75:
            risk_level = 'Critical'
            color = '#ff0000'
        elif flood_risk >= 50:
            risk_level = 'High'
            color = '#ff6600'
        elif flood_risk >= 25:
            risk_level = 'Medium'
            color = '#ffcc00'
        else:
            risk_level = 'Low'
            color = '#00cc00'
        
        return {
            'risk_score': round(flood_risk, 1),
            'risk_level': risk_level,
            'risk_color': color,
            'factors': {
                'rainfall': round(rainfall_score, 1),
                'elevation': round(elevation_score, 1),
                'drainage': round(drainage_score, 1),
                'humidity': round(humidity_score, 1)
            },
            'warnings': self._get_flood_warnings(flood_risk, rainfall_mm),
            'actions': self._get_flood_actions(flood_risk)
        }
    
    def calculate_landslide_risk(self, city_name, elevation, rainfall_mm, slope_angle=None):
        """
        Calculate landslide risk (0-100)
        
        Factors:
        1. Slope (40%) - Steeper = higher risk
        2. Rainfall (35%) - Saturates soil
        3. Soil Type (15%) - Based on elevation
        4. Vegetation (10%) - Tree roots stabilize
        """
        
        # 1. Slope Score (0-40) - Estimate from elevation
        if slope_angle:
            # If actual slope provided
            if slope_angle > 45:
                slope_score = 40
            elif slope_angle > 30:
                slope_score = 35
            elif slope_angle > 20:
                slope_score = 28
            elif slope_angle > 10:
                slope_score = 20
            else:
                slope_score = 10
        else:
            # Estimate from elevation
            if elevation > 500:
                slope_score = 38  # Mountains
            elif elevation > 200:
                slope_score = 32  # Hills
            elif elevation > 100:
                slope_score = 25  # Moderate
            elif elevation > 50:
                slope_score = 15  # Gentle
            else:
                slope_score = 5   # Flat
        
        # 2. Rainfall Score (0-35)
        if rainfall_mm > 150:
            rainfall_score = 35
        elif rainfall_mm > 100:
            rainfall_score = 30
        elif rainfall_mm > 75:
            rainfall_score = 25
        elif rainfall_mm > 50:
            rainfall_score = 20
        else:
            rainfall_score = (rainfall_mm / 50) * 20
        
        # 3. Soil Type Score (0-15)
        if elevation > 300:
            soil_score = 15  # Rocky, loose soil
        elif elevation > 100:
            soil_score = 12  # Mixed soil
        else:
            soil_score = 7   # Clay/stable soil
        
        # 4. Vegetation Score (0-10)
        # Less vegetation on steep slopes
        if elevation > 400:
            vegetation_score = 8  # Sparse vegetation
        elif elevation > 150:
            vegetation_score = 6  # Moderate
        else:
            vegetation_score = 3  # Dense vegetation
        
        # Total Risk
        total_score = slope_score + rainfall_score + soil_score + vegetation_score
        landslide_risk = min(100, total_score)
        
        # Risk Level
        if landslide_risk >= 75:
            risk_level = 'Critical'
            color = '#ff0000'
        elif landslide_risk >= 50:
            risk_level = 'High'
            color = '#ff6600'
        elif landslide_risk >= 25:
            risk_level = 'Medium'
            color = '#ffcc00'
        else:
            risk_level = 'Low'
            color = '#00cc00'
        
        return {
            'risk_score': round(landslide_risk, 1),
            'risk_level': risk_level,
            'risk_color': color,
            'factors': {
                'slope': round(slope_score, 1),
                'rainfall': round(rainfall_score, 1),
                'soil': round(soil_score, 1),
                'vegetation': round(vegetation_score, 1)
            },
            'warnings': self._get_landslide_warnings(landslide_risk, elevation),
            'actions': self._get_landslide_actions(landslide_risk)
        }
    
    def assess_city_risk(self, city_name, elevation, current_weather):
        """
        Complete risk assessment for a city
        """
        rainfall = current_weather.get('rainfall', 0)
        humidity = current_weather.get('humidity', 70)
        
        flood_risk = self.calculate_flood_risk(city_name, elevation, rainfall, humidity)
        landslide_risk = self.calculate_landslide_risk(city_name, elevation, rainfall)
        
        # Combined risk score
        combined_risk = (flood_risk['risk_score'] + landslide_risk['risk_score']) / 2
        
        # Overall status
        if combined_risk >= 70:
            overall_status = 'Emergency'
        elif combined_risk >= 50:
            overall_status = 'High Alert'
        elif combined_risk >= 30:
            overall_status = 'Moderate Alert'
        else:
            overall_status = 'Normal'
        
        return {
            'city': city_name,
            'elevation': elevation,
            'weather': current_weather,
            'flood_risk': flood_risk,
            'landslide_risk': landslide_risk,
            'combined_risk': round(combined_risk, 1),
            'overall_status': overall_status,
            'priority_actions': self._get_priority_actions(flood_risk, landslide_risk)
        }
    
    def _get_flood_warnings(self, risk, rainfall):
        warnings = []
        if risk >= 75:
            warnings.append('🚨 CRITICAL: Immediate evacuation may be necessary')
            warnings.append(f'⚠️ Extreme rainfall: {rainfall}mm')
        elif risk >= 50:
            warnings.append('⚠️ HIGH RISK: Monitor situation closely')
            warnings.append('📍 Avoid low-lying areas')
        elif risk >= 25:
            warnings.append('⚡ MODERATE: Be prepared for potential flooding')
        else:
            warnings.append('✅ Low risk - Normal conditions')
        return warnings
    
    def _get_flood_actions(self, risk):
        if risk >= 75:
            return [
                '1. Move to higher ground immediately',
                '2. Avoid all flood-prone areas',
                '3. Prepare emergency kit',
                '4. Stay informed via official channels'
            ]
        elif risk >= 50:
            return [
                '1. Monitor weather updates',
                '2. Clear drainage systems',
                '3. Secure important documents',
                '4. Have evacuation plan ready'
            ]
        elif risk >= 25:
            return [
                '1. Stay alert to weather changes',
                '2. Check drainage systems',
                '3. Keep emergency contacts handy'
            ]
        else:
            return ['No immediate action required']
    
    def _get_landslide_warnings(self, risk, elevation):
        warnings = []
        if risk >= 75:
            warnings.append('🚨 CRITICAL: High landslide probability')
            warnings.append(f'⛰️ Elevation: {elevation}m - Steep terrain')
        elif risk >= 50:
            warnings.append('⚠️ HIGH RISK: Monitor slope stability')
            warnings.append('🌧️ Soil saturation critical')
        elif risk >= 25:
            warnings.append('⚡ MODERATE: Watch for ground movement')
        else:
            warnings.append('✅ Low risk - Stable conditions')
        return warnings
    
    def _get_landslide_actions(self, risk):
        if risk >= 75:
            return [
                '1. Evacuate slope areas immediately',
                '2. Avoid hillside roads',
                '3. Watch for cracks in ground/walls',
                '4. Report unusual ground movement'
            ]
        elif risk >= 50:
            return [
                '1. Stay away from steep slopes',
                '2. Monitor for ground cracks',
                '3. Prepare to evacuate',
                '4. Listen for rumbling sounds'
            ]
        elif risk >= 25:
            return [
                '1. Be aware of surroundings',
                '2. Note changes in landscape',
                '3. Have evacuation route planned'
            ]
        else:
            return ['No immediate action required']
    
    def _get_priority_actions(self, flood_risk, landslide_risk):
        actions = []
        
        if flood_risk['risk_score'] >= 50:
            actions.extend(flood_risk['actions'][:2])
        
        if landslide_risk['risk_score'] >= 50:
            actions.extend(landslide_risk['actions'][:2])
        
        if not actions:
            actions.append('✅ Continue normal activities - Monitor weather updates')
        
        return actions