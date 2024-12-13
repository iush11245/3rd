import React from "react";

const SearchBar = ({ searchBy, searchInput, handleSearchByChange, handleSearchInputChange, handleSearch, handleKeyPress }) => (
  <div className="search">
    <select className="search-dropdown" value={searchBy} onChange={handleSearchByChange}>
      <option value="Actor">Actor</option>
      <option value="Movies">Movies</option>
      <option value="Released Year">Released Year</option>
    </select>
    <input
      type="text"
      placeholder={`Search by ${searchBy}...`}
      value={searchInput}
      onChange={handleSearchInputChange}
      onKeyPress={handleKeyPress}
    />
    <button onClick={handleSearch}>🔍</button>
  </div>
);

export default SearchBar;