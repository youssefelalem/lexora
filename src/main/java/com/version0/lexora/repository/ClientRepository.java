package com.version0.lexora.repository; // تعريف الحزمة التي تنتمي إليها هذه الواجهة

// استيراد الكلاسات الضرورية
import com.version0.lexora.model.Client; // استيراد نموذج العميل
import org.springframework.data.jpa.repository.JpaRepository; // استيراد واجهة JpaRepository من Spring Data JPA
import org.springframework.stereotype.Repository; // استيراد التعليق التوضيحي @Repository

import java.time.LocalDate; // استيراد كلاس LocalDate للتعامل مع التواريخ
import java.util.List; // استيراد كلاس List لمعالجة القوائم
import java.util.Optional; // استيراد كلاس Optional لمعالجة القيم التي قد تكون فارغة

// @Repository: يشير إلى أن هذه الواجهة هي مستودع Spring مسؤول عن عمليات قاعدة البيانات
@Repository
// تعريف واجهة ClientRepository التي ترث من JpaRepository
// JpaRepository<Client, Long>: يحدد أن هذا المستودع يدير كيانات Client والمفتاح الأساسي هو من نوع Long
public interface ClientRepository extends JpaRepository<Client, Long> {

    // طريقة للبحث عن العميل باستخدام البريد الإلكتروني
    Optional<Client> findByEmail(String email);

    // طريقة للبحث عن العملاء باستخدام الاسم (يحتوي على)
    List<Client> findByNomContainingIgnoreCase(String nom);

    // طريقة للبحث عن العملاء باستخدام نوع العميل
    List<Client> findByType(String type);

    // طريقة للبحث عن العملاء باستخدام الحالة
    List<Client> findByStatut(String statut);

    // طريقة للبحث عن العملاء الذين تم إنشاؤهم بعد تاريخ معين
    List<Client> findByDateCreationAfter(LocalDate date);

    // طريقة للبحث عن العملاء باستخدام رقم الهاتف
    Optional<Client> findByTelephone(String telephone);
}