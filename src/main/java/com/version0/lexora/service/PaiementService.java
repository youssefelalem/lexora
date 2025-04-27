package com.version0.lexora.service;

import com.version0.lexora.dto.PaiementDTO;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for payment (paiement) operations
 */
public interface PaiementService {
    
    /**
     * Get all payments
     * @return List of all payments
     */
    List<PaiementDTO> getAllPaiements();
    
    /**
     * Get payment by ID
     * @param id Payment ID
     * @return Optional containing the payment if found, empty otherwise
     */
    Optional<PaiementDTO> getPaiementById(Long id);
    
    /**
     * Create or update a payment
     * @param paiementDTO Payment data transfer object
     * @return Created or updated payment
     */
    PaiementDTO savePaiement(PaiementDTO paiementDTO);
    
    /**
     * Upload payment proof document
     * @param id Payment ID
     * @param file File to upload
     * @return Updated payment
     */
    PaiementDTO uploadPaymentProof(Long id, MultipartFile file);
    
    /**
     * Update existing payment
     * @param id Payment ID
     * @param paiementDTO Updated payment data
     * @return Updated payment
     */
    PaiementDTO updatePaiement(Long id, PaiementDTO paiementDTO);
    
    /**
     * Delete payment by ID
     * @param id Payment ID
     */
    void deletePaiement(Long id);
    
    /**
     * Get payments by client ID
     * @param clientId Client ID
     * @return List of payments from the client
     */
    List<PaiementDTO> getPaiementsByClientId(Long clientId);
    
    /**
     * Get payments by dossier ID
     * @param dossierId Dossier ID
     * @return List of payments for the dossier
     */
    List<PaiementDTO> getPaiementsByDossierId(Long dossierId);
    
    /**
     * Get payments by invoice ID
     * @param factureId Invoice ID
     * @return List of payments for the invoice
     */
    List<PaiementDTO> getPaiementsByFactureId(Long factureId);
    
    /**
     * Get payments by status
     * @param statut Payment status
     * @return List of payments with the specified status
     */
    List<PaiementDTO> getPaiementsByStatut(String statut);
    
    /**
     * Get payments by method
     * @param methode Payment method
     * @return List of payments with the specified method
     */
    List<PaiementDTO> getPaiementsByMethode(String methode);
    
    /**
     * Get payments between dates
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of payments in the date range
     */
    List<PaiementDTO> getPaiementsByDateRange(LocalDate startDate, LocalDate endDate);
}