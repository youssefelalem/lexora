package com.version0.lexora.service;

import com.version0.lexora.dto.DepenseDTO;
import com.version0.lexora.model.Depense;
import com.version0.lexora.model.Dossier;
import com.version0.lexora.repository.DepenseRepository;
import com.version0.lexora.repository.DossierRepository;
import com.version0.lexora.repository.UserRepository;
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

/**
 * Implementation of the DepenseService interface
 */
@Service
public class DepenseServiceImpl implements DepenseService {

    private final DepenseRepository depenseRepository;
    private final DossierRepository dossierRepository;
    private final UserRepository userRepository;

    @Value("${app.file.upload-dir:uploads/justificatifs}")
    private String uploadDirectory;

    public DepenseServiceImpl(
            DepenseRepository depenseRepository,
            DossierRepository dossierRepository,
            UserRepository userRepository) {
        this.depenseRepository = depenseRepository;
        this.dossierRepository = dossierRepository;
        this.userRepository = userRepository;
    }

    /**
     * Convert Depense entity to DepenseDTO
     */
    private DepenseDTO convertToDTO(Depense depense) {
        if (depense == null) {
            return null;
        }

        DepenseDTO dto = new DepenseDTO();
        dto.setIdDepense(depense.getIdDepense());
        dto.setTitre(depense.getTitre());
        
        if (depense.getDossier() != null) {
            dto.setDossierId(depense.getDossier().getIdDossier());
            dto.setDossierReference(depense.getDossier().getReference());
            dto.setDossierTitre(depense.getDossier().getTitre());
        }
        
        dto.setMontant(depense.getMontant());
        dto.setDevise(depense.getDevise());
        dto.setCategorie(depense.getCategorie());
        dto.setDateDepense(depense.getDateDepense());
        dto.setDescription(depense.getDescription());
        dto.setStatut(depense.getStatut());
        dto.setDateCreation(depense.getDateCreation());
        dto.setBeneficiaire(depense.getBeneficiaire());
        dto.setFactureReference(depense.getFactureReference());
        dto.setRemboursable(depense.getRemboursable());
        dto.setCheminJustificatif(depense.getCheminJustificatif());
        
        if (depense.getUtilisateurCreation() != null) {
            dto.setUtilisateurCreationId(depense.getUtilisateurCreation().getIdUtilisateur());
            dto.setUtilisateurCreationNom(depense.getUtilisateurCreation().getNom() + " " + depense.getUtilisateurCreation().getPrenom());
        }
        
        return dto;
    }

    /**
     * Convert DepenseDTO to Depense entity
     */
    private Depense convertToEntity(DepenseDTO depenseDTO) {
        if (depenseDTO == null) {
            return null;
        }

        Depense depense = new Depense();
        depense.setIdDepense(depenseDTO.getIdDepense());
        depense.setTitre(depenseDTO.getTitre());
        depense.setMontant(depenseDTO.getMontant());
        depense.setDevise(depenseDTO.getDevise());
        depense.setCategorie(depenseDTO.getCategorie());
        depense.setDateDepense(depenseDTO.getDateDepense());
        depense.setDescription(depenseDTO.getDescription());
        depense.setStatut(depenseDTO.getStatut());
        
        // If it's a new expense, set the creation date to current date
        if (depenseDTO.getDateCreation() == null) {
            depense.setDateCreation(LocalDate.now());
        } else {
            depense.setDateCreation(depenseDTO.getDateCreation());
        }
        
        depense.setBeneficiaire(depenseDTO.getBeneficiaire());
        depense.setFactureReference(depenseDTO.getFactureReference());
        depense.setRemboursable(depenseDTO.getRemboursable() != null ? depenseDTO.getRemboursable() : false);
        depense.setCheminJustificatif(depenseDTO.getCheminJustificatif());

        // Set dossier if dossierId is provided
        if (depenseDTO.getDossierId() != null) {
            dossierRepository.findById(depenseDTO.getDossierId())
                    .ifPresent(depense::setDossier);
        }

        // Set utilisateurCreation if utilisateurCreationId is provided
        if (depenseDTO.getUtilisateurCreationId() != null) {
            userRepository.findById(depenseDTO.getUtilisateurCreationId())
                    .ifPresent(depense::setUtilisateurCreation);
        }

        return depense;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepenseDTO> getAllDepenses() {
        return depenseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DepenseDTO> getDepenseById(Long id) {
        return depenseRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public DepenseDTO saveDepense(DepenseDTO depenseDTO) {
        Depense depense = convertToEntity(depenseDTO);
        depense = depenseRepository.save(depense);
        return convertToDTO(depense);
    }

    @Override
    @Transactional
    public DepenseDTO uploadExpenseJustification(Long id, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }

        Optional<Depense> depenseOptional = depenseRepository.findById(id);
        if (!depenseOptional.isPresent()) {
            throw new RuntimeException("Expense with ID " + id + " not found");
        }

        Depense depense = depenseOptional.get();
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = "justificatif_" + id + "_" + UUID.randomUUID() + fileExtension;

        try {
            // Create the directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update the expense with the path to the file
            depense.setCheminJustificatif(fileName);
            depense = depenseRepository.save(depense);
            return convertToDTO(depense);
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
    public DepenseDTO updateDepense(Long id, DepenseDTO depenseDTO) {
        Optional<Depense> existingDepenseOptional = depenseRepository.findById(id);

        if (!existingDepenseOptional.isPresent()) {
            throw new RuntimeException("Expense with ID " + id + " not found");
        }

        // Get the existing entity to preserve certain values
        Depense existingDepense = existingDepenseOptional.get();

        // Update fields but preserve the ID
        Depense updatedDepense = convertToEntity(depenseDTO);
        updatedDepense.setIdDepense(id);

        // If dateCreation was not provided, keep the original
        if (depenseDTO.getDateCreation() == null) {
            updatedDepense.setDateCreation(existingDepense.getDateCreation());
        }

        // If cheminJustificatif was not provided, keep the original
        if (depenseDTO.getCheminJustificatif() == null || depenseDTO.getCheminJustificatif().isEmpty()) {
            updatedDepense.setCheminJustificatif(existingDepense.getCheminJustificatif());
        }

        // If utilisateurCreation was not provided, keep the original
        if (depenseDTO.getUtilisateurCreationId() == null) {
            updatedDepense.setUtilisateurCreation(existingDepense.getUtilisateurCreation());
        }

        Depense savedDepense = depenseRepository.save(updatedDepense);
        return convertToDTO(savedDepense);
    }

    @Override
    @Transactional
    public void deleteDepense(Long id) {
        depenseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepenseDTO> getDepensesByDossierId(Long dossierId) {
        Optional<Dossier> dossierOptional = dossierRepository.findById(dossierId);
        if (!dossierOptional.isPresent()) {
            throw new RuntimeException("Dossier with ID " + dossierId + " not found");
        }

        Dossier dossier = dossierOptional.get();
        return depenseRepository.findByDossier(dossier).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepenseDTO> getDepensesByStatut(String statut) {
        return depenseRepository.findByStatut(statut).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepenseDTO> getDepensesByCategorie(String categorie) {
        return depenseRepository.findByCategorie(categorie).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepenseDTO> getDepensesByDateRange(LocalDate startDate, LocalDate endDate) {
        return depenseRepository.findByDateDepenseBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepenseDTO> getReimbursableExpenses() {
        return depenseRepository.findByRemboursable(true).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}