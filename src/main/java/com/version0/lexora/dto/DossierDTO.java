package com.version0.lexora.dto;

import java.time.LocalDate;

/**
 * Data Transfer Object for Dossier entity
 */
public class DossierDTO {
    
    private Long idDossier;
    private String reference;
    private String titre;
    private String description;
    private Long clientId;
    private String clientNom; // Client name for display purposes
    private String type;
    private String tribunal;
    private String avocat;
    private String fichierNumero;
    private String jugeId;
    private String partieAdverse;
    private String avocatAdverse;
    private String statut;
    private String priorite;
    private LocalDate dateInitiale;
    private LocalDate dateCreation;
    private Integer nombreSessions; // Count of related sessions
    private Integer nombreDocuments; // Count of related documents
    private Integer nombreFactures; // Count of related invoices
    private Long utilisateurResponsableId;
    private String utilisateurResponsableNom; // Name of responsible user
    
    // Constructors
    public DossierDTO() {}
    
    // Getters and Setters
    public Long getIdDossier() {
        return idDossier;
    }

    public void setIdDossier(Long idDossier) {
        this.idDossier = idDossier;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientNom() {
        return clientNom;
    }

    public void setClientNom(String clientNom) {
        this.clientNom = clientNom;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTribunal() {
        return tribunal;
    }

    public void setTribunal(String tribunal) {
        this.tribunal = tribunal;
    }

    public String getAvocat() {
        return avocat;
    }

    public void setAvocat(String avocat) {
        this.avocat = avocat;
    }

    public String getFichierNumero() {
        return fichierNumero;
    }

    public void setFichierNumero(String fichierNumero) {
        this.fichierNumero = fichierNumero;
    }

    public String getJugeId() {
        return jugeId;
    }

    public void setJugeId(String jugeId) {
        this.jugeId = jugeId;
    }

    public String getPartieAdverse() {
        return partieAdverse;
    }

    public void setPartieAdverse(String partieAdverse) {
        this.partieAdverse = partieAdverse;
    }

    public String getAvocatAdverse() {
        return avocatAdverse;
    }

    public void setAvocatAdverse(String avocatAdverse) {
        this.avocatAdverse = avocatAdverse;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getPriorite() {
        return priorite;
    }

    public void setPriorite(String priorite) {
        this.priorite = priorite;
    }

    public LocalDate getDateInitiale() {
        return dateInitiale;
    }

    public void setDateInitiale(LocalDate dateInitiale) {
        this.dateInitiale = dateInitiale;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Integer getNombreSessions() {
        return nombreSessions;
    }

    public void setNombreSessions(Integer nombreSessions) {
        this.nombreSessions = nombreSessions;
    }

    public Integer getNombreDocuments() {
        return nombreDocuments;
    }

    public void setNombreDocuments(Integer nombreDocuments) {
        this.nombreDocuments = nombreDocuments;
    }

    public Integer getNombreFactures() {
        return nombreFactures;
    }

    public void setNombreFactures(Integer nombreFactures) {
        this.nombreFactures = nombreFactures;
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