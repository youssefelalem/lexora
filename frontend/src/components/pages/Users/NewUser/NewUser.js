import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../../services/api';
import { 
  ErrorModal, 
  LoadingSpinner, 
  NotificationToast 
} from '../../../../components/common';

const NewUser = () => {
  const navigate = useNavigate();
  
  // حالة بيانات المستخدم الجديد
  const [userData, setUserData] = useState({
    name: '', // الاسم الكامل (سيتم تقسيمه إلى اسم أول واسم أخير في المعالجة)
    email: '',
    password: '',
    confirmPassword: '',
    role: 'avocat', // القيمة الافتراضية: محامي
    telephone: '',
    adresse: '',
    dateNaissance: '',
    estActive: true
  });

  // حالة التحقق من صحة البيانات
  const [errors, setErrors] = useState({});
  
  // حالة تقديم النموذج
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // حالات الإشعارات والأخطاء
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // حالة نافذة الخطأ
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: '',
    message: ''
  });
  
  // التعامل مع تغيير القيم في النموذج
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setUserData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // مسح رسالة الخطأ عند تغيير القيمة
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};
    
    // التحقق من الاسم
    if (!userData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (userData.name.trim().split(' ').length < 2) {
      newErrors.name = 'الرجاء إدخال الاسم الكامل (الاسم الأول واسم العائلة)';
    }
    
    // التحقق من البريد الإلكتروني
    if (!userData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    
    // التحقق من كلمة المرور
    if (!userData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (userData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    
    // التحقق من تأكيد كلمة المرور
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    // التحقق من الدور
    if (!userData.role) {
      newErrors.role = 'الدور مطلوب';
    }
    
    // التحقق من رقم الهاتف
    if (userData.telephone && !/^[0-9+\s()-]{8,15}$/.test(userData.telephone)) {
      newErrors.telephone = 'رقم الهاتف غير صحيح';
    }
    
    // التحقق من تاريخ الميلاد
    if (userData.dateNaissance) {
      const birthDate = new Date(userData.dateNaissance);
      const currentDate = new Date();
      if (birthDate > currentDate) {
        newErrors.dateNaissance = 'تاريخ الميلاد غير صحيح';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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
  
  // معالجة تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!validateForm()) {
      return;
    }
    
    // تعيين حالة التقديم
    setIsSubmitting(true);
    
    try {
      // تحضير بيانات المستخدم للإرسال
      const names = userData.name.trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');
      
      // إعداد كائن البيانات الكامل للمستخدم لإرساله إلى الخادم
      const fullUserData = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        prenom: firstName,
        nom: lastName,
        role: userData.role,
        telephone: userData.telephone || null,
        adresse: userData.adresse || null,
        dateNaissance: userData.dateNaissance || null,
        estActive: userData.estActive
      };
      
      console.log('Sending complete user data to server:', fullUserData);
      
      // استخدام الطريقة الجديدة التي تدعم إرسال البيانات الكاملة للمستخدم
      const response = await userService.createUserWithDetails(fullUserData);
      
      // عرض إشعار نجاح
      showNotification('تم إضافة المستخدم بنجاح');

      // الانتقال إلى صفحة إدارة المستخدمين بعد 1 ثانية
      setTimeout(() => {
        navigate('/users');
      }, 1000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      
      // تعيين رسالة الخطأ
      let errorMessage = 'حدث خطأ أثناء إضافة المستخدم. الرجاء المحاولة مرة أخرى.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      openErrorModal('خطأ في إضافة المستخدم', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
    return roles[role.toLowerCase()] || role;
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* نافذة الخطأ */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
      />
      
      {/* مكون الإشعارات */}
      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
      
      {/* العنوان */}
      <div className="pb-4 mb-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">إضافة مستخدم جديد</h1>
          <button 
            className="flex items-center justify-center px-4 py-2 mt-4 text-gray-700 transition-colors bg-white border border-gray-300 rounded-md sm:mt-0 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            onClick={() => navigate('/users')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1 rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>العودة إلى قائمة المستخدمين</span>
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">أضف مستخدمًا جديدًا للنظام وحدد صلاحياته</p>
      </div>
      
      {/* نموذج إضافة المستخدم */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* قسم البيانات الأساسية */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="mb-4 text-lg font-medium text-gray-800">البيانات الأساسية</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* الاسم */}
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                الاسم الكامل <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="مثال: محمد عبدالله"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                البريد الإلكتروني <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="example@lexora.com"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            {/* كلمة المرور */}
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                كلمة المرور <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="********"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            {/* تأكيد كلمة المرور */}
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                تأكيد كلمة المرور <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* الدور */}
            <div>
              <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">
                الدور <span className="text-red-600">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="administrateur">مدير النظام</option>
                <option value="super_admin">مدير النظام الرئيسي</option>
                <option value="avocat">محامي</option>
                <option value="assistant_juridique">مساعد قانوني</option>
                <option value="comptable">محاسب</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
            
            {/* حالة المستخدم */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="estActive"
                name="estActive"
                checked={userData.estActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="estActive" className="block mr-2 text-sm font-medium text-gray-700">
                المستخدم نشط
              </label>
            </div>
          </div>
        </div>
        
        {/* قسم البيانات الإضافية */}
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="mb-4 text-lg font-medium text-gray-800">البيانات الإضافية (اختيارية)</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* رقم الهاتف */}
            <div>
              <label htmlFor="telephone" className="block mb-1 text-sm font-medium text-gray-700">
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={userData.telephone}
                onChange={handleChange}
                placeholder="+212 6XX XXXXXX"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.telephone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.telephone && (
                <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
              )}
            </div>
            
            {/* تاريخ الميلاد */}
            <div>
              <label htmlFor="dateNaissance" className="block mb-1 text-sm font-medium text-gray-700">
                تاريخ الميلاد
              </label>
              <input
                type="date"
                id="dateNaissance"
                name="dateNaissance"
                value={userData.dateNaissance}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dateNaissance ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.dateNaissance && (
                <p className="mt-1 text-sm text-red-600">{errors.dateNaissance}</p>
              )}
            </div>
            
            {/* العنوان */}
            <div className="sm:col-span-2">
              <label htmlFor="adresse" className="block mb-1 text-sm font-medium text-gray-700">
                العنوان
              </label>
              <textarea
                id="adresse"
                name="adresse"
                value={userData.adresse}
                onChange={handleChange}
                placeholder="أدخل العنوان الكامل"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* أزرار التحكم */}
        <div className="flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            إلغاء
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" color="light" inline={true} />
                <span className="mr-2">جاري الإضافة...</span>
              </div>
            ) : 'إضافة المستخدم'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUser;