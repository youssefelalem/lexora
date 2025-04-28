import React from 'react';

/**
 * مكون لعرض دور المستخدم بشكل جمالي
 * @param {string} role - دور المستخدم (مثل 'admin', 'lawyer', 'assistant', إلخ)
 * @param {string} className - فئات CSS إضافية (اختياري)
 */
const RoleBadge = ({ role, className = '' }) => {
  // ترجمة الدور إلى العربية
  const translateRole = (role) => {
    const roles = {
      'admin': 'مدير النظام',
      'administrateur': 'مدير النظام',
      'super_admin': 'مدير النظام الرئيسي',
      'lawyer': 'محامي',
      'avocat': 'محامي',
      'assistant': 'مساعد',
      'assistant_juridique': 'مساعد قانوني',
      'secretary': 'سكرتير',
      'comptable': 'محاسب'
    };
    return roles[role.toLowerCase()] || role;
  };

  // الألوان حسب نوع الدور
  const getRoleColorClass = (role) => {
    const colors = {
      'admin': 'bg-blue-100 text-blue-800',
      'administrateur': 'bg-blue-100 text-blue-800',
      'super_admin': 'bg-purple-200 text-purple-900',
      'lawyer': 'bg-purple-100 text-purple-800',
      'avocat': 'bg-purple-100 text-purple-800',
      'assistant': 'bg-green-100 text-green-800',
      'assistant_juridique': 'bg-green-100 text-green-800',
      'secretary': 'bg-yellow-100 text-yellow-800',
      'comptable': 'bg-amber-100 text-amber-800'
    };
    return colors[role.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColorClass(role)} ${className}`}>
      {translateRole(role)}
    </span>
  );
};

export default RoleBadge;