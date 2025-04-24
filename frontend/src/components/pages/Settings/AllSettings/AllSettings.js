import React, { useState } from 'react';

const AllSettings = () => {
  // State for general settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'مكتب المحاماة ليكسورا',
    legalName: 'شركة ليكسورا للمحاماة والاستشارات القانونية',
    email: 'contact@lexora-law.com',
    phone: '+966 55 1234567',
    address: 'الرياض، المملكة العربية السعودية، حي العليا، شارع التحلية',
    website: 'www.lexora-law.com',
    language: 'ar',
    timezone: 'Asia/Riyadh',
    currency: 'SAR'
  });

  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    remindersBefore: 24, // hours
    casesNotifications: true,
    documentsNotifications: true,
    paymentsNotifications: true,
    tasksNotifications: true
  });

  // State for security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiryDays: 90,
    sessionTimeout: 30, // minutes
    loginAttempts: 5,
    passwordComplexity: 'high'
  });

  // State for appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    sidebarStyle: 'expanded',
    accentColor: '#1D4ED8',
    displayMode: 'default',
    fontSize: 'medium'
  });
  
  // State for invoice settings
  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: 'INV',
    paymentTerms: 30, // days
    taxRate: 15, // percentage
    sendAutomaticReminders: true,
    invoiceFooter: 'شكراً لثقتكم في خدماتنا',
    invoiceCurrency: 'SAR'
  });
  
  // State for data and privacy settings
  const [dataSettings, setDataSettings] = useState({
    dataRetentionPeriod: 365, // days
    allowDataCollection: false,
    documentBackup: true,
    backupFrequency: 'weekly',
    autoDeleteTemp: true
  });

  // State indicating which section is open
  const [openSection, setOpenSection] = useState('general');

  // Function to toggle sections
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Function to handle general settings changes
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle notification settings changes
  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Function to handle security settings changes
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Function to handle appearance settings changes
  const handleAppearanceChange = (e) => {
    const { name, value } = e.target;
    setAppearanceSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Function to handle invoice settings changes
  const handleInvoiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Function to handle data and privacy settings changes
  const handleDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDataSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the settings to the backend
    console.log({
      generalSettings,
      notificationSettings,
      securitySettings,
      appearanceSettings,
      invoiceSettings,
      dataSettings
    });
    
    // Show success message
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">إعدادات النظام</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-2 lg:col-span-1">
          <nav className="sticky top-4 space-y-2">
            <button
              onClick={() => toggleSection('general')}
              className={`flex items-center w-full p-3 text-right rounded-md ${
                openSection === 'general' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>الإعدادات العامة</span>
            </button>
            <button
              onClick={() => toggleSection('notification')}
              className={`flex items-center w-full p-3 text-right rounded-md ${
                openSection === 'notification' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>إعدادات الإشعارات</span>
            </button>
            <button
              onClick={() => toggleSection('security')}
              className={`flex items-center w-full p-3 text-right rounded-md ${
                openSection === 'security' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>الأمان والخصوصية</span>
            </button>
            <button
              onClick={() => toggleSection('appearance')}
              className={`flex items-center w-full p-3 text-right rounded-md ${
                openSection === 'appearance' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span>المظهر والعرض</span>
            </button>
            <button
              onClick={() => toggleSection('invoice')}
              className={`flex items-center w-full p-3 text-right rounded-md ${
                openSection === 'invoice' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>إعدادات الفواتير</span>
            </button>
            <button
              onClick={() => toggleSection('data')}
              className={`flex items-center w-full p-3 text-right rounded-md ${
                openSection === 'data' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <span>البيانات والنسخ الاحتياطي</span>
            </button>
          </nav>
        </div>
        
        {/* Settings Content */}
        <form onSubmit={handleSubmit} className="md:col-span-4 lg:col-span-5">
          {/* General Settings */}
          <div className={`p-6 mb-6 bg-white border border-gray-200 rounded-lg ${openSection !== 'general' ? 'hidden' : ''}`}>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">الإعدادات العامة</h2>
            
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="companyName" className="block mb-1 text-sm font-medium text-gray-700">اسم المكتب</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="legalName" className="block mb-1 text-sm font-medium text-gray-700">الاسم القانوني</label>
                  <input
                    type="text"
                    id="legalName"
                    name="legalName"
                    value={generalSettings.legalName}
                    onChange={handleGeneralChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={generalSettings.email}
                    onChange={handleGeneralChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">رقم الهاتف</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={generalSettings.phone}
                    onChange={handleGeneralChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">العنوان</label>
                <textarea
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                  rows="2"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="website" className="block mb-1 text-sm font-medium text-gray-700">الموقع الإلكتروني</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={generalSettings.website}
                    onChange={handleGeneralChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="language" className="block mb-1 text-sm font-medium text-gray-700">اللغة</label>
                  <select
                    id="language"
                    name="language"
                    value={generalSettings.language}
                    onChange={handleGeneralChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">الإنجليزية</option>
                    <option value="fr">الفرنسية</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timezone" className="block mb-1 text-sm font-medium text-gray-700">المنطقة الزمنية</label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={generalSettings.timezone}
                    onChange={handleGeneralChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                    <option value="Asia/Dubai">دبي (GMT+4)</option>
                    <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                    <option value="Europe/London">لندن (GMT+0/+1)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="currency" className="block mb-1 text-sm font-medium text-gray-700">العملة الافتراضية</label>
                <select
                  id="currency"
                  name="currency"
                  value={generalSettings.currency}
                  onChange={handleGeneralChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SAR">الريال السعودي (SAR)</option>
                  <option value="AED">الدرهم الإماراتي (AED)</option>
                  <option value="USD">الدولار الأمريكي (USD)</option>
                  <option value="EUR">اليورو (EUR)</option>
                  <option value="GBP">الجنيه الإسترليني (GBP)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className={`p-6 mb-6 bg-white border border-gray-200 rounded-lg ${openSection !== 'notification' ? 'hidden' : ''}`}>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">إعدادات الإشعارات</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="emailNotifications" className="block mr-2 text-sm font-medium text-gray-700">
                  إشعارات البريد الإلكتروني
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  name="smsNotifications"
                  checked={notificationSettings.smsNotifications}
                  onChange={handleNotificationChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="smsNotifications" className="block mr-2 text-sm font-medium text-gray-700">
                  إشعارات الرسائل النصية (SMS)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inAppNotifications"
                  name="inAppNotifications"
                  checked={notificationSettings.inAppNotifications}
                  onChange={handleNotificationChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="inAppNotifications" className="block mr-2 text-sm font-medium text-gray-700">
                  إشعارات داخل التطبيق
                </label>
              </div>
              
              <div className="mt-4 divider"></div>
              
              <div>
                <label htmlFor="remindersBefore" className="block mb-1 text-sm font-medium text-gray-700">
                  إرسال التذكيرات قبل الجلسات والمواعيد بـ (ساعات)
                </label>
                <input
                  type="number"
                  id="remindersBefore"
                  name="remindersBefore"
                  min="1"
                  max="72"
                  value={notificationSettings.remindersBefore}
                  onChange={handleNotificationChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">أنواع الإشعارات</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="casesNotifications"
                      name="casesNotifications"
                      checked={notificationSettings.casesNotifications}
                      onChange={handleNotificationChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="casesNotifications" className="block mr-2 text-sm text-gray-700">
                      إشعارات القضايا والجلسات
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="documentsNotifications"
                      name="documentsNotifications"
                      checked={notificationSettings.documentsNotifications}
                      onChange={handleNotificationChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="documentsNotifications" className="block mr-2 text-sm text-gray-700">
                      إشعارات المستندات
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="paymentsNotifications"
                      name="paymentsNotifications"
                      checked={notificationSettings.paymentsNotifications}
                      onChange={handleNotificationChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="paymentsNotifications" className="block mr-2 text-sm text-gray-700">
                      إشعارات المدفوعات والفواتير
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tasksNotifications"
                      name="tasksNotifications"
                      checked={notificationSettings.tasksNotifications}
                      onChange={handleNotificationChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="tasksNotifications" className="block mr-2 text-sm text-gray-700">
                      إشعارات المهام والتذكيرات
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Settings */}
          <div className={`p-6 mb-6 bg-white border border-gray-200 rounded-lg ${openSection !== 'security' ? 'hidden' : ''}`}>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">إعدادات الأمان والخصوصية</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onChange={handleSecurityChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="twoFactorAuth" className="block mr-2 text-sm font-medium text-gray-700">
                  تفعيل المصادقة الثنائية (2FA)
                </label>
              </div>
              
              <div>
                <label htmlFor="passwordExpiryDays" className="block mb-1 text-sm font-medium text-gray-700">
                  مدة صلاحية كلمة المرور (بالأيام)
                </label>
                <input
                  type="number"
                  id="passwordExpiryDays"
                  name="passwordExpiryDays"
                  min="0"
                  max="365"
                  value={securitySettings.passwordExpiryDays}
                  onChange={handleSecurityChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  القيمة 0 تعني عدم انتهاء صلاحية كلمة المرور
                </p>
              </div>
              
              <div>
                <label htmlFor="sessionTimeout" className="block mb-1 text-sm font-medium text-gray-700">
                  مهلة انتهاء الجلسة (بالدقائق)
                </label>
                <input
                  type="number"
                  id="sessionTimeout"
                  name="sessionTimeout"
                  min="5"
                  max="180"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="loginAttempts" className="block mb-1 text-sm font-medium text-gray-700">
                  عدد محاولات تسجيل الدخول الفاشلة قبل قفل الحساب
                </label>
                <input
                  type="number"
                  id="loginAttempts"
                  name="loginAttempts"
                  min="1"
                  max="10"
                  value={securitySettings.loginAttempts}
                  onChange={handleSecurityChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="passwordComplexity" className="block mb-1 text-sm font-medium text-gray-700">
                  تعقيد كلمة المرور
                </label>
                <select
                  id="passwordComplexity"
                  name="passwordComplexity"
                  value={securitySettings.passwordComplexity}
                  onChange={handleSecurityChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">منخفض (8 أحرف على الأقل)</option>
                  <option value="medium">متوسط (8 أحرف، حرف كبير، رقم)</option>
                  <option value="high">عالي (8 أحرف، حرف كبير، رقم، رمز خاص)</option>
                  <option value="very-high">عالي جداً (12 حرف، أحرف كبيرة، أرقام، رموز خاصة)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Appearance Settings */}
          <div className={`p-6 mb-6 bg-white border border-gray-200 rounded-lg ${openSection !== 'appearance' ? 'hidden' : ''}`}>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">إعدادات المظهر والعرض</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="theme" className="block mb-1 text-sm font-medium text-gray-700">السمة</label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div 
                    className={`relative p-4 border-2 rounded-lg cursor-pointer ${
                      appearanceSettings.theme === 'light' ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'light' }))}
                  >
                    <div className="h-16 bg-white border border-gray-200 rounded-md shadow-sm"></div>
                    <div className="mt-2 text-sm font-medium text-center">فاتح</div>
                    {appearanceSettings.theme === 'light' && (
                      <div className="absolute top-2 right-2 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className={`relative p-4 border-2 rounded-lg cursor-pointer ${
                      appearanceSettings.theme === 'dark' ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'dark' }))}
                  >
                    <div className="h-16 bg-gray-800 border border-gray-700 rounded-md shadow-sm"></div>
                    <div className="mt-2 text-sm font-medium text-center">داكن</div>
                    {appearanceSettings.theme === 'dark' && (
                      <div className="absolute top-2 right-2 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className={`relative p-4 border-2 rounded-lg cursor-pointer ${
                      appearanceSettings.theme === 'auto' ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'auto' }))}
                  >
                    <div className="h-16 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded-md shadow-sm"></div>
                    <div className="mt-2 text-sm font-medium text-center">تلقائي</div>
                    {appearanceSettings.theme === 'auto' && (
                      <div className="absolute top-2 right-2 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="sidebarStyle" className="block mb-1 text-sm font-medium text-gray-700">نمط القائمة الجانبية</label>
                <select
                  id="sidebarStyle"
                  name="sidebarStyle"
                  value={appearanceSettings.sidebarStyle}
                  onChange={handleAppearanceChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="expanded">موسعة</option>
                  <option value="collapsed">مطوية</option>
                  <option value="auto">تلقائي</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="accentColor" className="block mb-1 text-sm font-medium text-gray-700">اللون الرئيسي</label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {['#1D4ED8', '#047857', '#B91C1C', '#7C3AED', '#C2410C'].map(color => (
                    <div 
                      key={color}
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, accentColor: color }))}
                      className={`relative flex items-center justify-center w-full h-10 rounded-lg cursor-pointer`}
                      style={{ backgroundColor: color }}
                    >
                      {appearanceSettings.accentColor === color && (
                        <div className="text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="displayMode" className="block mb-1 text-sm font-medium text-gray-700">وضع العرض</label>
                <select
                  id="displayMode"
                  name="displayMode"
                  value={appearanceSettings.displayMode}
                  onChange={handleAppearanceChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">افتراضي</option>
                  <option value="compact">مدمج</option>
                  <option value="comfortable">مريح</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="fontSize" className="block mb-1 text-sm font-medium text-gray-700">حجم الخط</label>
                <select
                  id="fontSize"
                  name="fontSize"
                  value={appearanceSettings.fontSize}
                  onChange={handleAppearanceChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">صغير</option>
                  <option value="medium">متوسط</option>
                  <option value="large">كبير</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Invoice Settings */}
          <div className={`p-6 mb-6 bg-white border border-gray-200 rounded-lg ${openSection !== 'invoice' ? 'hidden' : ''}`}>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">إعدادات الفواتير</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="invoicePrefix" className="block mb-1 text-sm font-medium text-gray-700">بادئة الفاتورة</label>
                  <input
                    type="text"
                    id="invoicePrefix"
                    name="invoicePrefix"
                    value={invoiceSettings.invoicePrefix}
                    onChange={handleInvoiceChange}
                    maxLength="5"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="paymentTerms" className="block mb-1 text-sm font-medium text-gray-700">شروط الدفع (بالأيام)</label>
                  <input
                    type="number"
                    id="paymentTerms"
                    name="paymentTerms"
                    min="0"
                    max="90"
                    value={invoiceSettings.paymentTerms}
                    onChange={handleInvoiceChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="taxRate" className="block mb-1 text-sm font-medium text-gray-700">نسبة الضريبة (%)</label>
                  <input
                    type="number"
                    id="taxRate"
                    name="taxRate"
                    min="0"
                    max="100"
                    step="0.01"
                    value={invoiceSettings.taxRate}
                    onChange={handleInvoiceChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="invoiceCurrency" className="block mb-1 text-sm font-medium text-gray-700">عملة الفاتورة</label>
                  <select
                    id="invoiceCurrency"
                    name="invoiceCurrency"
                    value={invoiceSettings.invoiceCurrency}
                    onChange={handleInvoiceChange}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SAR">الريال السعودي (SAR)</option>
                    <option value="AED">الدرهم الإماراتي (AED)</option>
                    <option value="USD">الدولار الأمريكي (USD)</option>
                    <option value="EUR">اليورو (EUR)</option>
                    <option value="GBP">الجنيه الإسترليني (GBP)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="invoiceFooter" className="block mb-1 text-sm font-medium text-gray-700">النص الثابت في تذييل الفاتورة</label>
                <textarea
                  id="invoiceFooter"
                  name="invoiceFooter"
                  value={invoiceSettings.invoiceFooter}
                  onChange={handleInvoiceChange}
                  rows="2"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendAutomaticReminders"
                  name="sendAutomaticReminders"
                  checked={invoiceSettings.sendAutomaticReminders}
                  onChange={handleInvoiceChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendAutomaticReminders" className="block mr-2 text-sm font-medium text-gray-700">
                  إرسال تذكيرات تلقائية للفواتير المستحقة
                </label>
              </div>
            </div>
          </div>
          
          {/* Data and Backup Settings */}
          <div className={`p-6 mb-6 bg-white border border-gray-200 rounded-lg ${openSection !== 'data' ? 'hidden' : ''}`}>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">إعدادات البيانات والنسخ الاحتياطي</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="dataRetentionPeriod" className="block mb-1 text-sm font-medium text-gray-700">
                  فترة الاحتفاظ بالبيانات (بالأيام)
                </label>
                <input
                  type="number"
                  id="dataRetentionPeriod"
                  name="dataRetentionPeriod"
                  min="30"
                  max="3650"
                  value={dataSettings.dataRetentionPeriod}
                  onChange={handleDataChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="documentBackup"
                  name="documentBackup"
                  checked={dataSettings.documentBackup}
                  onChange={handleDataChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="documentBackup" className="block mr-2 text-sm font-medium text-gray-700">
                  تفعيل النسخ الاحتياطي التلقائي للمستندات
                </label>
              </div>
              
              <div>
                <label htmlFor="backupFrequency" className="block mb-1 text-sm font-medium text-gray-700">
                  تكرار النسخ الاحتياطي
                </label>
                <select
                  id="backupFrequency"
                  name="backupFrequency"
                  value={dataSettings.backupFrequency}
                  onChange={handleDataChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">يومي</option>
                  <option value="weekly">أسبوعي</option>
                  <option value="monthly">شهري</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoDeleteTemp"
                  name="autoDeleteTemp"
                  checked={dataSettings.autoDeleteTemp}
                  onChange={handleDataChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="autoDeleteTemp" className="block mr-2 text-sm font-medium text-gray-700">
                  حذف الملفات المؤقتة تلقائياً
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowDataCollection"
                  name="allowDataCollection"
                  checked={dataSettings.allowDataCollection}
                  onChange={handleDataChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="allowDataCollection" className="block mr-2 text-sm font-medium text-gray-700">
                  السماح بجمع بيانات الاستخدام لتحسين الخدمة
                </label>
              </div>
              
              <div className="pt-4 mt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    إنشاء نسخة احتياطية الآن
                  </button>
                  
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    حذف جميع البيانات
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  ملحوظة: سيؤدي حذف جميع البيانات إلى مسح جميع سجلات النظام بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>
          </div>
          
          {/* Save Button - fixed at bottom */}
          <div className="fixed inset-x-0 bottom-0 p-4 bg-white border-t border-gray-200">
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllSettings;