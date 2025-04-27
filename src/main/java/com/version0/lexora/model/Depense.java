package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "depenses", indexes = {
    @Index(name = "idx_depense_categorie", columnList = "categorie"),
    @Index(name = "idx_depense_statut", columnList = "statut"),
    @Index(name = "idx_depense_date", columnList = "date_depense")
})
public class Depense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDepense;
    
    @NotBlank(message = "Le titre ne peut pas être vide")
    @Size(min = 2, max = 100, message = "Le titre doit contenir entre 2 et 100 caractères")
    @Column(nullable = false)
    private String titre;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dossier")
    private Dossier dossier;
    
    @NotNull(message = "Le montant est obligatoire")
    @PositiveOrZero(message = "Le montant doit être positif ou zéro")
    @Column(nullable = false)
    private BigDecimal montant;
    
    @NotBlank(message = "La devise est obligatoire")
    @Size(max = 10, message = "La devise ne peut pas dépasser 10 caractères")
    @Column(nullable = false)
    private String devise; // dirham, euro, dollar, etc.
    
    @NotBlank(message = "La catégorie est obligatoire")
    @Column(nullable = false)
    private String categorie; // frais de déplacement, frais de justice, honoraire d'expert, etc.
    
    @NotNull(message = "La date de dépense est obligatoire")
    @PastOrPresent(message = "La date de dépense ne peut pas être dans le futur")
    @Column(name = "date_depense", nullable = false)
    private LocalDate dateDepense;
    
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    @Column(length = 500)
    private String description;
    
    @NotBlank(message = "Le statut est obligatoire")
    @Column(nullable = false)
    private String statut; // en attente, approuvée, remboursée, rejetée
    
    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    @Column(name = "date_creation")
    private LocalDate dateCreation;
    
    @Size(max = 100, message = "Le bénéficiaire ne peut pas dépasser 100 caractères")
    @Column
    private String beneficiaire; // Who received the payment
    
    @Size(max = 50, message = "La référence facture ne peut pas dépasser 50 caractères")
    @Column(name = "facture_reference")
    private String factureReference; // Reference to an external invoice
    
    @Column
    private Boolean remboursable;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateurCreation;
    
    @Column(name = "chemin_justificatif")
    private String cheminJustificatif; // path to expense receipt or justification document
    
    // Constructors
    public Depense() {
        this.dateCreation = LocalDate.now();
        this.remboursable = Boolean.FALSE;
    }
    
    public Depense(String titre, Dossier dossier, BigDecimal montant, String devise, 
                   String categorie, LocalDate dateDepense, String statut) {
        this.titre = titre;
        this.dossier = dossier;
        this.montant = montant;
        this.devise = devise;
        this.categorie = categorie;
        this.dateDepense = dateDepense;
        this.statut = statut;
        this.dateCreation = LocalDate.now();
        this.remboursable = Boolean.FALSE;
    }
    
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

    public Dossier getDossier() {
        return dossier;
    }

    public void setDossier(Dossier dossier) {
        this.dossier = dossier;
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

    public Utilisateur getUtilisateurCreation() {
        return utilisateurCreation;
    }

    public void setUtilisateurCreation(Utilisateur utilisateurCreation) {
        this.utilisateurCreation = utilisateurCreation;
    }
    
    public String getCheminJustificatif() {
        return cheminJustificatif;
    }

    public void setCheminJustificatif(String cheminJustificatif) {
        this.cheminJustificatif = cheminJustificatif;
    }
}