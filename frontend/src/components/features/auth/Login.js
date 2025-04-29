// استيراد المكتبات الضرورية من React
import React, { useState } from 'react'; // استيراد React و useState للتعامل مع الحالات
import { useNavigate } from 'react-router-dom'; // استيراد useNavigate للتنقل بين الصفحات
import { useAuth } from './AuthContext'; // استيراد سياق المصادقة

// مكون صفحة تسجيل الدخول
const Login = () => {
  // إنشاء حالات لتخزين البريد الإلكتروني وكلمة المرور ورسالة الخطأ
  const [email, setEmail] = useState(''); // حالة للبريد الإلكتروني
  const [password, setPassword] = useState(''); // حالة لكلمة المرور
  const [error, setError] = useState(''); // حالة لرسائل الخطأ
  
  // استخدام سياق المصادقة للوصول إلى دالة تسجيل الدخول
  const { login } = useAuth();
  // استخدام وظيفة التنقل للتوجيه بعد تسجيل الدخول
  const navigate = useNavigate();

  // دالة لمعالجة إرسال نموذج تسجيل الدخول
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع السلوك الافتراضي للنموذج
    setError(''); // إعادة تعيين حالة الخطأ قبل المحاولة
    
    // محاولة تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
    const result = await login(email, password);
    if (result.success) {
      // إذا نجح تسجيل الدخول، انتقل إلى لوحة القيادة
      navigate('/dashboard');
    } else {
      // إذا فشل تسجيل الدخول، اعرض رسالة الخطأ
      setError(result.error);
    }
  };

  // إرجاع واجهة المستخدم لصفحة تسجيل الدخول
  return (
    // حاوية رئيسية تستخدم Tailwind CSS للتنسيق
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* بطاقة تسجيل الدخول */}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* عنوان الصفحة */}
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">تسجيل الدخول</h2>
        
        {/* عرض رسالة الخطأ إذا وجدت */}
        {error && <div className="mb-4 text-center text-red-500">{error}</div>}
        
        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit}>
          {/* حقل إدخال البريد الإلكتروني */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // تحديث حالة البريد الإلكتروني عند التغيير
              required // حقل مطلوب
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* حقل إدخال كلمة المرور */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // تحديث حالة كلمة المرور عند التغيير
              required // حقل مطلوب
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* زر تسجيل الدخول */}
          <button 
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

// تصدير مكون تسجيل الدخول للاستخدام في أماكن أخرى من التطبيق
export default Login;