package com.version0.lexora.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Properties for JWT configuration
 * خصائص تكوين JWT
 */
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * Secret key for JWT signatures
     * المفتاح السري لتوقيع رموز JWT
     */
    private String secret = "defaultSecretKeyWhichShouldBeAtLeast64BytesLongForSecurity";
    
    /**
     * Expiration time in milliseconds (default: 24 hours)
     * وقت انتهاء الصلاحية بالميلي ثانية (الافتراضي: 24 ساعة)
     */
    private long expiration = 86400000L;
    
    /**
     * Token prefix (default: "Bearer ")
     * بادئة الرمز (الافتراضية: "Bearer ")
     */
    private String tokenPrefix = "Bearer ";
    
    /**
     * Header where the token is found (default: "Authorization")
     * الرأس الذي يوجد فيه الرمز (الافتراضي: "Authorization")
     */
    private String headerName = "Authorization";
    
    /**
     * Path of authentication endpoints (default: "/api/auth/**")
     * مسار نقاط نهاية المصادقة (الافتراضي: "/api/auth/**")
     */
    private String authEndpoint = "/api/auth/**";

    // Getters and Setters
    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public String getTokenPrefix() {
        return tokenPrefix;
    }

    public void setTokenPrefix(String tokenPrefix) {
        this.tokenPrefix = tokenPrefix;
    }

    public String getHeaderName() {
        return headerName;
    }

    public void setHeaderName(String headerName) {
        this.headerName = headerName;
    }

    public String getAuthEndpoint() {
        return authEndpoint;
    }

    public void setAuthEndpoint(String authEndpoint) {
        this.authEndpoint = authEndpoint;
    }
}