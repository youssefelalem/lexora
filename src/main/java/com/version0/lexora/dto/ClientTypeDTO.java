package com.version0.lexora.dto;

import java.time.LocalDate;

/**
 * كائن نقل البيانات لنوع العميل
 * Data Transfer Object for ClientType entity
 */
public class ClientTypeDTO {

    private Long id;
    private String name;
    private String description;
    private String color;
    private Integer clientCount;
    private String imageUrl;
    private LocalDate createdDate;

    // المنشئات - Constructors
    public ClientTypeDTO() {
    }

    public ClientTypeDTO(Long id, String name, String description, String color,
            Integer clientCount, String imageUrl, LocalDate createdDate) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
        this.clientCount = clientCount;
        this.imageUrl = imageUrl;
        this.createdDate = createdDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getClientCount() {
        return clientCount;
    }

    public void setClientCount(Integer clientCount) {
        this.clientCount = clientCount;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }
}
