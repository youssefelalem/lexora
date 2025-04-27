package com.version0.lexora.repository; // تعريف الحزمة التي تنتمي إليها هذه الواجهة

// استيراد الكلاسات الضرورية
import com.version0.lexora.model.Document; // استيراد نموذج المستند
import com.version0.lexora.model.Dossier; // استيراد نموذج الملف
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم
import org.springframework.data.jpa.repository.JpaRepository; // استيراد واجهة JpaRepository من Spring Data JPA
import org.springframework.stereotype.Repository; // استيراد التعليق التوضيحي @Repository

import java.time.LocalDate; // استيراد كلاس LocalDate للتعامل مع التواريخ
import java.util.List; // استيراد كلاس List لمعالجة القوائم

// @Repository: يشير إلى أن هذه الواجهة هي مستودع Spring مسؤول عن عمليات قاعدة البيانات
@Repository
// تعريف واجهة DocumentRepository التي ترث من JpaRepository
// JpaRepository<Document, Long>: يحدد أن هذا المستودع يدير كيانات Document والمفتاح الأساسي هو من نوع Long
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    // طريقة للبحث عن المستندات باستخدام الملف
    List<Document> findByDossier(Dossier dossier);
    
    // طريقة للبحث عن المستندات باستخدام نوع المستند
    List<Document> findByType(String type);
    
    // طريقة للبحث عن المستندات باستخدام الحالة
    List<Document> findByStatut(String statut);
    
    // طريقة للبحث عن المستندات باستخدام اسم المستند (يحتوي على)
    List<Document> findByNomContainingIgnoreCase(String nom);
    
    // طريقة للبحث عن المستندات باستخدام علامات المستند (يحتوي على)
    List<Document> findByEtiquettesContainingIgnoreCase(String etiquette);
    
    // طريقة للبحث عن المستندات التي تم إنشاؤها بعد تاريخ معين
    List<Document> findByDateCreationAfter(LocalDate date);
    
    // طريقة للبحث عن المستندات التي تم إضافتها بعد تاريخ معين
    List<Document> findByDateAjoutAfter(LocalDate date);
    
    // طريقة للبحث عن المستندات باستخدام المستخدم الذي أضاف المستند
    List<Document> findByUtilisateurAjout(Utilisateur utilisateur);
    
    // طريقة للبحث عن المستندات باستخدام نوع المستند والملف
    List<Document> findByTypeAndDossier(String type, Dossier dossier);
    
    // طريقة للبحث عن المستندات باستخدام الحالة والملف
    List<Document> findByStatutAndDossier(String statut, Dossier dossier);
}