import React, { useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import axios from 'axios';

const UserProfile = () => {
  const { user, logout, updateUserInContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    // Add more fields as needed
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      // Make API call to update user profile
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/users/${user.id}`, 
        formData,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Update user state in AuthContext
        updateUserInContext(response.data);
        setSuccess(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="p-4">جاري تحميل بيانات المستخدم...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">الملف الشخصي</h1>
      
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {user.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        <div className="mr-4">
          <h2 className="text-xl font-semibold">{user.nom}</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
            </div>
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
                  <p className="text-sm text-gray-500">الاسم</p>
                  <p className="font-medium">{user.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {/* Add more user information as needed */}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">بيانات الحساب</h3>
              <div className="space-y-3">
                {user.role && (
                  <div>
                    <p className="text-sm text-gray-500">الدور</p>
                    <p className="font-medium">{user.role}</p>
                  </div>
                )}
                {/* Add more user account information as needed */}
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">إدارة الحساب</h3>
            <div className="flex space-x-3 space-x-reverse">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                تعديل الملف الشخصي
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