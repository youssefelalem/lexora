import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/features/auth/AuthContext';
import Sidebar from './components/common/Sidebar/Sidebar';
import MainContainer from './components/pages/MainContainer/MainContainer';
import Login from './components/features/auth/Login';

// مكون للتحقق من المصادقة
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppLayout() {
  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow transition-all duration-300 ease-in-out">
        <MainContainer />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div dir="rtl" className="min-h-screen"> {/* Setting RTL direction for Arabic language */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <AppLayout />
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
