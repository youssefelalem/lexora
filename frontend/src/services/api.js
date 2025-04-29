import axios from 'axios';

// إعداد عميل axios مع الإعدادات الافتراضية
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// اعتراض الطلبات لإضافة رمز المصادقة
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// اعتراض الاستجابات للتعامل مع أخطاء المصادقة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // يمكننا هنا توجيه المستخدم لصفحة تسجيل الدخول إذا لزم الأمر
    }
    return Promise.reject(error);
  }
);

// خدمات الاختبار (للتحقق من المصادقة)
const testService = {
  // الوصول إلى نقطة النهاية العامة
  getPublicEndpoint: () => api.get('/test/public'),
  
  // الوصول إلى نقطة النهاية التي تتطلب المصادقة
  getAuthenticatedEndpoint: () => api.get('/test/authenticated'),
  
  // الوصول إلى نقطة النهاية التي تتطلب دور المسؤول
  getAdminEndpoint: () => api.get('/test/admin'),
  
  // الوصول إلى نقطة النهاية التي تتطلب دور المحامي
  getAvocatEndpoint: () => api.get('/test/avocat'),
  
  // الوصول إلى نقطة النهاية التي تتطلب أدوارًا متعددة
  getMultiRoleEndpoint: () => api.get('/test/multi-role')
};

// خدمات المستخدمين
const userService = {
  // الحصول على قائمة المستخدمين
  getAllUsers: () => api.get('/auth/users'),
  
  // الحصول على مستخدم محدد
  getUserById: (id) => api.get(`/auth/users/${id}`),
  
  // إنشاء مستخدم جديد (يستخدم نقطة النهاية الأساسية)
  createUser: (userData) => api.post('/auth/users', userData),
  
  // إنشاء مستخدم جديد مع بيانات كاملة (يستخدم نقطة النهاية الجديدة)
  createUserWithDetails: (userData) => api.post('/auth/register/full', userData),
  
  // تحديث مستخدم
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  
  // تحديث حالة المستخدم (نشط/غير نشط)
  updateUserStatus: (id, active) => api.put(`/auth/users/${id}/status?active=${active}`),
  
  // تغيير كلمة مرور المستخدم
  changePassword: (id, passwordData) => api.put(`/auth/users/${id}/password`, passwordData),
  
  // حذف مستخدم
  deleteUser: (id) => api.delete(`/auth/users/${id}`)
};

// خدمات العملاء
const clientService = {
  // الحصول على قائمة العملاء
  getAllClients: () => api.get('/clients'),
  
  // الحصول على عميل محدد
  getClientById: (id) => api.get(`/clients/${id}`),
  
  // إنشاء عميل جديد
  createClient: (clientData) => api.post('/clients', clientData),
  
  // تحديث عميل
  updateClient: (id, clientData) => api.put(`/clients/${id}`, clientData),
  
  // حذف عميل
  deleteClient: (id) => api.delete(`/clients/${id}`),
  
  // الحصول على العملاء حسب النوع
  getClientsByType: (type) => api.get(`/clients/type/${type}`),
  
  // الحصول على العملاء حسب الحالة
  getClientsByStatus: (status) => api.get(`/clients/statut/${status}`)
};

