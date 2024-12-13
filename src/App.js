import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import SearchBar from "./components/Searchbar";
import UserProfile from "./components/UserProfile";
import SearchResults from "./components/SearchResults";
import ActorDetails from "./components/ActorDetail";
import MovieDetails from "./components/MovieDetails";
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
  const [UserRating, setUserRating] = useState([]);
  const [UserData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdateError, setPasswordUpdateError] = useState("");

  const user_id = 1;
  const apiKey = "b5987557d1737fe1b74313c3201f2152";
  const popupRef = useRef(null);

  const handleSearchByChange = (e) => setSearchBy(e.target.value);
  const handleSearchInputChange = (e) => setSearchInput(e.target.value);

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

      if (Array.isArray(response.data) && response.data.length > 0) {
        setUserData(response.data[0]);
      } else {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Unable to load user details. Please try again.");
    }
    setIsLoading(false);
  };

  const fetchSearchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/postgres/search_history`);
  
      if (Array.isArray(response.data) && response.data.length > 0) {
        setSearchHistory(response.data);
      } else {
        setSearchHistory([]);
      }
    } catch (error) {
      console.error("Error fetching search history:", error);
      alert("Unable to load search history. Please try again.");
    }
    setIsLoading(false);
  };

  const fetchUserRating = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/postgres/user_rating`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setUserRating(response.data);
      } else {
        setUserRating([]);
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
      alert("Unable to load user rating. Please try again.");
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

  const handleMovieClick = (movie) => setSelectedMovie(movie);
  const closeMovieDetails = () => setSelectedMovie(null);

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

    fetchUserData ();
    fetchSearchHistory ();
    fetchUserRating ();

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

          <UserProfile
            isPopupVisible={isPopupVisible}
            togglePopup={togglePopup}
            isLoading={isLoading}
            UserData={UserData}
            searchHistory={searchHistory}
            UserRating={UserRating}
            passwordUpdateError={passwordUpdateError}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            handlePasswordChange={handlePasswordChange}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            popupRef={popupRef}
            isClosing={isClosing}
          />

          <SearchBar
            searchBy={searchBy}
            searchInput={searchInput}
            handleSearchByChange={handleSearchByChange}
            handleSearchInputChange={handleSearchInputChange}
            handleSearch={handleSearch}
            handleKeyPress={handleKeyPress}
          />
        </header>

        <SearchResults
          searchResults={searchResults}
          searchBy={searchBy}
          handleActorClick={handleActorClick}
          handleMovieClick={handleMovieClick}
        />

        <ActorDetails
          selectedActor={selectedActor}
          togglePopup={togglePopup}
          actorImages={actorImages}
          actorMovies={actorMovies}
          setSelectedActor={setSelectedActor}
        />

        <MovieDetails
          selectedMovie={selectedMovie}
          closeMovieDetails={closeMovieDetails}
        />

        {searchResults.length > 0 && (
          <div className="load-more-container">
            <button onClick={loadMoreResults} className="load-more-btn">
              Load More
            </button>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;