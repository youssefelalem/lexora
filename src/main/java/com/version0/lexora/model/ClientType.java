package com.version0.lexora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * نموذج نوع العميل
 * Client Type model entity
 */
@Entity
@Table(name = "client_types", indexes = {
        @Index(name = "idx_client_type_name", columnList = "name"),
        @Index(name = "idx_client_type_created_date", columnList = "created_date")
})
public class ClientType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "اسم نوع العميل مطلوب")
    @Size(min = 2, max = 100, message = "اسم نوع العميل يجب أن يكون بين 2 و 100 حرف")
    @Column(nullable = false, unique = true)
    private String name;

    @Size(max = 500, message = "الوصف لا يمكن أن يتجاوز 500 حرف")
    @Column(length = 500)
    private String description;

    @Size(max = 50, message = "اللون لا يمكن أن يتجاوز 50 حرف")
    @Column(nullable = false)
    private String color = "bg-blue-600";

    @PositiveOrZero(message = "عدد العملاء يجب أن يكون صفر أو أكثر")
    @Column(name = "client_count")
    private Integer clientCount = 0;

    @Size(max = 255, message = "رابط الصورة لا يمكن أن يتجاوز 255 حرف")
    @Column(name = "image_url")
    private String imageUrl;

    @PastOrPresent(message = "تاريخ الإنشاء لا يمكن أن يكون في المستقبل")
    @Column(name = "created_date")
    private LocalDate createdDate;

    // المنشئات - Constructors
    public ClientType() {
        this.createdDate = LocalDate.now();
    }

    public ClientType(String name, String description, String color) {
        this();
        this.name = name;
        this.description = description;
        this.color = color;
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

    @Override
    public String toString() {
        return "ClientType{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", color='" + color + '\'' +
                ", clientCount=" + clientCount +
                ", createdDate=" + createdDate +
                '}';
    }
}
