package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "elements_facture")
public class ElementFacture {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idElement;
    
    @NotNull(message = "La facture est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_facture", nullable = false)
    private Facture facture;
    
    @NotBlank(message = "La description ne peut pas être vide")
    @Size(min = 2, max = 255, message = "La description doit contenir entre 2 et 255 caractères")
    @Column(nullable = false)
    private String description;
    
    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 1, message = "La quantité doit être au moins 1")
    @Column(nullable = false)
    private Integer quantite;
    
    @NotNull(message = "Le prix unitaire est obligatoire")
    @PositiveOrZero(message = "Le prix unitaire doit être positif ou zéro")
    @Column(nullable = false)
    private BigDecimal prixUnitaire;
    
    @NotNull(message = "Le montant est obligatoire")
    @PositiveOrZero(message = "Le montant doit être positif ou zéro")
    @Column(nullable = false)
    private BigDecimal montant;
    
    @Column(name = "type_service")
    private String typeService; // consultation, représentation, recherche, rédaction, frais d'administration
    
    // Constructors
    public ElementFacture() {}
    
    public ElementFacture(Facture facture, String description, Integer quantite, BigDecimal prixUnitaire) {
        this.facture = facture;
        this.description = description;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        this.calculerMontant();
    }
    
    // Getters and Setters
    public Long getIdElement() {
        return idElement;
    }

    public void setIdElement(Long idElement) {
        this.idElement = idElement;
    }

    public Facture getFacture() {
        return facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
        this.calculerMontant();
    }

    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }

    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
        this.calculerMontant();
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public String getTypeService() {
        return typeService;
    }

    public void setTypeService(String typeService) {
        this.typeService = typeService;
    }
    
    // Helper methods
    private void calculerMontant() {
        this.montant = this.prixUnitaire.multiply(new BigDecimal(this.quantite));
    }
}