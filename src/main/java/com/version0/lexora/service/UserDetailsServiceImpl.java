package com.version0.lexora.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
// Add import for DisabledException
import org.springframework.security.authentication.DisabledException;
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

        // Vérifier si le compte est actif
        // Check if the account is active
        if (!utilisateur.getEstActive()) {
            // Lancer une exception si le compte n'est pas actif
            // Throw an exception if the account is not active
            throw new DisabledException("User account is disabled");
        }

        // بناء كائن UserDetails الذي يستخدمه Spring Security // Construction de l'objet UserDetails utilisé par Spring Security
        UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(email); // بدء بناء المستخدم بالبريد الإلكتروني // Commencer la construction de l'utilisateur avec l'email
        // تعيين كلمة المرور المشفرة من كائن المستخدم // Définir le mot de passe haché à partir de l'objet utilisateur
        // استخدام getter الصحيح لتجزئة كلمة المرور // Utilisation du getter correct pour le hash du mot de passe
        builder.password(utilisateur.getMotDePasseHash()); // Changed method call
        // Utiliser le rôle stocké dans l'entité Utilisateur
        // Use the role stored in the Utilisateur entity
        builder.roles(utilisateur.getRole().name()); // Assigner le rôle réel de l'utilisateur

        return builder.build(); // إرجاع كائن UserDetails المبني // Retourner l'objet UserDetails construit
    }
}
