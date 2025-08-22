import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaWind, FaTint, FaThermometerHalf, FaMapMarkerAlt } from 'react-icons/fa';

// Mock weather data with more details
const mockWeatherData = {
  'New York': {
    temp: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    feelsLike: 24,
    high: 25,
    low: 18,
    icon: <FaCloud className="text-blue-400" />
  },
  'London': {
    temp: 15,
    condition: 'Rainy',
    humidity: 80,
    windSpeed: 18,
    feelsLike: 13,
    high: 17,
    low: 12,
    icon: <FaCloudRain className="text-blue-600" />
  },
  'Tokyo': {
    temp: 28,
    condition: 'Sunny',
    humidity: 55,
    windSpeed: 8,
    feelsLike: 30,
    high: 32,
    low: 24,
    icon: <FaSun className="text-yellow-400" />
  },
  'Sydney': {
    temp: 18,
    condition: 'Cloudy',
    humidity: 70,
    windSpeed: 15,
    feelsLike: 17,
    high: 20,
    low: 15,
    icon: <FaCloud className="text-gray-400" />
  },
  'Dubai': {
    temp: 35,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 10,
    feelsLike: 38,
    high: 38,
    low: 30,
    icon: <FaSun className="text-yellow-500" />
  }
};

// Weather condition to background gradient mapping
const weatherGradients = {
  'Sunny': 'from-yellow-200 to-orange-300',
  'Partly Cloudy': 'from-blue-200 to-blue-400',
  'Cloudy': 'from-gray-300 to-gray-500',
  'Rainy': 'from-blue-400 to-blue-600',
  'Snowy': 'from-blue-100 to-blue-300'
};

function WeatherWidget({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    const fetchWeather = () => {
      setLoading(true);
      setTimeout(() => {
        // Use mock data or default if location not found
        const weatherData = mockWeatherData[location] || {
          temp: 20,
          condition: 'Sunny',
          humidity: 60,
          windSpeed: 10,
          feelsLike: 22,
          high: 24,
          low: 16,
          icon: <FaSun className="text-yellow-400" />
        };
        setWeather(weatherData);
        setLoading(false);
      }, 800);
    };
    
    fetchWeather();
  }, [location]);
  
  if (loading) {
    return (
      <motion.div 
        className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-100 to-blue-300 h-64 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-white text-xl font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading weather...
        </motion.div>
      </motion.div>
    );
  }
  
  if (!weather) return null;
  
  const gradientClass = weatherGradients[weather.condition] || weatherGradients['Sunny'];
  
  return (
    <motion.div 
      className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${gradientClass} text-white h-64 overflow-hidden relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-1">
              <FaMapMarkerAlt className="mr-2" />
              <h3 className="text-xl font-bold">{location}</h3>
            </div>
            <p className="text-sm opacity-80">{weather.condition}</p>
          </div>
          <motion.div 
            className="text-4xl"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, repeatType: 'reverse' }}
          >
            {weather.icon}
          </motion.div>
        </div>
        
        <div className="flex items-end mb-6">
          <motion.div 
            className="text-5xl font-bold"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {weather.temp}°
          </motion.div>
          <div className="ml-4 mb-1 text-sm opacity-80">
            <div>Feels like: {weather.feelsLike}°</div>
            <div>H: {weather.high}° L: {weather.low}°</div>
          </div>
        </div>
        
        <div className="mt-auto grid grid-cols-2 gap-4">
          <motion.div 
            className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            <FaTint className="mr-2" />
            <div>
              <div className="text-xs opacity-80">Humidity</div>
              <div className="font-semibold">{weather.humidity}%</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            <FaWind className="mr-2" />
            <div>
              <div className="text-xs opacity-80">Wind</div>
              <div className="font-semibold">{weather.windSpeed} km/h</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default WeatherWidget;