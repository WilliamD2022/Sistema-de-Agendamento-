package com.williamdominguesprojetos.agenda.dto;

import com.williamdominguesprojetos.agenda.domain.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentSummaryResponse(
        UUID id,
        LocalDateTime startsAt,
        AppointmentStatus status,
        String notes
) {
}
