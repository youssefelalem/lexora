import React from 'react';

/**
 * مكون لعرض حالة فارغة عندما لا توجد بيانات
 * @param {string} title - عنوان رسالة الحالة الفارغة
 * @param {string} message - نص رسالة الحالة الفارغة
 * @param {React.ReactNode} icon - أيقونة اختيارية
 * @param {React.ReactNode} action - زر إجراء اختياري
 * @param {string} className - فئات CSS إضافية
 */
const EmptyState = ({ 
  title, 
  message, 
  icon, 
  action, 
  className = '' 
}) => {
  // أيقونة افتراضية إذا لم يتم تقديم أيقونة
  const defaultIcon = (
    <svg
      className="w-16 h-16 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      ></path>
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}>
      <div className="mb-4">
        {icon || defaultIcon}
      </div>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>}
      {message && <p className="text-sm text-gray-500 max-w-md mb-6">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

/**
 * مكون لعرض حالة فارغة للبحث بدون نتائج
 */
export const EmptySearchResults = ({ 
  searchTerm, 
  message, 
  action 
}) => {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      }
      title="لم يتم العثور على نتائج"
      message={message || `لم نتمكن من العثور على أي نتائج تطابق "${searchTerm}"`}
      action={action}
    />
  );
};

/**
 * مكون لعرض حالة فارغة للقائمة بدون عناصر
 */
export const EmptyList = ({ 
  title = "لا توجد عناصر", 
  message = "لم يتم العثور على أي عناصر", 
  action 
}) => {
  return (
    <EmptyState
      title={title}
      message={message}
      action={action}
    />
  );
};

/**
 * مكون لعرض حالة فارغة للبيانات التي تحتاج إلى إنشاء
 */
export const CreateFirstItem = ({ 
  title = "ابدأ بإنشاء أول عنصر", 
  message, 
  actionText = "إضافة جديد", 
  onAction 
}) => {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
      }
      title={title}
      message={message}
      action={
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="ml-2 -mr-1 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          {actionText}
        </button>
      }
    />
  );
};

export default EmptyState;