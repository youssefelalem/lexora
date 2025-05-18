package com.version0.lexora.repository; // تعريف الحزمة التي ينتمي إليها هذا الواجهة // Déclaration du package auquel appartient cette interface

// استيراد الكلاسات الضرورية // Importation des classes nécessaires
import com.version0.lexora.model.Role; // استيراد نموذج الدور // Importation du modèle Role
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم // Importation du modèle Utilisateur
import org.springframework.data.jpa.repository.JpaRepository; // استيراد واجهة JpaRepository من Spring Data JPA // Importation de l'interface JpaRepository de Spring Data JPA
import org.springframework.stereotype.Repository; // استيراد التعليق التوضيحي @Repository // Importation de l'annotation @Repository

import java.util.List; // استيراد كلاس List لمعالجة القوائم // Importation de la classe List pour gérer les listes
import java.util.Optional; // استيراد كلاس Optional لمعالجة القيم التي قد تكون فارغة // Importation de la classe Optional pour gérer les valeurs potentiellement nulles

// @Repository: يشير إلى أن هذا الواجهة هي مستودع Spring مسؤول عن عمليات قاعدة البيانات // @Repository: Indique que cette interface est un repository Spring responsable des opérations de base de données
@Repository
// تعريف واجهة UserRepository التي ترث من JpaRepository // Déclaration de l'interface UserRepository qui hérite de JpaRepository
// JpaRepository<Utilisateur, Long>: يحدد أن هذا المستودع يدير كيانات Utilisateur والمفتاح الأساسي هو من نوع Long // JpaRepository<Utilisateur, Long>: Spécifie que ce repository gère les entités Utilisateur et que la clé primaire est de type Long
// يوفر JpaRepository طرقًا قياسية لعمليات CRUD (إنشاء، قراءة، تحديث، حذف) // JpaRepository fournit des méthodes standard pour les opérations CRUD (Create, Read, Update, Delete)
public interface UserRepository extends JpaRepository<Utilisateur, Long> {

    // تعريف طريقة مخصصة للبحث عن مستخدم بواسطة البريد الإلكتروني // Déclaration d'une méthode personnalisée pour rechercher un utilisateur par son email
    // Optional<Utilisateur>: نوع الإرجاع هو Optional، مما يعني أن المستخدم قد يوجد أو لا يوجد // Optional<Utilisateur>: Le type de retour est Optional, ce qui signifie que l'utilisateur peut exister ou non
    Optional<Utilisateur> findByEmail(String email); // اسم الطريقة يتبع اصطلاحات Spring Data JPA لتوليد الاستعلام تلقائيًا // Le nom de la méthode suit les conventions de Spring Data JPA pour générer automatiquement la requête

    // تعريف طريقة مخصصة للبحث عن المستخدمين حسب الدور // Déclaration d'une méthode personnalisée pour rechercher des utilisateurs par leur rôle
    // List<Utilisateur>: نوع الإرجاع هو قائمة من المستخدمين // List<Utilisateur>: Le type de retour est une liste d'utilisateurs
    List<Utilisateur> findByRole(Role role); // اسم الطريقة يتبع اصطلاحات Spring Data JPA لتوليد الاستعلام تلقائيًا // Le nom de la méthode suit les conventions de Spring Data JPA pour générer automatiquement la requête
    
    /**
     * طريقة للبحث عن مستخدم بواسطة رمز إعادة تعيين كلمة المرور
     * Method to find a user by reset token
     * 
     * @param token رمز إعادة التعيين للبحث عنه
     * @return Optional<Utilisateur> مستخدم اختياري مع الرمز المحدد
     */
    Optional<Utilisateur> findByTokenReinitialisation(String token);
}
