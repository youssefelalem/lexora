package com.version0.lexora.dto;

/**
 * DTO pour la réponse d'authentification
 */
public class AuthResponse {
    private String token;
    private Long idUtilisateur;
    private String email;
    private String prenom;
    private String nom;
    private String role;
    
    public AuthResponse() {
    }
    
    public AuthResponse(String token, Long idUtilisateur, String email, String prenom, String nom, String role) {
        this.token = token;
        this.idUtilisateur = idUtilisateur;
        this.email = email;
        this.prenom = prenom;
        this.nom = nom;
        this.role = role;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public Long getIdUtilisateur() {
        return idUtilisateur;
    }
    
    public void setIdUtilisateur(Long idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPrenom() {
        return prenom;
    }
    
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}
