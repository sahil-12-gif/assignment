import React, { useState } from "react";
import axios from "axios";
import "../styles/FormStyles.css";
import { useNavigate } from "react-router-dom";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim input values
    const trimmedData = {
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (!trimmedData.email || !trimmedData.password) {
      setError("Both email and password are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        trimmedData
      );
      // Handle a successful login, e.g., store the token in local storage
      const token = response.data.token;
      localStorage.setItem("token", token);
      // Handle a successful login, e.g., store user data in state or local storage
      console.log("Login success:", response.data);

      // Clear the form fields
      setFormData({
        email: "",
        password: "",
      });

      // Clear any previous error
      setError("");
      navigate("/create-profile");
    } catch (error) {
      console.log(error);
      // Handle login error and set the error message
      setError(error.response.data.error || "Login failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
