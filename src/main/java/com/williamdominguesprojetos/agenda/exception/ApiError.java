package com.williamdominguesprojetos.agenda.exception;

import java.time.Instant;
import java.util.List;

public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<ApiFieldError> details
) {
    public static ApiError of(Instant timestamp, int status, String error, String message, String path) {
        return new ApiError(timestamp, status, error, message, path, List.of());
    }

    public static ApiError of(Instant timestamp, int status, String error, String message, String path, List<ApiFieldError> details) {
        return new ApiError(timestamp, status, error, message, path, details == null ? List.of() : details);
    }
}
