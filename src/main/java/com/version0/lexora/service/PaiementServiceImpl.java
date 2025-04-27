package com.version0.lexora.service;

import com.version0.lexora.dto.PaiementDTO;
import com.version0.lexora.model.Client;
import com.version0.lexora.model.Dossier;
import com.version0.lexora.model.Facture;
import com.version0.lexora.model.Paiement;
import com.version0.lexora.model.Utilisateur;
import com.version0.lexora.repository.ClientRepository;
import com.version0.lexora.repository.DossierRepository;
import com.version0.lexora.repository.FactureRepository;
import com.version0.lexora.repository.PaiementRepository;
import com.version0.lexora.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
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
 * Implementation of PaiementService interface
 */
@Service
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository paiementRepository;
    private final ClientRepository clientRepository;
    private final DossierRepository dossierRepository;
    private final FactureRepository factureRepository;
    private final UserRepository userRepository;
    
    @Value("${file.upload-dir:/uploads/justificatifs}")
    private String uploadDir;

    public PaiementServiceImpl(
            PaiementRepository paiementRepository,
            ClientRepository clientRepository,
            DossierRepository dossierRepository,
            FactureRepository factureRepository,
            UserRepository userRepository) {
        this.paiementRepository = paiementRepository;
        this.clientRepository = clientRepository;
        this.dossierRepository = dossierRepository;
        this.factureRepository = factureRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<PaiementDTO> getAllPaiements() {
        return paiementRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PaiementDTO> getPaiementById(Long id) {
        return paiementRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public PaiementDTO savePaiement(PaiementDTO paiementDTO) {
        Paiement paiement = convertToEntity(paiementDTO);
        paiement.setDateCreation(LocalDate.now());
        return convertToDTO(paiementRepository.save(paiement));
    }

    @Override
    @Transactional
    public PaiementDTO uploadPaymentProof(Long id, MultipartFile file) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paiement not found with id: " + id));

        try {
            // Create the uploads directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate a unique filename to avoid collisions
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? 
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
            String filename = "justificatif_" + id + "_" + UUID.randomUUID() + fileExtension;
            
            // Save the file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update the payment with the file path
            paiement.setCheminJustificatif(filename);
            paiement = paiementRepository.save(paiement);
            
            return convertToDTO(paiement);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    @Transactional
    public PaiementDTO updatePaiement(Long id, PaiementDTO paiementDTO) {
        return paiementRepository.findById(id)
                .map(existingPaiement -> {
                    // Update fields from DTO to entity
                    updatePaiementFromDTO(existingPaiement, paiementDTO);
                    return convertToDTO(paiementRepository.save(existingPaiement));
                })
                .orElseThrow(() -> new EntityNotFoundException("Paiement not found with id: " + id));
    }

    @Override
    @Transactional
    public void deletePaiement(Long id) {
        if (!paiementRepository.existsById(id)) {
            throw new EntityNotFoundException("Paiement not found with id: " + id);
        }
        paiementRepository.deleteById(id);
    }

    @Override
    public List<PaiementDTO> getPaiementsByClientId(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + clientId));
        
        return paiementRepository.findByClient(client)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaiementDTO> getPaiementsByDossierId(Long dossierId) {
        Dossier dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new EntityNotFoundException("Dossier not found with id: " + dossierId));
        
        return paiementRepository.findByDossier(dossier)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaiementDTO> getPaiementsByFactureId(Long factureId) {
        Facture facture = factureRepository.findById(factureId)
                .orElseThrow(() -> new EntityNotFoundException("Facture not found with id: " + factureId));
        
        return paiementRepository.findByFacture(facture)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaiementDTO> getPaiementsByStatut(String statut) {
        return paiementRepository.findByStatut(statut)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaiementDTO> getPaiementsByMethode(String methode) {
        return paiementRepository.findByMethode(methode)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaiementDTO> getPaiementsByDateRange(LocalDate startDate, LocalDate endDate) {
        return paiementRepository.findByDatePaiementBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert a Paiement entity to a PaiementDTO
     * @param paiement the entity to convert
     * @return the corresponding DTO
     */
    private PaiementDTO convertToDTO(Paiement paiement) {
        PaiementDTO dto = new PaiementDTO();
        dto.setIdPaiement(paiement.getIdPaiement());
        
        if (paiement.getClient() != null) {
            dto.setClientId(paiement.getClient().getIdClient());
            dto.setClientNom(paiement.getClient().getNom());
        }
        
        if (paiement.getDossier() != null) {
            dto.setDossierId(paiement.getDossier().getIdDossier());
            dto.setDossierReference(paiement.getDossier().getReference());
        }
        
        if (paiement.getFacture() != null) {
            dto.setFactureId(paiement.getFacture().getIdFacture());
            dto.setFactureNumero(paiement.getFacture().getNumero());
        }
        
        dto.setMontant(paiement.getMontant());
        dto.setDevise(paiement.getDevise());
        dto.setMethode(paiement.getMethode());
        dto.setDatePaiement(paiement.getDatePaiement());
        dto.setNumeroReference(paiement.getNumeroReference());
        dto.setBanqueReference(paiement.getBanqueReference());
        dto.setNotes(paiement.getNotes());
        dto.setStatut(paiement.getStatut());
        dto.setDateCreation(paiement.getDateCreation());
        dto.setCheminJustificatif(paiement.getCheminJustificatif());
        
        if (paiement.getUtilisateurCreation() != null) {
            dto.setUtilisateurCreationId(paiement.getUtilisateurCreation().getIdUtilisateur());
            dto.setUtilisateurCreationNom(paiement.getUtilisateurCreation().getNomComplet());
        }
        
        return dto;
    }

    /**
     * Convert a PaiementDTO to a Paiement entity
     * @param paiementDTO the DTO to convert
     * @return the corresponding entity
     */
    private Paiement convertToEntity(PaiementDTO paiementDTO) {
        Paiement paiement = new Paiement();
        
        if (paiementDTO.getIdPaiement() != null) {
            paiement.setIdPaiement(paiementDTO.getIdPaiement());
        }
        
        if (paiementDTO.getClientId() != null) {
            Client client = clientRepository.findById(paiementDTO.getClientId())
                    .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + paiementDTO.getClientId()));
            paiement.setClient(client);
        }
        
        if (paiementDTO.getDossierId() != null) {
            Dossier dossier = dossierRepository.findById(paiementDTO.getDossierId())
                    .orElseThrow(() -> new EntityNotFoundException("Dossier not found with id: " + paiementDTO.getDossierId()));
            paiement.setDossier(dossier);
        }
        
        if (paiementDTO.getFactureId() != null) {
            Facture facture = factureRepository.findById(paiementDTO.getFactureId())
                    .orElseThrow(() -> new EntityNotFoundException("Facture not found with id: " + paiementDTO.getFactureId()));
            paiement.setFacture(facture);
        }
        
        paiement.setMontant(paiementDTO.getMontant());
        paiement.setDevise(paiementDTO.getDevise());
        paiement.setMethode(paiementDTO.getMethode());
        paiement.setDatePaiement(paiementDTO.getDatePaiement());
        paiement.setNumeroReference(paiementDTO.getNumeroReference());
        paiement.setBanqueReference(paiementDTO.getBanqueReference());
        paiement.setNotes(paiementDTO.getNotes());
        paiement.setStatut(paiementDTO.getStatut());
        paiement.setCheminJustificatif(paiementDTO.getCheminJustificatif());
        
        if (paiementDTO.getUtilisateurCreationId() != null) {
            Utilisateur utilisateur = userRepository.findById(paiementDTO.getUtilisateurCreationId())
                    .orElseThrow(() -> new EntityNotFoundException("Utilisateur not found with id: " + paiementDTO.getUtilisateurCreationId()));
            paiement.setUtilisateurCreation(utilisateur);
        }
        
        return paiement;
    }
    
    /**
     * Update an existing Paiement entity with data from a DTO
     * @param paiement the entity to update
     * @param paiementDTO the DTO containing the new data
     */
    private void updatePaiementFromDTO(Paiement paiement, PaiementDTO paiementDTO) {
        // Only update client if specified in DTO
        if (paiementDTO.getClientId() != null) {
            Client client = clientRepository.findById(paiementDTO.getClientId())
                    .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + paiementDTO.getClientId()));
            paiement.setClient(client);
        }
        
        // Only update dossier if specified in DTO
        if (paiementDTO.getDossierId() != null) {
            Dossier dossier = dossierRepository.findById(paiementDTO.getDossierId())
                    .orElseThrow(() -> new EntityNotFoundException("Dossier not found with id: " + paiementDTO.getDossierId()));
            paiement.setDossier(dossier);
        }
        
        // Only update facture if specified in DTO
        if (paiementDTO.getFactureId() != null) {
            Facture facture = factureRepository.findById(paiementDTO.getFactureId())
                    .orElseThrow(() -> new EntityNotFoundException("Facture not found with id: " + paiementDTO.getFactureId()));
            paiement.setFacture(facture);
        }
        
        // Update primitive fields
        if (paiementDTO.getMontant() != null) {
            paiement.setMontant(paiementDTO.getMontant());
        }
        if (paiementDTO.getDevise() != null) {
            paiement.setDevise(paiementDTO.getDevise());
        }
        if (paiementDTO.getMethode() != null) {
            paiement.setMethode(paiementDTO.getMethode());
        }
        if (paiementDTO.getDatePaiement() != null) {
            paiement.setDatePaiement(paiementDTO.getDatePaiement());
        }
        if (paiementDTO.getNumeroReference() != null) {
            paiement.setNumeroReference(paiementDTO.getNumeroReference());
        }
        if (paiementDTO.getBanqueReference() != null) {
            paiement.setBanqueReference(paiementDTO.getBanqueReference());
        }
        if (paiementDTO.getNotes() != null) {
            paiement.setNotes(paiementDTO.getNotes());
        }
        if (paiementDTO.getStatut() != null) {
            paiement.setStatut(paiementDTO.getStatut());
        }
        // Do not update dateCreation as it's a creation timestamp
        
        // Only update utilisateurCreation if specified in DTO
        if (paiementDTO.getUtilisateurCreationId() != null) {
            Utilisateur utilisateur = userRepository.findById(paiementDTO.getUtilisateurCreationId())
                    .orElseThrow(() -> new EntityNotFoundException("Utilisateur not found with id: " + paiementDTO.getUtilisateurCreationId()));
            paiement.setUtilisateurCreation(utilisateur);
        }
    }
}