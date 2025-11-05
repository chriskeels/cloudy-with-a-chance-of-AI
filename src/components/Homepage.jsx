import { useState } from 'react'

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [error, setError] = useState('')

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY


  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setError('')
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${searchQuery}`
      )
      const data = await response.json()

      if (data.error) {
        setError('City not found')
        setCurrentWeather(null)
        return
      }

      setCurrentWeather({
        location: `${data.location.name}, ${data.location.region}`,
        temp: data.current.temp_f,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_mph,
        pressure: data.current.pressure_mb,
        uvIndex: data.current.uv,
        icon: data.current.condition.icon
      })
    } catch (err) {
      console.error('Error fetching weather:', err)
      setError('Failed to load weather data')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="homepage-logo">⛅ Cloudy with AI</div>
      </header>

      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search 🔍
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {currentWeather && (
        <div className="weather-card-large">
          <h2 className="current-location">{currentWeather.location}</h2>
          <div className="current-temp">{currentWeather.temp}°F</div>
          <img
            src={currentWeather.icon}
            alt={currentWeather.condition}
            style={{ width: '64px', height: '64px' }}
          />
          <p className="weather-description">{currentWeather.condition}</p>

          <div className="weather-details">
            <div className="weather-detail-item">
              <div className="detail-label">Humidity</div>
              <div className="detail-value">{currentWeather.humidity}%</div>
            </div>
            <div className="weather-detail-item">
              <div className="detail-label">Wind</div>
              <div className="detail-value">{currentWeather.windSpeed} mph</div>
            </div>
            <div className="weather-detail-item">
              <div className="detail-label">Pressure</div>
              <div className="detail-value">{currentWeather.pressure} mb</div>
            </div>
            <div className="weather-detail-item">
              <div className="detail-label">UV Index</div>
              <div className="detail-value">{currentWeather.uvIndex}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
