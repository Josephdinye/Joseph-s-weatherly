// src/components/Forecast.jsx
export default function Forecast({ forecast }) {
  // Group forecast by day (OpenWeather gives data every 3 hours)
  const dailyForecast = [];
  const seenDays = new Set();

  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();

    if (!seenDays.has(dayKey) && dailyForecast.length < 5) {
      seenDays.add(dayKey);
      dailyForecast.push({
        date: date,
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        weather: item.weather[0],
      });
    }
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>

      <div className="forecast-container">
        {dailyForecast.map((day, index) => {
          const dayName = days[day.date.getDay()];
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`;

          return (
            <div key={index} className="forecast-card">
              <img src={iconUrl} alt={day.weather.description} />
              
              <div className="forecast-date">{dayName}</div>
              <div style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '0.8rem' }}>
                {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>

              <div className="forecast-temp">
                <span style={{ color: '#fee2e2' }}>{Math.round(day.temp_max)}°</span> / 
                <span style={{ color: '#bfdbfe' }}> {Math.round(day.temp_min)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}