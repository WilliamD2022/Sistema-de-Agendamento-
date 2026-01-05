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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceUnitTests {

    @Mock
    private AppointmentRepository repository;

    @InjectMocks
    private AppointmentService service;

    @Test
    void findLatestForCustomer_returnsNullWhenMissing() {
        UUID customerId = UUID.randomUUID();
        when(repository.findTopByCustomerIdOrderByStartsAtDesc(customerId)).thenReturn(Optional.empty());

        Appointment result = service.findLatestForCustomer(customerId);

        assertNull(result);
    }

    @Test
    void findLatestForCustomer_returnsAppointment() {
        UUID customerId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        when(repository.findTopByCustomerIdOrderByStartsAtDesc(customerId)).thenReturn(Optional.of(appointment));

        Appointment result = service.findLatestForCustomer(customerId);

        assertSame(appointment, result);
    }

    @Test
    void upsertForCustomer_returnsNullWhenRequestIsNull() {
        Customer customer = new Customer();

        Appointment result = service.upsertForCustomer(customer, null);

        assertNull(result);
        verifyNoInteractions(repository);
    }

    @Test
    void upsertForCustomer_createsNewAppointmentWithDefaults() {
        Customer customer = new Customer();
        customer.setId(UUID.randomUUID());
        LocalDateTime startsAt = LocalDateTime.of(2024, 10, 5, 14, 30);
        AppointmentUpsertRequest request = new AppointmentUpsertRequest(startsAt, null, null);

        when(repository.findTopByCustomerIdOrderByStartsAtDesc(customer.getId())).thenReturn(Optional.empty());
        when(repository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Appointment result = service.upsertForCustomer(customer, request);

        assertNotNull(result);
        assertSame(customer, result.getCustomer());
        assertEquals(startsAt, result.getStartsAt());
        assertEquals(AppointmentStatus.SCHEDULED, result.getStatus());
        assertNull(result.getNotes());
    }

    @Test
    void upsertForCustomer_updatesExistingAppointment() {
        Customer customer = new Customer();
        customer.setId(UUID.randomUUID());
        Appointment existing = new Appointment();
        existing.setId(UUID.randomUUID());
        existing.setCustomer(customer);
        LocalDateTime startsAt = LocalDateTime.of(2024, 12, 20, 9, 0);
        AppointmentUpsertRequest request = new AppointmentUpsertRequest(startsAt, AppointmentStatus.COMPLETED, "ok");

        when(repository.findTopByCustomerIdOrderByStartsAtDesc(customer.getId())).thenReturn(Optional.of(existing));
        when(repository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Appointment result = service.upsertForCustomer(customer, request);

        assertSame(existing, result);
        assertEquals(startsAt, result.getStartsAt());
        assertEquals(AppointmentStatus.COMPLETED, result.getStatus());
        assertEquals("ok", result.getNotes());
    }

    @Test
    void upsertForCustomer_usesProvidedStatusWhenPresent() {
        Customer customer = new Customer();
        customer.setId(UUID.randomUUID());
        Appointment existing = new Appointment();
        existing.setStatus(AppointmentStatus.SCHEDULED);
        AppointmentUpsertRequest request = new AppointmentUpsertRequest(
                LocalDateTime.of(2025, 1, 2, 11, 0),
                AppointmentStatus.NO_SHOW,
                "nao chegou"
        );

        when(repository.findTopByCustomerIdOrderByStartsAtDesc(customer.getId())).thenReturn(Optional.of(existing));
        when(repository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Appointment result = service.upsertForCustomer(customer, request);

        assertEquals(AppointmentStatus.NO_SHOW, result.getStatus());
        assertEquals("nao chegou", result.getNotes());
    }
}
