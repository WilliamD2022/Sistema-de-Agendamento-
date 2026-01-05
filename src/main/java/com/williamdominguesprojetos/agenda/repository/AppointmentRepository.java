package com.williamdominguesprojetos.agenda.repository;

import com.williamdominguesprojetos.agenda.domain.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    Optional<Appointment> findTopByCustomerIdOrderByStartsAtDesc(UUID customerId);
    void deleteByCustomerId(UUID customerId);
}
