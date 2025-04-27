package com.version0.lexora.controller;

import com.version0.lexora.dto.PaiementDTO;
import com.version0.lexora.service.PaiementService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Paiement (Payment) operations
 */
@RestController
@RequestMapping("/api/paiements")
public class PaiementController {
    
    private final PaiementService paiementService;
    
    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }
    
    /**
     * Get all payments
     * @return List of all payments
     */
    @GetMapping
    public ResponseEntity<List<PaiementDTO>> getAllPaiements() {
        return ResponseEntity.ok(paiementService.getAllPaiements());
    }
    
    /**
     * Get payment by ID
     * @param id Payment ID
     * @return Payment with matching ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaiementDTO> getPaiementById(@PathVariable Long id) {
        return paiementService.getPaiementById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create new payment
     * @param paiementDTO Payment data transfer object
     * @return Created payment
     */
    @PostMapping
    public ResponseEntity<PaiementDTO> createPaiement(@RequestBody PaiementDTO paiementDTO) {
        return new ResponseEntity<>(paiementService.savePaiement(paiementDTO), HttpStatus.CREATED);
    }
    
    /**
     * Upload payment proof document
     * @param id Payment ID
     * @param file File to upload
     * @return Updated payment
     */
    @PostMapping("/{id}/upload-proof")
    public ResponseEntity<PaiementDTO> uploadPaymentProof(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(paiementService.uploadPaymentProof(id, file));
    }
    
    /**
     * Update existing payment
     * @param id Payment ID
     * @param paiementDTO Updated payment data
     * @return Updated payment
     */
    @PutMapping("/{id}")
    public ResponseEntity<PaiementDTO> updatePaiement(@PathVariable Long id, @RequestBody PaiementDTO paiementDTO) {
        return ResponseEntity.ok(paiementService.updatePaiement(id, paiementDTO));
    }
    
    /**
     * Delete payment by ID
     * @param id Payment ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaiement(@PathVariable Long id) {
        paiementService.deletePaiement(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get payments by client ID
     * @param clientId Client ID
     * @return List of payments from the client
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<PaiementDTO>> getPaiementsByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(paiementService.getPaiementsByClientId(clientId));
    }
    
    /**
     * Get payments by dossier ID
     * @param dossierId Dossier ID
     * @return List of payments for the dossier
     */
    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<PaiementDTO>> getPaiementsByDossierId(@PathVariable Long dossierId) {
        return ResponseEntity.ok(paiementService.getPaiementsByDossierId(dossierId));
    }
    
    /**
     * Get payments by invoice ID
     * @param factureId Invoice ID
     * @return List of payments for the invoice
     */
    @GetMapping("/facture/{factureId}")
    public ResponseEntity<List<PaiementDTO>> getPaiementsByFactureId(@PathVariable Long factureId) {
        return ResponseEntity.ok(paiementService.getPaiementsByFactureId(factureId));
    }
    
    /**
     * Get payments by status
     * @param statut Payment status
     * @return List of payments with the specified status
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<PaiementDTO>> getPaiementsByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(paiementService.getPaiementsByStatut(statut));
    }
    
    /**
     * Get payments by method
     * @param methode Payment method
     * @return List of payments with the specified method
     */
    @GetMapping("/methode/{methode}")
    public ResponseEntity<List<PaiementDTO>> getPaiementsByMethode(@PathVariable String methode) {
        return ResponseEntity.ok(paiementService.getPaiementsByMethode(methode));
    }
    
    /**
     * Get payments between dates
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of payments in the date range
     */
    @GetMapping("/period")
    public ResponseEntity<List<PaiementDTO>> getPaiementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(paiementService.getPaiementsByDateRange(startDate, endDate));
    }
}