package com.williamdominguesprojetos.agenda.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerCreateRequest(
        @NotBlank @Size(max = 120) String name,
        @Size(max = 30) String phone,
        @Size(max = 160) String email,
        @Valid AppointmentUpsertRequest appointment
) {}
