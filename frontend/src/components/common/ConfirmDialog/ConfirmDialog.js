import React from 'react';

/**
 * مكون مربع حوار التأكيد المستخدم قبل القيام بعمليات لا يمكن التراجع عنها
 * @param {boolean} isOpen - حالة ظهور مربع الحوار
 * @param {function} onClose - دالة يتم استدعاؤها عند إغلاق مربع الحوار
 * @param {function} onConfirm - دالة يتم استدعاؤها عند تأكيد الإجراء
 * @param {string} title - عنوان مربع الحوار
 * @param {string} message - محتوى رسالة التأكيد
 * @param {string} confirmButtonText - نص زر التأكيد (الافتراضي: "نعم، متأكد")
 * @param {string} cancelButtonText - نص زر الإلغاء (الافتراضي: "إلغاء")
 * @param {string} type - نوع مربع الحوار ('danger', 'warning', 'info')
 * @param {boolean} loading - حالة التحميل، عند true يتم تعطيل الأزرار وإظهار مؤشر التحميل
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'نعم، متأكد',
  cancelButtonText = 'إلغاء',
  type = 'danger',
  loading = false
}) => {
  if (!isOpen) return null;

  // تعيين الألوان بناءً على نوع مربع الحوار
  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  };
  
  // تعيين الأيقونة بناءً على نوع مربع الحوار
  const getIcon = () => {
    switch(type) {
      case 'danger':
        return (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-4">
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-6 text-right">
            <div className="sm:flex sm:items-start">
              {getIcon()}
              <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">{title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={loading}
                className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${buttonStyles[type]}`}
                onClick={onConfirm}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التنفيذ...
                  </>
                ) : (
                  confirmButtonText
                )}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
                disabled={loading}
              >
                {cancelButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;