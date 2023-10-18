import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ViewProfile.css"; // Import the useParams hook

function ViewProfile() {
  const { userId } = useParams(); // Use the useParams hook to get the userId
  console.log(userId, " ");
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   // Make an API call to fetch the user's profile using the userId from useParams
  //   axios
  //     .get(`http://localhost:3000/user/profile/${userId}`, {
  //     })
  //     .then((response) => {
  //       setUserProfile(response.data);
  //     })
  //     .catch((error) => {
  //       setError(error.response.data.message || "Failed to fetch user profile");
  //     });
  // }, [userId]); // Update when userId changes
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
          <div className="user-profile">
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

export default ViewProfile;
