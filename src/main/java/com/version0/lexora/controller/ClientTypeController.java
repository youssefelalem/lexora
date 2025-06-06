package com.version0.lexora.controller;

import com.version0.lexora.dto.ClientTypeDTO;
import com.version0.lexora.service.ClientTypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * وحدة تحكم أنواع العملاء
 * REST Controller for managing client types
 */
@RestController
@RequestMapping("/api/client-types")
@CrossOrigin(origins = "*")
public class ClientTypeController {

    private final ClientTypeService clientTypeService;

    public ClientTypeController(ClientTypeService clientTypeService) {
        this.clientTypeService = clientTypeService;
    }

    /**
     * الحصول على جميع أنواع العملاء
     * Get all client types
     */
    @GetMapping
    public ResponseEntity<List<ClientTypeDTO>> getAllClientTypes() {
        try {
            List<ClientTypeDTO> clientTypes = clientTypeService.getAllClientTypes();
            return ResponseEntity.ok(clientTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * الحصول على أنواع العملاء مع التقسيم إلى صفحات
     * Get client types with pagination
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<ClientTypeDTO>> getAllClientTypesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<ClientTypeDTO> clientTypes = clientTypeService.getAllClientTypes(pageable);

            return ResponseEntity.ok(clientTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * الحصول على نوع عميل بالمعرف
     * Get client type by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClientTypeDTO> getClientTypeById(@PathVariable Long id) {
        try {
            Optional<ClientTypeDTO> clientType = clientTypeService.getClientTypeById(id);
            return clientType.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * الحصول على نوع عميل بالاسم
     * Get client type by name
     */
    @GetMapping("/by-name/{name}")
    public ResponseEntity<ClientTypeDTO> getClientTypeByName(@PathVariable String name) {
        try {
            Optional<ClientTypeDTO> clientType = clientTypeService.getClientTypeByName(name);
            return clientType.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * إنشاء نوع عميل جديد
     * Create new client type
     */
    @PostMapping
    public ResponseEntity<ClientTypeDTO> createClientType(@Valid @RequestBody ClientTypeDTO clientTypeDTO) {
        try {
            ClientTypeDTO createdClientType = clientTypeService.createClientType(clientTypeDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdClientType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * تحديث نوع عميل موجود
     * Update existing client type
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClientTypeDTO> updateClientType(
            @PathVariable Long id,
            @Valid @RequestBody ClientTypeDTO clientTypeDTO) {
        try {
            ClientTypeDTO updatedClientType = clientTypeService.updateClientType(id, clientTypeDTO);
            return ResponseEntity.ok(updatedClientType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * حذف نوع عميل
     * Delete client type
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClientType(@PathVariable Long id) {
        try {
            boolean deleted = clientTypeService.deleteClientType(id);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * البحث في أنواع العملاء
     * Search client types
     */
    @GetMapping("/search")
    public ResponseEntity<List<ClientTypeDTO>> searchClientTypes(
            @RequestParam String searchTerm) {
        try {
            List<ClientTypeDTO> clientTypes = clientTypeService.searchClientTypes(searchTerm);
            return ResponseEntity.ok(clientTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * الحصول على إجمالي عدد أنواع العملاء
     * Get total count of client types
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalClientTypesCount() {
        try {
            long count = clientTypeService.getTotalClientTypesCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * تحديث عدد العملاء لنوع معين
     * Update client count for a specific type
     */
    @PatchMapping("/{id}/client-count")
    public ResponseEntity<Void> updateClientCount(
            @PathVariable Long id,
            @RequestParam Integer clientCount) {
        try {
            clientTypeService.updateClientCount(id, clientCount.longValue());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * تحديث جميع أعداد العملاء لجميع أنواع العملاء
     * Update all client counts for all client types
     */
    @PutMapping("/update-all-counts")
    public ResponseEntity<Void> updateAllClientCounts() {
        try {
            clientTypeService.updateAllClientCounts();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * التحقق من وجود نوع عميل بالاسم
     * Check if client type exists by name
     */
    @GetMapping("/exists/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        try {
            boolean exists = clientTypeService.existsByName(name);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * تحديث عدد العملاء لنوع معين تلقائياً
     * Auto-update client count for a specific type
     */
    @PostMapping("/update-count/{typeName}")
    public ResponseEntity<Void> updateClientCountForType(@PathVariable String typeName) {
        try {
            clientTypeService.updateClientCountForType(typeName);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
