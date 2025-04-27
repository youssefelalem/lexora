package com.version0.lexora.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for Depense entity
 */
public class DepenseDTO {
    
    private Long idDepense;
    private String titre;
    private Long dossierId;
    private String dossierReference; // Reference number of the dossier
    private String dossierTitre; // Title of the dossier
    private BigDecimal montant;
    private String devise;
    private String categorie;
    private LocalDate dateDepense;
    private String description;
    private String statut;
    private LocalDate dateCreation;
    private String beneficiaire;
    private String factureReference;
    private Boolean remboursable;
    private Long utilisateurCreationId;
    private String utilisateurCreationNom; // Name of the user who created the expense
    private String cheminJustificatif; // Path to expense receipt or justification document
    
    // Constructors
    public DepenseDTO() {}
    
    // Getters and Setters
    public Long getIdDepense() {
        return idDepense;
    }

    public void setIdDepense(Long idDepense) {
        this.idDepense = idDepense;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
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

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public LocalDate getDateDepense() {
        return dateDepense;
    }

    public void setDateDepense(LocalDate dateDepense) {
        this.dateDepense = dateDepense;
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

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getBeneficiaire() {
        return beneficiaire;
    }

    public void setBeneficiaire(String beneficiaire) {
        this.beneficiaire = beneficiaire;
    }

    public String getFactureReference() {
        return factureReference;
    }

    public void setFactureReference(String factureReference) {
        this.factureReference = factureReference;
    }

    public Boolean getRemboursable() {
        return remboursable;
    }

    public void setRemboursable(Boolean remboursable) {
        this.remboursable = remboursable;
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