import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ViewUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // حالة بيانات المستخدم
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserById(id);
        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('تعذر العثور على بيانات المستخدم المطلوب');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  // ترجمة الدور إلى العربية
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
    return roles[role?.toLowerCase()] || role;
  };

  // تنسيق التاريخ والوقت
  const formatDate = (dateString, includeTime = true) => {
    if (!dateString) return 'غير محدد';
    
    try {
      // التحقق مما إذا كان التاريخ عبارة عن مصفوفة
      let date;
      if (Array.isArray(dateString)) {
        if (dateString.length >= 3) {
          // [سنة, شهر, يوم, ساعة, دقيقة, ثانية, ...]
          const year = dateString[0];
          const month = dateString[1] - 1; // الشهور في JavaScript تبدأ من 0
          const day = dateString[2];
          
          // إضافة الوقت إذا كان متوفرًا في المصفوفة
          const hour = dateString.length > 3 ? dateString[3] : 0;
          const minute = dateString.length > 4 ? dateString[4] : 0;
          const second = dateString.length > 5 ? dateString[5] : 0;
          
          date = new Date(year, month, day, hour, minute, second);
        } else {
          return 'غير محدد';
        }
      } else {
        // محاولة تحليل التاريخ كسلسلة نصية
        date = new Date(dateString);
      }
      
      // التحقق من صحة التاريخ
      if (isNaN(date.getTime())) return 'غير محدد';
      
      // تنسيق التاريخ بالعربية
      const formattedDate = date.toLocaleDateString('ar-MA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // إضافة الوقت إذا كان مطلوبًا
      if (includeTime) {
        // تنسيق الوقت (الساعة:الدقيقة)
        const formattedTime = date.toLocaleTimeString('ar-MA', {
          hour: '2-digit',
          minute: '2-digit'
        });
        return `${formattedDate} - ${formattedTime}`;
      }
      
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'غير محدد';
    }
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
    return colors[role?.toLowerCase()] || 'bg-gray-600';
  };

  // عرض المؤشر الدوار أثناء التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <span className="mr-3">جاري التحميل...</span>
      </div>
    );
  }

  // عرض رسالة الخطأ
  if (error || !userData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center py-8 text-red-600">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="mb-4 text-xl font-medium">
            {error || 'تعذر العثور على بيانات المستخدم المطلوب'}
          </p>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/users')} 
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              العودة إلى قائمة المستخدمين
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* شريط العنوان مع أزرار العمليات */}
      <div className="flex flex-col pb-4 mb-8 border-b md:flex-row md:items-center md:justify-between">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 md:mb-0">عرض ملف المستخدم</h1>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/users')}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة للقائمة
            </div>
          </button>
          
          <button 
            onClick={() => navigate(`/edit-user/${userData.idUtilisateur || userData.id}`)}
            className="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              تعديل المستخدم
            </div>
          </button>
        </div>
      </div>
      
      {/* معلومات أساسية للمستخدم */}
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0">
          {userData.avatar ? (
            <img 
              src={userData.avatar} 
              alt={`${userData.prenom || ''} ${userData.nom || ''}`}
              className="object-cover w-24 h-24 border-2 border-gray-200 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-24 h-24 rounded-full ${getAvatarColor(userData.role)} flex items-center justify-center text-white text-3xl font-bold ${userData.avatar ? 'hidden' : ''}`}>
            {userData.prenom ? userData.prenom.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        
        <div className="mr-6">
          <h2 className="text-2xl font-bold">{userData.prenom} {userData.nom}</h2>
          <p className="text-gray-600">{userData.email}</p>
          <div className="flex mt-2">
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${
              userData.estActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <span className={`inline-block h-2 w-2 rounded-full ${
                userData.estActive ? 'bg-green-500' : 'bg-red-500'
              } mt-1 ml-1`}></span>
              {userData.estActive ? 'نشط' : 'غير نشط'}
            </span>
            
            <span className="inline-flex px-3 py-1 mr-2 text-sm font-medium leading-5 text-blue-800 bg-blue-100 rounded-full">
              {translateRole(userData.role)}
            </span>
          </div>
        </div>
      </div>
      
      {/* كروت المعلومات التفصيلية */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* معلومات شخصية */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="pb-2 mb-6 text-lg font-medium text-gray-800 border-b">المعلومات الشخصية</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">الاسم الكامل</span>
              <span className="font-medium">{userData.prenom} {userData.nom}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">البريد الإلكتروني</span>
              <span className="font-medium">{userData.email}</span>
            </div>
            
            {userData.telephone && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">رقم الهاتف</span>
                <span className="font-medium">{userData.telephone}</span>
              </div>
            )}
            
            {userData.dateNaissance && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">تاريخ الميلاد</span>
                <span className="font-medium">{formatDate(userData.dateNaissance)}</span>
              </div>
            )}
            
            {userData.adresse && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">العنوان</span>
                <span className="font-medium">{userData.adresse}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* معلومات الحساب */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="pb-2 mb-6 text-lg font-medium text-gray-800 border-b">معلومات الحساب</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">معرف المستخدم</span>
              <span className="font-medium">#{userData.idUtilisateur || userData.id}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">الدور</span>
              <span className="font-medium">{translateRole(userData.role)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">حالة الحساب</span>
              <div className="flex items-center">
                <span className={`inline-block h-3 w-3 rounded-full ${userData.estActive ? 'bg-green-500' : 'bg-red-500'} ml-2`}></span>
                <span className="font-medium">{userData.estActive ? 'نشط' : 'غير نشط'}</span>
              </div>
            </div>
            
            {/* تاريخ إنشاء الحساب - تحسين طريقة العرض */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">تاريخ إنشاء الحساب</span>
              <span className="font-medium">
                {formatDate(userData.dateCreation)}
              </span>
            </div>
            
            {/* آخر تسجيل دخول - تحسين طريقة العرض */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">آخر تسجيل دخول</span>
              <span className="font-medium">
                {formatDate(userData.derniereConnexion)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* إحصائيات المستخدم (إذا كانت متوفرة) */}
      {userData.statistiques && (
        <div className="p-6 mt-6 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="pb-2 mb-6 text-lg font-medium text-gray-800 border-b">إحصائيات المستخدم</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {userData.statistiques.nombreDossiers !== undefined && (
              <div className="p-4 bg-white border border-gray-100 rounded shadow-sm">
                <div className="mb-1 text-sm text-gray-500">عدد الملفات</div>
                <div className="text-xl font-bold">{userData.statistiques.nombreDossiers}</div>
              </div>
            )}
            
            {userData.statistiques.nombreClients !== undefined && (
              <div className="p-4 bg-white border border-gray-100 rounded shadow-sm">
                <div className="mb-1 text-sm text-gray-500">عدد العملاء</div>
                <div className="text-xl font-bold">{userData.statistiques.nombreClients}</div>
              </div>
            )}
            
            {userData.statistiques.nombreDocuments !== undefined && (
              <div className="p-4 bg-white border border-gray-100 rounded shadow-sm">
                <div className="mb-1 text-sm text-gray-500">عدد المستندات</div>
                <div className="text-xl font-bold">{userData.statistiques.nombreDocuments}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUserProfile;