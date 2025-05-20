import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '../../../../services/api';

// مكون عرض تفاصيل العميل
// يعرض جميع معلومات العميل المحدد مع إمكانية التعديل أو العودة للقائمة
const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // === حالة البيانات ===
  const [client, setClient] = useState(null);       // بيانات العميل
  const [loading, setLoading] = useState(true);     // حالة التحميل
  const [error, setError] = useState(null);         // رسالة الخطأ

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

  // === تأثيرات جانبية ===
  // جلب بيانات العميل عند تحميل المكون
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await clientService.getClientById(id);
        setClient(response.data);
      } catch (err) {
        console.error('خطأ في جلب بيانات العميل:', err);
        setError('حدث خطأ أثناء جلب بيانات العميل');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
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
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* شريط العنوان مع الأزرار */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">تفاصيل العميل</h1>
        <div className="flex space-x-3 space-x-reverse">
          {/* زر تعديل بيانات العميل */}
          <button
            onClick={() => navigate(`/clients/${id}/edit`)}
            className="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
          >
            تعديل العميل
          </button>
          {/* زر العودة لقائمة العملاء */}
          <button
            onClick={() => navigate('/clients/all')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            العودة للقائمة
          </button>
        </div>
      </div>

      {/* عرض بيانات العميل */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* بطاقة المعلومات الأساسية */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">المعلومات الأساسية</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-500">الاسم:</span>
              <span className="mr-2 font-medium">{client.nom}</span>
            </div>
            <div>
              <span className="text-gray-500">النوع:</span>
              <span className="mr-2">{client.type}</span>
            </div>
            <div>
              <span className="text-gray-500">الحالة:</span>
              <span className="mr-2">{client.statut}</span>
            </div>
            <div>
              <span className="text-gray-500">تاريخ الإضافة:</span>
              <span className="mr-2">{formatDate(client.dateCreation)}</span>
            </div>
          </div>
        </div>

        {/* بطاقة معلومات الاتصال */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">معلومات الاتصال</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-500">البريد الإلكتروني:</span>
              <span className="mr-2 font-medium dir-ltr">{client.email}</span>
            </div>
            <div>
              <span className="text-gray-500">رقم الهاتف:</span>
              <span className="mr-2 dir-ltr">{client.telephone}</span>
            </div>
            <div>
              <span className="text-gray-500">العنوان:</span>
              <span className="mr-2">{client.adresse || '-'}</span>
            </div>
            <div>
              <span className="text-gray-500">جهة الاتصال:</span>
              <span className="mr-2">{client.contact || '-'}</span>
            </div>
          </div>
        </div>

        {/* بطاقة الملاحظات */}
        <div className="p-4 border border-gray-200 rounded-lg md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">ملاحظات</h2>
          <p className="text-gray-600">
            {client.notes || 'لا توجد ملاحظات'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
