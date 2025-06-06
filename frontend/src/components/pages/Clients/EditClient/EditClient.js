import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientService } from '../../../../services/api';

/**
 * مكون تعديل بيانات العميل
 * يتيح تحديث معلومات العميل الموجود في قاعدة البيانات
 */
const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // === حالة البيانات ===  // البيانات الأساسية للعميل
  const [clientData, setClientData] = useState({
    nom: '',           // الاسم
    email: '',         // البريد الإلكتروني
    telephone: '',     // رقم الهاتف
    type: 'شركة',      // نوع العميل
    adresse: '',       // العنوان
    contact: '',       // جهة الاتصال
    notes: '',         // ملاحظات
    statut: 'نشط'      // الحالة
  });
  
  // حالة واجهة المستخدم
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة إرسال النموذج
  const [isLoading, setIsLoading] = useState(true);       // حالة تحميل البيانات
  const [errors, setErrors] = useState({});               // أخطاء التحقق
  const [generalError, setGeneralError] = useState('');   // رسالة خطأ عامة
  const [success, setSuccess] = useState('');             // رسالة نجاح
  
  // === الثوابت والخيارات ===
  // خيارات أنواع العملاء وحالاتهم
  const clientTypes = ['شركة', 'فرد', 'مؤسسة', 'حكومي', 'شراكة'];
  const statusTypes = ['نشط', 'معلق', 'غير نشط'];
  
  // === الوظائف والمعالجات ===
  /**
   * تحديث حقل في نموذج البيانات
   * @param {Event} e - حدث تغيير القيمة
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // إزالة رسالة الخطأ عند تغيير قيمة الحقل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
    /**
   * التحقق من صحة بيانات النموذج
   * @returns {boolean} - صحة البيانات
   */
  const validateForm = () => {
    const newErrors = {};
    
    // التحقق من الاسم
    if (!clientData.nom || !clientData.nom.trim()) {
      newErrors.nom = 'اسم العميل مطلوب';
    }
      // التحقق من رقم الهاتف (مطلوب)
    if (!clientData.telephone || !clientData.telephone.trim()) {
      newErrors.telephone = 'رقم الهاتف مطلوب';
    } else {
      const phoneRegex = /^[+]?[\d\s()-]{8,}$/;
      if (!phoneRegex.test(clientData.telephone)) {
        newErrors.telephone = 'الرجاء إدخال رقم هاتف صحيح';
      }
    }
    
    // التحقق من البريد الإلكتروني (اختياري - فقط إذا تم إدخاله)
    if (clientData.email && clientData.email.trim()) {
      if (!/\S+@\S+\.\S+/.test(clientData.email)) {
        newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * معالجة إرسال النموذج
   * @param {Event} e - حدث الإرسال
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التأكيد قبل الحفظ
    if (!window.confirm('هل أنت متأكد من حفظ التغييرات؟')) {
      return;
    }
    
    // إعادة تعيين رسائل الخطأ والنجاح
    setGeneralError('');
    setSuccess('');
    
    // التحقق من صحة البيانات
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // استدعاء خدمة تحديث بيانات العميل
      await clientService.updateClient(id, clientData);
      
      setSuccess('تم تحديث بيانات العميل بنجاح');
      
      // إعادة التوجيه إلى صفحة تفاصيل العميل بعد ثانيتين
      setTimeout(() => {
        navigate(`/clients/${id}`);
      }, 2000);
    } catch (err) {
      console.error('خطأ في تحديث بيانات العميل:', err);
      
      if (err.response) {
        // معالجة الأخطاء من الخادم
        switch (err.response.status) {
          case 400:
            setGeneralError('البيانات المدخلة غير صحيحة');
            break;
          case 404:
            setGeneralError('لم يتم العثور على العميل');
            break;
          default:
            setGeneralError('حدث خطأ أثناء تحديث بيانات العميل');
        }
      } else if (err.request) {
        setGeneralError('لا يمكن الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى');
      } else {
        setGeneralError('حدث خطأ أثناء معالجة طلبك، يرجى المحاولة مرة أخرى');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * الرجوع إلى الصفحة السابقة
   */
  const handleCancel = () => {
    navigate(-1);
  };
    // === تأثيرات جانبية ===
  // جلب بيانات العميل عند تحميل المكون
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await clientService.getClientById(id);
        // تأكيد أن جميع الحقول محددة لتجنب خطأ undefined.trim()
        const clientData = response.data;
        setClientData({
          nom: clientData.nom || '',
          email: clientData.email || '',
          telephone: clientData.telephone || '',
          type: clientData.type || 'شركة',
          adresse: clientData.adresse || '',
          contact: clientData.contact || '',
          notes: clientData.notes || '',
          statut: clientData.statut || 'نشط'
        });
      } catch (err) {
        console.error('خطأ في جلب بيانات العميل:', err);
        setGeneralError('حدث خطأ أثناء جلب بيانات العميل');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  // === تصيير المكون ===
  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-white rounded-lg">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // عرض النموذج
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">تعديل بيانات العميل</h1>
      
      {/* رسائل النجاح والخطأ */}
      {generalError && (
        <div className="p-4 mb-4 text-sm text-white bg-red-500 rounded-md">
          {generalError}
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 text-sm text-white bg-green-500 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* اسم العميل */}
          <div>
            <label htmlFor="nom" className="block mb-2 text-sm font-medium text-gray-700">
              اسم العميل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={clientData.nom}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="أدخل اسم العميل"
            />
            {errors.nom && (
              <p className="mt-1 text-xs text-red-500">{errors.nom}</p>
            )}
          </div>
          
          {/* نوع العميل */}
          <div>
            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-700">
              نوع العميل
            </label>
            <select
              id="type"
              name="type"
              value={clientData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {clientTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
            {/* البريد الإلكتروني */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={clientData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="example@example.com"
              dir="ltr"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>            {/* رقم الهاتف */}
          <div>
            <label htmlFor="telephone" className="block mb-2 text-sm font-medium text-gray-700">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="telephone"
              name="telephone"
              value={clientData.telephone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.telephone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="+212123456789"
              dir="ltr"
            />
            {errors.telephone && (
              <p className="mt-1 text-xs text-red-500">{errors.telephone}</p>
            )}
          </div>
          
          {/* جهة الاتصال */}
          <div>
            <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-700">
              جهة الاتصال
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={clientData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="اسم الشخص المسؤول"
            />
          </div>
          
          {/* الحالة */}
          <div>
            <label htmlFor="statut" className="block mb-2 text-sm font-medium text-gray-700">
              الحالة
            </label>
            <select
              id="statut"
              name="statut"
              value={clientData.statut}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusTypes.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
            {/* العنوان (يمتد على عرض الشاشة كاملة) */}
          <div className="md:col-span-2">
            <label htmlFor="adresse" className="block mb-2 text-sm font-medium text-gray-700">
              العنوان
            </label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={clientData.adresse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل عنوان العميل"
            />
          </div>
          
          {/* الملاحظات (يمتد على عرض الشاشة كاملة) */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-700">
              ملاحظات
            </label>
            <textarea
              id="notes"
              name="notes"
              value={clientData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل أي ملاحظات إضافية عن العميل"
            />
          </div>
        </div>
        
        {/* أزرار الإجراءات */}
        <div className="flex justify-between pt-4 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="w-4 h-4 ml-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الحفظ...
              </div>
            ) : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClient;
