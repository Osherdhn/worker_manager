import React, { useState } from 'react';

function FilterBar({ search }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    search(e.target.value);
  };

  return (
    <div className="d-flex justify-content-center mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Search by name or details"
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
}

export default FilterBar;
