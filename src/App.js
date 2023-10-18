import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AllUsers from './components/AllUsers';
import Login from './components/Login';
import ProfileCreate from './components/ProfileCreate';
// import ProfileFollow from './components/ProfileFollow';
import ProfileSearch from './components/ProfileSearch';
import UserProfile from './components/UserProfile';
import UserRegistration from './components/UserRegistration';
import ViewProfile from './components/ViewProfile';


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AllUsers />}
        />
        <Route
          path="/viewprofile/:userId/"
          element={<ViewProfile />}
        />
        {/* UserProfile */}
        <Route
          path="/user/me"
          element={<UserProfile />}
        />
        <Route
          path="/user-registration"
          element={<UserRegistration />}
        />
        <Route
          path="/login-user"
          element={<Login />}
        />
        <Route
          path="/create-profile"
          element={<ProfileCreate />}
        />
        <Route path="/search-profiles" element={<ProfileSearch />} />
        
      </Routes>

    </Router>
  );
}

export default App;
