package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "factures", indexes = {
    @Index(name = "idx_facture_numero", columnList = "numero"),
    @Index(name = "idx_facture_statut", columnList = "statut"),
    @Index(name = "idx_facture_date_emission", columnList = "date_emission"),
    @Index(name = "idx_facture_date_echeance", columnList = "date_echeance")
})
public class Facture {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFacture;
    
    @NotBlank(message = "Le numéro de facture ne peut pas être vide")
    @Pattern(regexp = "^INV-\\d{4}-\\d{3}$", message = "Le numéro de facture doit être au format INV-YYYY-XXX")
    @Column(nullable = false, unique = true)
    private String numero; // Invoice number (e.g., INV-2024-001)
    
    @NotNull(message = "Le client est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client", nullable = false)
    private Client client;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dossier")
    private Dossier dossier;
    
    @NotNull(message = "Le montant total est obligatoire")
    @PositiveOrZero(message = "Le montant total doit être positif ou zéro")
    @Column(nullable = false)
    private BigDecimal montantTotal;
    
    @NotNull(message = "Le montant payé est obligatoire")
    @PositiveOrZero(message = "Le montant payé doit être positif ou zéro")
    @Column(nullable = false)
    private BigDecimal montantPaye;
    
    @NotNull(message = "Le montant restant est obligatoire")
    @PositiveOrZero(message = "Le montant restant doit être positif ou zéro")
    @Column(nullable = false)
    private BigDecimal montantRestant;
    
    @NotNull(message = "La TVA est obligatoire")
    @PositiveOrZero(message = "La TVA doit être positive ou zéro")
    @Column(nullable = false)
    private BigDecimal tva; // VAT percentage
    
    @NotBlank(message = "La devise est obligatoire")
    @Size(max = 10, message = "La devise ne peut pas dépasser 10 caractères")
    @Column(nullable = false)
    private String devise; // dirham, euro, dollar, etc.
    
    @NotBlank(message = "Le statut est obligatoire")
    @Column(nullable = false)
    private String statut; // payée, partiellement payée, non payée, annulée
    
    @NotNull(message = "La date d'émission est obligatoire")
    @PastOrPresent(message = "La date d'émission ne peut pas être dans le futur")
    @Column(name = "date_emission", nullable = false)
    private LocalDate dateEmission;
    
    @NotNull(message = "La date d'échéance est obligatoire")
    @Column(name = "date_echeance", nullable = false)
    private LocalDate dateEcheance;
    
    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    @Column(name = "date_creation")
    private LocalDate dateCreation;
    
    @Size(max = 500, message = "Les notes ne peuvent pas dépasser 500 caractères")
    @Column(length = 500)
    private String notes;
    
    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ElementFacture> elements = new HashSet<>();
    
    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL)
    private Set<Paiement> paiements = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateurCreation;
    
    // Constructors
    public Facture() {
        this.montantPaye = BigDecimal.ZERO;
        this.montantRestant = BigDecimal.ZERO;
        this.dateCreation = LocalDate.now();
    }
    
    public Facture(String numero, Client client, BigDecimal montantTotal, 
                  BigDecimal tva, String devise, LocalDate dateEmission, LocalDate dateEcheance) {
        this.numero = numero;
        this.client = client;
        this.montantTotal = montantTotal;
        this.montantPaye = BigDecimal.ZERO;
        this.montantRestant = montantTotal;
        this.tva = tva;
        this.devise = devise;
        this.statut = "non payée";
        this.dateEmission = dateEmission;
        this.dateEcheance = dateEcheance;
        this.dateCreation = LocalDate.now();
    }
    
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

    public BigDecimal getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(BigDecimal montantTotal) {
        this.montantTotal = montantTotal;
        this.calculerMontantRestant();
    }

    public BigDecimal getMontantPaye() {
        return montantPaye;
    }

    public void setMontantPaye(BigDecimal montantPaye) {
        this.montantPaye = montantPaye;
        this.calculerMontantRestant();
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

    public Set<ElementFacture> getElements() {
        return elements;
    }

    public void setElements(Set<ElementFacture> elements) {
        this.elements = elements;
    }
    
    public Set<Paiement> getPaiements() {
        return paiements;
    }
    
    public void setPaiements(Set<Paiement> paiements) {
        this.paiements = paiements;
    }
    
    public Utilisateur getUtilisateurCreation() {
        return utilisateurCreation;
    }

    public void setUtilisateurCreation(Utilisateur utilisateurCreation) {
        this.utilisateurCreation = utilisateurCreation;
    }
    
    // Helper methods
    public void addElement(ElementFacture element) {
        elements.add(element);
        element.setFacture(this);
    }
    
    public void removeElement(ElementFacture element) {
        elements.remove(element);
        element.setFacture(null);
    }
    
    public void addPaiement(Paiement paiement) {
        paiements.add(paiement);
        paiement.setFacture(this);
        this.montantPaye = this.montantPaye.add(paiement.getMontant());
        this.calculerMontantRestant();
        this.mettreAJourStatut();
    }
    
    public void removePaiement(Paiement paiement) {
        paiements.remove(paiement);
        paiement.setFacture(null);
        this.montantPaye = this.montantPaye.subtract(paiement.getMontant());
        this.calculerMontantRestant();
        this.mettreAJourStatut();
    }
    
    private void calculerMontantRestant() {
        this.montantRestant = this.montantTotal.subtract(this.montantPaye);
    }
    
    private void mettreAJourStatut() {
        if (this.montantRestant.compareTo(BigDecimal.ZERO) == 0) {
            this.statut = "payée";
        } else if (this.montantPaye.compareTo(BigDecimal.ZERO) > 0) {
            this.statut = "partiellement payée";
        } else {
            this.statut = "non payée";
        }
    }
}