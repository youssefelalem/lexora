import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/features/auth/AuthContext';
import Sidebar from './components/common/Sidebar/Sidebar';
import MainContainer from './components/pages/MainContainer/MainContainer';
import Login from './components/features/auth/Login';
import Register from './components/features/auth/Register';
import './App.css';

// مكون للتحقق من المصادقة
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="app-layout">
                    <Sidebar />
                    <MainContainer />
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
