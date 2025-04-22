package com.version0.lexora.service;

import com.version0.lexora.model.User;
import com.version0.lexora.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * خدمة المصادقة - تتعامل مع منطق تسجيل المستخدمين وتسجيل الدخول
 * تدير عمليات التشفير وإنشاء وتحقق من رموز JWT
 */
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    /**
     * منشئ الخدمة - يتم حقن مستودع المستخدمين ومشفر كلمات المرور
     * @param userRepository مستودع المستخدمين للتعامل مع قاعدة البيانات
     * @param passwordEncoder مشفر كلمات المرور لتأمين كلمات المرور
     */
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * تسجيل مستخدم جديد
     * @param email البريد الإلكتروني للمستخدم
     * @param password كلمة المرور (سيتم تشفيرها)
     * @param name اسم المستخدم
     * @return كائن المستخدم المسجل
     * @throws RuntimeException إذا كان البريد الإلكتروني مستخدم بالفعل
     */
    @Transactional
    public User register(String email, String password, String name) {
        synchronized (this) {
            if (userRepository.findByEmail(email).isPresent()) {
                throw new RuntimeException("البريد الإلكتروني مستخدم بالفعل");
            }

            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            
            return userRepository.save(user);
        }
    }

    /**
     * تسجيل دخول المستخدم
     * @param email البريد الإلكتروني
     * @param password كلمة المرور
     * @return خريطة تحتوي على رمز JWT وبيانات المستخدم
     * @throws RuntimeException إذا كانت بيانات الدخول غير صحيحة
     */
    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("البريد الإلكتروني أو كلمة المرور غير صحيحة"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        String token = generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail()
        ));
        
        return response;
    }

    /**
     * إنشاء رمز JWT للمستخدم
     * @param user المستخدم المراد إنشاء رمز له
     * @return رمز JWT
     */
    private String generateToken(User user) {
        return Jwts.builder()
            .setSubject(user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 ساعة
            .signWith(key)
            .compact();
    }

    /**
     * التحقق من صحة رمز JWT
     * @param token رمز JWT المراد التحقق منه
     * @return كائن المستخدم إذا كان الرمز صحيح
     * @throws RuntimeException إذا كان الرمز غير صالح أو المستخدم غير موجود
     */
    public User validateToken(String token) {
        try {
            String email = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

            return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("المستخدم غير موجود"));
        } catch (Exception e) {
            throw new RuntimeException("رمز الدخول غير صالح");
        }
    }
} 