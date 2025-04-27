package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entity representing audit logs for tracking user actions in the system.
 * This helps maintain a complete history of important activities for compliance,
 * security, and troubleshooting purposes.
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_entite", columnList = "entite"),
    @Index(name = "idx_audit_utilisateur", columnList = "id_utilisateur"),
    @Index(name = "idx_audit_date_action", columnList = "date_action")
})
public class Audit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAudit;
    
    @NotBlank(message = "L'action ne peut pas être vide")
    @Column(nullable = false)
    private String action; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
    
    @NotBlank(message = "L'entité ne peut pas être vide")
    @Column(nullable = false)
    private String entite; // DOSSIER, CLIENT, FACTURE, UTILISATEUR, etc.
    
    @Column(name = "id_entite", nullable = false)
    private Long idEntite; // The ID of the affected entity
    
    @Column(name = "details_avant", columnDefinition = "TEXT")
    private String detailsAvant; // JSON representation of entity before change
    
    @Column(name = "details_apres", columnDefinition = "TEXT")
    private String detailsApres; // JSON representation of entity after change
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur; // User who performed the action
    
    @NotNull(message = "La date d'action est obligatoire")
    @Column(name = "date_action", nullable = false)
    private LocalDateTime dateAction;
    
    @Column(nullable = false, length = 45)
    private String ipAdresse;
    
    @Column(length = 255)
    private String navigateur; // User-Agent information
    
    @Column(name = "description", length = 500)
    private String description; // Human-readable description of the action
    
    @Column(name = "statut", length = 20)
    private String statut; // SUCCESS, FAILURE, etc.
    
    // Constructors
    public Audit() {
        this.dateAction = LocalDateTime.now();
    }
    
    public Audit(String action, String entite, Long idEntite, Utilisateur utilisateur, String ipAdresse) {
        this.action = action;
        this.entite = entite;
        this.idEntite = idEntite;
        this.utilisateur = utilisateur;
        this.ipAdresse = ipAdresse;
        this.dateAction = LocalDateTime.now();
        this.statut = "SUCCESS";
    }
    
    // Getters and Setters
    public Long getIdAudit() {
        return idAudit;
    }

    public void setIdAudit(Long idAudit) {
        this.idAudit = idAudit;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntite() {
        return entite;
    }

    public void setEntite(String entite) {
        this.entite = entite;
    }

    public Long getIdEntite() {
        return idEntite;
    }

    public void setIdEntite(Long idEntite) {
        this.idEntite = idEntite;
    }

    public String getDetailsAvant() {
        return detailsAvant;
    }

    public void setDetailsAvant(String detailsAvant) {
        this.detailsAvant = detailsAvant;
    }

    public String getDetailsApres() {
        return detailsApres;
    }

    public void setDetailsApres(String detailsApres) {
        this.detailsApres = detailsApres;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public LocalDateTime getDateAction() {
        return dateAction;
    }

    public void setDateAction(LocalDateTime dateAction) {
        this.dateAction = dateAction;
    }

    public String getIpAdresse() {
        return ipAdresse;
    }

    public void setIpAdresse(String ipAdresse) {
        this.ipAdresse = ipAdresse;
    }

    public String getNavigateur() {
        return navigateur;
    }

    public void setNavigateur(String navigateur) {
        this.navigateur = navigateur;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
    
    @Override
    public String toString() {
        return "Audit{" +
               "idAudit=" + idAudit +
               ", action='" + action + '\'' +
               ", entite='" + entite + '\'' +
               ", idEntite=" + idEntite +
               ", utilisateur=" + (utilisateur != null ? utilisateur.getNomComplet() : "System") +
               ", dateAction=" + dateAction +
               ", statut='" + statut + '\'' +
               '}';
    }
}