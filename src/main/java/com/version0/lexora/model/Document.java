package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "documents", indexes = {
    @Index(name = "idx_document_nom", columnList = "nom"),
    @Index(name = "idx_document_type", columnList = "type"),
    @Index(name = "idx_document_statut", columnList = "statut")
})
public class Document {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDocument;
    
    @NotBlank(message = "Le nom ne peut pas être vide")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    @Column(nullable = false)
    private String nom;
    
    @NotNull(message = "Le dossier est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dossier", nullable = false)
    private Dossier dossier;
    
    @NotBlank(message = "Le type est obligatoire")
    @Column(nullable = false)
    private String type; // عريضة، مذكرة، حكم، عقد، وثيقة رسمية، أخرى
    
    @NotBlank(message = "Le chemin du fichier ne peut pas être vide")
    @Column(nullable = false, name = "chemin_fichier")
    private String cheminFichier; // path to the actual file in storage
    
    @NotBlank(message = "Le statut est obligatoire")
    @Column(nullable = false)
    private String statut;
    
    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    @Column(name = "date_creation")
    private LocalDate dateCreation;
    
    @PastOrPresent(message = "La date d'ajout ne peut pas être dans le futur")
    @Column(name = "date_ajout")
    private LocalDate dateAjout;
    
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    @Column(length = 500)
    private String description;
    
    @Size(max = 255, message = "Les étiquettes ne peuvent pas dépasser 255 caractères")
    @Column
    private String etiquettes; // comma separated tags
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateurAjout;
    
    // Constructors
    public Document() {
        this.dateAjout = LocalDate.now();
    }
    
    public Document(String nom, Dossier dossier, String type, String cheminFichier, String statut) {
        this.nom = nom;
        this.dossier = dossier;
        this.type = type;
        this.cheminFichier = cheminFichier;
        this.statut = statut;
        this.dateAjout = LocalDate.now();
    }
    
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

    public Dossier getDossier() {
        return dossier;
    }

    public void setDossier(Dossier dossier) {
        this.dossier = dossier;
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

    public Utilisateur getUtilisateurAjout() {
        return utilisateurAjout;
    }

    public void setUtilisateurAjout(Utilisateur utilisateurAjout) {
        this.utilisateurAjout = utilisateurAjout;
    }
}