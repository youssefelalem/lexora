package com.version0.lexora.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Strategy for handling inheritance
@DiscriminatorColumn(name="type_utilisateur", discriminatorType = DiscriminatorType.STRING) // Column to differentiate subclasses
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;

    @Column(nullable = false)
    private String nom;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String motDePasseHash; // Renamed from password

    @Column(nullable = false)
    private Boolean estActive = false; // Default to active

    // Constructors
    public Utilisateur() {}

    public Utilisateur(String nom, String email, String motDePasseHash) {
        this.nom = nom;
        this.email = email;
        this.motDePasseHash = motDePasseHash;
        this.estActive = true;
    }

    // Getters and Setters
    public Long getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(Long idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasseHash() {
        return motDePasseHash;
    }

    public void setMotDePasseHash(String motDePasseHash) {
        this.motDePasseHash = motDePasseHash;
    }

    public Boolean getEstActive() {
        return estActive;
    }

    public void setEstActive(Boolean estActive) {
        this.estActive = estActive;
    }

    // Methods (Implementation depends on application logic)
    public Boolean seConnecter() {
        // Logic for login - typically handled by a service layer with security checks
        System.out.println(this.nom + " is attempting to connect.");
        // Return true/false based on authentication success
        return true; // Placeholder
    }

    public void seDeconnecter() {
        // Logic for logout - typically handled by session management
        System.out.println(this.nom + " is disconnecting.");
        // Invalidate session, etc.
    }

    public void modifierProfil(/* Parameters for profile modification */) {
        // Logic to update user profile information
        System.out.println("Modifying profile for " + this.nom);
        // Update fields and persist changes
    }
}

// Subclass Secretaire
@Entity
@DiscriminatorValue("SECRETAIRE")
class Secretaire extends Utilisateur {
    // Secretaire specific fields and methods can be added here
    public Secretaire() {
        super();
    }

    public Secretaire(String nom, String email, String motDePasseHash) {
        super(nom, email, motDePasseHash);
    }

    // Example of overriding or adding specific behavior
    @Override
    public void modifierProfil() {
        System.out.println("Modifying profile for Secretaire: " + getNom());
        // Add specific logic for Secretaire profile modification
    }
}

// Subclass Avocat
@Entity
@DiscriminatorValue("AVOCAT")
class Avocat extends Utilisateur {
    // Avocat specific fields and methods can be added here

    public Avocat() {
        super();
    }

    // Updated constructor without numeroBarreau
    public Avocat(String nom, String email, String motDePasseHash) {
        super(nom, email, motDePasseHash);
    }

    // Example of overriding or adding specific behavior
    @Override
    public void modifierProfil() {
        System.out.println("Modifying profile for Avocat: " + getNom());
        // Add specific logic for Avocat profile modification
    }

    // New method to create a dossier
    public void creerDossier(/* Parameters for dossier creation */) {
        System.out.println("Avocat " + getNom() + " is creating a new dossier.");
        // Add logic to create a dossier
    }

    // New method to generate a report
    public void genererRapport(/* Parameters for report generation */) {
        System.out.println("Avocat " + getNom() + " is generating a report.");
        // Add logic to generate a report
    }
}