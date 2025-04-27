package com.version0.lexora.repository; // تعريف الحزمة التي تنتمي إليها هذه الواجهة

// استيراد الكلاسات الضرورية
import com.version0.lexora.model.Dossier; // استيراد نموذج الملف
import com.version0.lexora.model.Session; // استيراد نموذج الجلسة
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم
import org.springframework.data.jpa.repository.JpaRepository; // استيراد واجهة JpaRepository من Spring Data JPA
import org.springframework.stereotype.Repository; // استيراد التعليق التوضيحي @Repository

import java.time.LocalDate; // استيراد كلاس LocalDate للتعامل مع التواريخ
import java.util.List; // استيراد كلاس List لمعالجة القوائم

// @Repository: يشير إلى أن هذه الواجهة هي مستودع Spring مسؤول عن عمليات قاعدة البيانات
@Repository
// تعريف واجهة SessionRepository التي ترث من JpaRepository
// JpaRepository<Session, Long>: يحدد أن هذا المستودع يدير كيانات Session والمفتاح الأساسي هو من نوع Long
public interface SessionRepository extends JpaRepository<Session, Long> {
    
    // طريقة للبحث عن الجلسات باستخدام الملف
    List<Session> findByDossier(Dossier dossier);
    
    // طريقة للبحث عن الجلسات باستخدام تاريخ الجلسة
    List<Session> findByDate(LocalDate date);
    
    // طريقة للبحث عن الجلسات باستخدام الحالة
    List<Session> findByStatut(String statut);
    
    // طريقة للبحث عن الجلسات باستخدام المحكمة
    List<Session> findByTribunal(String tribunal);
    
    // طريقة للبحث عن الجلسات باستخدام المستخدم المسؤول
    List<Session> findByUtilisateurResponsable(Utilisateur utilisateur);
    
    // طريقة للبحث عن الجلسات التي تواريخها بين تاريخين
    List<Session> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    // طريقة للبحث عن الجلسات باستخدام الحالة والملف
    List<Session> findByStatutAndDossier(String statut, Dossier dossier);
    
    // طريقة للبحث عن الجلسات باستخدام التاريخ والحالة
    List<Session> findByDateAndStatut(LocalDate date, String statut);
    
    // طريقة للبحث عن الجلسات المستقبلية (تاريخها بعد اليوم)
    List<Session> findByDateAfter(LocalDate date);
    
    // طريقة للبحث عن الجلسات السابقة (تاريخها قبل اليوم)
    List<Session> findByDateBefore(LocalDate date);
    
    // طريقة للبحث عن الجلسات التي تم إنشاؤها بعد تاريخ معين
    List<Session> findByDateCreationAfter(LocalDate dateCreation);
}