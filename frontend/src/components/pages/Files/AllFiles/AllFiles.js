import React, { useState } from 'react';

const AllFiles = () => {
  // يمكن تعريف حالات للبحث والفلترة هنا
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // بيانات نموذجية للملفات
  const files = [
    {
      id: 1,
      name: 'ملخص قضية الشركة ضد المقاول',
      fileType: 'PDF',
      icon: 'pdf',
      uploadDate: '23-04-2025',
      size: '1.2 MB'
    },
    {
      id: 2,
      name: 'عقد تأسيس الشركة',
      fileType: 'DOCX',
      icon: 'word',
      uploadDate: '20-04-2025',
      size: '850 KB'
    },
    {
      id: 3,
      name: 'تقرير الأرباح الربع سنوي',
      fileType: 'XLSX',
      icon: 'excel',
      uploadDate: '15-04-2025',
      size: '2.8 MB'
    },
    {
      id: 4,
      name: 'عرض تقديمي للمشروع الجديد',
      fileType: 'PPTX',
      icon: 'powerpoint',
      uploadDate: '10-04-2025',
      size: '5.2 MB'
    },
    {
      id: 5,
      name: 'صورة الصك العقاري',
      fileType: 'JPG',
      icon: 'image',
      uploadDate: '05-04-2025',
      size: '3.1 MB'
    },
    {
      id: 6,
      name: 'مخطط الموقع',
      fileType: 'PNG',
      icon: 'image',
      uploadDate: '02-04-2025',
      size: '4.7 MB'
    },
    {
      id: 7,
      name: 'عقد إيجار المكتب الجديد',
      fileType: 'PDF',
      icon: 'pdf',
      uploadDate: '01-04-2025',
      size: '1.5 MB'
    },
    {
      id: 8,
      name: 'ملف نسخة احتياطية للنظام',
      fileType: 'ZIP',
      icon: 'archive',
      uploadDate: '30-03-2025',
      size: '120 MB'
    }
  ];

  // فلترة الملفات
  const filteredFiles = files.filter(file => {
    // فلتر البحث
    const searchMatch = searchTerm === '' || 
      file.name.includes(searchTerm) || 
      file.fileType.includes(searchTerm);
    
    // فلتر نوع الملف
    const typeMatch = filterType === '' || file.fileType === filterType;
    
    // فلتر التاريخ
    let dateMatch = true;
    if (filterDate !== '') {
      const today = new Date();
      const fileDate = new Date(
        file.uploadDate.split('-').reverse().join('-')
      );
      
      if (filterDate === 'today') {
        dateMatch = fileDate.toDateString() === today.toDateString();
      } else if (filterDate === 'week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        dateMatch = fileDate >= lastWeek;
      } else if (filterDate === 'month') {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        dateMatch = fileDate >= lastMonth;
      } else if (filterDate === 'year') {
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        dateMatch = fileDate >= lastYear;
      }
    }
    
    return searchMatch && typeMatch && dateMatch;
  });

  // وظيفة لتحديد أيقونة الملف بناءً على نوعه
  const getFileIcon = (iconType) => {
    switch (iconType) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'word':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        );
      case 'excel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'powerpoint':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'archive':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">الملفّات</h1>
      
      {/* قسم البحث والفلترة */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* البحث */}
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="البحث عن ملف..." 
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
          
          {/* فلتر نوع الملف */}
          <div className="w-40">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الأنواع</option>
              <option value="PDF">PDF</option>
              <option value="DOCX">Word</option>
              <option value="XLSX">Excel</option>
              <option value="PPTX">PowerPoint</option>
              <option value="JPG">صورة</option>
              <option value="PNG">صورة</option>
              <option value="ZIP">أرشيف</option>
            </select>
          </div>
          
          {/* فلتر التاريخ */}
          <div className="w-48">
            <select 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="year">هذه السنة</option>
            </select>
          </div>
        </div>
        
        {/* زر إضافة ملف جديد */}
        <button className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          رفع ملف جديد
        </button>
      </div>
      
      {/* عرض الملفات */}
      {filteredFiles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredFiles.map(file => (
              <div key={file.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md">
                <div className="flex items-center justify-center h-40 bg-gray-100">
                  {getFileIcon(file.icon)}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">{file.fileType} - {file.size}</span>
                    <span className="text-xs text-gray-500">{file.uploadDate}</span>
                  </div>
                  <div className="flex justify-between mt-3 space-x-2">
                    <button className="flex items-center justify-center p-1 text-blue-600 transition-colors rounded-md hover:bg-blue-50" title="عرض">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="flex items-center justify-center p-1 text-green-600 transition-colors rounded-md hover:bg-green-50" title="تنزيل">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button className="flex items-center justify-center p-1 text-yellow-600 transition-colors rounded-md hover:bg-yellow-50" title="تعديل">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="flex items-center justify-center p-1 text-red-600 transition-colors rounded-md hover:bg-red-50" title="حذف">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* ترقيم الصفحات */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              عرض <span className="font-medium">{filteredFiles.length}</span> من أصل <span className="font-medium">{files.length}</span> ملف
            </div>
            <div className="flex space-x-1 space-x-reverse">
              <button className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                السابق
              </button>
              <button className="px-3 py-1 text-sm text-white bg-blue-600 border border-blue-600 rounded-md">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                التالي
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mb-2 text-lg font-medium">لم يتم العثور على ملفات</h3>
          <p>لا توجد ملفات تطابق معايير البحث المحددة.</p>
        </div>
      )}
    </div>
  );
};

export default AllFiles;