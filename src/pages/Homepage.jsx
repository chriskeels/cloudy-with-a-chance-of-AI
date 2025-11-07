

import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastGrid from '../components/ForecastGrid'
import { processSearchInput } from '../utils/citySearch'

/**
 * Homepage Component
 * 
 * CONCEPT: Create Components - Main page component that orchestrates the weather app functionality.
 * This component demonstrates several key React concepts working together.
 * 
 * CONCEPT: Hooks - Uses multiple React hooks (useState, useEffect) to manage state and side effects.
 * 
 * CONCEPT: useState - Manages multiple pieces of state for weather data, loading states, and error handling.
 * State allows the component to be interactive and respond to user actions and data changes.
 * 
 * CONCEPT: useEffect - Performs side effects like API calls after component renders.
 * Used here to auto-detect user's location and fetch weather data on component mount.
 * 
 * CONCEPT: API Calls - Demonstrates fetching data from external weather API with proper error handling.
 * 
 * CONCEPT: Passing Props - Passes state and functions down to child components (SearchBar, WeatherCard, ForecastGrid).
 * This enables component composition and keeps data flowing downward in the component tree.
 * 
 * CONCEPT: Lifting State - All weather-related state lives in this parent component and is shared
 * between child components through props. This ensures data consistency across the app.
 */
