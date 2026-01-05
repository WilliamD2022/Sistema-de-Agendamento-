package com.williamdominguesprojetos.agenda.domain;


import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 30)
    private String  phone;

    @Column(length = 160)
    private String  email;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
         if (id == null) id = UUID.randomUUID();
         if (createdAt == null) createdAt = Instant.now();
    }

    public UUID getId() {return id;}
    public void setId(UUID id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getPhone() {return phone;}
    public void setPhone(String phone) {this.phone = phone;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public Instant getCreatedAt() {return createdAt;}
    public void setCreatedAt(Instant createdAt) {this.createdAt = createdAt;}

}
