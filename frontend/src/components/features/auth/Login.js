// استيراد المكتبات الضرورية من React
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// مكون صفحة تسجيل الدخول
const Login = () => {
  // استخدام هوك التنقل من react-router-dom
  const navigate = useNavigate();

  // الوصول إلى سياق المصادقة الذي يوفر وظائف تسجيل الدخول
  const { login } = useAuth();

  // إنشاء حالات لتخزين البيانات المدخلة والحالات
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // دالة لمعالجة تقديم نموذج تسجيل الدخول
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع السلوك الافتراضي للنموذج
    setError(''); // إعادة تعيين رسالة الخطأ
    setLoading(true); // تعيين حالة التحميل إلى true

    try {
      // استدعاء دالة تسجيل الدخول من سياق المصادقة
      const result = await login(email, password, rememberMe);
      
      if (result.success) {
        // إذا تم تسجيل الدخول بنجاح، ينتقل إلى الصفحة الرئيسية
        navigate('/dashboard');
      } else {
        // إذا فشل تسجيل الدخول، يعرض رسالة الخطأ المناسبة
        setError(result.error);
      }
    } catch (err) {
      // في حالة وجود خطأ آخر (مثل مشكلة في الاتصال)
      console.error('Login error:', err);
      setError('حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى لاحقًا.');
    } finally {
      setLoading(false); // إعادة تعيين حالة التحميل
    }
  };

  // إرجاع واجهة المستخدم لصفحة تسجيل الدخول
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="flex flex-row w-full max-w-5xl overflow-hidden shadow-2xl rounded-xl">
        {/* القسم الأيمن - صورة تمثل مكتب المحاماة */}
        <div className="relative hidden p-8 overflow-hidden md:block md:w-1/2 bg-primary-800">
          {/* أنماط زخرفية إضافية */}
          <div className="absolute top-0 bottom-0 left-0 right-0 opacity-10">
            <div className="absolute rounded-full -top-48 -left-48 w-96 h-96 bg-white/30"></div>
            <div className="absolute w-64 h-64 rounded-full top-1/2 -right-24 bg-secondary-500/20"></div>
            <div className="absolute w-64 h-64 rounded-full -bottom-16 -left-16 bg-secondary-500/30"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>              
              <h1 className="flex items-center mb-2 text-4xl font-bold text-white">
                exora<span className="text-secondary-400">L</span>
              </h1>
              <h2 className="text-xl text-white/90">نظام إدارة مكتب المحاماة</h2>
            </div>
            
            <div className="p-5 border rounded-lg bg-white/10 border-white/20">
              <p className="text-white/90">
                "العدالة تحتاج إلى نظام فعّال للتنظيم والإدارة، نظام لكسورا هو بوابتك لذلك"
              </p>
              <p className="mt-2 text-sm text-white/70">- فريق لكسورا</p>
            </div>
          </div>
        </div>

        {/* القسم الأيسر - نموذج تسجيل الدخول */}
        <div className="w-full p-8 bg-white md:w-1/2">
          <div className="max-w-md mx-auto">
            {/* شعار صغير للهواتف المحمولة */}
            <div className="mb-8 text-center md:hidden">              
              <h1 className="flex items-center justify-center text-4xl font-bold text-primary-800">
                exora<span className="text-secondary-500">L</span>
              </h1>
              <p className="mt-1 text-gray-600">نظام إدارة مكتب المحاماة</p>
            </div>
            
            {/* عنوان الصفحة */}
            <h2 className="mb-2 text-2xl font-bold text-gray-800">تسجيل الدخول</h2>
            <p className="mb-8 text-gray-600">أهلاً بعودتك، يرجى إدخال بيانات حسابك</p>
            
            {/* عرض رسالة الخطأ إذا وجدت */}
            {error && (
              <div className="p-4 mb-6 text-red-800 border-r-4 border-red-600 rounded-md bg-red-50">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 ml-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            {/* نموذج تسجيل الدخول */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* حقل البريد الإلكتروني */}
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              {/* حقل كلمة المرور */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    كلمة المرور
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="أدخل كلمة المرور"
                />
              </div>

              {/* خيار "تذكرني" */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="block mr-2 text-sm text-gray-700">
                  تذكرني
                </label>
              </div>

              {/* زر تسجيل الدخول */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="mr-2">جاري تسجيل الدخول...</span>
                    </div>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;