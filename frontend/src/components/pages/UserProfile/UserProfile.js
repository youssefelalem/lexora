import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import api, { userService } from '../../../services/api';
// استيراد المكونات المشتركة
import UserAvatar from '../../common/UserAvatar/UserAvatar';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import RoleBadge from '../../common/RoleBadge/RoleBadge';
import ErrorModal from '../../common/ErrorModal/ErrorModal';

const UserProfile = () => {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch fresh user data from database on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserProfile = async () => {
      if (!authUser) {
        setIsFetchingProfile(false);
        return;
      }
      
      // Make sure we have a valid user ID
      const userId = authUser.idUtilisateur || authUser.id;
      if (!userId) {
        console.error('No valid user ID found');
        setError('خطأ في بيانات المستخدم');
        setIsErrorModalOpen(true);
        setIsFetchingProfile(false);
        return;
      }
      
      setIsFetchingProfile(true);
      try {
        // Log the request details for debugging
        console.log(`Fetching user profile for ID: ${userId}`);
        
        // Use the userService to get user data instead of direct axios call
        const response = await userService.getUserById(userId);
        
        // Only update state if the component is still mounted
        if (isMounted) {
          console.log('Fresh user data loaded from database:', response.data);
          setUser(response.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching user data:', error);
          
          // Handle different error types
          if (error.response) {
            // The server responded with an error status code
            const status = error.response.status;
            if (status === 401) {
              console.log('Unauthorized access, logging out');
              logout();
            } else if (status === 404) {
              setError('لم يتم العثور على بيانات المستخدم');
            } else if (status === 500) {
              setError('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً');
              console.error('Server error details:', error.response.data);
            } else {
              setError(`خطأ في الاتصال: ${status}`);
            }
            setIsErrorModalOpen(true);
          } else if (error.request) {
            // The request was made but no response was received
            setError('لم يتم تلقي استجابة من الخادم. يرجى التحقق من اتصالك بالإنترنت.');
            setIsErrorModalOpen(true);
          } else {
            // Something happened in setting up the request
            setError('حدث خطأ أثناء إعداد الطلب');
            setIsErrorModalOpen(true);
          }
        }
      } finally {
        if (isMounted) {
          setIsFetchingProfile(false);
        }
      }
    };

    fetchUserProfile();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [authUser, logout]);

  // تنسيق المصفوفة إلى كائن تاريخ صالح
  const formatDateArray = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return null;
    
    try {
      // التنسيق يمكن أن يكون مصفوفة بطول 3 أو 7 عناصر
      // - للتاريخ فقط: [year, month, day]
      // - للتاريخ والوقت: [year, month, day, hour, minute, second, nanosecond]
      
      if (dateArray.length >= 3) {
        const [year, month, day] = dateArray;
        
        if (dateArray.length >= 6) {
          const [, , , hour, minute, second] = dateArray;
          // لاحظ أن الشهر في كائن Date يبدأ من 0، لذا نطرح 1
          return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
        } else {
          // إذا كان لدينا تاريخ فقط بدون وقت
          return new Date(year, month - 1, day);
        }
      }
      
      return null;
    } catch (error) {
      console.error('خطأ في تنسيق التاريخ:', error, dateArray);
      return null;
    }
  };

  // Format date for readability
  const formatDate = (dateValue) => {
    if (!dateValue) return 'غير محدد';
    
    try {
      let date;
      
      if (Array.isArray(dateValue)) {
        date = formatDateArray(dateValue);
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        console.warn('نوع بيانات تاريخ غير معروف:', typeof dateValue, dateValue);
        return 'تنسيق غير معروف';
      }
      
      if (!date || isNaN(date.getTime())) {
        console.warn('تاريخ غير صالح:', dateValue);
        return 'تاريخ غير صالح';
      }
        // استخدم تنسيق فرنسي للعرض
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      
      // إضافة الوقت إذا كان يحتوي على معلومات الوقت
      if (Array.isArray(dateValue) && dateValue.length > 3) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      
      return date.toLocaleDateString('fr-FR', options);
    } catch (error) {
      console.error('خطأ في عرض التاريخ:', error, dateValue);
      return 'تاريخ غير صالح';
    }
  };

  // Show loading indicator while fetching data
  if (!user || isFetchingProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" color="primary" text="جاري تحميل بيانات المستخدم..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 mx-auto bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">الملف الشخصي</h1>
      
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0">
          <UserAvatar 
            name={`${user.prenom} ${user.nom}`}
            role={user.role}
            size="xl"
            imgSrc={user.avatar}
          />
        </div>
        <div className="mr-4">
          <h2 className="text-xl font-semibold">{user.nomComplet || `${user.prenom} ${user.nom}`}</h2>
          <p className="text-gray-600">{user.email}</p>
          <button 
            onClick={() => navigate('/edit-profile')}
            className="px-3 py-1 mt-2 text-sm text-blue-600 transition-colors rounded-md bg-blue-50 hover:bg-blue-100"
          >
            تعديل الملف الشخصي
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-medium">معلومات المستخدم</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">الاسم الكامل</p>
                <p className="font-medium">{user.nomComplet || `${user.prenom} ${user.nom}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-medium">{user.telephone || 'غير متوفر'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                <p className="font-medium">{formatDate(user.dateNaissance)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">العنوان</p>
                <p className="font-medium">{user.adresse || 'غير متوفر'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-medium">بيانات الحساب</h3>
            <div className="space-y-3">
              {user.role && (
                <div>
                  <p className="text-sm text-gray-500">الدور</p>
                  <div className="mt-1">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">حالة الحساب</p>
                <div className="mt-1">
                  <StatusBadge 
                    status={user.estActive ? 'active' : 'inactive'} 
                    translations={{ 'active': 'نشط', 'inactive': 'متوقف' }} 
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ إنشاء الحساب</p>
                <p className="font-medium">{formatDate(user.dateCreation)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">آخر تسجيل دخول</p>
                <p className="font-medium">{formatDate(user.derniereConnexion)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 mt-8 border-t border-gray-200">
          <h3 className="mb-4 text-lg font-medium">إدارة الحساب</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/edit-profile')}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              تعديل الملف الشخصي
            </button>
            <button 
              onClick={() => navigate('/change-password')}
              className="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
            >
              تغيير كلمة المرور
            </button>
            <button 
              onClick={logout}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
      
      {/* إضافة مكون ErrorModal لعرض الأخطاء */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="خطأ"
        message={error}
      />
    </div>
  );
};

export default UserProfile;