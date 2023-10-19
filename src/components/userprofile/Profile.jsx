
function Profile({userProfile}) {
    return (
        <div className="user-info-container">
            <div className="user-info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{userProfile.name}</span>
            </div>
            <div className="user-info-item">
                <span className="info-label">Tech Stack:</span>
                <span className="info-value">
                    {userProfile.techstack.join(", ")}
                </span>
            </div>
            <div className="user-info-item">
                <span className="info-label">Bio:</span>
                <span className="info-value">{userProfile.bio}</span>
            </div>
            <div className="user-info-item">
                <span className="info-label">Education:</span>
                <span className="info-value">{userProfile.education}</span>
            </div>
            <div className="user-info-item">
                <span className="info-label">Experience:</span>
                <span className="info-value">{userProfile.experience}</span>
            </div>
            <div className="user-info-item">
                <span className="info-label">Languages:</span>
                <span className="info-value">
                    {userProfile.languages.join(", ")}
                </span>
            </div>
            
        </div>
    );
}

export default Profile;


