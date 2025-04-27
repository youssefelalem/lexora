package com.version0.lexora.config;

import com.version0.lexora.model.Role;
import com.version0.lexora.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * تكوين الأمان - يحدد إعدادات Spring Security
 * يتضمن تكوين CORS، تشفير كلمات المرور، وقواعد الوصول
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // تمكين الأمان على مستوى الطريقة، مثل @PreAuthorize
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    
    public SecurityConfig(@Lazy JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

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
            // تكوين إدارة الجلسات: STATELESS يعني عدم حفظ حالة الجلسة (مناسب لـ JWT)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // تكوين قواعد التحكم في الوصول لطلبات HTTP
            .authorizeHttpRequests(auth -> auth
                // السماح بالوصول العام لنقاط نهاية المصادقة
                .requestMatchers("/api/auth/**").permitAll()
                // السماح لـ OPTIONS (مهم لـ CORS preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // تكوين الوصول استنادًا إلى الأدوار
                .requestMatchers("/api/admin/**").hasRole(Role.SUPER_ADMIN.name())
                .requestMatchers("/api/avocat/**").hasRole(Role.AVOCAT.name())
                .requestMatchers("/api/clients/**").hasAnyRole(
                    Role.ADMINISTRATEUR.name(), Role.AVOCAT.name(), Role.ASSISTANT_JURIDIQUE.name())
                .requestMatchers("/api/dossiers/**").hasAnyRole(
                    Role.ADMINISTRATEUR.name(), Role.AVOCAT.name(), Role.ASSISTANT_JURIDIQUE.name())
                .requestMatchers("/api/factures/**").hasAnyRole(
                    Role.ADMINISTRATEUR.name(), Role.AVOCAT.name(), Role.COMPTABLE.name())
                .requestMatchers("/api/sessions/**").hasAnyRole(
                    Role.ADMINISTRATEUR.name(), Role.AVOCAT.name(), Role.ASSISTANT_JURIDIQUE.name())
                // أي طلب آخر يتطلب مصادقة
                .anyRequest().authenticated()
            )
            // إضافة مرشح JWT قبل مرشح مصادقة اسم المستخدم وكلمة المرور
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            // إعداد معالجة الأخطاء
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"عذرا، يجب تسجيل الدخول للوصول إلى هذه الصفحة\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"عذرا، ليس لديك الصلاحية للوصول إلى هذا المورد\"}");
                })
            );

        return http.build();
    }

    /**
     * تكوين CORS للسماح بالطلبات من الفرونت إند
     * @return CorsConfigurationSource المكون
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // تعيين أصول محددة بدلاً من "*" للأمان
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://192.168.1.6:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        // السماح بإرسال الاعتمادات مع CORS (مثل ملفات تعريف الارتباط)
        configuration.setAllowCredentials(true);
        // مدة تخزين استجابة preflight في ذاكرة التخزين المؤقت (بالثواني)
        configuration.setMaxAge(3600L);

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
