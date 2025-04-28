import React from 'react';

/**
 * مكون لعرض مؤشر تحميل دوار
 * @param {string} size - حجم المؤشر ('sm', 'md', 'lg')
 * @param {string} color - لون المؤشر ('primary', 'secondary', 'light', 'dark')
 * @param {string} text - نص اختياري يظهر مع المؤشر
 * @param {string} className - فئات CSS إضافية
 * @param {boolean} overlay - إذا كان المؤشر سيظهر على كامل الشاشة كطبقة فوقية
 * @param {boolean} inline - إذا كان المؤشر سيظهر بشكل مضمن في النص (افتراضي: false)
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  text,
  className = '',
  overlay = false,
  inline = false
}) => {
  // تعيين الحجم
  const spinnerSize = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // تعيين اللون
  const spinnerColor = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    light: 'text-gray-200',
    dark: 'text-gray-700',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600'
  };

  // المؤشر الدوار
  const spinner = (
    <div className={`${inline ? 'inline-block' : 'flex flex-col items-center justify-center'}`}>
      <svg
        className={`animate-spin ${spinnerSize[size] || spinnerSize.md} ${
          spinnerColor[color] || spinnerColor.primary
        } ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        data-testid="loading-spinner"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className={`mt-2 text-sm ${spinnerColor[color] || spinnerColor.primary}`}>{text}</p>}
    </div>
  );

  // إذا كان طبقة فوقية، عرض المؤشر في وسط الشاشة مع خلفية شبه شفافة
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;