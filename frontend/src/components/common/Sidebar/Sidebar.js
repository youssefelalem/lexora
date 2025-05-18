import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { ROLES } from '../../features/auth/AuthContext';
import logo from '../../../logo.svg';

// Icons (using SVG for better quality)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ClientsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CasesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10M4 7v10l8 4" />
  </svg>
);

const SessionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform duration-200 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// New menu item icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const FilesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
  </svg>
);

const DocumentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const InvoicesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const PaymentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const ExpensesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const NotificationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HelpSupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// New icons for customer groups submenu
const AllClientsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ClientTypesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const NewClientIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

// New icons for cases submenu
const NewCaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AllCasesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CaseTypesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const Sidebar = () => {
  const { user, logout, hasRole, isAdmin, isAvocat, isSecretaire } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  
  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    clients: location.pathname.includes('/clients'),
    cases: location.pathname.includes('/cases'),
    documents: location.pathname.includes('/documents') || location.pathname.includes('/files'),
    financial: location.pathname.includes('/invoices') || location.pathname.includes('/payments') || location.pathname.includes('/expenses'),
    system: location.pathname.includes('/users') || location.pathname.includes('/settings') || location.pathname.includes('/support')
  });
  
  // State for sidebar visibility - default to always visible
  const [isVisible, setIsVisible] = useState(true);
  
  // Track screen size for responsive behavior
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Store previous visibility state
  const previousVisibilityRef = useRef(true);

  // Effect to listen for toggle events from MainContainer
  useEffect(() => {
    const handleToggle = (event) => {
      // Only allow toggling via explicit user action
      if (event.detail.source === 'toggle-button') {
        setIsVisible(event.detail.visible);
        previousVisibilityRef.current = event.detail.visible;
      }
    };

    const handleResize = () => {
      // Update mobile state
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Don't auto-hide sidebar on resize
      // This prevents the sidebar from disappearing when resizing the window
    };

    // Check for clicks outside sidebar to close it ONLY on mobile
    const handleClickOutside = (event) => {
      if (isMobile && isVisible && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Make sure we're not clicking the toggle button from MainContainer
        if (!event.target.closest('[data-sidebar-toggle]')) {
          // Don't close sidebar on desktop
          if (window.innerWidth <= 768) {
            setIsVisible(false);
            
            // Notify MainContainer that sidebar was closed
            const stateChangeEvent = new CustomEvent('sidebar-state-change', {
              detail: { 
                visible: false,
                source: 'click-outside'
              }
            });
            document.dispatchEvent(stateChangeEvent);
          }
        }
      }
    };

    // Add event listeners for custom toggle event, window resize and document click
    document.addEventListener('toggle-sidebar', handleToggle);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Initial check
    handleResize();
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('toggle-sidebar', handleToggle);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, isMobile]);

  // Use another effect to handle path-based section opening
  useEffect(() => {
    setOpenSections({
      clients: location.pathname.includes('/clients'),
      cases: location.pathname.includes('/cases'),
      documents: location.pathname.includes('/documents') || location.pathname.includes('/files'),
      financial: location.pathname.includes('/invoices') || location.pathname.includes('/payments') || location.pathname.includes('/expenses'),
      system: location.pathname.includes('/users') || location.pathname.includes('/settings') || location.pathname.includes('/support')
    });
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mobile sidebar overlay to close sidebar when clicking outside
  const handleOverlayClick = () => {
    // Only allow closing the sidebar on mobile
    if (isMobile) {
      setIsVisible(false);
      
      // Notify MainContainer that sidebar was closed
      const stateChangeEvent = new CustomEvent('sidebar-state-change', {
        detail: { 
          visible: false,
          source: 'overlay-click'
        }
      });
      document.dispatchEvent(stateChangeEvent);
    }
  };
  // قائمة معدّة للعرض حسب دور المستخدم
  const getMenuItemsByRole = () => {
    console.log("Current user in sidebar:", user);
    console.log("Role checks:", {
      isAdmin: isAdmin,
      isAvocat: isAvocat, 
      isSecretaire: isSecretaire
    });
    console.log("Role validation test:", {
      'ROLE_ADMIN': hasRole(ROLES.ADMIN),
      'ROLE_AVOCAT': hasRole(ROLES.AVOCAT),
      'ROLE_SECRETAIRE': hasRole(ROLES.SECRETAIRE)
    });
    
    // قائمة العناصر المشتركة للجميع (لوحة القيادة)
    const items = [
      {
        id: 'dashboard',
        type: 'single',
        link: '/dashboard',
        icon: <DashboardIcon />,
        label: 'لوحة التحكم',
        roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE]
      }
    ];
    
    // عنصر إدارة العملاء
    if (isAdmin || isAvocat || isSecretaire) {
      items.push({
        id: 'clients',
        type: 'dropdown',
        icon: <ClientsIcon />,
        label: 'العملاء',
        roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE],
        children: [
          {
            id: 'new-client',
            link: '/clients/new',
            icon: <NewClientIcon />,
            label: 'إضافة عميل جديد',
            roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE]
          },
          {
            id: 'all-clients',
            link: '/clients/all',
            icon: <AllClientsIcon />,
            label: 'عرض جميع العملاء',
            roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE]
          },
          {
            id: 'client-types',
            link: '/clients/types',
            icon: <ClientTypesIcon />,
            label: 'عرض أنواع العملاء',
            roles: [ROLES.ADMIN]
          }
        ]
      });
    }
    
    // عنصر إدارة القضايا
    if (isAdmin || isAvocat || isSecretaire) {
      items.push({
        id: 'cases',
        type: 'dropdown',
        icon: <CasesIcon />,
        label: 'القضايا',
        roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE],
        children: [
          {
            id: 'new-case',
            link: '/cases/new',
            icon: <NewCaseIcon />,
            label: 'إضافة قضية جديدة',
            roles: [ROLES.ADMIN, ROLES.AVOCAT]
          },
          {
            id: 'all-cases',
            link: '/cases/all',
            icon: <AllCasesIcon />,
            label: 'عرض جميع القضايا',
            roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE]
          },
          {
            id: 'case-types',
            link: '/cases/types',
            icon: <CaseTypesIcon />,
            label: 'أنواع القضايا',
            roles: [ROLES.ADMIN]
          }
        ]
      });
    }
    
    // عنصر إدارة الجلسات
    if (isAdmin || isAvocat || isSecretaire) {
      items.push({
        id: 'sessions',
        type: 'single',
        link: '/sessions',
        icon: <SessionsIcon />,
        label: 'الجلسات',
        roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE]
      });
    }
    
    // عنصر إدارة الوثائق
    if (isAdmin || isAvocat || isSecretaire) {
      items.push({
        id: 'documents',
        type: 'dropdown',
        icon: <DocumentsIcon />,
        label: 'الوثائق',
        roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE],
        children: [
          {
            id: 'documents',
            link: '/documents',
            icon: <DocumentsIcon />,
            label: 'المستندات',
            roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE]
          },
          {
            id: 'files',
            link: '/files',
            icon: <FilesIcon />,
            label: 'الملفّـات',
            roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE]
          }
        ]
      });
    }
    
    // عنصر إدارة المالية - فقط للمشرف والمحامي
    if (isAdmin || isAvocat) {
      items.push({
        id: 'financial',
        type: 'dropdown',
        icon: <InvoicesIcon />,
        label: 'المالية',
        roles: [ROLES.ADMIN, ROLES.AVOCAT],
        children: [
          {
            id: 'invoices',
            link: '/invoices',
            icon: <InvoicesIcon />,
            label: 'الفواتير',
            roles: [ROLES.ADMIN, ROLES.AVOCAT]
          },
          {
            id: 'payments',
            link: '/payments',
            icon: <PaymentsIcon />,
            label: 'المدفوعات',
            roles: [ROLES.ADMIN, ROLES.AVOCAT]
          },
          {
            id: 'expenses',
            link: '/expenses',
            icon: <ExpensesIcon />,
            label: 'النفقات',
            roles: [ROLES.ADMIN, ROLES.AVOCAT]
          }
        ]
      });
    }
    
    // عنصر الإشعارات
    items.push({
      id: 'notifications',
      type: 'single',
      link: '/notifications',
      icon: <NotificationsIcon />,
      label: 'الإشعارات',
      roles: [ROLES.ADMIN, ROLES.AVOCAT, ROLES.SECRETAIRE]
    });
    
    // عنصر إدارة النظام - فقط للمشرف
    if (isAdmin) {
      items.push({
        id: 'system',
        type: 'dropdown',
        icon: <SettingsIcon />,
        label: 'النظام',
        roles: [ROLES.ADMIN],
        children: [
          {
            id: 'users',
            link: '/users',
            icon: <UsersIcon />,
            label: 'المستخدمون',
            roles: [ROLES.ADMIN]
          },
          {
            id: 'settings',
            link: '/settings',
            icon: <SettingsIcon />,
            label: 'الإعدادات',
            roles: [ROLES.ADMIN]
          },
          {
            id: 'support',
            link: '/support',
            icon: <HelpSupportIcon />,
            label: 'المساعدة والدعم',
            roles: [ROLES.ADMIN]
          }
        ]
      });
    }
    
    return items;
  };
    // تحويل قائمة العناصر من المصفوفة إلى عناصر مرئية
  // دالة لتصحيح عرض العناصر في القائمة الجانبية
  const renderMenuItem = (item) => {    // إعادة تفعيل فحص الصلاحيات بعد إصلاح دالة hasRole - مع إضافة استثناء مؤقت
    // تجاوز فحص الصلاحيات مؤقتًا للتأكد من ظهور العناصر
    let canViewItem = true;
    
    if (user && item.roles) {
      const userRoles = user.roles || (user.role ? [user.role] : []);
      console.log(`Checking item: ${item.id}, User role: ${user.role || 'undefined'}, User roles array:`, userRoles);
      
      try {
        // استخدام خاصية مؤقتة للتجاوز - في حالة المستخدم ADMINISTRATEUR، اعرض كل شيء
        if (user.role === 'ADMINISTRATEUR') {
          canViewItem = true; // المدير يرى كل شيء
        } else {
          canViewItem = item.roles.some(role => hasRole(role));
        }
        
        // سجّل معلومات التصحيح لمساعدة في التشخيص إذا استمرت المشكلة
        if (!canViewItem) {
          console.log(`Item ${item.id} denied - Required roles: ${item.roles.join(', ')} - User role: ${user.role || 'none'}`);
        }
      } catch (error) {
        console.error("خطأ في التحقق من الأدوار:", error);
      }
    }
    
    if (!canViewItem) return null;
    
    if (!user) return null;
    
    if (item.type === 'single') {
      // عنصر واحد بدون قائمة فرعية
      return (
        <NavLink 
          key={item.id}
          to={item.link} 
          className={({ isActive }) => 
            isActive 
              ? `flex ${!isVisible && !isMobile ? 'justify-center' : 'justify-start'} items-center px-4 py-3 text-blue-600 bg-gray-50 border-l-4 border-blue-500 gap-2` 
              : `flex ${!isVisible && !isMobile ? 'justify-center' : 'justify-start'} items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 gap-2`
          }
        >
          {item.icon}
          {(isVisible || !isMobile) && (
            <span className={`text-base font-medium font-['Inter'] ${!isVisible && !isMobile ? 'sr-only' : ''}`}>{item.label}</span>
          )}
        </NavLink>
      );
    } else if (item.type === 'dropdown') {
      // عنصر مع قائمة فرعية
      return (
        <div key={item.id} className="w-full">
          <button 
            onClick={() => toggleSection(item.id)}
            className={`flex ${!isVisible && !isMobile ? 'justify-center' : 'justify-start'} items-center w-full px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-blue-600`}
          >
            <div className={`flex items-center ${!isVisible && !isMobile ? 'justify-center' : 'justify-start'} gap-2`}>
              {item.icon}
              {(isVisible || !isMobile) && (
                <span className={`text-base font-medium font-['Inter'] ${!isVisible && !isMobile ? 'sr-only' : ''}`}>{item.label}</span>
              )}
            </div>
            {(isVisible || !isMobile) && (
              <ChevronDownIcon className={openSections[item.id] ? "transform rotate-180 ml-auto" : "ml-auto"} />
            )}
          </button>
            {openSections[item.id] && (
            <div className={`${!isVisible && !isMobile ? 'flex flex-col items-center' : 'border-l-4 bg-gray-50 border-l-blue-200'}`}>              {item.children.map(child => {
                // تصحيح للعناصر الفرعية أيضاً - مع إضافة استثناء مؤقت
                let canViewChild = true;
                
                if (user && child.roles) {
                  try {
                    // استخدام خاصية مؤقتة للتجاوز - في حالة المستخدم ADMINISTRATEUR، اعرض كل شيء
                    if (user.role === 'ADMINISTRATEUR') {
                      canViewChild = true; // المدير يرى كل شيء
                    } else {
                      canViewChild = child.roles.some(role => hasRole(role));
                    }
                    
                    // سجّل معلومات التصحيح للمساعدة في التشخيص
                    if (!canViewChild) {
                      console.log(`Child item ${child.id} denied - Required roles: ${child.roles.join(', ')} - User role: ${user.role || 'none'}`);
                    }
                  } catch (error) {
                    console.error("خطأ في التحقق من أدوار العنصر الفرعي:", error);
                  }
                }
                
                if (!canViewChild) return null;
                
                return (
                  <NavLink 
                    key={child.id}
                    to={child.link} 
                    className={({ isActive }) => 
                      isActive 
                        ? `flex ${!isVisible && !isMobile ? 'justify-center' : 'justify-start'} items-center ${!isVisible && !isMobile ? 'px-4' : 'px-8'} py-2 text-blue-600 ${!isVisible && !isMobile ? '' : 'border-l-4 border-blue-500'} gap-2` 
                        : `flex ${!isVisible && !isMobile ? 'justify-center' : 'justify-start'} items-center ${!isVisible && !isMobile ? 'px-4' : 'px-8'} py-2 text-gray-600 hover:text-blue-600 gap-2`
                    }
                  >
                    {child.icon}
                    {(isVisible || !isMobile) && (
                      <span className={`text-sm font-medium font-['Inter'] ${!isVisible && !isMobile ? 'sr-only' : ''}`}>{child.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isVisible && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50" 
          onClick={handleOverlayClick}
        />
      )}
      
      <div 
        ref={sidebarRef}
        className={`fixed lg:static h-screen bg-white border-l border-r border-gray-200 shadow-sm flex flex-col justify-between
          transition-all duration-300 ease-in-out z-30
          ${isVisible 
            ? 'w-64 sm:w-72 opacity-100 translate-x-0' 
            : isMobile 
              ? 'w-0 opacity-0 -translate-x-full' 
              : 'w-16 translate-x-0'
          }`}
      >
        <div className={`flex flex-col items-center justify-start flex-1 w-full overflow-hidden ${!isVisible && isMobile ? 'invisible' : ''}`}>
          {/* Logo and Brand */}
          <div className={`flex flex-col items-center justify-start w-full py-3 border-b border-gray-100 ${!isVisible && !isMobile ? 'py-5' : ''}`}>
            <img src={logo} alt="Lexora Logo" className={`${!isVisible && !isMobile ? 'w-10 h-10' : 'w-16 h-16'}`} />
            {(isVisible || !isMobile) && (
              <div className={`text-gray-800 text-xl font-semibold font-['Inter'] ${!isVisible && !isMobile ? 'sr-only' : ''}`}>
                Lexora
              </div>
            )}
          </div>
          
          {/* Navigation Menu - قائمة العناصر الديناميكية حسب دور المستخدم */}
          <div className="flex flex-col w-full py-4 overflow-y-auto">
            {getMenuItemsByRole().map(renderMenuItem)}
          </div>
        </div>
        
        {/* User Profile & Logout Section */}
        {user && (
          <div className={`w-full px-4 py-4 border-t border-gray-200 bg-gray-50 ${!isVisible && isMobile ? 'invisible' : ''} ${!isVisible && !isMobile ? 'flex justify-center px-2' : ''}`}>
            {!isVisible && !isMobile ? (
              <div 
                onClick={() => navigate('/profile')} 
                className="flex items-center justify-center w-10 h-10 text-lg font-medium text-blue-600 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
              >
                {user.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div 
                  onClick={() => navigate('/profile')} 
                  className="flex items-center justify-center w-10 h-10 text-lg font-medium text-blue-600 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
                >
                  {user.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                </div>
                <p className="text-gray-800 text-sm font-medium font-['Inter'] text-center">
                  مرحباً، {user.nom}
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700"
                >
                  <LogoutIcon />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;