package com.version0.lexora.service; // تعريف الحزمة // Déclaration du package

// استيراد الكلاسات الضرورية // Importation des classes nécessaires
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم المعاد تسميته // Importation du modèle utilisateur renommé
import com.version0.lexora.model.Role; // استيراد نموذج الدور // Importation du modèle Role
import com.version0.lexora.repository.UserRepository; // استيراد مستودع المستخدم // Importation du repository utilisateur
import com.version0.lexora.security.JwtProperties; // استيراد خصائص JWT // Importation des propriétés JWT
import org.springframework.security.crypto.password.PasswordEncoder; // استيراد مشفر كلمات المرور // Importation de l'encodeur de mot de passe
import org.springframework.stereotype.Service; // استيراد التعليق التوضيحي للخدمة // Importation de l'annotation Service
import org.springframework.transaction.annotation.Transactional; // استيراد التعليق التوضيحي للمعاملات // Importation de l'annotation Transactional
import io.jsonwebtoken.Jwts; // استيراد مكتبة JWT // Importation de la bibliothèque JWT
import io.jsonwebtoken.security.Keys; // استيراد أدوات المفاتيح // Importation des utilitaires de clés
import java.security.Key; // استيراد واجهة المفتاح // Importation de l'interface Key
import java.time.LocalDate; // استيراد LocalDate للتعامل مع التواريخ
import java.time.LocalDateTime;
import java.util.Date; // استيراد كلاس التاريخ // Importation de la classe Date
import java.util.HashMap; // استيراد HashMap // Importation de HashMap
import java.util.List;
import java.util.Map; // استيراد واجهة Map // Importation de l'interface Map
import java.util.Optional; // استيراد Optional // Importation de Optional
import java.util.UUID;

import jakarta.persistence.EntityNotFoundException; // استيراد لمعالجة حالة عدم العثور على المستخدم
import java.nio.charset.StandardCharsets; // استيراد للتعامل مع الترميز // Importation pour gérer l'encodage

/**
 * خدمة المصادقة - تتعامل مع منطق تسجيل المستخدمين وتسجيل الدخول // Service
 * d'authentification - gère la logique d'inscription et de connexion des
 * utilisateurs
 * تدير عمليات التشفير وإنشاء وتحقق من رموز JWT // Gère le hachage, la
 * génération et la validation des tokens JWT
 */
@Service // يشير إلى أن هذا الكلاس هو خدمة Spring // Indique que cette classe est un
         // service Spring
public class AuthService {
    private final UserRepository userRepository; // مستودع المستخدمين // Repository des utilisateurs
    private final PasswordEncoder passwordEncoder; // مشفر كلمات المرور // Encodeur de mot de passe
    private final JwtProperties jwtProperties; // خصائص JWT // Propriétés JWT
    private final EmailService emailService; // خدمة البريد الإلكتروني // Service de courrier électronique

    // مفتاح سري لتوقيع وتحقق من رموز JWT // Clé secrète pour signer et vérifier les
    // tokens JWT
    private final Key key;

    /**
     * منشئ الخدمة - يتم حقن مستودع المستخدمين ومشفر كلمات المرور // Constructeur du
     * service - injection du repository utilisateur et de l'encodeur de mot de
     * passe
     * 
     * @param userRepository  مستودع المستخدمين للتعامل مع قاعدة البيانات //
     *                        userRepository: Repository utilisateur pour interagir
     *                        avec la base de données
     * @param passwordEncoder مشفر كلمات المرور لتأمين كلمات المرور //
     *                        passwordEncoder: Encodeur pour sécuriser les mots de
     *                        passe
     * @param jwtProperties   خصائص JWT للتكوين // jwtProperties: Propriétés JWT
     *                        pour la configuration
     * @param emailService    خدمة البريد الإلكتروني لإرسال البريد // emailService:
     *                        Service de courrier électronique pour envoyer des
     *                        e-mails
     */
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtProperties jwtProperties,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProperties = jwtProperties;
        this.emailService = emailService;

