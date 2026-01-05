package com.williamdominguesprojetos.agenda;

import com.williamdominguesprojetos.agenda.domain.Appointment;
import com.williamdominguesprojetos.agenda.domain.AppointmentStatus;
import com.williamdominguesprojetos.agenda.domain.Customer;
import com.williamdominguesprojetos.agenda.dto.AppointmentUpsertRequest;
import com.williamdominguesprojetos.agenda.repository.AppointmentRepository;
import com.williamdominguesprojetos.agenda.service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class AgendaApplicationTests {

    @Test
    void customerPrePersist_setsIdAndCreatedAtWhenMissing() {
        Customer customer = new Customer();

        customer.prePersist();

        assertNotNull(customer.getId());
        assertNotNull(customer.getCreatedAt());
    }

    @Test
    void customerPrePersist_keepsExistingValues() {
        Customer customer = new Customer();
        UUID id = UUID.randomUUID();
        Instant createdAt = Instant.parse("2024-01-10T10:15:30Z");
        customer.setId(id);
        customer.setCreatedAt(createdAt);

        customer.prePersist();

        assertEquals(id, customer.getId());
        assertEquals(createdAt, customer.getCreatedAt());
    }

    @Test
    void appointmentPrePersist_setsDefaultsWhenMissing() {
        Appointment appointment = new Appointment();

        appointment.prePersist();

        assertNotNull(appointment.getId());
        assertNotNull(appointment.getCreatedAt());
        assertEquals(AppointmentStatus.SCHEDULED, appointment.getStatus());
    }

    @Test
    void appointmentPrePersist_preservesExplicitStatus() {
        Appointment appointment = new Appointment();
        appointment.setStatus(AppointmentStatus.COMPLETED);

        appointment.prePersist();

        assertEquals(AppointmentStatus.COMPLETED, appointment.getStatus());
    }
}
