package com.version0.lexora.controller;

import com.version0.lexora.model.User;
import com.version0.lexora.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
            User user = authService.register(
                registrationData.get("email"),
                registrationData.get("password"),
                registrationData.get("name")
            );
            return ResponseEntity.ok(user);
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
            return ResponseEntity.ok(authService.validateToken(token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
} 