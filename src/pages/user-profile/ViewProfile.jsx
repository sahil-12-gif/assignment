import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import "../../styles/ViewProfile.css";
import Profile from "../../components/userprofile/Profile";

function ViewProfile() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/profile/${userId}`, {})
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message || "Failed to fetch user profile");
      });
  }, [userId]);

  // Define a component to generate the PDF
  const CVDocument = ({ userProfile }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Name: {userProfile.name}</Text>
          <Text style={styles.info}>Tech Stack: {userProfile.techstack.join(", ")}</Text>
          <Text style={styles.info}>Bio: {userProfile.bio}</Text>
          <Text style={styles.info}>Education: {userProfile.education}</Text>
          <Text style={styles.info}>Experience: {userProfile.experience}</Text>
          <Text style={styles.info}>Languages: {userProfile.languages.join(", ")}</Text>
        </View>
      </Page>
    </Document>
  );

  // Styles for the PDF
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: 'white',
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
    },
    title: {
      fontSize: 16,
      marginBottom: 5,
    },
    info: {
      fontSize: 12,
      marginBottom: 3,
    },
  });

  return (
    <div className="container">
      <h2>User Profile</h2>
      {error && <p className="error">{error}</p>}

      {userProfile && (
        <>
          <Profile userProfile={userProfile} />
          <div className="user-info-item">
            <span className="info-label">Download CV:</span>
            <PDFDownloadLink
              document={<CVDocument userProfile={userProfile} />}
              fileName="user_cv.pdf"
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Download PDF'
              }
            </PDFDownloadLink>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewProfile;
