package com.version0.lexora.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                .requestMatchers("/api/auth/**").permitAll() // السماح بالوصول إلى نقاط نهاية المصادقة
                .anyRequest().authenticated() // تتطلب المصادقة لباقي الطلبات
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
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // السماح بالطلبات من الفرونت إند
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // الطرق المسموح بها
        configuration.setAllowedHeaders(Arrays.asList("*")); // السماح بجميع الرؤوس
        configuration.setAllowCredentials(true); // السماح باعتماد الطلبات

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
