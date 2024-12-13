import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

const App = () => {
  const [searchBy, setSearchBy] = useState("Movies");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorMovies, setActorMovies] = useState([]);
  const [actorImages, setActorImages] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [UserData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  // Password state variables
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [passwordUpdateError, setPasswordUpdateError] = useState(""); // For handling password update errors

  const user_id = 1;
  const apiKey = "b5987557d1737fe1b74313c3201f2152";
  const popupRef = useRef(null);

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    setIsLoading(true);
    try {
      let apiUrl = "";

      if (searchBy === "Movies") {
        apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchInput}&page=1`;
      } else if (searchBy === "Actor") {
        apiUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${searchInput}&page=1`;
      } else if (searchBy === "Released Year") {
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${searchInput}&page=1`;
      } else {
        alert("Please select a valid search criteria.");
        return;
      }

      const response = await axios.get(apiUrl);
      const results = response.data.results;

      if (results.length > 0) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
        alert("No results found.");
      }
    } catch (error) {
      console.error("Error fetching data", error);
      alert("An error occurred while searching. Please try again.");
    }
    setIsLoading(false);
  };

  const loadMoreResults = async () => {
    const nextPage = currentPage + 1;
    try {
      const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchInput}&page=${nextPage}`;
      const response = await axios.get(apiUrl);
      const results = response.data.results;

      if (results.length > 0) {
        setSearchResults((prevResults) => [...prevResults, ...results]);
        setCurrentPage(nextPage);
      } else {
        alert("No more results available.");
      }
    } catch (error) {
      console.error("Error fetching additional data from TMDB:", error);
      alert("An error occurred while loading more results. Please try again.");
    }
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/postgres/user_info`);
      console.log("Fetched user data:", response.data);
      
      // Assuming the data is an array and you want the first element
      if (Array.isArray(response.data) && response.data.length > 0) {
        setUserData(response.data[0]);  // Take the first item if it's an array
      } else {
        setUserData(response.data);  // Use the data as is if not an array
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Unable to load user details. Please try again.");
    }
    setIsLoading(false);
  };
  


  const handleActorClick = async (actorId) => {
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

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const closeMovieDetails = () => {
    setSelectedMovie(null);
  };

  const togglePopup = async () => {
    if (isPopupVisible) {
      setIsClosing(true);
      setTimeout(() => {
        setIsPopupVisible(false);
        setIsClosing(false);
      }, 300);
    } else {
      await fetchUserData();
      setIsPopupVisible(true);
    }
  };
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordUpdateError("Passwords do not match.");
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/update_password`, {
        userId: user_id,
        newPassword: newPassword,
      });
  
      if (response.status === 200) {
        alert("Password updated successfully.");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordUpdateError("");
      } else {
        alert("Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordUpdateError("An error occurred while updating the password. Please try again.");
    }
  };
  

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/SearchHistory/${user_id}`)
      .then((response) => setSearchHistory(response.data))
      .catch((error) => console.error("Error fetching search history:", error));

    axios
      .get(`http://localhost:5000/api/RatingHistory/${user_id}`)
      .then((response) => setRatingHistory(response.data))
      .catch((error) => console.error("Error fetching rating history:", error));

    const closePopupOnEscape = (e) => {
      if (e.key === "Escape") {
        setIsPopupVisible(false);
      }
    };

    const closePopupOnClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener("keydown", closePopupOnEscape);
    document.addEventListener("click", closePopupOnClickOutside);

    return () => {
      document.removeEventListener("keydown", closePopupOnEscape);
      document.removeEventListener("click", closePopupOnClickOutside);
    };
  }, [user_id]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="top-bar">
          <nav className="menu">
            <div className="menu-item">
              <label htmlFor="genre-select">Genre</label>
              <select id="genre-select" className="genre-dropdown">
                <option value="action">Action</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="horror">Horror</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="romance">Romance</option>
              </select>
            </div>
            <div className="menu-item">Recent Released</div>
            <div className="menu-item">Top Rated</div>
            <div className="menu-item">Recommended</div>
          </nav>

          <div className="user-profile-center" onClick={togglePopup}>
            <img src="/profile.png" alt="User Icon" className="profile-icon" />
            <div className="user-profile-label">User Profile</div>
          </div>

          {isPopupVisible && (
            <div className={`popup-overlay ${isClosing ? "fadeOut" : ""}`}>
              <div
                className={`popup-content ${isClosing ? "slideOut" : "slideIn"}`}
                ref={popupRef}
              >
                <h2>User Profile</h2>
                {isLoading ? (
                  <p>Loading user details...</p>
                ) : UserData ?(
                  <div className="profile-section">
                    <p>Username: {UserData.username}</p>
                    <p>Email: {UserData.email}</p>
                    <p>Member Since: {UserData.created_date}</p>
                  </div>
                ) : (
                  <p>No user details available.</p>
                )}


                {/* User Ratings Section */}
                <div className="profile-section">
                  <h3>User Ratings</h3>
                  <ul>
                    {ratingHistory.length > 0 ? (
                      ratingHistory.map((rating, index) => (
                        <li key={index}>{rating.movieName} - {rating.rating} stars</li>
                      ))
                    ) : (
                      <li>No ratings available</li>
                    )}
                  </ul>
                </div>

                {/* Search History Section */}
                <div className="profile-section">
                  <h3>Search History</h3>
                  <ul>
                    {searchHistory.length > 0 ? (
                      searchHistory.map((search, index) => (
                        <li key={index}>{search.query}</li>
                      ))
                    ) : (
                      <li>No search history available</li>
                    )}
                  </ul>
                </div>

                {/* Update Password Section */}
                <div className="profile-section">
                  <h3>Update Password</h3>
                  {passwordUpdateError && <p style={{ color: 'red' }}>{passwordUpdateError}</p>}
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button onClick={handlePasswordChange}>Update Password</button>
                </div>
                <button onClick={togglePopup} className="close-btn">Close</button>
              </div>
            </div>
          )}

          <div className="search">
            <select
              className="search-dropdown"
              value={searchBy}
              onChange={handleSearchByChange}
            >
              <option value="Actor">Actor</option>
              <option value="Movies">Movies</option>
              <option value="Released Year">Released Year</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress} // Listen for Enter key
            />
            <button onClick={handleSearch}>🔍</button>
          </div>
        </header>

        {/* Display Search Results */}
        <div className="search-results">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="search-result-item"
              onClick={() =>
                searchBy === "Actor" ? handleActorClick(result.id) : handleMovieClick(result)
              } // Handle click based on search type
            >
              {searchBy === "Actor" ? (
                <>
                  <img
                    src={
                      result.profile_path
                        ? `https://image.tmdb.org/t/p/w200${result.profile_path}`
                        : "/No.png" // Default image if no profile image is available
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
                        : "/No.png" // Default image if no poster image is available
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

        {/* Display Actor's Details Popup */}
        {selectedActor && (
          <div className="actor-popup">
            <h2>{selectedActor.name}</h2>
            <p>{selectedActor.biography || "No biography available."}</p>

            {/* Actor Images */}
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

            {/* Actor Movies */}
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
            <button onClick={() => setSelectedActor(null)} className="close-btn">
              Close
            </button>
          </div>
        )}

        {/* Load More Button */}
        {searchResults.length > 0 && (
          <div className="load-more-container">
            <button onClick={loadMoreResults} className="load-more-btn">
              Load More
            </button>
          </div>
        )}

        {/* Display Movie Details */}
        {selectedMovie && (
          <div className="movie-details-modal">
            <div className="movie-details-content">
              <h2>{selectedMovie.title || selectedMovie.name}</h2>
              <img
                src={
                  selectedMovie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`
                    : "/No.png" // Replace with your "No Movies" image path
                }
                alt={selectedMovie.title || selectedMovie.name}
              />
              <p>{selectedMovie.overview}</p>
              <button onClick={closeMovieDetails} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}
    </Router>
  );
};

export default App;
