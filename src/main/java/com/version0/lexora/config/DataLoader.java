package com.version0.lexora.config;

import com.version0.lexora.model.Role;
import com.version0.lexora.model.Utilisateur;
import com.version0.lexora.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * يقوم هذا الكلاس بتهيئة بيانات أولية عند بدء تشغيل التطبيق.
 * يتأكد من وجود مستخدم مسؤول (ADMINISTRATEUR) في قاعدة البيانات.
 * This class initializes seed data when the application starts.
 * It ensures an administrator user (ADMINISTRATEUR) exists in the database.
 */
@Component // يجعل هذا الكلاس مكونًا يتم إدارته بواسطة Spring ويتم اكتشافه لتنفيذ CommandLineRunner
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // حقن المستودع والمشفر عبر المُنشئ
    // Inject repository and encoder via constructor
    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("DataLoader: Vérification de l'existence de l'utilisateur administrateur...");
        // التحقق مما إذا كان هناك أي مستخدم بدور ADMINISTRATEUR
        // Check if any user with the ADMINISTRATEUR role exists
        List<Utilisateur> admins = userRepository.findByRole(Role.ADMINISTRATEUR);

        if (admins.isEmpty()) {
            log.info("DataLoader: Aucun administrateur trouvé. Création d'un administrateur par défaut.");
            // لا يوجد مسؤول، قم بإنشاء واحد
            // No admin found, create one
            Utilisateur adminUser = new Utilisateur(
                    "Admin", // اسم المسؤول الافتراضي // Default admin name
                    "admin@lexora.com", // البريد الإلكتروني الافتراضي للمسؤول // Default admin email
                    passwordEncoder.encode("admin123"), // كلمة المرور الافتراضية (يجب تغييرها في بيئة الإنتاج!) // Default password (CHANGE IN PRODUCTION!)
                    Role.ADMINISTRATEUR // تعيين دور المسؤول // Assign the ADMINISTRATEUR role

                );
            // adminUser.setEstActive(true); // Supprimé car estActive est vrai par défaut dans le constructeur Utilisateur

            userRepository.save(adminUser);
            log.info("DataLoader: Administrateur par défaut créé avec succès (email: admin@lexora.com).");
        } else {
            log.info("DataLoader: Un ou plusieurs administrateurs existent déjà. Aucune action requise.");
            // تم العثور على مسؤول واحد أو أكثر، لا حاجة لإنشاء واحد جديد
            // One or more admins found, no need to create a new one
        }
    }
}