        // إنشاء المفتاح من السلسلة السرية المكونة // Créer la clé à partir de la chaîne
        // secrète configurée
        this.key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * تسجيل مستخدم جديد مع بيانات إضافية // Enregistrer un nouvel utilisateur avec
     * des données supplémentaires
     * 
     * @param email    البريد الإلكتروني للمستخدم // email: L'email de l'utilisateur
     * @param password كلمة المرور (سيتم تشفيرها) // password: Le mot de passe (sera
     *                 haché)
     * @param name     اسم المستخدم // name: Le nom de l'utilisateur
     * @param userData خريطة تحتوي على البيانات الإضافية للمستخدم // userData: Map
     *                 contenant les données supplémentaires de l'utilisateur
     * @return كائن المستخدم المسجل // @return L'objet Utilisateur enregistré
     * @throws RuntimeException إذا كان البريد الإلكتروني مستخدم بالفعل // @throws
     *                          RuntimeException si l'email est déjà utilisé
     */
    @Transactional // يضمن أن العملية تتم كوحدة واحدة (إما تنجح كلها أو تفشل كلها) // Assure que
                   // l'opération est atomique
    public Utilisateur registerWithDetails(String email, String password, String name, Map<String, Object> userData) {
        // التحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل // Vérifier si l'email
        // existe déjà
        Optional<Utilisateur> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("البريد الإلكتروني مستخدم بالفعل"); // Email déjà utilisé
        }

        // إنشاء كائن مستخدم جديد // Créer un nouvel objet Utilisateur
        Utilisateur utilisateur = new Utilisateur();

        // تعيين البيانات الأساسية // Définir les données de base
        utilisateur.setEmail(email);
        utilisateur.setMotDePasseHash(passwordEncoder.encode(password));

        // تقسيم الاسم إذا كان يحتوي على مسافة // Diviser le nom s'il contient un espace
        if (name != null && name.contains(" ")) {
            String[] nameParts = name.trim().split(" ", 2);
            utilisateur.setPrenom(nameParts[0]);
            utilisateur.setNom(nameParts[1]);
        } else {
            utilisateur.setNom(name);
        }

        // تعيين البيانات الإضافية إذا كانت موجودة // Définir les données
        // supplémentaires si présentes
        if (userData != null) {
            // تعيين الدور إذا كان موجودًا // Définir le rôle s'il est présent
            if (userData.containsKey("role")) {
                try {
                    String roleStr = userData.get("role").toString().toUpperCase();
                    utilisateur.setRole(Role.valueOf(roleStr));
                } catch (Exception e) {
                    // إذا كان الدور غير صالح، استخدم القيمة الافتراضية // Si le rôle est invalide,
                    // utiliser la valeur par défaut
                    utilisateur.setRole(Role.AVOCAT);
                }
            } else {
                // تعيين الدور الافتراضي // Définir le rôle par défaut
                utilisateur.setRole(Role.AVOCAT);
            }

            // تعيين رقم الهاتف إذا كان موجودًا // Définir le numéro de téléphone s'il est
            // présent
            if (userData.containsKey("telephone")) {
                utilisateur.setTelephone((String) userData.get("telephone"));
            }

            // تعيين العنوان إذا كان موجودًا // Définir l'adresse si elle est présente
            if (userData.containsKey("adresse")) {
                utilisateur.setAdresse((String) userData.get("adresse"));
            }

            // تعيين تاريخ الميلاد إذا كان موجودًا // Définir la date de naissance si elle
            // est présente
            if (userData.containsKey("dateNaissance") && userData.get("dateNaissance") != null) {
                try {
                    LocalDate birthDate = LocalDate.parse(userData.get("dateNaissance").toString());
                    utilisateur.setDateNaissance(birthDate);
                } catch (Exception e) {
                    System.err.println("خطأ في تحويل تاريخ الميلاد: " + e.getMessage());
                }
            }

            // تعيين حالة النشاط إذا كانت موجودة، وإلا استخدم true كافتراضي
            // Définir l'état actif s'il est présent, sinon utiliser true par défaut
            if (userData.containsKey("estActive")) {
                utilisateur.setEstActive((Boolean) userData.get("estActive"));
            } else {
                utilisateur.setEstActive(true);
            }
        } else {
            // تعيين القيم الافتراضية إذا لم يتم توفير بيانات إضافية
            // Définir les valeurs par défaut si aucune donnée supplémentaire n'est fournie
            utilisateur.setRole(Role.AVOCAT);
            utilisateur.setEstActive(true);
        }

        // حفظ المستخدم في قاعدة البيانات // Sauvegarder l'utilisateur dans la base de
        // données
        Utilisateur savedUser = userRepository.save(utilisateur);

        // إرسال بريد إلكتروني ترحيبي
        try {
            String clearPassword = "";
            if (userData != null && userData.containsKey("sendWelcomeEmail")
                    && (Boolean) userData.get("sendWelcomeEmail")) {
                // إذا كنا نريد إرسال كلمة المرور الأصلية في البريد الإلكتروني الترحيبي
                clearPassword = password; // كلمة المرور الغير مشفرة للإرسال بالبريد الإلكتروني فقط
                emailService.sendWelcomeEmail(email, utilisateur.getNomComplet(), clearPassword);
            }
        } catch (Exception e) {
            // تسجيل الخطأ ولكن لا نريد إيقاف العملية إذا فشل إرسال البريد الإلكتروني
            System.err.println("خطأ في إرسال بريد الترحيب: " + e.getMessage());
        }

        return savedUser;
    }

    /**
     * تسجيل مستخدم جديد // Enregistrer un nouvel utilisateur
     * 
     * @param email    البريد الإلكتروني للمستخدم // email: L'email de l'utilisateur
     * @param password كلمة المرور (سيتم تشفيرها) // password: Le mot de passe (sera
     *                 haché)
     * @param name     اسم المستخدم // name: Le nom de l'utilisateur
     * @return كائن المستخدم المسجل // @return L'objet Utilisateur enregistré
     * @throws RuntimeException إذا كان البريد الإلكتروني مستخدم بالفعل // @throws
     *                          RuntimeException si l'email est déjà utilisé
     */
    @Transactional // يضمن أن العملية تتم كوحدة واحدة (إما تنجح كلها أو تفشل كلها) // Assure que
                   // l'opération est atomique
    public Utilisateur register(String email, String password, String name) {
        // استخدام طريقة التسجيل مع البيانات الإضافية بدون بيانات إضافية
        // Utiliser la méthode d'enregistrement avec des données supplémentaires sans
        // fournir de données supplémentaires
        return registerWithDetails(email, password, name, null);
    }

    /**
     * تسجيل دخول المستخدم // Connecter un utilisateur
     * 
     * @param email    البريد الإلكتروني // email: L'email
     * @param password كلمة المرور // password: Le mot de passe
     * @return خريطة تحتوي على رمز JWT وبيانات المستخدم // @return Une Map contenant
     *         le token JWT et les données utilisateur
     * @throws RuntimeException إذا كانت بيانات الدخول غير صحيحة // @throws
     *                          RuntimeException si les identifiants sont incorrects
     */
    public Map<String, Object> login(String email, String password) {
        // البحث عن المستخدم بواسطة البريد الإلكتروني // Rechercher l'utilisateur par
        // email
        Utilisateur utilisateur = userRepository.findByEmail(email)
                // رمي استثناء إذا لم يتم العثور على المستخدم // Lancer une exception si
                // l'utilisateur n'est pas trouvé
                .orElseThrow(() -> new RuntimeException("البريد الإلكتروني أو كلمة المرور غير صحيحة")); // Email ou mot
                                                                                                        // de passe
                                                                                                        // incorrect

        // التحقق مما إذا كانت كلمة المرور المقدمة تطابق كلمة المرور المشفرة المخزنة //
        // Vérifier si le mot de passe fourni correspond au mot de passe haché stocké
        if (!passwordEncoder.matches(password, utilisateur.getMotDePasseHash())) { // استخدام Getter الصحيح //
                                                                                   // Utilisation du getter correct
            throw new RuntimeException("البريد الإلكتروني أو كلمة المرور غير صحيحة"); // Email ou mot de passe incorrect
        }

        // التحقق من أن الحساب نشط // Vérifier que le compte est actif
        if (!utilisateur.getEstActive()) {
            throw new RuntimeException("حساب المستخدم غير نشط. الرجاء التواصل مع المسؤول"); // Le compte utilisateur est
                                                                                            // inactif. Veuillez
                                                                                            // contacter
                                                                                            // l'administrateur
        }

        // تحديث آخر تسجيل دخول للمستخدم // Mettre à jour la dernière connexion de
        // l'utilisateur
        utilisateur.mettreAJourDerniereConnexion();
        userRepository.save(utilisateur);

        // إنشاء رمز JWT للمستخدم المصادق عليه // Générer un token JWT pour
        // l'utilisateur authentifié
        String token = generateToken(utilisateur);

        // إنشاء استجابة تحتوي على الرمز وبيانات المستخدم الأساسية // Créer une réponse
        // contenant le token et les informations de base de l'utilisateur
        Map<String, Object> response = new HashMap<>();
        response.put("token", token); // إضافة الرمز // Ajouter le token
        // إضافة بيانات المستخدم (مع استخدام Getters الصحيحة) // Ajouter les données
        // utilisateur (en utilisant les bons getters)
        response.put("user", Map.of(
                "id", utilisateur.getIdUtilisateur(), // استخدام Getter الصحيح // Utilisation du getter correct
                "nom", utilisateur.getNom(), // استخدام Getter الصحيح // Utilisation du getter correct
                "prenom", utilisateur.getPrenom(), // إضافة الاسم الأول
                "email", utilisateur.getEmail(),
                "role", utilisateur.getRole().name() // إضافة الدور
        ));

        return response; // إرجاع الاستجابة // Retourner la réponse
    }

    /**
     * إنشاء رمز JWT للمستخدم // Générer un token JWT pour l'utilisateur
     * 
     * @param utilisateur المستخدم المراد إنشاء رمز له // utilisateur: L'utilisateur
     *                    pour lequel générer le token
     * @return رمز JWT // @return Le token JWT
     */
    private String generateToken(Utilisateur utilisateur) {
        // بناء رمز JWT // Construire le token JWT
        return Jwts.builder()
                .setSubject(utilisateur.getEmail()) // تعيين موضوع الرمز (البريد الإلكتروني) // Définir le sujet du
                                                    // token (l'email)
                .setIssuedAt(new Date()) // تعيين وقت الإصدار // Définir l'heure d'émission
                // تعيين وقت انتهاء الصلاحية حسب التكوين // Définir l'heure d'expiration selon
                // la configuration
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                // إضافة بعض المطالبات المخصصة // Ajouter des revendications personnalisées
                .claim("userId", utilisateur.getIdUtilisateur().toString())
                .claim("role", utilisateur.getRole().name())
                .claim("name", utilisateur.getNomComplet())
                .signWith(key) // توقيع الرمز بالمفتاح السري // Signer le token avec la clé secrète
                .compact(); // بناء الرمز كسلسلة نصية // Construire le token sous forme de chaîne
    }

    /**
     * التحقق من صحة رمز JWT // Valider un token JWT
     * 
     * @param token رمز JWT المراد التحقق منه // token: Le token JWT à valider
     * @return كائن المستخدم إذا كان الرمز صحيح // @return L'objet Utilisateur si le
     *         token est valide
     * @throws RuntimeException إذا كان الرمز غير صالح أو المستخدم غير موجود
     *                          // @throws RuntimeException si le token est invalide
     *                          ou l'utilisateur n'existe pas
     */
    public Utilisateur validateToken(String token) {
        try {
            // تحليل الرمز واستخراج البريد الإلكتروني (الموضوع) // Analyser le token et
            // extraire l'email (sujet)
            String email = Jwts.parserBuilder()
                    .setSigningKey(key) // تعيين مفتاح التحقق // Définir la clé de vérification
                    .build()
                    .parseClaimsJws(token) // تحليل الرمز // Analyser le token
                    .getBody() // الحصول على المحتوى (Claims) // Obtenir le contenu (Claims)
                    .getSubject(); // الحصول على الموضوع (البريد الإلكتروني) // Obtenir le sujet (l'email)

            // البحث عن المستخدم بواسطة البريد الإلكتروني المستخرج // Rechercher
            // l'utilisateur par l'email extrait
            return userRepository.findByEmail(email)
                    // رمي استثناء إذا لم يتم العثور على المستخدم // Lancer une exception si
                    // l'utilisateur n'est pas trouvé
                    .orElseThrow(() -> new RuntimeException("المستخدم المرتبط بهذا الرمز غير موجود")); // L'utilisateur
                                                                                                       // associé à ce
                                                                                                       // token n'existe
                                                                                                       // pas
        } catch (Exception e) { // التقاط أي استثناء أثناء التحليل // Capturer toute exception lors de l'analyse
            // رمي استثناء يشير إلى أن الرمز غير صالح // Lancer une exception indiquant que
            // le token est invalide
            throw new RuntimeException("رمز الدخول غير صالح أو منتهي الصلاحية"); // Token invalide ou expiré
        }
    }

    /**
     * استخراج بيانات المستخدم الحالي من رمز JWT
     * Extract current user data from JWT token
     *
     * @param token رمز JWT المراد فك تشفيره واسترداد البيانات منه
     * @return خريطة تحتوي على بيانات المستخدم الحالي
     * @throws RuntimeException إذا كان الرمز غير صالح أو المستخدم غير موجود
     */
    public Map<String, Object> getCurrentUserFromToken(String token) {
        try {
            // تحليل الرمز واستخراج المطالبات (Claims)
            var claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // استخراج البريد الإلكتروني (الموضوع) من الرمز
            String email = claims.getSubject();

            // البحث عن المستخدم بواسطة البريد الإلكتروني
            Utilisateur utilisateur = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("المستخدم المرتبط بهذا الرمز غير موجود"));

            // التحقق من حالة المستخدم (إذا كان غير نشط، رفض الطلب)
            if (!utilisateur.getEstActive()) {
                throw new RuntimeException("حساب المستخدم غير نشط. يرجى الاتصال بالمسؤول");
            }

            // بناء كائن استجابة يحتوي على بيانات المستخدم
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", utilisateur.getIdUtilisateur());
            userData.put("email", utilisateur.getEmail());
            userData.put("nom", utilisateur.getNom());
            userData.put("prenom", utilisateur.getPrenom());
            userData.put("nomComplet", utilisateur.getNomComplet());
            userData.put("role", utilisateur.getRole().name());
            userData.put("telephone", utilisateur.getTelephone());
            userData.put("adresse", utilisateur.getAdresse());
            userData.put("avatar", utilisateur.getAvatar());
            userData.put("dateNaissance", utilisateur.getDateNaissance());
            userData.put("estActive", utilisateur.getEstActive());
            userData.put("derniereConnexion", utilisateur.getDerniereConnexion());

            return userData;
        } catch (Exception e) {
            throw new RuntimeException("رمز الدخول غير صالح أو منتهي الصلاحية: " + e.getMessage());
        }
    }

    /**
     * تحديث حالة النشاط لمستخدم معين.
     * Update the active status of a specific user.
     *
     * @param userId   معرف المستخدم // ID of the user
     * @param isActive الحالة الجديدة (true أو false) // The new status (true or
     *                 false)
     * @return المستخدم المحدث // The updated user
     * @throws EntityNotFoundException إذا لم يتم العثور على المستخدم // If the user
     *                                 is not found
     */
    @Transactional // ضمان أن العملية تتم كوحدة واحدة (إما تنجح كلها أو تفشل كلها) // Ensure the
                   // operation is atomic
    public Utilisateur updateUserActiveStatus(Long userId, boolean isActive) {
        // 1. البحث عن المستخدم بواسطة ID // Find the user by ID
        Utilisateur user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID : " + userId)); // Throw
                                                                                                                 // exception
                                                                                                                 // if
                                                                                                                 // not
                                                                                                                 // found

        // 2. تحديث حالة النشاط // Update the active status
        user.setEstActive(isActive);
        // 3. حفظ المستخدم المحدث // Save the updated user
        return userRepository.save(user);
    }

    /**
     * تغيير كلمة المرور لمستخدم معين
     * Change password for a specific user
     *
     * @param userId      معرف المستخدم
     * @param oldPassword كلمة المرور القديمة
     * @param newPassword كلمة المرور الجديدة
     * @return المستخدم المحدث
     * @throws RuntimeException إذا كانت كلمة المرور القديمة غير صحيحة
     */
    @Transactional
    public Utilisateur changePassword(Long userId, String oldPassword, String newPassword) {
        Utilisateur user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("المستخدم غير موجود"));

        // التحقق من كلمة المرور القديمة
        if (!passwordEncoder.matches(oldPassword, user.getMotDePasseHash())) {
            throw new RuntimeException("كلمة المرور الحالية غير صحيحة");
        }

        // تشفير وتعيين كلمة المرور الجديدة
        user.setMotDePasseHash(passwordEncoder.encode(newPassword));

        // إعادة تعيين عداد محاولات تسجيل الدخول الفاشلة
        user.reinitialiserTentativesConnexion();

        return userRepository.save(user);
    }

    /**
     * الحصول على معلومات مستخدم محدد عن طريق المعرف
     * Get user information by ID
     *
     * @param id معرف المستخدم
     * @return المستخدم
     * @throws EntityNotFoundException إذا لم يتم العثور على المستخدم
     */
    public Utilisateur getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("لم يتم العثور على المستخدم بالمعرف: " + id));
    }

    /**
     * تحديث بيانات الملف الشخصي للمستخدم
     * Update user profile data
     *
     * @param id       معرف المستخدم
     * @param userData خريطة تحتوي على البيانات المراد تحديثها
     * @return المستخدم بعد التحديث
     * @throws EntityNotFoundException إذا لم يتم العثور على المستخدم
     */
    public Utilisateur updateUserProfile(Long id, Map<String, Object> userData) {
        Utilisateur existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("لم يتم العثور على المستخدم بالمعرف: " + id));

        // تحديث البيانات القابلة للتعديل فقط باستخدام Map
        if (userData.containsKey("prenom") && userData.get("prenom") != null) {
            existingUser.setPrenom((String) userData.get("prenom"));
        }
        if (userData.containsKey("nom") && userData.get("nom") != null) {
            existingUser.setNom((String) userData.get("nom"));
        }
        if (userData.containsKey("telephone")) {
            existingUser.setTelephone((String) userData.get("telephone"));
        }
        if (userData.containsKey("adresse")) {
            existingUser.setAdresse((String) userData.get("adresse"));
        }
        if (userData.containsKey("avatar")) {
            existingUser.setAvatar((String) userData.get("avatar"));
        }

        // معالجة خاصة لتاريخ الميلاد
        if (userData.containsKey("dateNaissance")) {
            Object dateValue = userData.get("dateNaissance");
            if (dateValue != null && !dateValue.toString().isEmpty()) {
                try {
                    LocalDate date = LocalDate.parse(dateValue.toString());
                    existingUser.setDateNaissance(date);
                } catch (Exception e) {
                    System.err.println("خطأ في تحويل تاريخ الميلاد: " + e.getMessage());
                    // لا نقوم بتحديث التاريخ إذا كان هناك خطأ في التحويل
                }
            } else {
                existingUser.setDateNaissance(null);
            }
        }
        /**
         * إذا كانت البيانات تحتوي على حقل 'theme' قم بتحديث تفضيلات المستخدم
         */
        if (userData.containsKey("theme")) {
            String currentPreferences = existingUser.getPreferencesJson();
            try {
                Map<String, Object> preferences;
                if (currentPreferences != null && !currentPreferences.isEmpty()) {
                    // تحويل JSON الحالي إلى Map
                    preferences = new HashMap<>(); // يمكن استخدام Jackson هنا للتحويل
                } else {
                    preferences = new HashMap<>();
                }
                preferences.put("theme", userData.get("theme"));
                // تحويل Map إلى JSON وتخزين
                existingUser.setPreferencesJson(preferences.toString()); // يمكن استخدام Jackson هنا للتحويل
            } catch (Exception e) {
                System.err.println("خطأ في تحديث تفضيلات المستخدم: " + e.getMessage());
            }
        }

        // تحديث الدور إذا كان موجوداً في البيانات
        if (userData.containsKey("role") && userData.get("role") != null) {
            try {
                String roleString = (String) userData.get("role");
                Role newRole = Role.valueOf(roleString.toUpperCase());
                existingUser.setRole(newRole);
            } catch (IllegalArgumentException e) {
                System.err.println("دور غير صالح: " + userData.get("role"));
                // يمكن رمي استثناء هنا أو تجاهل التحديث
            }
        }

        // تحديث حالة النشاط إذا كانت موجودة في البيانات
        if (userData.containsKey("estActive")) {
            Boolean isActive = (Boolean) userData.get("estActive");
            existingUser.setEstActive(isActive);
        }

        // لا تقم بتحديث البريد الإلكتروني أو كلمة المرور هنا
        return userRepository.save(existingUser);
    }

    /**
     * تحديث دور المستخدم وحالة النشاط - خاص بالمدراء فقط
     * Update user role and active status - for administrators only
     *
     * @param userId      معرف المستخدم
     * @param newRole     الدور الجديد
     * @param isActive    حالة النشاط الجديدة
     * @param adminUserId معرف المدير الذي يقوم بالتحديث
     * @return المستخدم بعد التحديث
     * @throws EntityNotFoundException  إذا لم يتم العثور على المستخدم أو المدير
     * @throws IllegalArgumentException إذا لم يكن المستخدم مديراً
     */
    @Transactional
    public Utilisateur updateUserRoleAndStatus(Long userId, Role newRole, Boolean isActive, Long adminUserId) {
        // التحقق من أن المدير موجود ولديه صلاحيات إدارية
        Utilisateur admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new EntityNotFoundException("لم يتم العثور على المدير بالمعرف: " + adminUserId));

        if (admin.getRole() != Role.ADMINISTRATEUR) {
            throw new IllegalArgumentException("فقط المدراء يمكنهم تحديث أدوار المستخدمين");
        }

        // العثور على المستخدم المراد تحديثه
        Utilisateur targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("لم يتم العثور على المستخدم بالمعرف: " + userId));

        // منع تعديل دور مدير النظام من قبل مديرين آخرين
        if (targetUser.getRole() == Role.ADMINISTRATEUR && !targetUser.getIdUtilisateur().equals(adminUserId)) {
            throw new IllegalArgumentException("لا يمكن تعديل دور مدير النظام");
        }

        // تحديث الدور والحالة
        if (newRole != null) {
            targetUser.setRole(newRole);
        }

        if (isActive != null) {
            // منع تعطيل حساب مدير النظام
            if (targetUser.getRole() == Role.ADMINISTRATEUR && !isActive) {
                throw new IllegalArgumentException("لا يمكن تعطيل حساب مدير النظام");
            }
            targetUser.setEstActive(isActive);
        }

        return userRepository.save(targetUser);
    }

    /**
     * الحصول على قائمة جميع المستخدمين في النظام
     * Get a list of all users in the system
     *
     * @return قائمة بجميع المستخدمين
     */
    public List<Utilisateur> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * حذف مستخدم من النظام
     * Delete a user from the system
     *
     * @param id معرف المستخدم المراد حذفه
     * @throws EntityNotFoundException إذا لم يتم العثور على المستخدم
     * @throws IllegalStateException   إذا كان المستخدم مرتبط بدوسييهات
     */
    @Transactional
    public void deleteUser(Long id) {
        Utilisateur utilisateur = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("لم يتم العثور على المستخدم بالمعرف: " + id));

        // قبل الحذف، تحقق مما إذا كان المستخدم مرتبط بدوسييهات
        if (utilisateur.getDossiersResponsable() != null && !utilisateur.getDossiersResponsable().isEmpty()) {
            throw new IllegalStateException(
                    "لا يمكن حذف المستخدم لأنه مرتبط بدوسييهات. قم بتعيين مسؤول آخر للدوسييهات أولًا.");
        }

        // حذف المستخدم من قاعدة البيانات
        userRepository.delete(utilisateur);
    }

    /**
     * طلب استعادة كلمة المرور - يرسل بريدًا إلكترونيًا برابط إعادة التعيين
     * Request for password recovery - sends an email with a reset link
     * 
     * @param email البريد الإلكتروني للمستخدم المراد استعادة كلمة مروره
     * @return رسالة تأكيد
     * @throws EntityNotFoundException إذا لم يتم العثور على المستخدم
     */
    @Transactional
    public String forgotPassword(String email) {
        try {
            // البحث عن المستخدم بواسطة البريد الإلكتروني
            Utilisateur user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new EntityNotFoundException("لم يتم العثور على مستخدم بهذا البريد الإلكتروني"));

            // إنشاء رمز استعادة فريد
            String token = UUID.randomUUID().toString();

            // تعيين رمز استعادة كلمة المرور وتاريخ انتهاء صلاحيته (24 ساعة من الآن)
            user.setTokenReinitialisation(token);
            user.setExpirationToken(LocalDateTime.now().plusHours(24));

            // حفظ التغييرات
            userRepository.save(user);

            try {
                // إرسال بريد إلكتروني يحتوي على رابط إعادة التعيين
                emailService.sendPasswordResetEmail(email, token, user.getNomComplet());
                System.out.println("Password reset token created and email sent for user: " + email);
            } catch (Exception emailException) {
                // تسجيل الخطأ دون رميه للمستدعي - سنستمر في العملية حتى لو فشل البريد
                System.err.println("فشل في إرسال بريد إعادة تعيين كلمة المرور: " + emailException.getMessage());
                System.out.println("تم إنشاء رمز إعادة تعيين لكن فشل إرسال البريد.");
                System.out.println("Reset token (for development purposes): " + token);
            }

            // نرجع رسالة ناجحة حتى إذا فشل البريد
            return "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.";
        } catch (EntityNotFoundException e) {
            // رمي الاستثناء للتعامل معه في المتحكم
            throw e;
        } catch (Exception e) {
            // تسجيل الخطأ غير المتوقع وإعادة رميه كاستثناء وقت التشغيل
            System.err.println("خطأ غير متوقع في استعادة كلمة المرور: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("حدث خطأ أثناء معالجة طلب استعادة كلمة المرور: " + e.getMessage());
        }
    }

    /**
     * التحقق من صحة رمز استعادة كلمة المرور
     * Verify password reset token
     * 
     * @param token الرمز المراد التحقق منه
     * @return true إذا كان الرمز صالحًا، false إذا كان غير ذلك
     */
    public boolean validateResetToken(String token) {
        Utilisateur user = userRepository.findByTokenReinitialisation(token)
                .orElse(null);

        if (user == null) {
            return false;
        }

        // التحقق من انتهاء صلاحية الرمز
        if (user.getExpirationToken() == null || LocalDateTime.now().isAfter(user.getExpirationToken())) {
            // إذا انتهت صلاحية الرمز، قم بإعادة تعيينه
            user.setTokenReinitialisation(null);
            user.setExpirationToken(null);
            userRepository.save(user);
            return false;
        }

        return true;
    }

    /**
     * إعادة تعيين كلمة المرور باستخدام رمز
     * Reset password using token
     * 
     * @param token       رمز إعادة التعيين
     * @param newPassword كلمة المرور الجديدة
     * @return رسالة تأكيد
     * @throws RuntimeException إذا كان الرمز غير صالح أو منتهي الصلاحية
     */
    @Transactional
    public String resetPassword(String token, String newPassword) {
        if (!validateResetToken(token)) {
            throw new RuntimeException("رمز استعادة كلمة المرور غير صالح أو منتهي الصلاحية");
        }

        Utilisateur user = userRepository.findByTokenReinitialisation(token)
                .orElseThrow(() -> new RuntimeException("رمز استعادة كلمة المرور غير صالح"));

        // تعيين كلمة المرور الجديدة وتشفيرها
        user.setMotDePasseHash(passwordEncoder.encode(newPassword));

        // إعادة تعيين رمز الاستعادة وتاريخ انتهاء صلاحيته
        user.setTokenReinitialisation(null);
        user.setExpirationToken(null);

        // إعادة تعيين عداد محاولات تسجيل الدخول الفاشلة (إذا وجد)
        user.reinitialiserTentativesConnexion();

        // حفظ التغييرات
        userRepository.save(user);

        return "تم إعادة تعيين كلمة المرور بنجاح";
    }
}