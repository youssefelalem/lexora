package com.version0.lexora.dto;

import java.time.LocalDate;

/**
 * Data Transfer Object for Client entity
 */
public class ClientDTO {
    
    private Long idClient;
    private String nom;
    private String contact;
    private String email;
    private String telephone;
    private String adresse;
    private String type;
    private String statut;
    private LocalDate dateCreation;
    private String notes;
    private Integer nombreDossiers; // Count of related dossiers
    
    // Constructors
    public ClientDTO() {}
    
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
    
    public Integer getNombreDossiers() {
        return nombreDossiers;
    }
    
    public void setNombreDossiers(Integer nombreDossiers) {
        this.nombreDossiers = nombreDossiers;
    }
}