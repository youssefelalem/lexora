package com.version0.lexora.controller;

import com.version0.lexora.model.Utilisateur; // استيراد نموذج المستخدم المعاد تسميته // Importation du modèle utilisateur renommé
import com.version0.lexora.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException; // <-- تغيير هنا
import java.util.Map;

/**
 * متحكم المصادقة - يتعامل مع طلبات تسجيل المستخدمين وتسجيل الدخول
 * يوفر نقاط النهاية (endpoints) للتسجيل وتسجيل الدخول والتحقق من المستخدم الحالي
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // السماح بالطلبات من الفرونت إند
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

    /**
     * نقطة نهاية للتحقق من المستخدم الحالي وتحديث بياناته
     * @param token رمز JWT المرسل في رأس الطلب
     * @return ResponseEntity يحتوي على بيانات المستخدم الحالي أو رسالة خطأ
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Utilisateur utilisateur = authService.validateToken(token);
            return ResponseEntity.ok(utilisateur);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * نقطة نهاية لتحديث حالة المستخدم
     * @param id معرف المستخدم
     * @param active الحالة الجديدة للمستخدم
     * @return ResponseEntity يحتوي على بيانات المستخدم المحدث أو رسالة خطأ
     */
    @PutMapping("/users/{id}/status") // أو @PatchMapping // Or @PatchMapping
    // @PreAuthorize("hasRole('ADMIN')") // قم بتأمين هذه النقطة إذا لزم الأمر // Secure this endpoint if needed
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam boolean active) {
        try {
            Utilisateur updatedUser = authService.updateUserActiveStatus(id, active);
            return ResponseEntity.ok(updatedUser); // إرجاع المستخدم المحدث // Return the updated user
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // إرجاع خطأ 404 إذا لم يتم العثور عليه // Return 404 if not found
        } catch (Exception e) {
            // معالجة الأخطاء الأخرى // Handle other potential errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la mise à jour du statut de l'utilisateur.");
        }
    }
}