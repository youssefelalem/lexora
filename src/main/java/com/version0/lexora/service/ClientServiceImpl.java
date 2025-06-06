package com.version0.lexora.service;

import com.version0.lexora.dto.ClientDTO;
import com.version0.lexora.dto.ClientStatisticsDTO;
import com.version0.lexora.dto.ClientCaseDTO;
import com.version0.lexora.model.Client;
import com.version0.lexora.model.Dossier;
import com.version0.lexora.model.Facture;
import com.version0.lexora.model.Paiement;
import com.version0.lexora.model.Depense;
import com.version0.lexora.repository.ClientRepository;
import com.version0.lexora.repository.DossierRepository;
import com.version0.lexora.repository.FactureRepository;
import com.version0.lexora.repository.PaiementRepository;
import com.version0.lexora.repository.DepenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of ClientService interface
 */
@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final DossierRepository dossierRepository;
    private final FactureRepository factureRepository;
    private final PaiementRepository paiementRepository;
    private final DepenseRepository depenseRepository;
    private final ClientTypeService clientTypeService;

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository,
            DossierRepository dossierRepository,
            FactureRepository factureRepository,
            PaiementRepository paiementRepository,
            DepenseRepository depenseRepository,
            ClientTypeService clientTypeService) {
        this.clientRepository = clientRepository;
        this.dossierRepository = dossierRepository;
        this.factureRepository = factureRepository;
        this.paiementRepository = paiementRepository;
        this.depenseRepository = depenseRepository;
        this.clientTypeService = clientTypeService;
    }

    /**
     * Convert Client entity to ClientDTO
     */
    private ClientDTO convertToDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setIdClient(client.getIdClient());
        dto.setNom(client.getNom());
        dto.setContact(client.getContact());
        dto.setEmail(client.getEmail());
        dto.setTelephone(client.getTelephone());
        dto.setAdresse(client.getAdresse());
        dto.setType(client.getType());
        dto.setStatut(client.getStatut());
        dto.setDateCreation(client.getDateCreation());
        dto.setNotes(client.getNotes());
        dto.setNombreDossiers(client.getDossiers() != null ? client.getDossiers().size() : 0);
        return dto;
    }

    /**
     * Convert ClientDTO to Client entity
     */
    private Client convertToEntity(ClientDTO clientDTO) {
        Client client = new Client();
        client.setIdClient(clientDTO.getIdClient());
        client.setNom(clientDTO.getNom());
        client.setContact(clientDTO.getContact());
        client.setEmail(clientDTO.getEmail());
        client.setTelephone(clientDTO.getTelephone());
        client.setAdresse(clientDTO.getAdresse());
        client.setType(clientDTO.getType());
        client.setStatut(clientDTO.getStatut());

        // If it's a new client, set the creation date to current date
        if (clientDTO.getDateCreation() == null) {
            client.setDateCreation(LocalDate.now());
        } else {
            client.setDateCreation(clientDTO.getDateCreation());
        }

        client.setNotes(clientDTO.getNotes());
        return client;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ClientDTO> getClientById(Long id) {
        return clientRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public ClientDTO saveClient(ClientDTO clientDTO) {
        Client client = convertToEntity(clientDTO);
        client = clientRepository.save(client);

        // تحديث عدد العملاء لنوع العميل الجديد
        if (client.getType() != null) {
            clientTypeService.updateClientCountForType(client.getType());
        }
        return convertToDTO(client);
    }

    @Override
    @Transactional
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Optional<Client> existingClientOptional = clientRepository.findById(id);

        if (existingClientOptional.isPresent()) {
            Client existingClient = existingClientOptional.get();
            String oldType = existingClient.getType(); // حفظ النوع القديم

            // Update fields but preserve the ID
            Client updatedClient = convertToEntity(clientDTO);
            updatedClient.setIdClient(id);

            // If dateCreation was not provided, keep the original
            if (clientDTO.getDateCreation() == null) {
                updatedClient.setDateCreation(existingClient.getDateCreation());
            }

            Client savedClient = clientRepository.save(updatedClient);

            // تحديث عدد العملاء للنوع القديم والجديد إذا تغير النوع
            if (oldType != null && !oldType.equals(savedClient.getType())) {
                clientTypeService.updateClientCountForType(oldType);
            }
            if (savedClient.getType() != null) {
                clientTypeService.updateClientCountForType(savedClient.getType());
            }
            return convertToDTO(savedClient);
        } else {
            throw new RuntimeException("Client with ID " + id + " not found");
        }
    }

    @Override
    @Transactional
    public void deleteClient(Long id) {
        // الحصول على نوع العميل قبل الحذف
        Optional<Client> clientOptional = clientRepository.findById(id);
        String clientType = null;
        if (clientOptional.isPresent()) {
            clientType = clientOptional.get().getType();
        }

        clientRepository.deleteById(id);

        // تحديث عدد العملاء بعد الحذف
        if (clientType != null) {
            clientTypeService.updateClientCountForType(clientType);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientDTO> getClientsByType(String type) {
        return clientRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientDTO> getClientsByStatus(String statut) {
        return clientRepository.findByStatut(statut).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClientStatisticsDTO getClientStatistics(Long clientId) {
        Optional<Client> clientOpt = clientRepository.findById(clientId);
        if (!clientOpt.isPresent()) {
            throw new RuntimeException("Client with ID " + clientId + " not found");
        }

        Client client = clientOpt.get();
        ClientStatisticsDTO stats = new ClientStatisticsDTO(clientId, client.getNom());

        // حساب إجمالي المبالغ المستلمة من الفواتير
        BigDecimal totalReceived = factureRepository.findByClientIdClient(clientId)
                .stream()
                .map(Facture::getMontantTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // حساب إجمالي المبالغ المدفوعة
        BigDecimal totalPaid = paiementRepository.findByClientIdClient(clientId)
                .stream()
                .map(Paiement::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // حساب رصيد العميل (المستلم - المدفوع)
        BigDecimal clientBalance = totalReceived.subtract(totalPaid);

        // حساب عدد الملفات
        int totalDossiers = dossierRepository.findByClientIdClient(clientId).size(); // حساب إجمالي المصروفات
        BigDecimal totalExpenses = depenseRepository.findByDossierClientIdClient(clientId)
                .stream()
                .map(Depense::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.setTotalReceived(totalReceived);
        stats.setTotalPaid(totalPaid);
        stats.setClientBalance(clientBalance);
        stats.setTotalDossiers(totalDossiers);
        stats.setTotalInvoices(totalReceived);
        stats.setTotalExpenses(totalExpenses);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getClientTotalReceived(Long clientId) {
        return factureRepository.findByClientIdClient(clientId)
                .stream()
                .map(Facture::getMontantTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getClientTotalPaid(Long clientId) {
        return paiementRepository.findByClientIdClient(clientId)
                .stream()
                .map(Paiement::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getClientBalance(Long clientId) {
        BigDecimal totalReceived = getClientTotalReceived(clientId);
        BigDecimal totalPaid = getClientTotalPaid(clientId);
        return totalReceived.subtract(totalPaid);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientCaseDTO> getClientCases(Long clientId) {
        // نحصل على الملفات (الدوسييهات) للعميل والتي تمثل القضايا
        List<Dossier> dossiers = dossierRepository.findByClientIdClient(clientId);

        return dossiers.stream()
                .map(this::convertDossierToCaseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientCaseDTO> getClientCasesByStatus(Long clientId, String status) {
        List<Dossier> dossiers = dossierRepository.findByClientIdClientAndStatut(clientId, status);

        return dossiers.stream()
                .map(this::convertDossierToCaseDTO)
                .collect(Collectors.toList());
    }

    /**
     * تحويل Dossier إلى ClientCaseDTO
     */
    private ClientCaseDTO convertDossierToCaseDTO(Dossier dossier) {
        ClientCaseDTO caseDTO = new ClientCaseDTO();
        caseDTO.setId(dossier.getIdDossier());
        caseDTO.setTitre(dossier.getTitre());
        caseDTO.setDescription(dossier.getDescription());
        caseDTO.setStatut(dossier.getStatut());
        caseDTO.setDateDebut(dossier.getDateInitiale()); // استخدام getDateInitiale() بدلاً من getDateOuverture()
        caseDTO.setDateFin(null); // لا يوجد تاريخ إغلاق في نموذج Dossier حالياً
        caseDTO.setClientId(dossier.getClient().getIdClient());
        caseDTO.setClientName(dossier.getClient().getNom());
        caseDTO.setDossierId(dossier.getIdDossier());
        caseDTO.setDossierReference(dossier.getReference());
        caseDTO.setTribunal(dossier.getTribunal());
        caseDTO.setTypeAffaire(dossier.getType()); // استخدام getType() بدلاً من getTypeAffaire()
        caseDTO.setPriorite(dossier.getPriorite()); // إضافة الأولوية

        return caseDTO;
    }
}