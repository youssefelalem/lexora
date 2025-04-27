package com.version0.lexora.dto;

import java.time.LocalDate;

/**
 * Data Transfer Object for Document entity
 */
public class DocumentDTO {
    
    private Long idDocument;
    private String nom;
    private Long dossierId;
    private String dossierReference; // Reference number of the dossier
    private String type;
    private String cheminFichier;
    private String statut;
    private LocalDate dateCreation;
    private LocalDate dateAjout;
    private String description;
    private String etiquettes;
    private Long utilisateurAjoutId;
    private String utilisateurAjoutNom; // Name of the user who added the document
    
    // Constructors
    public DocumentDTO() {}
    
    // Getters and Setters
    public Long getIdDocument() {
        return idDocument;
    }

    public void setIdDocument(Long idDocument) {
        this.idDocument = idDocument;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCheminFichier() {
        return cheminFichier;
    }

    public void setCheminFichier(String cheminFichier) {
        this.cheminFichier = cheminFichier;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDate getDateAjout() {
        return dateAjout;
    }

    public void setDateAjout(LocalDate dateAjout) {
        this.dateAjout = dateAjout;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEtiquettes() {
        return etiquettes;
    }

    public void setEtiquettes(String etiquettes) {
        this.etiquettes = etiquettes;
    }

    public Long getUtilisateurAjoutId() {
        return utilisateurAjoutId;
    }

    public void setUtilisateurAjoutId(Long utilisateurAjoutId) {
        this.utilisateurAjoutId = utilisateurAjoutId;
    }

    public String getUtilisateurAjoutNom() {
        return utilisateurAjoutNom;
    }

    public void setUtilisateurAjoutNom(String utilisateurAjoutNom) {
        this.utilisateurAjoutNom = utilisateurAjoutNom;
    }
}