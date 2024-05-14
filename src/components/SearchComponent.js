import React, { useState } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/search?COURSE=${encodeURIComponent(searchTerm)}`);
      setIsLoading(false);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data);
      setShowCalendar(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error searching:", error);
    }
  };
  
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter course name"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map(course => (
          <li key={course._id}>{course.COURSE}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchComponent;
