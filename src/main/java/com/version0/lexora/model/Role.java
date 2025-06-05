package com.version0.lexora.model;

/**
 * Enumération représentant les rôles possibles des utilisateurs dans
 * l'application.
 * Améliorée avec des noms d'affichage, descriptions, et niveaux de permissions.
 */
// تعريف نوع بيانات مُعدّد (enum) محسّن يسمى Role لتحديد أدوار المستخدمين
public enum Role {
    ADMINISTRATEUR("مدير النظام", "يمكنه الوصول إلى جميع وظائف النظام بما في ذلك إدارة المستخدمين والإعدادات", 90),
    AVOCAT("محامي", "يمكنه الوصول إلى جميع الوظائف والقضايا والعملاء", 70),
    ASSISTANT_JURIDIQUE("مساعد قانوني", "يمكنه الوصول إلى جميع الوظائف ما عدا إدارة المستخدمين وبعض إعدادات النظام",
            65);

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
     * 
     * @param role Le rôle à comparer
     * @return true si ce rôle a des permissions supérieures ou égales
     */
    public boolean hasPermissionLevel(Role role) {
        return this.permissionLevel >= role.permissionLevel;
    }

    /**
     * Vérifie si ce rôle a au moins le niveau de permission spécifié
     * 
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
