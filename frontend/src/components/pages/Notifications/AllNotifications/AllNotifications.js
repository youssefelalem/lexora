import React, { useState } from 'react';

const AllNotifications = () => {
  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'موعد جلسة محكمة',
      content: 'تذكير: لديك جلسة محكمة غداً الساعة 10:00 صباحًا في محكمة الاستئناف.',
      date: '2025-04-23T09:00:00',
      type: 'reminder',
      isRead: false,
      priority: 'high',
      relatedTo: { type: 'case', id: 'C-2025-0042', name: 'قضية الشركة أ ضد الشركة ب' }
    },
    {
      id: 2,
      title: 'مستند جديد مشترك معك',
      content: 'قام المحامي محمد عبد الله بمشاركة مستند "عقد إيجار تجاري" معك.',
      date: '2025-04-22T14:30:00',
      type: 'document',
      isRead: true,
      priority: 'medium',
      relatedTo: { type: 'document', id: 'DOC-2025-187', name: 'عقد إيجار تجاري' }
    },
    {
      id: 3,
      title: 'دفعة مستحقة',
      content: 'هناك دفعة بقيمة 5000 ريال مستحقة في خلال 3 أيام من العميل "شركة النور".',
      date: '2025-04-21T10:15:00',
      type: 'payment',
      isRead: false,
      priority: 'medium',
      relatedTo: { type: 'invoice', id: 'INV-2025-0076', name: 'فاتورة استشارات قانونية' }
    },
    {
      id: 4,
      title: 'تعليق جديد على قضية',
      content: 'أضاف أحمد محمد تعليقًا جديدًا على القضية "قضية الملكية الفكرية".',
      date: '2025-04-20T16:45:00',
      type: 'comment',
      isRead: true,
      priority: 'low',
      relatedTo: { type: 'case', id: 'C-2025-0039', name: 'قضية الملكية الفكرية' }
    },
    {
      id: 5,
      title: 'تم تعيين قضية جديدة لك',
      content: 'تم تعيين قضية جديدة "نزاع تجاري" لك من قبل المدير العام.',
      date: '2025-04-19T11:20:00',
      type: 'assignment',
      isRead: false,
      priority: 'high',
      relatedTo: { type: 'case', id: 'C-2025-0044', name: 'نزاع تجاري' }
    },
    {
      id: 6,
      title: 'توقيع مستند مطلوب',
      content: 'مطلوب توقيعك على مستند "وكالة قانونية" خلال 48 ساعة.',
      date: '2025-04-18T09:30:00',
      type: 'signature',
      isRead: true,
      priority: 'high',
      relatedTo: { type: 'document', id: 'DOC-2025-192', name: 'وكالة قانونية' }
    },
    {
      id: 7,
      title: 'تم تحديث حالة القضية',
      content: 'تم تغيير حالة القضية "دعوى مدنية" من "قيد النظر" إلى "مكتملة".',
      date: '2025-04-17T13:00:00',
      type: 'status',
      isRead: false,
      priority: 'medium',
      relatedTo: { type: 'case', id: 'C-2025-0038', name: 'دعوى مدنية' }
    }
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    read: 'all', // all, read, unread
    type: 'all',
    priority: 'all',
    date: 'all' // all, today, this_week, this_month
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle marking notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, isRead: true };
      }
      return notification;
    }));
  };

  // Function to handle marking all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => {
      return { ...notification, isRead: true };
    }));
  };

  // Function to handle deleting a notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to apply filters and search
  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      // Filter by read status
      if (filters.read === 'read' && !notification.isRead) return false;
      if (filters.read === 'unread' && notification.isRead) return false;
      
      // Filter by notification type
      if (filters.type !== 'all' && notification.type !== filters.type) return false;
      
      // Filter by priority
      if (filters.priority !== 'all' && notification.priority !== filters.priority) return false;
      
      // Filter by date
      if (filters.date !== 'all') {
        const notificationDate = new Date(notification.date);
        const today = new Date();
        
        if (filters.date === 'today') {
          if (notificationDate.getDate() !== today.getDate() ||
              notificationDate.getMonth() !== today.getMonth() ||
              notificationDate.getFullYear() !== today.getFullYear()) {
            return false;
          }
        } else if (filters.date === 'this_week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(today.getDate() - 7);
          if (notificationDate < oneWeekAgo) return false;
        } else if (filters.date === 'this_month') {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(today.getMonth() - 1);
          if (notificationDate < oneMonthAgo) return false;
        }
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        return notification.title.toLowerCase().includes(searchTermLower) || 
               notification.content.toLowerCase().includes(searchTermLower) ||
               notification.relatedTo.name.toLowerCase().includes(searchTermLower);
      }
      
      return true;
    });
  };

  const filteredNotifications = getFilteredNotifications();
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Get notification type icon
  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case 'reminder':
        return (
          <div className="flex items-center justify-center w-10 h-10 text-blue-500 bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'document':
        return (
          <div className="flex items-center justify-center w-10 h-10 text-green-500 bg-green-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="flex items-center justify-center w-10 h-10 text-yellow-500 bg-yellow-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="flex items-center justify-center w-10 h-10 text-purple-500 bg-purple-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'assignment':
        return (
          <div className="flex items-center justify-center w-10 h-10 text-indigo-500 bg-indigo-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'signature':
        return (
          <div className="flex items-center justify-center w-10 h-10 text-red-500 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        );
      case 'status':
        return (
          <div className="flex items-center justify-center w-10 h-10 text-teal-500 bg-teal-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  // Format date to show in a user-friendly way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `اليوم ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    
    // Check if it's yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `أمس ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    
    // Format date in Arabic style
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get related item type icon
  const getRelatedItemIcon = (type) => {
    switch (type) {
      case 'case':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'invoice':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">الإشعارات</h1>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
            {unreadCount} جديدة
          </span>
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-3 py-1 text-sm font-medium text-blue-700 transition-colors bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تعيين الكل كمقروءة
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 mb-6 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="w-full md:w-72">
            <label className="block mb-1 text-sm font-medium text-gray-700">بحث في الإشعارات</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن عنوان، محتوى، ..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Filter by read status */}
          <div className="w-full md:w-48">
            <label className="block mb-1 text-sm font-medium text-gray-700">حالة القراءة</label>
            <select
              name="read"
              value={filters.read}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الإشعارات</option>
              <option value="unread">غير مقروءة</option>
              <option value="read">مقروءة</option>
            </select>
          </div>
          
          {/* Filter by type */}
          <div className="w-full md:w-48">
            <label className="block mb-1 text-sm font-medium text-gray-700">نوع الإشعار</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="reminder">تذكير</option>
              <option value="document">مستند</option>
              <option value="payment">دفعة</option>
              <option value="comment">تعليق</option>
              <option value="assignment">تعيين</option>
              <option value="signature">توقيع</option>
              <option value="status">حالة</option>
            </select>
          </div>
          
          {/* Filter by priority */}
          <div className="w-full md:w-48">
            <label className="block mb-1 text-sm font-medium text-gray-700">الأولوية</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الأولويات</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>
          </div>
          
          {/* Filter by date */}
          <div className="w-full md:w-48">
            <label className="block mb-1 text-sm font-medium text-gray-700">التاريخ</label>
            <select
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="this_week">هذا الأسبوع</option>
              <option value="this_month">هذا الشهر</option>
            </select>
          </div>
          
          {/* Reset filters button */}
          <button
            onClick={() => {
              setFilters({
                read: 'all',
                type: 'all',
                priority: 'all',
                date: 'all'
              });
              setSearchTerm('');
            }}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`border rounded-lg overflow-hidden transition-colors ${notification.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex items-start p-4">
                {/* Type Icon */}
                {getNotificationTypeIcon(notification.type)}
                
                {/* Content */}
                <div className="flex flex-col flex-grow mx-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 className={`text-base font-medium ${notification.isRead ? 'text-gray-800' : 'text-blue-800'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 mr-2 bg-blue-600 rounded-full"></span>
                      )}
                      <span className={`mr-2 px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityBadgeClass(notification.priority)}`}>
                        {notification.priority === 'high' ? 'عالية' : notification.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.content}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      {getRelatedItemIcon(notification.relatedTo.type)}
                      <span className="ml-1">{notification.relatedTo.id}</span>
                    </span>
                    <span className="mx-2">-</span>
                    <span>{notification.relatedTo.name}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-shrink-0 space-x-2 space-x-reverse">
                  {!notification.isRead && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 text-blue-600 transition-colors rounded-full hover:bg-blue-100"
                      title="تعيين كمقروءة"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-red-600 transition-colors rounded-full hover:bg-red-100"
                    title="حذف الإشعار"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-end px-4 py-2 bg-gray-50 border-t border-gray-200">
                <button className="px-3 py-1 mr-2 text-sm text-blue-700 transition-colors bg-white border border-blue-300 rounded-md hover:bg-blue-50">
                  عرض التفاصيل
                </button>
                <a 
                  href={`/${notification.relatedTo.type}s/${notification.relatedTo.id}`}
                  className="px-3 py-1 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  الانتقال إلى {notification.relatedTo.type === 'case' ? 'القضية' : 
                              notification.relatedTo.type === 'document' ? 'المستند' : 'الفاتورة'}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-gray-400 bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-medium text-gray-700">لا توجد إشعارات</h3>
            <p className="text-gray-500">
              {searchTerm || filters.read !== 'all' || filters.type !== 'all' || filters.priority !== 'all' || filters.date !== 'all'
                ? 'لا توجد إشعارات تطابق معايير البحث الخاصة بك'
                : 'ستظهر الإشعارات الجديدة هنا عند استلامها'}
            </p>
          </div>
        )}
      </div>

      {/* Settings Button */}
      <div className="flex justify-center mt-6">
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          إعدادات الإشعارات
        </button>
      </div>
    </div>
  );
};

export default AllNotifications;