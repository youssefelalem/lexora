import React, { useState } from 'react';

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
  // بيانات نموذجية لأنواع العملاء
  const [clientTypes, setClientTypes] = useState([
    { 
      id: 1, 
      name: 'شركة', 
      description: 'شركات تجارية أو صناعية',
      count: 15,
      created: '10-01-2024',
      color: 'bg-blue-600'
    },
    { 
      id: 2, 
      name: 'فرد', 
      description: 'عملاء من الأفراد',
      count: 24,
      created: '10-01-2024',
      color: 'bg-purple-600'
    },
    { 
      id: 3, 
      name: 'مؤسسة', 
      description: 'مؤسسات وجمعيات غير ربحية',
      count: 8,
      created: '15-01-2024',
      color: 'bg-gray-600'
    },
    { 
      id: 4, 
      name: 'حكومي', 
      description: 'جهات ومؤسسات حكومية',
      count: 5,
      created: '20-02-2024',
      color: 'bg-green-600'
    },
    { 
      id: 5, 
      name: 'شراكة', 
      description: 'شراكة بين عدة كيانات',
      count: 3,
      created: '05-03-2024',
      color: 'bg-yellow-600'
    },
  ]);

  // حالة البحث
  const [searchTerm, setSearchTerm] = useState('');
  
  // حالة العرض للنموذج
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentType, setCurrentType] = useState({ name: '', description: '', color: 'bg-blue-600' });
  
  // خيارات الألوان
  const colorOptions = [
    { name: 'أزرق', class: 'bg-blue-600' },
    { name: 'أرجواني', class: 'bg-purple-600' },
    { name: 'رمادي', class: 'bg-gray-600' },
    { name: 'أخضر', class: 'bg-green-600' },
    { name: 'أصفر', class: 'bg-yellow-600' },
    { name: 'أحمر', class: 'bg-red-600' }
  ];

  // تصفية أنواع العملاء حسب البحث
  const filteredTypes = clientTypes.filter(type =>
    type.name.includes(searchTerm) || 
    type.description.includes(searchTerm)
  );

  // إضافة نوع عميل جديد
  const addClientType = () => {
    setCurrentType({ name: '', description: '', color: 'bg-blue-600' });
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
  const saveClientType = () => {
    if (currentType.name.trim() === '') return;
    
    if (editMode) {
      setClientTypes(clientTypes.map(type => 
        type.id === currentType.id ? {...currentType} : type
      ));
    } else {
      const newType = {
        ...currentType,
        id: clientTypes.length + 1,
        count: 0,
        created: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '-')
      };
      setClientTypes([...clientTypes, newType]);
    }
    
    setShowModal(false);
  };

  // حذف نوع عميل
  const deleteClientType = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا النوع؟')) {
      setClientTypes(clientTypes.filter(type => type.id !== id));
    }
  };

  // الحرف الأول من اسم النوع
  const getInitial = name => {
    return name.charAt(0);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">أنواع العملاء</h1>
      
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
          className={BUTTON_CLASSES}
        >
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          إضافة نوع جديد
        </button>
      </div>
      
      {/* عرض أنواع العملاء */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTypes.map(type => (
          <div key={type.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`flex items-center justify-center flex-shrink-0 w-10 h-10 ml-3 text-xl font-medium text-white rounded-full ${type.color}`}>
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
                <span className="font-medium">{type.count}</span> عميل
              </div>
              <div>أُضيف {type.created}</div>
            </div>
            
            <div className="flex justify-end pt-3 mt-3 space-x-3 space-x-reverse border-t border-gray-100">
              <button 
                onClick={() => editClientType(type)}
                className="text-yellow-600 hover:text-yellow-900" 
                title="تعديل"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button 
                onClick={() => deleteClientType(type.id)}
                className="text-red-600 hover:text-red-900" 
                title="حذف"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {filteredTypes.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500">
            لم يتم العثور على أنواع عملاء مطابقة للبحث
          </div>
        )}
      </div>
      
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
                    key={color.class}
                    onClick={() => setCurrentType({...currentType, color: color.class})}
                    className={`w-8 h-8 rounded-full cursor-pointer ${color.class} ${currentType.color === color.class ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-4 mt-6 border-t border-gray-200">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
              >
                إلغاء
              </button>
              <button 
                onClick={saveClientType}
                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {editMode ? 'حفظ التعديلات' : 'إضافة النوع'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTypes;