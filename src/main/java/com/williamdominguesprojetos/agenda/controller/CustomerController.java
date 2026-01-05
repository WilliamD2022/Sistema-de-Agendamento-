package com.williamdominguesprojetos.agenda.controller;


import com.williamdominguesprojetos.agenda.dto.CustomerCreateRequest;
import com.williamdominguesprojetos.agenda.dto.CustomerResponse;
import com.williamdominguesprojetos.agenda.dto.CustomerUpdateRequest;
import com.williamdominguesprojetos.agenda.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService service;
    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse create(@Valid @RequestBody CustomerCreateRequest req) {
        return service.create(req);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<CustomerResponse> list() {
        return service.list();

    }

    @GetMapping("/{id}")
    public CustomerResponse get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public CustomerResponse update(@PathVariable UUID id, @Valid @RequestBody CustomerUpdateRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
