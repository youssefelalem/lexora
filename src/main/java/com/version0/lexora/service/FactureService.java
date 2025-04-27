package com.version0.lexora.service;

import com.version0.lexora.dto.FactureDTO;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for Facture (Invoice) operations
 */
public interface FactureService {
    
    /**
     * Get all invoices
     * @return List of all invoices
     */
    List<FactureDTO> getAllFactures();
    
    /**
     * Get invoice by ID
     * @param id Invoice ID
     * @return Optional containing the invoice if found
     */
    Optional<FactureDTO> getFactureById(Long id);
    
    /**
     * Save a new invoice
     * @param factureDTO Invoice data to save
     * @return Saved invoice
     */
    FactureDTO saveFacture(FactureDTO factureDTO);
    
    /**
     * Update an existing invoice
     * @param id Invoice ID to update
     * @param factureDTO New invoice data
     * @return Updated invoice
     */
    FactureDTO updateFacture(Long id, FactureDTO factureDTO);
    
    /**
     * Delete an invoice by ID
     * @param id Invoice ID to delete
     */
    void deleteFacture(Long id);
    
    /**
     * Get invoices by client ID
     * @param clientId Client ID
     * @return List of invoices for the client
     */
    List<FactureDTO> getFacturesByClientId(Long clientId);
    
    /**
     * Get invoices by dossier ID
     * @param dossierId Dossier ID
     * @return List of invoices for the dossier
     */
    List<FactureDTO> getFacturesByDossierId(Long dossierId);
    
    /**
     * Get invoices by status
     * @param statut Invoice status
     * @return List of invoices with the specified status
     */
    List<FactureDTO> getFacturesByStatut(String statut);
    
    /**
     * Get invoices between emission dates
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of invoices emitted in the date range
     */
    List<FactureDTO> getFacturesByEmissionDateRange(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get invoices between due dates
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of invoices due in the date range
     */
    List<FactureDTO> getFacturesByDueDateRange(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get overdue invoices (due date < today and not fully paid)
     * @return List of overdue invoices
     */
    List<FactureDTO> getOverdueFactures();
    
    /**
     * Generate invoice PDF
     * @param id Invoice ID
     * @return PDF response entity
     */
    ResponseEntity<?> generateInvoicePdf(Long id);
}