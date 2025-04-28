import React, { useState } from 'react';
import { useAuth } from '../../../../components/features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../../services/api';

const PasswordRequirement = ({ text, met }) => (
  <div className={`flex items-center ${met ? 'text-green-600' : 'text-gray-600'}`}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`w-4 h-4 ml-1 ${met ? 'text-green-600' : 'text-gray-400'}`}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      {met ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      )}
    </svg>
    <span className="text-sm">{text}</span>
  </div>
);

const ChangePassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    motDePasseActuel: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Password validation states
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false,
  });

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    
    setPasswordRequirements({
      ...passwordRequirements,
      length: password.length >= minLength,
      hasUppercase: hasUpperCase,
      hasLowercase: hasLowerCase,
      hasNumber: hasNumber,
      hasSpecial: hasSpecialChar,
      passwordsMatch: formData.confirmationMotDePasse === password,
    });

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'nouveauMotDePasse') {
        validatePassword(value);
      }
      
      if (name === 'confirmationMotDePasse' || name === 'nouveauMotDePasse') {
        setPasswordRequirements(prev => ({
          ...prev,
          passwordsMatch: 
            (name === 'confirmationMotDePasse' && formData.nouveauMotDePasse === value) ||
            (name === 'nouveauMotDePasse' && formData.confirmationMotDePasse === value)
        }));
      }
      
      return newData;
    });
  };

  const allRequirementsMet = () => {
    return (
      passwordRequirements.length &&
      passwordRequirements.hasUppercase &&
      passwordRequirements.hasLowercase &&
      passwordRequirements.hasNumber &&
      passwordRequirements.hasSpecial &&
      passwordRequirements.passwordsMatch
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.nouveauMotDePasse !== formData.confirmationMotDePasse) {
      setError('كلمات المرور الجديدة غير متطابقة');
      return;
    }
    
    if (!validatePassword(formData.nouveauMotDePasse)) {
      setError('كلمة المرور الجديدة لا تلبي متطلبات الأمان');
      return;
    }
    
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
      
      // Use userService to change password instead of direct axios call
      await userService.changePassword(userId, {
        motDePasseActuel: formData.motDePasseActuel,
        nouveauMotDePasse: formData.nouveauMotDePasse
      });
      
      setSuccess(true);
      // Reset the form
      setFormData({
        motDePasseActuel: '',
        nouveauMotDePasse: '',
        confirmationMotDePasse: '',
      });
      // Reset password requirements
      setPasswordRequirements({
        length: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        passwordsMatch: false,
      });
      
      // Navigate back to profile after successful password change
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('خطأ في تغيير كلمة المرور:', error);
      
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setError('كلمة المرور الحالية غير صحيحة');
        } else if (status === 400 && error.response.data?.message?.includes('password')) {
          setError('كلمة المرور الجديدة لا تلبي متطلبات الأمان');
        } else {
          setError(error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور');
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

  if (!user) {
    return <div className="p-4">جاري تحميل بيانات المستخدم...</div>;
  }

  return (
    <div className="max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">تغيير كلمة المرور</h1>
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          &larr; العودة للملف الشخصي
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 text-green-700 bg-green-100 rounded-md">
            تم تغيير كلمة المرور بنجاح
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">كلمة المرور الحالية</label>
            <input
              type="password"
              name="motDePasseActuel"
              value={formData.motDePasseActuel}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">كلمة المرور الجديدة</label>
            <input
              type="password"
              name="nouveauMotDePasse"
              value={formData.nouveauMotDePasse}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              name="confirmationMotDePasse"
              value={formData.confirmationMotDePasse}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />
          </div>
        </div>
        
        <div className="p-4 rounded-md bg-gray-50">
          <h3 className="mb-2 text-sm font-medium">متطلبات كلمة المرور:</h3>
          <div className="mr-2 space-y-1">
            <PasswordRequirement text="8 أحرف على الأقل" met={passwordRequirements.length} />
            <PasswordRequirement text="حرف كبير واحد على الأقل" met={passwordRequirements.hasUppercase} />
            <PasswordRequirement text="حرف صغير واحد على الأقل" met={passwordRequirements.hasLowercase} />
            <PasswordRequirement text="رقم واحد على الأقل" met={passwordRequirements.hasNumber} />
            <PasswordRequirement text="رمز خاص واحد على الأقل (!@#$...)" met={passwordRequirements.hasSpecial} />
            <PasswordRequirement text="تطابق كلمات المرور" met={passwordRequirements.passwordsMatch} />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3 space-x-reverse">
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
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              (isLoading || !allRequirementsMet()) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isLoading || !allRequirementsMet()}
          >
            {isLoading ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;