package com.williamdominguesprojetos.agenda.service;

import com.williamdominguesprojetos.agenda.domain.Appointment;
import com.williamdominguesprojetos.agenda.domain.AppointmentStatus;
import com.williamdominguesprojetos.agenda.domain.Customer;
import com.williamdominguesprojetos.agenda.dto.AppointmentUpsertRequest;
import com.williamdominguesprojetos.agenda.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Appointment findLatestForCustomer(UUID customerId) {
        return repository.findTopByCustomerIdOrderByStartsAtDesc(customerId).orElse(null);
    }

    @Transactional
    public Appointment upsertForCustomer(Customer customer, AppointmentUpsertRequest req) {
        if (req == null) {
            return null;
        }

        Appointment appointment = repository.findTopByCustomerIdOrderByStartsAtDesc(customer.getId())
                .orElseGet(Appointment::new);

        appointment.setCustomer(customer);
        appointment.setStartsAt(req.startsAt());
        appointment.setStatus(req.status() != null ? req.status() : AppointmentStatus.SCHEDULED);
        appointment.setNotes(req.notes());

        return repository.save(appointment);
    }
}
