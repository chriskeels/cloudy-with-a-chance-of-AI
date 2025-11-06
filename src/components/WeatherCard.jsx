import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import '../style/WeatherCard.css'

/**
 * WeatherCard Component
 * 
 * CONCEPT: Create Components - A specialized component for displaying detailed current weather information.
 * This component demonstrates advanced concepts like third-party library integration (Framer Motion).
 * 
 * CONCEPT: useEffect - Used here for debugging purposes to log weather prop changes.
 * This hook runs after every render when the 'weather' dependency changes.
 * 
 * CONCEPT: Passing Props - Receives weather data object from parent (Homepage) component.
 * The component is designed to be reusable with any weather data structure.
 * 
 * This component also demonstrates:
 * - Conditional rendering (early return if no weather data)
 * - Data transformation and validation (icon URL normalization)
 * - Error handling (image onError event)
 * - Animation integration with Framer Motion
 * 
 * @param {Object} weather - Weather data object containing location, temp, condition, etc.
 */
export default function WeatherCard({ weather }) {
  // CONCEPT: useEffect - Side effect for debugging/logging when weather prop changes
  // The dependency array [weather] means this runs whenever the weather prop changes
  useEffect(() => {
    // debug: check what `weather` contains when this component renders
    console.log('WeatherCard weather prop:', weather)
  }, [weather]) // Re-run when weather prop changes

  // Early return pattern - guard clause to prevent rendering when no data
  // This prevents errors and unnecessary rendering of empty content
  if (!weather) return null

  // Data transformation and validation logic
  // normalize icon to full https URL or null
  const rawIcon = weather.icon || ''
  const iconUrl =
    typeof rawIcon === 'string'
      ? rawIcon.startsWith('//')
        ? `https:${rawIcon}`
        : rawIcon
      : null

  return (
    <motion.div
      className="weather-card-large"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* CONCEPT: Passing Props - Accessing data from the weather prop object */}
      <h2 className="current-location">{weather.location}</h2>

      <div className="weather-temp-container">
        <div className="current-temp current-temp-large">
          {weather.temp}°F
        </div>

        {/* Conditional rendering with proper error handling */}
        {iconUrl ? (
          <motion.img
            key={iconUrl}
            src={iconUrl}
            alt={weather.condition || 'weather icon'}
            className="weather-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            onError={(e) => {
              // if image fails to load, hide it and log
              e.currentTarget.style.display = 'none'
              console.error('Weather icon failed to load:', iconUrl)
            }}
          />
        ) : null}
      </div>

      <p className="weather-description">{weather.condition}</p>

      {/* Weather details section demonstrating data display and calculations */}
      <div className="weather-details">
        <div className="weather-detail-item">
          <div className="detail-label">Humidity</div>
          <div className="detail-value">{weather.humidity}%</div>
        </div>
        <div className="weather-detail-item">
          <div className="detail-label">Wind</div>
          <div className="detail-value">{weather.windSpeed} mph</div>
        </div>
        <div className="weather-detail-item">
          <div className="detail-label">Pressure</div>
          <div className="detail-value">
            {/* Data transformation: converting millibars to inches of mercury */}
            {(weather.pressure * 0.02953).toFixed(2)} inHg
          </div>
        </div>
        <div className="weather-detail-item">
          <div className="detail-label">UV Index</div>
          <div className="detail-value">{weather.uvIndex}</div>
        </div>
      </div>
    </motion.div>
  )
}