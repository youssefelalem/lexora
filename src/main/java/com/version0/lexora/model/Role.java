package com.version0.lexora.model;

/**
 * Enumération représentant les rôles possibles des utilisateurs dans l'application.
 */
// تعريف نوع بيانات مُعدّد (enum) يسمى Role لتحديد أدوار المستخدمين
public enum Role {
    ADMINISTRATEUR, // يمثل دور المسؤول الذي يمتلك جميع الصلاحيات
    ASSISTANT_ADMIN // يمثل دور مساعد المسؤول بصلاحيات محدودة (أو الدور الافتراضي)
    // يمكنك إضافة أدوار أخرى هنا إذا لزم الأمر
}
