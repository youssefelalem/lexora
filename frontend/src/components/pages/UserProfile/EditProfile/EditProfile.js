import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import api, { userService } from '../../../../services/api';

const EditProfile = () => {
  const { user, updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
    dateNaissance: user?.dateNaissance ? user.dateNaissance.substring(0, 10) : '',
    avatar: user?.avatar || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  // Fetch fresh user data from database on component mount
  useEffect(() => {
    let isMounted = true;
    let retryTimeout;
    
    const fetchUserProfile = async () => {
      if (!user) {
        setIsFetchingProfile(false);
        return;
      }
      
      // Always set initial form data from existing user context
      // This ensures we have something to show even if API fails
      if (isMounted && user) {
        setFormData({
          prenom: user.prenom || '',
          nom: user.nom || '',
          email: user.email || '',
          telephone: user.telephone || '',
          adresse: user.adresse || '',
          dateNaissance: user.dateNaissance ? user.dateNaissance.substring(0, 10) : '',
          avatar: user.avatar || ''
        });
      }
      
      // Make sure we have a valid user ID
      const userId = user.idUtilisateur || user.id;
      if (!userId) {
        console.error('No valid user ID found');
        setError('خطأ في بيانات المستخدم');
        setIsFetchingProfile(false);
        return;
      }
      
      setIsFetchingProfile(true);
      try {
        // Log the request details for debugging
        console.log(`Fetching user profile for ID: ${userId}, attempt: ${retryCount + 1}`);
        
        // Use userService instead of direct axios call
        const response = await userService.getUserById(userId);
        
        // Only update state if the component is still mounted
        if (isMounted && response.data) {
          // Set form data from retrieved data
          setFormData({
            prenom: response.data.prenom || user.prenom || '',
            nom: response.data.nom || user.nom || '',
            email: response.data.email || user.email || '',
            telephone: response.data.telephone || user.telephone || '',
            adresse: response.data.adresse || user.adresse || '',
            dateNaissance: response.data.dateNaissance ? response.data.dateNaissance.substring(0, 10) : user.dateNaissance ? user.dateNaissance.substring(0, 10) : '',
            avatar: response.data.avatar || user.avatar || ''
          });
          
          // Clear any previous errors
          setError(null);
          setRetryCount(0);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching user data:', error);
          
          // Handle different error types
          if (error.response) {
            // The server responded with an error status code
            const status = error.response.status;
            if (status === 401) {
              setError('جلسة العمل منتهية. يرجى تسجيل الدخول مرة أخرى.');
              setTimeout(() => navigate('/login'), 2000);
            } else if (status === 404) {
              setError('لم يتم العثور على بيانات المستخدم');
            } else if (status === 500) {
              setError('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً');
              console.error('Server error details:', error.response.data);
              
              // Implement exponential backoff retry for 500 errors (server error)
              if (retryCount < 3 && isMounted) {
                const backoffTime = Math.pow(2, retryCount) * 1000;
                console.log(`Retrying in ${backoffTime}ms...`);
                
                retryTimeout = setTimeout(() => {
                  if (isMounted) {
                    setRetryCount(prev => prev + 1);
                  }
                }, backoffTime);
              }
            } else {
              setError(`خطأ في الاتصال: ${status}`);
            }
          } else if (error.request) {
            // The request was made but no response was received
            setError('لم يتم تلقي استجابة من الخادم. يرجى التحقق من اتصالك بالإنترنت.');
          } else {
            // Something happened in setting up the request
            setError('حدث خطأ أثناء إعداد الطلب');
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
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [user, navigate, retryCount]);

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
      // Make sure we have a valid user ID
      const userId = user.idUtilisateur || user.id;
      if (!userId) {
        setError('خطأ في بيانات المستخدم');
        setIsLoading(false);
        return;
      }
      
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
      
      // Use userService instead of direct axios call
      const response = await userService.updateUser(userId, userData);
      
      if (response.data) {
        // Update user state in AuthContext
        updateUserInContext(response.data);
        setSuccess(true);
        
        // Automatically navigate back to profile after successful update
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setError('جلسة العمل منتهية. يرجى تسجيل الدخول مرة أخرى.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (status === 400) {
          setError(error.response.data?.message || 'بيانات غير صحيحة');
        } else if (status === 500) {
          setError('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً');
          // Don't navigate away, allow user to try again
        } else {
          setError(`خطأ في الاتصال: ${status}`);
        }
      } else if (error.request) {
        setError('لم يتم تلقي استجابة من الخادم. يرجى التحقق من اتصالك بالإنترنت.');
      } else {
        setError('حدث خطأ أثناء إعداد الطلب');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while fetching data, but only on initial load
  if (!user || (isFetchingProfile && retryCount === 0)) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-700">جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  // Continue showing the form with existing user data, even if there's an API error
  return (
    <div className="max-w-3xl p-4 mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">تعديل الملف الشخصي</h1>
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          &larr; العودة للملف الشخصي
        </button>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
          <p className="font-medium">حدث خطأ:</p>
          <p>{error}</p>
          {retryCount > 0 && isFetchingProfile && (
            <p className="mt-2 text-sm">جاري إعادة المحاولة ({retryCount}/3)...</p>
          )}
          {retryCount >= 3 && !isFetchingProfile && (
            <p className="mt-2 text-sm">
              تعذر الاتصال بالخادم. استمر في تعديل الملف الشخصي باستخدام البيانات المتوفرة.
            </p>
          )}
        </div>
      )}
      
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.nomComplet || `${user.prenom} ${user.nom}`}
              className="object-cover w-20 h-20 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/80?text=" + (user.prenom?.charAt(0) || "U");
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-20 h-20 text-3xl font-bold text-white bg-blue-600 rounded-full">
              {user.prenom ? user.prenom.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        <div className="mr-4">
          <h2 className="text-xl font-semibold">{user.prenom} {user.nom}</h2>
          <p className="text-gray-600">{user.email}</p>
          {isFetchingProfile && retryCount > 0 && (
            <span className="inline-block px-2 py-1 mt-1 text-xs text-yellow-800 bg-yellow-100 rounded">جاري التحديث...</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="p-3 text-green-700 bg-green-100 rounded-md">
            تم تحديث الملف الشخصي بنجاح
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">الاسم الأول</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">الاسم الأخير</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
            <p className="mt-1 text-xs text-gray-500">لا يمكن تغيير البريد الإلكتروني</p>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">رقم الهاتف</label>
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
            <label className="block mb-1 text-sm font-medium text-gray-700">تاريخ الميلاد</label>
            <input
              type="date"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">رابط الصورة الشخصية</label>
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
          <label className="block mb-1 text-sm font-medium text-gray-700">العنوان</label>
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
            onClick={() => navigate('/profile')}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
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
    </div>
  );
};

export default EditProfile;