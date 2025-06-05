import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// تحديد عنوان URL أساسي للAPI - استخدم localhost للتطوير المحلي
const API_BASE_URL = "http://localhost:8080";

// التعريف بالأدوار المتاحة في النظام
export const ROLES = {
  ADMIN: 'ROLE_ADMIN',                    // مدير النظام
  AVOCAT: 'ROLE_AVOCAT',                  // محامي
  SECRETAIRE: 'ROLE_SECRETAIRE'           // مساعد قانوني (يُعرف أيضاً كسكرتير)
};

// إنشاء سياق المصادقة
const AuthContext = createContext(null);

// توفير سياق المصادقة للمكونات الفرعية
export const AuthProvider = ({ children }) => {
  // حالة لتخزين معلومات المستخدم المسجل الدخول
  const [user, setUser] = useState(null);
  // حالة لإدارة التحميل الأولي لبيانات المستخدم
  const [loading, setLoading] = useState(true);  useEffect(() => {
    // التحقق من وجود رمز مميز (توكن) إما في localStorage أو sessionStorage
    const authToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (authToken) {
      // إذا كان التوكن موجودًا، يحاول جلب معلومات المستخدم
      axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` } // إرسال التوكن في رأس Authorization
      })
      .then(response => {
        console.log("Auth check response:", response.data);
        
        // معالجة البيانات المستلمة وتحويل الدور إلى مصفوفة إذا لم يكن كذلك
        const userData = response.data;
          // إذا كان هناك دور واحد (string) بدلاً من مصفوفة من الأدوار، قم بتحويله
        if (userData) {
          // نتأكد أن لدينا مصفوفة roles حتى إذا كان هناك فقط خاصية role
          if (!userData.roles) {
            userData.roles = userData.role ? [userData.role] : [];
            console.log("Converted single role to array:", userData.roles);
          }
          
          // نضيف مباشرة روابط تصحيحية بين الأدوار في الباك إند والأدوار في الفرونت إند
          if (userData.role === 'ADMINISTRATEUR' && !userData.roles.includes('ROLE_ADMIN')) {
            userData.roles.push('ROLE_ADMIN');
          }
          if (userData.role === 'AVOCAT' && !userData.roles.includes('ROLE_AVOCAT')) {
            userData.roles.push('ROLE_AVOCAT');
          }
          if (userData.role === 'ASSISTANT_JURIDIQUE' && !userData.roles.includes('ROLE_SECRETAIRE')) {
            userData.roles.push('ROLE_SECRETAIRE');
          }
          
          console.log("Enhanced user data:", userData);
        }
        
        // إذا نجح الطلب، قم بتحديث حالة المستخدم بالبيانات المستلمة
        setUser(userData);
      })
      .catch((error) => {
        // إذا فشل الطلب (توكن غير صالح، إلخ)
        console.error('Auth check failed:', error);
        
        // إزالة التوكن من كلا المخزنين
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
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
  const login = async (email, password, rememberMe = false) => {
    try {
      // إرسال طلب POST إلى واجهة API للتسجيل الدخول مع البريد الإلكتروني وكلمة المرور
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
        rememberMe
      });
      // استخراج التوكن ومعلومات المستخدم من الاستجابة
      const { token, user: userData } = response.data;

      // تخزين التوكن بناءً على خيار "تذكرني"
      if (rememberMe) {
        localStorage.setItem('token', token); // يبقى حتى بعد إغلاق المتصفح
      } else {
        sessionStorage.setItem('token', token); // يتم حذفه عند إغلاق المتصفح
      }
        // تأكد من وجود مصفوفة الأدوار وتحويل الدور الوحيد إلى مصفوفة مع إضافة الروابط بين الأدوار
      if (userData) {
        // نتأكد أن لدينا مصفوفة roles حتى إذا كان هناك فقط خاصية role
        if (!userData.roles) {
          userData.roles = userData.role ? [userData.role] : [];
          console.log("Converting single role to array:", userData.role);
        }
        
        // نضيف مباشرة روابط تصحيحية بين الأدوار في الباك إند والأدوار في الفرونت إند
        if (userData.role === 'ADMINISTRATEUR' && !userData.roles.includes('ROLE_ADMIN')) {
          userData.roles.push('ROLE_ADMIN');
        }
        if (userData.role === 'AVOCAT' && !userData.roles.includes('ROLE_AVOCAT')) {
          userData.roles.push('ROLE_AVOCAT');
        }
        if (userData.role === 'ASSISTANT_JURIDIQUE' && !userData.roles.includes('ROLE_SECRETAIRE')) {
          userData.roles.push('ROLE_SECRETAIRE');
        }
      }
        // تسجيل بيانات المستخدم للمساعدة في تصحيح الأخطاء
      console.log("User data from login:", userData);
      
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
  const logout = async () => {
    try {
      // محاولة إرسال طلب تسجيل الخروج إلى الخادم (اختياري)
      const authToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (authToken) {
        await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // حتى إذا فشل طلب تسجيل الخروج، نستمر في تسجيل الخروج محليًا
    } finally {
      // إزالة التوكن من كلا المخزنين
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      // إعادة تعيين حالة المستخدم إلى null
      setUser(null);
    }
  };

  // دالة لتحديث بيانات المستخدم في السياق بعد تحديث الملف الشخصي
  const updateUserInContext = (userData) => {
    // التحديث فقط إذا كانت بيانات المستخدم مختلفة عن المستخدم الحالي
    if (JSON.stringify(userData) !== JSON.stringify(user)) {
      setUser(userData);
    }
  };  // دالة محسّنة للتحقق مما إذا كان المستخدم لديه دور معين
  const hasRole = (role) => {
    if (!user) return false;
    
    // التعامل مع الحالة التي يكون فيها role هو string وليس مصفوفة roles
    const userRoles = user.roles || (user.role ? [user.role] : []);
    
    console.log("Checking role:", role, "User roles:", userRoles);
    
    // التحقق المرن من الأدوار عن طريق دعم أنماط التسمية المختلفة
    return userRoles.some(userRole => {
      // حالة 1: تطابق دقيق (كما كان من قبل)
      if (userRole === role) return true;
      
      // حالة 2: تحويل ROLE_ADMIN إلى ADMIN للمقارنة مع ADMINISTRATEUR
      const normalizedRole = role.replace('ROLE_', '').toUpperCase();
        // حالة 3: تحويل ADMINISTRATEUR إلى ADMIN، AVOCAT إلى AVOCAT للمقارنة مع ROLE_ADMIN, ROLE_AVOCAT
      let normalizedUserRole;
      if (userRole === 'ADMINISTRATEUR') {
        normalizedUserRole = 'ADMIN';
      } else if (userRole === 'ASSISTANT_JURIDIQUE') {
        normalizedUserRole = 'SECRETAIRE';
      } else {
        normalizedUserRole = userRole.toUpperCase();
      }
      
      // حالة 4: تحويل أسماء الأدوار من الباك إند إلى أسماء الرولز في الفرونت إند
      const roleMapping = {
        'ADMINISTRATEUR': 'ROLE_ADMIN',
        'AVOCAT': 'ROLE_AVOCAT',
        'ASSISTANT_JURIDIQUE': 'ROLE_SECRETAIRE'
      };
      
      const mappedUserRole = roleMapping[userRole];
      
      return normalizedUserRole === normalizedRole || (mappedUserRole && mappedUserRole === role);
    });
  };
  // دالة محسّنة للتحقق مما إذا كان المستخدم لديه أي من الأدوار المحددة
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.some(role => hasRole(role));
  };  // تحديد الأدوار المباشرة استناداً إلى دور المستخدم من الباك إند
  const directRoleCheck = (role) => {
    if (!user) return false;
    
    if (role === ROLES.ADMIN) {
      return user.role === 'ADMINISTRATEUR' || 
             (user.roles && (user.roles.includes(ROLES.ADMIN) || user.roles.includes('ADMINISTRATEUR')));
    }
    
    if (role === ROLES.AVOCAT) {
      return user.role === 'AVOCAT' || 
             (user.roles && (user.roles.includes(ROLES.AVOCAT) || user.roles.includes('AVOCAT')));
    }
    
    if (role === ROLES.SECRETAIRE) {
      return user.role === 'ASSISTANT_JURIDIQUE' || 
             (user.roles && (user.roles.includes(ROLES.SECRETAIRE) || user.roles.includes('ASSISTANT_JURIDIQUE')));
    }
    
    return hasRole(role);
  };
  
  // إنشاء كائن القيمة لتمريره إلى السياق
  const value = {
    user,                // المستخدم المسجل الدخول (أو null)
    loading,             // حالة التحميل الأولي
    login,               // دالة تسجيل الدخول
    logout,              // دالة تسجيل الخروج
    updateUserInContext, // دالة لتحديث بيانات المستخدم
    hasRole: directRoleCheck, // استخدام الدالة المباشرة بدلاً من hasRole
    hasAnyRole,          // دالة للتحقق من أي من الأدوار المحددة (محسّنة)
    isAdmin: user?.role === 'ADMINISTRATEUR',    // مباشرة - هل المستخدم مشرف
    isAvocat: user?.role === 'AVOCAT',           // مباشرة - هل المستخدم محامي
    isSecretaire: user?.role === 'ASSISTANT_JURIDIQUE' // مباشرة - هل المستخدم سكرتير
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