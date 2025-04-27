package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "paiements", indexes = {
    @Index(name = "idx_paiement_methode", columnList = "methode"),
    @Index(name = "idx_paiement_statut", columnList = "statut"),
    @Index(name = "idx_paiement_date", columnList = "date_paiement")
})
public class Paiement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPaiement;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client")
    private Client client;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dossier")
    private Dossier dossier;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_facture")
    private Facture facture;
    
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    @Column(nullable = false)
    private BigDecimal montant;
    
    @NotBlank(message = "La devise est obligatoire")
    @Size(max = 10, message = "La devise ne peut pas dépasser 10 caractères")
    @Column(nullable = false)
    private String devise; // dirham, euro, dollar, etc.
    
    @NotBlank(message = "La méthode est obligatoire")
    @Column(nullable = false)
    private String methode; // espèce, virement, chèque...
    
    @NotNull(message = "La date de paiement est obligatoire")
    @PastOrPresent(message = "La date de paiement ne peut pas être dans le futur")
    @Column(name = "date_paiement", nullable = false)
    private LocalDate datePaiement;
    
    @Size(max = 50, message = "Le numéro de référence ne peut pas dépasser 50 caractères")
    @Column(name = "numero_reference")
    private String numeroReference; // For check or bank transfer
    
    @Size(max = 100, message = "La référence banque ne peut pas dépasser 100 caractères")
    @Column(name = "banque_reference")
    private String banqueReference;
    
    @Size(max = 500, message = "Les notes ne peuvent pas dépasser 500 caractères")
    @Column(length = 500)
    private String notes;
    
    @NotBlank(message = "Le statut est obligatoire")
    @Column(nullable = false)
    private String statut; // validé, en attente, refusé
    
    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    @Column(name = "date_creation")
    private LocalDate dateCreation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateurCreation;
    
    @Column(name = "chemin_justificatif")
    private String cheminJustificatif; // Path to payment proof document
    
    // Constructors
    public Paiement() {
        this.dateCreation = LocalDate.now();
    }
    
    public Paiement(Client client, Dossier dossier, BigDecimal montant, String devise, 
                    String methode, LocalDate datePaiement, String statut) {
        this.client = client;
        this.dossier = dossier;
        this.montant = montant;
        this.devise = devise;
        this.methode = methode;
        this.datePaiement = datePaiement;
        this.statut = statut;
        this.dateCreation = LocalDate.now();
    }
    
    // Getters and Setters
    public Long getIdPaiement() {
        return idPaiement;
    }

    public void setIdPaiement(Long idPaiement) {
        this.idPaiement = idPaiement;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Dossier getDossier() {
        return dossier;
    }

    public void setDossier(Dossier dossier) {
        this.dossier = dossier;
    }

    public Facture getFacture() {
        return facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
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