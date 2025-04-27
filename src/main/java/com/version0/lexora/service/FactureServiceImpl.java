package com.version0.lexora.service;

import com.version0.lexora.dto.ElementFactureDTO;
import com.version0.lexora.dto.FactureDTO;
import com.version0.lexora.model.Client;
import com.version0.lexora.model.Dossier;
import com.version0.lexora.model.ElementFacture;
import com.version0.lexora.model.Facture;
import com.version0.lexora.repository.ClientRepository;
import com.version0.lexora.repository.DossierRepository;
import com.version0.lexora.repository.FactureRepository;
import com.version0.lexora.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of FactureService interface
 */
@Service
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final ClientRepository clientRepository;
    private final DossierRepository dossierRepository;
    private final UserRepository userRepository;

    public FactureServiceImpl(
            FactureRepository factureRepository,
            ClientRepository clientRepository,
            DossierRepository dossierRepository,
            UserRepository userRepository) {
        this.factureRepository = factureRepository;
        this.clientRepository = clientRepository;
        this.dossierRepository = dossierRepository;
        this.userRepository = userRepository;
    }

    /**
     * Convert Facture entity to FactureDTO
     */
    private FactureDTO convertToDTO(Facture facture) {
        if (facture == null) {
            return null;
        }

        FactureDTO dto = new FactureDTO();
        dto.setIdFacture(facture.getIdFacture());
        dto.setNumero(facture.getNumero());
        
        if (facture.getClient() != null) {
            dto.setClientId(facture.getClient().getIdClient());
            dto.setClientNom(facture.getClient().getNom());
        }
        
        if (facture.getDossier() != null) {
            dto.setDossierId(facture.getDossier().getIdDossier());
            dto.setDossierReference(facture.getDossier().getReference());
        }
        
        dto.setMontantTotal(facture.getMontantTotal());
        dto.setMontantPaye(facture.getMontantPaye());
        dto.setMontantRestant(facture.getMontantRestant());
        dto.setTva(facture.getTva());
        dto.setDevise(facture.getDevise());
        dto.setStatut(facture.getStatut());
        dto.setDateEmission(facture.getDateEmission());
        dto.setDateEcheance(facture.getDateEcheance());
        dto.setDateCreation(facture.getDateCreation());
        dto.setNotes(facture.getNotes());
        dto.setNombrePaiements(facture.getPaiements() != null ? facture.getPaiements().size() : 0);
        
        if (facture.getUtilisateurCreation() != null) {
            dto.setUtilisateurCreationId(facture.getUtilisateurCreation().getIdUtilisateur());
            dto.setUtilisateurCreationNom(facture.getUtilisateurCreation().getNom() + " " + 
                                         facture.getUtilisateurCreation().getPrenom());
        }
        
        // Convert invoice elements
        if (facture.getElements() != null && !facture.getElements().isEmpty()) {
            Set<ElementFactureDTO> elementDTOs = facture.getElements().stream()
                    .map(this::convertElementToDTO)
                    .collect(Collectors.toSet());
            dto.setElements(elementDTOs);
        }
        
        return dto;
    }

    /**
     * Convert ElementFacture entity to ElementFactureDTO
     */
    private ElementFactureDTO convertElementToDTO(ElementFacture element) {
        ElementFactureDTO dto = new ElementFactureDTO();
        dto.setIdElementFacture(element.getIdElement());
        dto.setDescription(element.getDescription());
        dto.setQuantite(new BigDecimal(element.getQuantite())); // Convert Integer to BigDecimal
        dto.setPrixUnitaire(element.getPrixUnitaire());
        dto.setMontant(element.getMontant());
        return dto;
    }

    /**
     * Convert ElementFactureDTO to ElementFacture entity
     */
    private ElementFacture convertElementToEntity(ElementFactureDTO dto) {
        ElementFacture element = new ElementFacture();
        element.setIdElement(dto.getIdElementFacture());
        element.setDescription(dto.getDescription());
        element.setQuantite(dto.getQuantite().intValue()); // Convert BigDecimal to Integer
        element.setPrixUnitaire(dto.getPrixUnitaire());
        element.setMontant(dto.getMontant());
        return element;
    }

    /**
     * Convert FactureDTO to Facture entity
     */
    private Facture convertToEntity(FactureDTO factureDTO) {
        if (factureDTO == null) {
            return null;
        }

        Facture facture = new Facture();
        facture.setIdFacture(factureDTO.getIdFacture());
        facture.setNumero(factureDTO.getNumero());
        facture.setMontantTotal(factureDTO.getMontantTotal());
        facture.setMontantPaye(factureDTO.getMontantPaye() != null ? factureDTO.getMontantPaye() : BigDecimal.ZERO);
        facture.setMontantRestant(factureDTO.getMontantRestant() != null ? 
                factureDTO.getMontantRestant() : factureDTO.getMontantTotal());
        facture.setTva(factureDTO.getTva());
        facture.setDevise(factureDTO.getDevise());
        facture.setStatut(factureDTO.getStatut());
        facture.setDateEmission(factureDTO.getDateEmission());
        facture.setDateEcheance(factureDTO.getDateEcheance());
        
        // If it's a new invoice, set the creation date to current date
        if (factureDTO.getDateCreation() == null) {
            facture.setDateCreation(LocalDate.now());
        } else {
            facture.setDateCreation(factureDTO.getDateCreation());
        }
        
        facture.setNotes(factureDTO.getNotes());

        // Set client if clientId is provided
        if (factureDTO.getClientId() != null) {
            clientRepository.findById(factureDTO.getClientId())
                    .ifPresent(facture::setClient);
        }

        // Set dossier if dossierId is provided
        if (factureDTO.getDossierId() != null) {
            dossierRepository.findById(factureDTO.getDossierId())
                    .ifPresent(facture::setDossier);
        }

        // Set utilisateurCreation if utilisateurCreationId is provided
        if (factureDTO.getUtilisateurCreationId() != null) {
            userRepository.findById(factureDTO.getUtilisateurCreationId())
                    .ifPresent(facture::setUtilisateurCreation);
        }

        // Convert invoice elements
        if (factureDTO.getElements() != null && !factureDTO.getElements().isEmpty()) {
            Set<ElementFacture> elements = factureDTO.getElements().stream()
                    .map(this::convertElementToEntity)
                    .collect(Collectors.toSet());
            
            for (ElementFacture element : elements) {
                facture.addElement(element);
            }
        }

        return facture;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FactureDTO> getAllFactures() {
        return factureRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FactureDTO> getFactureById(Long id) {
        return factureRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public FactureDTO saveFacture(FactureDTO factureDTO) {
        if (factureDTO.getNumero() == null || factureDTO.getNumero().isEmpty()) {
            int year = LocalDate.now().getYear();
            
            // Count existing invoices for this year to generate sequential number
            long count = factureRepository.findAll().stream()
                    .filter(f -> f.getNumero() != null && f.getNumero().startsWith("INV-" + year))
                    .count() + 1;
           
            factureDTO.setNumero(String.format("INV-%d-%03d", year, count));
        }
        
        // Calculate total amount from invoice elements if needed
        if (factureDTO.getMontantTotal() == null || factureDTO.getMontantTotal().compareTo(BigDecimal.ZERO) == 0) {
            BigDecimal total = factureDTO.getElements().stream()
                    .map(ElementFactureDTO::getMontant)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            factureDTO.setMontantTotal(total);
        }
        
        // Set initial status if not provided
        if (factureDTO.getStatut() == null || factureDTO.getStatut().isEmpty()) {
            factureDTO.setStatut("non payée");
        }
        
        Facture facture = convertToEntity(factureDTO);
        facture = factureRepository.save(facture);
        return convertToDTO(facture);
    }

    @Override
    @Transactional
    public FactureDTO updateFacture(Long id, FactureDTO factureDTO) {
        Optional<Facture> existingFactureOptional = factureRepository.findById(id);

        if (!existingFactureOptional.isPresent()) {
            throw new RuntimeException("Facture with ID " + id + " not found");
        }

        // Get the existing entity to preserve certain values
        Facture existingFacture = existingFactureOptional.get();

        // Update fields but preserve the ID
        Facture updatedFacture = convertToEntity(factureDTO);
        updatedFacture.setIdFacture(id);

        // If dateCreation was not provided, keep the original
        if (factureDTO.getDateCreation() == null) {
            updatedFacture.setDateCreation(existingFacture.getDateCreation());
        }

        // If client was not provided, keep the original
        if (factureDTO.getClientId() == null && existingFacture.getClient() != null) {
            updatedFacture.setClient(existingFacture.getClient());
        }

        // If dossier was not provided, keep the original
        if (factureDTO.getDossierId() == null && existingFacture.getDossier() != null) {
            updatedFacture.setDossier(existingFacture.getDossier());
        }

        // If utilisateurCreation was not provided, keep the original
        if (factureDTO.getUtilisateurCreationId() == null && existingFacture.getUtilisateurCreation() != null) {
            updatedFacture.setUtilisateurCreation(existingFacture.getUtilisateurCreation());
        }

        // Keep references to related entities if not provided in the DTO
        if (factureDTO.getElements() == null || factureDTO.getElements().isEmpty()) {
            updatedFacture.setElements(existingFacture.getElements());
        }
        updatedFacture.setPaiements(existingFacture.getPaiements());

        Facture savedFacture = factureRepository.save(updatedFacture);
        return convertToDTO(savedFacture);
    }

    @Override
    @Transactional
    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesByClientId(Long clientId) {
        Optional<Client> clientOptional = clientRepository.findById(clientId);
        if (!clientOptional.isPresent()) {
            throw new RuntimeException("Client with ID " + clientId + " not found");
        }

        Client client = clientOptional.get();
        return factureRepository.findByClient(client).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesByDossierId(Long dossierId) {
        Optional<Dossier> dossierOptional = dossierRepository.findById(dossierId);
        if (!dossierOptional.isPresent()) {
            throw new RuntimeException("Dossier with ID " + dossierId + " not found");
        }

        Dossier dossier = dossierOptional.get();
        return factureRepository.findByDossier(dossier).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesByStatut(String statut) {
        return factureRepository.findByStatut(statut).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesByEmissionDateRange(LocalDate startDate, LocalDate endDate) {
        return factureRepository.findByDateEmissionBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesByDueDateRange(LocalDate startDate, LocalDate endDate) {
        return factureRepository.findByDateEcheanceBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FactureDTO> getOverdueFactures() {
        LocalDate today = LocalDate.now();
        
        // Get all invoices with due date before today
        List<Facture> overdueFactures = factureRepository.findByDateEcheanceBefore(today);
        
        // Filter to only include those that are not fully paid
        return overdueFactures.stream()
                .filter(f -> !"payée".equals(f.getStatut()) && !"annulée".equals(f.getStatut()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<?> generateInvoicePdf(Long id) {
        Optional<Facture> factureOptional = factureRepository.findById(id);
        if (!factureOptional.isPresent()) {
            throw new RuntimeException("Facture with ID " + id + " not found");
        }

        Facture facture = factureOptional.get();
        
        // In a real implementation, this would generate a PDF
        // For now, we'll return a simple byte array with invoice information
        
        String invoiceData = String.format(
            "Invoice %s\n" +
            "Client: %s\n" +
            "Date: %s\n" + 
            "Due Date: %s\n" +
            "Amount: %s %s\n" +
            "Status: %s",
            facture.getNumero(),
            facture.getClient() != null ? facture.getClient().getNom() : "N/A",
            facture.getDateEmission(),
            facture.getDateEcheance(),
            facture.getMontantTotal(),
            facture.getDevise(),
            facture.getStatut()
        );
        
        byte[] pdfContent = invoiceData.getBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", facture.getNumero() + ".pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfContent);
    }
}