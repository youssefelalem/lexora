package com.version0.lexora.model;

import jakarta.persistence.*;

@Entity // Indique que cette classe est une entité JPA, ce qui signifie qu'elle sera mappée à une table dans la base de données.
@Table(name = "utilisateurs") // Spécifie le nom de la table dans la base de données pour cette entité.
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Définit la stratégie d'héritage. SINGLE_TABLE signifie que toutes les classes de la hiérarchie seront stockées dans une seule table.
@DiscriminatorColumn(name="type_utilisateur", discriminatorType = DiscriminatorType.STRING) // Spécifie la colonne utilisée pour différencier les sous-classes dans la stratégie SINGLE_TABLE.
public class Utilisateur {

    @Id // Marque ce champ comme la clé primaire de la table.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configure la manière dont la clé primaire est générée. IDENTITY signifie qu'elle est auto-incrémentée par la base de données.
    private Long idUtilisateur;

    @Column(nullable = false) // Mappe ce champ à une colonne de la table. nullable = false signifie que la colonne ne peut pas être nulle.
    private String nom;

    @Column(unique = true, nullable = false) // unique = true signifie que chaque valeur dans cette colonne doit être unique.
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
@Entity // Bien que l'héritage soit SINGLE_TABLE, cette annotation est souvent conservée pour la clarté ou pour d'éventuelles configurations spécifiques à la sous-classe.
@DiscriminatorValue("SECRETAIRE") // Définit la valeur qui sera stockée dans la colonne discriminante pour les instances de cette sous-classe.
class Secretaire extends Utilisateur {
    // Secretaire specific fields and methods can be added here
    public Secretaire() {
        super();
    }

    public Secretaire(String nom, String email, String motDePasseHash) {
        super(nom, email, motDePasseHash);
    }

    // Example of overriding or adding specific behavior
    @Override // Indique que cette méthode surcharge une méthode de la superclasse (Utilisateur).
    public void modifierProfil() {
        System.out.println("Modifying profile for Secretaire: " + getNom());
        // Add specific logic for Secretaire profile modification
    }
}

// Subclass Avocat
@Entity // Même raison que pour Secretaire.
@DiscriminatorValue("AVOCAT") // Définit la valeur discriminante pour les instances d'Avocat.
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
    @Override // Indique que cette méthode surcharge une méthode de la superclasse.
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