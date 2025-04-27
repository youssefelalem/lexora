package com.version0.lexora.model;

/**
 * Enumération représentant les rôles possibles des utilisateurs dans l'application.
 * Améliorée avec des noms d'affichage, descriptions, et niveaux de permissions.
 */
// تعريف نوع بيانات مُعدّد (enum) محسّن يسمى Role لتحديد أدوار المستخدمين
public enum Role {
    SUPER_ADMIN("مدير النظام الرئيسي", "يمتلك جميع الصلاحيات بدون استثناء", 100),
    ADMINISTRATEUR("مدير النظام", "يمتلك معظم الصلاحيات الإدارية", 90),
    AVOCAT("محامي", "يمكنه الوصول إلى الملفات والقضايا والعملاء", 70),
    ASSISTANT_JURIDIQUE("مساعد قانوني", "يمكنه الوصول إلى الملفات والوثائق بصلاحيات محدودة", 50),
    COMPTABLE("محاسب", "يمكنه الوصول إلى الفواتير والمدفوعات والنفقات", 40),
    ASSISTANT_ADMIN("مساعد إداري", "صلاحيات محدودة لمساعدة الإدارة", 30),
    INVITE("ضيف", "صلاحيات قراءة فقط لبعض البيانات", 10);
    
    private final String displayName; // الاسم المعروض
    private final String description; // وصف الدور
    private final int permissionLevel; // مستوى الصلاحيات (أعلى رقم = صلاحيات أكثر)
    
    Role(String displayName, String description, int permissionLevel) {
        this.displayName = displayName;
        this.description = description;
        this.permissionLevel = permissionLevel;
    }
    
    public String getDisplayName() {
        return this.displayName;
    }
    
    public String getDescription() {
        return this.description;
    }
    
    public int getPermissionLevel() {
        return this.permissionLevel;
    }
    
    /**
     * Vérifie si ce rôle a au moins les permissions du rôle spécifié
     * @param role Le rôle à comparer
     * @return true si ce rôle a des permissions supérieures ou égales
     */
    public boolean hasPermissionLevel(Role role) {
        return this.permissionLevel >= role.permissionLevel;
    }
    
    /**
     * Vérifie si ce rôle a au moins le niveau de permission spécifié
     * @param level Le niveau minimum requis
     * @return true si ce rôle a des permissions supérieures ou égales
     */
    public boolean hasPermissionLevel(int level) {
        return this.permissionLevel >= level;
    }
    
    @Override
    public String toString() {
        return this.displayName;
    }
}
