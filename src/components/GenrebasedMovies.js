import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS/GenrebasedMovies.css';

const MoviesList = () => {
  const { genreName } = useParams(); // Extract genreName from the URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Track current page
  const [totalPages, setTotalPages] = useState(0); // Track total pages

  useEffect(() => {
    const fetchMovies = async () => {
      if (!genreName) return;

      try {
        setLoading(true);
        setError(null); // Reset error state before each fetch

        // Make the API request with the genre name and pagination parameters
        const response = await fetch(`https://localhost:7019/api/postgres/genres/${genreName}?page=${page}&pageSize=10`);

        if (!response.ok) {
          throw new Error(`Error fetching movies: ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response contains movies
        if (data.items && data.items.length > 0) {
          setMovies(data.items); // Set the movies
          setTotalPages(data.numberPages); // Set total pages for pagination
        } else {
          setMovies([]);
        }
      } catch (error) {
        setError(error.message); // Set error state
      } finally {
        setLoading(false); // Always stop loading after the fetch
      }
    };

    fetchMovies();
  }, [genreName, page]); // Refetch whenever genreName or page changes

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  if (loading) return <div className="loading">Loading movies...</div>;

  if (error) return <div className="error">Error: {error}</div>;

  if (movies.length === 0) return <div className="no-movies">No movies found for this genre.</div>;

  return (
    <div className="movies-list-container">
      <h3>Movies List for {genreName}</h3>
      <ul>
        {movies.map((movie) => (
          <li key={movie.tconst}>
            <strong>{movie.primarytitle}</strong> ({movie.startyear})
            <span>{movie.genres}</span>
          </li>
        ))}
      </ul>

      <div className="pagination-container">
        <button onClick={handlePrevPage} disabled={page <= 0}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
      </div>

      {/* Display the current page number at the end */}
      <div className="page-number">
        <strong> Page:</strong> {page + 1} / {totalPages}
      </div>
    </div>
  );
};

export default MoviesList;
