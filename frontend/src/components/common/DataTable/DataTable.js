import React, { useState } from 'react';
import EmptyState from '../EmptyState/EmptyState';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

/**
 * مكون جدول بيانات قابل للتخصيص
 * يدعم: الترتيب، التحديد المتعدد، تحميل البيانات، وغيرها من الخصائص
 * 
 * @param {Array} columns - تعريف العمدان (مصفوفة من الكائنات التي تحتوي على id, header, accessor, etc.)
 * @param {Array} data - البيانات المعروضة في الجدول
 * @param {boolean} loading - حالة التحميل
 * @param {boolean} selectable - هل يمكن تحديد الصفوف (افتراضي: false)
 * @param {function} onRowClick - دالة تُستدعى عند النقر على صف
 * @param {Array} selectedRows - الصفوف المحددة (عند استخدام الوضع القابل للتحديد)
 * @param {function} onSelectedRowsChange - دالة تُستدعى عند تغيير الصفوف المحددة
 * @param {boolean} compact - عرض الجدول بشكل مدمج (افتراضي: false)
 * @param {boolean} striped - عرض الجدول بأسلوب مخطط (افتراضي: true)
 * @param {boolean} hoverable - إضافة تأثير تحويم على الصفوف (افتراضي: true)
 * @param {string} className - فئات CSS إضافية للجدول
 * @param {string} emptyMessage - رسالة تظهر عند عدم وجود بيانات
 * @param {function} rowClassName - دالة تعيد أسماء الفئات المطبقة على صف (اختياري)
 * @param {boolean} bordered - عرض حدود الجدول (افتراضي: true)
 * @param {boolean} sortable - السماح بفرز الأعمدة (افتراضي: false)
 * @param {function} onSort - دالة تُستدعى عند فرز العمود
 * @param {string} sortColumn - العمود المفروز حاليًا
 * @param {string} sortDirection - اتجاه الفرز ('asc' أو 'desc')
 */
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  selectable = false,
  onRowClick,
  selectedRows = [],
  onSelectedRowsChange,
  compact = false,
  striped = true,
  hoverable = true,
  className = '',
  emptyMessage = 'لا توجد بيانات للعرض',
  rowClassName,
  bordered = true,
  sortable = false,
  onSort,
  sortColumn = '',
  sortDirection = 'asc'
}) => {
  // التحقق من تحديد جميع الصفوف
  const isAllSelected = data.length > 0 && selectedRows.length === data.length;

  // التحقق من تحديد بعض الصفوف
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  // دالة للتعامل مع تحديد جميع الصفوف
  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectedRowsChange([]);
    } else {
      onSelectedRowsChange(data.map(row => row.id));
    }
  };

  // دالة للتعامل مع تحديد صف
  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      onSelectedRowsChange(selectedRows.filter(rowId => rowId !== id));
    } else {
      onSelectedRowsChange([...selectedRows, id]);
    }
  };

  // دالة للتعامل مع فرز العمود
  const handleSort = (columnId) => {
    if (!sortable || !onSort) return;

    let newDirection = 'asc';
    if (sortColumn === columnId && sortDirection === 'asc') {
      newDirection = 'desc';
    }
    onSort(columnId, newDirection);
  };

  // تحديد فئات CSS للجدول
  const tableClasses = [
    'min-w-full divide-y divide-gray-200',
    bordered ? 'border border-gray-200' : '',
    className
  ].join(' ');

  // تحديد فئات CSS للصفوف
  const getRowClasses = (row, index) => {
    const baseClasses = [
      'text-sm',
      compact ? 'h-10' : 'h-14',
      hoverable ? 'hover:bg-gray-50' : '',
      selectedRows.includes(row.id) ? 'bg-blue-50' : '',
      striped && index % 2 !== 0 ? 'bg-gray-50' : '',
      onRowClick ? 'cursor-pointer' : ''
    ];

    if (rowClassName) {
      const customClasses = rowClassName(row);
      if (customClasses) {
        baseClasses.push(customClasses);
      }
    }

    return baseClasses.join(' ');
  };

  // الحصول على أيقونة الفرز
  const getSortIcon = (columnId) => {
    if (!sortable) return null;

    if (sortColumn === columnId) {
      return sortDirection === 'asc' ? (
        <svg className="inline-block w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="inline-block w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    
    return (
      <svg className="inline-block w-4 h-4 mr-1 opacity-0 group-hover:opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  };

  // عرض مؤشر التحميل إذا كانت البيانات قيد التحميل
  if (loading) {
    return (
      <div className="w-full py-8">
        <LoadingSpinner text="جاري تحميل البيانات..." />
      </div>
    );
  }

  // عرض رسالة فارغة إذا لم تكن هناك بيانات
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="لا توجد بيانات"
        message={emptyMessage}
        className="py-8"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses} dir="rtl">
        <thead className="bg-gray-50">
          <tr>
            {/* عمود التحديد */}
            {selectable && onSelectedRowsChange && (
              <th scope="col" className="px-3 py-3 text-right w-12">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={isAllSelected}
                  ref={el => {
                    if (el) {
                      el.indeterminate = isIndeterminate;
                    }
                  }}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            
            {/* عناوين الأعمدة */}
            {columns.map((column) => (
              <th 
                key={column.id} 
                scope="col" 
                className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable && column.sortable !== false ? 'cursor-pointer group' : ''}`}
                onClick={() => column.sortable !== false && handleSort(column.id)}
              >
                {sortable && column.sortable !== false && getSortIcon(column.id)}
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={getRowClasses(row, rowIndex)}
              onClick={() => {
                if (onRowClick && !selectable) {
                  onRowClick(row);
                }
              }}
            >
              {/* خلية التحديد */}
              {selectable && onSelectedRowsChange && (
                <td className="px-3 py-4 whitespace-nowrap w-12" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </td>
              )}
              
              {/* خلايا البيانات */}
              {columns.map((column) => (
                <td
                  key={`${row.id}-${column.id}`}
                  className={`px-3 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                >
                  {column.cell ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;