export default function Homepage() {
  // CONCEPT: useState - Managing multiple pieces of state for different aspects of the weather app
  // Each useState call returns [currentValue, setterFunction] array that we destructure
  const [currentWeather, setCurrentWeather] = useState(null) // Stores current weather data object
  const [forecast, setForecast] = useState([]) // Stores array of forecast days
  const [error, setError] = useState('') // Stores error messages for user feedback
  const [loading, setLoading] = useState(false) // Tracks loading state for better UX
  const [stateConversionMessage, setStateConversionMessage] = useState('') // Message when state is converted to city
  const [timeOfDay, setTimeOfDay] = useState('') // Tracks current time of day for styling
  const [testTime, setTestTime] = useState(null) // For testing different times of day

  // Environment variable access for API key - keeps sensitive data secure
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  /**
   * Determines the current time of day based on hour
   * @returns {string} - 'morning', 'afternoon', 'evening', or 'night'
   */
  function getTimeOfDay() {
    const hour = testTime !== null ? testTime : new Date().getHours()
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 20) return 'evening'
    return 'night'
  }

  /**
   * Cycles through different times of day for testing purposes
   */
  function cycleTimeOfDay() {
    const times = [8, 14, 18, 22]
    const current = testTime !== null ? testTime : new Date().getHours()
    const currentIndex = times.findIndex(time => time === current)
    const nextIndex = (currentIndex + 1) % times.length
    setTestTime(times[nextIndex])
  }

  /**
   * CONCEPT: API Calls - Async function that fetches weather data from external API
   * Demonstrates proper error handling, loading states, and data transformation
   * 
   * @param {string} searchInput - User search input (city name, state name, or 'auto:ip' for location detection)
   */
  async function fetchWeather(searchInput) {
    try {
      // Reset error state and set loading to true
      setError('')
      setLoading(true)
      setStateConversionMessage('')

      // Check if API key exists
      if (!API_KEY) {
        setError('Weather API key not found. Please check your environment variables.')
        setLoading(false)
        return
      }

      // Process search input - convert state names to random cities
      // Skip processing for special cases like 'auto:ip'
      let cityToSearch
      let conversionInfo = null
      
      if (searchInput === 'auto:ip') {
        cityToSearch = searchInput
      } else {
        try {
          conversionInfo = processSearchInput(searchInput)
          cityToSearch = conversionInfo.city
        } catch (validationError) {
          setError(validationError.message)
          setLoading(false)
          return
        }
      }
      
      // Show user which city was selected based on conversion type
      if (conversionInfo && conversionInfo.type !== 'direct') {
        if (conversionInfo.type === 'nickname') {
          setStateConversionMessage(`Found city nickname "${conversionInfo.original}" - showing weather for ${conversionInfo.city}`)
        } else if (conversionInfo.type === 'state') {
          setStateConversionMessage(`Found state "${conversionInfo.original}" - showing weather for ${conversionInfo.city}`)
        }
      }

      // CONCEPT: API Calls - Using fetch() to make HTTP request to weather API
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityToSearch}&days=10`
      )
      const data = await res.json()

      // Handle API-specific errors (city not found, etc.)
      if (data.error) {
        setError('City not found')
        setCurrentWeather(null)
        setForecast([])
        setStateConversionMessage('')
        return
      }

      // CONCEPT: useState - Updating state with transformed API data
      // ✅ Add https: to the icon URL for proper image loading
      setCurrentWeather({
        location: `${data.location.name}, ${data.location.region}`,
        temp: data.current.temp_f,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_mph,
        pressure: data.current.pressure_mb,
        uvIndex: data.current.uv,
        icon: `https:${data.current.condition.icon}` // fixed here
      })

      // Transform forecast data into the format our components expect
      // Always show 7 days starting from today
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset to start of day for comparison
      
      // Create exactly 7 days starting from today
      const forecast7Days = []
      for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + i)
        
        // Find matching day in API data
        const matchingDay = data.forecast.forecastday.find(day => {
          const dayDate = new Date(day.date)
          dayDate.setHours(0, 0, 0, 0)
          return dayDate.getTime() === targetDate.getTime()
        })
        
        const dayName = i === 0 ? 'Today' : targetDate.toLocaleDateString('en-US', {
          weekday: 'long'
        })
        
        if (matchingDay) {
          // Use real API data
          forecast7Days.push({
            day: dayName,
            temp: Math.round(matchingDay.day.avgtemp_f),
            condition: matchingDay.day.condition.text,
            icon: `https:${matchingDay.day.condition.icon}`
          })
        } else {
          // Use the last available day's data as fallback (better than placeholder)
          const lastAvailableDay = data.forecast.forecastday[data.forecast.forecastday.length - 1]
          forecast7Days.push({
            day: dayName,
            temp: Math.round(lastAvailableDay.day.avgtemp_f),
            condition: lastAvailableDay.day.condition.text,
            icon: `https:${lastAvailableDay.day.condition.icon}`
          })
        }
      }
      
      setForecast(forecast7Days)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch weather data.')
    } finally {
      // Always set loading to false, whether success or error
      setLoading(false)
    }
  }

  // CONCEPT: useEffect - Perform side effect (API call) after component mounts
  // Empty dependency array [] means this runs once on mount, like componentDidMount
  // 🧠 Auto-detect location by IP on load for better user experience
  useEffect(() => {
    fetchWeather('auto:ip')
  }, []) // Empty dependency array = run once on mount

  // useEffect to update time of day when testTime changes
  useEffect(() => {
    setTimeOfDay(getTimeOfDay())
  }, [testTime])

  return (
    <div className={`homepage-container ${timeOfDay}`}>
      <header className="homepage-header">
        <div className="homepage-logo">⛅ Cloudy with AI</div>
        <div className="homepage-nav">
          <button className="nav-btn" onClick={cycleTimeOfDay}>
            {timeOfDay === 'morning' && '☀️ Morning'}
            {timeOfDay === 'afternoon' && '🌤️ Afternoon'}
            {timeOfDay === 'evening' && '🌅 Evening'}
            {timeOfDay === 'night' && '🌙 Night'}
          </button>
        </div>
      </header>

      <main className="homepage-main">
        <div className="main-content">
          {/* 
            CONCEPT: Passing Props - Passing the fetchWeather function to SearchBar component
            This allows the child component to trigger data fetching in the parent
          */}
          <SearchBar onSearch={fetchWeather} />

          {/* Conditional rendering based on state - shows different UI based on loading/error states */}
          {loading && <p className="status-message loading">Loading your local weather...</p>}
          {error && <p className="status-message error">{error}</p>}
          {stateConversionMessage && <p className="status-message info">{stateConversionMessage}</p>}

          {/* 
            CONCEPT: Passing Props - Passing state data down to child components
            WeatherCard receives current weather data, ForecastGrid receives forecast array
            This demonstrates how data flows down the component tree through props
          */}
          <WeatherCard weather={currentWeather} />
          <div className="forecast-section">
            <ForecastGrid forecast={forecast} />
          </div>
        </div>

        {/* Sidebar with additional weather details */}
        {currentWeather && (
          <div className="sidebar-content">
            <div className="info-card">
              <h3 className="info-card-title">Weather Details</h3>
              <div className="info-card-content">
                <p>
                  Today's conditions in {currentWeather.location.split(',')[0]} are{' '}
                  {currentWeather.condition.toLowerCase()}. The current temperature feels comfortable
                  at {currentWeather.temp}°F.
                </p>
              </div>
            </div>
            <div className="info-card">
              <h3 className="info-card-title">Air Quality</h3>
              <div className="info-card-content">
                <p>
                  UV Index: {currentWeather.uvIndex}/10
                  <br />
                  Humidity: {currentWeather.humidity}%
                  <br />
                  Pressure: {(currentWeather.pressure * 0.02953).toFixed(2)} inHg
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}