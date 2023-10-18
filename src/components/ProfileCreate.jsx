import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/FormStyles.css";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import AllUsers from "./AllUsers";
function ProfileCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    techstack: [], // Initialize techstack as an empty array
    bio: "",
  });

  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "techstack") {
      // If it's the techstack field, split the comma-separated values into an array
      const techstack = value.split(",").map((stack) => stack.trim());
      setFormData({ ...formData, techstack });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim input values
    const trimmedData = {
      name: formData.name.trim(),
      techstack: formData.techstack, // Already an array
      bio: formData.bio.trim(),
    };

    // Add any additional validation you need here

    try {
      // Make an API call to create the user's profile
      const response = await axios.post(
        "http://localhost:3000/user/profile",
        trimmedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the user's token for authentication
          },
        }
      );

      // Handle a successful profile creation
      console.log("Profile created:", response.data);

      // Clear the form fields
      setFormData({
        name: "",
        techstack: [],
        bio: "",
      });

      // Clear any previous error
      setError("");
    } catch (error) {
      // Handle profile creation error and set the error message
      setError(error.response.data.message || "Profile creation failed");
    }
  };
  useEffect(() => {
    // Make an API call to fetch the user's profile
    axios
      .get("http://localhost:3000/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the user's token for authentication
        },
      })
      .then((response) => {
        setShow(true);
        // navigate("/user-profile");
        // setUserProfile(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message || "Failed to fetch user profile");
      });
  }, []);
  return (
    <div className="form-container">
      <h2>Create Profile</h2>
      {error && <p className="error">{error}</p>}
      {!show && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="techstack"
            placeholder="Tech Stack (comma-separated, e.g., HTML, CSS, JavaScript)"
            value={formData.techstack.join(", ")} // Join the array for display
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          />
          <button type="submit">Create Profile</button>
        </form>
      )}
      {show && (
        <>
          <p>
            The profile is already Create Can Update....We are Working on this
          </p>
          <UserProfile />
          <AllUsers/>
        </>
      )}
    </div>
  );
}

export default ProfileCreate;
