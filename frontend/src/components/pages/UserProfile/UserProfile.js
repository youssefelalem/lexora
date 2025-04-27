import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout, updateUserInContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    avatar: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch fresh user data from database on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserProfile = async () => {
      if (!user || !user.idUtilisateur && !user.id) return;
      
      setIsFetchingProfile(true);
      try {
        const response = await axios({
          method: 'GET',
          url: `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/auth/utilisateurs/${user.idUtilisateur || user.id}`,
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Only update state if the component is still mounted
        if (isMounted) {
          console.log('Fresh user data loaded from database:', response.data);
          
          // Update user context with fresh data
          updateUserInContext(response.data);
          
          // Set form data from retrieved data
          setFormData({
            prenom: response.data.prenom || '',
            nom: response.data.nom || '',
            email: response.data.email || '',
            telephone: response.data.telephone || '',
            adresse: response.data.adresse || '',
            dateNaissance: response.data.dateNaissance ? response.data.dateNaissance.substring(0, 10) : '',
            avatar: response.data.avatar || ''
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching user data:', error);
          if (error.response && error.response.status === 401) {
            logout();
          }
          setError('فشل في تحميل بيانات الملف الشخصي');
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
  // Only depend on user.id or user.idUtilisateur, not the entire user object
  }, [user?.idUtilisateur || user?.id, logout]);

  // Translate user roles to Arabic
  const translateRole = (role) => {
    const roles = {
      'SUPER_ADMIN': 'مدير النظام الرئيسي',
      'ADMINISTRATEUR': 'مدير النظام',
      'AVOCAT': 'محامي',
      'ASSISTANT_JURIDIQUE': 'مساعد قانوني',
      'COMPTABLE': 'محاسب',
      'ASSISTANT_ADMIN': 'مساعد إداري',
      'INVITE': 'ضيف'
    };
    return roles[role] || role;
  };

  // Format date for readability
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-MA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Prepare data for submission
      const userData = {
        prenom: formData.prenom.trim() || null,
        nom: formData.nom.trim() || null,
        telephone: formData.telephone.trim() || null,
        adresse: formData.adresse.trim() || null,
        avatar: formData.avatar.trim() || null
      };
      
      // Special handling for date
      if (formData.dateNaissance && formData.dateNaissance.trim() !== '') {
        userData.dateNaissance = formData.dateNaissance;
      }
      
      console.log('Data to be sent:', userData);
      
      const response = await axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/auth/utilisateurs/${user.idUtilisateur || user.id}`,
        data: userData,
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        // Update user state in AuthContext
        updateUserInContext(response.data);
        setSuccess(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      let errorMsg = 'حدث خطأ أثناء تحديث الملف الشخصي';
      
      if (error.response) {
        errorMsg = error.response.data?.message || 
                  `خطأ من الخادم (${error.response.status}): ${error.response.statusText}`;
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while fetching data
  if (!user || isFetchingProfile) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-700">جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">الملف الشخصي</h1>
      
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.nomComplet || `${user.prenom} ${user.nom}`}
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/80?text=" + (user.prenom?.charAt(0) || "U");
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.prenom ? user.prenom.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        <div className="mr-4">
          <h2 className="text-xl font-semibold">{user.prenom} {user.nom}</h2>
          <p className="text-gray-600">{user.email}</p>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-2 py-1 px-3 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors"
            >
              تعديل الملف الشخصي
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              تم تحديث الملف الشخصي بنجاح
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأخير</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+212 6XX XXX XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
              <input
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة الشخصية</label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">معلومات المستخدم</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">الاسم الكامل</p>
                  <p className="font-medium">{user.prenom} {user.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.telephone && (
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-medium">{user.telephone}</p>
                  </div>
                )}
                {user.dateNaissance && (
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                    <p className="font-medium">{formatDate(user.dateNaissance)}</p>
                  </div>
                )}
                {user.adresse && (
                  <div>
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="font-medium">{user.adresse}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">بيانات الحساب</h3>
              <div className="space-y-3">
                {user.role && (
                  <div>
                    <p className="text-sm text-gray-500">الدور</p>
                    <p className="font-medium">{translateRole(user.role)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">حالة الحساب</p>
                  <p className="font-medium flex items-center">
                    <span className={`inline-block h-3 w-3 rounded-full ${user.estActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    {user.estActive ? 'نشط' : 'متوقف'}
                  </p>
                </div>
                {user.dateCreation && (
                  <div>
                    <p className="text-sm text-gray-500">تاريخ إنشاء الحساب</p>
                    <p className="font-medium">{formatDate(user.dateCreation)}</p>
                  </div>
                )}
                {user.derniereConnexion && (
                  <div>
                    <p className="text-sm text-gray-500">آخر تسجيل دخول</p>
                    <p className="font-medium">{formatDate(user.derniereConnexion)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">إدارة الحساب</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                تعديل الملف الشخصي
              </button>
              <button 
                onClick={() => navigate('/change-password')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                تغيير كلمة المرور
              </button>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;