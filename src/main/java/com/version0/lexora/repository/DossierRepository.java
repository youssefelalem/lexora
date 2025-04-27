package com.version0.lexora.repository; // تعريف الحزمة التي تنتمي إليها هذه الواجهة

// استيراد الكلاسات الضرورية
import com.version0.lexora.model.Client; // استيراد نموذج العميل
import com.version0.lexora.model.Dossier; // استيراد نموذج الملف
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم
import org.springframework.data.jpa.repository.JpaRepository; // استيراد واجهة JpaRepository من Spring Data JPA
import org.springframework.stereotype.Repository; // استيراد التعليق التوضيحي @Repository

import java.time.LocalDate; // استيراد كلاس LocalDate للتعامل مع التواريخ
import java.util.List; // استيراد كلاس List لمعالجة القوائم
import java.util.Optional; // استيراد كلاس Optional لمعالجة القيم التي قد تكون فارغة

// @Repository: يشير إلى أن هذه الواجهة هي مستودع Spring مسؤول عن عمليات قاعدة البيانات
@Repository
// تعريف واجهة DossierRepository التي ترث من JpaRepository
// JpaRepository<Dossier, Long>: يحدد أن هذا المستودع يدير كيانات Dossier والمفتاح الأساسي هو من نوع Long
public interface DossierRepository extends JpaRepository<Dossier, Long> {

    // طريقة للبحث عن الملف باستخدام المرجع الفريد
    Optional<Dossier> findByReference(String reference);
    
    // طريقة للبحث عن الملفات باستخدام العنوان (يحتوي على)
    List<Dossier> findByTitreContainingIgnoreCase(String titre);
    
    // طريقة للبحث عن الملفات باستخدام العميل
    List<Dossier> findByClient(Client client);
    
    // طريقة للبحث عن الملفات باستخدام المستخدم المسؤول
    List<Dossier> findByUtilisateurResponsable(Utilisateur utilisateur);
    
    // طريقة للبحث عن الملفات باستخدام نوع الملف
    List<Dossier> findByType(String type);
    
    // طريقة للبحث عن الملفات باستخدام الحالة
    List<Dossier> findByStatut(String statut);
    
    // طريقة للبحث عن الملفات باستخدام الأولوية
    List<Dossier> findByPriorite(String priorite);
    
    // طريقة للبحث عن الملفات باستخدام المحكمة
    List<Dossier> findByTribunal(String tribunal);
    
    // طريقة للبحث عن الملفات باستخدام المحامي
    List<Dossier> findByAvocat(String avocat);
    
    // طريقة للبحث عن الملفات التي تم إنشاؤها بعد تاريخ معين
    List<Dossier> findByDateCreationAfter(LocalDate date);
    
    // طريقة للبحث عن الملفات التي لها تاريخ بدء بين تاريخين
    List<Dossier> findByDateInitialeBetween(LocalDate startDate, LocalDate endDate);
    
    // طريقة للبحث عن الملفات باستخدام العميل والحالة
    List<Dossier> findByClientAndStatut(Client client, String statut);
}