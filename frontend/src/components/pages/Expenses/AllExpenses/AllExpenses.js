import React, { useState } from 'react';

const AllExpenses = () => {
  // State for expenses data
  const [expenses, setExpenses] = useState([
    { 
      id: 1, 
      description: 'رسوم ملف قضية محكمة الاستئناف', 
      amount: 1500, 
      date: '2025-03-15', 
      category: 'رسوم قانونية',
      paymentMethod: 'تحويل بنكي',
      status: 'مسددة',
      caseId: 'C-2025-0042'
    },
    { 
      id: 2, 
      description: 'نفقات سفر لحضور جلسة في محكمة خارج المدينة', 
      amount: 850, 
      date: '2025-04-02', 
      category: 'سفر',
      paymentMethod: 'نقدي',
      status: 'مسددة',
      caseId: 'C-2025-0036'
    },
    { 
      id: 3, 
      description: 'طباعة ملفات ومستندات للمحكمة', 
      amount: 320, 
      date: '2025-04-10', 
      category: 'مكتبية',
      paymentMethod: 'بطاقة ائتمان',
      status: 'معلقة',
      caseId: 'C-2025-0051'
    }
  ]);

  // State for expense filters
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  // State for sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle sort changes
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Function to apply filters and sorting
  const getFilteredAndSortedExpenses = () => {
    // Filter expenses
    let filteredExpenses = [...expenses];
    
    if (filters.category) {
      filteredExpenses = filteredExpenses.filter(expense => expense.category === filters.category);
    }
    
    if (filters.status) {
      filteredExpenses = filteredExpenses.filter(expense => expense.status === filters.status);
    }
    
    if (filters.startDate) {
      filteredExpenses = filteredExpenses.filter(expense => expense.date >= filters.startDate);
    }
    
    if (filters.endDate) {
      filteredExpenses = filteredExpenses.filter(expense => expense.date <= filters.endDate);
    }
    
    if (filters.minAmount) {
      filteredExpenses = filteredExpenses.filter(expense => expense.amount >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount) {
      filteredExpenses = filteredExpenses.filter(expense => expense.amount <= parseFloat(filters.maxAmount));
    }
    
    // Sort expenses
    filteredExpenses.sort((a, b) => {
      if (sortBy === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date) - new Date(b.date) 
          : new Date(b.date) - new Date(a.date);
      } else {
        // Sort by description or other string fields
        const valueA = a[sortBy].toUpperCase();
        const valueB = b[sortBy].toUpperCase();
        if (valueA < valueB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
    
    return filteredExpenses;
  };

  // Filter and sort expenses
  const filteredExpenses = getFilteredAndSortedExpenses();

  // Categories for dropdown
  const categories = ['رسوم قانونية', 'سفر', 'مكتبية', 'استشارات', 'أخرى'];
  const statuses = ['مسددة', 'معلقة', 'ملغاة'];

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = filteredExpenses.filter(expense => expense.status === 'مسددة').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses.filter(expense => expense.status === 'معلقة').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">إدارة النفقات</h1>
      
      {/* الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="text-sm text-gray-500">إجمالي النفقات</div>
          <div className="mt-1 text-xl font-bold text-blue-700">{totalExpenses.toLocaleString()} ريال</div>
        </div>
        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
          <div className="text-sm text-gray-500">النفقات المسددة</div>
          <div className="mt-1 text-xl font-bold text-green-700">{paidExpenses.toLocaleString()} ريال</div>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
          <div className="text-sm text-gray-500">النفقات المعلقة</div>
          <div className="mt-1 text-xl font-bold text-yellow-700">{pendingExpenses.toLocaleString()} ريال</div>
        </div>
      </div>
      
      {/* قسم البحث والفلترة */}
      <div className="p-4 mb-6 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full md:w-64">
            <label className="block mb-1 text-sm font-medium text-gray-700">الفئة</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الفئات</option>
              {categories.map((category, idx) => (
                <option key={idx} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-64">
            <label className="block mb-1 text-sm font-medium text-gray-700">الحالة</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الحالات</option>
              {statuses.map((status, idx) => (
                <option key={idx} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="block mb-1 text-sm font-medium text-gray-700">من تاريخ</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="block mb-1 text-sm font-medium text-gray-700">إلى تاريخ</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="block mb-1 text-sm font-medium text-gray-700">الحد الأدنى للمبلغ</label>
            <input
              type="number"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="block mb-1 text-sm font-medium text-gray-700">الحد الأقصى للمبلغ</label>
            <input
              type="number"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="9999"
            />
          </div>
          <button
            onClick={() => setFilters({
              category: '',
              status: '',
              startDate: '',
              endDate: '',
              minAmount: '',
              maxAmount: ''
            })}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      </div>
      
      {/* زر إضافة نفقة جديدة */}
      <div className="flex justify-end mb-4">
        <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          إضافة نفقة جديدة
        </button>
      </div>
      
      {/* جدول النفقات */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="text-sm font-medium text-right text-gray-700 bg-gray-100">
              <th className="px-4 py-3 border-b border-gray-200 cursor-pointer" onClick={() => handleSortChange('description')}>
                <div className="flex items-center justify-between">
                  <span>الوصف</span>
                  {sortBy === 'description' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 border-b border-gray-200 cursor-pointer" onClick={() => handleSortChange('amount')}>
                <div className="flex items-center justify-between">
                  <span>المبلغ</span>
                  {sortBy === 'amount' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 border-b border-gray-200 cursor-pointer" onClick={() => handleSortChange('date')}>
                <div className="flex items-center justify-between">
                  <span>التاريخ</span>
                  {sortBy === 'date' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 border-b border-gray-200 cursor-pointer" onClick={() => handleSortChange('category')}>
                <div className="flex items-center justify-between">
                  <span>الفئة</span>
                  {sortBy === 'category' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 border-b border-gray-200">طريقة الدفع</th>
              <th className="px-4 py-3 border-b border-gray-200 cursor-pointer" onClick={() => handleSortChange('status')}>
                <div className="flex items-center justify-between">
                  <span>الحالة</span>
                  {sortBy === 'status' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 border-b border-gray-200">رقم القضية</th>
              <th className="px-4 py-3 border-b border-gray-200">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(expense => (
              <tr key={expense.id} className="text-sm text-gray-700 hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200">{expense.description}</td>
                <td className="px-4 py-3 border-b border-gray-200">{expense.amount.toLocaleString()} ريال</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {new Date(expense.date).toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">{expense.paymentMethod}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    expense.status === 'مسددة' ? 'bg-green-100 text-green-800' :
                    expense.status === 'معلقة' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {expense.status}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <a href={`/cases/${expense.caseId}`} className="text-blue-600 hover:underline">{expense.caseId}</a>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button className="text-blue-600 hover:text-blue-900" title="عرض التفاصيل">
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
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500 border-b border-gray-200">
                  لا توجد نفقات مطابقة للفلترة المحددة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* ترقيم الصفحات */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          عرض <span className="font-medium">{filteredExpenses.length}</span> من أصل <span className="font-medium">{expenses.length}</span> نفقة
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
    </div>
  );
};

export default AllExpenses;