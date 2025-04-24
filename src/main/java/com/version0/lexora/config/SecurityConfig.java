package com.version0.lexora.config;

import com.version0.lexora.model.Role; // استيراد الـ Enum Role
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod; // قم بإلغاء التعليق إذا كنت بحاجة لتحديد طرق HTTP
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

/**
 * تكوين الأمان - يحدد إعدادات Spring Security
 * يتضمن تكوين CORS، تشفير كلمات المرور، وقواعد الوصول
 */
@Configuration
@EnableWebSecurity
// يمكنك إضافة @EnableMethodSecurity هنا إذا أردت استخدام @PreAuthorize في المستقبل
public class SecurityConfig {

    /**
     * تكوين سلسلة المرشحات الأمنية
     * @param http كائن HttpSecurity لتكوين قواعد الأمان
     * @return SecurityFilterChain المكون
     * @throws Exception إذا حدث خطأ في التكوين
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // تكوين CORS
            .csrf(AbstractHttpConfigurer::disable) // تعطيل CSRF للواجهات البرمجية
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // السماح بالوصول العام لنقاط نهاية المصادقة
                // --- إضافة قواعد التحكم في الوصول بناءً على الأدوار ---
                // مثال: نقاط النهاية الخاصة بالمسؤول فقط
                .requestMatchers("/api/admin/**").hasRole(Role.ADMINISTRATEUR.name())
                // مثال: نقاط النهاية التي يمكن للمساعد والمسؤول الوصول إليها
                .requestMatchers("/api/data/**").hasAnyRole(Role.ASSISTANT_ADMIN.name(), Role.ADMINISTRATEUR.name())
                // ----------------------------------------------------
                .anyRequest().authenticated() // أي طلب آخر يتطلب تسجيل الدخول (أي دور)
            );
            // .httpBasic(Customizer.withDefaults()); // Example: Enable HTTP Basic Auth
            // Or configure JWT filter here later

        return http.build();
    }

    /**
     * تكوين CORS للسماح بالطلبات من الفرونت إند
     * @return CorsConfigurationSource المكون
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from any origin during development
        // في مرحلة التطوير، نسمح بالطلبات من أي مصدر
        // Pour le développement, nous autorisons les requêtes de toute origine
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // الطرق المسموح بها
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept",
                "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers")); // السماح بجميع الرؤوس
        configuration.setAllowCredentials(false); // Must be false if allowedOrigins contains "*"

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * تكوين مشفر كلمات المرور
     * @return PasswordEncoder يستخدم خوارزمية BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // استخدام BCrypt لتشفير كلمات المرور
    }
}
