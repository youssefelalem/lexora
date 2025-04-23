package com.version0.lexora.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.version0.lexora.model.Utilisateur;
import com.version0.lexora.repository.UserRepository;

import java.util.Optional;

@Service("userDetailsService") // تعيين اسم الخدمة لـ Spring Security // Définir le nom du service pour Spring Security
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired // حقن تبعية UserRepository تلقائيًا بواسطة Spring // Injection automatique de la dépendance UserRepository par Spring
    private UserRepository userRepository; // مستودع للوصول إلى بيانات المستخدم // Repository pour accéder aux données utilisateur

    @Override // تجاوز الطريقة من واجهة UserDetailsService // Surcharge de la méthode de l'interface UserDetailsService
    // تحميل المستخدم بواسطة اسم المستخدم (البريد الإلكتروني في هذه الحالة) // Charger l'utilisateur par son nom d'utilisateur (l'email dans ce cas)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // البحث عن المستخدم في المستودع باستخدام البريد الإلكتروني // Recherche de l'utilisateur dans le repository en utilisant l'email
        // استخدام Utilisateur بدلاً من User // Utilisation de Utilisateur au lieu de User
        Optional<Utilisateur> userOptional = userRepository.findByEmail(email); // Optional لتجنب NullPointerException // Optional pour éviter NullPointerException

        // الحصول على كائن Utilisateur من Optional أو رمي استثناء إذا لم يتم العثور عليه // Récupérer l'objet Utilisateur depuis l'Optional ou lancer une exception s'il n'est pas trouvé
        // استخدام Utilisateur بدلاً من User // Utilisation de Utilisateur au lieu de User
        Utilisateur utilisateur = userOptional.orElseThrow(() ->
                new UsernameNotFoundException("User not found with email: " + email)); // رسالة خطأ واضحة // Message d'erreur clair

        // بناء كائن UserDetails الذي يستخدمه Spring Security // Construction de l'objet UserDetails utilisé par Spring Security
        UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(email); // بدء بناء المستخدم بالبريد الإلكتروني // Commencer la construction de l'utilisateur avec l'email
        // تعيين كلمة المرور المشفرة من كائن المستخدم // Définir le mot de passe haché à partir de l'objet utilisateur
        // استخدام getter الصحيح لتجزئة كلمة المرور // Utilisation du getter correct pour le hash du mot de passe
        builder.password(utilisateur.getMotDePasseHash()); // Changed method call
        // تعيين الأدوار/الصلاحيات. للتبسيط، يتم تعيين دور 'USER' للجميع. // Attribuer les rôles/autorités. Pour simplifier, attribuer le rôle 'USER' à tout le monde.
        // في تطبيق حقيقي، قد تخزن الأدوار في كيان المستخدم. // Dans une application réelle, vous pourriez stocker les rôles dans l'entité Utilisateur.
        // ضع في اعتبارك إضافة إدارة الأدوار بناءً على نوع المستخدم (Secretaire، Avocat) لاحقًا // Envisager d'ajouter une gestion des rôles basée sur le type d'Utilisateur (Secretaire, Avocat) plus tard
        builder.roles("USER"); // تعيين دور افتراضي // Attribution d'un rôle par défaut
        // يمكنك إضافة المزيد من الصلاحيات باستخدام .authorities(...) // Vous pouvez ajouter plus d'autorités en utilisant .authorities(...)

        return builder.build(); // إرجاع كائن UserDetails المبني // Retourner l'objet UserDetails construit
    }
}
