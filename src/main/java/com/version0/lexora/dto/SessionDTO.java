package com.version0.lexora.dto;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Data Transfer Object for Session entity
 */
public class SessionDTO {
    
    private Long idSession;
    private Long dossierId;
    private String dossierReference; // Reference number of the dossier
    private String dossierTitre; // Title of the dossier
    private LocalDate date;
    private LocalTime heure;
    private String salle;
    private String tribunal;
    private String statut;
    private String notes;
    private LocalDate dateCreation;
    private String resultatSession;
    private String prochaineEtape;
    private Long utilisateurResponsableId;
    private String utilisateurResponsableNom; // Name of the responsible user
    
    // Constructors
    public SessionDTO() {}
    
    // Getters and Setters
    public Long getIdSession() {
        return idSession;
    }

    public void setIdSession(Long idSession) {
        this.idSession = idSession;
    }

    public Long getDossierId() {
        return dossierId;
    }

    public void setDossierId(Long dossierId) {
        this.dossierId = dossierId;
    }

    public String getDossierReference() {
        return dossierReference;
    }

    public void setDossierReference(String dossierReference) {
        this.dossierReference = dossierReference;
    }

    public String getDossierTitre() {
        return dossierTitre;
    }

    public void setDossierTitre(String dossierTitre) {
        this.dossierTitre = dossierTitre;
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

    public Long getUtilisateurResponsableId() {
        return utilisateurResponsableId;
    }

    public void setUtilisateurResponsableId(Long utilisateurResponsableId) {
        this.utilisateurResponsableId = utilisateurResponsableId;
    }

    public String getUtilisateurResponsableNom() {
        return utilisateurResponsableNom;
    }

    public void setUtilisateurResponsableNom(String utilisateurResponsableNom) {
        this.utilisateurResponsableNom = utilisateurResponsableNom;
    }
}