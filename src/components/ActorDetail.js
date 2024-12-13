import React, { useState, useEffect } from "react";
import axios from "axios";

const ActorDetails = ({ selectedActor, setSelectedActor }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [actorMovies, setActorMovies] = useState([]);
  const [actorImages, setActorImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = "b5987557d1737fe1b74313c3201f2152";

  useEffect(() => {
    const fetchActorDetails = async (actorId) => {
      setIsLoading(true);
      try {
        const moviesResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${apiKey}`
        );
        setActorMovies(moviesResponse.data.cast.slice(0, 5));

        const imagesResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}/images?api_key=${apiKey}`
        );
        setActorImages(imagesResponse.data.profiles.slice(0, 5));

        const actorResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`
        );
        setSelectedActor(actorResponse.data);
      } catch (error) {
        console.error("Error fetching actor details:", error);
        alert("An error occurred while fetching actor details.");
      }
      setIsLoading(false);
    };

    if (selectedActor) {
      fetchActorDetails(selectedActor.id);
      setIsPopupVisible(true);
    }
  }, [selectedActor]);

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedActor(null);
  };

  return (
    isPopupVisible && (
      <div className="actor-popup">
        <div className="popup-content">
          <h2>{selectedActor.name}</h2>
          <p>{selectedActor.biography || "No biography available."}</p>

          <div className="actor-images">
            <h3>Images</h3>
            <div className="images-grid">
              {actorImages.length > 0 ? (
                actorImages.map((image) => (
                  <img
                    key={image.file_path}
                    src={`https://image.tmdb.org/t/p/w200${image.file_path}`}
                    alt="Actor"
                    className="actor-image"
                  />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>

          <div className="actor-movies">
            <h3>Best Movies</h3>
            <div className="movies-grid">
              {actorMovies.length > 0 ? (
                actorMovies.map((movie) => (
                  <div key={movie.id} className="movie-item">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <p>{movie.title}</p>
                  </div>
                ))
              ) : (
                <p>No movies available</p>
              )}
            </div>
          </div>
          <button onClick={closePopup} className="close-btn">
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default ActorDetails;