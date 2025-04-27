package com.version0.lexora.service;

import com.version0.lexora.dto.ClientDTO;
import com.version0.lexora.model.Client;
import com.version0.lexora.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
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
        return convertToDTO(client);
    }

    @Override
    @Transactional
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Optional<Client> existingClientOptional = clientRepository.findById(id);
        
        if (existingClientOptional.isPresent()) {
            Client existingClient = existingClientOptional.get();
            
            // Update fields but preserve the ID
            Client updatedClient = convertToEntity(clientDTO);
            updatedClient.setIdClient(id);
            
            // If dateCreation was not provided, keep the original
            if (clientDTO.getDateCreation() == null) {
                updatedClient.setDateCreation(existingClient.getDateCreation());
            }
            
            Client savedClient = clientRepository.save(updatedClient);
            return convertToDTO(savedClient);
        } else {
            throw new RuntimeException("Client with ID " + id + " not found");
        }
    }

    @Override
    @Transactional
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
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
}