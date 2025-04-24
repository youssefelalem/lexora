import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// تعريف ثوابت للفئات المشتركة لتقليل التكرار
const BUTTON_CLASSES = "flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700";
const INPUT_CLASSES = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const LABEL_CLASSES = "block mb-1 text-sm font-medium text-gray-700";
const SECTION_CLASSES = "p-4 mb-6 border border-gray-200 rounded-lg";
const SECTION_TITLE_CLASSES = "mb-4 text-lg font-semibold text-gray-800";

const NewCase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // بيانات القضية الجديدة
  const [caseData, setCaseData] = useState({
    title: '',
    description: '',
    clientId: '',
    type: '',
    court: '',
    lawyer: '',
    fileNumber: '',
    judgeId: '',
    opposingParty: '',
    opposingLawyer: '',
    status: 'جارية',
    priority: 'متوسطة',
    initialDate: '',
    sessionDate: '',
    sessionNotes: '',
    attachments: []
  });

  // قوائم البيانات
  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
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
  };

  // تحميل بيانات القوائم المنسدلة
  useEffect(() => {
    // في الإستخدام الفعلي، سيتم استبدال هذه البيانات بطلبات API
    setClients([
      { id: 1, name: 'شركة الفجر للتكنولوجيا' },
      { id: 2, name: 'محمد علي' },
      { id: 3, name: 'مؤسسة النور للاستشارات' },
      { id: 4, name: 'خالد عبد الرحمن' },
      { id: 5, name: 'شركة السلام للتجارة' },
    ]);

    setLawyers([
      { id: 1, name: 'أحمد محمود' },
      { id: 2, name: 'سارة أحمد' },
      { id: 3, name: 'خالد محمد' },
      { id: 4, name: 'لمياء علي' },
      { id: 5, name: 'عمر حسن' },
    ]);

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
  }, []);

  // إدارة المرفقات
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // تحقق من حجم الملفات وقيود الأنواع هنا
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024); // حد 5MB
    
    setCaseData(prevData => ({
      ...prevData,
      attachments: [...prevData.attachments, ...validFiles]
    }));
  };

  // إزالة مرفق
  const removeAttachment = (index) => {
    setCaseData(prevData => {
      const updatedAttachments = [...prevData.attachments];
      updatedAttachments.splice(index, 1);
      return { ...prevData, attachments: updatedAttachments };
    });
  };

  // التحقق من صلاحية النموذج
  const validateForm = () => {
    const requiredFields = ['title', 'clientId', 'type', 'court', 'lawyer', 'status', 'priority'];
    return requiredFields.every(field => caseData[field]);
  };

  // حفظ القضية الجديدة
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    setLoading(true);
    
    try {
      // هنا سيكون الاتصال بـ API لحفظ القضية
      console.log('تم إرسال بيانات القضية:', caseData);
      
      // إنشاء FormData لإرسال المرفقات
      const formData = new FormData();
      
      // إضافة بيانات القضية كـ JSON
      formData.append('caseData', JSON.stringify(caseData));
      
      // إضافة المرفقات
      caseData.attachments.forEach((file, index) => {
        formData.append(`attachment-${index}`, file);
      });
      
      // محاكاة الاتصال بالخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // عند نجاح الإضافة
      alert('تمت إضافة القضية بنجاح');
      navigate('/cases/all');
    } catch (error) {
      console.error('حدث خطأ أثناء حفظ القضية:', error);
      alert('فشل في إضافة القضية، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  // إلغاء وعودة
  const handleCancel = () => {
    if (window.confirm('هل أنت متأكد من إلغاء إضافة القضية؟ ستفقد جميع البيانات المدخلة.')) {
      navigate('/cases/all');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">إضافة قضية جديدة</h1>
      
      <form onSubmit={handleSubmit}>
        {/* القسم الأول: معلومات القضية الأساسية */}
        <div className={SECTION_CLASSES}>
          <h2 className={SECTION_TITLE_CLASSES}>المعلومات الأساسية</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* عنوان القضية */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="title">عنوان القضية *</label>
              <input 
                type="text" 
                id="title" 
                name="title"
                required
                value={caseData.title}
                onChange={handleChange}
                placeholder="عنوان القضية"
                className={INPUT_CLASSES}
              />
            </div>

            {/* العميل */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="clientId">العميل *</label>
              <select 
                id="clientId" 
                name="clientId"
                required
                value={caseData.clientId}
                onChange={handleChange}
                className={INPUT_CLASSES}
              >
                <option value="">اختر العميل...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            {/* نوع القضية */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="type">نوع القضية *</label>
              <select 
                id="type" 
                name="type"
                required
                value={caseData.type}
                onChange={handleChange}
                className={INPUT_CLASSES}
              >
                <option value="">اختر نوع القضية...</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* المحكمة */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="court">المحكمة *</label>
              <select 
                id="court" 
                name="court"
                required
                value={caseData.court}
                onChange={handleChange}
                className={INPUT_CLASSES}
              >
                <option value="">اختر المحكمة...</option>
                {courts.map(court => (
                  <option key={court.id} value={court.name}>{court.name}</option>
                ))}
              </select>
            </div>

            {/* رقم الملف */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="fileNumber">رقم الملف بالمحكمة</label>
              <input 
                type="text" 
                id="fileNumber" 
                name="fileNumber"
                value={caseData.fileNumber}
                onChange={handleChange}
                placeholder="رقم الملف بالمحكمة (اختياري)"
                className={INPUT_CLASSES}
              />
            </div>

            {/* تاريخ بدء القضية */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="initialDate">تاريخ بدء القضية</label>
              <input 
                type="date" 
                id="initialDate" 
                name="initialDate"
                value={caseData.initialDate}
                onChange={handleChange}
                className={INPUT_CLASSES}
              />
            </div>
          </div>
        </div>

        {/* القسم الثاني: أطراف القضية */}
        <div className={SECTION_CLASSES}>
          <h2 className={SECTION_TITLE_CLASSES}>أطراف القضية</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* المحامي المسؤول */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="lawyer">المحامي المسؤول *</label>
              <select 
                id="lawyer" 
                name="lawyer"
                required
                value={caseData.lawyer}
                onChange={handleChange}
                className={INPUT_CLASSES}
              >
                <option value="">اختر المحامي...</option>
                {lawyers.map(lawyer => (
                  <option key={lawyer.id} value={lawyer.name}>{lawyer.name}</option>
                ))}
              </select>
            </div>

            {/* القاضي */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="judgeId">القاضي</label>
              <select 
                id="judgeId" 
                name="judgeId"
                value={caseData.judgeId}
                onChange={handleChange}
                className={INPUT_CLASSES}
              >
                <option value="">اختر القاضي...</option>
                {judges.map(judge => (
                  <option key={judge.id} value={judge.id}>{judge.name}</option>
                ))}
              </select>
            </div>

            {/* الطرف المقابل */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="opposingParty">الطرف المقابل</label>
              <input 
                type="text" 
                id="opposingParty" 
                name="opposingParty"
                value={caseData.opposingParty}
                onChange={handleChange}
                placeholder="اسم الطرف المقابل"
                className={INPUT_CLASSES}
              />
            </div>

            {/* محامي الطرف المقابل */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="opposingLawyer">محامي الطرف المقابل</label>
              <input 
                type="text" 
                id="opposingLawyer" 
                name="opposingLawyer"
                value={caseData.opposingLawyer}
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
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* حالة القضية */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="status">حالة القضية *</label>
              <select 
                id="status" 
                name="status"
                required
                value={caseData.status}
                onChange={handleChange}
                className={INPUT_CLASSES}
              >
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* أولوية القضية */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="priority">أولوية القضية *</label>
              <select 
                id="priority" 
                name="priority"
                required
                value={caseData.priority}
                onChange={handleChange}
                className={INPUT_CLASSES}
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
        </div>

        {/* القسم الخامس: جلسة القضية الأولى */}
        <div className={SECTION_CLASSES}>
          <h2 className={SECTION_TITLE_CLASSES}>الجلسة الأولى</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* تاريخ الجلسة */}
            <div>
              <label className={LABEL_CLASSES} htmlFor="sessionDate">تاريخ الجلسة</label>
              <input 
                type="date" 
                id="sessionDate" 
                name="sessionDate"
                value={caseData.sessionDate}
                onChange={handleChange}
                className={INPUT_CLASSES}
              />
            </div>

            {/* ملاحظات الجلسة */}
            <div className="md:col-span-2">
              <label className={LABEL_CLASSES} htmlFor="sessionNotes">ملاحظات الجلسة</label>
              <textarea 
                id="sessionNotes" 
                name="sessionNotes"
                value={caseData.sessionNotes}
                onChange={handleChange}
                placeholder="ملاحظات حول الجلسة الأولى..."
                rows="3"
                className={INPUT_CLASSES}
              />
            </div>
          </div>
        </div>

        {/* القسم السادس: مرفقات القضية */}
        <div className={SECTION_CLASSES}>
          <h2 className={SECTION_TITLE_CLASSES}>المرفقات</h2>
          
          <div className="mb-4">
            <label className="inline-block px-4 py-2 mb-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
              <input 
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="flex items-center">
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
                إضافة مرفقات
              </span>
            </label>
            <p className="text-xs text-gray-500">الحد الأقصى لحجم الملف: 5 ميجابايت</p>
          </div>

          {/* عرض المرفقات */}
          {caseData.attachments.length > 0 && (
            <ul className="space-y-2">
              {caseData.attachments.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-sm">{file.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(file.size / 1024).toFixed(1)} كيلوبايت)
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="p-1 text-red-500 transition-colors rounded hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeAttachment(index)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* أزرار التحكم */}
        <div className="flex justify-center mt-6 space-x-4 space-x-reverse">
          <button 
            type="submit" 
            className="flex items-center justify-center px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الحفظ...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                حفظ القضية
              </>
            )}
          </button>

          <button 
            type="submit" 
            name="saveAndAddSession"
            className="flex items-center justify-center px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            حفظ وإضافة جلسة
          </button>
        </div>

        {/* زر الإلغاء - منفصل عن الأزرار الأخرى */}
        <div className="flex justify-start mt-4">
          <button 
            type="button" 
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={loading}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCase;