import React, { useState } from 'react';
import { userService } from '../../services/api';

/**
 * مكون اختبار لتجربة تحديث الأدوار
 * Component for testing role updates
 */
const RoleUpdateTest = () => {
  const [userId, setUserId] = useState('');
  const [newRole, setNewRole] = useState('AVOCAT');
  const [isActive, setIsActive] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // معالج تحديث الدور
  const handleRoleUpdate = async () => {
    if (!userId) {
      setResult({ success: false, message: 'يرجى إدخال معرف المستخدم' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // البيانات المرسلة للخادم
      const userData = {
        role: newRole,
        estActive: isActive
      };

      console.log('إرسال البيانات:', userData);
      
      // استدعاء API لتحديث المستخدم
      const response = await userService.updateUser(userId, userData);
      
      console.log('استجابة الخادم:', response);
      
      setResult({
        success: true,
        message: 'تم تحديث الدور بنجاح',
        data: response.data
      });
    } catch (error) {
      console.error('خطأ في تحديث الدور:', error);
      
      let errorMessage = 'فشل في تحديث الدور';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setResult({
        success: false,
        message: errorMessage,
        details: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        اختبار تحديث الأدوار
      </h2>
      
      <div className="space-y-4">
        {/* حقل معرف المستخدم */}
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            معرف المستخدم
          </label>
          <input
            id="userId"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل معرف المستخدم"
          />
        </div>

        {/* اختيار الدور */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            الدور الجديد
          </label>
          <select
            id="role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ADMINISTRATEUR">مدير النظام</option>
            <option value="AVOCAT">محامي</option>
            <option value="ASSISTANT_JURIDIQUE">مساعد قانوني</option>
          </select>
        </div>

        {/* حالة النشاط */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">نشط</span>
          </label>
        </div>

        {/* زر التحديث */}
        <button
          onClick={handleRoleUpdate}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {loading ? 'جارٍ التحديث...' : 'تحديث الدور'}
        </button>
      </div>

      {/* عرض النتيجة */}
      {result && (
        <div className={`mt-4 p-4 rounded-md ${
          result.success 
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <p className="font-medium">{result.message}</p>
          
          {result.success && result.data && (
            <div className="mt-2 text-sm">
              <p><strong>الاسم:</strong> {result.data.prenom} {result.data.nom}</p>
              <p><strong>البريد الإلكتروني:</strong> {result.data.email}</p>
              <p><strong>الدور:</strong> {result.data.role}</p>
              <p><strong>نشط:</strong> {result.data.estActive ? 'نعم' : 'لا'}</p>
            </div>
          )}
          
          {!result.success && result.details && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">
                تفاصيل الخطأ
              </summary>
              <pre className="mt-1 text-xs bg-red-50 p-2 rounded overflow-x-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleUpdateTest;
