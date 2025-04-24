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

const AllInvoices = () => {
  // بيانات نموذجية للفواتير
  const [invoices, setInvoices] = useState([
    { 
      id: 'INV-2024-001', 
      client: {
        name: 'شركة الفجر للتكنولوجيا',
        type: 'شركة'
      },
      case: 'قضية رقم 12/2024',
      amount: 12500,
      issueDate: '15-01-2024',
      dueDate: '15-02-2024',
      status: 'مدفوعة',
      paymentMethod: 'تحويل بنكي'
    },
    { 
      id: 'INV-2024-002', 
      client: {
        name: 'محمد علي',
        type: 'فرد'
      },
      case: 'قضية رقم 14/2024',
      amount: 3500,
      issueDate: '25-01-2024',
      dueDate: '25-02-2024',
      status: 'معلقة',
      paymentMethod: 'نقدا'
    },
    { 
      id: 'INV-2024-003', 
      client: {
        name: 'مؤسسة النور للاستشارات',
        type: 'مؤسسة'
      },
      case: 'قضية رقم 18/2024',
      amount: 8750,
      issueDate: '05-02-2024',
      dueDate: '05-03-2024',
      status: 'متأخرة',
      paymentMethod: 'شيك'
    },
    { 
      id: 'INV-2024-004', 
      client: {
        name: 'خالد عبد الرحمن',
        type: 'فرد'
      },
      case: 'قضية رقم 22/2024',
      amount: 2000,
      issueDate: '18-02-2024',
      dueDate: '18-03-2024',
      status: 'مدفوعة جزئيا',
      paymentMethod: 'بطاقة ائتمان'
    },
    { 
      id: 'INV-2024-005', 
      client: {
        name: 'شركة السلام للتجارة',
        type: 'شركة'
      },
      case: 'قضية رقم 25/2024',
      amount: 15000,
      issueDate: '22-03-2024',
      dueDate: '22-04-2024',
      status: 'معلقة',
      paymentMethod: 'تحويل بنكي'
    },
  ]);

  // حالة البحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterDateRange, setFilterDateRange] = useState('الكل');

  // خيارات الفلترة
  const statusTypes = ['الكل', 'مدفوعة', 'معلقة', 'متأخرة', 'مدفوعة جزئيا', 'ملغاة'];
  const dateRanges = ['الكل', 'هذا الشهر', 'الشهر الماضي', 'آخر 3 أشهر', 'آخر 6 أشهر'];

  // تصفية الفواتير حسب البحث والفلترة
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.case.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'الكل' || invoice.status === filterStatus;
    
    // منطق فلترة التاريخ الحقيقي سيكون أكثر تعقيدًا
    // هذا مجرد مثال بسيط
    const matchesDateRange = filterDateRange === 'الكل' || true;
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // تنسيق المبلغ كعملة
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} ر.س`;
  };

  // حالة الفاتورة إلى لون
  const getStatusBadgeClass = status => {
    switch(status) {
      case 'مدفوعة':
        return BADGE_CLASSES.green;
      case 'معلقة':
        return BADGE_CLASSES.yellow;
      case 'متأخرة':
        return BADGE_CLASSES.red;
      case 'مدفوعة جزئيا':
        return BADGE_CLASSES.blue;
      case 'ملغاة':
        return BADGE_CLASSES.gray;
      default:
        return BADGE_CLASSES.gray;
    }
  };

  // نوع العميل إلى لون خلفية للحرف الأول
  const getInitialBgClass = type => {
    switch(type) {
      case 'شركة':
        return 'bg-blue-600';
      case 'فرد':
        return 'bg-purple-600';
      case 'مؤسسة':
        return 'bg-gray-600';
      default:
        return 'bg-blue-600';
    }
  };

  // الحرف الأول من اسم العميل
  const getInitial = name => {
    return name.charAt(0);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">الفواتير</h1>
      
      {/* قسم البحث والفلترة */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* حقل البحث */}
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="البحث عن فاتورة..." 
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
          
          {/* فلتر حالة الفاتورة */}
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
          
          {/* فلتر نطاق التاريخ */}
          <div className="w-40">
            <select 
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dateRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* زر إنشاء فاتورة جديدة */}
        <button className={BUTTON_CLASSES}>
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          إنشاء فاتورة جديدة
        </button>
      </div>
      
      {/* جدول الفواتير */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm font-medium text-right text-gray-700 bg-gray-50">
              <th className="px-4 py-3 border-b border-gray-200">رقم الفاتورة</th>
              <th className="px-4 py-3 border-b border-gray-200">العميل</th>
              <th className="px-4 py-3 border-b border-gray-200">القضية</th>
              <th className="px-4 py-3 border-b border-gray-200">المبلغ</th>
              <th className="px-4 py-3 border-b border-gray-200">تاريخ الإصدار</th>
              <th className="px-4 py-3 border-b border-gray-200">تاريخ الاستحقاق</th>
              <th className="px-4 py-3 border-b border-gray-200">الحالة</th>
              <th className="px-4 py-3 border-b border-gray-200">طريقة الدفع</th>
              <th className="px-4 py-3 border-b border-gray-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="text-sm text-gray-700 hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="font-medium">{invoice.id}</span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center flex-shrink-0 w-8 h-8 ml-2 font-medium text-white rounded-full ${getInitialBgClass(invoice.client.type)}`}>
                      {getInitial(invoice.client.name)}
                    </div>
                    <div className="font-medium">{invoice.client.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">{invoice.case}</td>
                <td className="px-4 py-3 border-b border-gray-200 font-medium">{formatCurrency(invoice.amount)}</td>
                <td className="px-4 py-3 border-b border-gray-200">{invoice.issueDate}</td>
                <td className="px-4 py-3 border-b border-gray-200">{invoice.dueDate}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className={getStatusBadgeClass(invoice.status)}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">{invoice.paymentMethod}</td>
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
                    
                    {/* طباعة */}
                    <button className="text-green-600 hover:text-green-900" title="طباعة">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    
                    {/* حذف */}
                    <button className="text-red-600 hover:text-red-900" title="حذف">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500 border-b border-gray-200">
                  لم يتم العثور على فواتير مطابقة للبحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* ملخص الفواتير */}
      <div className="p-4 mt-4 bg-gray-50 rounded-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="p-3 bg-white rounded-md shadow-sm">
            <div className="text-sm font-medium text-gray-500">مجموع الفواتير</div>
            <div className="mt-1 text-xl font-bold text-gray-800">
              {formatCurrency(filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0))}
            </div>
          </div>
          <div className="p-3 bg-white rounded-md shadow-sm">
            <div className="text-sm font-medium text-gray-500">الفواتير المدفوعة</div>
            <div className="mt-1 text-xl font-bold text-green-600">
              {formatCurrency(filteredInvoices.filter(i => i.status === 'مدفوعة').reduce((sum, invoice) => sum + invoice.amount, 0))}
            </div>
          </div>
          <div className="p-3 bg-white rounded-md shadow-sm">
            <div className="text-sm font-medium text-gray-500">الفواتير المعلقة</div>
            <div className="mt-1 text-xl font-bold text-yellow-600">
              {formatCurrency(filteredInvoices.filter(i => i.status === 'معلقة').reduce((sum, invoice) => sum + invoice.amount, 0))}
            </div>
          </div>
          <div className="p-3 bg-white rounded-md shadow-sm">
            <div className="text-sm font-medium text-gray-500">الفواتير المتأخرة</div>
            <div className="mt-1 text-xl font-bold text-red-600">
              {formatCurrency(filteredInvoices.filter(i => i.status === 'متأخرة').reduce((sum, invoice) => sum + invoice.amount, 0))}
            </div>
          </div>
        </div>
      </div>
      
      {/* ترقيم الصفحات */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          عرض <span className="font-medium">{filteredInvoices.length}</span> من أصل <span className="font-medium">{invoices.length}</span> فاتورة
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

export default AllInvoices;