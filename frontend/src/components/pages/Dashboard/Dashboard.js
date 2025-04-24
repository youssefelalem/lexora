import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">لوحة التحكم</h1>
      
      {/* القسم الأول - ملخص الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* بطاقة إحصائية - القضايا النشطة */}
        <div className="p-4 bg-blue-50 border-r-4 border-blue-500 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">القضايا النشطة</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">24</h2>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">ارتفاع بنسبة 8% من الشهر الماضي</p>
        </div>

        {/* بطاقة إحصائية - العملاء الجدد */}
        <div className="p-4 bg-green-50 border-r-4 border-green-500 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">العملاء الجدد</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">12</h2>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">ارتفاع بنسبة 12% من الشهر الماضي</p>
        </div>

        {/* بطاقة إحصائية - الفواتير المدفوعة */}
        <div className="p-4 bg-purple-50 border-r-4 border-purple-500 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">الفواتير المدفوعة</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">15</h2>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">5 فواتير جديدة هذا الأسبوع</p>
        </div>

        {/* بطاقة إحصائية - الجلسات القادمة */}
        <div className="p-4 bg-amber-50 border-r-4 border-amber-500 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">الجلسات القادمة</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">7</h2>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">3 جلسات اليوم</p>
        </div>
      </div>

      {/* القسم الثاني - الرسوم البيانية وقائمة المهام */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        {/* الرسم البياني للقضايا */}
        <div className="col-span-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">إحصائيات القضايا</h2>
            <select className="p-2 text-sm border border-gray-300 rounded-md">
              <option value="thisMonth">هذا الشهر</option>
              <option value="lastMonth">الشهر الماضي</option>
              <option value="thisYear">هذه السنة</option>
            </select>
          </div>
          <div className="h-64 overflow-hidden">
            {/* هنا يمكن إضافة مكتبة رسوم بيانية مثل Chart.js أو Recharts */}
            <div className="flex items-end justify-around h-full mb-2 pt-10 px-4">
              <div className="flex flex-col items-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{ height: '40%' }}></div>
                <span className="mt-1 text-xs">يناير</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{ height: '65%' }}></div>
                <span className="mt-1 text-xs">فبراير</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{ height: '50%' }}></div>
                <span className="mt-1 text-xs">مارس</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{ height: '80%' }}></div>
                <span className="mt-1 text-xs">أبريل</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{ height: '60%' }}></div>
                <span className="mt-1 text-xs">مايو</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{ height: '70%' }}></div>
                <span className="mt-1 text-xs">يونيو</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{ height: '90%' }}></div>
                <span className="mt-1 text-xs">يوليو</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4 space-x-8 space-x-reverse text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 ml-1 bg-blue-500 rounded-full"></div>
              <span>قضايا جديدة</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 ml-1 bg-green-500 rounded-full"></div>
              <span>قضايا مغلقة</span>
            </div>
          </div>
        </div>

        {/* قائمة المهام */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">المهام القادمة</h2>
            <button className="p-1 text-blue-600 hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-white border border-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">تحضير جلسة قضية أحمد محمد</span>
                </div>
                <span className="text-xs text-red-500">اليوم</span>
              </div>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">إرسال فاتورة للعميل سارة أحمد</span>
                </div>
                <span className="text-xs text-amber-500">غداً</span>
              </div>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">مراجعة مستندات القضية رقم #134</span>
                </div>
                <span className="text-xs text-gray-500">26 أبريل</span>
              </div>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">الاجتماع مع فريق العمل</span>
                </div>
                <span className="text-xs text-gray-500">28 أبريل</span>
              </div>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">تحضير تقرير شهري</span>
                </div>
                <span className="text-xs text-gray-500">30 أبريل</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الثالث - آخر النشاطات والجلسات القادمة */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* آخر النشاطات */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">آخر النشاطات</h2>
            <button className="text-sm font-medium text-blue-600 hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-gray-800">تمت إضافة عميل جديد <span className="font-bold text-blue-600">خالد عمر</span></p>
                <p className="mt-1 text-xs text-gray-500">اليوم، 10:30 صباحاً</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-gray-800">تمت إضافة ملف جديد إلى القضية <span className="font-bold text-blue-600">#143</span></p>
                <p className="mt-1 text-xs text-gray-500">اليوم، 9:15 صباحاً</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-purple-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-gray-800">تم إصدار فاتورة جديدة للعميل <span className="font-bold text-blue-600">محمد علي</span></p>
                <p className="mt-1 text-xs text-gray-500">الأمس، 3:45 مساءً</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-amber-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-gray-800">تمت جدولة جلسة جديدة للقضية <span className="font-bold text-blue-600">#129</span></p>
                <p className="mt-1 text-xs text-gray-500">الأمس، 2:30 مساءً</p>
              </div>
            </div>
          </div>
        </div>

        {/* الجلسات القادمة */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">الجلسات القادمة</h2>
            <button className="text-sm font-medium text-blue-600 hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-white border-r-4 border-red-500 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-700">جلسة قضية أحمد محمد - محكمة الأسرة</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>اليوم 11:00 صباحاً</span>
              </div>
            </div>
            <div className="p-3 bg-white border-r-4 border-amber-500 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-700">جلسة استماع - قضية شركة السلام</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>اليوم 2:30 مساءً</span>
              </div>
            </div>
            <div className="p-3 bg-white border-r-4 border-blue-500 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-700">جلسة تحكيم - نزاع تجاري</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>غداً 10:00 صباحاً</span>
              </div>
            </div>
            <div className="p-3 bg-white border-r-4 border-gray-400 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-700">اجتماع مع العميل سامي خالد</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>غداً 3:15 مساءً</span>
              </div>
            </div>
            <div className="p-3 bg-white border-r-4 border-purple-500 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-700">جلسة محكمة - قضية العقارات</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>27 أبريل 9:30 صباحاً</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;