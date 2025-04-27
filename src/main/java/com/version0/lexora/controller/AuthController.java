package com.version0.lexora.controller;

import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم
import com.version0.lexora.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;
import java.util.Map;
import java.util.List;

/**
 * متحكم المصادقة وإدارة المستخدمين - يتعامل مع طلبات تسجيل المستخدمين وتسجيل الدخول وإدارة حسابات المستخدمين
 * يوفر نقاط النهاية (endpoints) للتسجيل وتسجيل الدخول والتحقق من المستخدم الحالي وإدارة المستخدمين
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // السماح بالطلبات من أي مصدر خلال التطوير
public class AuthController {
    private final AuthService authService;

    /**
     * منشئ المتحكم - يتم حقن خدمة المصادقة
     * @param authService خدمة المصادقة المستخدمة للتعامل مع منطق التسجيل وتسجيل الدخول
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * نقطة نهاية تسجيل مستخدم جديد
     * @param registrationData خريطة تحتوي على بيانات التسجيل (الاسم، البريد الإلكتروني، كلمة المرور)
     * @return ResponseEntity يحتوي على بيانات المستخدم المسجل أو رسالة خطأ
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationData) {
        try {
            Utilisateur utilisateur = authService.register(
                registrationData.get("email"),
                registrationData.get("password"),
                registrationData.get("name")
            );
            return ResponseEntity.ok(utilisateur);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * نقطة نهاية تسجيل مستخدم جديد مع بيانات إضافية
     * @param userData خريطة تحتوي على بيانات التسجيل الكاملة (البريد الإلكتروني، كلمة المرور، الاسم، وأي بيانات إضافية)
     * @return ResponseEntity يحتوي على بيانات المستخدم المسجل أو رسالة خطأ
     */
    @PostMapping("/register/full")
    public ResponseEntity<?> registerWithFullDetails(@RequestBody Map<String, Object> userData) {
        try {
            // استخراج البيانات الأساسية المطلوبة
            String email = (String) userData.get("email");
            String password = (String) userData.get("password");
            String name = (String) userData.get("name");
            
            // التحقق من وجود البيانات الضرورية
            if (email == null || password == null || name == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "البيانات الأساسية مطلوبة: البريد الإلكتروني، كلمة المرور، الاسم"));
            }
            
            // استدعاء خدمة التسجيل مع كافة البيانات
            Utilisateur utilisateur = authService.registerWithDetails(
                email,
                password,
                name,
                userData
            );
            return ResponseEntity.ok(utilisateur);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * نقطة نهاية تسجيل الدخول
     * @param credentials خريطة تحتوي على بيانات الدخول (البريد الإلكتروني، كلمة المرور)
     * @return ResponseEntity يحتوي على رمز JWT وبيانات المستخدم أو رسالة خطأ
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            Map<String, Object> response = authService.login(
                credentials.get("email"),
                credentials.get("password")
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==================== وظائف إدارة المستخدمين المنقولة من UserController ====================

    /**
     * نقطة نهاية لإضافة مستخدم جديد
     * Endpoint to add a new user
     * 
     * @param userData البيانات اللازمة لإنشاء المستخدم الجديد
     * @return ResponseEntity يحتوي على بيانات المستخدم المضاف أو رسالة خطأ
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> userData) {
        try {
            // استخراج البيانات الأساسية المطلوبة
            String email = (String) userData.get("email");
            String password = (String) userData.get("password");
            String name = (String) userData.get("name");
            
            // التحقق من وجود البيانات الضرورية
            if (email == null || password == null || name == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "البيانات الأساسية مطلوبة: البريد الإلكتروني، كلمة المرور، الاسم"));
            }
            
            // استدعاء خدمة التسجيل مع كافة البيانات
            Utilisateur utilisateur = authService.registerWithDetails(
                email,
                password,
                name,
                userData
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(utilisateur);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * نقطة نهاية للحصول على معلومات مستخدم محدد بواسطة المعرف
     * Endpoint to get specific user information by ID
     * 
     * @param id معرف المستخدم
     * @return ResponseEntity يحتوي على بيانات المستخدم أو رسالة خطأ
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Utilisateur utilisateur = authService.getUserById(id);
            return ResponseEntity.ok(utilisateur);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ أثناء جلب بيانات المستخدم: " + e.getMessage()));
        }
    }

    /**
     * نقطة نهاية للحصول على جميع المستخدمين
     * Endpoint to get all users
     *
     * @return ResponseEntity يحتوي على قائمة المستخدمين أو رسالة خطأ
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<Utilisateur> utilisateurs = authService.getAllUsers();
            return ResponseEntity.ok(utilisateurs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ أثناء جلب قائمة المستخدمين: " + e.getMessage()));
        }
    }

    /**
     * نقطة نهاية لتحديث حالة المستخدم
     * @param id معرف المستخدم
     * @param active الحالة الجديدة للمستخدم
     * @return ResponseEntity يحتوي على بيانات المستخدم المحدث أو رسالة خطأ
     */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam boolean active) {
        try {
            Utilisateur updatedUser = authService.updateUserActiveStatus(id, active);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("خطأ أثناء تحديث حالة المستخدم.");
        }
    }

    /**
     * نقطة نهاية لتحديث بيانات الملف الشخصي للمستخدم
     * @param id معرف المستخدم
     * @param userData خريطة تحتوي على البيانات المراد تحديثها
     * @return ResponseEntity يحتوي على بيانات المستخدم المحدث أو رسالة خطأ
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        try {
            Utilisateur updatedUser = authService.updateUserProfile(id, userData);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("خطأ عند تحديث بيانات المستخدم: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ أثناء تحديث بيانات المستخدم: " + e.getMessage()));
        }
    }
    
    /**
     * نقطة نهاية لتغيير كلمة المرور للمستخدم
     * @param id معرف المستخدم
     * @param passwordData خريطة تحتوي على كلمة المرور القديمة والجديدة
     * @return ResponseEntity يحتوي على بيانات المستخدم المحدث أو رسالة خطأ
     */
    @PutMapping("/users/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        try {
            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");
            
            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "كلمة المرور القديمة والجديدة مطلوبة"));
            }
            
            // استدعاء خدمة تغيير كلمة المرور بدون تخزين النتيجة في متغير
            authService.changePassword(id, oldPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "تم تغيير كلمة المرور بنجاح"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ أثناء تغيير كلمة المرور: " + e.getMessage()));
        }
    }
    
    /**
     * نقطة نهاية لحذف مستخدم
     * @param id معرف المستخدم المراد حذفه
     * @return ResponseEntity يحتوي على رسالة نجاح أو رسالة خطأ
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            // الحذف من خلال الخدمة 
            authService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "تم حذف المستخدم بنجاح"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ أثناء حذف المستخدم: " + e.getMessage()));
        }
    }

    /**
     * نقطة نهاية للتحقق من المستخدم الحالي واسترداد بياناته
     * Endpoint to check and retrieve current user data based on JWT token
     *
     * @return ResponseEntity يحتوي على بيانات المستخدم الحالي أو رسالة خطأ
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "رمز المصادقة مفقود أو غير صالح"));
            }
            
            String token = authHeader.substring(7); // استخراج الرمز بعد "Bearer "
            Map<String, Object> userData = authService.getCurrentUserFromToken(token);
            return ResponseEntity.ok(userData);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "حدث خطأ أثناء جلب بيانات المستخدم الحالي: " + e.getMessage()));
        }
    }
}