// خدمات المصادقة
const authService = {
  // تسجيل الدخول
  login: (credentials) => api.post('/auth/login', credentials),
  
  // تسجيل مستخدم جديد
  register: (userData) => api.post('/auth/register', userData),
  
  // الحصول على بيانات المستخدم الحالي
  getCurrentUser: () => api.get('/auth/me'),
  
  // تسجيل الخروج (محليا فقط، لا حاجة لطلب API)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// خدمات الملفات
const dossierService = {
  // الحصول على جميع الملفات
  getAllDossiers: () => api.get('/dossiers'),
  
  // الحصول على ملف محدد
  getDossierById: (id) => api.get(`/dossiers/${id}`),
  
  // إنشاء ملف جديد
  createDossier: (dossierData) => api.post('/dossiers', dossierData),
  
  // تحديث ملف
  updateDossier: (id, dossierData) => api.put(`/dossiers/${id}`, dossierData),
  
  // حذف ملف
  deleteDossier: (id) => api.delete(`/dossiers/${id}`),
  
  // الحصول على الملفات حسب العميل
  getDossiersByClientId: (clientId) => api.get(`/dossiers/client/${clientId}`),
  
  // الحصول على الملفات حسب الحالة
  getDossiersByStatus: (status) => api.get(`/dossiers/statut/${status}`),
  
  // الحصول على الملفات حسب النوع
  getDossiersByType: (type) => api.get(`/dossiers/type/${type}`),
  
  // الحصول على الملفات حسب الأولوية
  getDossiersByPriority: (priority) => api.get(`/dossiers/priorite/${priority}`)
};

// خدمات المستندات
const documentService = {
  // الحصول على جميع المستندات
  getAllDocuments: () => api.get('/documents'),
  
  // الحصول على مستند محدد
  getDocumentById: (id) => api.get(`/documents/${id}`),
  
  // إنشاء مستند جديد
  createDocument: (documentData) => api.post('/documents', documentData),
  
  // تحميل ملف المستند
  uploadDocumentFile: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/documents/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // تحديث مستند
  updateDocument: (id, documentData) => api.put(`/documents/${id}`, documentData),
  
  // حذف مستند
  deleteDocument: (id) => api.delete(`/documents/${id}`),
  
  // الحصول على المستندات حسب الملف
  getDocumentsByDossierId: (dossierId) => api.get(`/documents/dossier/${dossierId}`),
  
  // الحصول على المستندات حسب النوع
  getDocumentsByType: (type) => api.get(`/documents/type/${type}`),
  
  // البحث في المستندات
  searchDocuments: (query) => api.get(`/documents/search?query=${query}`)
};

// خدمات النفقات
const depenseService = {
  // الحصول على جميع النفقات
  getAllDepenses: () => api.get('/depenses'),
  
  // الحصول على نفقة محددة
  getDepenseById: (id) => api.get(`/depenses/${id}`),
  
  // إنشاء نفقة جديدة
  createDepense: (depenseData) => api.post('/depenses', depenseData),
  
  // تحميل وثيقة تبرير النفقة
  uploadExpenseJustification: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/depenses/${id}/upload-justification`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // تحديث نفقة
  updateDepense: (id, depenseData) => api.put(`/depenses/${id}`, depenseData),
  
  // حذف نفقة
  deleteDepense: (id) => api.delete(`/depenses/${id}`),
  
  // الحصول على النفقات حسب الملف
  getDepensesByDossierId: (dossierId) => api.get(`/depenses/dossier/${dossierId}`),
  
  // الحصول على النفقات حسب الحالة
  getDepensesByStatut: (statut) => api.get(`/depenses/statut/${statut}`),
  
  // الحصول على النفقات حسب الفئة
  getDepensesByCategorie: (categorie) => api.get(`/depenses/categorie/${categorie}`),
  
  // الحصول على النفقات في فترة زمنية محددة
  getDepensesByDateRange: (startDate, endDate) => api.get(`/depenses/period?startDate=${startDate}&endDate=${endDate}`),
  
  // الحصول على النفقات القابلة للاسترداد
  getReimbursableExpenses: () => api.get('/depenses/reimbursable')
};

// خدمات الفواتير
const factureService = {
  // الحصول على جميع الفواتير
  getAllFactures: () => api.get('/factures'),
  
  // الحصول على فاتورة محددة
  getFactureById: (id) => api.get(`/factures/${id}`),
  
  // إنشاء فاتورة جديدة
  createFacture: (factureData) => api.post('/factures', factureData),
  
  // تحديث فاتورة
  updateFacture: (id, factureData) => api.put(`/factures/${id}`, factureData),
  
  // حذف فاتورة
  deleteFacture: (id) => api.delete(`/factures/${id}`),
  
  // الحصول على الفواتير حسب العميل
  getFacturesByClientId: (clientId) => api.get(`/factures/client/${clientId}`),
  
  // الحصول على الفواتير حسب الملف
  getFacturesByDossierId: (dossierId) => api.get(`/factures/dossier/${dossierId}`),
  
  // الحصول على الفواتير حسب الحالة
  getFacturesByStatut: (statut) => api.get(`/factures/statut/${statut}`),
  
  // الحصول على الفواتير في فترة زمنية محددة (تاريخ الإصدار)
  getFacturesByEmissionDateRange: (startDate, endDate) => api.get(`/factures/emission-period?startDate=${startDate}&endDate=${endDate}`),
  
  // الحصول على الفواتير في فترة زمنية محددة (تاريخ الاستحقاق)
  getFacturesByDueDateRange: (startDate, endDate) => api.get(`/factures/due-period?startDate=${startDate}&endDate=${endDate}`),
  
  // الحصول على الفواتير المتأخرة
  getOverdueFactures: () => api.get('/factures/overdue'),
  
  // توليد PDF للفاتورة
  generateInvoicePdf: (id) => api.get(`/factures/${id}/pdf`, { responseType: 'blob' })
};

// خدمات المدفوعات
const paiementService = {
  // الحصول على جميع المدفوعات
  getAllPaiements: () => api.get('/paiements'),
  
  // الحصول على مدفوع محدد
  getPaiementById: (id) => api.get(`/paiements/${id}`),
  
  // إنشاء مدفوع جديد
  createPaiement: (paiementData) => api.post('/paiements', paiementData),
  
  // تحميل إثبات الدفع
  uploadPaymentProof: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/paiements/${id}/upload-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // تحديث مدفوع
  updatePaiement: (id, paiementData) => api.put(`/paiements/${id}`, paiementData),
  
  // حذف مدفوع
  deletePaiement: (id) => api.delete(`/paiements/${id}`),
  
  // الحصول على المدفوعات حسب العميل
  getPaiementsByClientId: (clientId) => api.get(`/paiements/client/${clientId}`),
  
  // الحصول على المدفوعات حسب الملف
  getPaiementsByDossierId: (dossierId) => api.get(`/paiements/dossier/${dossierId}`),
  
  // الحصول على المدفوعات حسب الفاتورة
  getPaiementsByFactureId: (factureId) => api.get(`/paiements/facture/${factureId}`),
  
  // الحصول على المدفوعات حسب الحالة
  getPaiementsByStatut: (statut) => api.get(`/paiements/statut/${statut}`),
  
  // الحصول على المدفوعات حسب طريقة الدفع
  getPaiementsByMethode: (methode) => api.get(`/paiements/methode/${methode}`),
  
  // الحصول على المدفوعات في فترة زمنية محددة
  getPaiementsByDateRange: (startDate, endDate) => api.get(`/paiements/period?startDate=${startDate}&endDate=${endDate}`)
};

// خدمات الجلسات
const sessionService = {
  // الحصول على جميع الجلسات
  getAllSessions: () => api.get('/sessions'),
  
  // الحصول على جلسة محددة
  getSessionById: (id) => api.get(`/sessions/${id}`),
  
  // إنشاء جلسة جديدة
  createSession: (sessionData) => api.post('/sessions', sessionData),
  
  // تحديث جلسة
  updateSession: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  
  // حذف جلسة
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  
  // الحصول على الجلسات حسب الملف
  getSessionsByDossierId: (dossierId) => api.get(`/sessions/dossier/${dossierId}`),
  
  // الحصول على الجلسات حسب التاريخ
  getSessionsByDate: (date) => api.get(`/sessions/date/${date}`),
  
  // الحصول على الجلسات حسب الحالة
  getSessionsByStatus: (statut) => api.get(`/sessions/statut/${statut}`),
  
  // الحصول على الجلسات في فترة زمنية محددة
  getSessionsByDateRange: (startDate, endDate) => api.get(`/sessions/period?startDate=${startDate}&endDate=${endDate}`),
  
  // الحصول على الجلسات القادمة
  getUpcomingSessions: () => api.get('/sessions/upcoming')
};

// وظيفة مساعدة لتنسيق التاريخ لاستخدامها في طلبات API
const formatDate = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date;
};

// تصدير كل الخدمات
export {
  api as default,
  testService,
  authService,
  userService,
  clientService,
  dossierService,
  documentService,
  depenseService,
  factureService,
  paiementService,
  sessionService,
  formatDate
};