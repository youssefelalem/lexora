package com.version0.lexora.repository; // تعريف الحزمة التي تنتمي إليها هذه الواجهة

// استيراد الكلاسات الضرورية
import com.version0.lexora.model.Client; // استيراد نموذج العميل
import com.version0.lexora.model.Dossier; // استيراد نموذج الملف
import com.version0.lexora.model.Facture; // استيراد نموذج الفاتورة
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم
import org.springframework.data.jpa.repository.JpaRepository; // استيراد واجهة JpaRepository من Spring Data JPA
import org.springframework.stereotype.Repository; // استيراد التعليق التوضيحي @Repository

import java.math.BigDecimal; // استيراد كلاس BigDecimal للتعامل مع الأرقام العشرية الدقيقة
import java.time.LocalDate; // استيراد كلاس LocalDate للتعامل مع التواريخ
import java.util.List; // استيراد كلاس List لمعالجة القوائم
import java.util.Optional; // استيراد كلاس Optional لمعالجة القيم التي قد تكون فارغة

// @Repository: يشير إلى أن هذه الواجهة هي مستودع Spring مسؤول عن عمليات قاعدة البيانات
@Repository
// تعريف واجهة FactureRepository التي ترث من JpaRepository
// JpaRepository<Facture, Long>: يحدد أن هذا المستودع يدير كيانات Facture والمفتاح الأساسي هو من نوع Long
public interface FactureRepository extends JpaRepository<Facture, Long> {
    
    // طريقة للبحث عن الفاتورة باستخدام رقم الفاتورة
    Optional<Facture> findByNumero(String numero);
    
    // طريقة للبحث عن الفواتير باستخدام العميل
    List<Facture> findByClient(Client client);
    
    // طريقة للبحث عن الفواتير باستخدام الملف
    List<Facture> findByDossier(Dossier dossier);
    
    // طريقة للبحث عن الفواتير باستخدام المستخدم الذي أنشأ الفاتورة
    List<Facture> findByUtilisateurCreation(Utilisateur utilisateur);
    
    // طريقة للبحث عن الفواتير باستخدام حالة الفاتورة
    List<Facture> findByStatut(String statut);
    
    // طريقة للبحث عن الفواتير التي تم إصدارها بعد تاريخ معين
    List<Facture> findByDateEmissionAfter(LocalDate date);
    
    // طريقة للبحث عن الفواتير التي تاريخ استحقاقها بعد تاريخ معين
    List<Facture> findByDateEcheanceAfter(LocalDate date);
    
    // طريقة للبحث عن الفواتير التي تاريخ استحقاقها قبل تاريخ معين
    List<Facture> findByDateEcheanceBefore(LocalDate date);
    
    // طريقة للبحث عن الفواتير باستخدام نطاق تاريخ الإصدار
    List<Facture> findByDateEmissionBetween(LocalDate startDate, LocalDate endDate);
    
    // طريقة للبحث عن الفواتير باستخدام نطاق تاريخ الاستحقاق
    List<Facture> findByDateEcheanceBetween(LocalDate startDate, LocalDate endDate);
    
    // طريقة للبحث عن الفواتير التي لها مبلغ إجمالي أكبر من قيمة معينة
    List<Facture> findByMontantTotalGreaterThan(BigDecimal montant);
    
    // طريقة للبحث عن الفواتير التي لها مبلغ متبقي أكبر من قيمة معينة
    List<Facture> findByMontantRestantGreaterThan(BigDecimal montant);
    
    // طريقة للبحث عن الفواتير باستخدام العميل والحالة
    List<Facture> findByClientAndStatut(Client client, String statut);
    
    // طريقة للبحث عن الفواتير باستخدام الملف والحالة
    List<Facture> findByDossierAndStatut(Dossier dossier, String statut);
    
    // طريقة للبحث عن الفواتير باستخدام العملة
    List<Facture> findByDevise(String devise);
}