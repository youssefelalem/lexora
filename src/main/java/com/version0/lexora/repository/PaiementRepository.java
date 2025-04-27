package com.version0.lexora.repository; // تعريف الحزمة التي تنتمي إليها هذه الواجهة

// استيراد الكلاسات الضرورية
import com.version0.lexora.model.Client; // استيراد نموذج العميل
import com.version0.lexora.model.Dossier; // استيراد نموذج الملف
import com.version0.lexora.model.Facture; // استيراد نموذج الفاتورة
import com.version0.lexora.model.Paiement; // استيراد نموذج المدفوعات
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم
import org.springframework.data.jpa.repository.JpaRepository; // استيراد واجهة JpaRepository من Spring Data JPA
import org.springframework.stereotype.Repository; // استيراد التعليق التوضيحي @Repository

import java.math.BigDecimal; // استيراد كلاس BigDecimal للتعامل مع الأرقام العشرية الدقيقة
import java.time.LocalDate; // استيراد كلاس LocalDate للتعامل مع التواريخ
import java.util.List; // استيراد كلاس List لمعالجة القوائم

// @Repository: يشير إلى أن هذه الواجهة هي مستودع Spring مسؤول عن عمليات قاعدة البيانات
@Repository
// تعريف واجهة PaiementRepository التي ترث من JpaRepository
// JpaRepository<Paiement, Long>: يحدد أن هذا المستودع يدير كيانات Paiement والمفتاح الأساسي هو من نوع Long
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    
    // طريقة للبحث عن المدفوعات باستخدام العميل
    List<Paiement> findByClient(Client client);
    
    // طريقة للبحث عن المدفوعات باستخدام الملف
    List<Paiement> findByDossier(Dossier dossier);
    
    // طريقة للبحث عن المدفوعات باستخدام الفاتورة
    List<Paiement> findByFacture(Facture facture);
    
    // طريقة للبحث عن المدفوعات باستخدام طريقة الدفع
    List<Paiement> findByMethode(String methode);
    
    // طريقة للبحث عن المدفوعات باستخدام العملة
    List<Paiement> findByDevise(String devise);
    
    // طريقة للبحث عن المدفوعات باستخدام الحالة
    List<Paiement> findByStatut(String statut);
    
    // طريقة للبحث عن المدفوعات باستخدام تاريخ الدفع
    List<Paiement> findByDatePaiement(LocalDate date);
    
    // طريقة للبحث عن المدفوعات التي تم دفعها بعد تاريخ معين
    List<Paiement> findByDatePaiementAfter(LocalDate date);
    
    // طريقة للبحث عن المدفوعات التي تم دفعها قبل تاريخ معين
    List<Paiement> findByDatePaiementBefore(LocalDate date);
    
    // طريقة للبحث عن المدفوعات باستخدام نطاق تاريخ الدفع
    List<Paiement> findByDatePaiementBetween(LocalDate startDate, LocalDate endDate);
    
    // طريقة للبحث عن المدفوعات التي تم إنشاؤها بواسطة مستخدم معين
    List<Paiement> findByUtilisateurCreation(Utilisateur utilisateur);
    
    // طريقة للبحث عن المدفوعات التي مبلغها أكبر من قيمة معينة
    List<Paiement> findByMontantGreaterThan(BigDecimal montant);
    
    // طريقة للبحث عن المدفوعات باستخدام رقم المرجع (رقم الشيك أو التحويل)
    List<Paiement> findByNumeroReference(String numeroReference);
    
    // طريقة للبحث عن المدفوعات باستخدام مرجع البنك
    List<Paiement> findByBanqueReference(String banqueReference);
    
    // طريقة للبحث عن المدفوعات باستخدام العميل والحالة
    List<Paiement> findByClientAndStatut(Client client, String statut);
    
    // طريقة للبحث عن المدفوعات باستخدام الملف والحالة
    List<Paiement> findByDossierAndStatut(Dossier dossier, String statut);
}