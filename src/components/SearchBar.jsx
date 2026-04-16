// src/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const timeoutRef = useRef(null);

  // Fetch city suggestions as user types
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=8&appid=${API_KEY}`
      );
      const data = await res.json();

      setSuggestions(data); // array of {name, country, state, lat, lon}
    } catch (err) {
      console.error("Suggestion error:", err);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounce typing (wait 300ms before calling API)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(input);
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [input]);

  const handleSelect = (city) => {
    const cityName = city.state 
      ? `${city.name}, ${city.state}, ${city.country}` 
      : `${city.name}, ${city.country}`;

    onSearch(cityName);
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Get current location using browser GPS
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
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
            const cityName = data[0].name + ", " + data[0].country;
            onSearch(cityName);
          } else {
            alert("Could not detect city name. Try searching manually.");
          }
        } catch (err) {
          alert("Failed to get location. Please check your internet or permissions.");
        }
      },
      (error) => {
        alert("Location access denied or unavailable. Please allow location permission.");
      }
    );
  };

  return (
    <div className="search-wrapper" style={{ position: 'relative', maxWidth: '500px', margin: '0 auto 3rem' }}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Enter city name (e.g. Paris, Tokyo)"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          🔍
        </button>
      </form>

      {/* Current Location Button */}
      <button 
        onClick={getCurrentLocation}
        style={{
          position: 'absolute',
          right: '70px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.25)',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '9999px',
          cursor: 'pointer',
          fontSize: '0.95rem'
        }}
      >
        📍 My Location
      </button>

      {/* Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((city, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelect(city)}
            >
              {city.name}
              {city.state && `, ${city.state}`}
              {`, ${city.country}`}
            </div>
          ))}
        </div>
      )}

      {showSuggestions && loadingSuggestions && (
        <div className="suggestions-dropdown">
          <div className="suggestion-item">Loading suggestions...</div>
        </div>
      )}
    </div>
  );
}