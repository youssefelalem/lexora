import axios from 'axios';

// إعداد عميل axios مع الإعدادات الافتراضية
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// اعتراض الطلبات لإضافة رمز المصادقة
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// اعتراض الاستجابات للتعامل مع أخطاء المصادقة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // يمكننا هنا توجيه المستخدم لصفحة تسجيل الدخول إذا لزم الأمر
    }
    return Promise.reject(error);
  }
);

// خدمات المستخدمين
const userService = {
  // الحصول على قائمة المستخدمين
  getAllUsers: () => api.get('/auth/users'),
  
  // الحصول على مستخدم محدد
  getUserById: (id) => api.get(`/auth/users/${id}`),
  
  // إنشاء مستخدم جديد (يستخدم نقطة النهاية الأساسية)
  createUser: (userData) => api.post('/auth/users', userData),
  
  // إنشاء مستخدم جديد مع بيانات كاملة (يستخدم نقطة النهاية الجديدة)
  createUserWithDetails: (userData) => api.post('/auth/register/full', userData),
  
  // تحديث مستخدم
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  
  // تحديث حالة المستخدم (نشط/غير نشط)
  updateUserStatus: (id, active) => api.put(`/auth/users/${id}/status?active=${active}`),
  
  // تغيير كلمة مرور المستخدم
  changePassword: (id, passwordData) => api.put(`/auth/users/${id}/password`, passwordData),
  
  // حذف مستخدم
  deleteUser: (id) => api.delete(`/auth/users/${id}`)
};

// خدمات المصادقة
const authService = {
  // تسجيل الدخول
  login: (credentials) => api.post('/auth/login', credentials),
  
  // تسجيل مستخدم جديد
  register: (userData) => api.post('/auth/register', userData),
  
  // تسجيل الخروج (محليا فقط، لا حاجة لطلب API)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// تصدير الخدمات
export { userService, authService };
export default api;