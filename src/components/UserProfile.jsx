import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ViewProfile.css"; // Import your CSS file

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Make an API call to fetch the user's profile
    axios
      .get("http://localhost:3000/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the user's token for authentication
        },
      })
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message || "Failed to fetch user profile");
      });
  }, []);

  return (
    <div className="container">
      <h2>User Profile</h2>
      {error && <p className="error">{error}</p>}

      {userProfile && (
        <div>
          <div>
            <span className="user-info">Name: {userProfile.name}</span>
            <span className="user-info">
              Tech Stack: {userProfile.techstack.join(", ")}
            </span>
            <span className="user-info">Bio: {userProfile.bio}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
