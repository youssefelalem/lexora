// استيراد المكتبات الضرورية من React
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// تحديد عنوان URL أساسي للAPI - استخدم نفس العنوان كما في AuthContext
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                    window.location.hostname === 'localhost' 
                    ? "http://localhost:8080/api" 
                    : `http://${window.location.hostname}/api`;

// مكون صفحة إعادة تعيين كلمة المرور
const ResetPassword = () => {
  // استخدام هوك التنقل
  const navigate = useNavigate();

  // الحصول على رمز إعادة التعيين من معلمات URL
  const { token } = useParams();

  // إنشاء حالات لتخزين البيانات المدخلة والحالات
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);
  
  // حالات التحقق من كلمة المرور
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // حالة لإظهار/إخفاء كلمات المرور
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // تنفيذ عند تحميل المكون للتحقق من صحة الرمز
  useEffect(() => {
    const validateToken = async () => {
      try {
        // إرسال طلب للتحقق من صحة الرمز
        const response = await axios.get(`${API_BASE_URL}/auth/validate-reset-token?token=${token}`);
        setTokenValid(response.data.valid);
      } catch (error) {
        setError('رمز إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.');
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // التحقق من صحة كلمة المرور
  const validatePassword = (password) => {
    // التحقق من طول كلمة المرور
    const lengthValid = password.length >= 8;
    const upperCaseValid = /[A-Z]/.test(password);
    const lowerCaseValid = /[a-z]/.test(password);
    const numberValid = /[0-9]/.test(password);
    
    setIsLengthValid(lengthValid);
    setHasUpperCase(upperCaseValid);
    setHasLowerCase(lowerCaseValid);
    setHasNumber(numberValid);
    setPasswordsMatch(password === confirmPassword && password !== '');
    
    // حساب قوة كلمة المرور
    calculatePasswordStrength(password);
    
    if (!lengthValid) {
      return 'كلمة المرور يجب أن تحتوي على الأقل 8 أحرف';
    }
    
    if (!upperCaseValid || !lowerCaseValid || !numberValid) {
      return 'كلمة المرور يجب أن تحتوي على حرف كبير، وحرف صغير، ورقم واحد على الأقل';
    }
    
    return '';
  };
  
  // حساب قوة كلمة المرور
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 2; // رموز خاصة
    if (password.length >= 16) strength += 1;
    
    // تخفيض القوة للأنماط الشائعة أو السهلة
    if (/^[A-Za-z]+\d+$/.test(password)) strength -= 1; // حروف متبوعة بأرقام فقط
    if (/^[A-Z][a-z]+\d+$/.test(password)) strength -= 1; // كلمة تبدأ بحرف كبير ثم حروف صغيرة وأرقام
    if (/12345|qwerty|password|admin/i.test(password)) strength -= 2; // كلمات مرور شائعة

    // تقييد القيمة بين 0 و 5
    strength = Math.max(0, Math.min(5, strength));
    
    setPasswordStrength(strength);
  };
  
  // التحقق من تطابق كلمتي المرور
  const handleConfirmPasswordChange = (e) => {
    const confirmValue = e.target.value;
    setConfirmPassword(confirmValue);
    setPasswordsMatch(password === confirmValue && confirmValue !== '');
  };
  
  // معالجة تغيير كلمة المرور
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (confirmPassword !== '') {
      setPasswordsMatch(newPassword === confirmPassword && newPassword !== '');
    }
  };
  
  // الحصول على لون قوة كلمة المرور
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // الحصول على نص قوة كلمة المرور
  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'ضعيفة جداً';
    if (passwordStrength <= 2) return 'ضعيفة';
    if (passwordStrength <= 3) return 'متوسطة';
    if (passwordStrength === 4) return 'قوية';
    return 'قوية جداً';
  };

  // دالة لمعالجة تقديم نموذج إعادة تعيين كلمة المرور
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من أن كلمتي المرور متطابقتين
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    
    // التحقق من صحة كلمة المرور
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    // إعادة تعيين الرسائل
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // إرسال طلب إعادة تعيين كلمة المرور
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, password });
      
      // عرض رسالة نجاح
      setSuccess(response.data.message || 'تم إعادة تعيين كلمة المرور بنجاح');
      
      // إعادة تعيين حقول النموذج
      setPassword('');
      setConfirmPassword('');
      setIsLengthValid(false);
      setHasUpperCase(false);
      setHasLowerCase(false);
      setHasNumber(false);
      setPasswordsMatch(false);
      setPasswordStrength(0);
      
      // بعد 3 ثواني، انتقل إلى صفحة تسجيل الدخول
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      
      // عرض رسالة الخطأ من الخادم إذا كانت متاحة
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('حدث خطأ أثناء محاولة إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  // إذا كنا نتحقق من صحة الرمز، عرض مؤشر تحميل
  if (validating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
          <p className="mt-4 text-gray-700">جارِ التحقق من الرمز...</p>
        </div>
      </div>
    );
  }

  // إذا كان الرمز غير صالح، عرض رسالة خطأ
  if (!tokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              رمز غير صالح
            </h2>
            <div className="p-4 mt-6 text-red-800 border-r-4 border-red-600 rounded-md bg-red-50">
              <p>رمز إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.</p>
            </div>
            <div className="mt-6">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                طلب رابط إعادة تعيين جديد؟
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إرجاع واجهة المستخدم لصفحة إعادة تعيين كلمة المرور
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            إعادة تعيين كلمة المرور
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            أدخل كلمة المرور الجديدة لحسابك.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-800 bg-green-100 rounded-md">
              {success}
            </div>
          )}
          
          {/* كلمة المرور الجديدة */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className={`relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  password
                    ? isLengthValid && hasUpperCase && hasLowerCase && hasNumber
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="أدخل كلمة المرور الجديدة"
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 left-0 flex items-center px-3"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                  )}
                </svg>
              </button>
            </div>
            
            {/* مؤشر قوة كلمة المرور */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">قوة كلمة المرور:</span>
                  <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-600' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`} 
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* قائمة شروط كلمة المرور */}
            {password && (
              <div className="mt-2 text-sm">
                <p className={`${isLengthValid ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`mr-1 ${isLengthValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isLengthValid ? '✓' : '✗'}
                  </span>
                  يجب أن تحتوي على الأقل 8 أحرف
                </p>
                <p className={`${hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`mr-1 ${hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                    {hasUpperCase ? '✓' : '✗'}
                  </span>
                  يجب أن تحتوي على حرف كبير واحد على الأقل
                </p>
                <p className={`${hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`mr-1 ${hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                    {hasLowerCase ? '✓' : '✗'}
                  </span>
                  يجب أن تحتوي على حرف صغير واحد على الأقل
                </p>
                <p className={`${hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`mr-1 ${hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                    {hasNumber ? '✓' : '✗'}
                  </span>
                  يجب أن تحتوي على رقم واحد على الأقل
                </p>
                <p className={`${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`mr-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                    {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'}
                  </span>
                  يُفضل استخدام رموز خاصة (مثل @#$%) لتقوية كلمة المرور
                </p>
              </div>
            )}
          </div>
          
          {/* تأكيد كلمة المرور الجديدة */}
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className={`relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  confirmPassword
                    ? passwordsMatch
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 left-0 flex items-center px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                  )}
                </svg>
              </button>
            </div>
            
            {/* رسالة تطابق كلمات المرور */}
            {confirmPassword && (
              <div className="mt-1">
                {passwordsMatch ? (
                  <p className="text-xs text-green-600">✓ كلمات المرور متطابقة</p>
                ) : (
                  <p className="text-xs text-red-600">✗ كلمات المرور غير متطابقة</p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !(isLengthValid && hasUpperCase && hasLowerCase && hasNumber && passwordsMatch)}
              className={`relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group ${
                isLengthValid && hasUpperCase && hasLowerCase && hasNumber && passwordsMatch && !loading
                ? 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                : 'bg-gray-400 cursor-not-allowed'
              } transition-colors duration-200`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري المعالجة...
                </span>
              ) : (
                'إعادة تعيين كلمة المرور'
              )}
            </button>
          </div>
          
          {/* نصائح أمان إضافية */}
          <div className="p-4 border-r-4 border-blue-600 rounded-md bg-blue-50">
            <h3 className="text-sm font-medium text-blue-900">نصائح لكلمة مرور قوية:</h3>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>استخدم كلمة مرور فريدة لكل حساب</li>
              <li>تجنب المعلومات الشخصية مثل تاريخ الميلاد أو الاسم</li>
              <li>استخدم عبارة مرور طويلة يسهل تذكرها</li>
              <li>لا تشارك كلمة المرور مع الآخرين</li>
              <li>فكر في استخدام مدير كلمات المرور</li>
              <li>استخدم رموزاً خاصة مثل @#$%^& لزيادة قوة كلمة المرور</li>
            </ul>
          </div>
          
          <div className="text-center">
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// تصدير المكون للاستخدام في أماكن أخرى من التطبيق
export default ResetPassword;
