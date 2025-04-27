package com.version0.lexora.service;

import com.version0.lexora.dto.DocumentDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Document operations
 */
public interface DocumentService {
    
    /**
     * Get all documents
     * @return List of all documents
     */
    List<DocumentDTO> getAllDocuments();
    
    /**
     * Get document by ID
     * @param id Document ID
     * @return Optional containing the document if found
     */
    Optional<DocumentDTO> getDocumentById(Long id);
    
    /**
     * Save a new document
     * @param documentDTO Document data to save
     * @return Saved document
     */
    DocumentDTO saveDocument(DocumentDTO documentDTO);
    
    /**
     * Upload document file
     * @param id Document ID
     * @param file File to upload
     * @return Updated document
     */
    DocumentDTO uploadDocumentFile(Long id, MultipartFile file);
    
    /**
     * Update an existing document
     * @param id Document ID to update
     * @param documentDTO New document data
     * @return Updated document
     */
    DocumentDTO updateDocument(Long id, DocumentDTO documentDTO);
    
    /**
     * Delete a document by ID
     * @param id Document ID to delete
     */
    void deleteDocument(Long id);
    
    /**
     * Get documents by dossier ID
     * @param dossierId Dossier ID
     * @return List of documents for the dossier
     */
    List<DocumentDTO> getDocumentsByDossierId(Long dossierId);
    
    /**
     * Get documents by type
     * @param type Document type
     * @return List of documents with the specified type
     */
    List<DocumentDTO> getDocumentsByType(String type);
    
    /**
     * Search documents by name or description
     * @param query Search query
     * @return List of matching documents
     */
    List<DocumentDTO> searchDocuments(String query);
}