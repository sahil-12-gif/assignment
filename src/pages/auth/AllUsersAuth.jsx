import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AllusersStyle.css";
import { Link } from "react-router-dom";
function AllUsersAuth() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [followingUsers, setFollowingUsers] = useState([]);
  
  let loggedInUserId = null; // Initialize with null
  // Check if the user is logged in and get their ID from the token
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    loggedInUserId = payload._id;
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/all", {})
      .then((response) => {
        if(loggedInUserId){
        const filteredUsers = response.data.filter((user) => user._id !== loggedInUserId);
        setUsers(filteredUsers);
        }
        else setUsers(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message || "Failed to fetch all users");
      });
  }, [loggedInUserId]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/following/to", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const newFollowingUsers = response.data.map(user => ({ _id: user._id }));
        setFollowingUsers(newFollowingUsers);
      })
      .catch((error) => {
        setError(error.response.data.message || "Failed to fetch following users");
      });
  }, []);

  const followUser = async (userId) => {
    try {
      await axios.post(`http://localhost:3000/user/follow/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updatedFollowingUsers = [...followingUsers, { _id: userId }];
      setFollowingUsers(updatedFollowingUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      await axios.post(`http://localhost:3000/user/unfollow/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updatedFollowingUsers = followingUsers.filter(user => user._id !== userId);
      setFollowingUsers(updatedFollowingUsers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ margin: "30px" }}>
      <h2>All Users</h2>
      {error && <p className="error">{error}</p>}

      <ul>
        {users.map((user) => (
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
              {console.log(followingUsers)}
              {localStorage.getItem("token") &&

                !followingUsers.some(
                  (followedUser) => followedUser._id === user._id
                ) && (
                  <button
                    onClick={async () => {
                      followUser(user._id);
                    }}
                  >
                    Follow +
                  </button>
                )}
              {localStorage.getItem("token") &&
                followingUsers.some(
                  (followedUser) => followedUser._id === user._id
                ) && (
                  <button
                    onClick={async () => {
                      unfollowUser(user._id);
                    }}
                  >
                    Unfollow +
                  </button>
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllUsersAuth;
