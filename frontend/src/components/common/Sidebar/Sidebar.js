import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>القائمة</h2>
        {user && <p>مرحباً، {user.nom}</p>}
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard">لوحة التحكم</Link>
          </li>
          <li>
            <Link to="/users">المستخدمين</Link>
          </li>
          <li>
            <Link to="/settings">الإعدادات</Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Sidebar;