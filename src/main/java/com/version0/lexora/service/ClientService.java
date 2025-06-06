package com.version0.lexora.service;

import com.version0.lexora.dto.ClientDTO;
import com.version0.lexora.dto.ClientStatisticsDTO;
import com.version0.lexora.dto.ClientCaseDTO;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

/**
 * Service interface for Client operations
 */
public interface ClientService {

    /**
     * Get all clients
     * 
     * @return List of all clients
     */
    List<ClientDTO> getAllClients();

    /**
     * Get client by ID
     * 
     * @param id Client ID
     * @return Optional containing the client if found
     */
    Optional<ClientDTO> getClientById(Long id);

    /**
     * Save a new client
     * 
     * @param clientDTO Client data to save
     * @return Saved client
     */
    ClientDTO saveClient(ClientDTO clientDTO);

    /**
     * Update an existing client
     * 
     * @param id        Client ID to update
     * @param clientDTO New client data
     * @return Updated client
     */
    ClientDTO updateClient(Long id, ClientDTO clientDTO);

    /**
     * Delete a client by ID
     * 
     * @param id Client ID to delete
     */
    void deleteClient(Long id);

    /**
     * Get clients by type
     * 
     * @param type Client type
     * @return List of clients with the specified type
     */
    List<ClientDTO> getClientsByType(String type);

    /**
     * Get clients by status
     * 
     * @param statut Client status
     * @return List of clients with the specified status
     */
    List<ClientDTO> getClientsByStatus(String statut);

    /**
     * Get client statistics including financial summary
     * 
     * @param clientId Client ID
     * @return Client statistics
     */
    ClientStatisticsDTO getClientStatistics(Long clientId);

    /**
     * Get total amount received for a client
     * 
     * @param clientId Client ID
     * @return Total received amount
     */
    BigDecimal getClientTotalReceived(Long clientId);

    /**
     * Get total amount paid for a client
     * 
     * @param clientId Client ID
     * @return Total paid amount
     */
    BigDecimal getClientTotalPaid(Long clientId);

    /**
     * Get client balance
     * 
     * @param clientId Client ID
     * @return Client balance
     */
    BigDecimal getClientBalance(Long clientId);

    /**
     * Get all cases for a specific client
     * 
     * @param clientId Client ID
     * @return List of client cases
     */
    List<ClientCaseDTO> getClientCases(Long clientId);

    /**
     * Get cases for a client by status
     * 
     * @param clientId Client ID
     * @param status   Case status
     * @return List of client cases with specified status
     */
    List<ClientCaseDTO> getClientCasesByStatus(Long clientId, String status);
}