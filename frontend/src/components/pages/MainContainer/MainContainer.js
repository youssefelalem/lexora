import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserProfile from '../UserProfile/UserProfile';
import EditProfile from '../UserProfile/EditProfile/EditProfile';
import ChangePassword from '../../features/auth/ChangePassword';
import Support from '../Support/Support';
import AllClients from '../Clients/AllClients/AllClients';
import ClientTypes from '../Clients/ClientTypes/ClientTypes';
import NewClient from '../Clients/NewClient/NewClient';
import EditClient from '../Clients/EditClient/EditClient';
import ClientDetails from '../Clients/ClientDetails/ClientDetails';
import AllCases from '../Cases/AllCases/AllCases';
import CaseTypes from '../Cases/CaseTypes/CaseTypes';
import NewCase from '../Cases/NewCase/NewCase';
import AllSessions from '../Sessions/AllSessions/AllSessions';
import AllDocuments from '../Documents/AllDocuments/AllDocuments';
import AllFiles from '../Files/AllFiles/AllFiles';
import AllInvoices from '../Invoices/AllInvoices/AllInvoices';
import AllPayments from '../Payments/AllPayments/AllPayments';
import AllExpenses from '../Expenses/AllExpenses/AllExpenses';
import AllNotifications from '../Notifications/AllNotifications/AllNotifications';
import AllSettings from '../Settings/AllSettings/AllSettings';
import UsersManagement from '../Users/UsersManagement/UsersManagement';
import NewUser from '../Users/NewUser/NewUser';
import EditUser from '../Users/EditUser/EditUser';
import ViewUserProfile from '../Users/ViewUserProfile/ViewUserProfile';
import Dashboard from '../Dashboard/Dashboard';

/**
 * هذا الملف يمثل الحاوية الرئيسية للتطبيق وينظم:
 * - القائمة العلوية (الهيدر)
 * - القائمة الجانبية
 * - منطقة العرض الرئيسية
 * - التوجيه بين الصفحات المختلفة
 * 
 * Ce fichier représente le conteneur principal de l'application et organise:
 * - Menu supérieur (header)
 * - Barre latérale
 * - Zone d'affichage principale
 * - Navigation entre les différentes pages
 */

const ICON_BUTTON_CLASSES = "p-2 transition-colors duration-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
const ICON_CLASSES = "w-5 h-5 text-gray-700";
const MOBILE_BUTTON_CLASSES = "flex items-center justify-start w-full px-3 py-2 text-left text-gray-700 transition-colors duration-200 rounded-md hover:bg-gray-100";

