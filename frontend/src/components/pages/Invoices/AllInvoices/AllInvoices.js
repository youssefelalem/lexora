import React, { useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { useNavigate } from 'react-router-dom';

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // بيانات الفاتورة الجديدة
  const [newInvoice, setNewInvoice] = useState({
    numero: '',
    clientId: '',
    dossierId: '',
    tva: 20,
    devise: 'MAD',
    dateEmission: new Date().toISOString().split('T')[0],
    dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    notes: '',
    statut: 'NON_PAYEE',
    elements: []
  });

  // بيانات عنصر الفاتورة الجديد
  const [newElement, setNewElement] = useState({
    description: '',
    quantite: 1,
    prixUnitaire: 0,
    montantTotal: 0
  });

  // العملات المتاحة
  const devises = [
    { id: 'MAD', name: 'درهم مغربي' },
    { id: 'EUR', name: 'يورو' },
    { id: 'USD', name: 'دولار أمريكي' }
  ];

  // حالات الفاتورة
  const statuts = [
    { id: 'NON_PAYEE', name: 'غير مدفوعة', color: 'bg-red-100 text-red-800' },
    { id: 'PARTIELLEMENT_PAYEE', name: 'مدفوعة جزئياً', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'PAYEE', name: 'مدفوعة بالكامل', color: 'bg-green-100 text-green-800' },
    { id: 'ANNULEE', name: 'ملغاة', color: 'bg-gray-100 text-gray-800' }
  ];

  // قائمة العملاء (ستُجلب من الخادم)
  const [clients, setClients] = useState([]);
  // قائمة الملفات (ستُجلب من الخادم)
  const [dossiers, setDossiers] = useState([]);

  // جلب بيانات الفواتير من الخلفية
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/factures');
        setInvoices(response.data);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب بيانات الفواتير:', err);
        setError('حدث خطأ أثناء جلب بيانات الفواتير');
        // استخدام بيانات تجريبية في حالة الخطأ
        setInvoices([
          {
            idFacture: 1,
            numero: 'FACT-2025-001',
            clientId: 1,
            clientNom: 'شركة الأمل',
            dossierId: 101,
            dossierReference: 'DS-2025-101',
            montantTotal: 6000.00,
            montantPaye: 4000.00,
            montantRestant: 2000.00,
            tva: 20,
            devise: 'MAD',
            statut: 'PARTIELLEMENT_PAYEE',
            dateEmission: '2025-04-10',
            dateEcheance: '2025-05-10',
            dateCreation: '2025-04-10',
            notes: 'فاتورة خدمات قانونية - أبريل 2025',
            nombrePaiements: 1,
            utilisateurCreationId: 1,
            utilisateurCreationNom: 'أحمد علي',
            elements: [
              {
                idElementFacture: 1,
                description: 'استشارة قانونية',
                quantite: 2,
                prixUnitaire: 1500.00,
                montantTotal: 3000.00
              },
              {
                idElementFacture: 2,
                description: 'تمثيل قانوني',
                quantite: 1,
                prixUnitaire: 3000.00,
                montantTotal: 3000.00
              }
            ]
          },
          {
            idFacture: 2,
            numero: 'FACT-2025-002',
            clientId: 2,
            clientNom: 'شركة النور',
            dossierId: 102,
            dossierReference: 'DS-2025-102',
            montantTotal: 8000.00,
            montantPaye: 8000.00,
            montantRestant: 0.00,
            tva: 20,
            devise: 'MAD',
            statut: 'PAYEE',
            dateEmission: '2025-04-15',
            dateEcheance: '2025-05-15',
            dateCreation: '2025-04-15',
            notes: 'فاتورة خدمات قانونية - أبريل 2025',
            nombrePaiements: 2,
            utilisateurCreationId: 1,
            utilisateurCreationNom: 'أحمد علي',
            elements: [
              {
                idElementFacture: 3,
                description: 'استشارة قانونية',
                quantite: 3,
                prixUnitaire: 1500.00,
                montantTotal: 4500.00
              },
              {
                idElementFacture: 4,
                description: 'تمثيل قانوني',
                quantite: 1,
                prixUnitaire: 3500.00,
                montantTotal: 3500.00
              }
            ]
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
      }
    };
    
    fetchRequiredData();
    fetchInvoices();
  }, []);

  // حذف فاتورة
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      try {
        await axios.delete(`/api/factures/${id}`);
        setInvoices(invoices.filter(invoice => invoice.idFacture !== id));
      } catch (err) {
        console.error('خطأ في حذف الفاتورة:', err);
        setError('حدث خطأ أثناء حذف الفاتورة');
      }
    }
  };

  // تعديل فاتورة
  const handleEdit = (invoice) => {
    setCurrentInvoice(invoice);
    setNewInvoice({
      numero: invoice.numero,
      clientId: invoice.clientId,
      dossierId: invoice.dossierId,
      tva: invoice.tva,
      devise: invoice.devise,
      dateEmission: invoice.dateEmission,
      dateEcheance: invoice.dateEcheance,
      notes: invoice.notes,
      statut: invoice.statut,
      elements: [...invoice.elements]
    });
    setShowAddModal(true);
  };

  // إضافة عنصر جديد للفاتورة
  const handleAddElement = () => {
    if (!newElement.description || newElement.quantite <= 0 || newElement.prixUnitaire <= 0) {
      alert('يرجى ملء جميع الحقول بشكل صحيح');
      return;
    }
    
    const calculatedTotal = newElement.quantite * newElement.prixUnitaire;
    
    const element = {
      ...newElement,
      idElementFacture: Math.random().toString(36).substr(2, 9), // معرف مؤقت
      montantTotal: calculatedTotal
    };
    
    setNewInvoice({
      ...newInvoice,
      elements: [...newInvoice.elements, element]
    });
    
    // إعادة تعيين نموذج العنصر
    setNewElement({
      description: '',
      quantite: 1,
      prixUnitaire: 0,
      montantTotal: 0
    });
  };

  // حذف عنصر من الفاتورة
  const handleRemoveElement = (index) => {
    const updatedElements = [...newInvoice.elements];
    updatedElements.splice(index, 1);
    setNewInvoice({
      ...newInvoice,
      elements: updatedElements
    });
  };

  // حساب المجموع الكلي للفاتورة
  const calculateTotal = (elements) => {
    return elements.reduce((sum, element) => sum + element.montantTotal, 0);
  };

  // حساب المبلغ مع الضريبة
  const calculateTotalWithTax = (elements, tva) => {
    const subtotal = calculateTotal(elements);
    const taxAmount = subtotal * (tva / 100);
    return subtotal + taxAmount;
  };

  // حفظ الفاتورة (إضافة أو تعديل)
  const handleSaveInvoice = async () => {
    if (!newInvoice.clientId || !newInvoice.dossierId || newInvoice.elements.length === 0) {
      alert('يرجى ملء جميع الحقول المطلوبة وإضافة عنصر واحد على الأقل');
      return;
    }

    try {
      let response;
      // حساب المبالغ الإجمالية
      const montantTotal = calculateTotalWithTax(newInvoice.elements, newInvoice.tva);
      const invoiceData = {
        ...newInvoice,
        montantTotal,
        montantPaye: currentInvoice ? currentInvoice.montantPaye : 0,
        montantRestant: currentInvoice ? montantTotal - currentInvoice.montantPaye : montantTotal
      };
      
      if (currentInvoice) {
        // تعديل فاتورة موجودة
        response = await axios.put(`/api/factures/${currentInvoice.idFacture}`, invoiceData);
        setInvoices(invoices.map(inv => inv.idFacture === currentInvoice.idFacture ? response.data : inv));
      } else {
        // إضافة فاتورة جديدة
        response = await axios.post('/api/factures', invoiceData);
        setInvoices([...invoices, response.data]);
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('خطأ في حفظ الفاتورة:', err);
      setError('حدث خطأ أثناء حفظ الفاتورة');
      
      // عملية محاكاة للإضافة في حالة الخطأ (للتطوير فقط)
      if (!currentInvoice) {
        const montantTotal = calculateTotalWithTax(newInvoice.elements, newInvoice.tva);
        const mockInvoice = {
          idFacture: invoices.length + 1,
          ...newInvoice,
          numero: newInvoice.numero || `FACT-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
          clientNom: clients.find(c => c.id === parseInt(newInvoice.clientId))?.nom || 'عميل غير معروف',
          dossierReference: dossiers.find(d => d.id === parseInt(newInvoice.dossierId))?.reference || 'ملف غير معروف',
          montantTotal: montantTotal,
          montantPaye: 0,
          montantRestant: montantTotal,
          dateCreation: new Date().toISOString().split('T')[0],
          nombrePaiements: 0,
          utilisateurCreationId: 1,
          utilisateurCreationNom: 'مستخدم نظام'
        };
        setInvoices([...invoices, mockInvoice]);
        setShowAddModal(false);
        resetForm();
      } else {
        // عملية محاكاة للتعديل
        const montantTotal = calculateTotalWithTax(newInvoice.elements, newInvoice.tva);
        const updatedInvoices = invoices.map(inv => {
          if (inv.idFacture === currentInvoice.idFacture) {
            return {
              ...inv,
              ...newInvoice,
              clientNom: clients.find(c => c.id === parseInt(newInvoice.clientId))?.nom || inv.clientNom,
              dossierReference: dossiers.find(d => d.id === parseInt(newInvoice.dossierId))?.reference || inv.dossierReference,
              montantTotal: montantTotal,
              montantRestant: montantTotal - inv.montantPaye
            };
          }
          return inv;
        });
        setInvoices(updatedInvoices);
        setShowAddModal(false);
        resetForm();
      }
    }
  };

  // تحديث بيانات النموذج عند التعديل
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice({
      ...newInvoice,
      [name]: value
    });
    
    // تحديث معلومات الملف بناءً على العميل المختار
    if (name === 'clientId') {
      const clientDossiers = dossiers.filter(d => d.client?.id === parseInt(value));
      if (clientDossiers.length > 0) {
        setNewInvoice(prev => ({
          ...prev,
          dossierId: clientDossiers[0].id
        }));
      }
    }
  };

  // تحديث بيانات عنصر الفاتورة الجديد
  const handleElementChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'quantite' || name === 'prixUnitaire') {
      const updatedElement = {
        ...newElement,
        [name]: parseFloat(value) || 0
      };
      
      const quantite = name === 'quantite' ? parseFloat(value) || 0 : newElement.quantite;
      const prixUnitaire = name === 'prixUnitaire' ? parseFloat(value) || 0 : newElement.prixUnitaire;
      
      updatedElement.montantTotal = quantite * prixUnitaire;
      
      setNewElement(updatedElement);
    } else {
      setNewElement({
        ...newElement,
        [name]: value
      });
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setCurrentInvoice(null);
    setNewInvoice({
      numero: '',
      clientId: '',
      dossierId: '',
      tva: 20,
      devise: 'MAD',
      dateEmission: new Date().toISOString().split('T')[0],
      dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      notes: '',
      statut: 'NON_PAYEE',
      elements: []
    });
    setNewElement({
      description: '',
      quantite: 1,
      prixUnitaire: 0,
      montantTotal: 0
    });
  };

  // تصفية الفواتير بناءً على البحث
  const filteredInvoices = invoices.filter(invoice => {
    const searchLower = searchTerm.toLowerCase();
    return (
      invoice.numero?.toLowerCase().includes(searchLower) ||
      invoice.clientNom?.toLowerCase().includes(searchLower) ||
      invoice.dossierReference?.toLowerCase().includes(searchLower) ||
      invoice.montantTotal?.toString().includes(searchTerm)
    );
  });

  // عرض تفاصيل فاتورة
  const toggleInvoiceDetails = (id) => {
    setShowDetails(showDetails === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">إدارة الفواتير</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في الفواتير..."
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                إضافة فاتورة جديدة
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الفاتورة</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الملف</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ الإجمالي</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإصدار</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاستحقاق</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                    <div className="flex justify-center">
                      <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                    لم يتم العثور على فواتير
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <React.Fragment key={invoice.idFacture}>
                    <tr className={`hover:bg-gray-50 cursor-pointer ${showDetails === invoice.idFacture ? 'bg-blue-50' : ''}`}>
                      <td 
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-900"
                        onClick={() => toggleInvoiceDetails(invoice.idFacture)}
                      >
                        <div className="flex items-center">
                          <svg 
                            className={`w-4 h-4 mr-1 transition-transform transform ${showDetails === invoice.idFacture ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                          {invoice.numero}
                        </div>
                      </td>
                      <td 
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-900"
                        onClick={() => toggleInvoiceDetails(invoice.idFacture)}
                      >
                        {invoice.clientNom}
                      </td>
                      <td 
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-900"
                        onClick={() => toggleInvoiceDetails(invoice.idFacture)}
                      >
                        {invoice.dossierReference}
                      </td>
                      <td 
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-900"
                        onClick={() => toggleInvoiceDetails(invoice.idFacture)}
                      >
                        {invoice.montantTotal.toFixed(2)} {invoice.devise}
                      </td>
                      <td 
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-900"
                        onClick={() => toggleInvoiceDetails(invoice.idFacture)}
                      >
                        {new Date(invoice.dateEmission).toLocaleDateString('ar-MA')}
                      </td>
                      <td 
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-900"
                        onClick={() => toggleInvoiceDetails(invoice.idFacture)}
                      >
                        {new Date(invoice.dateEcheance).toLocaleDateString('ar-MA')}
                      </td>
                      <td 
                        className="px-4 py-4 whitespace-nowrap"
                        onClick={() => toggleInvoiceDetails(invoice.idFacture)}
                      >
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${statuts.find(s => s.id === invoice.statut)?.color || 'bg-gray-100 text-gray-800'}`}>
                          {statuts.find(s => s.id === invoice.statut)?.name || invoice.statut}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-900 mx-1"
                          onClick={() => handleEdit(invoice)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 mx-1"
                          onClick={() => handleDelete(invoice.idFacture)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 mx-1"
                          onClick={() => {
                            // طباعة الفاتورة أو تصديرها كـ PDF
                            alert(`طباعة الفاتورة رقم ${invoice.numero}`);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {showDetails === invoice.idFacture && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                          <div className="pb-3">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">تفاصيل الفاتورة {invoice.numero}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500">المبلغ الإجمالي</p>
                                <p className="font-semibold">{invoice.montantTotal.toFixed(2)} {invoice.devise}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">المبلغ المدفوع</p>
                                <p className="font-semibold">{invoice.montantPaye.toFixed(2)} {invoice.devise}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">المبلغ المتبقي</p>
                                <p className="font-semibold">{invoice.montantRestant.toFixed(2)} {invoice.devise}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">ضريبة القيمة المضافة</p>
                                <p className="font-semibold">{invoice.tva}%</p>
                              </div>
                            </div>
                            <div className="mb-4">
                              <p className="text-xs text-gray-500">ملاحظات</p>
                              <p>{invoice.notes || 'لا توجد ملاحظات'}</p>
                            </div>
                            <table className="w-full">
                              <thead>
                                <tr className="bg-blue-100">
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">الوصف</th>
                                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">الكمية</th>
                                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">سعر الوحدة</th>
                                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">المجموع</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoice.elements.map((element, index) => (
                                  <tr key={element.idElementFacture} className="border-b border-blue-100">
                                    <td className="px-4 py-2 text-right">{element.description}</td>
                                    <td className="px-4 py-2 text-center">{element.quantite}</td>
                                    <td className="px-4 py-2 text-center">{element.prixUnitaire.toFixed(2)} {invoice.devise}</td>
                                    <td className="px-4 py-2 text-center">{element.montantTotal.toFixed(2)} {invoice.devise}</td>
                                  </tr>
                                ))}
                                <tr className="font-semibold">
                                  <td colSpan="3" className="px-4 py-2 text-right">المجموع قبل الضريبة</td>
                                  <td className="px-4 py-2 text-center">{calculateTotal(invoice.elements).toFixed(2)} {invoice.devise}</td>
                                </tr>
                                <tr>
                                  <td colSpan="3" className="px-4 py-2 text-right">ضريبة القيمة المضافة ({invoice.tva}%)</td>
                                  <td className="px-4 py-2 text-center">
                                    {(calculateTotal(invoice.elements) * invoice.tva / 100).toFixed(2)} {invoice.devise}
                                  </td>
                                </tr>
                                <tr className="font-semibold bg-blue-100">
                                  <td colSpan="3" className="px-4 py-2 text-right">المجموع الكلي</td>
                                  <td className="px-4 py-2 text-center">{invoice.montantTotal.toFixed(2)} {invoice.devise}</td>
                                </tr>
                              </tbody>
                            </table>
                            {invoice.nombrePaiements > 0 && (
                              <div className="mt-4 text-sm font-medium text-blue-600">
                                عدد المدفوعات المرتبطة: {invoice.nombrePaiements}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نموذج إضافة/تعديل فاتورة */}
      {showAddModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {currentInvoice ? 'تعديل فاتورة' : 'إضافة فاتورة جديدة'}
                </h3>
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* رقم الفاتورة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">رقم الفاتورة</label>
                      <input
                        type="text"
                        name="numero"
                        value={newInvoice.numero}
                        onChange={handleInputChange}
                        placeholder={`FACT-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    {/* العميل */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">العميل</label>
                      <select
                        name="clientId"
                        value={newInvoice.clientId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                        value={newInvoice.dossierId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">-- اختر الملف --</option>
                        {dossiers
                          .filter(dossier => !newInvoice.clientId || dossier.client?.id === parseInt(newInvoice.clientId))
                          .map(dossier => (
                            <option key={dossier.id} value={dossier.id}>{dossier.reference}</option>
                          ))
                        }
                      </select>
                    </div>
                    
                    {/* ضريبة القيمة المضافة والعملة */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ضريبة القيمة المضافة (%)</label>
                        <input
                          type="number"
                          name="tva"
                          value={newInvoice.tva}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">العملة</label>
                        <select
                          name="devise"
                          value={newInvoice.devise}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {devises.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* تاريخ الإصدار وتاريخ الاستحقاق */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">تاريخ الإصدار</label>
                        <input
                          type="date"
                          name="dateEmission"
                          value={newInvoice.dateEmission}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">تاريخ الاستحقاق</label>
                        <input
                          type="date"
                          name="dateEcheance"
                          value={newInvoice.dateEcheance}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* حالة الفاتورة والملاحظات */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">حالة الفاتورة</label>
                      <select
                        name="statut"
                        value={newInvoice.statut}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {statuts.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
                      <textarea
                        name="notes"
                        value={newInvoice.notes}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* عناصر الفاتورة */}
                  <h4 className="text-md font-medium text-gray-800 mb-2">عناصر الفاتورة</h4>
                  
                  {/* جدول العناصر */}
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">الوصف</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">الكمية</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">سعر الوحدة</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">المجموع</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">حذف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newInvoice.elements.length > 0 ? (
                          newInvoice.elements.map((element, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-2 text-right">{element.description}</td>
                              <td className="px-4 py-2 text-center">{element.quantite}</td>
                              <td className="px-4 py-2 text-center">{element.prixUnitaire.toFixed(2)}</td>
                              <td className="px-4 py-2 text-center">{element.montantTotal.toFixed(2)}</td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveElement(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                              لا توجد عناصر. أضف عناصر باستخدام النموذج أدناه.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-200">
                          <td colSpan="3" className="px-4 py-2 text-right font-bold">المجموع قبل الضريبة:</td>
                          <td className="px-4 py-2 text-center font-bold">{calculateTotal(newInvoice.elements).toFixed(2)}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right">ضريبة القيمة المضافة ({newInvoice.tva}%):</td>
                          <td className="px-4 py-2 text-center">{(calculateTotal(newInvoice.elements) * newInvoice.tva / 100).toFixed(2)}</td>
                          <td></td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td colSpan="3" className="px-4 py-2 text-right font-bold">المجموع الكلي:</td>
                          <td className="px-4 py-2 text-center font-bold">{calculateTotalWithTax(newInvoice.elements, newInvoice.tva).toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  {/* نموذج إضافة عنصر جديد */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الوصف</label>
                      <input
                        type="text"
                        name="description"
                        value={newElement.description}
                        onChange={handleElementChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الكمية</label>
                      <input
                        type="number"
                        name="quantite"
                        value={newElement.quantite}
                        onChange={handleElementChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="1"
                        step="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">سعر الوحدة</label>
                      <input
                        type="number"
                        name="prixUnitaire"
                        value={newElement.prixUnitaire}
                        onChange={handleElementChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddElement}
                        className="w-full py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        إضافة عنصر
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveInvoice}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {currentInvoice ? 'تعديل' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default AllInvoices;