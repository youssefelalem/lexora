import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  // استخدام معلومات المستخدم الحالي من سياق المصادقة
  const { user } = useAuth();
  const navigate = useNavigate();

  // إنشاء حالات لتخزين البيانات وحالة النموذج
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // حالات التحقق من كلمة المرور
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  
  // حالة لتقييم قوة كلمة المرور
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // حالة لإظهار/إخفاء كلمات المرور
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // التحقق من كلمة المرور عند تغييرها
  const validatePassword = (password) => {
    setIsLengthValid(password.length >= 8);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    
    // حساب قوة كلمة المرور
    calculatePasswordStrength(password);
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
  const checkPasswordsMatch = () => {
    setPasswordsMatch(newPassword === confirmPassword && newPassword !== '');
  };

  // معالجة تغيير كلمة المرور الجديدة
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
    // إذا كان هناك قيمة بالفعل في حقل تأكيد كلمة المرور، تحقق من التطابق
    if (confirmPassword !== '') {
      setPasswordsMatch(password === confirmPassword && password !== '');
    }
  };

  // معالجة تغيير تأكيد كلمة المرور
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === newPassword && e.target.value !== '');
  };

  // التحقق من صحة النموذج
  const isFormValid = () => {
    return (
      oldPassword !== '' &&
      isLengthValid &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      passwordsMatch
    );
  };

  // معالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من صحة النموذج قبل الإرسال
    if (!isFormValid()) {
      setError('يرجى تعبئة جميع الحقول بشكل صحيح');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.changePassword(user.id, {
        oldPassword,
        newPassword
      });

      // تنظيف النموذج وعرض رسالة نجاح
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('تم تغيير كلمة المرور بنجاح');
      
      // إعادة تعيين حالة التحقق من كلمة المرور
      setIsLengthValid(false);
      setHasUpperCase(false);
      setHasLowerCase(false);
      setHasNumber(false);
      setPasswordsMatch(false);
      setPasswordStrength(0);
      
      // إعادة تعيين حالة إظهار كلمات المرور
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      
      // إخفاء رسالة النجاح بعد 5 ثوانٍ
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">تغيير كلمة المرور</h2>
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          &larr; العودة للملف الشخصي
        </button>
      </div>
      
      {/* عرض رسائل الخطأ والنجاح */}
      {error && (
        <div className="p-4 mb-4 border-r-4 border-red-600 rounded-md bg-red-50">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 border-r-4 border-green-600 rounded-md bg-green-50">
          <p className="text-green-600">{success}</p>
        </div>
      )}
      
      {/* نموذج تغيير كلمة المرور */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* كلمة المرور الحالية */}
        <div>
          <label htmlFor="oldPassword" className="block mb-1 text-sm font-medium text-gray-700">
            كلمة المرور الحالية <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="أدخل كلمة المرور الحالية"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 left-0 flex items-center px-3"
              onClick={() => setShowOldPassword(!showOldPassword)}
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
                {showOldPassword ? (
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
        </div>
        
        {/* كلمة المرور الجديدة */}
        <div>
          <label htmlFor="newPassword" className="block mb-1 text-sm font-medium text-gray-700">
            كلمة المرور الجديدة <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={handleNewPasswordChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                newPassword
                  ? isLengthValid && hasUpperCase && hasLowerCase && hasNumber
                    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                    : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="أدخل كلمة المرور الجديدة"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 left-0 flex items-center px-3"
              onClick={() => setShowNewPassword(!showNewPassword)}
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
                {showNewPassword ? (
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
          {newPassword && (
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
          {newPassword && (
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
              <p className={`${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                <span className={`mr-1 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  {/[^A-Za-z0-9]/.test(newPassword) ? '✓' : '○'}
                </span>
                يُفضل استخدام رموز خاصة (مثل @#$%) لتقوية كلمة المرور
              </p>
            </div>
          )}
        </div>
        
        {/* تأكيد كلمة المرور الجديدة */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
            تأكيد كلمة المرور الجديدة <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={checkPasswordsMatch}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                confirmPassword
                  ? passwordsMatch
                    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                    : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder="أكد كلمة المرور الجديدة"
              required
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
          
          {/* رسالة التحقق من تطابق كلمات المرور */}
          {confirmPassword && !passwordsMatch && (
            <p className="mt-1 text-sm text-red-600">كلمات المرور غير متطابقة</p>
          )}
        </div>
        
        {/* زر تغيير كلمة المرور */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isFormValid() && !loading
                ? 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                : 'bg-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>جاري المعالجة...</span>
              </div>
            ) : (
              'تغيير كلمة المرور'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
