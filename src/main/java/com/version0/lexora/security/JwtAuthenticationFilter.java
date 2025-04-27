package com.version0.lexora.security;

import com.version0.lexora.model.Utilisateur;
import com.version0.lexora.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filtre d'authentification JWT - Intercèpte toutes les requêtes pour vérifier les tokens JWT
 * مرشح مصادقة JWT - يعترض جميع الطلبات للتحقق من رموز JWT
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthService authService;
    private final JwtProperties jwtProperties;

    public JwtAuthenticationFilter(AuthService authService, JwtProperties jwtProperties) {
        this.authService = authService;
        this.jwtProperties = jwtProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Extraire le token de l'en-tête Authorization (Bearer token)
            // استخراج الرمز من رأس التفويض (رمز Bearer)
            String header = request.getHeader(jwtProperties.getHeaderName());
            
            // Si l'en-tête n'existe pas ou ne commence pas par "Bearer ", continuer la chaîne de filtres
            // إذا لم يكن الرأس موجودًا أو لا يبدأ بـ "Bearer"، استمر في سلسلة المرشحات
            if (header == null || !header.startsWith(jwtProperties.getTokenPrefix())) {
                filterChain.doFilter(request, response);
                return;
            }

            // Extraire le token en supprimant le préfixe "Bearer "
            // استخراج الرمز عن طريق إزالة البادئة "Bearer"
            String token = header.substring(jwtProperties.getTokenPrefix().length());
            
            // Valider le token et récupérer l'utilisateur associé
            // تحقق من صحة الرمز واسترداد المستخدم المرتبط
            Utilisateur utilisateur = authService.validateToken(token);
            
            // Si l'utilisateur est trouvé, créer une authentification
            // إذا تم العثور على المستخدم، قم بإنشاء مصادقة
            if (utilisateur != null) {
                // Vérifier si l'utilisateur est actif
                // التحقق مما إذا كان المستخدم نشطًا
                if (!utilisateur.getEstActive()) {
                    // Utilisateur inactif, ne pas authentifier
                    // مستخدم غير نشط، لا تقم بالمصادقة
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "الحساب معطل، يرجى الاتصال بالمسؤول");
                    return;
                }
                
                // Créer des autorisations basées sur le rôle de l'utilisateur
                // إنشاء أذونات استنادًا إلى دور المستخدم
                var authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name())
                );
                
                // Créer un objet d'authentification
                // إنشاء كائن مصادقة
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        utilisateur.getEmail(), null, authorities
                    );
                
                // Définir les détails de l'authentification
                // تعيين تفاصيل المصادقة
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Définir l'authentification dans le contexte de sécurité
                // تعيين المصادقة في سياق الأمان
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Impossible de définir l'authentification de l'utilisateur: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "رمز الدخول غير صالح");
            return;
        }
        
        // Continuer la chaîne de filtres
        // متابعة سلسلة المرشحات
        filterChain.doFilter(request, response);
    }
}