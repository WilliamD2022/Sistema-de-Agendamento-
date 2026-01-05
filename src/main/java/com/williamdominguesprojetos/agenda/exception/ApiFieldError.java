package com.williamdominguesprojetos.agenda.exception;

public record ApiFieldError(
        String field,
        String message
) {}