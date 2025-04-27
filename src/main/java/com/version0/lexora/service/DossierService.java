package com.version0.lexora.service;

import com.version0.lexora.dto.DossierDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Dossier operations
 */
public interface DossierService {
    
    /**
     * Get all dossiers
     * @return List of all dossiers
     */
    List<DossierDTO> getAllDossiers();
    
    /**
     * Get dossier by ID
     * @param id Dossier ID
     * @return Optional containing the dossier if found
     */
    Optional<DossierDTO> getDossierById(Long id);
    
    /**
     * Save a new dossier
     * @param dossierDTO Dossier data to save
     * @return Saved dossier
     */
    DossierDTO saveDossier(DossierDTO dossierDTO);
    
    /**
     * Update an existing dossier
     * @param id Dossier ID to update
     * @param dossierDTO New dossier data
     * @return Updated dossier
     */
    DossierDTO updateDossier(Long id, DossierDTO dossierDTO);
    
    /**
     * Delete a dossier by ID
     * @param id Dossier ID to delete
     */
    void deleteDossier(Long id);
    
    /**
     * Get dossiers by client ID
     * @param clientId Client ID
     * @return List of dossiers for the client
     */
    List<DossierDTO> getDossiersByClientId(Long clientId);
    
    /**
     * Get dossiers by status
     * @param statut Dossier status
     * @return List of dossiers with the specified status
     */
    List<DossierDTO> getDossiersByStatus(String statut);
    
    /**
     * Get dossiers by type
     * @param type Dossier type
     * @return List of dossiers with the specified type
     */
    List<DossierDTO> getDossiersByType(String type);
    
    /**
     * Get dossiers by priority
     * @param priorite Dossier priority
     * @return List of dossiers with the specified priority
     */
    List<DossierDTO> getDossiersByPriority(String priorite);
}