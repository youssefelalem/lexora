package com.version0.lexora.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "dossiers", indexes = {
    @Index(name = "idx_dossier_reference", columnList = "reference"),
    @Index(name = "idx_dossier_type", columnList = "type"),
    @Index(name = "idx_dossier_statut", columnList = "statut"),
    @Index(name = "idx_dossier_priorite", columnList = "priorite")
})
public class Dossier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDossier;
    
    @NotBlank(message = "La référence ne peut pas être vide")
    @Pattern(regexp = "^C-\\d{4}-\\d{3}$", message = "La référence doit être au format C-YYYY-XXX")
    @Column(nullable = false, unique = true)
    private String reference; // C-2024-001 format
    
    @NotBlank(message = "Le titre ne peut pas être vide")
    @Size(min = 3, max = 100, message = "Le titre doit contenir entre 3 et 100 caractères")
    @Column(nullable = false)
    private String titre;
    
    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    @Column(length = 2000)
    private String description;
    
    @NotNull(message = "Le client est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client", nullable = false)
    private Client client;
    
    @NotBlank(message = "Le type de dossier est obligatoire")
    @Column(nullable = false)
    private String type; // عقاري، مدني، تجاري، أحوال شخصية، ملكية فكرية، إداري، عمالي
    
    @NotBlank(message = "Le tribunal est obligatoire")
    @Column(nullable = false)
    private String tribunal;
    
    @NotBlank(message = "L'avocat responsable est obligatoire")
    @Column(nullable = false)
    private String avocat;
    
    @Column(name = "fichier_numero")
    private String fichierNumero;
    
    @Column(name = "juge_id")
    private String jugeId;
    
    @Column(name = "partie_adverse")
    private String partieAdverse;
    
    @Column(name = "avocat_adverse")
    private String avocatAdverse;
    
    @NotBlank(message = "Le statut est obligatoire")
    @Column(nullable = false)
    private String statut; // جارية، معلقة، مؤجلة، مغلقة
    
    @NotBlank(message = "La priorité est obligatoire")
    @Column(nullable = false)
    private String priorite; // عالية، متوسطة، منخفضة
    
    @PastOrPresent(message = "La date initiale ne peut pas être dans le futur")
    @Column(name = "date_initiale")
    private LocalDate dateInitiale;
    
    @PastOrPresent(message = "La date de création ne peut pas être dans le futur")
    @Column(name = "date_creation")
    private LocalDate dateCreation;
    
    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Session> sessions = new HashSet<>();
    
    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Document> documents = new HashSet<>();
    
    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Facture> factures = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur")
    @JsonBackReference
    private Utilisateur utilisateurResponsable;
    
    // Constructors
    public Dossier() {
        this.dateCreation = LocalDate.now();
    }
    
    public Dossier(String reference, String titre, Client client, String type, String tribunal, 
                   String avocat, String statut, String priorite) {
        this.reference = reference;
        this.titre = titre;
        this.client = client;
        this.type = type;
        this.tribunal = tribunal;
        this.avocat = avocat;
        this.statut = statut;
        this.priorite = priorite;
        this.dateCreation = LocalDate.now();
        this.dateInitiale = LocalDate.now();
    }

    // Getters and Setters
    public Long getIdDossier() {
        return idDossier;
    }

    public void setIdDossier(Long idDossier) {
        this.idDossier = idDossier;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTribunal() {
        return tribunal;
    }

    public void setTribunal(String tribunal) {
        this.tribunal = tribunal;
    }

    public String getAvocat() {
        return avocat;
    }

    public void setAvocat(String avocat) {
        this.avocat = avocat;
    }

    public String getFichierNumero() {
        return fichierNumero;
    }

    public void setFichierNumero(String fichierNumero) {
        this.fichierNumero = fichierNumero;
    }

    public String getJugeId() {
        return jugeId;
    }

    public void setJugeId(String jugeId) {
        this.jugeId = jugeId;
    }

    public String getPartieAdverse() {
        return partieAdverse;
    }

    public void setPartieAdverse(String partieAdverse) {
        this.partieAdverse = partieAdverse;
    }

    public String getAvocatAdverse() {
        return avocatAdverse;
    }

    public void setAvocatAdverse(String avocatAdverse) {
        this.avocatAdverse = avocatAdverse;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getPriorite() {
        return priorite;
    }

    public void setPriorite(String priorite) {
        this.priorite = priorite;
    }

    public LocalDate getDateInitiale() {
        return dateInitiale;
    }

    public void setDateInitiale(LocalDate dateInitiale) {
        this.dateInitiale = dateInitiale;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }
    
    public Set<Session> getSessions() {
        return sessions;
    }
    
    public void setSessions(Set<Session> sessions) {
        this.sessions = sessions;
    }
    
    // Helper methods for managing sessions
    public void addSession(Session session) {
        sessions.add(session);
        session.setDossier(this);
    }
    
    public void removeSession(Session session) {
        sessions.remove(session);
        session.setDossier(null);
    }
    
    public Set<Document> getDocuments() {
        return documents;
    }
    
    public void setDocuments(Set<Document> documents) {
        this.documents = documents;
    }
    
    // Helper methods for managing documents
    public void addDocument(Document document) {
        documents.add(document);
        document.setDossier(this);
    }
    
    public void removeDocument(Document document) {
        documents.remove(document);
        document.setDossier(null);
    }
    
    // Helper methods for managing factures
    public void addFacture(Facture facture) {
        factures.add(facture);
        facture.setDossier(this);
    }
    
    public void removeFacture(Facture facture) {
        factures.remove(facture);
        facture.setDossier(null);
    }
    
    public Set<Facture> getFactures() {
        return factures;
    }
    
    public void setFactures(Set<Facture> factures) {
        this.factures = factures;
    }
    
    public Utilisateur getUtilisateurResponsable() {
        return utilisateurResponsable;
    }
    
    public void setUtilisateurResponsable(Utilisateur utilisateurResponsable) {
        this.utilisateurResponsable = utilisateurResponsable;
    }
}