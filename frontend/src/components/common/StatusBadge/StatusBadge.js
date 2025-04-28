import React from 'react';

/**
 * مكون لعرض حالة العنصر (مستخدم، قضية، الخ) مع مؤشر لوني
 * @param {string} status - الحالة ('active', 'inactive', 'pending', 'completed', 'cancelled' أو أي حالة أخرى)
 * @param {string} textClassName - فئات النص الإضافية (اختياري)
 * @param {Object} translations - قاموس لترجمة الحالات إلى اللغة العربية (اختياري)
 */
const StatusBadge = ({ status, textClassName = '', translations = {} }) => {
  // الترجمات الافتراضية للحالات
  const defaultTranslations = {
    'active': 'نشط',
    'inactive': 'غير نشط',
    'pending': 'معلق',
    'completed': 'مكتمل',
    'cancelled': 'ملغي',
    'rejected': 'مرفوض',
    'approved': 'موافق عليه',
    'processing': 'قيد المعالجة',
    'draft': 'مسودة'
  };

  // دمج الترجمات المخصصة مع الترجمات الافتراضية
  const mergedTranslations = { ...defaultTranslations, ...translations };
  
  // الحصول على النص المترجم
  const translatedStatus = mergedTranslations[status.toLowerCase()] || status;
  
  // تعيين ألوان المؤشر بناءً على الحالة
  const getStatusColor = (status) => {
    const statusColors = {
      'active': 'bg-green-500',
      'inactive': 'bg-red-500',
      'pending': 'bg-yellow-500',
      'completed': 'bg-blue-500',
      'cancelled': 'bg-gray-500',
      'rejected': 'bg-red-500',
      'approved': 'bg-green-500',
      'processing': 'bg-blue-500',
      'draft': 'bg-gray-400'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className={`flex items-center ${textClassName}`}>
      <div className={`flex-shrink-0 h-2 w-2 rounded-full ${getStatusColor(status)} ml-2`}></div>
      <span className="text-sm text-gray-900">{translatedStatus}</span>
    </div>
  );
};

export default StatusBadge;