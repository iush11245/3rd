import React, { useState, useEffect } from 'react';
import '../CSS/Home.css'; // Import custom CSS for styling

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0); // Current page
    const [totalPages, setTotalPages] = useState(0); // Total pages
    

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://localhost:7019//api/movie?page=${page}&pagesize=10`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data = await response.json();
                setMovies(data.items);
                setTotalPages(data.numberPages || 1); // Default to 1 if not provided
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page]); // Refetch movies when the page changes

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

    if (loading) return <p>Loading movies...</p>;
    if (error) return <p>Error: {error}</p>;

    
    return (
        <div className="home-page-container">
            <h1>All Movies</h1>
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

export default HomePage;
