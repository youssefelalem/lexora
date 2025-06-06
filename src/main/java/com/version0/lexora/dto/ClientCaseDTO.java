package com.version0.lexora.dto;

import java.time.LocalDate;
import java.math.BigDecimal;

/**
 * DTO لقضايا العميل
 * يحتوي على المعلومات الأساسية للقضية
 */
public class ClientCaseDTO {

    private Long id;
    private String titre; // عنوان القضية
    private String description; // وصف القضية
    private String statut; // حالة القضية (نشط، مغلق، معلق)
    private LocalDate dateDebut; // تاريخ بداية القضية
    private LocalDate dateFin; // تاريخ انتهاء القضية
    private Long clientId; // معرف العميل
    private String clientName; // اسم العميل
    private Long dossierId; // معرف الملف المرتبط
    private String dossierReference; // مرجع الملف
    private BigDecimal montant; // مبلغ القضية
    private String priorite; // أولوية القضية (عالية، متوسطة، منخفضة)
    private String tribunal; // المحكمة
    private String typeAffaire; // نوع القضية

    // المنشئات
    public ClientCaseDTO() {
    }

    public ClientCaseDTO(Long id, String titre, String statut, LocalDate dateDebut) {
        this.id = id;
        this.titre = titre;
        this.statut = statut;
        this.dateDebut = dateDebut;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getDossierId() {
        return dossierId;
    }

    public void setDossierId(Long dossierId) {
        this.dossierId = dossierId;
    }

    public String getDossierReference() {
        return dossierReference;
    }

    public void setDossierReference(String dossierReference) {
        this.dossierReference = dossierReference;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public String getPriorite() {
        return priorite;
    }

    public void setPriorite(String priorite) {
        this.priorite = priorite;
    }

    public String getTribunal() {
        return tribunal;
    }

    public void setTribunal(String tribunal) {
        this.tribunal = tribunal;
    }

    public String getTypeAffaire() {
        return typeAffaire;
    }

    public void setTypeAffaire(String typeAffaire) {
        this.typeAffaire = typeAffaire;
    }

    @Override
    public String toString() {
        return "ClientCaseDTO{" +
                "id=" + id +
                ", titre='" + titre + '\'' +
                ", statut='" + statut + '\'' +
                ", dateDebut=" + dateDebut +
                ", dateFin=" + dateFin +
                ", clientId=" + clientId +
                ", montant=" + montant +
                '}';
    }
}
