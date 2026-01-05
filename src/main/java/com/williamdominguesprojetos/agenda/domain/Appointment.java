package com.williamdominguesprojetos.agenda.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "starts_at", nullable = false)
    private LocalDateTime startsAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AppointmentStatus status;

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = AppointmentStatus.SCHEDULED;
    }

    public UUID getId() {return id;}
    public void setId(UUID id) {this.id = id;}

    public Customer getCustomer() {return customer;}
    public void setCustomer(Customer customer) {this.customer = customer;}

    public LocalDateTime getStartsAt() {return startsAt;}
    public void setStartsAt(LocalDateTime startsAt) {this.startsAt = startsAt;}

    public AppointmentStatus getStatus() {return status;}
    public void setStatus(AppointmentStatus status) {this.status = status;}

    public String getNotes() {return notes;}
    public void setNotes(String notes) {this.notes = notes;}

    public Instant getCreatedAt() {return createdAt;}
    public void setCreatedAt(Instant createdAt) {this.createdAt = createdAt;}
}
