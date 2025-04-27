import React, { useState, useEffect } from 'react';
import { clientService } from '../../../../services/api';

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

const AllClients = () => {
  // حالة العملاء وتحميل البيانات
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالة البحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');

  // جلب بيانات العملاء من الخلفية
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await clientService.getAllClients();
        setClients(response.data);
        setError(null);
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات العملاء');
        console.error('خطأ في جلب العملاء:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // خيارات الفلترة
  const clientTypes = ['الكل', 'شركة', 'فرد', 'مؤسسة'];
  const statusTypes = ['الكل', 'نشط', 'معلق', 'غير نشط'];

  // تصفية العملاء حسب البحث والفلترة
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm);
    
    const matchesType = filterType === 'الكل' || client.type === filterType;
    const matchesStatus = filterStatus === 'الكل' || client.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // حالة العميل إلى لون
  const getStatusBadgeClass = status => {
    switch(status) {
      case 'نشط':
        return BADGE_CLASSES.green;
      case 'معلق':
        return BADGE_CLASSES.yellow;
      case 'غير نشط':
        return BADGE_CLASSES.red;
      default:
        return BADGE_CLASSES.gray;
    }
  };

  // نوع العميل إلى لون
  const getTypeBadgeClass = type => {
    switch(type) {
      case 'شركة':
        return BADGE_CLASSES.blue;
      case 'فرد':
        return BADGE_CLASSES.purple;
      case 'مؤسسة':
        return BADGE_CLASSES.gray;
      default:
        return BADGE_CLASSES.gray;
    }
  };

  // الحرف الأول من اسم العميل
  const getInitial = name => {
    return name?.charAt(0) || '';
  };

  // لون خلفية الحرف الأول حسب نوع العميل
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">جميع العملاء</h1>
      
      {/* قسم البحث والفلترة */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              placeholder="البحث عن عميل..." 
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
          
          {/* فلتر نوع العميل */}
          <div className="w-40">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {clientTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* فلتر حالة العميل */}
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
        </div>
        
        <button className={BUTTON_CLASSES}>
          <svg className="w-5 h-5 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          إضافة عميل جديد
        </button>
      </div>
      
      {/* عرض حالة التحميل */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* عرض رسالة الخطأ */}
      {error && (
        <div className="p-4 mb-4 text-sm text-white bg-red-500 rounded-md">
          {error}
        </div>
      )}
      
      {/* جدول العملاء */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-sm font-medium text-right text-gray-700 bg-gray-50">
                  <th className="px-4 py-3 border-b border-gray-200">اسم العميل</th>
                  <th className="px-4 py-3 border-b border-gray-200">النوع</th>
                  <th className="px-4 py-3 border-b border-gray-200">البريد الإلكتروني</th>
                  <th className="px-4 py-3 border-b border-gray-200">رقم الهاتف</th>
                  <th className="px-4 py-3 border-b border-gray-200">القضايا</th>
                  <th className="px-4 py-3 border-b border-gray-200">الحالة</th>
                  <th className="px-4 py-3 border-b border-gray-200">تاريخ الإضافة</th>
                  <th className="px-4 py-3 border-b border-gray-200">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredClients.map(client => (
                  <tr key={client.id} className="text-sm text-gray-700 hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center flex-shrink-0 w-8 h-8 ml-2 font-medium text-white rounded-full ${getInitialBgClass(client.type)}`}>
                          {getInitial(client.name)}
                        </div>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <span className={getTypeBadgeClass(client.type)}>
                        {client.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-left border-b border-gray-200 dir-ltr">{client.email}</td>
                    <td className="px-4 py-3 text-left border-b border-gray-200 dir-ltr">{client.phone}</td>
                    <td className="px-4 py-3 text-center border-b border-gray-200">{client.cases || 0}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <span className={getStatusBadgeClass(client.status)}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      {client.created ? client.created : new Date(client.createdAt).toLocaleDateString('ar-EG')}
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
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500 border-b border-gray-200">
                      لم يتم العثور على عملاء مطابقين للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* ترقيم الصفحات */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              عرض <span className="font-medium">{filteredClients.length}</span> من أصل <span className="font-medium">{clients.length}</span> عميل
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
        </>
      )}
    </div>
  );
};

export default AllClients;