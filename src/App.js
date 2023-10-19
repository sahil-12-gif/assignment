import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/auth/Login';
// import ProfileFollow from './components/ProfileFollow';
// import ProfileSearch from './pages/ProfileSearch';
import UserProfile from './pages/user-profile/UserProfile';
// import UserRegistration from './pages/UserRegistration';
import ViewProfile from './pages/user-profile/ViewProfile';
import UpdateProfile from './pages/user-profile/UpdateProfile';
import AllUsersDetails from './pages/guest/AllUsersDetails';
import UserRegistration from './pages/auth/UserRegistration';


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AllUsersDetails />}
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
          path="/update-profile"
          element={<UpdateProfile />}
        />
        
      </Routes>

    </Router>
  );
}

export default App;
