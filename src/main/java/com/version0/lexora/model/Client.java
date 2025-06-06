package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "clients", indexes = {
        @Index(name = "idx_client_nom", columnList = "nom"),
        @Index(name = "idx_client_type", columnList = "type"),
        @Index(name = "idx_client_email", columnList = "email")
})
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idClient;

    @NotBlank(message = "Le nom ne peut pas être vide")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    @Column(nullable = false)
    private String nom;

    @Size(max = 100, message = "Le contact ne peut pas dépasser 100 caractères")
    @Column(nullable = true)
    private String contact;
    @Email(message = "Format d'email invalide")
    @Column(nullable = true, unique = true)
    private String email;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^[+]?[0-9\\s-]{8,15}$", message = "Format de téléphone invalide")
    @Column(nullable = false)
    private String telephone;

    @Size(max = 255, message = "L'adresse ne peut pas dépasser 255 caractères")
    @Column(nullable = true)
    private String adresse;

    @NotBlank(message = "Le type de client est obligatoire")
    @Column(nullable = false)
    private String type; // شركة، فرد، مؤسسة، حكومي، شراكة

    @NotBlank(message = "Le statut est obligatoire")
    @Column(nullable = false)
    private String statut = "نشط"; // نشط، غير نشط، معلق

    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Size(max = 2000, message = "Les notes ne peuvent pas dépasser 2000 caractères")
    @Column(nullable = true, length = 2000)
    private String notes;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private Set<Dossier> dossiers = new HashSet<>();

    // Constructors
    public Client() {
    }

    public Client(String nom, String email, String telephone, String type) {
        this.nom = nom;
        this.email = email;
        this.telephone = telephone;
        this.type = type;
        this.dateCreation = LocalDate.now();
    }

    // Getters and Setters
    public Long getIdClient() {
        return idClient;
    }

    public void setIdClient(Long idClient) {
        this.idClient = idClient;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Set<Dossier> getDossiers() {
        return dossiers;
    }

    public void setDossiers(Set<Dossier> dossiers) {
        this.dossiers = dossiers;
    }

    // Helper method to add a dossier
    public void addDossier(Dossier dossier) {
        this.dossiers.add(dossier);
        dossier.setClient(this);
    }

    // Helper method to remove a dossier
    public void removeDossier(Dossier dossier) {
        this.dossiers.remove(dossier);
        dossier.setClient(null);
    }
}