package com.version0.lexora.service; // تعريف الحزمة // Déclaration du package

// استيراد الكلاسات الضرورية // Importation des classes nécessaires
import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم المعاد تسميته // Importation du modèle utilisateur renommé
import com.version0.lexora.repository.UserRepository; // استيراد مستودع المستخدم // Importation du repository utilisateur
import org.springframework.security.crypto.password.PasswordEncoder; // استيراد مشفر كلمات المرور // Importation de l'encodeur de mot de passe
import org.springframework.stereotype.Service; // استيراد التعليق التوضيحي للخدمة // Importation de l'annotation Service
import org.springframework.transaction.annotation.Transactional; // استيراد التعليق التوضيحي للمعاملات // Importation de l'annotation Transactional
import io.jsonwebtoken.Jwts; // استيراد مكتبة JWT // Importation de la bibliothèque JWT
import io.jsonwebtoken.SignatureAlgorithm; // استيراد خوارزمية التوقيع // Importation de l'algorithme de signature
import io.jsonwebtoken.security.Keys; // استيراد أدوات المفاتيح // Importation des utilitaires de clés
import java.security.Key; // استيراد واجهة المفتاح // Importation de l'interface Key
import java.util.Date; // استيراد كلاس التاريخ // Importation de la classe Date
import java.util.HashMap; // استيراد HashMap // Importation de HashMap
import java.util.Map; // استيراد واجهة Map // Importation de l'interface Map
import java.util.Optional; // استيراد Optional // Importation de Optional
import jakarta.persistence.EntityNotFoundException; // استيراد لمعالجة حالة عدم العثور على المستخدم

/**
 * خدمة المصادقة - تتعامل مع منطق تسجيل المستخدمين وتسجيل الدخول // Service d'authentification - gère la logique d'inscription et de connexion des utilisateurs
 * تدير عمليات التشفير وإنشاء وتحقق من رموز JWT // Gère le hachage, la génération et la validation des tokens JWT
 */
@Service // يشير إلى أن هذا الكلاس هو خدمة Spring // Indique que cette classe est un service Spring
public class AuthService {
    private final UserRepository userRepository; // مستودع المستخدمين // Repository des utilisateurs
    private final PasswordEncoder passwordEncoder; // مشفر كلمات المرور // Encodeur de mot de passe
    // إنشاء مفتاح آمن لتوقيع رموز JWT // Création d'une clé sécurisée pour signer les tokens JWT
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    /**
     * منشئ الخدمة - يتم حقن مستودع المستخدمين ومشفر كلمات المرور // Constructeur du service - injection du repository utilisateur et de l'encodeur de mot de passe
     * @param userRepository مستودع المستخدمين للتعامل مع قاعدة البيانات // userRepository: Repository utilisateur pour interagir avec la base de données
     * @param passwordEncoder مشفر كلمات المرور لتأمين كلمات المرور // passwordEncoder: Encodeur pour sécuriser les mots de passe
     */
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * تسجيل مستخدم جديد // Enregistrer un nouvel utilisateur
     * @param email البريد الإلكتروني للمستخدم // email: L'email de l'utilisateur
     * @param password كلمة المرور (سيتم تشفيرها) // password: Le mot de passe (sera haché)
     * @param name اسم المستخدم // name: Le nom de l'utilisateur
     * @return كائن المستخدم المسجل // @return L'objet Utilisateur enregistré
     * @throws RuntimeException إذا كان البريد الإلكتروني مستخدم بالفعل // @throws RuntimeException si l'email est déjà utilisé
     */
    @Transactional // يضمن أن العملية تتم كوحدة واحدة (إما تنجح كلها أو تفشل كلها) // Assure que l'opération est atomique (tout réussit ou tout échoue)
    public Utilisateur register(String email, String password, String name) {
        // التحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل // Vérifier si l'email existe déjà
        Optional<Utilisateur> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("البريد الإلكتروني مستخدم بالفعل"); // Email déjà utilisé
        }

        // إنشاء كائن مستخدم جديد // Créer un nouvel objet Utilisateur
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(name); // تعيين الاسم // Définir le nom
        utilisateur.setEmail(email); // تعيين البريد الإلكتروني // Définir l'email
        // تشفير كلمة المرور قبل حفظها // Hacher le mot de passe avant de le sauvegarder
        utilisateur.setMotDePasseHash(passwordEncoder.encode(password)); // استخدام Setter الصحيح // Utilisation du setter correct
        utilisateur.setEstActive(true); // تعيين المستخدم كنشط افتراضيًا // Définir l'utilisateur comme actif par défaut

