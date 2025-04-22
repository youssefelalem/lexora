package com.version0.lexora.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.UniqueConstraint;

/**
 * نموذج المستخدم - يمثل جدول المستخدمين في قاعدة البيانات
 * يحتوي على معلومات المستخدم الأساسية: الاسم، البريد الإلكتروني، وكلمة المرور
 * Modèle Utilisateur - Représente la table des utilisateurs dans la base de données
 * Contient les informations de base de l'utilisateur : nom, email et mot de passe
 */
@Entity // يشير إلى أن هذا الكلاس هو كيان JPA / Indique que cette classe est une entité JPA
@Table(name = "users", uniqueConstraints = { // يحدد اسم الجدول وقيود التفرد / Spécifie le nom de la table et les contraintes d'unicité
    @UniqueConstraint(columnNames = "email") // ضمان عدم تكرار البريد الإلكتروني / Assure que l'email est unique
})
public class User {
    @Id // يحدد المفتاح الأساسي / Définit la clé primaire
    @GeneratedValue(strategy = GenerationType.IDENTITY) // يحدد استراتيجية توليد القيمة للمفتاح الأساسي (تزايد تلقائي) / Définit la stratégie de génération de valeur pour la clé primaire (auto-incrément)
    private Long id; // معرف المستخدم الفريد / Identifiant unique de l'utilisateur

    @Column(unique = true, nullable = false) // يحدد العمود في الجدول، ويضمن أنه فريد وغير فارغ / Définit une colonne dans la table, assure qu'elle est unique et non nulle
    private String email; // البريد الإلكتروني (فريد وإلزامي) / Email (unique et obligatoire)

    @Column(nullable = false) // يحدد العمود في الجدول، ويضمن أنه غير فارغ / Définit une colonne dans la table, assure qu'elle n'est pas nulle
    private String password; // كلمة المرور (مشفرة) / Mot de passe (chiffré)

    @Column(nullable = false) // يحدد العمود في الجدول، ويضمن أنه غير فارغ / Définit une colonne dans la table, assure qu'elle n'est pas nulle
    private String name; // اسم المستخدم / Nom de l'utilisateur

    /**
     * منشئ فارغ مطلوب من JPA
     * Constructeur vide requis par JPA
     */
    public User() {}

    /**
     * منشئ لإنشاء مستخدم جديد
     * Constructeur pour créer un nouvel utilisateur
     * @param name اسم المستخدم / Nom de l'utilisateur
     * @param email البريد الإلكتروني / Email
     * @param password كلمة المرور / Mot de passe
     */
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    /**
     * منشئ كامل مع المعرف
     * Constructeur complet avec l'identifiant
     * @param id معرف المستخدم / Identifiant de l'utilisateur
     * @param name اسم المستخدم / Nom de l'utilisateur
     * @param email البريد الإلكتروني / Email
     * @param password كلمة المرور / Mot de passe
     */
    public User(Long id, String name, String email, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters / Méthodes d'accès (Getters) et de modification (Setters)
    public Long getId() { // للحصول على المعرف / Pour obtenir l'identifiant
        return id;
    }

    public void setId(Long id) { // لتعيين المعرف / Pour définir l'identifiant
        this.id = id;
    }

    public String getName() { // للحصول على الاسم / Pour obtenir le nom
        return name;
    }

    public void setName(String name) { // لتعيين الاسم / Pour définir le nom
        this.name = name;
    }

    public String getEmail() { // للحصول على البريد الإلكتروني / Pour obtenir l'email
        return email;
    }

    public void setEmail(String email) { // لتعيين البريد الإلكتروني / Pour définir l'email
        this.email = email;
    }

    public String getPassword() { // للحصول على كلمة المرور / Pour obtenir le mot de passe
        return password;
    }

    public void setPassword(String password) { // لتعيين كلمة المرور / Pour définir le mot de passe
        this.password = password;
    }
}