import React, { useState } from "react";
import axios from "axios";
import "../styles/FormStyles.css";
import { useNavigate } from "react-router-dom";
function UserRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim input values
    const trimmedData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (!trimmedData.username || !trimmedData.email || !trimmedData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/user/register",
        trimmedData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      // Handle a successful registration, e.g., redirect to login or show a success message
      console.log("Registration success:", response.data);
      navigate("/create-profile");
    } catch (error) {
      // Handle registration error and set the error message
      setError(error.response.data.error || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>User Registration</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default UserRegistration;
