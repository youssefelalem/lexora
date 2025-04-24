import React, { useState } from 'react';

const AllSessions = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      caseNumber: 'CAS-2025-001',
      caseName: 'شركة أ ضد شركة ب',
      court: 'محكمة الاستئناف التجارية',
      date: '2025-05-15',
      time: '10:00 صباحًا',
      lawyer: 'أحمد محمد',
      status: 'قادمة',
      notes: 'تقديم مذكرة الدفاع والمستندات المؤيدة'
    },
    {
      id: 2,
      caseNumber: 'CAS-2025-002',
      caseName: 'محمد علي ضد شركة ج',
      court: 'المحكمة الابتدائية',
      date: '2025-05-18',
      time: '11:30 صباحًا',
      lawyer: 'سارة أحمد',
      status: 'قادمة',
      notes: 'سماع شهادة الشهود'
    },
    {
      id: 3,
      caseNumber: 'CAS-2025-003',
      caseName: 'مؤسسة د ضد مؤسسة هـ',
      court: 'محكمة التنفيذ',
      date: '2025-04-20',
      time: '09:00 صباحًا',
      lawyer: 'محمد علي',
      status: 'منتهية',
      notes: 'تم تأجيل الجلسة لتقديم مستندات إضافية'
    },
    {
      id: 4,
      caseNumber: 'CAS-2025-004',
      caseName: 'خالد عبد الله ضد شركة و',
      court: 'محكمة النقض',
      date: '2025-06-05',
      time: '10:30 صباحًا',
      lawyer: 'فاطمة محمود',
      status: 'قادمة',
      notes: 'مرافعة نهائية'
    },
    {
      id: 5,
      caseNumber: 'CAS-2025-005',
      caseName: 'شركة ز ضد مؤسسة ح',
      court: 'المحكمة الإدارية',
      date: '2025-04-10',
      time: '12:00 ظهرًا',
      lawyer: 'أحمد محمد',
      status: 'ملغاة',
      notes: 'تم إلغاء الجلسة بسبب تسوية ودية'
    }
  ]);

  // دالة للحصول على لون حالة الجلسة
  const getStatusColor = (status) => {
    switch (status) {
      case 'قادمة':
        return 'bg-blue-100 text-blue-800';
      case 'منتهية':
        return 'bg-green-100 text-green-800';
      case 'ملغاة':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedDateFilter, setSelectedDateFilter] = useState('الكل');

  // فلترة الجلسات استنادًا إلى البحث والحالة والتاريخ
  const filteredSessions = sessions.filter(session => {
    // فلترة البحث
    const searchMatch = 
      session.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.court.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lawyer.toLowerCase().includes(searchTerm.toLowerCase());
    
    // فلترة الحالة
    const statusMatch = selectedStatus === 'الكل' || session.status === selectedStatus;
    
    // فلترة التاريخ
    let dateMatch = true;
    const today = new Date();
    const sessionDate = new Date(session.date);
    
    if (selectedDateFilter === 'اليوم') {
      dateMatch = 
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear();
    } else if (selectedDateFilter === 'هذا الأسبوع') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(today);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      dateMatch = sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    } else if (selectedDateFilter === 'هذا الشهر') {
      dateMatch = 
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear();
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">جدول الجلسات</h1>
      
      {/* قسم البحث والفلترة */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="البحث في الجلسات..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* فلتر الحالة */}
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="الكل">جميع الحالات</option>
            <option value="قادمة">قادمة</option>
            <option value="منتهية">منتهية</option>
            <option value="ملغاة">ملغاة</option>
          </select>
          
          {/* فلتر التاريخ */}
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
          >
            <option value="الكل">جميع التواريخ</option>
            <option value="اليوم">اليوم</option>
            <option value="هذا الأسبوع">هذا الأسبوع</option>
            <option value="هذا الشهر">هذا الشهر</option>
          </select>
          
          <button className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
            <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            جلسة جديدة
          </button>
        </div>
      </div>
      
      {/* جدول الجلسات */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm font-medium text-right text-gray-700 bg-gray-50">
              <th className="px-4 py-3 border-b border-gray-200">رقم القضية</th>
              <th className="px-4 py-3 border-b border-gray-200">عنوان القضية</th>
              <th className="px-4 py-3 border-b border-gray-200">المحكمة</th>
              <th className="px-4 py-3 border-b border-gray-200">التاريخ</th>
              <th className="px-4 py-3 border-b border-gray-200">الوقت</th>
              <th className="px-4 py-3 border-b border-gray-200">المحامي المسؤول</th>
              <th className="px-4 py-3 border-b border-gray-200">الحالة</th>
              <th className="px-4 py-3 border-b border-gray-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredSessions.map(session => (
              <tr key={session.id} className="text-sm text-gray-700 hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200">{session.caseNumber}</td>
                <td className="px-4 py-3 border-b border-gray-200">{session.caseName}</td>
                <td className="px-4 py-3 border-b border-gray-200">{session.court}</td>
                <td className="px-4 py-3 border-b border-gray-200">{formatDate(session.date)}</td>
                <td className="px-4 py-3 border-b border-gray-200">{session.time}</td>
                <td className="px-4 py-3 border-b border-gray-200">{session.lawyer}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200 whitespace-nowrap">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button 
                      title="تفاصيل الجلسة" 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      title="تعديل الجلسة"
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      title="حذف الجلسة"
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* مذكرات وتفاصيل إضافية */}
      <div className="mt-6 bg-gray-50 rounded-lg">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800">ملاحظات وتذكيرات</h3>
          
          {filteredSessions.length > 0 && (
            <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 rtl:mr-3 rtl:ml-0">
                  <p className="text-sm text-gray-700">
                    {filteredSessions[0].notes}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {filteredSessions.length === 0 && (
            <div className="mt-3 p-3 text-center text-gray-500">
              لا توجد جلسات مطابقة للفلاتر المحددة
            </div>
          )}
        </div>
      </div>
      
      {/* ترقيم الصفحات */}
      {filteredSessions.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            عرض <span className="font-medium">{filteredSessions.length}</span> من أصل <span className="font-medium">{sessions.length}</span> جلسة
          </div>
          <div className="flex space-x-1 space-x-reverse">
            <button className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
              السابق
            </button>
            <button className="px-3 py-1 text-sm text-white bg-blue-600 border border-blue-600 rounded-md">
              1
            </button>
            <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSessions;