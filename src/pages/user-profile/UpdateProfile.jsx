import React, { useState, useEffect } from "react";
import axios from "axios";
import InputField from '../../components/inputfields/InputField'
// import "../styles/UpdateProfile.css"; // Import your CSS file

function UpdateProfile() {
    const [formData, setFormData] = useState({
        name: "",
        techstack: "",
        bio: "",
        education: "",
        experience: "",
        languages: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Use useEffect to fetch the user's existing profile data
    useEffect(() => {
        // Make an API call to get the user's profile data
        axios
            .get("http://localhost:3000/user/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                const profileData = response.data;
                // Populate the form fields with the existing data
                setFormData(profileData);
            })
            .catch((error) => {
                console.error(error);
                setError(error.response.data.message || "Failed to fetch user profile");
            });
    }, []); // Run this effect only once when the component mounts

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make an API call to update the user's profile
            const response = await axios.post(
                "http://localhost:3000/update-profile/me",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // Handle a successful profile update
            console.log("Profile updated:", response.data);

            // Set a success message and clear any previous error
            setSuccess(true);
            setError("");
        } catch (error) {
            // Handle profile update error and set the error message
            setError(error.response.data.message || "Profile update failed");
        }
    };

    return (
        <div className="container">
            <h2>Update Your Profile</h2>
            {success && <p className="success">Profile updated successfully</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <InputField
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <InputField
                    type="text"
                    name="techstack"
                    placeholder="Tech Stack"
                    value={formData.techstack}
                    onChange={handleChange}
                />
                <textarea
                    name="bio"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={handleChange}
                />
                <InputField
                    type="text"
                    name="education"
                    placeholder="Education"
                    value={formData.education}
                    onChange={handleChange}
                />
                <InputField
                    type="text"
                    name="experience"
                    placeholder="Experience"
                    value={formData.experience}
                    onChange={handleChange}
                />
                <InputField
                    type="text"
                    name="languages"
                    placeholder="Languages (comma-separated, e.g., English, Spanish)"
                    value={formData.languages}
                    onChange={handleChange}
                />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}

export default UpdateProfile;
