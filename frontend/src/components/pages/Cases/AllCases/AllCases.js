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
  orange: "px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full",
};

const AllCases = () => {
  // بيانات نموذجية للقضايا
  const [cases, setCases] = useState([
    { 
      id: 'C-2024-001', 
      title: 'قضية نزاع عقاري', 
      client: 'شركة الفجر للتكنولوجيا',
      clientId: 1,
      type: 'عقاري',
      court: 'المحكمة الإبتدائية - الرباط',
      lawyer: 'أحمد محمود',
      nextSession: '30-04-2025',
      status: 'جارية',
      priority: 'عالية',
      created: '15-01-2024'
    },
    { 
      id: 'C-2024-002', 
      title: 'دعوى تعويض', 
      client: 'محمد علي',
      clientId: 2,
      type: 'مدني',
      court: 'محكمة الاستئناف - الدار البيضاء',
      lawyer: 'سارة أحمد',
      nextSession: '15-05-2025',
      status: 'جارية',
      priority: 'متوسطة',
      created: '23-01-2024'
    },
    { 
      id: 'C-2024-003', 
      title: 'نزاع تجاري', 
      client: 'مؤسسة النور للاستشارات',
      clientId: 3,
      type: 'تجاري',
      court: 'المحكمة التجارية - مراكش',
      lawyer: 'خالد محمد',
      nextSession: '10-05-2025',
      status: 'معلقة',
      priority: 'منخفضة',
      created: '05-02-2024'
    },
    { 
      id: 'C-2024-004', 
      title: 'قضية أحوال شخصية', 
      client: 'خالد عبد الرحمن',
      clientId: 4,
      type: 'أحوال شخصية',
      court: 'محكمة الأسرة - فاس',
      lawyer: 'لمياء علي',
      nextSession: null,
      status: 'مغلقة',
      priority: 'متوسطة',
      created: '18-02-2024'
    },
    { 
      id: 'C-2024-005', 
      title: 'دعوى ملكية فكرية', 
      client: 'شركة السلام للتجارة',
      clientId: 5,
      type: 'ملكية فكرية',
      court: 'المحكمة التجارية - الرباط',
      lawyer: 'عمر حسن',
      nextSession: '05-05-2025',
      status: 'جارية',
      priority: 'عالية',
      created: '22-03-2024'
    },
    { 
      id: 'C-2024-006', 
      title: 'قضية ضريبية', 
      client: 'شركة الفجر للتكنولوجيا',
      clientId: 1,
      type: 'إداري',
      court: 'المحكمة الإدارية - الرباط',
      lawyer: 'أحمد محمود',
      nextSession: '20-05-2025',
      status: 'جارية',
      priority: 'عالية',
      created: '10-04-2024'
    },
    { 
      id: 'C-2024-007', 
      title: 'نزاع عمالي', 
      client: 'شركة السلام للتجارة',
      clientId: 5,
      type: 'عمالي',
      court: 'محكمة العمل - الدار البيضاء',
      lawyer: 'سارة أحمد',
      nextSession: null,
      status: 'مؤجلة',
      priority: 'متوسطة',
      created: '15-04-2024'
    },
  ]);

  // حالة البحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterPriority, setFilterPriority] = useState('الكل');

  // خيارات الفلترة
  const caseTypes = ['الكل', 'عقاري', 'مدني', 'تجاري', 'أحوال شخصية', 'ملكية فكرية', 'إداري', 'عمالي'];
  const statusTypes = ['الكل', 'جارية', 'معلقة', 'مؤجلة', 'مغلقة'];
  const priorityTypes = ['الكل', 'عالية', 'متوسطة', 'منخفضة'];

  // تصفية القضايا حسب البحث والفلترة
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = 
      caseItem.title.includes(searchTerm) ||
      caseItem.client.includes(searchTerm) ||
      caseItem.id.includes(searchTerm) ||
      caseItem.court.includes(searchTerm);
    
    const matchesType = filterType === 'الكل' || caseItem.type === filterType;
    const matchesStatus = filterStatus === 'الكل' || caseItem.status === filterStatus;
    const matchesPriority = filterPriority === 'الكل' || caseItem.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // حالة القضية إلى لون
  const getStatusBadgeClass = status => {
    switch(status) {
      case 'جارية':
        return BADGE_CLASSES.green;
      case 'معلقة':
        return BADGE_CLASSES.yellow;
      case 'مؤجلة':
        return BADGE_CLASSES.orange;
      case 'مغلقة':
        return BADGE_CLASSES.gray;
      default:
        return BADGE_CLASSES.blue;
    }
  };

  // أولوية القضية إلى لون
  const getPriorityBadgeClass = priority => {
    switch(priority) {
      case 'عالية':
        return BADGE_CLASSES.red;
      case 'متوسطة':
        return BADGE_CLASSES.yellow;
      case 'منخفضة':
        return BADGE_CLASSES.blue;
      default:
        return BADGE_CLASSES.gray;
    }
  };

  // نوع القضية إلى لون
  const getCaseTypeBadgeClass = type => {
    switch(type) {
      case 'عقاري':
        return BADGE_CLASSES.blue;
      case 'مدني':
        return BADGE_CLASSES.green;
      case 'تجاري':
        return BADGE_CLASSES.purple;
      case 'أحوال شخصية':
        return BADGE_CLASSES.yellow;
      case 'ملكية فكرية':
        return BADGE_CLASSES.orange;
      case 'إداري':
        return BADGE_CLASSES.gray;
      case 'عمالي':
        return BADGE_CLASSES.red;
      default:
        return BADGE_CLASSES.blue;
    }
  };

  // تنسيق تاريخ الجلسة القادمة
  const formatNextSession = nextSession => {
    if (!nextSession) return 'لا يوجد';
    
    const today = new Date();
    const sessionDate = new Date(
      nextSession.split('-')[2], 
      parseInt(nextSession.split('-')[1]) - 1, 
      nextSession.split('-')[0]
    );
    
    // حساب الفرق بالأيام
    const diffTime = sessionDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-red-600">{nextSession} (متأخر)</span>;
    } else if (diffDays === 0) {
      return <span className="text-orange-600 font-medium">{nextSession} (اليوم)</span>;
    } else if (diffDays <= 7) {
      return <span className="text-yellow-600">{nextSession} (خلال {diffDays} أيام)</span>;
    } else {
      return nextSession;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">جميع القضايا</h1>
      
      {/* قسم البحث والفلترة */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="البحث في القضايا..." 
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
          
          {/* فلتر نوع القضية */}
          <div className="w-40">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {caseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* فلتر حالة القضية */}
          <div className="w-40">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusTypes.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          {/* فلتر أولوية القضية */}
          <div className="w-40">
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityTypes.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button className={BUTTON_CLASSES}>
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          إضافة قضية جديدة
        </button>
      </div>
      
      {/* جدول القضايا */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm font-medium text-right text-gray-700 bg-gray-50">
              <th className="px-4 py-3 border-b border-gray-200">رقم القضية</th>
              <th className="px-4 py-3 border-b border-gray-200">عنوان القضية</th>
              <th className="px-4 py-3 border-b border-gray-200">العميل</th>
              <th className="px-4 py-3 border-b border-gray-200">النوع</th>
              <th className="px-4 py-3 border-b border-gray-200">المحكمة</th>
              <th className="px-4 py-3 border-b border-gray-200">الأولوية</th>
              <th className="px-4 py-3 border-b border-gray-200">الحالة</th>
              <th className="px-4 py-3 border-b border-gray-200">الجلسة القادمة</th>
              <th className="px-4 py-3 border-b border-gray-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredCases.map(caseItem => (
              <tr key={caseItem.id} className="text-sm text-gray-700 hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200 font-medium">
                  {caseItem.id}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <div className="font-medium">{caseItem.title}</div>
                  <div className="text-xs text-gray-500">{caseItem.lawyer}</div>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {caseItem.client}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className={getCaseTypeBadgeClass(caseItem.type)}>
                    {caseItem.type}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {caseItem.court}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className={getPriorityBadgeClass(caseItem.priority)}>
                    {caseItem.priority}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className={getStatusBadgeClass(caseItem.status)}>
                    {caseItem.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {formatNextSession(caseItem.nextSession)}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 whitespace-nowrap">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {/* عرض */}
                    <button className="text-blue-600 hover:text-blue-900" title="عرض التفاصيل">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    {/* تعديل */}
                    <button className="text-yellow-600 hover:text-yellow-900" title="تعديل">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    {/* حذف */}
                    <button className="text-red-600 hover:text-red-900" title="حذف">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    {/* إضافة جلسة */}
                    <button className="text-green-600 hover:text-green-900" title="إضافة جلسة">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredCases.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500 border-b border-gray-200">
                  لم يتم العثور على قضايا مطابقة للبحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* ترقيم الصفحات */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          عرض <span className="font-medium">{filteredCases.length}</span> من أصل <span className="font-medium">{cases.length}</span> قضية
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
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCases;