

import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastGrid from '../components/ForecastGrid'
import { processSearchInput } from '../utils/citySearch'

/**
 * Generates a full week forecast starting from Monday
 * @param {Array} apiForecastData - Forecast data from weather API
 * @returns {Array} - Full week forecast array starting from current week's Monday
 */
function generateFullWeekForecast(apiForecastData) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate how many days to go back to reach this week's Monday
  const daysBackToMonday = currentDay === 0 ? 6 : (currentDay - 1)
  
  // Create full week starting from this week's Monday
  return daysOfWeek.map((dayName, index) => {
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() - daysBackToMonday + index)
    
    // Try to find matching data from API
    const apiData = apiForecastData.find(day => {
      const apiDate = new Date(day.date)
      return apiDate.toDateString() === targetDate.toDateString()
    })
    
    if (apiData) {
      // Use real API data
      return {
        day: dayName,
        temp: Math.round(apiData.day.avgtemp_f),
        condition: apiData.day.condition.text,
        icon: `https:${apiData.day.condition.icon}`
      }
    } else {
      // Generate placeholder data for days beyond API coverage or past days
      const baseTemp = 65
      const tempVariation = Math.random() * 20 - 10 // ±10 degrees
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain']
      const icons = [
        '//cdn.weatherapi.com/weather/64x64/day/116.png', // Partly cloudy
        '//cdn.weatherapi.com/weather/64x64/day/119.png', // Cloudy
        '//cdn.weatherapi.com/weather/64x64/day/296.png', // Light rain
        '//cdn.weatherapi.com/weather/64x64/day/113.png'  // Sunny
      ]
      
      const randomIndex = Math.floor(Math.random() * conditions.length)
      
      return {
        day: dayName,
        temp: Math.round(baseTemp + tempVariation),
        condition: conditions[randomIndex],
        icon: `https:${icons[randomIndex]}`
      }
    }
  })
}

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
  const [timeOfDay, setTimeOfDay] = useState('') // Stores current time period for background styling
  const [testTime, setTestTime] = useState(null) // For testing different times of day

  // Environment variable access for API key - keeps sensitive data secure
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  /**
   * Determines the time of day period based on current hour (or test time)
   * Returns CSS class name for background styling
   */
  function getTimeOfDay() {
    const hour = testTime !== null ? testTime : new Date().getHours()
    console.log('Current hour:', hour) // Debug log
    
    if (hour >= 6 && hour < 12) {
      console.log('Setting background to: morning')
      return 'morning' // 6am - 12pm: Light blue morning sky
    } else if (hour >= 12 && hour < 17) {
      console.log('Setting background to: afternoon')
      return 'afternoon' // 12pm - 5pm: Bright daytime sky
    } else if (hour >= 17 && hour < 20) {
      console.log('Setting background to: evening')
      return 'evening' // 5pm - 8pm: Golden hour/sunset
    } else {
      console.log('Setting background to: night')
      return 'night' // 8pm - 6am: Dark purple night with stars
    }
  }

  /**
   * Generates outfit recommendations based on weather conditions
   * Takes temperature, weather condition, wind speed, and forecast into account
   * @param {Object} weather - Current weather data
   * @param {Array} forecast - Forecast data for upcoming days
   * @returns {Object} - Outfit recommendation with suggestion and icons
   */
  function getOutfitRecommendation(weather, forecastData = []) {
    if (!weather) return null
    
    const temp = weather.temp
    const condition = weather.condition.toLowerCase()
    const windSpeed = weather.windSpeed
    const humidity = weather.humidity
    
    let suggestion = ""
    let icons = ""
    let tips = []
    
    // Check if rain is expected later (from forecast)
    const rainLater = forecastData.some(day => 
      day.condition && day.condition.toLowerCase().includes('rain')
    )
    
    // Temperature-based recommendations
    if (temp >= 80) {
      suggestion = "Light, breathable clothing recommended"
      icons = "👕🩳☀️"
      tips.push("Wear lightweight fabrics like cotton or linen")
      tips.push("Don't forget sunscreen and sunglasses")
      if (humidity > 70) tips.push("Choose moisture-wicking materials")
    } else if (temp >= 70) {
      suggestion = "Perfect weather for comfortable casual wear"
      icons = "👔👖🌤️"
      tips.push("T-shirt or light blouse with jeans")
      tips.push("Light layers in case it gets breezy")
    } else if (temp >= 60) {
      suggestion = "Layer up with a light jacket or sweater"
      icons = "🧥👕🍂"
      tips.push("Long sleeves with a light jacket")
      tips.push("Perfect for layering — easy to adjust")
    } else if (temp >= 50) {
      suggestion = "Bring a warm jacket — it's getting chilly"
      icons = "🧥🧤🌬️"
      tips.push("Warm jacket or hoodie recommended")
      tips.push("Consider long pants and closed shoes")
    } else if (temp >= 32) {
      suggestion = "Bundle up! Winter clothing needed"
      icons = "🧥🧤🧣"
      tips.push("Heavy coat, gloves, and warm layers")
      tips.push("Insulated boots and thermal underwear")
    } else {
      suggestion = "Extreme cold! Full winter gear essential"
      icons = "❄️🧥🧤"
      tips.push("Multiple layers, heavy winter coat")
      tips.push("Cover all exposed skin")
    }
    
    // Weather condition adjustments
    if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle')) {
      tips.unshift("☂️ Rain expected — bring an umbrella!")
      tips.push("🥾 Waterproof shoes recommended")
      if (!icons.includes('☂️')) icons = '☂️' + icons
    } else if (rainLater) {
      tips.unshift("☂️ Rain expected later — pack an umbrella!")
    }
    
    if (condition.includes('snow') || condition.includes('blizzard')) {
      tips.unshift("❄️ Snow expected — wear warm, waterproof boots")
      tips.push("🧤 Don't forget gloves and a hat")
      if (!icons.includes('❄️')) icons = '❄️' + icons
    }
    
    if (condition.includes('wind') || windSpeed > 15) {
      tips.push("💨 Windy conditions — secure loose clothing")
      tips.push("🧥 Wind-resistant outer layer recommended")
    }
    
    if (condition.includes('sun') || condition.includes('clear')) {
      tips.push("🕶️ Sunny day — sunglasses recommended")
      if (temp > 70) tips.push("🧴 Don't forget sunscreen (SPF 30+)")
    }
    
    if (humidity > 80) {
      tips.push("💧 High humidity — choose moisture-wicking fabrics")
    }
    
    // Time-specific suggestions
    const hour = new Date().getHours()
    if (hour >= 17 && hour < 20 && temp < 65) {
      tips.push("🌅 Evening chill coming — bring extra layer")
    }
    
    return {
      suggestion,
      icons,
      tips: tips.slice(0, 4) // Allow up to 4 tips for comprehensive advice
    }
  }

  // Test function to cycle through different times of day
  function cycleTimeOfDay() {
    const times = [8, 14, 18, 22] // 8am, 2pm, 6pm, 10pm
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
      const cityToSearch = searchInput === 'auto:ip' ? searchInput : processSearchInput(searchInput)
      
      // Show user which city was selected if a state was entered
      if (cityToSearch !== searchInput && searchInput !== 'auto:ip') {
        setStateConversionMessage(`Found state "${searchInput}" - showing weather for ${cityToSearch}`)
      }

      // CONCEPT: API Calls - Using fetch() to make HTTP request to weather API
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityToSearch}&days=7`
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
      // Generate a full week starting from Monday
      const fullWeekForecast = generateFullWeekForecast(data.forecast.forecastday)
      setForecast(fullWeekForecast)
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
    console.log('Homepage component mounted, fetching weather for auto:ip')
    fetchWeather('auto:ip')
  }, []) // Empty dependency array = run once on mount

  // CONCEPT: useEffect - Update time-based background styling
  // Sets initial time of day and updates every minute
  useEffect(() => {
    // Set initial time of day
    setTimeOfDay(getTimeOfDay())
    
    // Update time of day every minute (60000ms) only if not in test mode
    if (testTime === null) {
      const timeInterval = setInterval(() => {
        setTimeOfDay(getTimeOfDay())
      }, 60000)

      // Cleanup interval on component unmount
      return () => clearInterval(timeInterval)
    }
  }, [testTime])

  // Update time of day when test time changes
  useEffect(() => {
    setTimeOfDay(getTimeOfDay())
  }, [testTime])

  return (
    <div className={`homepage-container ${timeOfDay}`}>
      <header className="homepage-header">
        <div className="homepage-logo">⛅ Cloudy with AI</div>
        <div className="homepage-nav">
          <button className="nav-btn">Today</button>
          <button className="nav-btn">Forecast</button>
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
          
          {/* Move forecast to bottom of main content area */}
          <div className="forecast-section">
            <ForecastGrid forecast={forecast} />
          </div>
        </div>

        <div className="sidebar-content">
          {/* Additional weather info cards for laptop layout */}
          {currentWeather && (
            <div className="info-cards">
              <div className="info-card outfit-card">
                <h3 className="info-card-title">👔 What to Wear</h3>
                <div className="info-card-content">
                  {(() => {
                    const outfit = getOutfitRecommendation(currentWeather, forecast)
                    return outfit ? (
                      <>
                        <div className="outfit-icons">{outfit.icons}</div>
                        <p className="outfit-suggestion">{outfit.suggestion}</p>
                        <div className="outfit-tips">
                          {outfit.tips.map((tip, index) => (
                            <div key={index} className="outfit-tip">{tip}</div>
                          ))}
                        </div>
                      </>
                    ) : null
                  })()}
                </div>
              </div>
              <div className="info-card">
                <h3 className="info-card-title">Weather Details</h3>
                <div className="info-card-content">
                  <p>Today's conditions in {currentWeather.location.split(',')[0]} are {currentWeather.condition.toLowerCase()}. 
                     The current temperature feels comfortable at {currentWeather.temp}°F.</p>
                </div>
              </div>
              <div className="info-card">
                <h3 className="info-card-title">Air Quality</h3>
                <div className="info-card-content">
                  <p>UV Index: {currentWeather.uvIndex}/10<br/>
                     Humidity: {currentWeather.humidity}%<br/>
                     Pressure: {(currentWeather.pressure * 0.02953).toFixed(2)} inHg</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}