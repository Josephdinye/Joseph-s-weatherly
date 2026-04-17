import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Loader from './components/Loader';

function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) return;

    setLoading(true);
    setError('');

    try {
      const weatherRes = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric`
      );

      if (!weatherRes.ok) {
        throw new Error('City not found');
      }

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
        ? 'City not found. Please check the spelling and try again.' 
        : 'Failed to fetch weather. Please check your internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load London weather when app starts
  useEffect(() => {
    fetchWeather('London');
  }, []);

  const handleSearch = (newCity) => {
    fetchWeather(newCity);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container flex-1">
        <header>
          <h1>Joseph's ☀️ Weatherly</h1>
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

      {/* Styled Footer */}
      <footer>
        <div className="footer-container">
          <p>
            Design By{' '}
            <a 
              href="https://josephdinye.tech" 
              target="_blank" 
              rel="noopener noreferrer"
            >
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