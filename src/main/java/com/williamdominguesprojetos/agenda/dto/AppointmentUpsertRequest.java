package com.williamdominguesprojetos.agenda.dto;

import com.williamdominguesprojetos.agenda.domain.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record AppointmentUpsertRequest(
        @NotNull LocalDateTime startsAt,
        AppointmentStatus status,
        @Size(max = 500) String notes
) {
}
