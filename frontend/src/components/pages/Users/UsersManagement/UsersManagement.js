import React, { useState, useEffect } from 'react';

const UsersManagement = () => {
  // حالة البحث والفلترة
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    registrationDate: ''
  });

  // حالة بيانات المستخدمين
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالة الترقيم
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // محاكاة جلب البيانات من الخادم
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // في الإنتاج، هذا سيكون طلب API حقيقي
        // await fetch('/api/users')...
        
        // بيانات تجريبية
        const mockUsers = [
          {
            id: 1,
            firstName: 'أحمد',
            lastName: 'محمد',
            username: 'ahmed',
            email: 'ahmed@example.com',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-01'
          },
          {
            id: 2,
            firstName: 'سارة',
            lastName: 'أحمد',
            username: 'sara',
            email: 'sara@example.com',
            role: 'lawyer',
            status: 'active',
            createdAt: '2024-02-15'
          },
          {
            id: 3,
            firstName: 'محمد',
            lastName: 'علي',
            username: 'mohamed',
            email: 'mohamed@example.com',
            role: 'assistant',
            status: 'pending',
            createdAt: '2024-03-10'
          },
          {
            id: 4,
            firstName: 'فاطمة',
            lastName: 'حسن',
            username: 'fatima',
            email: 'fatima@example.com',
            role: 'secretary',
            status: 'inactive',
            createdAt: '2024-02-20'
          },
          {
            id: 5,
            firstName: 'خالد',
            lastName: 'محمود',
            username: 'khaled',
            email: 'khaled@example.com',
            role: 'lawyer',
            status: 'active',
            createdAt: '2024-01-25'
          }
        ];
        
        // تعيين البيانات
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setTotalUsers(mockUsers.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // تطبيق الفلاتر على البيانات
  const applyFilters = () => {
    let result = [...users];
    
    // تطبيق فلتر البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(query) || 
        user.lastName.toLowerCase().includes(query) || 
        user.username.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    // تطبيق الفلاتر المتقدمة
    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }
    
    if (filters.status) {
      result = result.filter(user => user.status === filters.status);
    }
    
    if (filters.registrationDate) {
      result = result.filter(user => user.createdAt.includes(filters.registrationDate));
    }
    
    setFilteredUsers(result);
    setTotalUsers(result.length);
    setCurrentPage(1); // إعادة التعيين إلى الصفحة الأولى بعد تطبيق الفلاتر
  };

  // معالجة تغييرات الفلاتر
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // معالجة تنفيذ الفلاتر
  const handleApplyFilters = () => {
    applyFilters();
  };

  // معالجة البحث
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    
    // تطبيق البحث بعد فترة قصيرة من التوقف عن الكتابة
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // حساب عناصر المستخدمين الحالية للعرض
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // تغيير الصفحة
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // عدد صفحات الترقيم
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // ترجمة الدور والحالة إلى العربية
  const translateRole = (role) => {
    const roles = {
      'admin': 'مدير النظام',
      'lawyer': 'محامي',
      'assistant': 'مساعد',
      'secretary': 'سكرتير'
    };
    return roles[role] || role;
  };

  const translateStatus = (status) => {
    const statuses = {
      'active': 'نشط',
      'pending': 'معلق',
      'inactive': 'غير نشط'
    };
    return statuses[status] || status;
  };

  // الألوان حسب نوع الدور
  const getRoleColorClass = (role) => {
    const colors = {
      'admin': 'bg-blue-100 text-blue-800',
      'lawyer': 'bg-purple-100 text-purple-800',
      'assistant': 'bg-green-100 text-green-800',
      'secretary': 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // الألوان حسب نوع الحالة
  const getStatusColorClass = (status) => {
    const colors = {
      'active': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'inactive': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  // الحرف الأول من اسم المستخدم
  const getInitial = (firstName) => {
    return firstName ? firstName.charAt(0) : 'U';
  };

  // لون الأيقونة حسب الدور
  const getAvatarColor = (role) => {
    const colors = {
      'admin': 'bg-blue-600',
      'lawyer': 'bg-purple-600',
      'assistant': 'bg-green-600',
      'secretary': 'bg-yellow-600'
    };
    return colors[role] || 'bg-gray-600';
  };

  // معالجة حذف مستخدم
  const handleDelete = (userId) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
      // في الإنتاج، هذا سيكون طلب API حقيقي
      // await fetch(`/api/users/${userId}`, { method: 'DELETE' })...
      
      // محاكاة حذف مستخدم
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      // تحديث المستخدمين المعروضين
      applyFilters();
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* العنوان وزر الإضافة */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">إدارة المستخدمين</h1>
        
        <button className="flex items-center justify-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>
      
      {/* قسم البحث والفلترة المتقدمة */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="البحث عن مستخدم..." 
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pl-3 pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <button 
            className="flex items-center px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            تصفية متقدمة
          </button>
        </div>

        {/* خيارات التصفية المتقدمة - تظهر/تختفي عند الضغط على الزر */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">الكل</option>
                <option value="admin">مدير النظام</option>
                <option value="lawyer">محامي</option>
                <option value="assistant">مساعد</option>
                <option value="secretary">سكرتير</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">الكل</option>
                <option value="active">نشط</option>
                <option value="pending">معلق</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التسجيل</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="registrationDate"
                value={filters.registrationDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="flex items-end">
              <button 
                className="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                onClick={handleApplyFilters}
              >
                تطبيق التصفية
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* جدول المستخدمين */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="mr-3">جاري التحميل...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-gray-500">
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 20h.01M16 3h-8a5 5 0 00-5 5v12a1 1 0 001 1h16a1 1 0 001-1V8a5 5 0 00-5-5z"></path>
              </svg>
              <p className="text-lg">لا توجد بيانات متاحة</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th scope="col" className="px-6 py-3">المستخدم</th>
                  <th scope="col" className="px-6 py-3">البريد الإلكتروني</th>
                  <th scope="col" className="px-6 py-3">الدور</th>
                  <th scope="col" className="px-6 py-3">الحالة</th>
                  <th scope="col" className="px-6 py-3">تاريخ الإنشاء</th>
                  <th scope="col" className="px-6 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full ${getAvatarColor(user.role)} flex items-center justify-center text-white font-medium`}>
                            {getInitial(user.firstName)}
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColorClass(user.role)}`}>
                        {translateRole(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-2 w-2 rounded-full ${getStatusColorClass(user.status)} ml-2`}></div>
                        <span className="text-sm text-gray-900">{translateStatus(user.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <button 
                          title="عرض" 
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          onClick={() => console.log('عرض', user.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          title="تعديل" 
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50 transition-colors"
                          onClick={() => console.log('تعديل', user.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          title="حذف" 
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(user.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* ترقيم الصفحات */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-700">
            عرض <span className="font-medium">{currentUsers.length}</span> من أصل <span className="font-medium">{totalUsers}</span> مستخدم
          </div>
          <nav className="relative z-0 inline-flex shadow-sm -space-x-px space-x-reverse rounded-md" aria-label="Pagination">
            <button 
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">السابق</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* عرض أرقام الصفحات */}
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  className={`${
                    currentPage === pageNumber
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button 
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">التالي</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;