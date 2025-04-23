package com.version0.lexora.model;

import jakarta.persistence.*;

@Entity // Indique que cette classe est une entité JPA, ce qui signifie qu'elle sera mappée à une table dans la base de données.
@Table(name = "utilisateurs") // Spécifie le nom de la table dans la base de données pour cette entité.
public class Utilisateur {

    @Id // Marque ce champ comme la clé primaire de la table.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configure la manière dont la clé primaire est générée. IDENTITY signifie qu'elle est auto-incrémentée par la base de données.
    private Long idUtilisateur;

    @Column(nullable = false) // Mappe ce champ à une colonne de la table. nullable = false signifie que la colonne ne peut pas être nulle.
    private String nom;

    @Column(unique = true, nullable = false) // unique = true signifie que chaque valeur dans cette colonne doit être unique.
    private String email;

    @Column(nullable = false)
    private String motDePasseHash;

    @Column(nullable = false)
    private Boolean estActive = true; // Default to active (true)

    @Enumerated(EnumType.STRING) // Indique à JPA de stocker l'Enum sous forme de chaîne (ADMINISTRATEUR, ASSISTANT_ADMIN)
    @Column(nullable = false) // Le rôle ne peut pas être nul
    private Role role; // Nouveau champ pour le rôle de l'utilisateur

    // Constructors
    public Utilisateur() {}

    // Constructeur mis à jour pour inclure le rôle
    public Utilisateur(String nom, String email, String motDePasseHash, Role role) {
        this.nom = nom;
        this.email = email;
        this.motDePasseHash = motDePasseHash;
        this.role = role; // Initialiser le rôle
        this.estActive = true; // Par défaut, l'utilisateur est actif
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

    // Getter et Setter pour le nouveau champ role
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}