package com.version0.lexora.service;

import com.version0.lexora.dto.DocumentDTO;
import com.version0.lexora.model.Document;
import com.version0.lexora.model.Dossier;
import com.version0.lexora.repository.DocumentRepository;
import com.version0.lexora.repository.DossierRepository;
import com.version0.lexora.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Implementation of the DocumentService interface
 */
@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final DossierRepository dossierRepository;
    private final UserRepository userRepository;

    @Value("${app.file.upload-dir:uploads/documents}")
    private String uploadDirectory;

    @Autowired
    public DocumentServiceImpl(
            DocumentRepository documentRepository,
            DossierRepository dossierRepository,
            UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.dossierRepository = dossierRepository;
        this.userRepository = userRepository;
    }

    /**
     * Convert Document entity to DocumentDTO
     */
    private DocumentDTO convertToDTO(Document document) {
        if (document == null) {
            return null;
        }

        DocumentDTO dto = new DocumentDTO();
        dto.setIdDocument(document.getIdDocument());
        dto.setNom(document.getNom());
        
        if (document.getDossier() != null) {
            dto.setDossierId(document.getDossier().getIdDossier());
            dto.setDossierReference(document.getDossier().getReference());
        }
        
        dto.setType(document.getType());
        dto.setCheminFichier(document.getCheminFichier());
        dto.setStatut(document.getStatut());
        dto.setDateCreation(document.getDateCreation());
        dto.setDateAjout(document.getDateAjout());
        dto.setDescription(document.getDescription());
        dto.setEtiquettes(document.getEtiquettes());
        
        if (document.getUtilisateurAjout() != null) {
            dto.setUtilisateurAjoutId(document.getUtilisateurAjout().getIdUtilisateur());
            dto.setUtilisateurAjoutNom(document.getUtilisateurAjout().getNom() + " " + 
                                       document.getUtilisateurAjout().getPrenom());
        }
        
        return dto;
    }

    /**
     * Convert DocumentDTO to Document entity
     */
    private Document convertToEntity(DocumentDTO documentDTO) {
        if (documentDTO == null) {
            return null;
        }

        Document document = new Document();
        document.setIdDocument(documentDTO.getIdDocument());
        document.setNom(documentDTO.getNom());
        document.setType(documentDTO.getType());
        document.setCheminFichier(documentDTO.getCheminFichier());
        document.setStatut(documentDTO.getStatut());
        document.setDateCreation(documentDTO.getDateCreation());
        
        // If dateAjout is not provided, set it to current date
        if (documentDTO.getDateAjout() == null) {
            document.setDateAjout(LocalDate.now());
        } else {
            document.setDateAjout(documentDTO.getDateAjout());
        }
        
        document.setDescription(documentDTO.getDescription());
        document.setEtiquettes(documentDTO.getEtiquettes());

        // Set dossier if dossierId is provided
        if (documentDTO.getDossierId() != null) {
            dossierRepository.findById(documentDTO.getDossierId())
                    .ifPresent(document::setDossier);
        }

        // Set utilisateurAjout if utilisateurAjoutId is provided
        if (documentDTO.getUtilisateurAjoutId() != null) {
            userRepository.findById(documentDTO.getUtilisateurAjoutId())
                    .ifPresent(document::setUtilisateurAjout);
        }

        return document;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> getAllDocuments() {
        return documentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DocumentDTO> getDocumentById(Long id) {
        return documentRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public DocumentDTO saveDocument(DocumentDTO documentDTO) {
        Document document = convertToEntity(documentDTO);
        document = documentRepository.save(document);
        return convertToDTO(document);
    }

    @Override
    @Transactional
    public DocumentDTO uploadDocumentFile(Long id, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }

        Optional<Document> documentOptional = documentRepository.findById(id);
        if (!documentOptional.isPresent()) {
            throw new RuntimeException("Document with ID " + id + " not found");
        }

        Document document = documentOptional.get();
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = "document_" + id + "_" + UUID.randomUUID() + fileExtension;

        try {
            // Create the directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update the document with the path to the file
            document.setCheminFichier(fileName);
            document = documentRepository.save(document);
            return convertToDTO(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + fileName, e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0) {
            return "";
        }
        return filename.substring(dotIndex);
    }

    @Override
    @Transactional
    public DocumentDTO updateDocument(Long id, DocumentDTO documentDTO) {
        Optional<Document> existingDocumentOptional = documentRepository.findById(id);

        if (!existingDocumentOptional.isPresent()) {
            throw new RuntimeException("Document with ID " + id + " not found");
        }

        // Get the existing entity to preserve certain values
        Document existingDocument = existingDocumentOptional.get();

        // Update fields but preserve the ID
        Document updatedDocument = convertToEntity(documentDTO);
        updatedDocument.setIdDocument(id);

        // If dateCreation was not provided, keep the original
        if (documentDTO.getDateCreation() == null) {
            updatedDocument.setDateCreation(existingDocument.getDateCreation());
        }

        // If dateAjout was not provided, keep the original
        if (documentDTO.getDateAjout() == null) {
            updatedDocument.setDateAjout(existingDocument.getDateAjout());
        }

        // If cheminFichier was not provided, keep the original
        if (documentDTO.getCheminFichier() == null || documentDTO.getCheminFichier().isEmpty()) {
            updatedDocument.setCheminFichier(existingDocument.getCheminFichier());
        }

        // If utilisateurAjout was not provided, keep the original
        if (documentDTO.getUtilisateurAjoutId() == null) {
            updatedDocument.setUtilisateurAjout(existingDocument.getUtilisateurAjout());
        }

        Document savedDocument = documentRepository.save(updatedDocument);
        return convertToDTO(savedDocument);
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> getDocumentsByDossierId(Long dossierId) {
        Optional<Dossier> dossierOptional = dossierRepository.findById(dossierId);
        if (!dossierOptional.isPresent()) {
            throw new RuntimeException("Dossier with ID " + dossierId + " not found");
        }

        Dossier dossier = dossierOptional.get();
        return documentRepository.findByDossier(dossier).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> getDocumentsByType(String type) {
        return documentRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentDTO> searchDocuments(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllDocuments();
        }
        
        String lowercaseQuery = query.toLowerCase();
        
        // Search by name
        List<Document> nameMatches = documentRepository.findByNomContainingIgnoreCase(lowercaseQuery);
        
        // Search by tag/etiquettes
        List<Document> tagMatches = documentRepository.findByEtiquettesContainingIgnoreCase(lowercaseQuery);
        
        // Combine results without duplicates
        return Stream.concat(nameMatches.stream(), tagMatches.stream())
                .distinct()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}