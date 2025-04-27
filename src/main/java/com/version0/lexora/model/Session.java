package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "sessions", indexes = {
    @Index(name = "idx_session_date", columnList = "date"),
    @Index(name = "idx_session_statut", columnList = "statut"),
    @Index(name = "idx_session_tribunal", columnList = "tribunal")
})
public class Session {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSession;
    
    @NotNull(message = "Le dossier est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dossier", nullable = false)
    private Dossier dossier;
    
    @NotNull(message = "La date est obligatoire")
    @Column(nullable = false)
    private LocalDate date;
    
    @NotNull(message = "L'heure est obligatoire")
    @Column(nullable = false)
    private LocalTime heure;
    
    @NotBlank(message = "La salle ne peut pas être vide")
    @Size(max = 50, message = "La salle ne peut pas dépasser 50 caractères")
    @Column(nullable = false)
    private String salle;
    
    @NotBlank(message = "Le tribunal est obligatoire")
    @Size(max = 100, message = "Le tribunal ne peut pas dépasser 100 caractères")
    @Column(nullable = false)
    private String tribunal;
    
    @NotBlank(message = "Le statut est obligatoire")
    @Column(nullable = false)
    private String statut; // مكتملة، مؤجلة، قادمة، ملغية
    
    @Size(max = 1000, message = "Les notes ne peuvent pas dépasser 1000 caractères")
    @Column(length = 1000)
    private String notes;
    
    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    @Column(name = "date_creation")
    private LocalDate dateCreation;
    
    @Size(max = 500, message = "Le résultat de la session ne peut pas dépasser 500 caractères")
    @Column(name = "resultat_session", length = 500)
    private String resultatSession;
    
    @Size(max = 500, message = "La prochaine étape ne peut pas dépasser 500 caractères")
    @Column(name = "prochaine_etape", length = 500)
    private String prochaineEtape;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateurResponsable;
    
    // Constructors
    public Session() {
        this.dateCreation = LocalDate.now();
    }
    
    public Session(Dossier dossier, LocalDate date, LocalTime heure, String salle,
                   String tribunal, String statut) {
        this.dossier = dossier;
        this.date = date;
        this.heure = heure;
        this.salle = salle;
        this.tribunal = tribunal;
        this.statut = statut;
        this.dateCreation = LocalDate.now();
    }
    
    // Getters and Setters
    public Long getIdSession() {
        return idSession;
    }

    public void setIdSession(Long idSession) {
        this.idSession = idSession;
    }

    public Dossier getDossier() {
        return dossier;
    }

    public void setDossier(Dossier dossier) {
        this.dossier = dossier;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getHeure() {
        return heure;
    }

    public void setHeure(LocalTime heure) {
        this.heure = heure;
    }

    public String getSalle() {
        return salle;
    }

    public void setSalle(String salle) {
        this.salle = salle;
    }

    public String getTribunal() {
        return tribunal;
    }

    public void setTribunal(String tribunal) {
        this.tribunal = tribunal;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getResultatSession() {
        return resultatSession;
    }

    public void setResultatSession(String resultatSession) {
        this.resultatSession = resultatSession;
    }

    public String getProchaineEtape() {
        return prochaineEtape;
    }

    public void setProchaineEtape(String prochaineEtape) {
        this.prochaineEtape = prochaineEtape;
    }

    public Utilisateur getUtilisateurResponsable() {
        return utilisateurResponsable;
    }

    public void setUtilisateurResponsable(Utilisateur utilisateurResponsable) {
        this.utilisateurResponsable = utilisateurResponsable;
    }
}