import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ErrorModal, 
  LoadingSpinner, 
  NotificationToast 
} from '../../../../components/common';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    estActive: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // حالات الإشعارات والأخطاء
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // حالة نافذة الخطأ
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  // جلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.getUserById(id);
        if (response.data) {
          setUser(response.data);
          
          // تعبئة نموذج التعديل بالبيانات الحالية للمستخدم
          setFormData({
            prenom: response.data.prenom || '',
            nom: response.data.nom || '',
            email: response.data.email || '',
            role: response.data.role || '',
            telephone: response.data.telephone || '',
            adresse: response.data.adresse || '',
            dateNaissance: response.data.dateNaissance ? response.data.dateNaissance.substring(0, 10) : '',
            estActive: response.data.estActive !== undefined ? response.data.estActive : true
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        openErrorModal('خطأ في العملية', 'تعذر جلب بيانات المستخدم. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  // معالجة تغييرات الحقول
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  // معالجة تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // التحقق من صحة البيانات
      if (!formData.role || formData.role.trim() === '') {
        openErrorModal('خطأ في البيانات', 'يرجى اختيار دور للمستخدم');
        setSaving(false);
        return;
      }

      // تحضير البيانات للإرسال
      const userData = {
        prenom: formData.prenom.trim() || null,
        nom: formData.nom.trim() || null,
        email: formData.email.trim(),
        role: formData.role,
        telephone: formData.telephone.trim() || null,
        adresse: formData.adresse.trim() || null,
        estActive: formData.estActive
      };

      // معالجة خاصة للتاريخ
      if (formData.dateNaissance && formData.dateNaissance.trim() !== '') {
        userData.dateNaissance = formData.dateNaissance;
      }

      // استدعاء واجهة برمجة التطبيقات لتحديث المستخدم
      const response = await userService.updateUser(id, userData);
      
      if (response.data) {
        setUser(response.data);
        showNotification('تم تحديث بيانات المستخدم بنجاح');
        
        // انتظار قصير قبل العودة إلى صفحة إدارة المستخدمين
        setTimeout(() => {
          navigate('/users');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      let errorMsg = 'فشل تحديث بيانات المستخدم. يرجى المحاولة مرة أخرى.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }
      
      openErrorModal('خطأ في العملية', errorMsg);
    } finally {
      setSaving(false);
    }
  };
  // ترجمة الأدوار
  const translateRole = (role) => {
    const roles = {
      'AVOCAT': 'محامي',
      'ASSISTANT_JURIDIQUE': 'مساعد قانوني'
    };
    return roles[role] || role;
  };  // الأدوار المتاحة في النظام
  const availableRoles = [
    { value: 'AVOCAT', label: 'محامي' },
    { value: 'ASSISTANT_JURIDIQUE', label: 'مساعد قانوني' }
  ];

  // فتح نافذة الخطأ
  const openErrorModal = (title, message) => {
    setErrorModal({
      isOpen: true,
      title,
      message
    });
  };
  
  // إغلاق نافذة الخطأ
  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      title: '',
      message: ''
    });
  };

  // إظهار إشعار
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });

    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[60vh]">
        <LoadingSpinner size="lg" text="جاري تحميل بيانات المستخدم..." />
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="p-4 text-red-800 border border-red-300 rounded-md bg-red-50">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            تعذر العثور على بيانات المستخدم المطلوب
          </p>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/users')} 
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              العودة إلى قائمة المستخدمين
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* نافذة الخطأ */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
      />
      
      {/* مكون الإشعارات */}
      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">تعديل بيانات المستخدم</h1>
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          العودة إلى القائمة
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* معلومات المستخدم الأساسية */}
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <h2 className="mb-4 text-lg font-medium">المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">الاسم الأول</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">الاسم الأخير</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                readOnly={true}
              />
              <p className="mt-1 text-xs text-gray-500">لا يمكن تغيير البريد الإلكتروني</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">رقم الهاتف</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <h2 className="mb-4 text-lg font-medium">معلومات إضافية</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">العنوان</label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">تاريخ الميلاد</label>
              <input
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* إعدادات الحساب */}
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <h2 className="mb-4 text-lg font-medium">إعدادات الحساب</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">الدور</label>              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.role === 'ADMINISTRATEUR'}
              >
                {availableRoles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              {formData.role === 'ADMINISTRATEUR' && (
                <p className="mt-1 text-xs text-gray-500">لا يمكن تغيير دور مدير النظام</p>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex items-center">                <input
                  id="estActive"
                  name="estActive"
                  type="checkbox"
                  checked={formData.estActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={formData.role === 'ADMINISTRATEUR'}
                />
                <label htmlFor="estActive" className="block mr-2 text-sm text-gray-700">
                  حساب نشط
                </label>
              </div>
              {formData.role === 'ADMINISTRATEUR' && (
                <p className="mr-4 text-xs text-gray-500">لا يمكن تغيير حالة حساب مدير النظام</p>
              )}
            </div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={saving}
          >
            إلغاء
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={saving}
          >
            {saving ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" color="light" inline={true} />
                <span className="mr-2">جاري الحفظ...</span>
              </div>
            ) : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;