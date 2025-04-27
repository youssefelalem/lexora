package com.version0.lexora.dto;

import java.math.BigDecimal;

/**
 * Data Transfer Object for ElementFacture (Invoice Line Item) entity
 */
public class ElementFactureDTO {
    
    private Long idElementFacture;
    private Long factureId;
    private String description;
    private BigDecimal quantite;
    private BigDecimal prixUnitaire;
    private BigDecimal montant;
    private BigDecimal tauxTva;
    private BigDecimal montantTva;
    private BigDecimal montantTotal;
    
    // Constructors
    public ElementFactureDTO() {}
    
    // Getters and Setters
    public Long getIdElementFacture() {
        return idElementFacture;
    }

    public void setIdElementFacture(Long idElementFacture) {
        this.idElementFacture = idElementFacture;
    }

    public Long getFactureId() {
        return factureId;
    }

    public void setFactureId(Long factureId) {
        this.factureId = factureId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getQuantite() {
        return quantite;
    }

    public void setQuantite(BigDecimal quantite) {
        this.quantite = quantite;
    }

    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }

    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public BigDecimal getTauxTva() {
        return tauxTva;
    }

    public void setTauxTva(BigDecimal tauxTva) {
        this.tauxTva = tauxTva;
    }

    public BigDecimal getMontantTva() {
        return montantTva;
    }

    public void setMontantTva(BigDecimal montantTva) {
        this.montantTva = montantTva;
    }

    public BigDecimal getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(BigDecimal montantTotal) {
        this.montantTotal = montantTotal;
    }
}