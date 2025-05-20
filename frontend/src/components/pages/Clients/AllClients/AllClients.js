import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../../../../services/api';

/**
 * تنسيق التاريخ بالصيغة الفرنسية (DD-MM-YYYY)
 * @param {string} dateString - التاريخ بصيغة النص
 * @returns {string} - التاريخ المنسق
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (err) {
    console.error('Error formatting date:', err);
    return '-';
  }
};

/**
 * مكون عرض جميع العملاء
 * يتيح عرض قائمة العملاء مع إمكانية البحث والتصفية وإدارة العملاء
 */
const AllClients = () => {
  const navigate = useNavigate();
  
  // === حالة البيانات ===
  // حالة قائمة العملاء والتحميل
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالة البحث والتصفية
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');

  // === الثوابت والخيارات ===
  // خيارات أنواع وحالات العملاء
  const clientTypes = ['الكل', 'شركة', 'فرد', 'مؤسسة'];
  const statusTypes = ['الكل', 'نشط', 'معلق', 'غير نشط'];

  // === الوظائف المساعدة ===
  /**
   * تحويل حالة العميل إلى صنف CSS
   * @param {string} status - حالة العميل
   * @returns {string} - صنف CSS المناسب
   */
  const getStatusBadgeClass = status => {
    switch(status) {
      case 'نشط':
        return "px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full";
      case 'معلق':
        return "px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full";
      case 'غير نشط':
        return "px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full";
      default:
        return "px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full";
    }
  };

  /**
   * تحويل نوع العميل إلى صنف CSS
   * @param {string} type - نوع العميل
   * @returns {string} - صنف CSS المناسب
   */
  const getTypeBadgeClass = type => {
    switch(type) {
      case 'شركة':
        return "px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full";
      case 'فرد':
        return "px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full";
      case 'مؤسسة':
        return "px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full";
      default:
        return "px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full";
    }
  };

  /**
   * استخراج الحرف الأول من اسم العميل
   * @param {string} name - اسم العميل
   * @returns {string} - الحرف الأول
   */
  const getInitial = name => {
    return name?.charAt(0) || '';
  };

  /**
   * تحديد لون خلفية الحرف الأول حسب نوع العميل
   * @param {string} type - نوع العميل
   * @returns {string} - صنف CSS للون الخلفية
   */
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

  /**
   * حذف عميل من قاعدة البيانات
   * @param {number} clientId - معرف العميل
   */
  const deleteClient = async (clientId) => {
    if (!clientId) {
      console.error('معرف العميل غير صالح');
      return;
    }
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا العميل؟')) {
      return;
    }
    try {
      await clientService.deleteClient(clientId);
      // تحديث قائمة العملاء بعد الحذف
      setClients(clients.filter(client => client.idClient !== clientId));
    } catch (err) {
      console.error('خطأ في حذف العميل:', err);
      setError('حدث خطأ أثناء حذف العميل');
    }
  };

  // === تأثيرات جانبية ===
  // جلب بيانات العملاء عند تحميل المكون
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // التحقق من وجود التوكن
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError('يجب تسجيل الدخول أولاً');
          navigate('/login');
          return;
        }

        setLoading(true);
        const response = await clientService.getAllClients();
        
        if (!response || !response.data) {
          throw new Error('لم يتم استلام بيانات صحيحة من الخادم');
        }

        setClients(response.data);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب العملاء:', err);
        
        if (err.response) {
          // خطأ من الخادم مع رد
          switch (err.response.status) {
            case 401:
              setError('انتهت صلاحية الجلسة. يرجى إعادة تسجيل الدخول');
              // مسح التوكن وإعادة التوجيه لتسجيل الدخول
              localStorage.removeItem('token');
              sessionStorage.removeItem('token');
              navigate('/login');
              break;
            case 403:
              setError('ليس لديك صلاحية للوصول إلى هذه البيانات');
              break;
            default:
              setError('حدث خطأ أثناء جلب بيانات العملاء');
          }
        } else if (err.request) {
          // لم يتم تلقي رد من الخادم
          setError('لا يمكن الاتصال بالخادم');
        } else {
          // خطأ في إعداد الطلب
          setError('حدث خطأ غير متوقع');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [navigate]);

  // تصفية العملاء حسب البحث والفلترة
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telephone?.includes(searchTerm);
    
    const matchesType = filterType === 'الكل' || client.type === filterType;
    const matchesStatus = filterStatus === 'الكل' || client.statut === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // === تصيير المكون ===
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
              {clientTypes.map((type, index) => (
                <option key={`type-${type}-${index}`} value={type}>{type}</option>
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
              {statusTypes.map((status, index) => (
                <option key={`status-${status}-${index}`} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/clients/new')}
          className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
        >
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
                {filteredClients.map((client, index) => (
                  <tr key={client.idClient || `client-${index}`} className="text-sm text-gray-700 hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center flex-shrink-0 w-8 h-8 ml-2 font-medium text-white rounded-full ${getInitialBgClass(client.type)}`}>
                          {getInitial(client.nom)}
                        </div>
                        <div>
                          <div className="font-medium">{client.nom}</div>
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
                    <td className="px-4 py-3 text-left border-b border-gray-200 dir-ltr">{client.telephone}</td>
                    <td className="px-4 py-3 text-center border-b border-gray-200">{client.nombreDossiers || 0}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <span className={getStatusBadgeClass(client.statut)}>
                        {client.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      {formatDate(client.dateCreation)}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 whitespace-nowrap">
                      <div className="flex items-center space-x-3 space-x-reverse">                        {/* عرض */}
                        <button 
                          onClick={() => navigate(`/clients/${client.idClient}`)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="عرض التفاصيل"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                          {/* تعديل */}                        <button 
                          onClick={() => navigate(`/clients/${client.idClient}/edit`)} 
                          className="text-yellow-600 hover:text-yellow-900" 
                          title="تعديل"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                          {/* حذف */}
                        <button 
                          onClick={() => {
                              deleteClient(client.idClient);
                          }} 
                          className="text-red-600 hover:text-red-900" 
                          title="حذف"
                        >
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
        </>
      )}
    </div>
  );
};

export default AllClients;