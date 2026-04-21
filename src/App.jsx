// src/App.jsx
import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Loader from './components/Loader';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Fetch weather by city name
  const fetchWeather = async (searchCity) => {
    if (!searchCity?.trim()) return;

    setLoading(true);
    setError('');

    try {
      const weatherRes = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric`
      );

      if (!weatherRes.ok) throw new Error('City not found');

      const weatherData = await weatherRes.json();

      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData);
      setCity(searchCity);

    } catch (err) {
      setError(err.message.includes('City not found') 
        ? 'City not found. Please try another city.' 
        : 'Failed to fetch weather data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get user's current location using browser GPS
  const getDeviceLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      fetchWeather('London'); // fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding to get city name
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
          );
          const data = await res.json();

          if (data && data.length > 0) {
            const cityName = `${data[0].name}, ${data[0].country}`;
            fetchWeather(cityName);
          } else {
            fetchWeather('London'); // fallback
          }
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          fetchWeather('London');
        }
      },
      (error) => {
        console.log("Geolocation error:", error.message);
        fetchWeather('London'); // fallback if user denies permission
      }
    );
  };

  // Run on app start
  useEffect(() => {
    getDeviceLocation();
  }, []);

  const handleSearch = (newCity) => {
    fetchWeather(newCity);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container flex-1">
        <header>
          <h1>☀️ Weatherly</h1>
          <p>Real-time weather information</p>
        </header>

        <SearchBar onSearch={handleSearch} />

        {error && <div className="error">{error}</div>}

        {loading ? (
          <Loader />
        ) : (
          <>
            {weather && <CurrentWeather weather={weather} />}
            {forecast && <Forecast forecast={forecast} />}
          </>
        )}
      </div>

      <footer>
        <div className="footer-container">
          <p>
            Design By{' '}
            <a href="https://josephdinye.tech" target="_blank" rel="noopener noreferrer">
              Joseph Dinye
            </a>
          </p>
          <p className="footer-credit">
            Built with React • OpenWeatherMap API • University of the People
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;