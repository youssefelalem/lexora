// استيراد المكتبات الضرورية من React
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// تحديد عنوان URL أساسي للAPI - استخدم نفس العنوان كما في AuthContext
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                    window.location.hostname === 'localhost' 
                    ? "http://localhost:8080/api" 
                    : `http://${window.location.hostname}/api`;

// مكون صفحة تسجيل مستخدم جديد
const Register = () => {
  // استخدام هوك التنقل
  const navigate = useNavigate();

  // إنشاء حالات لتخزين البيانات المدخلة والحالات
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // دالة للتعامل مع تغيير حقول النموذج
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // إزالة رسالة الخطأ عند تغيير الحقل
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // دالة للتحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // دالة للتحقق من صحة رقم الهاتف
  const validatePhone = (phone) => {
    // تسمح بصيغ هاتف متعددة، لكن تتطلب على الأقل 8 أرقام
    const phoneRegex = /^[+]?[0-9\s-]{8,15}$/;
    return !phone || phoneRegex.test(phone);
  };

  // دالة للتحقق من صحة كلمة المرور
  const validatePassword = (password) => {
    // كلمة المرور يجب أن تحتوي على الأقل 8 أحرف
    if (password.length < 8) {
      return false;
    }
    
    // كلمة المرور يجب أن تحتوي على حرف كبير، وحرف صغير، ورقم واحد على الأقل
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber;
  };

  // دالة للتحقق من صحة النموذج بأكمله
  const validateForm = () => {
    const newErrors = {};
    
    // التحقق من الاسم الأول
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'الاسم الأول مطلوب';
    }
    
    // التحقق من اسم العائلة
    if (!formData.nom.trim()) {
      newErrors.nom = 'اسم العائلة مطلوب';
    }
    
    // التحقق من البريد الإلكتروني
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'الرجاء إدخال بريد إلكتروني صالح';
    }
    
    // التحقق من رقم الهاتف (إذا تم إدخاله)
    if (formData.telephone && !validatePhone(formData.telephone)) {
      newErrors.telephone = 'الرجاء إدخال رقم هاتف صالح';
    }
    
    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على الأقل 8 أحرف، وتتضمن حرفًا كبيرًا، وحرفًا صغيرًا، ورقمًا واحدًا على الأقل';
    }
    
    // التحقق من تطابق كلمتي المرور
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }
    
    // تحديث حالة الأخطاء
    setErrors(newErrors);
    
    // إرجاع ما إذا كان النموذج صالحًا أم لا
    return Object.keys(newErrors).length === 0;
  };

  // دالة لمعالجة تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من صحة النموذج
    if (!validateForm()) {
      return;
    }
    
    // إعادة تعيين الرسائل
    setGeneralError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // إعداد البيانات للإرسال
      const userData = {
        name: `${formData.prenom} ${formData.nom}`, // دمج الاسم الأول واسم العائلة
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone || undefined, // إرسال الهاتف فقط إذا كان موجودًا
      };
      
      // إرسال طلب التسجيل
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      // عرض رسالة نجاح
      setSuccess('تم إنشاء الحساب بنجاح! سيتم توجيهك لتسجيل الدخول.');
      
      // إعادة تعيين النموذج
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        password: '',
        confirmPassword: '',
      });
      
      // بعد 3 ثواني، انتقل إلى صفحة تسجيل الدخول
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // عرض رسالة الخطأ من الخادم إذا كانت متاحة
      if (error.response && error.response.data && error.response.data.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  // إرجاع واجهة المستخدم لصفحة التسجيل
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 py-12">
      <div className="flex flex-row w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl">
        {/* القسم الأيمن - صورة تمثل مكتب المحاماة */}
        <div className="hidden md:block md:w-1/2 bg-primary-800 p-8 relative overflow-hidden">
          {/* أنماط زخرفية إضافية */}
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
            <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-white/30"></div>
            <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-secondary-500/20"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-secondary-500/30"></div>
          </div>
          
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="text-secondary-400">L</span>exora
              </h1>
              <h2 className="text-xl text-white/90">نظام إدارة مكتب المحاماة</h2>
            </div>
            
            <div className="bg-white/10 p-5 rounded-lg border border-white/20">
              <p className="text-white/90">
                "انضم إلى نظام لكسورا لإدارة مكتب المحاماة الخاص بك بكفاءة وفعالية. نحن نوفر لك أدوات متكاملة لمتابعة القضايا، والعملاء، والمواعيد، والفواتير."
              </p>
              <p className="text-white/70 mt-2 text-sm">- فريق لكسورا</p>
            </div>
          </div>
        </div>
        
        {/* القسم الأيسر - نموذج التسجيل */}
        <div className="w-full md:w-1/2 bg-white p-8 overflow-y-auto max-h-screen">
          <div className="mx-auto max-w-md">
            {/* شعار صغير للهواتف المحمولة */}
            <div className="md:hidden mb-6 text-center">
              <h1 className="text-3xl font-bold text-primary-800 flex items-center justify-center">
                <span className="text-secondary-500">L</span>exora
              </h1>
              <p className="text-gray-600 mt-1">نظام إدارة مكتب المحاماة</p>
            </div>
            
            {/* عنوان الصفحة */}
            <h2 className="text-2xl font-bold mb-2 text-gray-800">إنشاء حساب جديد</h2>
            <p className="text-gray-600 mb-6">أدخل بياناتك لإنشاء حساب في نظام لكسورا</p>
            
            {/* عرض رسالة الخطأ العامة إذا وجدت */}
            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-600 text-red-800 rounded-md">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{generalError}</p>
                </div>
              </div>
            )}
            
            {/* عرض رسالة النجاح إذا وجدت */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-r-4 border-green-600 text-green-800 rounded-md">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>{success}</p>
                </div>
              </div>
            )}
            
            {/* نموذج التسجيل */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* الصف الأول - الاسم الأول واسم العائلة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الأول <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.prenom ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="الاسم الأول"
                  />
                  {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
                </div>
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم العائلة <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.nom ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="اسم العائلة"
                  />
                  {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="أدخل بريدك الإلكتروني"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* رقم الهاتف */}
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.telephone ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="أدخل رقم هاتفك"
                />
                {errors.telephone && <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>}
              </div>

              {/* كلمة المرور */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور <span className="text-red-600">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="أدخل كلمة المرور"
                />
                {errors.password ? (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    كلمة المرور يجب أن تحتوي على الأقل 8 أحرف، وتتضمن حرفًا كبيرًا، وحرفًا صغيرًا، ورقمًا واحدًا على الأقل.
                  </p>
                )}
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  تأكيد كلمة المرور <span className="text-red-600">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="أعد إدخال كلمة المرور"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* زر التسجيل */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="mr-2">جاري إنشاء الحساب...</span>
                    </div>
                  ) : (
                    'إنشاء الحساب'
                  )}
                </button>
              </div>

              {/* رابط العودة لتسجيل الدخول */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  لديك حساب بالفعل؟{' '}
                  <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// تصدير المكون للاستخدام في أماكن أخرى من التطبيق
export default Register;
