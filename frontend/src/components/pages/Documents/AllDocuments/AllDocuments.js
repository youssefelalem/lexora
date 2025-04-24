import React, { useState } from 'react';

const AllDocuments = () => {
  // يمكن تعريف حالات للبحث والفلترة هنا
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCase, setFilterCase] = useState('');

  // بيانات نموذجية للمستندات
  const documents = [
    {
      id: 1,
      name: 'عقد بيع عقار',
      fileType: 'PDF',
      type: 'عقد',
      caseNumber: 'CAS-2025-001',
      uploadDate: '12-01-2025',
      size: '1.2 MB'
    },
    {
      id: 2,
      name: 'صك ملكية العقار',
      fileType: 'JPG',
      type: 'صك ملكية',
      caseNumber: 'CAS-2025-001',
      uploadDate: '12-01-2025',
      size: '2.5 MB'
    },
    {
      id: 3,
      name: 'محضر اجتماع المحكمة',
      fileType: 'DOCX',
      type: 'محضر',
      caseNumber: 'CAS-2025-002',
      uploadDate: '15-02-2025',
      size: '856 KB'
    },
    {
      id: 4,
      name: 'مذكرة دفاع',
      fileType: 'PDF',
      type: 'مذكرة',
      caseNumber: 'CAS-2025-003',
      uploadDate: '20-03-2025',
      size: '1.7 MB'
    }
  ];

  // فلترة المستندات
  const filteredDocuments = documents.filter(doc => {
    return (
      (searchTerm === '' || doc.name.includes(searchTerm)) && 
      (filterType === '' || doc.type === filterType) &&
      (filterCase === '' || doc.caseNumber === filterCase)
    );
  });

  // وظيفة لتحديد أيقونة المستند بناء على نوعه
  const getDocumentIcon = (type, fileType) => {
    if (type === 'عقد' || fileType === 'PDF') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (type === 'صك ملكية') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
    } else if (type === 'محضر' || fileType === 'DOCX') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      );
    } else if (type === 'مذكرة') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  // وظيفة لتحديد لون نوع المستند
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'عقد':
        return 'px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full';
      case 'صك ملكية':
        return 'px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full';
      case 'محضر':
        return 'px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full';
      case 'مذكرة':
        return 'px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full';
      default:
        return 'px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full';
    }
  };

  // وظيفة لتحديد لون خلفية أيقونة المستند
  const getIconBgClass = (type) => {
    switch (type) {
      case 'عقد':
        return 'bg-blue-100';
      case 'صك ملكية':
        return 'bg-green-100';
      case 'محضر':
        return 'bg-purple-100';
      case 'مذكرة':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">المستندات</h1>
      
      {/* قسم البحث والفلترة */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* البحث */}
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="البحث عن مستند..." 
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
          
          {/* فلتر نوع المستند */}
          <div className="w-40">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الأنواع</option>
              <option value="عقد">عقد</option>
              <option value="صك ملكية">صك ملكية</option>
              <option value="محضر">محضر</option>
              <option value="مذكرة">مذكرة</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>
          
          {/* فلتر القضية */}
          <div className="w-40">
            <select 
              value={filterCase}
              onChange={(e) => setFilterCase(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع القضايا</option>
              <option value="CAS-2025-001">CAS-2025-001</option>
              <option value="CAS-2025-002">CAS-2025-002</option>
              <option value="CAS-2025-003">CAS-2025-003</option>
            </select>
          </div>
        </div>
        
        {/* زر إضافة مستند جديد */}
        <button className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          إضافة مستند جديد
        </button>
      </div>
      
      {/* جدول المستندات */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm font-medium text-right text-gray-700 bg-gray-50">
              <th className="px-4 py-3 border-b border-gray-200">اسم المستند</th>
              <th className="px-4 py-3 border-b border-gray-200">النوع</th>
              <th className="px-4 py-3 border-b border-gray-200">القضية المرتبطة</th>
              <th className="px-4 py-3 border-b border-gray-200">تاريخ الرفع</th>
              <th className="px-4 py-3 border-b border-gray-200">الحجم</th>
              <th className="px-4 py-3 border-b border-gray-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map(doc => (
                <tr key={doc.id} className="text-sm text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center flex-shrink-0 w-8 h-8 ml-2 rounded-md ${getIconBgClass(doc.type)}`}>
                        {getDocumentIcon(doc.type, doc.fileType)}
                      </div>
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.fileType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span className={getTypeBadgeClass(doc.type)}>
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">{doc.caseNumber}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{doc.uploadDate}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{doc.size}</td>
                  <td className="px-4 py-3 border-b border-gray-200 whitespace-nowrap">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <button className="text-blue-600 hover:text-blue-900" title="عرض المستند">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900" title="تعديل">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="حذف">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500 border-b border-gray-200">
                  لم يتم العثور على مستندات مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* ترقيم الصفحات */}
      {filteredDocuments.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            عرض <span className="font-medium">{filteredDocuments.length}</span> من أصل <span className="font-medium">{documents.length}</span> مستند
          </div>
          <div className="flex space-x-1 space-x-reverse">
            <button className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
              السابق
            </button>
            <button className="px-3 py-1 text-sm text-white bg-blue-600 border border-blue-600 rounded-md">
              1
            </button>
            {documents.length > 2 && (
              <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                2
              </button>
            )}
            <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDocuments;