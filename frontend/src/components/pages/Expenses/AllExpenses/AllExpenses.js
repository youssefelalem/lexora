import React, { useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { useNavigate } from 'react-router-dom';

const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // بيانات النفقة الجديدة
  const [newExpense, setNewExpense] = useState({
    titre: '',
    dossierId: '',
    montant: '',
    devise: 'MAD',
    categorie: '',
    dateDepense: new Date().toISOString().split('T')[0],
    description: '',
    statut: 'EN_COURS',
    beneficiaire: '',
    factureReference: '',
    remboursable: false
  });

  // العملات المتاحة
  const devises = [
    { id: 'MAD', name: 'درهم مغربي' },
    { id: 'EUR', name: 'يورو' },
    { id: 'USD', name: 'دولار أمريكي' }
  ];

  // فئات النفقات
  const categories = [
    { id: 'FRAIS_JUSTICE', name: 'رسوم قضائية' },
    { id: 'TRANSPORT', name: 'نفقات النقل' },
    { id: 'FOURNITURES', name: 'لوازم مكتبية' },
    { id: 'HONORAIRES', name: 'أتعاب خبراء' },
    { id: 'COMMUNICATION', name: 'اتصالات' },
    { id: 'HEBERGEMENT', name: 'إقامة' },
    { id: 'REPAS', name: 'وجبات' },
    { id: 'DIVERS', name: 'نفقات متنوعة' }
  ];

  // حالات النفقة
  const statuts = [
    { id: 'EN_COURS', name: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'APPROUVE', name: 'موافق عليها', color: 'bg-green-100 text-green-800' },
    { id: 'REFUSE', name: 'مرفوضة', color: 'bg-red-100 text-red-800' },
    { id: 'REMBOURSE', name: 'تم السداد', color: 'bg-blue-100 text-blue-800' }
  ];

  // قائمة الملفات (ستُجلب من الخادم)
  const [dossiers, setDossiers] = useState([]);

  // جلب بيانات النفقات من الخلفية
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/depenses');
        setExpenses(response.data);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب بيانات النفقات:', err);
        setError('حدث خطأ أثناء جلب بيانات النفقات');
        // استخدام بيانات تجريبية في حالة الخطأ
        setExpenses([
          {
            idDepense: 1,
            titre: 'رسوم المحكمة',
            dossierId: 101,
            dossierReference: 'DS-2025-101',
            dossierTitre: 'قضية شركة الأمل',
            montant: 1500.00,
            devise: 'MAD',
            categorie: 'FRAIS_JUSTICE',
            dateDepense: '2025-04-15',
            description: 'رسوم تسجيل القضية في المحكمة التجارية',
            statut: 'APPROUVE',
            dateCreation: '2025-04-15',
            beneficiaire: 'المحكمة التجارية بالدار البيضاء',
            factureReference: 'RECU-451-2025',
            remboursable: true,
            utilisateurCreationId: 1,
            utilisateurCreationNom: 'أحمد علي',
            cheminJustificatif: '/uploads/justificatifs/recu-451-2025.pdf'
          },
          {
            idDepense: 2,
            titre: 'سفر للاجتماع مع العميل',
            dossierId: 102,
            dossierReference: 'DS-2025-102',
            dossierTitre: 'قضية شركة النور',
            montant: 800.00,
            devise: 'MAD',
            categorie: 'TRANSPORT',
            dateDepense: '2025-04-18',
            description: 'تذاكر القطار والنقل المحلي للقاء العميل في مراكش',
            statut: 'EN_COURS',
            dateCreation: '2025-04-18',
            beneficiaire: 'المكتب',
            factureReference: 'TICKET-789-2025',
            remboursable: true,
            utilisateurCreationId: 2,
            utilisateurCreationNom: 'سمية الحسن',
            cheminJustificatif: '/uploads/justificatifs/tickets-789-2025.pdf'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // جلب بيانات الملفات
    const fetchDossiers = async () => {
      try {
        const response = await axios.get('/api/dossiers');
        setDossiers(response.data);
      } catch (err) {
        console.error('خطأ في جلب بيانات الملفات:', err);
        // بيانات تجريبية في حالة الخطأ
        setDossiers([
          { id: 101, reference: 'DS-2025-101', titre: 'قضية شركة الأمل', client: { id: 1, nom: 'شركة الأمل' } },
          { id: 102, reference: 'DS-2025-102', titre: 'قضية شركة النور', client: { id: 2, nom: 'شركة النور' } }
        ]);
      }
    };
    
    fetchDossiers();
    fetchExpenses();
  }, []);

  // حذف نفقة
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه النفقة؟')) {
      try {
        await axios.delete(`/api/depenses/${id}`);
        setExpenses(expenses.filter(expense => expense.idDepense !== id));
      } catch (err) {
        console.error('خطأ في حذف النفقة:', err);
        setError('حدث خطأ أثناء حذف النفقة');
      }
    }
  };

  // تعديل نفقة
  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setNewExpense({
      titre: expense.titre,
      dossierId: expense.dossierId,
      montant: expense.montant,
      devise: expense.devise,
      categorie: expense.categorie,
      dateDepense: expense.dateDepense,
      description: expense.description,
      statut: expense.statut,
      beneficiaire: expense.beneficiaire,
      factureReference: expense.factureReference,
      remboursable: expense.remboursable
    });
    setShowAddModal(true);
  };

  // حفظ النفقة (إضافة أو تعديل)
  const handleSaveExpense = async () => {
    if (!newExpense.titre || !newExpense.dossierId || !newExpense.montant || !newExpense.categorie) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      let response;
      if (currentExpense) {
        // تعديل نفقة موجودة
        response = await axios.put(`/api/depenses/${currentExpense.idDepense}`, newExpense);
        setExpenses(expenses.map(exp => exp.idDepense === currentExpense.idDepense ? response.data : exp));
      } else {
        // إضافة نفقة جديدة
        response = await axios.post('/api/depenses', newExpense);
        setExpenses([...expenses, response.data]);
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('خطأ في حفظ النفقة:', err);
      setError('حدث خطأ أثناء حفظ النفقة');
      
      // عملية محاكاة للإضافة في حالة الخطأ (للتطوير فقط)
      if (!currentExpense) {
        const mockExpense = {
          idDepense: expenses.length + 1,
          ...newExpense,
          dossierReference: dossiers.find(d => d.id === parseInt(newExpense.dossierId))?.reference || 'ملف غير معروف',
          dossierTitre: dossiers.find(d => d.id === parseInt(newExpense.dossierId))?.titre || 'ملف غير معروف',
          dateCreation: new Date().toISOString().split('T')[0],
          utilisateurCreationId: 1,
          utilisateurCreationNom: 'مستخدم نظام',
          cheminJustificatif: ''
        };
        setExpenses([...expenses, mockExpense]);
        setShowAddModal(false);
        resetForm();
      } else {
        // عملية محاكاة للتعديل
        const updatedExpenses = expenses.map(exp => {
          if (exp.idDepense === currentExpense.idDepense) {
            return {
              ...exp,
              ...newExpense,
              dossierReference: dossiers.find(d => d.id === parseInt(newExpense.dossierId))?.reference || exp.dossierReference,
              dossierTitre: dossiers.find(d => d.id === parseInt(newExpense.dossierId))?.titre || exp.dossierTitre
            };
          }
          return exp;
        });
        setExpenses(updatedExpenses);
        setShowAddModal(false);
        resetForm();
      }
    }
  };

  // تحديث حالة النفقة
  const handleStatusChange = async (id, newStatus) => {
    try {
      const expenseToUpdate = expenses.find(exp => exp.idDepense === id);
      if (!expenseToUpdate) return;
      
      await axios.patch(`/api/depenses/${id}/status`, { statut: newStatus });
      
      // تحديث النفقة في القائمة المحلية
      setExpenses(expenses.map(exp => {
        if (exp.idDepense === id) {
          return { ...exp, statut: newStatus };
        }
        return exp;
      }));
    } catch (err) {
      console.error('خطأ في تحديث حالة النفقة:', err);
      setError('حدث خطأ أثناء تحديث حالة النفقة');
      
      // عملية محاكاة للتحديث (للتطوير فقط)
      setExpenses(expenses.map(exp => {
        if (exp.idDepense === id) {
          return { ...exp, statut: newStatus };
        }
        return exp;
      }));
    }
  };

  // معالجة التغيير في نموذج النفقة
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setCurrentExpense(null);
    setNewExpense({
      titre: '',
      dossierId: '',
      montant: '',
      devise: 'MAD',
      categorie: '',
      dateDepense: new Date().toISOString().split('T')[0],
      description: '',
      statut: 'EN_COURS',
      beneficiaire: '',
      factureReference: '',
      remboursable: false
    });
  };

  // عرض مستند التبرير
  const viewJustificatif = (path) => {
    if (!path) {
      alert('لا يوجد مستند تبرير مرفق');
      return;
    }
    
    // في حالة وجود ملف حقيقي، نفتحه في نافذة جديدة
    window.open(path, '_blank');
  };

  // رفع مستند التبرير
  const uploadJustificatif = async (expenseId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`/api/depenses/${expenseId}/justificatif`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // تحديث مسار المستند في النفقة
      setExpenses(expenses.map(exp => {
        if (exp.idDepense === expenseId) {
          return { ...exp, cheminJustificatif: response.data.cheminJustificatif };
        }
        return exp;
      }));
      
      alert('تم رفع المستند بنجاح');
    } catch (err) {
      console.error('خطأ في رفع المستند:', err);
      alert('حدث خطأ أثناء رفع المستند');
    }
  };

  // تصفية النفقات بناءً على البحث
  const filteredExpenses = expenses.filter(expense => {
    const searchLower = searchTerm.toLowerCase();
    return (
      expense.titre?.toLowerCase().includes(searchLower) ||
      expense.dossierReference?.toLowerCase().includes(searchLower) ||
      expense.beneficiaire?.toLowerCase().includes(searchLower) ||
      expense.categorie?.toLowerCase().includes(searchLower) ||
      expense.montant?.toString().includes(searchTerm)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <h1 className="mb-4 text-2xl font-semibold text-gray-800 md:mb-0">إدارة النفقات</h1>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في النفقات..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <button
              className="px-4 py-2 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                إضافة نفقة جديدة
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500">
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">العنوان</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">الملف</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">الفئة</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">المبلغ</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">المستفيد</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">تاريخ النفقة</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">الحالة</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                    <div className="flex justify-center">
                      <svg className="w-5 h-5 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                    لم يتم العثور على نفقات
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.idDepense} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <div className="font-medium">{expense.titre}</div>
                      {expense.factureReference && (
                        <div className="text-xs text-gray-500">
                          رقم الفاتورة: {expense.factureReference}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <div>{expense.dossierReference}</div>
                      <div className="text-xs text-gray-500">{expense.dossierTitre}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {categories.find(c => c.id === expense.categorie)?.name || expense.categorie}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {expense.montant.toFixed(2)} {expense.devise}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {expense.beneficiaire}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(expense.dateDepense).toLocaleDateString('ar-MA')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative dropdown">
                        <div className="dropdown-toggle">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer
                            ${statuts.find(s => s.id === expense.statut)?.color || 'bg-gray-100 text-gray-800'}`}

                            onClick={(e) => {
                              e.currentTarget.nextElementSibling.classList.toggle('hidden');
                            }}
                          >
                            {statuts.find(s => s.id === expense.statut)?.name || expense.statut}
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </span>
                        </div>
                        <div className="absolute left-0 z-10 hidden w-48 mt-1 bg-white rounded-md shadow-lg dropdown-menu">
                          {statuts.map(s => (
                            <button
                              key={s.id}
                              className={`block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${expense.statut === s.id ? 'bg-gray-100' : ''}`}
                              onClick={(e) => {
                                e.currentTarget.parentElement.classList.add('hidden');
                                handleStatusChange(expense.idDepense, s.id);
                              }}
                            >
                              {s.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="mx-1 text-blue-600 hover:text-blue-900"
                          onClick={() => handleEdit(expense)}
                          title="تعديل"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          className="mx-1 text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(expense.idDepense)}
                          title="حذف"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                        <label
                          htmlFor={`justificatif-${expense.idDepense}`}
                          className="mx-1 text-gray-600 cursor-pointer hover:text-gray-900"
                          title="إرفاق مستند"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                          </svg>
                          <input
                            id={`justificatif-${expense.idDepense}`}
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                uploadJustificatif(expense.idDepense, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                        {expense.cheminJustificatif && (
                          <button
                            className="mx-1 text-green-600 hover:text-green-900"
                            onClick={() => viewJustificatif(expense.cheminJustificatif)}
                            title="عرض المستند"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نموذج إضافة/تعديل نفقة */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block overflow-hidden text-right align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                  {currentExpense ? 'تعديل نفقة' : 'إضافة نفقة جديدة'}
                </h3>
                <form>
                  <div className="grid grid-cols-1 gap-y-4">
                    {/* عنوان النفقة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">عنوان النفقة</label>
                      <input
                        type="text"
                        name="titre"
                        value={newExpense.titre}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* الملف المرتبط */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الملف المرتبط</label>
                      <select
                        name="dossierId"
                        value={newExpense.dossierId}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">-- اختر الملف --</option>
                        {dossiers.map(dossier => (
                          <option key={dossier.id} value={dossier.id}>{dossier.reference} - {dossier.titre}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* المبلغ والعملة */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">المبلغ</label>
                        <input
                          type="number"
                          name="montant"
                          value={newExpense.montant}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">العملة</label>
                        <select
                          name="devise"
                          value={newExpense.devise}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {devises.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* فئة النفقة وتاريخها */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">الفئة</label>
                        <select
                          name="categorie"
                          value={newExpense.categorie}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">-- اختر الفئة --</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">تاريخ النفقة</label>
                        <input
                          type="date"
                          name="dateDepense"
                          value={newExpense.dateDepense}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* المستفيد ومرجع الفاتورة */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">المستفيد</label>
                        <input
                          type="text"
                          name="beneficiaire"
                          value={newExpense.beneficiaire}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">مرجع الفاتورة</label>
                        <input
                          type="text"
                          name="factureReference"
                          value={newExpense.factureReference}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* حالة النفقة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">حالة النفقة</label>
                      <select
                        name="statut"
                        value={newExpense.statut}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {statuts.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* قابلية السداد */}
                    <div className="flex items-center">
                      <input
                        id="remboursable"
                        name="remboursable"
                        type="checkbox"
                        checked={newExpense.remboursable}
                        onChange={handleInputChange}
                        className="w-4 h-4 ml-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="remboursable" className="text-sm text-gray-700">
                        قابل للاسترداد
                      </label>
                    </div>
                    
                    {/* وصف النفقة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">وصف النفقة</label>
                      <textarea
                        name="description"
                        value={newExpense.description}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveExpense}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {currentExpense ? 'تعديل' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllExpenses;