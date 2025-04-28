import React from 'react';

/**
 * مكون ترقيم الصفحات للتنقل بين صفحات البيانات
 * @param {number} currentPage - الصفحة الحالية (تبدأ من 1)
 * @param {number} totalPages - إجمالي عدد الصفحات
 * @param {function} onPageChange - دالة تُستدعى عند تغيير الصفحة بالصفحة الجديدة
 * @param {boolean} showFirstLast - إظهار أزرار "الأولى" و "الأخيرة" (افتراضي: true)
 * @param {string} className - فئات CSS الإضافية
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  className = ''
}) => {
  // التحقق من صحة المدخلات
  const page = Math.max(1, Math.min(currentPage, totalPages));
  
  // إنشاء مصفوفة من أرقام الصفحات المراد عرضها
  const getPaginationRange = () => {
    // الحد الأقصى لعدد أرقام الصفحات المعروضة
    const maxPageNumbers = 5;
    
    if (totalPages <= maxPageNumbers) {
      // إذا كان إجمالي الصفحات أقل من أو يساوي الحد الأقصى، اعرض جميع الصفحات
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // وإلا، اعرض صفحات محدودة مع الصفحة الحالية في المنتصف إذا أمكن
      let start = Math.max(1, page - Math.floor(maxPageNumbers / 2));
      let end = Math.min(totalPages, start + maxPageNumbers - 1);
      
      // تعديل البداية إذا كانت النهاية قريبة من إجمالي الصفحات
      if (end === totalPages) {
        start = Math.max(1, end - maxPageNumbers + 1);
      }
      
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  };
  
  // دالة معالجة تغيير الصفحة
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };
  
  // إذا كان هناك صفحة واحدة فقط، لا تعرض ترقيم الصفحات
  if (totalPages <= 1) {
    return null;
  }
  
  // مصفوفة الصفحات المراد عرضها
  const paginationRange = getPaginationRange();
  
  return (
    <div className={`flex justify-center mt-4 ${className}`}>
      <nav className="flex items-center" dir="rtl">
        <ul className="inline-flex space-x-reverse space-x-1">
          {/* زر الصفحة الأولى */}
          {showFirstLast && (
            <li>
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md ${
                  page === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                aria-label="الصفحة الأولى"
              >
                الأولى
              </button>
            </li>
          )}
          
          {/* زر السابق */}
          <li>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md ${
                page === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="الصفحة السابقة"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          
          {/* أرقام الصفحات */}
          {paginationRange.map((pageNumber) => (
            <li key={pageNumber}>
              <button
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-1 rounded-md ${
                  pageNumber === page
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                aria-label={`الصفحة ${pageNumber}`}
                aria-current={pageNumber === page ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          
          {/* زر التالي */}
          <li>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md ${
                page === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="الصفحة التالية"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          
          {/* زر الصفحة الأخيرة */}
          {showFirstLast && (
            <li>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md ${
                  page === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                aria-label="الصفحة الأخيرة"
              >
                الأخيرة
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;