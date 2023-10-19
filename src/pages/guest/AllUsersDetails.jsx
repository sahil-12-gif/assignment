import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AllusersStyle.css";
import { Link } from "react-router-dom";
function AllUsersDetails() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");



    useEffect(() => {
        localStorage.removeItem("token");
        axios
            .get("http://localhost:3000/user/all", {})
            .then((response) => {

                setUsers(response.data);
            })
            .catch((error) => {
                setError(error.response.data.message || "Failed to fetch all users");
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
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AllUsersDetails;
