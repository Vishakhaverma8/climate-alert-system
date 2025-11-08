import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const CitySearch = ({ onCitySelect, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowResults(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length === 0) {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (city) => {
    const cityName = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
    onCitySelect(cityName, city.lat, city.lon);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div style={styles.container}>
      <style>{`
        .search-input:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
        }
        
        .search-result:hover {
          background: rgba(0, 212, 255, 0.2);
          transform: translateX(5px);
        }
      `}</style>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <div style={styles.searchContainer}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for a city... (e.g., London, Paris, Tokyo)"
            style={styles.searchInput}
          />
          <button 
            type="submit" 
            style={styles.searchButton}
            disabled={!searchQuery.trim()}
          >
            Search
          </button>
        </div>
      </form>

      {showResults && searchResults.length > 0 && (
        <div style={styles.resultsContainer}>
          {searchResults.map((city, index) => (
            <div
              key={index}
              className="search-result"
              style={styles.resultItem}
              onClick={() => handleResultClick(city)}
            >
              <MapPin size={16} color="#00d4ff" />
              <div style={styles.resultText}>
                <span style={styles.cityName}>
                  {city.name}
                  {city.state && `, ${city.state}`}
                </span>
                <span style={styles.country}>{city.country}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popular Cities Quick Select */}
      <div style={styles.popularCities}>
        <span style={styles.popularLabel}>Popular:</span>
        {['London', 'New York', 'Tokyo', 'Paris', 'Mumbai', 'Sydney'].map((city) => (
          <button
            key={city}
            style={styles.cityButton}
            onClick={() => onSearch(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '2rem'
  },
  searchForm: {
    width: '100%'
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden'
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem'
  },
  searchInput: {
    flex: 1,
    padding: '1rem 1rem 1rem 3rem',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  searchButton: {
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
    color: '#fff',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem'
  },
  resultsContainer: {
    marginTop: '0.5rem',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    maxHeight: '300px',
    overflowY: 'auto'
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  resultText: {
    display: 'flex',
    flexDirection: 'column'
  },
  cityName: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '500'
  },
  country: {
    color: '#888',
    fontSize: '0.875rem'
  },
  popularCities: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  popularLabel: {
    color: '#888',
    fontSize: '0.875rem'
  },
  cityButton: {
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease'
  }
};

export default CitySearch;