package com.version0.lexora.controller;

import com.version0.lexora.dto.FactureDTO;
import com.version0.lexora.service.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Facture (Invoice) operations
 */
@RestController
@RequestMapping("/api/factures")
public class FactureController {
    
    private final FactureService factureService;
    
    @Autowired
    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }
    
    /**
     * Get all invoices
     * @return List of all invoices
     */
    @GetMapping
    public ResponseEntity<List<FactureDTO>> getAllFactures() {
        return ResponseEntity.ok(factureService.getAllFactures());
    }
    
    /**
     * Get invoice by ID
     * @param id Invoice ID
     * @return Invoice with matching ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FactureDTO> getFactureById(@PathVariable Long id) {
        return factureService.getFactureById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create new invoice
     * @param factureDTO Invoice data transfer object
     * @return Created invoice
     */
    @PostMapping
    public ResponseEntity<FactureDTO> createFacture(@RequestBody FactureDTO factureDTO) {
        return new ResponseEntity<>(factureService.saveFacture(factureDTO), HttpStatus.CREATED);
    }
    
    /**
     * Update existing invoice
     * @param id Invoice ID
     * @param factureDTO Updated invoice data
     * @return Updated invoice
     */
    @PutMapping("/{id}")
    public ResponseEntity<FactureDTO> updateFacture(@PathVariable Long id, @RequestBody FactureDTO factureDTO) {
        return ResponseEntity.ok(factureService.updateFacture(id, factureDTO));
    }
    
    /**
     * Delete invoice by ID
     * @param id Invoice ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get invoices by client ID
     * @param clientId Client ID
     * @return List of invoices for the client
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<FactureDTO>> getFacturesByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(factureService.getFacturesByClientId(clientId));
    }
    
    /**
     * Get invoices by dossier ID
     * @param dossierId Dossier ID
     * @return List of invoices for the dossier
     */
    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<FactureDTO>> getFacturesByDossierId(@PathVariable Long dossierId) {
        return ResponseEntity.ok(factureService.getFacturesByDossierId(dossierId));
    }
    
    /**
     * Get invoices by status
     * @param statut Invoice status
     * @return List of invoices with the specified status
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<FactureDTO>> getFacturesByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(factureService.getFacturesByStatut(statut));
    }
    
    /**
     * Get invoices between dates (emission date)
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of invoices in the date range
     */
    @GetMapping("/emission-period")
    public ResponseEntity<List<FactureDTO>> getFacturesByEmissionDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(factureService.getFacturesByEmissionDateRange(startDate, endDate));
    }
    
    /**
     * Get invoices by due date range
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of invoices due in the date range
     */
    @GetMapping("/due-period")
    public ResponseEntity<List<FactureDTO>> getFacturesByDueDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(factureService.getFacturesByDueDateRange(startDate, endDate));
    }
    
    /**
     * Get overdue invoices (due date < today and not fully paid)
     * @return List of overdue invoices
     */
    @GetMapping("/overdue")
    public ResponseEntity<List<FactureDTO>> getOverdueFactures() {
        return ResponseEntity.ok(factureService.getOverdueFactures());
    }
    
    /**
     * Generate invoice PDF
     * @param id Invoice ID
     * @return PDF response entity
     */
    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> generateInvoicePdf(@PathVariable Long id) {
        return factureService.generateInvoicePdf(id);
    }
}