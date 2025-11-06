import React from 'react'
import '../style/ForecastGrid.css'

/**
 * ForecastGrid Component
 * 
 * CONCEPT: Create Components - A reusable, self-contained piece of UI that displays a grid of weather forecast days.
 * This functional component takes forecast data as props and renders it in a grid layout.
 * 
 * CONCEPT: Passing Props - The 'forecast' prop is passed from parent component (Homepage) to this child component.
 * Props enable component composition and reusability - this component can display any forecast data passed to it.
 * 
 * @param {Array} forecast - Array of forecast objects containing day, icon, temp, and condition data
 * @returns {JSX.Element|null} - Returns forecast grid JSX or null if no forecast data
 */
export default function ForecastGrid({ forecast }) {
  // Early return pattern - if no forecast data exists, render nothing
  // This prevents errors and unnecessary rendering
  if (!forecast || forecast.length === 0) return null

  return (
    <div className="forecast-grid">
      {/* 
        CONCEPT: JSX - Using JavaScript expressions within JSX to dynamically render forecast items.
        The map() function transforms each forecast day into a JSX element.
      */}
      {forecast.map((day, index) => (
        <div key={index} className="forecast-card">
          <div className="forecast-day">{day.day}</div>

          {/* ✅ Show image instead of link */}
          <div className="forecast-icon-container">
            <img
              src={day.icon}
              alt={day.condition}
              className="forecast-icon"
            />
          </div>

          <div className="forecast-temp">{day.temp}°</div>
          <div className="forecast-condition">{day.condition}</div>
        </div>
      ))}
    </div>
  )
}
