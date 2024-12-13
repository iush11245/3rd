import React, { useState, useEffect } from "react";
import axios from "axios";

const fetchUserData = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/postgres/user_info`);
    return Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Unable to load user details. Please try again.");
    return null;
  }
};

const UserProfile = ({
  isPopupVisible,
  togglePopup,
  searchHistory,
  UserRating,
  passwordUpdateError,
  newPassword,
  confirmPassword,
  handlePasswordChange,
  setNewPassword,
  setConfirmPassword,
  popupRef,
  isClosing,
}) => {
  // Move useState here inside the component
  const [UserData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      const data = await fetchUserData();
      setUserData(data);
      setIsLoading(false);
    };

    loadUserData();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    isPopupVisible && (
      <div className={`popup-overlay ${isClosing ? "fadeOut" : ""}`}>
        <div className={`popup-content ${isClosing ? "slideOut" : "slideIn"}`} ref={popupRef}>
          <h2>User Profile</h2>
          {isLoading ? (
            <p>Loading user details...</p>
          ) : UserData ? (
            <div className="profile-section">
              <p>Username: {UserData.username}</p>
              <p>Email: {UserData.email}</p>
              <p>Member Since: {UserData.created_date}</p>
            </div>
          ) : (
            <p>No user details available.</p>
          )}

          <div className="profile-section">
            <h3>User Ratings</h3>
            <ul>
              {UserRating && UserRating.length> 0 ? (
                UserRating.map((UserRating, index) => (
                  <li key={index}>{UserRating.rating} - {UserRating.primarytitle}</li>
                ))
              ) : (
                <li>No ratings available</li>
              )}
            </ul>
          </div>

          <div className="profile-section">
            <h3>Search History</h3>
            <ul>
              {searchHistory.length > 0 ? (
                searchHistory.map((search, index) => (
                  <li key={index}>{search.searchquery}</li>
                ))
              ) : (
                <li>No search history available</li>
              )}
            </ul>
          </div>

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
    )
  );
};

export default UserProfile;
