package com.williamdominguesprojetos.agenda.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresInMinutes
) {}