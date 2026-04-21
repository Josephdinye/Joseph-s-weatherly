// src/components/CurrentWeather.jsx
export default function CurrentWeather({ weather }) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;

  return (
    <div className="weather-card">
      <div className="location">
        <h2>
          {weather.name}, {weather.sys.country}
        </h2>
      </div>

      <img 
        src={iconUrl} 
        alt={weather.weather[0].description} 
        className="weather-icon"
      />

      <div className="temperature">
        {Math.round(weather.main.temp)}°C
      </div>

      <div className="description">
        {weather.weather[0].description}
      </div>

      <div className="details">
        <div className="detail-item">
          🌡️
          <span>Feels like</span>
          <strong>{Math.round(weather.main.feels_like)}°C</strong>
        </div>

        <div className="detail-item">
          💨
          <span>Wind Speed</span>
          <strong>{weather.wind.speed} m/s</strong>
        </div>

        <div className="detail-item">
          💧
          <span>Humidity</span>
          <strong>{weather.main.humidity}%</strong>
        </div>
      </div>
    </div>
  );
}