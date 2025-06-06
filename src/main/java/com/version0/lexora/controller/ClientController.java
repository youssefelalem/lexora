package com.version0.lexora.controller;

import com.version0.lexora.dto.ClientDTO;
import com.version0.lexora.dto.ClientStatisticsDTO;
import com.version0.lexora.dto.ClientCaseDTO;
import com.version0.lexora.service.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for Client operations
 */
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * Get all clients
     * 
     * @return List of all clients
     */
    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    /**
     * Get client by ID
     * 
     * @param id Client ID
     * @return Client with matching ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new client
     * 
     * @param clientDTO Client data transfer object
     * @return Created client
     */
    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO) {
        return new ResponseEntity<>(clientService.saveClient(clientDTO), HttpStatus.CREATED);
    }

    /**
     * Update existing client
     * 
     * @param id        Client ID
     * @param clientDTO Updated client data
     * @return Updated client
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long id, @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.updateClient(id, clientDTO));
    }

    /**
     * Delete client by ID
     * 
     * @param id Client ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get clients by type
     * 
     * @param type Client type
     * @return List of clients with matching type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ClientDTO>> getClientsByType(@PathVariable String type) {
        return ResponseEntity.ok(clientService.getClientsByType(type));
    }

    /**
     * Get clients by status
     * 
     * @param statut Client status
     * @return List of clients with matching status
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<ClientDTO>> getClientsByStatus(@PathVariable String statut) {
        return ResponseEntity.ok(clientService.getClientsByStatus(statut));
    }

    /**
     * Get client statistics including financial summary
     * 
     * @param id Client ID
     * @return Client statistics
     */
    @GetMapping("/{id}/statistics")
    public ResponseEntity<ClientStatisticsDTO> getClientStatistics(@PathVariable Long id) {
        try {
            ClientStatisticsDTO statistics = clientService.getClientStatistics(id);
            return ResponseEntity.ok(statistics);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get total amount received for a client
     * 
     * @param id Client ID
     * @return Total received amount
     */
    @GetMapping("/{id}/total-received")
    public ResponseEntity<BigDecimal> getClientTotalReceived(@PathVariable Long id) {
        try {
            BigDecimal totalReceived = clientService.getClientTotalReceived(id);
            return ResponseEntity.ok(totalReceived);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get total amount paid for a client
     * 
     * @param id Client ID
     * @return Total paid amount
     */
    @GetMapping("/{id}/total-paid")
    public ResponseEntity<BigDecimal> getClientTotalPaid(@PathVariable Long id) {
        try {
            BigDecimal totalPaid = clientService.getClientTotalPaid(id);
            return ResponseEntity.ok(totalPaid);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get client balance
     * 
     * @param id Client ID
     * @return Client balance
     */
    @GetMapping("/{id}/balance")
    public ResponseEntity<BigDecimal> getClientBalance(@PathVariable Long id) {
        try {
            BigDecimal balance = clientService.getClientBalance(id);
            return ResponseEntity.ok(balance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get client financial summary (includes all financial data)
     * 
     * @param id Client ID
     * @return Client financial summary
     */
    @GetMapping("/{id}/financial-summary")
    public ResponseEntity<ClientStatisticsDTO> getClientFinancialSummary(@PathVariable Long id) {
        try {
            ClientStatisticsDTO summary = clientService.getClientStatistics(id);
            return ResponseEntity.ok(summary);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all cases for a specific client
     * 
     * @param id Client ID
     * @return List of client cases
     */
    @GetMapping("/{id}/cases")
    public ResponseEntity<List<ClientCaseDTO>> getClientCases(@PathVariable Long id) {
        try {
            List<ClientCaseDTO> cases = clientService.getClientCases(id);
            return ResponseEntity.ok(cases);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get cases for a client by status
     * 
     * @param id     Client ID
     * @param status Case status
     * @return List of client cases with specified status
     */
    @GetMapping("/{id}/cases/status/{status}")
    public ResponseEntity<List<ClientCaseDTO>> getClientCasesByStatus(
            @PathVariable Long id,
            @PathVariable String status) {
        try {
            List<ClientCaseDTO> cases = clientService.getClientCasesByStatus(id, status);
            return ResponseEntity.ok(cases);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get client dossiers (works) - alternative endpoint for cases
     * 
     * @param id Client ID
     * @return List of client dossiers
     */
    @GetMapping("/{id}/dossiers")
    public ResponseEntity<List<ClientCaseDTO>> getClientWorks(@PathVariable Long id) {
        try {
            List<ClientCaseDTO> dossiers = clientService.getClientCases(id);
            return ResponseEntity.ok(dossiers);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}