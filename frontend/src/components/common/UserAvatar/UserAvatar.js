import React from 'react';

/**
 * مكون لعرض صورة المستخدم أو الحرف الأول من اسمه كبديل
 * @param {string} name - اسم المستخدم
 * @param {string} role - دور المستخدم (لتحديد لون الخلفية)
 * @param {string} size - حجم الصورة ('sm', 'md', 'lg') 
 * @param {string} imgSrc - مسار الصورة (اختياري)
 */
const UserAvatar = ({ name, role, size = 'md', imgSrc = null }) => {
  // الحرف الأول من اسم المستخدم
  const getInitial = (name) => {
    return name && typeof name === 'string' ? name.charAt(0) : 'U';
  };

  // لون الخلفية حسب الدور
  const getAvatarColor = (role) => {
    const colors = {
      'admin': 'bg-blue-600',
      'administrateur': 'bg-blue-600',
      'super_admin': 'bg-purple-700',
      'lawyer': 'bg-purple-600',
      'avocat': 'bg-purple-600',
      'assistant': 'bg-green-600',
      'assistant_juridique': 'bg-green-600',
      'secretary': 'bg-yellow-600',
      'comptable': 'bg-amber-600'
    };
    return role && typeof role === 'string' ? (colors[role.toLowerCase()] || 'bg-gray-600') : 'bg-gray-600';
  };

  // تحديد الحجم
  const getSizeClasses = (size) => {
    const sizes = {
      'xs': 'h-6 w-6 text-xs',
      'sm': 'h-8 w-8 text-sm',
      'md': 'h-10 w-10 text-base',
      'lg': 'h-12 w-12 text-lg',
      'xl': 'h-16 w-16 text-xl'
    };
    return sizes[size] || sizes.md;
  };

  // إذا كان هناك صورة، فاعرضها
  if (imgSrc) {
    return (
      <img 
        src={imgSrc} 
        alt={name || 'User'} 
        className={`${getSizeClasses(size)} rounded-full object-cover`}
      />
    );
  }

  // وإلا اعرض الحرف الأول من الاسم
  return (
    <div className={`${getSizeClasses(size)} ${getAvatarColor(role)} rounded-full flex items-center justify-center text-white font-medium`}>
      {getInitial(name)}
    </div>
  );
};

export default UserAvatar;