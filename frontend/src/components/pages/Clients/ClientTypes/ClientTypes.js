import React, { useState, useEffect } from 'react';
import { clientTypeService } from '../../../../services/api';

// تعريف ثوابت للفئات المشتركة لتقليل التكرار
const BUTTON_CLASSES = "flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700";
const BADGE_CLASSES = {
  blue: "px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full",
  green: "px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full",
  yellow: "px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full",
  red: "px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full",
  gray: "px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full",
  purple: "px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full",
};

const ClientTypes = () => {
  // حالة البيانات والتحميل
  const [clientTypes, setClientTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالة البحث
  const [searchTerm, setSearchTerm] = useState('');
  
  // حالة العرض للنموذج
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentType, setCurrentType] = useState({ name: '', description: '', color: '#3B82F6' });
  
  // خيارات الألوان
  const colorOptions = [
    { name: 'أزرق', class: 'bg-blue-600', value: '#3B82F6' },
    { name: 'أرجواني', class: 'bg-purple-600', value: '#9333EA' },
    { name: 'رمادي', class: 'bg-gray-600', value: '#4B5563' },
    { name: 'أخضر', class: 'bg-green-600', value: '#059669' },
    { name: 'أصفر', class: 'bg-yellow-600', value: '#D97706' },
    { name: 'أحمر', class: 'bg-red-600', value: '#DC2626' }
  ];

  // تحميل البيانات عند التحميل الأول
  useEffect(() => {
    loadClientTypes();
  }, []);

  // دالة تحميل أنواع العملاء من API
  const loadClientTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientTypeService.getAllClientTypes();
      setClientTypes(response.data);
    } catch (err) {
      console.error('خطأ في تحميل أنواع العملاء:', err);
      setError('فشل في تحميل أنواع العملاء. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // تصفية أنواع العملاء حسب البحث
  const filteredTypes = clientTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // إضافة نوع عميل جديد
  const addClientType = () => {
    setCurrentType({ name: '', description: '', color: '#3B82F6' });
    setEditMode(false);
    setShowModal(true);
  };

  // تعديل نوع عميل
  const editClientType = (type) => {
    setCurrentType({...type});
    setEditMode(true);
    setShowModal(true);
  };

  // حفظ النوع (إضافة أو تعديل)
  const saveClientType = async () => {
    if (currentType.name.trim() === '') return;
    
    try {
      setLoading(true);
      if (editMode) {
        await clientTypeService.updateClientType(currentType.id, currentType);
      } else {
        await clientTypeService.createClientType(currentType);
      }
      
      // إعادة تحميل البيانات
      await loadClientTypes();
      setShowModal(false);
    } catch (err) {
      console.error('خطأ في حفظ نوع العميل:', err);
      setError('فشل في حفظ نوع العميل. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // حذف نوع عميل
  const deleteClientType = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا النوع؟')) {
      try {
        setLoading(true);
        await clientTypeService.deleteClientType(id);
        await loadClientTypes();
      } catch (err) {
        console.error('خطأ في حذف نوع العميل:', err);
        if (err.response && err.response.status === 409) {
          setError('لا يمكن حذف نوع العميل لأنه مرتبط بعملاء موجودين.');
        } else {
          setError('فشل في حذف نوع العميل. يرجى المحاولة مرة أخرى.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // الحرف الأول من اسم النوع
  const getInitial = name => {
    return name.charAt(0);
  };

  // الحصول على فئة CSS للون
  const getColorClass = (color) => {
    const colorMap = {
      '#3B82F6': 'bg-blue-600',
      '#9333EA': 'bg-purple-600',
      '#4B5563': 'bg-gray-600',
      '#059669': 'bg-green-600',
      '#D97706': 'bg-yellow-600',
      '#DC2626': 'bg-red-600'
    };
    return colorMap[color] || 'bg-blue-600';  };  // تنسيق التاريخ بالأرقام dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">أنواع العملاء</h1>
      
      {/* رسالة الخطأ */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-left text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* قسم البحث وإضافة نوع جديد */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="البحث في أنواع العملاء..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <button 
          onClick={addClientType}
          disabled={loading}
          className={`${BUTTON_CLASSES} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          إضافة نوع جديد
        </button>
      </div>
      
      {/* مؤشر التحميل */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          <span className="mr-2 text-gray-600">جاري التحميل...</span>
        </div>
      )}
      
      {/* عرض أنواع العملاء */}
      {!loading && (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">        {filteredTypes.map(type => (
          <div key={type.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div 
                  className={`flex items-center justify-center flex-shrink-0 w-10 h-10 ml-3 text-xl font-medium text-white rounded-full ${getColorClass(type.color)}`}
                >
                  {getInitial(type.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">{type.clientCount || 0}</span> عميل
              </div>
              <div>أُضيف {formatDate(type.createdDate)}</div>
            </div>
              <div className="flex justify-end pt-3 mt-3 space-x-3 space-x-reverse border-t border-gray-100">
              <button 
                onClick={() => editClientType(type)}
                disabled={loading}
                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50" 
                title="تعديل"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button 
                onClick={() => deleteClientType(type.id)}
                disabled={loading}
                className="text-red-600 hover:text-red-900 disabled:opacity-50" 
                title="حذف"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
          {filteredTypes.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500 col-span-full">
            {clientTypes.length === 0 ? 'لا توجد أنواع عملاء. ابدأ بإضافة نوع جديد.' : 'لم يتم العثور على أنواع عملاء مطابقة للبحث'}
          </div>
        )}
      </div>
      )}
      
      {/* النموذج المنبثق لإضافة/تعديل نوع */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              {editMode ? 'تعديل نوع العملاء' : 'إضافة نوع عملاء جديد'}
            </h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">الاسم</label>
              <input 
                type="text" 
                value={currentType.name}
                onChange={(e) => setCurrentType({...currentType, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اسم النوع"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">الوصف</label>
              <textarea 
                value={currentType.description}
                onChange={(e) => setCurrentType({...currentType, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="وصف النوع"
                rows="3"
              />
            </div>
              <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">اللون</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <div 
                    key={color.value}
                    onClick={() => setCurrentType({...currentType, color: color.value})}
                    className={`w-8 h-8 rounded-full cursor-pointer ${color.class} ${currentType.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
              <div className="flex justify-between pt-4 mt-6 border-t border-gray-200">
              <button 
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                إلغاء
              </button>
              <button 
                onClick={saveClientType}
                disabled={loading || currentType.name.trim() === ''}
                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الحفظ...' : (editMode ? 'حفظ التعديلات' : 'إضافة النوع')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTypes;