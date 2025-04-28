import React from 'react';

/**
 * مكون نافذة حوارية لعرض رسالة الخطأ بشكل أكثر تفصيلاً
 * @param {boolean} isOpen - حالة ظهور النافذة
 * @param {function} onClose - دالة يتم استدعاؤها عند إغلاق النافذة
 * @param {string} title - عنوان النافذة
 * @param {string} message - نص رسالة الخطأ
 * @param {React.ReactNode} [children] - محتوى إضافي اختياري يمكن إضافته
 */
const ErrorModal = ({ isOpen, onClose, title, message, children }) => {
  if (!isOpen) return null;
  
  // التحقق مما إذا كانت الرسالة تحتوي على معلومات محددة
  const containsSpecialMessage = message && typeof message === 'string' && message.includes("دوسييهات");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 outline-none focus:outline-none">
      <div className="relative w-full max-w-md px-4 mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* الرأس */}
          <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {title}
            </h3>
            <button
              className="p-1 ml-0 mr-auto text-gray-400 transition-all bg-transparent border-0 outline-none hover:text-gray-900"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          {/* المحتوى */}
          <div className="relative flex-auto p-6">
            <div className="text-gray-700">
              {containsSpecialMessage ? (
                <div>
                  <p className="mb-4">{message}</p>
                  <div className="p-3 border rounded-md border-amber-200 bg-amber-50 text-amber-800">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">ملاحظة مهمة:</span>
                    </div>
                    <ul className="mr-5 space-y-1 list-disc list-inside">
                      <li>يجب عليك أولاً تعيين مسؤول آخر للدوسييهات المرتبطة بهذا المستخدم</li>
                      <li>يمكنك القيام بذلك من خلال الانتقال إلى "إدارة القضايا" ثم تحديث المسؤول لكل قضية</li>
                      <li>بعد نقل جميع القضايا، يمكنك محاولة حذف المستخدم مرة أخرى</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p>{message}</p>
              )}
              {children && <div className="mt-4">{children}</div>}
            </div>
          </div>
          
          {/* التذييل */}
          <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
            <button
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              موافق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;