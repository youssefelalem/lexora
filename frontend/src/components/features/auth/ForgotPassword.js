// استيراد المكتبات الضرورية من React
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../../services/api';

// مكون صفحة استرجاع كلمة المرور
const ForgotPassword = () => {
  // إنشاء حالات لتخزين البريد الإلكتروني ورسائل المستخدم
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // دالة لمعالجة إرسال نموذج استرجاع كلمة المرور
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع السلوك الافتراضي للنموذج
    setError(''); // إعادة تعيين رسائل الخطأ
    setSuccess(''); // إعادة تعيين رسائل النجاح
    setLoading(true); // بدء حالة التحميل
      try {      // إرسال طلب استرجاع كلمة المرور باستخدام خدمة المصادقة
      await authService.forgotPassword(email);
      // إظهار رسالة نجاح
      setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      // مسح حقل البريد الإلكتروني بعد النجاح
      setEmail('');
    } catch (err) {
      // إظهار رسالة الخطأ من الخادم إذا كانت موجودة
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        // رسالة خطأ عامة إذا لم يكن هناك رسالة محددة
        setError('حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا.');
      }
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false); // إنهاء حالة التحميل
    }
  };

  // إرجاع واجهة المستخدم لصفحة استرجاع كلمة المرور
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
            <div>              <h1 className="flex items-center mb-2 text-4xl font-bold text-white">
                exora<span className="text-secondary-400">L</span>
              </h1>
              <h2 className="text-xl text-white/90">نظام إدارة مكتب المحاماة</h2>
            </div>
            
            <div className="p-5 border rounded-lg bg-white/10 border-white/20">
              <p className="text-white/90">
                "إعادة تعيين كلمة المرور خطوة ضرورية لضمان الحفاظ على أمان حسابك"
              </p>
              <p className="mt-2 text-sm text-white/70">- فريق الدعم الفني</p>
            </div>
          </div>
        </div>

        {/* القسم الأيسر - نموذج استعادة كلمة المرور */}
        <div className="w-full p-8 bg-white md:w-1/2">
          <div className="max-w-md mx-auto">
            {/* شعار صغير للهواتف المحمولة */}
            <div className="mb-8 text-center md:hidden">              <h1 className="flex items-center justify-center text-4xl font-bold text-primary-800">
                exora<span className="text-secondary-500">L</span>
              </h1>
              <p className="mt-1 text-gray-600">نظام إدارة مكتب المحاماة</p>
            </div>
            
            {/* عنوان الصفحة */}
            <h2 className="mb-2 text-2xl font-bold text-gray-800">استعادة كلمة المرور</h2>
            <p className="mb-8 text-gray-600">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
            
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
            
            {/* عرض رسالة النجاح إذا وجدت */}
            {success && (
              <div className="p-4 mb-6 text-green-800 border-r-4 border-green-600 rounded-md bg-green-50">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 ml-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>{success}</p>
                </div>
              </div>
            )}
            
            {/* نموذج استعادة كلمة المرور */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* حقل إدخال البريد الإلكتروني */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="example@domain.com"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full py-3 font-bold text-white transition duration-300 rounded-lg bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {loading ? (
                  <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "إرسال رابط الاستعادة"}
              </button>
              
              {/* رابط العودة لتسجيل الدخول */}
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  العودة إلى صفحة تسجيل الدخول
                </Link>
              </div>
              
              {/* شعار الأمان */}
              <div className="pt-6 mt-8 text-center border-t border-gray-200">
                <div className="flex items-center justify-center mb-1 text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  الاتصال آمن ومشفر
                </div>
                <div className="text-xs text-gray-500">
                  © {new Date().getFullYear()} Lexora - جميع الحقوق محفوظة
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// تصدير مكون استرجاع كلمة المرور للاستخدام في أماكن أخرى من التطبيق
export default ForgotPassword;
