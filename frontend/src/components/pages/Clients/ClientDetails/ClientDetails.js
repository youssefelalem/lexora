import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService, clientStatisticsService, clientCasesService } from '../../../../services/api';

// مكون عرض تفاصيل العميل
// يعرض جميع معلومات العميل المحدد مع إمكانية التعديل أو العودة للقائمة
const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // === حالة البيانات ===
  const [client, setClient] = useState(null);       // بيانات العميل
  const [loading, setLoading] = useState(true);     // حالة التحميل
  const [error, setError] = useState(null);         // رسالة الخطأ
  const [cases, setCases] = useState([]);           // قائمة قضايا العميل
  const [statistics, setStatistics] = useState({   // إحصائيات العميل
    totalReceived: 0,
    totalPaid: 0,
    clientBalance: 0
  });
  // === الوظائف المساعدة ===
  // تنسيق التاريخ بالصيغة الفرنسية
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
      return '-';
    }
  };

  // تنسيق المبالغ المالية
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 د.ج';
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // التعامل مع إنشاء قضية جديدة
  const handleCreateNewCase = async () => {
    try {
      // يمكن فتح مودال لإدخال بيانات القضية أو التوجه لصفحة جديدة
      navigate(`/cases/new?clientId=${id}`);
    } catch (err) {
      console.error('خطأ في إنشاء قضية جديدة:', err);
    }
  };

  // التعامل مع إنشاء عمل جديد
  const handleCreateNewWork = async () => {
    try {
      // يمكن فتح مودال لإدخال بيانات العمل أو التوجه لصفحة جديدة
      navigate(`/clients/new`);
    } catch (err) {
      console.error('خطأ في إنشاء عمل جديد:', err);
    }
  };// === تأثيرات جانبية ===
  // جلب بيانات العميل عند تحميل المكون
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        
        // جلب بيانات العميل
        const clientResponse = await clientService.getClientById(id);
        setClient(clientResponse.data);
        
        // جلب قضايا العميل
        try {
          const casesResponse = await clientCasesService.getClientCases(id);
          setCases(casesResponse.data || []);
        } catch (casesError) {
          console.warn('تعذر جلب قضايا العميل:', casesError);
          setCases([]);
        }

        // جلب إحصائيات العميل
        try {
          const statisticsResponse = await clientStatisticsService.getClientStatistics(id);
          setStatistics(statisticsResponse.data || {
            totalReceived: 0,
            totalPaid: 0,
            clientBalance: 0
          });
        } catch (statsError) {
          console.warn('تعذر جلب إحصائيات العميل:', statsError);
          setStatistics({
            totalReceived: 0,
            totalPaid: 0,
            clientBalance: 0
          });
        }

      } catch (err) {
        console.error('خطأ في جلب بيانات العميل:', err);
        setError('حدث خطأ أثناء جلب بيانات العميل');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  // === حالات العرض المختلفة ===
  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="p-4 text-sm text-white bg-red-500 rounded-md">
        {error}
      </div>
    );
  }

  // عرض حالة عدم وجود العميل
  if (!client) {
    return (
      <div className="p-4 text-sm text-gray-500">
        لم يتم العثور على العميل
      </div>
    );
  }
  // === تصيير المكون الرئيسي ===
  return (
    <div className="min-h-screen p-6 bg-gray-50">      {/* أزرار الإجراءات العلوية */}
      <div className="flex mb-6 space-x-4 space-x-reverse">
        <button 
          className="flex items-center px-6 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
          onClick={handleCreateNewCase}
        >
          + إضافة قضية جديد
        </button>
        <button 
          className="flex items-center px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={handleCreateNewWork}
        >
          + إضافة عمل جديد
        </button>
      </div>      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* القسم الأيسر - الإحصائيات والمحتوى الرئيسي */}
        <div className="space-y-6 lg:col-span-2">
          {/* بطاقات الإحصائيات */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">            {/* إجمالي المبالغ المستلمة */}
            <div className="p-6 bg-white border-r-4 border-red-400 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">إجمالي المبالغ المستلمة</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(statistics.totalReceived)}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>            {/* إجمالي المبالغ المدفوعة */}
            <div className="p-6 bg-white border-r-4 border-teal-400 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">إجمالي المبالغ المدفوعة</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(statistics.totalPaid)}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full">
                  <svg className="w-6 h-6 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>            {/* الرصيد الصافي للعميل */}
            <div className="p-6 bg-white border-r-4 border-gray-400 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">الرصيد الصافي للعميل</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(statistics.clientBalance)}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                  <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* عرض جميع القضايا */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">عرض جميع القضايا</h2>
            </div>
            <div className="p-6">              {cases.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-500">لا يوجد قضايا لهذا العميل حتى الآن</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cases.map((case_, index) => (
                    <div key={case_.id || index} className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{case_.titre || case_.title || `قضية ${index + 1}`}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          case_.statut === 'نشط' || case_.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {case_.statut || case_.status || 'غير محدد'}
                        </span>
                      </div>
                      {case_.description && (
                        <p className="mb-2 text-sm text-gray-600">{case_.description}</p>
                      )}
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>تاريخ البداية: {formatDate(case_.dateDebut || case_.startDate)}</span>
                        {case_.dateFin && (
                          <span>تاريخ النهاية: {formatDate(case_.dateFin || case_.endDate)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* القسم الأيمن - معلومات العميل */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            {/* صورة العميل ومعلومات أساسية */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">{client.nom}</h3>
              <p className="text-sm text-gray-500">{client.type}</p>
            </div>            {/* بيانات التعريف */}
            <div className="mb-6 space-y-4">
              <h4 className="font-semibold text-right text-gray-700">بيانات التعريف</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم المتعامل:</span>
                  <span className="font-medium">#{client.idClient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">البريد الإلكتروني:</span>
                  <span className="font-medium text-blue-600 dir-ltr">{client.email || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">جهة الاتصال:</span>
                  <span className="font-medium">{client.contact || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم الهاتف:</span>
                  <span className="font-medium dir-ltr">{client.telephone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">العنوان:</span>
                  <span className="font-medium">{client.adresse || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">حالة العميل:</span>
                  <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                    client.statut === 'نشط' ? 'bg-green-100 text-green-800' :
                    client.statut === 'غير نشط' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {client.statut}
                  </span>
                </div>                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <span className="font-medium">{formatDate(client.dateCreation)}</span>
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/clients/${id}/edit`)}
                className="w-full px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
              >
                تعديل العميل
              </button>
              <button
                onClick={() => navigate('/clients/all')}
                className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                العودة للقائمة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
