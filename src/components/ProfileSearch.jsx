import React, { useState } from "react";
import axios from "axios";
import "../styles/FormStyles.css";

function ProfileSearch() {
  const [formData, setFormData] = useState({
    techstack: "",
    keyword: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim input values
    const trimmedData = {
      techstack: formData.techstack.trim(),
      keyword: formData.keyword.trim(),
    };

    try {
      // Make an API call to search for profiles
      const response = await axios.get(
        "http://localhost:3000/user/search-profiles",
        {
          params: trimmedData,
        }
      );

      // Handle a successful search
      setSearchResults(response.data);
      setError("");
    } catch (error) {
      // Handle search error and set the error message
      setSearchResults([]);
      setError(error.response.data.message || "Search failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Search Profiles</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="techstack"
          placeholder="Tech Stack"
          value={formData.techstack}
          onChange={handleChange}
        />
        <input
          type="text"
          name="keyword"
          placeholder="Keyword"
          value={formData.keyword}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>

      {searchResults.length > 0 && (
        <div>
          <h3>Search Results</h3>
          <ul>
            {searchResults.map((profile) => (
              <li key={profile._id}>
                Name: {profile.name}
                <br />
                Tech Stack: {profile.techstack.join(", ")}
                <br />
                Bio: {profile.bio}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileSearch;
