import React from "react";

const SearchResults = ({ searchResults, searchBy, handleActorClick, handleMovieClick }) => (
  <div className="search-results">
    {searchResults.map((result) => (
      <div
        key={result.id}
        className="search-result-item"
        onClick={() =>
          searchBy === "Actor" ? handleActorClick(result.id) : handleMovieClick(result)
        }
      >
        {searchBy === "Actor" ? (
          <>
            <img
              src={
                result.profile_path
                  ? `https://image.tmdb.org/t/p/w200${result.profile_path}`
                  : "/No.png"
              }
              alt={result.name || "No Image Available"}
              className="search-result-thumbnail"
            />
            <p className="search-result-title">{result.name}</p>
          </>
        ) : (
          <>
            <img
              src={
                result.poster_path
                  ? `https://image.tmdb.org/t/p/w200${result.poster_path}`
                  : "/No.png"
              }
              alt={result.title || result.name || "No Image Available"}
              className="search-result-thumbnail"
            />
            <p className="search-result-title">{result.title || result.name}</p>
          </>
        )}
      </div>
    ))}
  </div>
);

export default SearchResults;