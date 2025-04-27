import React, { useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { useNavigate } from 'react-router-dom';

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // بيانات جديدة للمدفوعات
  const [newPayment, setNewPayment] = useState({
    clientId: '',
    dossierId: '',
    factureId: '',
    montant: '',
    devise: 'MAD', // العملة الافتراضية
    methode: 'VIREMENT', // طريقة الدفع الافتراضية
    datePaiement: new Date().toISOString().split('T')[0],
    numeroReference: '',
    banqueReference: '',
    notes: '',
    statut: 'ACTIF'
  });

  // طرق الدفع المتاحة
  const methodesPayment = [
    { id: 'ESPECE', name: 'نقدًا' },
    { id: 'CHEQUE', name: 'شيك' },
    { id: 'VIREMENT', name: 'تحويل بنكي' },
    { id: 'CARTE', name: 'بطاقة بنكية' }
  ];

  // العملات المتاحة
  const devises = [
    { id: 'MAD', name: 'درهم مغربي' },
    { id: 'EUR', name: 'يورو' },
    { id: 'USD', name: 'دولار أمريكي' }
  ];

  // حالات الدفع
  const statuts = [
    { id: 'ACTIF', name: 'مفعّل' },
    { id: 'EN_ATTENTE', name: 'قيد الانتظار' },
    { id: 'ANNULE', name: 'ملغى' }
  ];

  // قائمة العملاء (ستُجلب من الخادم)
  const [clients, setClients] = useState([]);
  // قائمة الملفات (ستُجلب من الخادم)
  const [dossiers, setDossiers] = useState([]);
  // قائمة الفواتير (ستُجلب من الخادم)
  const [factures, setFactures] = useState([]);

  // جلب بيانات المدفوعات من الخلفية
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/paiements');
        setPayments(response.data);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب بيانات المدفوعات:', err);
        setError('حدث خطأ أثناء جلب بيانات المدفوعات');
        // استخدام بيانات تجريبية في حالة الخطأ
        setPayments([
          {
            idPaiement: 1,
            clientId: 1,
            clientNom: 'شركة الأمل',
            dossierId: 101,
            dossierReference: 'DS-2025-101',
            factureId: 501,
            factureNumero: 'FACT-2025-501',
            montant: 5000.00,
            devise: 'MAD',
            methode: 'VIREMENT',
            datePaiement: '2025-04-15',
            numeroReference: 'REF123456',
            banqueReference: 'بنك المغرب',
            notes: 'دفعة أولى',
            statut: 'ACTIF',
            dateCreation: '2025-04-10',
            utilisateurCreationId: 1,
            utilisateurCreationNom: 'أحمد علي'
          },
          {
            idPaiement: 2,
            clientId: 2,
            clientNom: 'شركة النور',
            dossierId: 102,
            dossierReference: 'DS-2025-102',
            factureId: 502,
            factureNumero: 'FACT-2025-502',
            montant: 7500.00,
            devise: 'MAD',
            methode: 'CHEQUE',
            datePaiement: '2025-04-18',
            numeroReference: 'CHK789012',
            banqueReference: 'البنك الشعبي',
            notes: 'دفعة كاملة',
            statut: 'ACTIF',
            dateCreation: '2025-04-17',
            utilisateurCreationId: 2,
            utilisateurCreationNom: 'سمية الحسن'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // جلب البيانات المطلوبة
    const fetchRequiredData = async () => {
      try {
        // جلب بيانات العملاء
        const clientsResponse = await axios.get('/api/clients');
        setClients(clientsResponse.data);
        
        // جلب بيانات الملفات
        const dossiersResponse = await axios.get('/api/dossiers');
        setDossiers(dossiersResponse.data);
        
        // جلب بيانات الفواتير
        const facturesResponse = await axios.get('/api/factures');
        setFactures(facturesResponse.data);
      } catch (err) {
        console.error('خطأ في جلب البيانات المطلوبة:', err);
        // بيانات تجريبية في حالة الخطأ
        setClients([
          { id: 1, nom: 'شركة الأمل' },
          { id: 2, nom: 'شركة النور' }
        ]);
        setDossiers([
          { id: 101, reference: 'DS-2025-101', client: { id: 1, nom: 'شركة الأمل' } },
          { id: 102, reference: 'DS-2025-102', client: { id: 2, nom: 'شركة النور' } }
        ]);
        setFactures([
          { id: 501, numero: 'FACT-2025-501', dossier: { id: 101 }, client: { id: 1 } },
          { id: 502, numero: 'FACT-2025-502', dossier: { id: 102 }, client: { id: 2 } }
        ]);
      }
    };
    
    fetchRequiredData();
    fetchPayments();
  }, []);

  // حذف دفعة
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      try {
        await axios.delete(`/api/paiements/${id}`);
        setPayments(payments.filter(payment => payment.idPaiement !== id));
      } catch (err) {
        console.error('خطأ في حذف الدفعة:', err);
        setError('حدث خطأ أثناء حذف الدفعة');
      }
    }
  };

  // تعديل دفعة
  const handleEdit = (payment) => {
    setCurrentPayment(payment);
    setNewPayment({
      clientId: payment.clientId,
      dossierId: payment.dossierId,
      factureId: payment.factureId,
      montant: payment.montant,
      devise: payment.devise,
      methode: payment.methode,
      datePaiement: payment.datePaiement,
      numeroReference: payment.numeroReference,
      banqueReference: payment.banqueReference,
      notes: payment.notes,
      statut: payment.statut
    });
    setShowAddModal(true);
  };

  // حفظ الدفعة (إضافة أو تعديل)
  const handleSavePayment = async () => {
    try {
      let response;
      if (currentPayment) {
        // تعديل دفعة موجودة
        response = await axios.put(`/api/paiements/${currentPayment.idPaiement}`, newPayment);
        setPayments(payments.map(p => p.idPaiement === currentPayment.idPaiement ? response.data : p));
      } else {
        // إضافة دفعة جديدة
        response = await axios.post('/api/paiements', newPayment);
        setPayments([...payments, response.data]);
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('خطأ في حفظ الدفعة:', err);
      setError('حدث خطأ أثناء حفظ الدفعة');
      
      // عملية محاكاة للإضافة في حالة الخطأ (للتطوير فقط)
      if (!currentPayment) {
        const mockPayment = {
          idPaiement: payments.length + 1,
          ...newPayment,
          clientNom: clients.find(c => c.id === parseInt(newPayment.clientId))?.nom || 'عميل غير معروف',
          dossierReference: dossiers.find(d => d.id === parseInt(newPayment.dossierId))?.reference || 'ملف غير معروف',
          factureNumero: factures.find(f => f.id === parseInt(newPayment.factureId))?.numero || 'فاتورة غير معروفة',
          dateCreation: new Date().toISOString().split('T')[0],
          utilisateurCreationId: 1,
          utilisateurCreationNom: 'مستخدم نظام'
        };
        setPayments([...payments, mockPayment]);
        setShowAddModal(false);
        resetForm();
      } else {
        // عملية محاكاة للتعديل
        const updatedPayments = payments.map(p => {
          if (p.idPaiement === currentPayment.idPaiement) {
            return {
              ...p,
              ...newPayment,
              clientNom: clients.find(c => c.id === parseInt(newPayment.clientId))?.nom || p.clientNom,
              dossierReference: dossiers.find(d => d.id === parseInt(newPayment.dossierId))?.reference || p.dossierReference,
              factureNumero: factures.find(f => f.id === parseInt(newPayment.factureId))?.numero || p.factureNumero
            };
          }
          return p;
        });
        setPayments(updatedPayments);
        setShowAddModal(false);
        resetForm();
      }
    }
  };

  // تحديث بيانات النموذج عند التعديل
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: value
    });
    
    // تحديث معلومات الملف والفاتورة بناءً على العميل المختار
    if (name === 'clientId') {
      const clientDossiers = dossiers.filter(d => d.client?.id === parseInt(value));
      if (clientDossiers.length > 0) {
        setNewPayment(prev => ({
          ...prev,
          dossierId: clientDossiers[0].id
        }));
        
        const dossierFactures = factures.filter(f => f.dossier?.id === clientDossiers[0].id);
        if (dossierFactures.length > 0) {
          setNewPayment(prev => ({
            ...prev,
            factureId: dossierFactures[0].id
          }));
        }
      }
    }
    
    // تحديث الفاتورة بناءً على الملف المختار
    if (name === 'dossierId') {
      const dossierFactures = factures.filter(f => f.dossier?.id === parseInt(value));
      if (dossierFactures.length > 0) {
        setNewPayment(prev => ({
          ...prev,
          factureId: dossierFactures[0].id
        }));
      }
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setCurrentPayment(null);
    setNewPayment({
      clientId: '',
      dossierId: '',
      factureId: '',
      montant: '',
      devise: 'MAD',
      methode: 'VIREMENT',
      datePaiement: new Date().toISOString().split('T')[0],
      numeroReference: '',
      banqueReference: '',
      notes: '',
      statut: 'ACTIF'
    });
  };

  // تصفية المدفوعات بناءً على البحث
  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.clientNom?.toLowerCase().includes(searchLower) ||
      payment.dossierReference?.toLowerCase().includes(searchLower) ||
      payment.factureNumero?.toLowerCase().includes(searchLower) ||
      payment.montant?.toString().includes(searchTerm) ||
      payment.numeroReference?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <h1 className="mb-4 text-2xl font-semibold text-gray-800 md:mb-0">إدارة المدفوعات</h1>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في المدفوعات..."
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
                إضافة دفعة جديدة
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
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">العميل</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">الملف</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">الفاتورة</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">المبلغ</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">طريقة الدفع</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">تاريخ الدفع</th>
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
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                    لم يتم العثور على مدفوعات
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.idPaiement} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {payment.clientNom}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {payment.dossierReference}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {payment.factureNumero}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {payment.montant} {payment.devise}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {methodesPayment.find(m => m.id === payment.methode)?.name || payment.methode}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(payment.datePaiement).toLocaleDateString('ar-MA')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${payment.statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 
                          payment.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {statuts.find(s => s.id === payment.statut)?.name || payment.statut}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                      <button
                        className="mx-1 text-blue-600 hover:text-blue-900"
                        onClick={() => handleEdit(payment)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        className="mx-1 text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(payment.idPaiement)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نموذج إضافة/تعديل دفعة */}
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
                  {currentPayment ? 'تعديل دفعة' : 'إضافة دفعة جديدة'}
                </h3>
                <form>
                  <div className="grid grid-cols-1 gap-y-4">
                    {/* العميل */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">العميل</label>
                      <select
                        name="clientId"
                        value={newPayment.clientId}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">-- اختر العميل --</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.nom}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* الملف */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الملف</label>
                      <select
                        name="dossierId"
                        value={newPayment.dossierId}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">-- اختر الملف --</option>
                        {dossiers
                          .filter(dossier => !newPayment.clientId || dossier.client?.id === parseInt(newPayment.clientId))
                          .map(dossier => (
                            <option key={dossier.id} value={dossier.id}>{dossier.reference}</option>
                          ))
                        }
                      </select>
                    </div>
                    
                    {/* الفاتورة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الفاتورة</label>
                      <select
                        name="factureId"
                        value={newPayment.factureId}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">-- اختر الفاتورة --</option>
                        {factures
                          .filter(facture => !newPayment.dossierId || facture.dossier?.id === parseInt(newPayment.dossierId))
                          .map(facture => (
                            <option key={facture.id} value={facture.id}>{facture.numero}</option>
                          ))
                        }
                      </select>
                    </div>
                    
                    {/* المبلغ والعملة */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">المبلغ</label>
                        <input
                          type="number"
                          name="montant"
                          value={newPayment.montant}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">العملة</label>
                        <select
                          name="devise"
                          value={newPayment.devise}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {devises.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* طريقة الدفع وتاريخ الدفع */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">طريقة الدفع</label>
                        <select
                          name="methode"
                          value={newPayment.methode}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {methodesPayment.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">تاريخ الدفع</label>
                        <input
                          type="date"
                          name="datePaiement"
                          value={newPayment.datePaiement}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* مرجع الدفع والبنك */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">مرجع الدفع</label>
                        <input
                          type="text"
                          name="numeroReference"
                          value={newPayment.numeroReference}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">البنك</label>
                        <input
                          type="text"
                          name="banqueReference"
                          value={newPayment.banqueReference}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* حالة الدفع */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">حالة الدفع</label>
                      <select
                        name="statut"
                        value={newPayment.statut}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {statuts.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* ملاحظات */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
                      <textarea
                        name="notes"
                        value={newPayment.notes}
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
                  onClick={handleSavePayment}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {currentPayment ? 'تعديل' : 'إضافة'}
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

export default AllPayments;