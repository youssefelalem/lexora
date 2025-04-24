import React, { useState } from 'react';

// تعريف ثوابت للأزرار والشارات
const BUTTON_CLASSES = "flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700";
const STATUS_BADGES = {
  completed: "px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full",
  pending: "px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full",
  failed: "px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full",
  refunded: "px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full",
};

const TYPE_BADGES = {
  cash: "px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full",
  creditcard: "px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full",
  banktransfer: "px-2 py-1 text-xs font-medium text-teal-800 bg-teal-100 rounded-full",
  check: "px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full",
};

const AllPayments = () => {
  // بيانات نموذجية للمدفوعات
  const [payments, setPayments] = useState([
    { 
      id: 1, 
      invoiceId: 'INV-2025-001',
      clientName: 'شركة الفجر للتكنولوجيا',
      amount: 5000.00,
      paymentDate: '15-03-2025',
      status: 'completed',
      type: 'banktransfer',
      caseReference: 'CASE-2025-003',
      notes: 'تم الدفع بالكامل'
    },
    { 
      id: 2, 
      invoiceId: 'INV-2025-002',
      clientName: 'محمد علي',
      amount: 2500.00,
      paymentDate: '20-03-2025',
      status: 'completed',
      type: 'cash',
      caseReference: 'CASE-2025-007',
      notes: 'دفعة أولى'
    },
    { 
      id: 3, 
      invoiceId: 'INV-2025-003',
      clientName: 'مؤسسة النور للاستشارات',
      amount: 7500.00,
      paymentDate: '22-03-2025',
      status: 'pending',
      type: 'creditcard',
      caseReference: 'CASE-2025-011',
      notes: 'في انتظار المعالجة'
    },
    { 
      id: 4, 
      invoiceId: 'INV-2025-004',
      clientName: 'خالد عبد الرحمن',
      amount: 1500.00,
      paymentDate: '01-04-2025',
      status: 'failed',
      type: 'creditcard',
      caseReference: 'CASE-2025-015',
      notes: 'بطاقة منتهية الصلاحية'
    },
    { 
      id: 5, 
      invoiceId: 'INV-2025-005',
      clientName: 'شركة المستقبل للاتصالات',
      amount: 12000.00,
      paymentDate: '05-04-2025',
      status: 'completed',
      type: 'check',
      caseReference: 'CASE-2025-019',
      notes: 'شيك رقم 12345'
    },
    { 
      id: 6, 
      invoiceId: 'INV-2025-006',
      clientName: 'سارة أحمد',
      amount: 3500.00,
      paymentDate: '10-04-2025',
      status: 'refunded',
      type: 'banktransfer',
      caseReference: 'CASE-2025-021',
      notes: 'تم استرداد المبلغ بالكامل'
    },
  ]);

  // حالات البحث والتصفية
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterType, setFilterType] = useState('الكل');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const statusTypes = ['الكل', 'completed', 'pending', 'failed', 'refunded'];
  const paymentTypes = ['الكل', 'cash', 'creditcard', 'banktransfer', 'check'];

  // تحويل حالة الدفع إلى اللغة العربية للعرض
  const getStatusInArabic = (status) => {
    switch(status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'معلق';
      case 'failed':
        return 'فشل';
      case 'refunded':
        return 'مسترد';
      default:
        return status;
    }
  };

  // تحويل نوع الدفع إلى اللغة العربية للعرض
  const getTypeInArabic = (type) => {
    switch(type) {
      case 'cash':
        return 'نقدي';
      case 'creditcard':
        return 'بطاقة ائتمان';
      case 'banktransfer':
        return 'تحويل بنكي';
      case 'check':
        return 'شيك';
      default:
        return type;
    }
  };

  // تصفية المدفوعات حسب البحث والفلترة
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.caseReference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'الكل' || payment.status === filterStatus;
    const matchesType = filterType === 'الكل' || payment.type === filterType;
    
    // تصفية حسب نطاق التاريخ إذا تم تحديده
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const paymentDate = new Date(payment.paymentDate.split('-').reverse().join('-'));
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59); // Set to end of day
      
      matchesDateRange = paymentDate >= startDate && paymentDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  // حساب إجمالي المدفوعات المعروضة
  const totalAmount = filteredPayments.reduce((sum, payment) => {
    return payment.status === 'completed' ? sum + payment.amount : sum;
  }, 0);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">المدفوعات</h1>
      
      {/* قسم البحث والفلترة */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* البحث */}
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="البحث حسب الفاتورة، العميل أو القضية..." 
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
          
          {/* فلتر حالة الدفع */}
          <div className="w-40">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusTypes.map(status => (
                <option key={status} value={status}>
                  {status === 'الكل' ? status : getStatusInArabic(status)}
                </option>
              ))}
            </select>
          </div>
          
          {/* فلتر نوع الدفع */}
          <div className="w-40">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {paymentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'الكل' ? type : getTypeInArabic(type)}
                </option>
              ))}
            </select>
          </div>
          
          {/* فلتر نطاق التاريخ */}
          <div className="flex gap-2">
            <div className="w-36">
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="self-center">إلى</span>
            <div className="w-36">
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* زر إضافة مدفوعات */}
        <button className={BUTTON_CLASSES}>
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          تسجيل مدفوعات جديدة
        </button>
      </div>
      
      {/* ملخص المدفوعات */}
      <div className="p-4 mb-6 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-3 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">إجمالي المدفوعات المكتملة</h3>
            <p className="mt-2 text-3xl font-bold text-gray-800 dir-ltr">{totalAmount.toFixed(2)} د.م</p>
          </div>
          <div className="p-3 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">عدد المعاملات</h3>
            <p className="mt-2 text-3xl font-bold text-gray-800">{filteredPayments.length}</p>
          </div>
          <div className="p-3 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">المدفوعات المعلقة</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {payments.filter(payment => payment.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* جدول المدفوعات */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm font-medium text-right text-gray-700 bg-gray-50">
              <th className="px-4 py-3 border-b border-gray-200">رقم الفاتورة</th>
              <th className="px-4 py-3 border-b border-gray-200">العميل</th>
              <th className="px-4 py-3 border-b border-gray-200">المبلغ</th>
              <th className="px-4 py-3 border-b border-gray-200">تاريخ الدفع</th>
              <th className="px-4 py-3 border-b border-gray-200">طريقة الدفع</th>
              <th className="px-4 py-3 border-b border-gray-200">الحالة</th>
              <th className="px-4 py-3 border-b border-gray-200">رقم القضية</th>
              <th className="px-4 py-3 border-b border-gray-200">ملاحظات</th>
              <th className="px-4 py-3 border-b border-gray-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredPayments.length > 0 ? filteredPayments.map(payment => (
              <tr key={payment.id} className="text-sm text-gray-700 hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200">{payment.invoiceId}</td>
                <td className="px-4 py-3 border-b border-gray-200">{payment.clientName}</td>
                <td className="px-4 py-3 border-b border-gray-200 dir-ltr text-left">{payment.amount.toFixed(2)} د.م</td>
                <td className="px-4 py-3 border-b border-gray-200">{payment.paymentDate}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className={TYPE_BADGES[payment.type]}>
                    {getTypeInArabic(payment.type)}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className={STATUS_BADGES[payment.status]}>
                    {getStatusInArabic(payment.status)}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">{payment.caseReference}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="inline-block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={payment.notes}>
                    {payment.notes}
                  </span>
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
                    {/* تحرير */}
                    <button className="text-yellow-600 hover:text-yellow-900" title="تعديل">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* طباعة إيصال */}
                    <button className="text-green-600 hover:text-green-900" title="طباعة إيصال">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    {/* إلغاء / استرداد */}
                    {payment.status === 'completed' && (
                      <button className="text-red-600 hover:text-red-900" title="إلغاء الدفع">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr className="text-sm text-gray-700">
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500 border-b border-gray-200">
                  لم يتم العثور على مدفوعات مطابقة للبحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* ترقيم الصفحات */}
      {filteredPayments.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            عرض <span className="font-medium">{filteredPayments.length}</span> من أصل <span className="font-medium">{payments.length}</span> مدفوعة
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
      )}
    </div>
  );
};

export default AllPayments;