import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../../styles/ViewProfile.css"; // Import your CSS file
import AllUsersAuth from "../auth/AllUsersAuth";
import Profile from "../../components/userprofile/Profile";

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    techStack: "",
    language: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3; // Number of users to show per page

  useEffect(() => {
    // Make an API call to fetch the user's profile
    axios
      .get("http://localhost:3000/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message || "Failed to fetch user profile");
      });
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const applyFilter = () => {
    if (!filter.techStack || !filter.language) {
      alert("Please fill in all fields of techstack and native language fields");
      return;
    }
    console.log(filter.techStack, filter.language);
    // Make an API call to filter users based on the criteria
    axios
      .get(
        `http://localhost:3000/user/filter?techStack=${filter.techStack}&language=${filter.language}`
      )
      .then((response) => {
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message || "Failed to apply filters");
      });
  };
  return (
    <div className="container">
      <h2>User Profile</h2>
      {error && <p className="error">{error}</p>}

      {userProfile && <Profile userProfile={userProfile} />}
      <Link to="/update-profile" className="update-profile-button">
        Update Your Profile
      </Link>
      <AllUsersAuth />
      <h2>Filtered User You want</h2>
      <div>
        <input
          required
          type="text"
          placeholder="Tech Stack"
          value={filter.techStack}
          onChange={(e) => setFilter({ ...filter, techStack: e.target.value })}
        />
        <input
          required
          type="text"
          placeholder="Your native language"
          value={filter.language}
          onChange={(e) => setFilter({ ...filter, language: e.target.value })}
        />
        <button onClick={applyFilter}>Apply Filter</button>
      </div>

      {/* Display paginated users */}
      <ul>
        {currentUsers.map((user) => (
          <li key={user._id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div className="user-info">Username: {user.username}</div>
                <div className="user-info">Email: {user.email}</div>
              </div>
              <Link
                to={`/viewprofile/${user._id}`}
                className="view-profile-button"
              >
                View Profile
              </Link>
              {/* {console.log(followingUsers)} */}
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({
          length: Math.ceil(filteredUsers.length / usersPerPage),
        }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