        // حفظ المستخدم في قاعدة البيانات // Sauvegarder l'utilisateur dans la base de données
        return userRepository.save(utilisateur);
    }

    /**
     * تسجيل دخول المستخدم // Connecter un utilisateur
     * @param email البريد الإلكتروني // email: L'email
     * @param password كلمة المرور // password: Le mot de passe
     * @return خريطة تحتوي على رمز JWT وبيانات المستخدم // @return Une Map contenant le token JWT et les données utilisateur
     * @throws RuntimeException إذا كانت بيانات الدخول غير صحيحة // @throws RuntimeException si les identifiants sont incorrects
     */
    public Map<String, Object> login(String email, String password) {
        // البحث عن المستخدم بواسطة البريد الإلكتروني // Rechercher l'utilisateur par email
        Utilisateur utilisateur = userRepository.findByEmail(email)
            // رمي استثناء إذا لم يتم العثور على المستخدم // Lancer une exception si l'utilisateur n'est pas trouvé
            .orElseThrow(() -> new RuntimeException("البريد الإلكتروني أو كلمة المرور غير صحيحة")); // Email ou mot de passe incorrect

        // التحقق مما إذا كانت كلمة المرور المقدمة تطابق كلمة المرور المشفرة المخزنة // Vérifier si le mot de passe fourni correspond au mot de passe haché stocké
        if (!passwordEncoder.matches(password, utilisateur.getMotDePasseHash())) { // استخدام Getter الصحيح // Utilisation du getter correct
            throw new RuntimeException("البريد الإلكتروني أو كلمة المرور غير صحيحة"); // Email ou mot de passe incorrect
        }

        // إنشاء رمز JWT للمستخدم المصادق عليه // Générer un token JWT pour l'utilisateur authentifié
        String token = generateToken(utilisateur);

        // إنشاء استجابة تحتوي على الرمز وبيانات المستخدم الأساسية // Créer une réponse contenant le token et les informations de base de l'utilisateur
        Map<String, Object> response = new HashMap<>();
        response.put("token", token); // إضافة الرمز // Ajouter le token
        // إضافة بيانات المستخدم (مع استخدام Getters الصحيحة) // Ajouter les données utilisateur (en utilisant les bons getters)
        response.put("user", Map.of(
            "id", utilisateur.getIdUtilisateur(), // استخدام Getter الصحيح // Utilisation du getter correct
            "nom", utilisateur.getNom(),       // استخدام Getter الصحيح // Utilisation du getter correct
            "email", utilisateur.getEmail()
        ));

        return response; // إرجاع الاستجابة // Retourner la réponse
    }

    /**
     * إنشاء رمز JWT للمستخدم // Générer un token JWT pour l'utilisateur
     * @param utilisateur المستخدم المراد إنشاء رمز له // utilisateur: L'utilisateur pour lequel générer le token
     * @return رمز JWT // @return Le token JWT
     */
    private String generateToken(Utilisateur utilisateur) {
        // بناء رمز JWT // Construire le token JWT
        return Jwts.builder()
            .setSubject(utilisateur.getEmail()) // تعيين موضوع الرمز (البريد الإلكتروني) // Définir le sujet du token (l'email)
            .setIssuedAt(new Date()) // تعيين وقت الإصدار // Définir l'heure d'émission
            // تعيين وقت انتهاء الصلاحية (هنا 24 ساعة) // Définir l'heure d'expiration (ici 24 heures)
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(key) // توقيع الرمز بالمفتاح السري // Signer le token avec la clé secrète
            .compact(); // بناء الرمز كسلسلة نصية // Construire le token sous forme de chaîne
    }

    /**
     * التحقق من صحة رمز JWT // Valider un token JWT
     * @param token رمز JWT المراد التحقق منه // token: Le token JWT à valider
     * @return كائن المستخدم إذا كان الرمز صحيح // @return L'objet Utilisateur si le token est valide
     * @throws RuntimeException إذا كان الرمز غير صالح أو المستخدم غير موجود // @throws RuntimeException si le token est invalide ou l'utilisateur n'existe pas
     */
    public Utilisateur validateToken(String token) {
        try {
            // تحليل الرمز واستخراج البريد الإلكتروني (الموضوع) // Analyser le token et extraire l'email (sujet)
            String email = Jwts.parserBuilder()
                .setSigningKey(key) // تعيين مفتاح التحقق // Définir la clé de vérification
                .build()
                .parseClaimsJws(token) // تحليل الرمز // Analyser le token
                .getBody() // الحصول على المحتوى (Claims) // Obtenir le contenu (Claims)
                .getSubject(); // الحصول على الموضوع (البريد الإلكتروني) // Obtenir le sujet (l'email)

            // البحث عن المستخدم بواسطة البريد الإلكتروني المستخرج // Rechercher l'utilisateur par l'email extrait
            return userRepository.findByEmail(email)
                // رمي استثناء إذا لم يتم العثور على المستخدم // Lancer une exception si l'utilisateur n'est pas trouvé
                .orElseThrow(() -> new RuntimeException("المستخدم المرتبط بهذا الرمز غير موجود")); // L'utilisateur associé à ce token n'existe pas
        } catch (Exception e) { // التقاط أي استثناء أثناء التحليل // Capturer toute exception lors de l'analyse
            // رمي استثناء يشير إلى أن الرمز غير صالح // Lancer une exception indiquant que le token est invalide
            throw new RuntimeException("رمز الدخول غير صالح أو منتهي الصلاحية"); // Token invalide ou expiré
        }
    }

    /**
     * تحديث حالة النشاط لمستخدم معين.
     * Update the active status of a specific user.
     *
     * @param userId   معرف المستخدم // ID of the user
     * @param isActive الحالة الجديدة (true أو false) // The new status (true or false)
     * @return المستخدم المحدث // The updated user
     * @throws EntityNotFoundException إذا لم يتم العثور على المستخدم // If the user is not found
     */
    @Transactional // ضمان أن العملية تتم كوحدة واحدة (إما تنجح كلها أو تفشل كلها) // Ensure the operation is atomic
    public Utilisateur updateUserActiveStatus(Long userId, boolean isActive) {
        // 1. البحث عن المستخدم بواسطة ID // Find the user by ID
        Utilisateur user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID : " + userId)); // Throw exception if not found

        // 2. تحديث حالة النشاط // Update the active status
        user.setEstActive(isActive);
        // 3. حفظ المستخدم المحدث // Save the updated user
        return userRepository.save(user);
    }
}