import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/api';
import { useNavigate } from 'react-router-dom';

// مكون نافذة حوارية لعرض رسالة الخطأ بشكل أكثر تفصيلاً
const ErrorModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 outline-none focus:outline-none">
      <div className="relative w-full max-w-md px-4 mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* الرأس */}
          <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {title}
            </h3>
            <button
              className="p-1 ml-0 mr-auto text-gray-400 transition-all bg-transparent border-0 outline-none hover:text-gray-900"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          {/* المحتوى */}
          <div className="relative flex-auto p-6">
            <div className="text-gray-700">
              {message.includes("دوسييهات") ? (
                <div>
                  <p className="mb-4">{message}</p>
                  <div className="p-3 border rounded-md border-amber-200 bg-amber-50 text-amber-800">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">ملاحظة مهمة:</span>
                    </div>
                    <ul className="mr-5 space-y-1 list-disc list-inside">
                      <li>يجب عليك أولاً تعيين مسؤول آخر للدوسييهات المرتبطة بهذا المستخدم</li>
                      <li>يمكنك القيام بذلك من خلال الانتقال إلى "إدارة القضايا" ثم تحديث المسؤول لكل قضية</li>
                      <li>بعد نقل جميع القضايا، يمكنك محاولة حذف المستخدم مرة أخرى</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p>{message}</p>
              )}
            </div>
          </div>
          {/* التذييل */}
          <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
            <button
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              موافق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersManagement = () => {
  const navigate = useNavigate();
  
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
  
  // حالة الخطأ
  const [error, setError] = useState(null);
  // حالة نوع الخطأ: 'connection' لمشاكل الاتصال، 'empty' لعدم وجود بيانات
  const [errorType, setErrorType] = useState(null);

  // جلب البيانات من الخادم
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);
        
        // استدعاء API لجلب المستخدمين
        console.log('Fetching users from API...');
        const response = await userService.getAllUsers();
        console.log('API response:', response);
        
        // إذا كانت الاستجابة فارغة أو مصفوفة فارغة
        if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
          setErrorType('empty');
          setError('لا يوجد مستخدمين حاليًا في قاعدة البيانات');
          setUsers([]);
          setFilteredUsers([]);
          setTotalUsers(0);
          return;
        }
        
        // تنسيق البيانات حسب هيكل الاستجابة
        let userData = [];
        
        if (Array.isArray(response.data)) {
          // إذا كانت الاستجابة عبارة عن مصفوفة من المستخدمين
          userData = response.data.map(user => formatUserData(user));
        } else if (response.data) {
          // إذا كانت الاستجابة مستخدم واحد (المستخدم الحالي)
          userData = [formatUserData(response.data)];
        }
        
        // تعيين البيانات
        setUsers(userData);
        setFilteredUsers(userData);
        setTotalUsers(userData.length);
        
      } catch (error) {
        console.error('Error fetching users:', error);
        
        // تعيين خطأ اتصال
        setErrorType('connection');
        setError('تعذر الاتصال بقاعدة البيانات. الرجاء المحاولة مرة أخرى لاحقًا.');
        setUsers([]);
        setFilteredUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // تنسيق بيانات المستخدم القادمة من الخادم
  const formatUserData = (user) => {
    // معالجة أكثر أمانًا للتاريخ
    let createdAtDate = '-';
    
    if (user.dateCreation) {
      try {
        // تنظيف قيمة التاريخ وتحويلها إلى كائن تاريخ
        const dateValue = user.dateCreation;
        
        // التحقق من نوع البيانات وتحويلها بشكل مناسب
        if (dateValue === 1 || dateValue === '1') {
          // معالجة الحالة الخاصة للقيمة '1'
          console.warn("تم تجاوز قيمة التاريخ غير الصالحة (1) للمستخدم:", user.idUtilisateur);
        } else if (Array.isArray(dateValue)) {
          // إذا كان التاريخ في شكل مصفوفة [سنة, شهر, يوم, ...]
          if (dateValue.length >= 3) {
            // تحقق من أن المصفوفة تحتوي على العناصر المطلوبة على الأقل
            try {
              // ملاحظة: شهور JavaScript تبدأ من 0، لذا نطرح 1 من الشهر
              const date = new Date(dateValue[0], dateValue[1] - 1, dateValue[2]);
              if (!isNaN(date.getTime())) {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                createdAtDate = `${day}/${month}/${year}`;
              }
            } catch (innerError) {
              console.warn("خطأ في معالجة التاريخ كمصفوفة:", innerError);
            }
          }
        } else {
          // محاولة إنشاء كائن تاريخ من قيمة عادية
          const date = new Date(dateValue);
          
          // التحقق من أن التاريخ صالح
          if (!isNaN(date.getTime()) && date.getFullYear() > 1970) {
            // تنسيق التاريخ بصيغة أكثر قابلية للقراءة في العربية (اليوم/الشهر/السنة)
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            createdAtDate = `${day}/${month}/${year}`;
          } else {
            console.warn("تنسيق تاريخ غير صالح للمستخدم:", user.idUtilisateur, dateValue);
          }
        }
      } catch (error) {
        // في حالة حدوث خطأ في معالجة التاريخ
        console.warn("خطأ في معالجة تاريخ المستخدم:", user.idUtilisateur, error);
      }
    }
    
    return {
      id: user.idUtilisateur || 0,
      firstName: user.prenom || '',
      lastName: user.nom || '',
      username: user.email ? user.email.split('@')[0] : '',
      email: user.email || '',
      role: user.role ? user.role.toLowerCase() : 'user',
      status: user.estActive ? 'active' : 'inactive',
      createdAt: createdAtDate
    };
  };

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
      'administrateur': 'مدير النظام',
      'super_admin': 'مدير النظام الرئيسي',
      'lawyer': 'محامي',
      'avocat': 'محامي',
      'assistant': 'مساعد',
      'assistant_juridique': 'مساعد قانوني',
      'secretary': 'سكرتير',
      'comptable': 'محاسب'
    };
    return roles[role.toLowerCase()] || role;
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
      'administrateur': 'bg-blue-100 text-blue-800',
      'super_admin': 'bg-purple-200 text-purple-900',
      'lawyer': 'bg-purple-100 text-purple-800',
      'avocat': 'bg-purple-100 text-purple-800',
      'assistant': 'bg-green-100 text-green-800',
      'assistant_juridique': 'bg-green-100 text-green-800',
      'secretary': 'bg-yellow-100 text-yellow-800',
      'comptable': 'bg-amber-100 text-amber-800'
    };
    return colors[role.toLowerCase()] || 'bg-gray-100 text-gray-800';
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
      'administrateur': 'bg-blue-600',
      'super_admin': 'bg-purple-700',
      'lawyer': 'bg-purple-600',
      'avocat': 'bg-purple-600',
      'assistant': 'bg-green-600',
      'assistant_juridique': 'bg-green-600',
      'secretary': 'bg-yellow-600',
      'comptable': 'bg-amber-600'
    };
    return colors[role.toLowerCase()] || 'bg-gray-600';
  };

  // حالة نافذة الخطأ
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: '',
    message: ''
  });
  
  // فتح نافذة الخطأ
  const openErrorModal = (title, message) => {
    setErrorModal({
      isOpen: true,
      title,
      message
    });
  };
  
  // إغلاق نافذة الخطأ
  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      title: '',
      message: ''
    });
  };

  // حالات الإشعارات
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' // 'success' أو 'error'
  });

  // إظهار إشعار
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });

    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // معالجة حذف مستخدم
  const handleDelete = async (userId) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
      try {
        // استدعاء API لحذف المستخدم
        await userService.deleteUser(userId);
        
        // تحديث قائمة المستخدمين بعد الحذف
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.filter(user => user.id !== userId);
          // تحديث المستخدمين المعروضين مباشرة هنا
          setFilteredUsers(prev => prev.filter(user => user.id !== userId));
          setTotalUsers(prev => prev - 1);
          return updatedUsers;
        });
        
        // عرض إشعار نجاح
        showNotification('تم حذف المستخدم بنجاح');
        
      } catch (error) {
        console.error('Error deleting user:', error);
        
        // عرض الرسالة الواردة من الخادم إذا كانت متوفرة
        let errorMessage = 'فشل في حذف المستخدم. الرجاء المحاولة مرة أخرى لاحقًا.';
        
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        
        // فتح نافذة الخطأ مع الرسالة المناسبة
        openErrorModal('تعذر حذف المستخدم', errorMessage);
      }
    }
  };

  // معالجة تغيير حالة المستخدم
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      // استدعاء API لتحديث حالة المستخدم
      const newStatus = currentStatus === 'active' ? false : true;
      await userService.updateUserStatus(userId, newStatus);
      
      // تحديث قائمة المستخدمين بعد تغيير الحالة
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: newStatus ? 'active' : 'inactive'
          };
        }
        return user;
      });
      
      // تحديث كل من القوائم الرئيسية والمفلترة
      setUsers(updatedUsers);
      setFilteredUsers(prevFilteredUsers => 
        prevFilteredUsers.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              status: newStatus ? 'active' : 'inactive'
            };
          }
          return user;
        })
      );
      
      // عرض إشعار نجاح
      showNotification(newStatus ? 
        'تم تفعيل حساب المستخدم بنجاح' : 
        'تم تعطيل حساب المستخدم بنجاح'
      );
      
    } catch (error) {
      console.error('Error updating user status:', error);
      
      // عرض إشعار خطأ
      showNotification('فشل في تحديث حالة المستخدم. الرجاء المحاولة مرة أخرى لاحقًا.', 'error');
    }
  };

  // تصيير واجهة رسالة الخطأ بناءً على نوع الخطأ
  const renderErrorMessage = () => {
    if (!error) return null;
    
    // تحديد نوع الأيقونة وألوان الإطار بناءً على نوع الخطأ
    let iconPath, containerClasses;
    
    if (errorType === 'empty') {
      // رسالة عدم وجود بيانات (معلومات)
      containerClasses = 'bg-blue-50 border-blue-200 text-blue-700';
      iconPath = (
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      );
    } else {
      // رسالة خطأ في الاتصال (خطأ)
      containerClasses = 'bg-red-50 border-red-200 text-red-700';
      iconPath = (
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      );
    }
    
    return (
      <div className={`mb-6 p-4 border rounded-md ${containerClasses}`}>
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            {iconPath}
          </svg>
          {error}
        </p>
      </div>
    );
  };
  
  // تصيير محتوى الجدول بناءً على حالة التحميل والبيانات والأخطاء
  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-6">
          <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <span className="mr-3">جاري التحميل...</span>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-gray-500">
          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {errorType === 'empty' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <p className="text-lg">{error}</p>
          {errorType === 'connection' && (
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      );
    }
    
    if (filteredUsers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-gray-500">
          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 20h.01M16 3h-8a5 5 0 00-5 5v12a1 1 0 001 1h16a1 1 0 001-1V8a5 5 0 00-5-5z"></path>
          </svg>
          <p className="text-lg">لا توجد بيانات متاحة</p>
        </div>
      );
    }
    
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
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
                  <div className="flex-shrink-0 w-10 h-10">
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
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {user.createdAt}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button 
                    title="عرض" 
                    className="p-1 text-blue-600 transition-colors rounded-full hover:text-blue-900 hover:bg-blue-50"
                    onClick={() => navigate(`/view-user/${user.id}`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    title="تعديل" 
                    className="p-1 text-yellow-600 transition-colors rounded-full hover:text-yellow-900 hover:bg-yellow-50"
                    onClick={() => navigate(`/edit-user/${user.id}`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {/* تعطيل زر تغيير الحالة للمستخدمين من نوع مدير النظام */}
                  {user.role.toLowerCase() === 'admin' || 
                   user.role.toLowerCase() === 'administrateur' ? (
                    <button 
                      title="لا يمكن تغيير حالة مدير النظام"
                      className="p-1 text-gray-400 rounded-full cursor-not-allowed"
                      disabled
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      title={user.status === 'active' ? "تعطيل المستخدم" : "تفعيل المستخدم"}
                      className={`${user.status === 'active' ? 'text-amber-600 hover:text-amber-900 hover:bg-amber-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'} p-1 rounded-full transition-colors`}
                      onClick={() => handleToggleUserStatus(user.id, user.status)}
                    >
                      {user.status === 'active' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  )}
                  
                  {/* تعطيل زر الحذف للمستخدمين من نوع مدير النظام */}
                  {user.role.toLowerCase() === 'admin' || 
                   user.role.toLowerCase() === 'administrateur' ? (
                    <button 
                      title="لا يمكن حذف مدير النظام"
                      className="p-1 text-gray-400 rounded-full cursor-not-allowed"
                      disabled
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      title="حذف" 
                      className="p-1 text-red-600 transition-colors rounded-full hover:text-red-900 hover:bg-red-50"
                      onClick={() => handleDelete(user.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* إضافة نافذة الخطأ */}
      <ErrorModal 
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
      />
      
      {/* مكون الإشعارات */}
      {notification.show && (
        <div className={`fixed left-5 bottom-5 z-50 flex items-center p-4 mb-4 text-sm rounded-lg ${
          notification.type === 'success' 
            ? 'text-green-800 bg-green-50 border border-green-200'
            : 'text-red-800 bg-red-50 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <svg className="flex-shrink-0 inline w-5 h-5 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg className="flex-shrink-0 inline w-5 h-5 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"></path>
            </svg>
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* بقية المكونات */}
      {/* العنوان وزر الإضافة */}
      <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:mb-0">إدارة المستخدمين</h1>
        
        <button 
          onClick={() => navigate('/new-user')}
          className="flex items-center justify-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>
      
      {/* قسم البحث والفلترة المتقدمة */}
      {!error && (
        <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">الدور</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value="">الكل</option>
                  <option value="administrateur">مدير النظام</option>
                  <option value="super_admin">مدير النظام الرئيسي</option>
                  <option value="avocat">محامي</option>
                  <option value="assistant_juridique">مساعد قانوني</option>
                  <option value="comptable">محاسب</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">الحالة</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">الكل</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">تاريخ التسجيل</label>
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
      )}
      
      {/* رسالة الخطأ */}
      {renderErrorMessage()}
      
      {/* جدول المستخدمين */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {renderTableContent()}
        </div>
      </div>
      
      {/* ترقيم الصفحات - تظهر فقط إذا كان هناك مستخدمين */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 mt-6 sm:flex-row">
          <div className="text-sm text-gray-700">
            عرض <span className="font-medium">{currentUsers.length}</span> من أصل <span className="font-medium">{totalUsers}</span> مستخدم
          </div>
          <nav className="relative z-0 inline-flex -space-x-px space-x-reverse rounded-md shadow-sm" aria-label="Pagination">
            <button 
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">السابق</span>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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