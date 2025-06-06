import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseService, clientService } from '../../../../services/api';

// تعريف ثوابت للفئات المشتركة لتقليل التكرار
const BUTTON_CLASSES = "flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700";
const INPUT_CLASSES = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const INPUT_REQUIRED_CLASSES = "w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500";
const INPUT_VALID_CLASSES = "w-full px-3 py-2 border-2 border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";
const LABEL_CLASSES = "block mb-1 text-sm font-medium text-gray-700";
const LABEL_REQUIRED_CLASSES = "block mb-1 text-sm font-medium text-red-600";
const SECTION_CLASSES = "p-4 mb-6 border border-gray-200 rounded-lg";
const SECTION_TITLE_CLASSES = "mb-4 text-lg font-semibold text-gray-800";

const NewCase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  // بيانات القضية الجديدة
  const [caseData, setCaseData] = useState({
    titre: '',  // title -> titre للـ backend
    description: '',
    clientId: '',
    type: '',
    tribunal: '',  // court -> tribunal للـ backend
    avocat: '',   // lawyer -> avocat للـ backend
    fichierNumero: '',  // fileNumber -> fichierNumero للـ backend
    jugeId: '',   // judgeId -> jugeId للـ backend
    partieAdverse: '',  // opposingParty -> partieAdverse للـ backend
    avocatAdverse: '',  // opposingLawyer -> avocatAdverse للـ backend
    statut: 'جارية',     // status -> statut للـ backend
    priorite: 'متوسطة', // priority -> priorite للـ backend
    dateInitiale: ''   // initialDate -> dateInitiale للـ backend
  });

  // حالة الأخطاء للحقول المطلوبة
  const [fieldErrors, setFieldErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  // قوائم البيانات
  const [clients, setClients] = useState([]);
  const [judges, setJudges] = useState([]);
  const [courts, setCourts] = useState([]);

  // أنواع القضايا وحالاتها وأولويتها
  const caseTypes = ['عقاري', 'مدني', 'تجاري', 'أحوال شخصية', 'ملكية فكرية', 'إداري', 'عمالي'];
  const statusTypes = ['جارية', 'معلقة', 'مؤجلة', 'مغلقة'];
  const priorityTypes = ['عالية', 'متوسطة', 'منخفضة'];
  // تغيير قيم الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaseData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // إزالة الخطأ من الحقل عند التعديل
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }

    // التحقق الفوري للحقول المطلوبة
    if (showValidation) {
      validateField(name, value);
    }
  };

  // التحقق من حقل واحد
  const validateField = (fieldName, value) => {
    const requiredFields = ['titre', 'clientId', 'type', 'tribunal', 'avocat', 'statut', 'priorite'];
    
    if (requiredFields.includes(fieldName)) {
      const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: isEmpty
      }));
      return !isEmpty;
    }
    return true;
  };

  // دالة للحصول على فئة CSS للحقل
  const getInputClass = (fieldName) => {
    if (!showValidation) return INPUT_CLASSES;
    
    const requiredFields = ['titre', 'clientId', 'type', 'tribunal', 'avocat', 'statut', 'priorite'];
    if (!requiredFields.includes(fieldName)) return INPUT_CLASSES;
    
    const value = caseData[fieldName];
    const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
    
    if (isEmpty) return INPUT_REQUIRED_CLASSES;
    return INPUT_VALID_CLASSES;
  };

  // دالة للحصول على فئة CSS للتسمية
  const getLabelClass = (fieldName) => {
    const requiredFields = ['titre', 'clientId', 'type', 'tribunal', 'avocat', 'statut', 'priorite'];
    if (requiredFields.includes(fieldName) && showValidation && fieldErrors[fieldName]) {
      return LABEL_REQUIRED_CLASSES;
    }
    return LABEL_CLASSES;
  };// تحميل بيانات القوائم المنسدلة
  useEffect(() => {
    const loadData = async () => {
      try {
        // تحميل العملاء من الـ API
        const clientsResponse = await clientService.getAllClients();
        setClients(clientsResponse.data);

        // بيانات القضاة والمحاكم (ثابتة مؤقتاً)
        setJudges([
          { id: 1, name: 'القاضي محمد العلوي' },
          { id: 2, name: 'القاضي حسن المغربي' },
          { id: 3, name: 'القاضي سمير التازي' },
        ]);

        setCourts([
          { id: 1, name: 'المحكمة الإبتدائية - الرباط' },
          { id: 2, name: 'محكمة الاستئناف - الدار البيضاء' },
          { id: 3, name: 'المحكمة التجارية - مراكش' },
          { id: 4, name: 'محكمة الأسرة - فاس' },
          { id: 5, name: 'المحكمة الإدارية - الرباط' },
          { id: 6, name: 'محكمة العمل - الدار البيضاء' },
        ]);
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        alert('فشل في تحميل البيانات، يرجى إعادة تحميل الصفحة');
      }
    };

    loadData();
  }, []);  // التحقق من صلاحية النموذج
  const validateForm = () => {
    setShowValidation(true);
    const requiredFields = ['titre', 'clientId', 'type', 'tribunal', 'avocat', 'statut', 'priorite'];
    const errors = {};
    let hasError = false;
    
    // التحقق من الحقول المطلوبة
    requiredFields.forEach(field => {
      const value = caseData[field];
      const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
      if (isEmpty) {
        errors[field] = true;
        hasError = true;
      }
    });
      // التحقق من صحة معرف العميل
    if (caseData.clientId) {
      const clientIdNum = parseInt(caseData.clientId);
      if (isNaN(clientIdNum) || clientIdNum <= 0) {
        errors.clientId = true;
        hasError = true;
        console.error('معرف العميل غير صحيح:', caseData.clientId);
      }
    }
    
    // التحقق من صحة التاريخ إذا كان موجوداً
    if (caseData.dateInitiale && !isValidDate(caseData.dateInitiale)) {
      errors.dateInitiale = true;
      hasError = true;
      console.error('تاريخ بدء القضية غير صحيح');
    }
    
    setFieldErrors(errors);
    return !hasError;
  };
  
  // دالة مساعدة للتحقق من صحة التاريخ
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };  // حفظ القضية الجديدة
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // عرض رسالة تفصيلية عن الحقول المطلوبة
      const missingFields = [];
      const requiredFields = [
        { key: 'titre', name: 'عنوان القضية' },
        { key: 'clientId', name: 'العميل' },
        { key: 'type', name: 'نوع القضية' },
        { key: 'tribunal', name: 'المحكمة' },
        { key: 'avocat', name: 'المحامي المسؤول' },
        { key: 'statut', name: 'حالة القضية' },
        { key: 'priorite', name: 'أولوية القضية' }
      ];
      
      requiredFields.forEach(field => {
        const value = caseData[field.key];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(field.name);
        }
      });
      
      if (missingFields.length > 0) {
        alert(`يرجى ملء الحقول المطلوبة التالية:\n• ${missingFields.join('\n• ')}`);
      } else {
        alert('يرجى التأكد من صحة جميع البيانات المدخلة');
      }
      return;
    }
    
    setLoading(true);
      try {        // تحضير بيانات القضية للإرسال
      const caseDataToSend = {
        titre: caseData.titre.trim(),
        description: caseData.description ? caseData.description.trim() : '',
        clientId: parseInt(caseData.clientId),
        type: caseData.type,
        tribunal: caseData.tribunal,
        avocat: caseData.avocat.trim(),
        fichierNumero: caseData.fichierNumero ? caseData.fichierNumero.trim() : null,
        jugeId: caseData.jugeId && caseData.jugeId !== '' ? caseData.jugeId : null,
        partieAdverse: caseData.partieAdverse ? caseData.partieAdverse.trim() : null,
        avocatAdverse: caseData.avocatAdverse ? caseData.avocatAdverse.trim() : null,
        statut: caseData.statut,
        priorite: caseData.priorite,
        // تحويل التواريخ إلى تنسيق ISO إذا كانت موجودة
        dateInitiale: caseData.dateInitiale ? new Date(caseData.dateInitiale).toISOString().split('T')[0] : null
      };

      // تسجيل تفصيلي للبيانات
      console.log('البيانات الأصلية:', caseData);
      console.log('البيانات المعدة للإرسال:', caseDataToSend);
      console.log('معرف العميل:', caseDataToSend.clientId, 'نوعه:', typeof caseDataToSend.clientId);
      
      // التحقق من أن معرف العميل صحيح
      if (!caseDataToSend.clientId || isNaN(caseDataToSend.clientId)) {
        throw new Error('معرف العميل غير صحيح');
      }console.log('إرسال بيانات القضية:', caseDataToSend);
      
      // إرسال البيانات إلى الخادم
      const response = await caseService.createCase(caseDataToSend);
      
      console.log('تم إنشاء القضية بنجاح:', response.data);
      
      // عرض رسالة نجاح
      alert('تمت إضافة القضية بنجاح');
      
      // إعادة توجيه إلى صفحة جميع القضايا
      navigate('/cases');
      
    } catch (error) {
      console.error('خطأ في إضافة القضية:', error);
      console.error('تفاصيل الخطأ:', error.response);
      
      // عرض رسالة خطأ مناسبة مع تفاصيل أكثر
      let errorMessage = 'فشل في إضافة القضية، يرجى المحاولة مرة أخرى';
      
      if (error.response?.status === 400) {
        errorMessage = 'خطأ في البيانات المدخلة. يرجى التحقق من صحة جميع البيانات';
      } else if (error.response?.status === 500) {
        errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً';
      } else if (error.response?.data?.message) {
        errorMessage = `خطأ: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `خطأ: ${error.message}`;
      } else if (!window.navigator.onLine) {
        errorMessage = 'لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // إلغاء وعودة
  const handleCancel = () => {
    if (window.confirm('هل أنت متأكد من إلغاء إضافة القضية؟ ستفقد جميع البيانات المدخلة.')) {
      navigate('/cases');
    }
  };

  // دالة اختبار تحميل العملاء
  const testClients = () => {
    console.log('قائمة العملاء المحملة:', clients);
    console.log('عدد العملاء:', clients.length);
    if (clients.length > 0) {
      console.log('أول عميل:', clients[0]);
      console.log('معرف أول عميل:', clients[0].id || clients[0].idClient);
    }
  };

  // دالة اختبار الاتصال بالخادم
  const testServerConnection = async () => {
    try {
      console.log('اختبار الاتصال بالخادم...');
      const response = await fetch('http://localhost:8080/api/dossiers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        console.log('الاتصال بالخادم ناجح');
        return true;
      } else {
        console.error('فشل الاتصال بالخادم، الكود:', response.status);
        return false;
      }
    } catch (error) {
      console.error('خطأ في الاتصال بالخادم:', error);
      return false;
    }
  };

  return (    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">إضافة قضية جديدة</h1>
        {/* تنبيه للحقول المطلوبة */}
      <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <span className="text-blue-600 text-xl ml-2">ℹ️</span>
              <p className="text-blue-800 font-medium">الحقول المميزة بـ <span className="text-red-500">*</span> مطلوبة ويجب ملؤها</p>
            </div>
            <p className="text-blue-600 text-sm mt-2">
              الحقول المطلوبة: عنوان القضية، العميل، نوع القضية، المحكمة، المحامي المسؤول، حالة القضية، أولوية القضية
            </p>
          </div>
          <button 
            type="button"
            onClick={testClients}
            className="px-3 py-1 text-xs bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
          >
            اختبار العملاء
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* القسم الأول: معلومات القضية الأساسية */}
        <div className={SECTION_CLASSES}>
          <h2 className={SECTION_TITLE_CLASSES}>المعلومات الأساسية</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">            {/* عنوان القضية */}
            <div>
              <label className={getLabelClass('titre')} htmlFor="titre">
                عنوان القضية <span className="text-red-500">*</span>
                {showValidation && fieldErrors.titre && <span className="text-xs text-red-500 block">هذا الحقل مطلوب</span>}
              </label>
              <input 
                type="text" 
                id="titre" 
                name="titre"
                required
                value={caseData.titre}
                onChange={handleChange}
                placeholder="عنوان القضية"
                className={getInputClass('titre')}
              />
            </div>

            {/* العميل */}
            <div>
              <label className={getLabelClass('clientId')} htmlFor="clientId">
                العميل <span className="text-red-500">*</span>
                {showValidation && fieldErrors.clientId && <span className="text-xs text-red-500 block">يرجى اختيار عميل</span>}
              </label>
              <select 
                id="clientId" 
                name="clientId"
                required
                value={caseData.clientId}
                onChange={handleChange}
                className={getInputClass('clientId')}
              >                <option value="">اختر العميل...</option>
                {clients.map(client => (
                  <option key={client.id || client.idClient} value={client.id || client.idClient}>
                    {client.nom || client.name || `${client.prenom || ''} ${client.nom || ''}`.trim()}
                  </option>
                ))}
              </select>
            </div>            {/* نوع القضية */}
            <div>
              <label className={getLabelClass('type')} htmlFor="type">
                نوع القضية <span className="text-red-500">*</span>
                {showValidation && fieldErrors.type && <span className="text-xs text-red-500 block">يرجى اختيار نوع القضية</span>}
              </label>
              <select 
                id="type" 
                name="type"
                required
                value={caseData.type}
                onChange={handleChange}
                className={getInputClass('type')}
              >
                <option value="">اختر نوع القضية...</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* المحكمة */}
            <div>
              <label className={getLabelClass('tribunal')} htmlFor="tribunal">
                المحكمة <span className="text-red-500">*</span>
                {showValidation && fieldErrors.tribunal && <span className="text-xs text-red-500 block">يرجى اختيار المحكمة</span>}
              </label>
              <select 
                id="tribunal" 
                name="tribunal"
                required
                value={caseData.tribunal}
                onChange={handleChange}
                className={getInputClass('tribunal')}
              >
                <option value="">اختر المحكمة...</option>
                {courts.map(court => (
                  <option key={court.id} value={court.name}>{court.name}</option>
                ))}
              </select>
            </div>            {/* رقم الملف */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="fichierNumero">رقم الملف بالمحكمة</label>
              <input 
                type="text" 
                id="fichierNumero" 
                name="fichierNumero"
                value={caseData.fichierNumero}
                onChange={handleChange}
                placeholder="رقم الملف بالمحكمة (اختياري)"
                className={INPUT_CLASSES}
              />
            </div>

            {/* تاريخ بدء القضية */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="dateInitiale">تاريخ بدء القضية</label>
              <input 
                type="date" 
                id="dateInitiale" 
                name="dateInitiale"
                value={caseData.dateInitiale}
                onChange={handleChange}
                className={INPUT_CLASSES}
              />
            </div>
          </div>
        </div>

        {/* القسم الثاني: أطراف القضية */}
        <div className={SECTION_CLASSES}>
          <h2 className={SECTION_TITLE_CLASSES}>أطراف القضية</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">            {/* المحامي المسؤول */}
            <div>
              <label className={getLabelClass('avocat')} htmlFor="avocat">
                المحامي المسؤول <span className="text-red-500">*</span>
                {showValidation && fieldErrors.avocat && <span className="text-xs text-red-500 block">هذا الحقل مطلوب</span>}
              </label>
              <input 
                type="text" 
                id="avocat" 
                name="avocat"
                required
                value={caseData.avocat}
                onChange={handleChange}
                placeholder="اسم المحامي المسؤول"
                className={getInputClass('avocat')}
              />
            </div>

            {/* القاضي */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="jugeId">القاضي</label>
              <select 
                id="jugeId" 
                name="jugeId"
                value={caseData.jugeId}
                onChange={handleChange}
                className={INPUT_CLASSES}
              >
                <option value="">اختر القاضي...</option>
                {judges.map(judge => (
                  <option key={judge.id} value={judge.id}>{judge.name}</option>
                ))}
              </select>
            </div>            {/* الطرف المقابل */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="partieAdverse">الطرف المقابل</label>
              <input 
                type="text" 
                id="partieAdverse" 
                name="partieAdverse"
                value={caseData.partieAdverse}
                onChange={handleChange}
                placeholder="اسم الطرف المقابل"
                className={INPUT_CLASSES}
              />
            </div>

            {/* محامي الطرف المقابل */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="avocatAdverse">محامي الطرف المقابل</label>
              <input 
                type="text" 
                id="avocatAdverse" 
                name="avocatAdverse"
                value={caseData.avocatAdverse}
                onChange={handleChange}
                placeholder="اسم محامي الطرف المقابل"
                className={INPUT_CLASSES}
              />
            </div>
          </div>
        </div>

        {/* القسم الثالث: حالة القضية وأولويتها */}
        <div className={SECTION_CLASSES}>
          <h2 className={SECTION_TITLE_CLASSES}>حالة القضية</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">            {/* حالة القضية */}
            <div>
              <label className={getLabelClass('statut')} htmlFor="statut">
                حالة القضية <span className="text-red-500">*</span>
                {showValidation && fieldErrors.statut && <span className="text-xs text-red-500 block">يرجى اختيار حالة القضية</span>}
              </label>
              <select 
                id="statut" 
                name="statut"
                required
                value={caseData.statut}
                onChange={handleChange}
                className={getInputClass('statut')}
              >
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* أولوية القضية */}
            <div>
              <label className={getLabelClass('priorite')} htmlFor="priorite">
                أولوية القضية <span className="text-red-500">*</span>
                {showValidation && fieldErrors.priorite && <span className="text-xs text-red-500 block">يرجى اختيار أولوية القضية</span>}
              </label>
              <select 
                id="priorite" 
                name="priorite"
                required
                value={caseData.priorite}
                onChange={handleChange}
                className={getInputClass('priorite')}
              >
                {priorityTypes.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* القسم الرابع: وصف القضية */}
        <div className={SECTION_CLASSES}>
          <h2 className={SECTION_TITLE_CLASSES}>وصف القضية</h2>
          
          <div>
            <label className={LABEL_CLASSES} htmlFor="description">التفاصيل والملاحظات</label>
            <textarea 
              id="description" 
              name="description"
              value={caseData.description}
              onChange={handleChange}
              placeholder="أدخل تفاصيل وملاحظات حول القضية هنا..."
              rows="4"
              className={INPUT_CLASSES}
            />
          </div>
        </div>{/* أزرار التحكم */}
        <div className="flex justify-center mt-6 space-x-4 space-x-reverse">
          <button 
            type="submit" 
            className="px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 ml-2 border-2 border-white rounded-full animate-spin border-t-transparent"></span>
                جاري الحفظ...
              </>            ) : (
              'حفظ القضية'
            )}
          </button>

          <button 
            type="button" 
            onClick={handleCancel}
            className="px-6 py-3 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            ✕ إلغاء
          </button>        </div>
      </form>
    </div>
  );
};

export default NewCase;