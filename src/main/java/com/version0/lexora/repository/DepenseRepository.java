package com.version0.lexora.repository; // تعريف الحزمة التي تنتمي إليها هذه الواجهة

// استيراد الكلاسات الضرورية
import com.version0.lexora.model.Depense; // استيراد نموذج المصاريف
import com.version0.lexora.model.Dossier; // استيراد نموذج الملف
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم
import org.springframework.data.jpa.repository.JpaRepository; // استيراد واجهة JpaRepository من Spring Data JPA
import org.springframework.stereotype.Repository; // استيراد التعليق التوضيحي @Repository

import java.math.BigDecimal; // استيراد كلاس BigDecimal للتعامل مع الأرقام العشرية الدقيقة
import java.time.LocalDate; // استيراد كلاس LocalDate للتعامل مع التواريخ
import java.util.List; // استيراد كلاس List لمعالجة القوائم

// @Repository: يشير إلى أن هذه الواجهة هي مستودع Spring مسؤول عن عمليات قاعدة البيانات
@Repository
// تعريف واجهة DepenseRepository التي ترث من JpaRepository
// JpaRepository<Depense, Long>: يحدد أن هذا المستودع يدير كيانات Depense
// والمفتاح الأساسي هو من نوع Long
public interface DepenseRepository extends JpaRepository<Depense, Long> {

    // طريقة للبحث عن المصاريف باستخدام العنوان (يحتوي على)
    List<Depense> findByTitreContainingIgnoreCase(String titre);

    // طريقة للبحث عن المصاريف باستخدام الملف
    List<Depense> findByDossier(Dossier dossier);

    // طريقة للبحث عن المصاريف باستخدام معرف العميل عبر الملف
    List<Depense> findByDossierClientIdClient(Long clientId);

    // طريقة للبحث عن المصاريف باستخدام معرف العميل (طريقة بديلة)
    List<Depense> findByDossier_Client_IdClient(Long clientId);

    // طريقة للبحث عن المصاريف باستخدام الفئة
    List<Depense> findByCategorie(String categorie);

    // طريقة للبحث عن المصاريف باستخدام الحالة
    List<Depense> findByStatut(String statut);

    // طريقة للبحث عن المصاريف باستخدام العملة
    List<Depense> findByDevise(String devise);

    // طريقة للبحث عن المصاريف التي تم إنشاؤها بواسطة مستخدم معين
    List<Depense> findByUtilisateurCreation(Utilisateur utilisateur);

    // طريقة للبحث عن المصاريف التي تم إنشاؤها بعد تاريخ معين
    List<Depense> findByDateCreationAfter(LocalDate date);

    // طريقة للبحث عن المصاريف التي لها تاريخ مصاريف بعد تاريخ معين
    List<Depense> findByDateDepenseAfter(LocalDate date);

    // طريقة للبحث عن المصاريف التي لها تاريخ مصاريف قبل تاريخ معين
    List<Depense> findByDateDepenseBefore(LocalDate date);

    // طريقة للبحث عن المصاريف باستخدام نطاق تاريخ المصاريف
    List<Depense> findByDateDepenseBetween(LocalDate startDate, LocalDate endDate);

    // طريقة للبحث عن المصاريف التي لها مبلغ أكبر من قيمة معينة
    List<Depense> findByMontantGreaterThan(BigDecimal montant);

    // طريقة للبحث عن المصاريف باستخدام المستفيد
    List<Depense> findByBeneficiaireContainingIgnoreCase(String beneficiaire);

    // طريقة للبحث عن المصاريف باستخدام مرجع الفاتورة
    List<Depense> findByFactureReference(String factureReference);

    // طريقة للبحث عن المصاريف باستخدام خاصية قابلية الاسترداد
    List<Depense> findByRemboursable(Boolean remboursable);

    // طريقة للبحث عن المصاريف باستخدام الملف والحالة
    List<Depense> findByDossierAndStatut(Dossier dossier, String statut);

    // طريقة للبحث عن المصاريف باستخدام الفئة والحالة
    List<Depense> findByCategorieAndStatut(String categorie, String statut);
}