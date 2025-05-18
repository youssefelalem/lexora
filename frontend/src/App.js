import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, ROLES } from './components/features/auth/AuthContext';
import Sidebar from './components/common/Sidebar/Sidebar';
import MainContainer from './components/pages/MainContainer/MainContainer';
import Login from './components/features/auth/Login';
import ForgotPassword from './components/features/auth/ForgotPassword';
import ResetPassword from './components/features/auth/ResetPassword';

// Define React Router v7 future flags
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// مكون للتحقق من المصادقة
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// مكون للتحقق من الدور
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, hasAnyRole } = useAuth();
  
  // إذا لم يكن المستخدم مسجل الدخول، قم بتحويله إلى صفحة تسجيل الدخول
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // إذا كان للمستخدم أي من الأدوار المسموح بها، اعرض المحتوى
  if (hasAnyRole(allowedRoles)) {
    return children;
  }
  
  // إذا لم يكن للمستخدم الدور المطلوب، قم بتحويله إلى لوحة التحكم
  return <Navigate to="/dashboard" />;
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
      <Router future={routerOptions.future}>
        <div dir="rtl" className="min-h-screen"> {/* Setting RTL direction for Arabic language */}
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Protected routes */}
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
