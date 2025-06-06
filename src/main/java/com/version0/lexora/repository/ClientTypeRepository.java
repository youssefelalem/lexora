package com.version0.lexora.repository;

import com.version0.lexora.model.ClientType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * مستودع أنواع العملاء
 * Client Types Repository interface for database operations
 */
@Repository
public interface ClientTypeRepository extends JpaRepository<ClientType, Long> {
    /**
     * البحث عن نوع عميل بالاسم (غير حساس لحالة الأحرف)
     * Find client type by name (case insensitive)
     */
    Optional<ClientType> findByNameIgnoreCase(String name);

    /**
     * التحقق من وجود نوع عميل بالاسم (غير حساس لحالة الأحرف)
     * Check if client type exists by name (case insensitive)
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * البحث عن نوع عميل بالاسم
     * Find client type by name
     */
    Optional<ClientType> findByName(String name);

    /**
     * التحقق من وجود نوع عميل بالاسم
     * Check if client type exists by name
     */
    boolean existsByName(String name);

    /**
     * البحث عن نوع عميل بالاسم مع استبعاد معرف معين
     * Find client type by name excluding specific id
     */
    boolean existsByNameAndIdNot(String name, Long id);

    /**
     * البحث في أنواع العملاء بالاسم أو الوصف
     * Search client types by name or description
     */
    @Query("SELECT ct FROM ClientType ct WHERE " +
            "LOWER(ct.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(ct.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<ClientType> searchByNameOrDescription(@Param("searchTerm") String searchTerm);

    /**
     * الحصول على أنواع العملاء مرتبة بعدد العملاء تنازلياً
     * Get client types ordered by client count descending
     */
    List<ClientType> findAllByOrderByClientCountDesc();

    /**
     * الحصول على أنواع العملاء مرتبة بتاريخ الإنشاء تنازلياً
     * Get client types ordered by creation date descending
     */
    List<ClientType> findAllByOrderByCreatedDateDesc();

    /**
     * الحصول على عدد إجمالي العملاء لجميع الأنواع
     * Get total client count for all types
     */
    @Query("SELECT SUM(ct.clientCount) FROM ClientType ct")
    Integer getTotalClientCount();
}
