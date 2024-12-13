import React from "react";
import '../CSS/moviedetails.css';

const MovieDetails = ({ selectedMovie, closeMovieDetails }) => (
  selectedMovie && (
    <div className="movie-details-modal">
      <div className="movie-details-content">
        <h2>{selectedMovie.title || selectedMovie.name}</h2>
        <img
          src={
            selectedMovie.poster_path
              ? `https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`
              : "/No.png"
          }
          alt={selectedMovie.title || selectedMovie.name}
        />
        <p>{selectedMovie.overview}</p>
        <button onClick={closeMovieDetails} className="close-btn">
          Close
        </button>
      </div>
    </div>
  )
);

export default MovieDetails;