const Icon = ({ path, className = ICON_CLASSES }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const ICONS = {
  menu: "M4 6h16M4 12h16M4 18h16",
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  dashboard: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z",
  users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  cases: "M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10M4 7v10l8 4",
  documents: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  invoices: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  payments: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  expenses: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  support: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  // Add missing icons
  add: "M12 4v16m8-8H4",
  notification: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  close: "M6 18L18 6M6 6l12 12",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  files: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
};

const SUBMENU_ICONS = {
  allClients: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  clientTypes: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  newCase: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  allCases: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  caseTypes: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
};

const DateDisplay = ({ currentDate }) => (
  <div className="flex items-center overflow-hidden border border-gray-300 rounded-md">
    <div className="flex items-center justify-center p-2 border-r border-gray-300 bg-blue-50">
      <Icon path={ICONS.calendar} className="w-5 h-5 text-blue-600" />
    </div>
    <div className="px-3 py-1 text-sm font-medium text-gray-700">
      {currentDate || '24-April-2025'}
    </div>
  </div>
);

const NavButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} className={MOBILE_BUTTON_CLASSES}>
    <Icon path={icon} className="w-5 h-5 ml-2 text-gray-700" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const MobileSubmenu = ({ title, items, onClick, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubmenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <button 
        onClick={toggleSubmenu} 
        className={MOBILE_BUTTON_CLASSES + " justify-between mb-1"}
      >
        <div className="flex items-center">
          <Icon 
            path={title === "العملاء" ? ICONS.users : ICONS.cases} 
            className="w-5 h-5 ml-2 text-gray-700" 
          />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <Icon 
          path="M19 9l-7 7-7-7" 
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="pr-4 mr-2 border-r border-gray-200">
          {items.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                navigate(item.path);
                onClick();
              }} 
              className="flex items-center w-full px-3 py-2 mb-1 text-sm text-gray-600 transition-colors duration-200 rounded-md hover:bg-gray-100"
            >
              <Icon path={item.icon} className="w-4 h-4 mr-2 text-gray-600" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MainContainer = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const sidebarToggleRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const today = new Date();
    setCurrentDate(`${String(today.getDate()).padStart(2, '0')}-${today.toLocaleString('en-US', { month: 'long' })}-${today.getFullYear()}`);
    
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          mobileMenuButtonRef.current &&
          !mobileMenuButtonRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    
    const handleSidebarStateChange = (event) => {
      if (event.detail.source !== 'toggle-button') {
        setSidebarVisible(event.detail.visible);
      }
    };

    const savedSidebarState = localStorage.getItem('sidebarVisible');
    if (savedSidebarState !== null) {
      setSidebarVisible(savedSidebarState === 'true');
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('sidebar-state-change', handleSidebarStateChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('sidebar-state-change', handleSidebarStateChange);
    };
  }, [mobileMenuOpen]);

  const toggleSidebar = (e) => {
    if (e) e.stopPropagation();
    const newVisibility = !sidebarVisible;
    setSidebarVisible(newVisibility);
    localStorage.setItem('sidebarVisible', newVisibility.toString());
    document.dispatchEvent(new CustomEvent('toggle-sidebar', { 
      detail: { visible: newVisibility, source: 'toggle-button' } 
    }));
  };

  const toggleMobileMenu = (e) => {
    if (e) e.stopPropagation();
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navigateTo = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const mobileNavItems = [
    { icon: ICONS.dashboard, label: "لوحة التحكم", onClick: () => navigateTo('/dashboard') },
    { icon: ICONS.files, label: "الملفّـات", onClick: () => navigateTo('/files') },
  ];

  const additionalMobileNavItems = [
    { icon: ICONS.documents, label: "المستندات", onClick: () => navigateTo('/documents') },
    { icon: ICONS.invoices, label: "الفواتير", onClick: () => navigateTo('/invoices') },
    { icon: ICONS.payments, label: "المدفوعات", onClick: () => navigateTo('/payments') },
    { icon: ICONS.expenses, label: "النفقات", onClick: () => navigateTo('/expenses') },
    { icon: ICONS.notification, label: "الإشعارات", onClick: () => navigateTo('/notifications') },
    { icon: ICONS.users, label: "المستخدمون", onClick: () => navigateTo('/users') },
    { icon: ICONS.settings, label: "الإعدادات", onClick: () => navigateTo('/settings') },
    { icon: ICONS.support, label: "المساعدة والدعم", onClick: () => navigateTo('/support') },
    { icon: ICONS.logout, label: "تسجيل الخروج", onClick: () => {
      // يمكن هنا استدعاء دالة تسجيل الخروج من AuthContext
      // Ici, vous pouvez appeler la fonction de déconnexion d'AuthContext
      navigateTo('/login');
    }},
  ];

  const mobileSubmenuItems = [
    { label: "عرض جميع العملاء", path: "/clients/all", icon: SUBMENU_ICONS.allClients },
    { label: "عرض أنواع العملاء", path: "/clients/types", icon: SUBMENU_ICONS.clientTypes }
  ];

  const casesSubmenuItems = [
    { label: "إضافة قضية جديدة", path: "/cases/new", icon: SUBMENU_ICONS.newCase },
    { label: "عرض جميع القضايا", path: "/cases/all", icon: SUBMENU_ICONS.allCases },
    { label: "أنواع القضايا", path: "/cases/types", icon: SUBMENU_ICONS.caseTypes }
  ];

  return (
    <div className="w-full min-h-screen box-border bg-[#f5f6fa] flex flex-col">
      <header className="flex flex-wrap items-center justify-between w-full px-4 bg-white border-b border-gray-200 shadow-sm sm:px-6">
        <div className="flex items-center h-16">
          <button 
            ref={sidebarToggleRef}
            onClick={toggleSidebar}
            data-sidebar-toggle="true"
            className={ICON_BUTTON_CLASSES}
            aria-label={sidebarVisible ? "إخفاء القائمة الجانبية" : "إظهار القائمة الجانبية"}
          >
            <Icon path={ICONS.menu} />
          </button>
        </div>
        
        <div className="items-center hidden h-10 my-3 sm:flex">
          <DateDisplay currentDate={currentDate} />
        </div>

        <div className="items-center hidden h-16 space-x-4 md:flex">
          <nav className="flex items-center ml-4 space-x-3">
            <button className={ICON_BUTTON_CLASSES}><Icon path={ICONS.home} /></button>
            <button className={ICON_BUTTON_CLASSES}><Icon path={ICONS.add} /></button>
          </nav>
          <button className={ICON_BUTTON_CLASSES.replace('rounded-md', 'rounded-full')}><Icon path={ICONS.notification} /></button>
          <button className={ICON_BUTTON_CLASSES.replace('rounded-md', 'rounded-full')}><Icon path={ICONS.settings} /></button>
          <div 
            onClick={() => navigateTo('/profile')} 
            className="flex items-center justify-center w-8 h-8 text-sm font-medium text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700"
          >
            A
          </div>
        </div>
        
        <div className="flex items-center h-16 md:hidden">
          <button
            ref={mobileMenuButtonRef}
            onClick={toggleMobileMenu}
            className={ICON_BUTTON_CLASSES}
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileMenuOpen}
          >
            <Icon path={mobileMenuOpen ? ICONS.close : ICONS.menu} />
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="absolute right-0 z-50 w-full bg-white border-b border-gray-200 shadow-md top-16 md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              <DateDisplay currentDate={currentDate} />
              
              <div 
                onClick={() => navigateTo('/profile')} 
                className="flex items-center p-2 pt-4 mt-2 space-x-3 space-x-reverse border-t border-gray-200 cursor-pointer"
              >
                <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-white bg-blue-600 rounded-full">A</div>
                <div className="text-sm font-medium text-gray-700">حسابي الشخصي</div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 px-4 py-6 sm:px-6">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/files" element={<AllFiles />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/new-user" element={<NewUser />} />
          <Route path="/settings" element={<AllSettings />} />
          <Route path="/clients/all" element={<AllClients />} />
          <Route path="/clients/types" element={<ClientTypes />} />
          <Route path="/clients/new" element={<NewClient />} />
          <Route path="/clients/:id/edit" element={<EditClient />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/cases/new" element={<NewCase />} />
          <Route path="/cases/all" element={<AllCases />} />
          <Route path="/cases/types" element={<CaseTypes />} />
          <Route path="/sessions" element={<AllSessions />} />
          <Route path="/documents" element={<AllDocuments />} />
          <Route path="/invoices" element={<AllInvoices />} />
          <Route path="/payments" element={<AllPayments />} />
          <Route path="/expenses" element={<AllExpenses />} />
          <Route path="/notifications" element={<AllNotifications />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/view-user/:id" element={<ViewUserProfile />} />
          <Route path="*" element={<div className="p-4 bg-white rounded-lg shadow-sm">الصفحة غير موجودة</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default MainContainer;