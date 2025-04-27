package com.version0.lexora.service;

import com.version0.lexora.dto.DepenseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for Depense (Expense) operations
 */
public interface DepenseService {
    
    /**
     * Get all expenses
     * @return List of all expenses
     */
    List<DepenseDTO> getAllDepenses();
    
    /**
     * Get expense by ID
     * @param id Expense ID
     * @return Optional containing the expense if found
     */
    Optional<DepenseDTO> getDepenseById(Long id);
    
    /**
     * Save a new expense
     * @param depenseDTO Expense data to save
     * @return Saved expense
     */
    DepenseDTO saveDepense(DepenseDTO depenseDTO);
    
    /**
     * Upload expense receipt or justification document
     * @param id Expense ID
     * @param file File to upload
     * @return Updated expense
     */
    DepenseDTO uploadExpenseJustification(Long id, MultipartFile file);
    
    /**
     * Update an existing expense
     * @param id Expense ID to update
     * @param depenseDTO New expense data
     * @return Updated expense
     */
    DepenseDTO updateDepense(Long id, DepenseDTO depenseDTO);
    
    /**
     * Delete an expense by ID
     * @param id Expense ID to delete
     */
    void deleteDepense(Long id);
    
    /**
     * Get expenses by dossier ID
     * @param dossierId Dossier ID
     * @return List of expenses for the dossier
     */
    List<DepenseDTO> getDepensesByDossierId(Long dossierId);
    
    /**
     * Get expenses by status
     * @param statut Expense status
     * @return List of expenses with the specified status
     */
    List<DepenseDTO> getDepensesByStatut(String statut);
    
    /**
     * Get expenses by category
     * @param categorie Expense category
     * @return List of expenses with the specified category
     */
    List<DepenseDTO> getDepensesByCategorie(String categorie);
    
    /**
     * Get expenses between dates
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of expenses in the date range
     */
    List<DepenseDTO> getDepensesByDateRange(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get reimbursable expenses
     * @return List of reimbursable expenses
     */
    List<DepenseDTO> getReimbursableExpenses();
}