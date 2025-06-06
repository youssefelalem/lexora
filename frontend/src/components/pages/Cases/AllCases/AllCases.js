import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseService } from '../../../../services/api';

/**
 * تنسيق التاريخ بالصيغة الفرنسية (DD/MM/YYYY)
 * @param {string} dateString - التاريخ بصيغة النص
 * @returns {string} - التاريخ المنسق
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (err) {
    console.error('خطأ في تنسيق التاريخ:', err);
    return '-';
  }
};

// تعريف ثوابت للفئات المشتركة
const BADGE_CLASSES = {
  blue: "px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full",
  green: "px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full",
  yellow: "px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full",
  red: "px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full",
  gray: "px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full",
  purple: "px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full",
  orange: "px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full",
};

/**
 * مكون عرض جميع القضايا
 * يتيح عرض قائمة القضايا مع إمكانية البحث والتصفية وإدارة القضايا
 */
const AllCases = () => {
  const navigate = useNavigate();
  
  // === حالة البيانات ===
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالة البحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterPriority, setFilterPriority] = useState('الكل');

  // === الثوابت والخيارات ===
  const caseTypes = ['الكل', 'عقاري', 'مدني', 'تجاري', 'أحوال شخصية', 'ملكية فكرية', 'إداري', 'عمالي'];
  const statusTypes = ['الكل', 'جارية', 'معلقة', 'مؤجلة', 'مغلقة'];
  const priorityTypes = ['الكل', 'عالية', 'متوسطة', 'منخفضة'];

  // === الوظائف المساعدة ===
  /**
   * تحويل حالة القضية إلى صنف CSS
   */
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'جارية': return BADGE_CLASSES.green;
      case 'معلقة': return BADGE_CLASSES.yellow;
      case 'مؤجلة': return BADGE_CLASSES.orange;
      case 'مغلقة': return BADGE_CLASSES.gray;
      default: return BADGE_CLASSES.blue;
    }
  };

  /**
   * تحويل أولوية القضية إلى صنف CSS
   */
  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case 'عالية': return BADGE_CLASSES.red;
      case 'متوسطة': return BADGE_CLASSES.yellow;
      case 'منخفضة': return BADGE_CLASSES.blue;
      default: return BADGE_CLASSES.gray;
    }
  };

  /**
   * تحويل نوع القضية إلى صنف CSS
   */
  const getCaseTypeBadgeClass = (type) => {
    switch(type) {
      case 'عقاري': return BADGE_CLASSES.blue;
      case 'مدني': return BADGE_CLASSES.green;
      case 'تجاري': return BADGE_CLASSES.purple;
      case 'أحوال شخصية': return BADGE_CLASSES.yellow;
      case 'ملكية فكرية': return BADGE_CLASSES.orange;
      case 'إداري': return BADGE_CLASSES.gray;
      case 'عمالي': return BADGE_CLASSES.red;
      default: return BADGE_CLASSES.blue;
    }
  };

  /**
   * جلب القضايا من قاعدة البيانات
   */
  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await caseService.getAllCases();
      
      // تحويل البيانات من تنسيق الـ backend إلى التنسيق المتوقع في المكون
      const transformedCases = response.data.map(dossier => ({
        id: dossier.reference || `C-${dossier.idDossier}`,
        idDossier: dossier.idDossier,
        title: dossier.titre || 'بدون عنوان',
        client: dossier.clientNom || 'غير محدد',
        clientId: dossier.clientId,
        type: dossier.type || 'غير محدد',
        court: dossier.tribunal || 'غير محدد',
        lawyer: dossier.avocat || 'غير محدد',
        nextSession: null, // سيتم الحصول عليها من sessions منفصلة
        status: dossier.statut || 'غير محدد',
        priority: dossier.priorite || 'متوسطة',
        created: dossier.dateCreation ? formatDate(dossier.dateCreation) : 'غير محدد',
        description: dossier.description || ''
      }));
      
      setCases(transformedCases);
    } catch (error) {
      console.error('خطأ في جلب القضايا:', error);
      setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // === وظائف معالجة الأزرار ===
  const handleViewCase = (caseItem) => {
    navigate(`/cases/${caseItem.idDossier}`);
  };

  const handleEditCase = (caseItem) => {
    navigate(`/cases/edit/${caseItem.idDossier}`);
  };

  const handleDeleteCase = async (caseItem) => {
    if (window.confirm('هل أنت متأكد من حذف هذه القضية؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await caseService.deleteCase(caseItem.idDossier);
        await fetchCases(); // إعادة تحميل القائمة
        alert('تم حذف القضية بنجاح');
      } catch (error) {
        console.error('خطأ في حذف القضية:', error);
        alert('حدث خطأ أثناء حذف القضية');
      }
    }
  };

  const handleAddSession = (caseItem) => {
    navigate(`/sessions/new?caseId=${caseItem.idDossier}`);
  };

  const handleAddNewCase = () => {
    navigate('/cases/new');
  };

  // === تأثيرات جانبية ===
  useEffect(() => {
    fetchCases();
  }, []);

  // === تصفية البيانات ===
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = 
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.court.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'الكل' || caseItem.type === filterType;
    const matchesStatus = filterStatus === 'الكل' || caseItem.status === filterStatus;
    const matchesPriority = filterPriority === 'الكل' || caseItem.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // === تصيير المكون ===
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">جاري تحميل القضايا...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">حدث خطأ</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCases}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">جميع القضايا</h1>
        <button
          onClick={handleAddNewCase}
          className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          قضية جديدة
        </button>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        {/* البحث */}
        <div className="relative">
          <input
            type="text"
            placeholder="البحث في القضايا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* فلتر النوع */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {caseTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* فلتر الحالة */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusTypes.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        {/* فلتر الأولوية */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {priorityTypes.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
      </div>

      {/* جدول القضايا */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">رقم القضية</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">العنوان</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">العميل</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">النوع</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">المحكمة</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">الحالة</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">الأولوية</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">تاريخ الإنشاء</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border border-gray-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((caseItem) => (
              <tr key={caseItem.idDossier} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200 font-medium">
                  {caseItem.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-200">
                  <div className="max-w-xs truncate" title={caseItem.title}>
                    {caseItem.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                  {caseItem.client}
                </td>
                <td className="px-4 py-3 text-sm border border-gray-200">
                  <span className={getCaseTypeBadgeClass(caseItem.type)}>
                    {caseItem.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                  {caseItem.court}
                </td>
                <td className="px-4 py-3 text-sm border border-gray-200">
                  <span className={getStatusBadgeClass(caseItem.status)}>
                    {caseItem.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm border border-gray-200">
                  <span className={getPriorityBadgeClass(caseItem.priority)}>
                    {caseItem.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                  {caseItem.created}
                </td>
                <td className="px-4 py-3 text-sm border border-gray-200">
                  <div className="flex space-x-2 space-x-reverse">
                    {/* زر العرض */}
                    <button
                      onClick={() => handleViewCase(caseItem)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="عرض التفاصيل"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    {/* زر التعديل */}
                    <button
                      onClick={() => handleEditCase(caseItem)}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                      title="تعديل"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* زر إضافة جلسة */}
                    <button
                      onClick={() => handleAddSession(caseItem)}
                      className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                      title="إضافة جلسة"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>

                    {/* زر الحذف */}
                    <button
                      onClick={() => handleDeleteCase(caseItem)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* رسالة عدم وجود بيانات */}
            {filteredCases.length === 0 && cases.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center text-gray-500 border border-gray-200">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mb-2 text-lg font-medium text-gray-700">لا توجد قضايا</p>
                    <p className="mb-4 text-sm text-gray-500">ابدأ بإضافة أول قضية لك</p>
                    <button
                      onClick={handleAddNewCase}
                      className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      إضافة أول قضية
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* رسالة عدم وجود نتائج بحث */}
            {filteredCases.length === 0 && cases.length > 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500 border border-gray-200">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="mb-2 text-lg font-medium text-gray-700">لم يتم العثور على قضايا مطابقة</p>
                    <p className="text-sm text-gray-500">جرب تغيير معايير البحث أو الفلترة</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* معلومات العد */}
      {cases.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            عرض <span className="font-medium">{filteredCases.length}</span> من أصل <span className="font-medium">{cases.length}</span> قضية
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCases;
