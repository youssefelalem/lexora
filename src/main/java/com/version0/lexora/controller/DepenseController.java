package com.version0.lexora.controller;

import com.version0.lexora.dto.DepenseDTO;
import com.version0.lexora.service.DepenseService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Depense (Expense) operations
 */
@RestController
@RequestMapping("/api/depenses")
public class DepenseController {
    
    private final DepenseService depenseService;
    
    public DepenseController(DepenseService depenseService) {
        this.depenseService = depenseService;
    }
    
    /**
     * Get all expenses
     * @return List of all expenses
     */
    @GetMapping
    public ResponseEntity<List<DepenseDTO>> getAllDepenses() {
        return ResponseEntity.ok(depenseService.getAllDepenses());
    }
    
    /**
     * Get expense by ID
     * @param id Expense ID
     * @return Expense with matching ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DepenseDTO> getDepenseById(@PathVariable Long id) {
        return depenseService.getDepenseById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create new expense
     * @param depenseDTO Expense data transfer object
     * @return Created expense
     */
    @PostMapping
    public ResponseEntity<DepenseDTO> createDepense(@RequestBody DepenseDTO depenseDTO) {
        return new ResponseEntity<>(depenseService.saveDepense(depenseDTO), HttpStatus.CREATED);
    }
    
    /**
     * Upload expense receipt or justification document
     * @param id Expense ID
     * @param file File to upload
     * @return Updated expense
     */
    @PostMapping("/{id}/upload-justification")
    public ResponseEntity<DepenseDTO> uploadExpenseJustification(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(depenseService.uploadExpenseJustification(id, file));
    }
    
    /**
     * Update existing expense
     * @param id Expense ID
     * @param depenseDTO Updated expense data
     * @return Updated expense
     */
    @PutMapping("/{id}")
    public ResponseEntity<DepenseDTO> updateDepense(@PathVariable Long id, @RequestBody DepenseDTO depenseDTO) {
        return ResponseEntity.ok(depenseService.updateDepense(id, depenseDTO));
    }
    
    /**
     * Delete expense by ID
     * @param id Expense ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepense(@PathVariable Long id) {
        depenseService.deleteDepense(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get expenses by dossier ID
     * @param dossierId Dossier ID
     * @return List of expenses for the dossier
     */
    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<DepenseDTO>> getDepensesByDossierId(@PathVariable Long dossierId) {
        return ResponseEntity.ok(depenseService.getDepensesByDossierId(dossierId));
    }
    
    /**
     * Get expenses by status
     * @param statut Expense status
     * @return List of expenses with the specified status
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<DepenseDTO>> getDepensesByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(depenseService.getDepensesByStatut(statut));
    }
    
    /**
     * Get expenses by category
     * @param categorie Expense category
     * @return List of expenses with the specified category
     */
    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<DepenseDTO>> getDepensesByCategorie(@PathVariable String categorie) {
        return ResponseEntity.ok(depenseService.getDepensesByCategorie(categorie));
    }
    
    /**
     * Get expenses between dates
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of expenses in the date range
     */
    @GetMapping("/period")
    public ResponseEntity<List<DepenseDTO>> getDepensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(depenseService.getDepensesByDateRange(startDate, endDate));
    }
    
    /**
     * Get reimbursable expenses
     * @return List of reimbursable expenses
     */
    @GetMapping("/reimbursable")
    public ResponseEntity<List<DepenseDTO>> getReimbursableExpenses() {
        return ResponseEntity.ok(depenseService.getReimbursableExpenses());
    }
}