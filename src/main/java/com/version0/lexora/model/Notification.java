package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entity representing system notifications for users in the Lexora application.
 * Used to notify users about important events like upcoming court sessions,
 * deadline reminders, client interactions, or system updates.
 */
@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notification_utilisateur", columnList = "id_utilisateur"),
    @Index(name = "idx_notification_lu", columnList = "lu"),
    @Index(name = "idx_notification_type", columnList = "type"),
    @Index(name = "idx_notification_date_creation", columnList = "date_creation")
})
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNotification;
    
    @NotBlank(message = "Le titre ne peut pas être vide")
    @Size(min = 2, max = 100, message = "Le titre doit contenir entre 2 et 100 caractères")
    @Column(nullable = false)
    private String titre;
    
    @NotBlank(message = "Le message ne peut pas être vide")
    @Size(max = 500, message = "Le message ne peut pas dépasser 500 caractères")
    @Column(nullable = false, length = 500)
    private String message;
    
    @NotNull(message = "L'utilisateur est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;
    
    @Column(nullable = false)
    private Boolean lu = false;
    
    @NotBlank(message = "Le type de notification est obligatoire")
    @Column(nullable = false)
    private String type; // SYSTEM, SESSION, DOCUMENT, FACTURE, DOSSIER, PAIEMENT, etc.
    
    @Column(nullable = true)
    private String lien; // Optional link to relevant resource (e.g., /dossiers/123)
    
    @NotNull(message = "La date de création est obligatoire")
    @Column(nullable = false, name = "date_creation")
    private LocalDateTime dateCreation;
    
    @Column(name = "date_lecture")
    private LocalDateTime dateLecture;
    
    @Column(nullable = false)
    private Boolean important = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dossier")
    private Dossier dossier; // Optional related case
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client")
    private Client client; // Optional related client
    
    // Constructors
    public Notification() {
        this.dateCreation = LocalDateTime.now();
    }
    
    public Notification(String titre, String message, Utilisateur utilisateur, String type) {
        this.titre = titre;
        this.message = message;
        this.utilisateur = utilisateur;
        this.type = type;
        this.lu = false;
        this.dateCreation = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getIdNotification() {
        return idNotification;
    }

    public void setIdNotification(Long idNotification) {
        this.idNotification = idNotification;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Boolean getLu() {
        return lu;
    }

    public void setLu(Boolean lu) {
        this.lu = lu;
        if (lu && this.dateLecture == null) {
            this.dateLecture = LocalDateTime.now();
        }
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLien() {
        return lien;
    }

    public void setLien(String lien) {
        this.lien = lien;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateLecture() {
        return dateLecture;
    }

    public void setDateLecture(LocalDateTime dateLecture) {
        this.dateLecture = dateLecture;
    }

    public Boolean getImportant() {
        return important;
    }

    public void setImportant(Boolean important) {
        this.important = important;
    }

    public Dossier getDossier() {
        return dossier;
    }

    public void setDossier(Dossier dossier) {
        this.dossier = dossier;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }
    
    /**
     * Mark the notification as read
     */
    public void marquerCommeLu() {
        this.lu = true;
        this.dateLecture = LocalDateTime.now();
    }
    
    /**
     * Mark the notification as unread
     */
    public void marquerCommeNonLu() {
        this.lu = false;
        this.dateLecture = null;
    }
    
    @Override
    public String toString() {
        return "Notification{" +
               "idNotification=" + idNotification +
               ", titre='" + titre + '\'' +
               ", type='" + type + '\'' +
               ", lu=" + lu +
               ", dateCreation=" + dateCreation +
               '}';
    }
}