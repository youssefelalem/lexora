package com.version0.lexora.dto;

import java.math.BigDecimal;

/**
 * DTO لإحصائيات العميل
 * يحتوي على الإحصائيات المالية والمعلومات الأساسية للعميل
 */
public class ClientStatisticsDTO {

    private Long clientId;
    private String clientName;
    private BigDecimal totalReceived; // إجمالي الضمائم المقدمة
    private BigDecimal totalPaid; // إجمالي الضمائم المدفوعة
    private BigDecimal clientBalance; // إجمالي مبلغ العميل (الرصيد)
    private Integer totalCases; // عدد القضايا الإجمالي
    private Integer activeCases; // عدد القضايا النشطة
    private Integer totalDossiers; // عدد الملفات الإجمالي
    private BigDecimal totalInvoices; // إجمالي الفواتير
    private BigDecimal totalExpenses; // إجمالي المصروفات

    // المنشئات
    public ClientStatisticsDTO() {
    }

    public ClientStatisticsDTO(Long clientId, String clientName) {
        this.clientId = clientId;
        this.clientName = clientName;
        this.totalReceived = BigDecimal.ZERO;
        this.totalPaid = BigDecimal.ZERO;
        this.clientBalance = BigDecimal.ZERO;
        this.totalCases = 0;
        this.activeCases = 0;
        this.totalDossiers = 0;
        this.totalInvoices = BigDecimal.ZERO;
        this.totalExpenses = BigDecimal.ZERO;
    }

    // Getters and Setters
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

    public BigDecimal getTotalReceived() {
        return totalReceived;
    }

    public void setTotalReceived(BigDecimal totalReceived) {
        this.totalReceived = totalReceived;
    }

    public BigDecimal getTotalPaid() {
        return totalPaid;
    }

    public void setTotalPaid(BigDecimal totalPaid) {
        this.totalPaid = totalPaid;
    }

    public BigDecimal getClientBalance() {
        return clientBalance;
    }

    public void setClientBalance(BigDecimal clientBalance) {
        this.clientBalance = clientBalance;
    }

    public Integer getTotalCases() {
        return totalCases;
    }

    public void setTotalCases(Integer totalCases) {
        this.totalCases = totalCases;
    }

    public Integer getActiveCases() {
        return activeCases;
    }

    public void setActiveCases(Integer activeCases) {
        this.activeCases = activeCases;
    }

    public Integer getTotalDossiers() {
        return totalDossiers;
    }

    public void setTotalDossiers(Integer totalDossiers) {
        this.totalDossiers = totalDossiers;
    }

    public BigDecimal getTotalInvoices() {
        return totalInvoices;
    }

    public void setTotalInvoices(BigDecimal totalInvoices) {
        this.totalInvoices = totalInvoices;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    @Override
    public String toString() {
        return "ClientStatisticsDTO{" +
                "clientId=" + clientId +
                ", clientName='" + clientName + '\'' +
                ", totalReceived=" + totalReceived +
                ", totalPaid=" + totalPaid +
                ", clientBalance=" + clientBalance +
                ", totalCases=" + totalCases +
                ", activeCases=" + activeCases +
                ", totalDossiers=" + totalDossiers +
                ", totalInvoices=" + totalInvoices +
                ", totalExpenses=" + totalExpenses +
                '}';
    }
}
