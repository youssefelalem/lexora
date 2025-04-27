package com.version0.lexora.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Data Transfer Object for Facture (Invoice) entity
 */
public class FactureDTO {
    
    private Long idFacture;
    private String numero;
    private Long clientId;
    private String clientNom; // Client name for display purposes
    private Long dossierId;
    private String dossierReference; // Reference number of the dossier
    private BigDecimal montantTotal;
    private BigDecimal montantPaye;
    private BigDecimal montantRestant;
    private BigDecimal tva;
    private String devise;
    private String statut;
    private LocalDate dateEmission;
    private LocalDate dateEcheance;
    private LocalDate dateCreation;
    private String notes;
    private Integer nombrePaiements; // Count of related payments
    private Long utilisateurCreationId;
    private String utilisateurCreationNom; // Name of the user who created the invoice
    private Set<ElementFactureDTO> elements = new HashSet<>();
    
    // Constructors
    public FactureDTO() {}
    
    // Getters and Setters
    public Long getIdFacture() {
        return idFacture;
    }

    public void setIdFacture(Long idFacture) {
        this.idFacture = idFacture;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
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

    public BigDecimal getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(BigDecimal montantTotal) {
        this.montantTotal = montantTotal;
    }

    public BigDecimal getMontantPaye() {
        return montantPaye;
    }

    public void setMontantPaye(BigDecimal montantPaye) {
        this.montantPaye = montantPaye;
    }

    public BigDecimal getMontantRestant() {
        return montantRestant;
    }

    public void setMontantRestant(BigDecimal montantRestant) {
        this.montantRestant = montantRestant;
    }

    public BigDecimal getTva() {
        return tva;
    }

    public void setTva(BigDecimal tva) {
        this.tva = tva;
    }

    public String getDevise() {
        return devise;
    }

    public void setDevise(String devise) {
        this.devise = devise;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDate getDateEmission() {
        return dateEmission;
    }

    public void setDateEmission(LocalDate dateEmission) {
        this.dateEmission = dateEmission;
    }

    public LocalDate getDateEcheance() {
        return dateEcheance;
    }

    public void setDateEcheance(LocalDate dateEcheance) {
        this.dateEcheance = dateEcheance;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Integer getNombrePaiements() {
        return nombrePaiements;
    }

    public void setNombrePaiements(Integer nombrePaiements) {
        this.nombrePaiements = nombrePaiements;
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

    public Set<ElementFactureDTO> getElements() {
        return elements;
    }

    public void setElements(Set<ElementFactureDTO> elements) {
        this.elements = elements;
    }
}