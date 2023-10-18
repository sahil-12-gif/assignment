import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AllusersStyle.css";
import { Link } from "react-router-dom";
function AllUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showFollow, setShowFollow] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  useEffect(() => {
    // Make an API call to fetch all users
    axios
      .get("http://localhost:3000/user/all", {})
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message || "Failed to fetch all users");
      });
  }, []);

  // Function to follow a user
  const followUser = async (userId) => {
    try {
      await axios.post(`http://localhost:3000/user/follow/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Followed user:", userId);
      axios
        .get("http://localhost:3000/user/following/to", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setFollowingUsers(response.data);
          // console.log(followingUsers)
        })
        .catch((error) => {
          setError(
            error.response.data.message || "Failed to fetch following users"
          );
        });
      // setShowFollow(true);
    } catch (error) {
      console.error(error);
      // Handle follow error
    }
  };
  const unfollowUser = async (userId) => {
    try {
      await axios.post(`http://localhost:3000/user/unfollow/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Followed user:", userId);
      axios
        .get("http://localhost:3000/user/following/to", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setFollowingUsers(response.data);
          // console.log(followingUsers)
        })
        .catch((error) => {
          setError(
            error.response.data.message || "Failed to fetch following users"
          );
        });
      setShowFollow(true);
    } catch (error) {
      console.error(error);
      // Handle follow error
    }
  };

  useEffect(() => {
    // Make an API call to fetch the list of users the logged-in user is following
    axios
      .get("http://localhost:3000/user/following/to", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setFollowingUsers(response.data);
        // console.log(followingUsers)
      })
      .catch((error) => {
        setError(
          error.response.data.message || "Failed to fetch following users"
        );
      });
  }, []);
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

export default AllUsers;
