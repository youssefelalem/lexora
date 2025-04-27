package com.version0.lexora.controller;

import com.version0.lexora.dto.ClientDTO;
import com.version0.lexora.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Client operations
 */
@RestController
@RequestMapping("/api/clients")
public class ClientController {
    
    private final ClientService clientService;
    
    @Autowired
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }
    
    /**
     * Get all clients
     * @return List of all clients
     */
    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }
    
    /**
     * Get client by ID
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
     * @param clientDTO Client data transfer object
     * @return Created client
     */
    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO) {
        return new ResponseEntity<>(clientService.saveClient(clientDTO), HttpStatus.CREATED);
    }
    
    /**
     * Update existing client
     * @param id Client ID
     * @param clientDTO Updated client data
     * @return Updated client
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long id, @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.updateClient(id, clientDTO));
    }
    
    /**
     * Delete client by ID
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
     * @param type Client type
     * @return List of clients with matching type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ClientDTO>> getClientsByType(@PathVariable String type) {
        return ResponseEntity.ok(clientService.getClientsByType(type));
    }
    
    /**
     * Get clients by status
     * @param statut Client status
     * @return List of clients with matching status
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<ClientDTO>> getClientsByStatus(@PathVariable String statut) {
        return ResponseEntity.ok(clientService.getClientsByStatus(statut));
    }
}