package com.version0.lexora.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for Paiement entity
 */
public class PaiementDTO {
    
    private Long idPaiement;
    private Long clientId;
    private String clientNom; // Client name for display purposes
    private Long dossierId;
    private String dossierReference; // Reference number of the dossier
    private Long factureId;
    private String factureNumero; // Invoice number
    private BigDecimal montant;
    private String devise;
    private String methode;
    private LocalDate datePaiement;
    private String numeroReference;
    private String banqueReference;
    private String notes;
    private String statut;
    private LocalDate dateCreation;
    private Long utilisateurCreationId;
    private String utilisateurCreationNom; // Name of the user who created the payment
    private String cheminJustificatif; // Path to payment proof document
    
    // Constructors
    public PaiementDTO() {}
    
    // Getters and Setters
    public Long getIdPaiement() {
        return idPaiement;
    }

    public void setIdPaiement(Long idPaiement) {
        this.idPaiement = idPaiement;
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

    public Long getFactureId() {
        return factureId;
    }

    public void setFactureId(Long factureId) {
        this.factureId = factureId;
    }

    public String getFactureNumero() {
        return factureNumero;
    }

    public void setFactureNumero(String factureNumero) {
        this.factureNumero = factureNumero;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public String getDevise() {
        return devise;
    }

    public void setDevise(String devise) {
        this.devise = devise;
    }

    public String getMethode() {
        return methode;
    }

    public void setMethode(String methode) {
        this.methode = methode;
    }

    public LocalDate getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(LocalDate datePaiement) {
        this.datePaiement = datePaiement;
    }

    public String getNumeroReference() {
        return numeroReference;
    }

    public void setNumeroReference(String numeroReference) {
        this.numeroReference = numeroReference;
    }

    public String getBanqueReference() {
        return banqueReference;
    }

    public void setBanqueReference(String banqueReference) {
        this.banqueReference = banqueReference;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public Long getUtilisateurCreationId() {
        return utilisateurCreationId;
    }

    public void setUtilisateurCreationId(Long utilisateurCreationId) {
        this.utilisateurCreationId = utilisateurCreationId;
    }

    public String getUtilisateurCreationNom() {
        return utilisateurCreationNom;
    }

    public void setUtilisateurCreationNom(String utilisateurCreationNom) {
        this.utilisateurCreationNom = utilisateurCreationNom;
    }

    public String getCheminJustificatif() {
        return cheminJustificatif;
    }

    public void setCheminJustificatif(String cheminJustificatif) {
        this.cheminJustificatif = cheminJustificatif;
    }
}