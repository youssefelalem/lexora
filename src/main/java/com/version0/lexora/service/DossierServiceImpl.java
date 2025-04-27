package com.version0.lexora.service;

import com.version0.lexora.dto.DossierDTO;
import com.version0.lexora.model.Client;
import com.version0.lexora.model.Dossier;
import com.version0.lexora.repository.ClientRepository;
import com.version0.lexora.repository.DossierRepository;
import com.version0.lexora.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of DossierService interface
 */
@Service
public class DossierServiceImpl implements DossierService {

    private final DossierRepository dossierRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    @Autowired
    public DossierServiceImpl(
            DossierRepository dossierRepository,
            ClientRepository clientRepository,
            UserRepository userRepository) {
        this.dossierRepository = dossierRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    /**
     * Convert Dossier entity to DossierDTO
     */
    private DossierDTO convertToDTO(Dossier dossier) {
        if (dossier == null) {
            return null;
        }

        DossierDTO dto = new DossierDTO();
        dto.setIdDossier(dossier.getIdDossier());
        dto.setReference(dossier.getReference());
        dto.setTitre(dossier.getTitre());
        dto.setDescription(dossier.getDescription());
        
        if (dossier.getClient() != null) {
            dto.setClientId(dossier.getClient().getIdClient());
            dto.setClientNom(dossier.getClient().getNom());
        }
        
        dto.setType(dossier.getType());
        dto.setTribunal(dossier.getTribunal());
        dto.setAvocat(dossier.getAvocat());
        dto.setFichierNumero(dossier.getFichierNumero());
        dto.setJugeId(dossier.getJugeId());
        dto.setPartieAdverse(dossier.getPartieAdverse());
        dto.setAvocatAdverse(dossier.getAvocatAdverse());
        dto.setStatut(dossier.getStatut());
        dto.setPriorite(dossier.getPriorite());
        dto.setDateInitiale(dossier.getDateInitiale());
        dto.setDateCreation(dossier.getDateCreation());
        
        // Count related entities
        dto.setNombreSessions(dossier.getSessions() != null ? dossier.getSessions().size() : 0);
        dto.setNombreDocuments(dossier.getDocuments() != null ? dossier.getDocuments().size() : 0);
        dto.setNombreFactures(dossier.getFactures() != null ? dossier.getFactures().size() : 0);
        
        if (dossier.getUtilisateurResponsable() != null) {
            dto.setUtilisateurResponsableId(dossier.getUtilisateurResponsable().getIdUtilisateur());
            dto.setUtilisateurResponsableNom(dossier.getUtilisateurResponsable().getNom() + " " + 
                                            dossier.getUtilisateurResponsable().getPrenom());
        }
        
        return dto;
    }

    /**
     * Convert DossierDTO to Dossier entity
     */
    private Dossier convertToEntity(DossierDTO dossierDTO) {
        if (dossierDTO == null) {
            return null;
        }

        Dossier dossier = new Dossier();
        dossier.setIdDossier(dossierDTO.getIdDossier());
        dossier.setReference(dossierDTO.getReference());
        dossier.setTitre(dossierDTO.getTitre());
        dossier.setDescription(dossierDTO.getDescription());
        dossier.setType(dossierDTO.getType());
        dossier.setTribunal(dossierDTO.getTribunal());
        dossier.setAvocat(dossierDTO.getAvocat());
        dossier.setFichierNumero(dossierDTO.getFichierNumero());
        dossier.setJugeId(dossierDTO.getJugeId());
        dossier.setPartieAdverse(dossierDTO.getPartieAdverse());
        dossier.setAvocatAdverse(dossierDTO.getAvocatAdverse());
        dossier.setStatut(dossierDTO.getStatut());
        dossier.setPriorite(dossierDTO.getPriorite());
        
        // If it's a new dossier, set the creation date to current date
        if (dossierDTO.getDateCreation() == null) {
            dossier.setDateCreation(LocalDate.now());
        } else {
            dossier.setDateCreation(dossierDTO.getDateCreation());
        }
        
        // If dateInitiale is not provided, set it to current date
        if (dossierDTO.getDateInitiale() == null) {
            dossier.setDateInitiale(LocalDate.now());
        } else {
            dossier.setDateInitiale(dossierDTO.getDateInitiale());
        }

        // Set client if clientId is provided
        if (dossierDTO.getClientId() != null) {
            clientRepository.findById(dossierDTO.getClientId())
                    .ifPresent(dossier::setClient);
        }

        // Set utilisateurResponsable if utilisateurResponsableId is provided
        if (dossierDTO.getUtilisateurResponsableId() != null) {
            userRepository.findById(dossierDTO.getUtilisateurResponsableId())
                    .ifPresent(dossier::setUtilisateurResponsable);
        }

        return dossier;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DossierDTO> getAllDossiers() {
        return dossierRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DossierDTO> getDossierById(Long id) {
        return dossierRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public DossierDTO saveDossier(DossierDTO dossierDTO) {
        // Generate a reference if not provided (format: C-YYYY-NNN)
        if (dossierDTO.getReference() == null || dossierDTO.getReference().isEmpty()) {
            int year = LocalDate.now().getYear();
            
            // Generate a sequential number by counting existing dossiers for this year
            long count = dossierRepository.findAll().stream()
                    .filter(d -> d.getReference() != null && d.getReference().startsWith("C-" + year))
                    .count() + 1;
            
            // Create reference in format C-YYYY-NNN (for example C-2025-001)
            // C is for Case, YYYY is the current year, NNN is the sequential number
            dossierDTO.setReference(String.format("C-%d-%03d", year, count));
        }
        
        Dossier dossier = convertToEntity(dossierDTO);
        dossier = dossierRepository.save(dossier);
        return convertToDTO(dossier);
    }

    @Override
    @Transactional
    public DossierDTO updateDossier(Long id, DossierDTO dossierDTO) {
        Optional<Dossier> existingDossierOptional = dossierRepository.findById(id);

        if (!existingDossierOptional.isPresent()) {
            throw new RuntimeException("Dossier with ID " + id + " not found");
        }

        // Get the existing entity to preserve certain values
        Dossier existingDossier = existingDossierOptional.get();

        // Update fields but preserve the ID
        Dossier updatedDossier = convertToEntity(dossierDTO);
        updatedDossier.setIdDossier(id);

        // If dateCreation was not provided, keep the original
        if (dossierDTO.getDateCreation() == null) {
            updatedDossier.setDateCreation(existingDossier.getDateCreation());
        }

        // If client was not provided, keep the original
        if (dossierDTO.getClientId() == null && existingDossier.getClient() != null) {
            updatedDossier.setClient(existingDossier.getClient());
        }

        // If utilisateurResponsable was not provided, keep the original
        if (dossierDTO.getUtilisateurResponsableId() == null && existingDossier.getUtilisateurResponsable() != null) {
            updatedDossier.setUtilisateurResponsable(existingDossier.getUtilisateurResponsable());
        }

        // Keep references to related entities
        updatedDossier.setSessions(existingDossier.getSessions());
        updatedDossier.setDocuments(existingDossier.getDocuments());
        updatedDossier.setFactures(existingDossier.getFactures());

        Dossier savedDossier = dossierRepository.save(updatedDossier);
        return convertToDTO(savedDossier);
    }

    @Override
    @Transactional
    public void deleteDossier(Long id) {
        dossierRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DossierDTO> getDossiersByClientId(Long clientId) {
        Optional<Client> clientOptional = clientRepository.findById(clientId);
        if (!clientOptional.isPresent()) {
            throw new RuntimeException("Client with ID " + clientId + " not found");
        }

        Client client = clientOptional.get();
        return dossierRepository.findByClient(client).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DossierDTO> getDossiersByStatus(String statut) {
        return dossierRepository.findByStatut(statut).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DossierDTO> getDossiersByType(String type) {
        return dossierRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DossierDTO> getDossiersByPriority(String priorite) {
        return dossierRepository.findByPriorite(priorite).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}