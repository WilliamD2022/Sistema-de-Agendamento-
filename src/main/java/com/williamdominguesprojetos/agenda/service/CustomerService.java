package com.williamdominguesprojetos.agenda.service;

import com.williamdominguesprojetos.agenda.domain.Appointment;
import com.williamdominguesprojetos.agenda.domain.Customer;
import com.williamdominguesprojetos.agenda.dto.AppointmentSummaryResponse;
import com.williamdominguesprojetos.agenda.dto.CustomerCreateRequest;
import com.williamdominguesprojetos.agenda.dto.CustomerResponse;
import com.williamdominguesprojetos.agenda.dto.CustomerUpdateRequest;
import com.williamdominguesprojetos.agenda.exception.NotFoundException;
import com.williamdominguesprojetos.agenda.repository.CustomerRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class CustomerService {

    private final CustomerRepository repository;
    private final AppointmentService appointmentService;

    public CustomerService(CustomerRepository repository, AppointmentService appointmentService) {
        this.repository = repository;
        this.appointmentService = appointmentService;
    }

    @Transactional
    public CustomerResponse create(CustomerCreateRequest req) {
        Customer c = new Customer();
        c.setName(req.name());
        c.setPhone(req.phone());
        c.setEmail(req.email());

        Customer saved = repository.save(c);
        Appointment appointment = appointmentService.upsertForCustomer(saved, req.appointment());
        return toResponse(saved, appointment);
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> list() {
        return repository.findAll().stream()
                .map(customer -> toResponse(customer, appointmentService.findLatestForCustomer(customer.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public CustomerResponse get(UUID id) {
        Customer c = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found: " + id));
        Appointment appointment = appointmentService.findLatestForCustomer(c.getId());
        return toResponse(c, appointment);
    }

    @Transactional
    public CustomerResponse update(UUID id, CustomerUpdateRequest req) {
        Customer c = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found: " + id));

        c.setName(req.name());
        c.setPhone(req.phone());
        c.setEmail(req.email());

        Appointment appointment = req.appointment() != null
                ? appointmentService.upsertForCustomer(c, req.appointment())
                : appointmentService.findLatestForCustomer(c.getId());
        return toResponse(c, appointment);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Customer not found: " + id);
        }
        repository.deleteById(id);
    }

    private CustomerResponse toResponse(Customer c, Appointment appointment) {
        return new CustomerResponse(
                c.getId(),
                c.getName(),
                c.getPhone(),
                c.getEmail(),
                c.getCreatedAt(),
                appointment != null ? new AppointmentSummaryResponse(
                        appointment.getId(),
                        appointment.getStartsAt(),
                        appointment.getStatus(),
                        appointment.getNotes()
                ) : null
        );
    }
}
