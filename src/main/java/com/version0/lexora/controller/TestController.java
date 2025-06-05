package com.version0.lexora.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de prueba para verificar la autenticación JWT y los niveles de
 * acceso
 * وحدة تحكم اختبار للتحقق من مصادقة JWT ومستويات الوصول
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    /**
     * Endpoint público que no requiere autenticación
     * نقطة نهاية عامة لا تتطلب المصادقة
     */
    @GetMapping("/public")
    public ResponseEntity<Map<String, String>> publicEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "هذه نقطة نهاية عامة لا تتطلب المصادقة");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint que requiere autenticación (cualquier usuario autenticado)
     * نقطة نهاية تتطلب المصادقة (أي مستخدم مصادق عليه)
     */
    @GetMapping("/authenticated")
    public ResponseEntity<Map<String, Object>> authenticatedEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "أنت مصادق عليه بنجاح!");
        response.put("username", authentication.getName());
        response.put("roles", authentication.getAuthorities());
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint que requiere rol de administrador
     * نقطة نهاية تتطلب دور المسؤول
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<Map<String, String>> adminOnly() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "أنت مصادق عليه كمسؤول!");
        response.put("access_level", "مسؤول");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint que requiere rol de abogado
     * نقطة نهاية تتطلب دور المحامي
     */
    @GetMapping("/avocat")
    @PreAuthorize("hasRole('AVOCAT')")
    public ResponseEntity<Map<String, String>> avocatOnly() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "أنت مصادق عليه كمحامي!");
        response.put("access_level", "محامي");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint que requiere múltiples roles
     * نقطة نهاية تتطلب أدوارًا متعددة
     */
    @GetMapping("/multi-role")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AVOCAT', 'ASSISTANT_JURIDIQUE')")
    public ResponseEntity<Map<String, String>> multiRoleAccess() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "لديك وصول إلى هذه النقطة النهائية متعددة الأدوار!");
        response.put("access_level", "متعدد الأدوار");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}