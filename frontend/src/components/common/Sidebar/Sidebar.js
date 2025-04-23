import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Removed unused Link import
import { useAuth } from '../../features/auth/AuthContext';
import logo from '../../../logo.svg'; // Adjust path as needed if you have a logo image

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define NavLink active style
  const activeClassName = "bg-gray-200 text-gray-900"; // Lighter background for active link
  const defaultClassName = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="fixed top-0 left-0 flex flex-col w-64 h-screen text-white bg-gray-800"> {/* Fixed position */}
      {/* Header with Logo/Name */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <img src={logo} alt="Lexora Logo" className="w-auto h-10" />
        <h1 className="text-2xl font-semibold">Lexora</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block py-2.5 px-4 rounded transition duration-200 ${isActive ? activeClassName : defaultClassName}`
          }
        >
          الرئيسة
        </NavLink>

        {/* Clients Section */}
        <div className="px-4 mt-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">العملاء</div>
        <NavLink
          to="/clients/all"
          className={({ isActive }) =>
            `block py-1.5 px-4 ml-4 rounded transition duration-200 ${isActive ? activeClassName : defaultClassName}`
          }
        >
          عرض جميع العملاء
        </NavLink>
        <NavLink
          to="/clients/types"
          className={({ isActive }) =>
            `block py-1.5 px-4 ml-4 rounded transition duration-200 ${isActive ? activeClassName : defaultClassName}`
          }
        >
          عرض أنواع العملاء
        </NavLink>

        {/* Cases Section */}
        <div className="px-4 mt-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">القضايا</div>
        <NavLink
          to="/cases/new"
          className={({ isActive }) =>
            `block py-1.5 px-4 ml-4 rounded transition duration-200 ${isActive ? activeClassName : defaultClassName}`
          }
        >
          إضافة قضية جديدة
        </NavLink>
        <NavLink
          to="/cases/all"
          className={({ isActive }) =>
            `block py-1.5 px-4 ml-4 rounded transition duration-200 ${isActive ? activeClassName : defaultClassName}`
          }
        >
          عرض جميع القضايا
        </NavLink>
        <NavLink
          to="/cases/types"
          className={({ isActive }) =>
            `block py-1.5 px-4 ml-4 rounded transition duration-200 ${isActive ? activeClassName : defaultClassName}`
          }
        >
          أنواع القضايا
        </NavLink>

        {/* Sessions Section */}
        <div className="px-4 mt-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">الجلسات</div>
        {/* Add NavLinks for Sessions here if needed, e.g.: */}
        {/*
        <NavLink
          to="/sessions"
          className={({ isActive }) =>
            `block py-1.5 px-4 ml-4 rounded transition duration-200 ${isActive ? activeClassName : defaultClassName}`
          }
        >
          عرض الجلسات
        </NavLink>
        */}

      </nav>

      {/* Footer with User Info and Logout */}
      <div className="p-4 border-t border-gray-700">
        {user && (
          <p className="mb-3 text-sm text-center text-gray-400">
            مرحباً، {user.nom}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm font-medium text-white transition duration-200 bg-red-600 rounded hover:bg-red-700"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Sidebar;