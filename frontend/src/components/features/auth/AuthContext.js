import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// تحديد عنوان URL أساسي للAPI - استخدم localhost للتطوير المحلي
const API_BASE_URL = "http://localhost:8080";

// إنشاء سياق المصادقة
const AuthContext = createContext(null);

// توفير سياق المصادقة للمكونات الفرعية
export const AuthProvider = ({ children }) => {
  // حالة لتخزين معلومات المستخدم المسجل الدخول
  const [user, setUser] = useState(null);
  // حالة لإدارة التحميل الأولي لبيانات المستخدم
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود رمز مميز (توكن) في localStorage عند تحميل التطبيق
    const token = localStorage.getItem('token');
    if (token) {
      // إذا كان التوكن موجودًا، يحاول جلب معلومات المستخدم
      axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` } // إرسال التوكن في رأس Authorization
      })
      .then(response => {
        // إذا نجح الطلب، قم بتحديث حالة المستخدم بالبيانات المستلمة
        // الباك إند يرجع الآن كائن المستخدم الكامل
        setUser(response.data);
      })
      .catch(() => {
        // إذا فشل الطلب (توكن غير صالح، إلخ)، قم بإزالة التوكن من localStorage
        localStorage.removeItem('token');
      })
      .finally(() => {
        // في كل الحالات (نجاح أو فشل)، يشير إلى أن التحميل قد انتهى
        setLoading(false);
      });
    } else {
      // إذا لم يكن هناك توكن، يشير إلى أن التحميل قد انتهى
      setLoading(false);
    }
  }, []); // هذا الهوك ينفذ مرة واحدة فقط عند تركيب المكون

  // دالة غير متزامنة للتعامل مع تسجيل دخول المستخدم
  const login = async (email, password) => {
    try {
      // إرسال طلب POST إلى واجهة API للتسجيل الدخول مع البريد الإلكتروني وكلمة المرور
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      // استخراج التوكن ومعلومات المستخدم من الاستجابة
      // الباك إند يرجع الآن كائن مع { token: "...", user: { id: ..., nom: ..., email: ... } }
      const { token, user: userData } = response.data;
      // تخزين التوكن في localStorage للحفاظ على الجلسة
      localStorage.setItem('token', token);
      // تحديث حالة المستخدم بالمعلومات المستلمة من كائن 'user' المتداخل
      setUser(userData);
      // إرجاع كائن يشير إلى نجاح تسجيل الدخول
      return { success: true };
    } catch (error) {
      // إذا حدث خطأ أثناء تسجيل الدخول
      console.error("Login error:", error);
      // الباك إند يرجع الآن الخطأ في { message: "..." }
      return { 
        success: false, 
        error: error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول' 
      };
    }
  };

  // دالة للتعامل مع تسجيل خروج المستخدم
  const logout = () => {
    // إزالة التوكن من localStorage
    localStorage.removeItem('token');
    // إعادة تعيين حالة المستخدم إلى null
    setUser(null);
  };

  // دالة لتحديث بيانات المستخدم في السياق بعد تحديث الملف الشخصي
  const updateUserInContext = (userData) => {
    // التحديث فقط إذا كانت بيانات المستخدم مختلفة عن المستخدم الحالي
    if (JSON.stringify(userData) !== JSON.stringify(user)) {
      setUser(userData);
    }
  };

  // إنشاء كائن القيمة لتمريره إلى السياق
  const value = {
    user,      // المستخدم المسجل الدخول (أو null)
    loading,   // حالة التحميل الأولي
    login,     // دالة تسجيل الدخول
    logout,    // دالة تسجيل الخروج
    updateUserInContext // دالة لتحديث بيانات المستخدم
  };

  // إرجاع مزود السياق مع القيمة المحددة
  // عرض المكونات الفرعية فقط عند انتهاء التحميل الأولي
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// هوك مخصص لاستخدام سياق المصادقة
export const useAuth = () => {
  const context = useContext(AuthContext);
  // التحقق مما إذا كان الهوك يستخدم داخل AuthProvider
  if (!context) {
    throw new Error('يجب استخدام useAuth داخل AuthProvider');
  }
  // إرجاع السياق
  return context;
};