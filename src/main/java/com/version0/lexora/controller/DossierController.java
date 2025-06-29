package com.version0.lexora.controller;

import com.version0.lexora.dto.DossierDTO;
import com.version0.lexora.service.DossierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

/**
 * REST Controller for Dossier operations
 */
@RestController
@RequestMapping("/api/dossiers")
public class DossierController {

    private final DossierService dossierService;

    public DossierController(DossierService dossierService) {
        this.dossierService = dossierService;
    }

    /**
     * Get all dossiers
     * 
     * @return List of all dossiers
     */
    @GetMapping
    public ResponseEntity<List<DossierDTO>> getAllDossiers() {
        return ResponseEntity.ok(dossierService.getAllDossiers());
    }

    /**
     * Get dossier by ID
     * 
     * @param id Dossier ID
     * @return Dossier with matching ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DossierDTO> getDossierById(@PathVariable Long id) {
        return dossierService.getDossierById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new dossier
     * 
     * @param dossierDTO Dossier data transfer object
     * @return Created dossier
     */
    @PostMapping
    public ResponseEntity<?> createDossier(@Valid @RequestBody DossierDTO dossierDTO) {
        try {
            System.out.println("تم استلام طلب إنشاء قضية جديدة: " + dossierDTO.getTitre());

            DossierDTO savedDossier = dossierService.saveDossier(dossierDTO);

            System.out.println("تم إنشاء القضية بنجاح برقم: " + savedDossier.getIdDossier());

            return new ResponseEntity<>(savedDossier, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            System.err.println("خطأ في إنشاء القضية: " + e.getMessage());
            e.printStackTrace();

            // إرجاع رسالة خطأ واضحة
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("فشل في إنشاء القضية: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("خطأ غير متوقع في إنشاء القضية: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("خطأ داخلي في الخادم"));
        }
    }

    // فئة مساعدة لرسائل الخطأ
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    /**
     * Update existing dossier
     * 
     * @param id         Dossier ID
     * @param dossierDTO Updated dossier data
     * @return Updated dossier
     */
    @PutMapping("/{id}")
    public ResponseEntity<DossierDTO> updateDossier(@PathVariable Long id, @RequestBody DossierDTO dossierDTO) {
        return ResponseEntity.ok(dossierService.updateDossier(id, dossierDTO));
    }

    /**
     * Delete dossier by ID
     * 
     * @param id Dossier ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDossier(@PathVariable Long id) {
        dossierService.deleteDossier(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get dossiers by client ID
     * 
     * @param clientId Client ID
     * @return List of dossiers belonging to the client
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<DossierDTO>> getDossiersByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(dossierService.getDossiersByClientId(clientId));
    }

    /**
     * Get dossiers by status
     * 
     * @param statut Dossier status
     * @return List of dossiers with matching status
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<DossierDTO>> getDossiersByStatus(@PathVariable String statut) {
        return ResponseEntity.ok(dossierService.getDossiersByStatus(statut));
    }

    /**
     * Get dossiers by type
     * 
     * @param type Dossier type
     * @return List of dossiers with matching type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<DossierDTO>> getDossiersByType(@PathVariable String type) {
        return ResponseEntity.ok(dossierService.getDossiersByType(type));
    }

    /**
     * Get dossiers by priority
     * 
     * @param priorite Dossier priority
     * @return List of dossiers with matching priority
     */
    @GetMapping("/priorite/{priorite}")
    public ResponseEntity<List<DossierDTO>> getDossiersByPriority(@PathVariable String priorite) {
        return ResponseEntity.ok(dossierService.getDossiersByPriority(priorite));
    }
}