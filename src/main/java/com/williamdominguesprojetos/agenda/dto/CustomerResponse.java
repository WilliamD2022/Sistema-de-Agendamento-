package com.williamdominguesprojetos.agenda.dto;

import java.util.UUID;
import java.time.Instant;

public record CustomerResponse(
        UUID id,
        String name,
        String phone,
        String email,
        Instant createdAt,
        AppointmentSummaryResponse appointment
) {
}
