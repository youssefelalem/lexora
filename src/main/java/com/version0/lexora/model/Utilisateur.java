package com.version0.lexora.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "utilisateurs", indexes = {
    @Index(name = "idx_utilisateur_email", columnList = "email"),
    @Index(name = "idx_utilisateur_role", columnList = "role"),
    @Index(name = "idx_utilisateur_est_active", columnList = "est_active")
})
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;

    @NotBlank(message = "Le prénom ne peut pas être vide")
    @Size(min = 2, max = 50, message = "Le prénom doit contenir entre 2 et 50 caractères")
    @Column(nullable = false)
    private String prenom;
    
    @NotBlank(message = "Le nom ne peut pas être vide")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    @Column(nullable = false)
    private String nom;
    
    @Pattern(regexp = "^[+]?[0-9\\s-]{8,15}$", message = "Format de téléphone invalide")
    @Column(nullable = true)
    private String telephone;

    @NotBlank(message = "L'email ne peut pas être vide")
    @Email(message = "Format d'email invalide")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @Column(nullable = false)
    private String motDePasseHash;
    
    @Column(name = "token_reinitialisation")
    private String tokenReinitialisation;
    
    @Column(name = "expiration_token")
    private LocalDateTime expirationToken;
    
    @NotNull(message = "Le statut du compte est obligatoire")
    @Column(nullable = false, name = "est_active")
    private Boolean estActive = true;
    
    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    @Column(name = "date_creation")
    private LocalDateTime dateCreation;
    
    @Column(name = "derniere_connexion")
    private LocalDateTime derniereConnexion;
    
    @PositiveOrZero(message = "Les tentatives de connexion doivent être positives ou zéro")
    @Column(name = "tentatives_connexion")
    private Integer tentativesConnexion = 0;

    @NotNull(message = "Le rôle est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column
    private String avatar;
    
    @Column(length = 200)
    private String adresse;
    
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    
    @OneToMany(mappedBy = "utilisateurResponsable")
    @JsonManagedReference
    private Set<Dossier> dossiersResponsable = new HashSet<>();
    
    @Column(name = "preferences_json", columnDefinition = "TEXT")
    private String preferencesJson; // JSON string to store user preferences

    // Constructors
    public Utilisateur() {
        this.dateCreation = LocalDateTime.now();
    }

    public Utilisateur(String prenom, String nom, String email, String motDePasseHash, Role role) {
        this.prenom = prenom;
        this.nom = nom;
        this.email = email;
        this.motDePasseHash = motDePasseHash;
        this.role = role;
        this.estActive = true;
        this.dateCreation = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(Long idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
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
    
    public String getTelephone() {
        return telephone;
    }
    
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasseHash() {
        return motDePasseHash;
    }

    public void setMotDePasseHash(String motDePasseHash) {
        this.motDePasseHash = motDePasseHash;
    }
    
    public String getTokenReinitialisation() {
        return tokenReinitialisation;
    }
    
    public void setTokenReinitialisation(String tokenReinitialisation) {
        this.tokenReinitialisation = tokenReinitialisation;
    }
    
    public LocalDateTime getExpirationToken() {
        return expirationToken;
    }
    
    public void setExpirationToken(LocalDateTime expirationToken) {
        this.expirationToken = expirationToken;
    }

    public Boolean getEstActive() {
        return estActive;
    }

    public void setEstActive(Boolean estActive) {
        this.estActive = estActive;
    }
    
    public LocalDateTime getDateCreation() {
        return dateCreation;
    }
    
    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
    
    public LocalDateTime getDerniereConnexion() {
        return derniereConnexion;
    }
    
    public void setDerniereConnexion(LocalDateTime derniereConnexion) {
        this.derniereConnexion = derniereConnexion;
    }
    
    public Integer getTentativesConnexion() {
        return tentativesConnexion;
    }
    
    public void setTentativesConnexion(Integer tentativesConnexion) {
        this.tentativesConnexion = tentativesConnexion;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    
    public String getAvatar() {
        return avatar;
    }
    
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    
    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }
    
    public Set<Dossier> getDossiersResponsable() {
        return dossiersResponsable;
    }

    public void setDossiersResponsable(Set<Dossier> dossiersResponsable) {
        this.dossiersResponsable = dossiersResponsable;
    }
    
    public String getPreferencesJson() {
        return preferencesJson;
    }

    public void setPreferencesJson(String preferencesJson) {
        this.preferencesJson = preferencesJson;
    }
    
    // Utility methods
    
    /**
     * Obtient le nom complet de l'utilisateur
     * @return Le prénom et le nom combinés
     */
    public String getNomComplet() {
        return this.prenom + " " + this.nom;
    }
    
    /**
     * Génère un token pour la réinitialisation du mot de passe
     * @param expirationHeures Nombre d'heures avant expiration
     * @return Le token généré
     */
    public String genererTokenReinitialisation(int expirationHeures) {
        this.tokenReinitialisation = UUID.randomUUID().toString();
        this.expirationToken = LocalDateTime.now().plusHours(expirationHeures);
        return this.tokenReinitialisation;
    }
    
    /**
     * Vérifie si un token de réinitialisation est valide
     * @param token Le token à vérifier
     * @return true si le token est valide et non expiré
     */
    public boolean verifierTokenReinitialisation(String token) {
        return token != null && 
               token.equals(this.tokenReinitialisation) && 
               LocalDateTime.now().isBefore(this.expirationToken);
    }
    
    /**
     * Incrémente le compteur des tentatives de connexion échouées
     */
    public void incrementerTentativesConnexion() {
        this.tentativesConnexion++;
    }
    
    /**
     * Réinitialise le compteur des tentatives de connexion
     */
    public void reinitialiserTentativesConnexion() {
        this.tentativesConnexion = 0;
    }
    
    /**
     * Vérifie si le compte est verrouillé en raison de trop de tentatives de connexion
     * @param maxTentatives Le nombre maximum de tentatives autorisées
     * @return true si le compte doit être considéré comme verrouillé
     */
    public boolean estCompteVerrouille(int maxTentatives) {
        return this.tentativesConnexion >= maxTentatives;
    }
    
    /**
     * Met à jour le timestamp de dernière connexion
     */
    public void mettreAJourDerniereConnexion() {
        this.derniereConnexion = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Utilisateur{" +
               "idUtilisateur=" + idUtilisateur +
               ", prenom='" + prenom + '\'' +
               ", nom='" + nom + '\'' +
               ", email='" + email + '\'' +
               ", role=" + role +
               ", estActive=" + estActive +
               '}';
    }
}