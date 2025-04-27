package com.version0.lexora.controller;

import com.version0.lexora.dto.DocumentDTO;
import com.version0.lexora.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST Controller for Document operations
 */
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    
    private final DocumentService documentService;
    
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }
    
    /**
     * Get all documents
     * @return List of all documents
     */
    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }
    
    /**
     * Get document by ID
     * @param id Document ID
     * @return Document with matching ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentDTO> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create new document with metadata
     * @param documentDTO Document data transfer object
     * @return Created document
     */
    @PostMapping
    public ResponseEntity<DocumentDTO> createDocument(@RequestBody DocumentDTO documentDTO) {
        return new ResponseEntity<>(documentService.saveDocument(documentDTO), HttpStatus.CREATED);
    }
    
    /**
     * Upload document file
     * @param id Document ID
     * @param file File to upload
     * @return Updated document
     */
    @PostMapping("/{id}/upload")
    public ResponseEntity<DocumentDTO> uploadDocumentFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(documentService.uploadDocumentFile(id, file));
    }
    
    /**
     * Update existing document metadata
     * @param id Document ID
     * @param documentDTO Updated document data
     * @return Updated document
     */
    @PutMapping("/{id}")
    public ResponseEntity<DocumentDTO> updateDocument(@PathVariable Long id, @RequestBody DocumentDTO documentDTO) {
        return ResponseEntity.ok(documentService.updateDocument(id, documentDTO));
    }
    
    /**
     * Delete document by ID
     * @param id Document ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get documents by dossier ID
     * @param dossierId Dossier ID
     * @return List of documents related to the dossier
     */
    @GetMapping("/dossier/{dossierId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByDossierId(@PathVariable Long dossierId) {
        return ResponseEntity.ok(documentService.getDocumentsByDossierId(dossierId));
    }
    
    /**
     * Get documents by type
     * @param type Document type
     * @return List of documents with matching type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByType(@PathVariable String type) {
        return ResponseEntity.ok(documentService.getDocumentsByType(type));
    }
    
    /**
     * Search documents by name or description
     * @param query Search query
     * @return List of matching documents
     */
    @GetMapping("/search")
    public ResponseEntity<List<DocumentDTO>> searchDocuments(@RequestParam String query) {
        return ResponseEntity.ok(documentService.searchDocuments(query));
    }
}