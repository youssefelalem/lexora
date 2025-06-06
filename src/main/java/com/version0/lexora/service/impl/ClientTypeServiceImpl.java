package com.version0.lexora.service.impl;

import com.version0.lexora.dto.ClientTypeDTO;
import com.version0.lexora.model.ClientType;
import com.version0.lexora.repository.ClientTypeRepository;
import com.version0.lexora.repository.ClientRepository;
import com.version0.lexora.service.ClientTypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * تنفيذ خدمة أنواع العملاء
 * Implementation of ClientTypeService interface
 */
@Service
@Transactional
public class ClientTypeServiceImpl implements ClientTypeService {

    private final ClientTypeRepository clientTypeRepository;
    private final ClientRepository clientRepository;

    public ClientTypeServiceImpl(ClientTypeRepository clientTypeRepository, ClientRepository clientRepository) {
        this.clientTypeRepository = clientTypeRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientTypeDTO> getAllClientTypes() {
        return clientTypeRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClientTypeDTO> getAllClientTypes(Pageable pageable) {
        return clientTypeRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ClientTypeDTO> getClientTypeById(Long id) {
        return clientTypeRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ClientTypeDTO> getClientTypeByName(String name) {
        return clientTypeRepository.findByNameIgnoreCase(name)
                .map(this::convertToDTO);
    }

    @Override
    public ClientTypeDTO createClientType(ClientTypeDTO clientTypeDTO) {
        // التحقق من عدم وجود نوع عميل بنفس الاسم
        if (clientTypeRepository.existsByNameIgnoreCase(clientTypeDTO.getName())) {
            throw new IllegalArgumentException("نوع العميل بهذا الاسم موجود بالفعل");
        }
        ClientType clientType = convertToEntity(clientTypeDTO);
        clientType.setCreatedDate(LocalDate.now());
        clientType.setClientCount(0); // بداية بصفر عملاء

        ClientType savedClientType = clientTypeRepository.save(clientType);
        return convertToDTO(savedClientType);
    }

    @Override
    public ClientTypeDTO updateClientType(Long id, ClientTypeDTO clientTypeDTO) {
        ClientType existingClientType = clientTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("نوع العميل غير موجود"));

        // التحقق من عدم وجود نوع عميل آخر بنفس الاسم
        if (!existingClientType.getName().equalsIgnoreCase(clientTypeDTO.getName()) &&
                clientTypeRepository.existsByNameIgnoreCase(clientTypeDTO.getName())) {
            throw new IllegalArgumentException("نوع العميل بهذا الاسم موجود بالفعل");
        }

        // تحديث البيانات
        existingClientType.setName(clientTypeDTO.getName());
        existingClientType.setDescription(clientTypeDTO.getDescription());
        existingClientType.setColor(clientTypeDTO.getColor());
        existingClientType.setImageUrl(clientTypeDTO.getImageUrl());

        ClientType updatedClientType = clientTypeRepository.save(existingClientType);
        return convertToDTO(updatedClientType);
    }

    @Override
    public boolean deleteClientType(Long id) {
        if (!clientTypeRepository.existsById(id)) {
            return false;
        }

        // التحقق من عدم وجود عملاء مرتبطين بهذا النوع
        ClientType clientType = clientTypeRepository.findById(id).get();
        if (clientType.getClientCount() > 0) {
            throw new IllegalStateException("لا يمكن حذف نوع العميل لأنه مرتبط بعملاء موجودين");
        }

        clientTypeRepository.deleteById(id);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientTypeDTO> searchClientTypes(String searchTerm) {
        return clientTypeRepository.searchByNameOrDescription(searchTerm)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalClientTypesCount() {
        return clientTypeRepository.count();
    }

    @Override
    public void updateClientCount(Long clientTypeId, Long clientCount) {
        ClientType clientType = clientTypeRepository.findById(clientTypeId)
                .orElseThrow(() -> new IllegalArgumentException("نوع العميل غير موجود"));

        clientType.setClientCount(clientCount.intValue());
        clientTypeRepository.save(clientType);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return clientTypeRepository.existsByNameIgnoreCase(name);
    }

    /**
     * تحويل كائن ClientType إلى ClientTypeDTO
     * Convert ClientType entity to ClientTypeDTO
     */
    private ClientTypeDTO convertToDTO(ClientType clientType) {
        ClientTypeDTO dto = new ClientTypeDTO();
        dto.setId(clientType.getId());
        dto.setName(clientType.getName());
        dto.setDescription(clientType.getDescription());
        dto.setColor(clientType.getColor());
        // حساب عدد العملاء الفعلي من قاعدة البيانات
        int actualClientCount = clientRepository.findByType(clientType.getName()).size();
        dto.setClientCount(actualClientCount);
        dto.setImageUrl(clientType.getImageUrl());
        dto.setCreatedDate(clientType.getCreatedDate());
        return dto;
    }

    /**
     * تحويل ClientTypeDTO إلى كائن ClientType
     * Convert ClientTypeDTO to ClientType entity
     */
    private ClientType convertToEntity(ClientTypeDTO dto) {
        ClientType clientType = new ClientType();
        clientType.setId(dto.getId());
        clientType.setName(dto.getName());
        clientType.setDescription(dto.getDescription());
        clientType.setColor(dto.getColor());
        clientType.setClientCount(dto.getClientCount() != null ? dto.getClientCount() : 0);
        clientType.setImageUrl(dto.getImageUrl());
        clientType.setCreatedDate(dto.getCreatedDate());
        return clientType;
    }

    /**
     * تحديث عدد العملاء التلقائي لنوع معين
     * Auto-update client count for a specific client type
     */
    @Transactional
    public void updateClientCountForType(String clientTypeName) {
        Optional<ClientType> clientTypeOptional = clientTypeRepository.findByNameIgnoreCase(clientTypeName);
        if (clientTypeOptional.isPresent()) {
            ClientType clientType = clientTypeOptional.get();
            // حساب العدد الفعلي للعملاء من قاعدة البيانات
            int actualCount = clientRepository.findByType(clientTypeName).size();
            clientType.setClientCount(actualCount);
            clientTypeRepository.save(clientType);
        }
    }

    /**
     * تحديث عدد العملاء لجميع أنواع العملاء
     * Update client count for all client types
     */
    @Transactional
    public void updateAllClientCounts() {
        List<ClientType> allClientTypes = clientTypeRepository.findAll();
        for (ClientType clientType : allClientTypes) {
            int actualCount = clientRepository.findByType(clientType.getName()).size();
            clientType.setClientCount(actualCount);
            clientTypeRepository.save(clientType);
        }
    }
}
