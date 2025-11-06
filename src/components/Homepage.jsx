

import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import ForecastGrid from '../components/ForecastGrid'

export default function Homepage() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  async function fetchWeather(city) {
    try {
      setError('')
      setLoading(true)

      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`
      )
      const data = await res.json()

      if (data.error) {
        setError('City not found')
        setCurrentWeather(null)
        setForecast([])
        return
      }

      // ✅ Add https: to the icon URL
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

      setForecast(
        data.forecast.forecastday.map((day) => ({
          day: new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'long'
          }),
          temp: day.day.avgtemp_f,
          condition: day.day.condition.text,
          icon: `https:${day.day.condition.icon}`
        }))
      )
    } catch (err) {
      console.error(err)
      setError('Failed to fetch weather data.')
    } finally {
      setLoading(false)
    }
  }

  // 🧠 Auto-detect location by IP on load
  useEffect(() => {
    fetchWeather('auto:ip')
  }, [])

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="homepage-logo">⛅ Cloudy with AI</div>
      </header>

      <SearchBar onSearch={fetchWeather} />

      {loading && <p>Loading your local weather...</p>}
      {error && {error}}

      <WeatherCard weather={currentWeather} />
      <ForecastGrid forecast={forecast} />
    </div>
  )
}