import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';

const Dashboard = () => {
  // استخدام معلومات المستخدم وأدواره من سياق المصادقة
  const { user, isAdmin, isAvocat, isSecretaire } = useAuth();
  
  // حالة تخزين الإحصائيات، سيتم تحديثها لاحقًا من البيانات الحقيقية من API
  const [stats, setStats] = useState({
    activeCases: 24,
    newClients: 12,
    paidInvoices: 15,
    upcomingSessions: 7
  });
  
  // حالة تخزين قائمة المهام حسب دور المستخدم
  const [tasks, setTasks] = useState([]);
  
  // حالة تخزين الجلسات القادمة
  const [upcomingSessions, setUpcomingSessions] = useState([
    { id: 1, caseNumber: 'QA-2023-156', title: 'قضية شركة الوفاء', date: '2025-05-20', time: '09:30', location: 'المحكمة التجارية - القاعة 3' },
    { id: 2, caseNumber: 'QA-2023-187', title: 'قضية السيد أحمد علي', date: '2025-05-21', time: '11:00', location: 'المحكمة المدنية - القاعة 5' },
    { id: 3, caseNumber: 'QA-2022-341', title: 'قضية مؤسسة الإعمار', date: '2025-05-22', time: '10:15', location: 'المحكمة العقارية - القاعة 2' }
  ]);
  
  // دالة للحصول على مهام مختلفة حسب دور المستخدم
  const getTasksByRole = () => {
    if (isAdmin) {
      return [
        { id: 1, title: 'متابعة أداء المحامين', priority: 'high', dueDate: '2025-05-20' },
        { id: 2, title: 'مراجعة التقارير المالية الشهرية', priority: 'medium', dueDate: '2025-05-25' },
        { id: 3, title: 'اجتماع مع الشركاء', priority: 'high', dueDate: '2025-05-19' },
        { id: 4, title: 'تحديث سياسات المكتب', priority: 'low', dueDate: '2025-05-30' }
      ];
    } else if (isAvocat) {
      return [
        { id: 1, title: 'تحضير مذكرة الدفاع - قضية #156', priority: 'high', dueDate: '2025-05-19' },
        { id: 2, title: 'اجتماع مع العميل أحمد علي', priority: 'medium', dueDate: '2025-05-20' },
        { id: 3, title: 'زيارة موقع النزاع - قضية #187', priority: 'medium', dueDate: '2025-05-21' },
        { id: 4, title: 'مراجعة أوراق القضية #341', priority: 'high', dueDate: '2025-05-18' }
      ];
    } else if (isSecretaire) {
      return [
        { id: 1, title: 'تنظيم ملفات القضايا الجديدة', priority: 'medium', dueDate: '2025-05-18' },
        { id: 2, title: 'إرسال إشعارات الجلسات للعملاء', priority: 'high', dueDate: '2025-05-19' },
        { id: 3, title: 'تحديث سجل المواعيد', priority: 'low', dueDate: '2025-05-20' },
        { id: 4, title: 'تأكيد مواعيد الجلسات القادمة', priority: 'high', dueDate: '2025-05-18' }
      ];
    }
    
    return [];
  };
  
  // تحميل المهام عند بدء المكون
  useEffect(() => {
    const roleTasks = getTasksByRole();
    setTasks(roleTasks);
  }, [isAdmin, isAvocat, isSecretaire]);
  
  // رسم الأولوية بلون مختلف
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // تهيئة ترجمة نص الأولوية
  const translatePriority = (priority) => {
    switch (priority) {
      case 'high':
        return 'عالية';
      case 'medium':
        return 'متوسطة';
      case 'low':
        return 'منخفضة';
      default:
        return 'غير محددة';
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      {/* رأس الصفحة والترحيب */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">مرحباً، {user?.nom || 'المستخدم'}!</h1>
        <p className="text-gray-600">
          {isAdmin && 'هذه لوحة تحكم المشرف، يمكنك متابعة جميع أنشطة المكتب من هنا.'}
          {isAvocat && 'هذه لوحة تحكم المحامي، يمكنك متابعة القضايا والجلسات من هنا.'}
          {isSecretaire && 'هذه لوحة تحكم السكرتير، يمكنك متابعة المواعيد والمهام من هنا.'}
        </p>
      </div>
      
      {/* القسم الأول - ملخص الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* بطاقة إحصائية - القضايا النشطة */}
        <div className="p-4 border-r-4 border-primary-500 rounded-lg shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">القضايا النشطة</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">{stats.activeCases}</h2>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">ارتفاع بنسبة 8% من الشهر الماضي</p>
        </div>

        {/* بطاقة إحصائية - العملاء الجدد */}
        <div className="p-4 border-r-4 border-secondary-500 rounded-lg shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">العملاء الجدد</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">{stats.newClients}</h2>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">ارتفاع بنسبة 12% من الشهر الماضي</p>
        </div>

        {/* بطاقة إحصائية - الفواتير المدفوعة - تظهر فقط للمشرف والمحامي */}
        {(isAdmin || isAvocat) && (
          <div className="p-4 border-r-4 border-purple-500 rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">الفواتير المدفوعة</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-800">{stats.paidInvoices}</h2>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">5 فواتير جديدة هذا الأسبوع</p>
          </div>
        )}

        {/* بطاقة إحصائية - الجلسات القادمة */}
        <div className="p-4 border-r-4 rounded-lg shadow-sm bg-white border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">الجلسات القادمة</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">{stats.upcomingSessions}</h2>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">3 جلسات اليوم</p>
        </div>
      </div>

      {/* الأقسام الرئيسية */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* القسم الأول - الجلسات القادمة */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">الجلسات القادمة</h2>
              <button className="px-3 py-1 text-sm text-primary-600 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition">
                عرض الكل
              </button>
            </div>
            <div className="p-4">
              {upcomingSessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-gray-700 border-b border-gray-200 bg-gray-50">
                        <th className="p-2 font-medium text-right">رقم القضية</th>
                        <th className="p-2 font-medium text-right">العنوان</th>
                        <th className="p-2 font-medium text-right">التاريخ</th>
                        <th className="p-2 font-medium text-right">الوقت</th>
                        <th className="p-2 font-medium text-right">المكان</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingSessions.map(session => (
                        <tr key={session.id} className="text-sm border-b border-gray-100 hover:bg-gray-50 last:border-b-0">
                          <td className="p-3 text-gray-800">{session.caseNumber}</td>
                          <td className="p-3 text-gray-800">{session.title}</td>
                          <td className="p-3 text-gray-600">{new Date(session.date).toLocaleDateString('ar-EG')}</td>
                          <td className="p-3 text-gray-600">{session.time}</td>
                          <td className="p-3 text-gray-600">{session.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">لا توجد جلسات قادمة حاليًا</p>
              )}
            </div>
          </div>
        </div>

        {/* القسم الثاني - المهام الحالية */}
        <div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">المهام الحالية</h2>
              <button className="px-3 py-1 text-sm text-primary-600 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition">
                إضافة مهمة
              </button>
            </div>
            <div className="p-4">
              {tasks.length > 0 ? (
                <ul className="space-y-3">
                  {tasks.map(task => (
                    <li key={task.id} className="flex items-start p-3 border border-gray-100 rounded-md">
                      <div className="flex-shrink-0">
                        <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      </div>
                      <div className="mr-3 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-gray-800">{task.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityClass(task.priority)}`}>
                            {translatePriority(task.priority)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          تاريخ الاستحقاق: {new Date(task.dueDate).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-center text-gray-500">لا توجد مهام حالية</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;