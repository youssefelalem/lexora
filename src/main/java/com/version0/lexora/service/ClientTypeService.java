package com.version0.lexora.service;

import com.version0.lexora.dto.ClientTypeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * واجهة خدمة أنواع العملاء
 * Client Type Service interface
 */
public interface ClientTypeService {

    /**
     * الحصول على جميع أنواع العملاء
     * Get all client types
     */
    List<ClientTypeDTO> getAllClientTypes();

    /**
     * الحصول على أنواع العملاء مع التقسيم إلى صفحات
     * Get client types with pagination
     */
    Page<ClientTypeDTO> getAllClientTypes(Pageable pageable);

    /**
     * الحصول على نوع عميل بالمعرف
     * Get client type by ID
     */
    Optional<ClientTypeDTO> getClientTypeById(Long id);

    /**
     * الحصول على نوع عميل بالاسم
     * Get client type by name
     */
    Optional<ClientTypeDTO> getClientTypeByName(String name);

    /**
     * إنشاء نوع عميل جديد
     * Create new client type
     */
    ClientTypeDTO createClientType(ClientTypeDTO clientTypeDTO);

    /**
     * تحديث نوع عميل موجود
     * Update existing client type
     */
    ClientTypeDTO updateClientType(Long id, ClientTypeDTO clientTypeDTO);

    /**
     * حذف نوع عميل
     * Delete client type
     */
    boolean deleteClientType(Long id);

    /**
     * البحث في أنواع العملاء
     * Search client types
     */
    List<ClientTypeDTO> searchClientTypes(String searchTerm);

    /**
     * الحصول على إجمالي عدد أنواع العملاء
     * Get total count of client types
     */
    long getTotalClientTypesCount();

    /**
     * تحديث عدد العملاء لنوع معين
     * Update client count for specific type
     */
    void updateClientCount(Long clientTypeId, Long clientCount);

    /**
     * التحقق من وجود نوع عميل بالاسم
     * Check if client type exists by name
     */
    boolean existsByName(String name);
}
