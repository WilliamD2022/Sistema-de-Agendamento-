package com.williamdominguesprojetos.agenda.service;

import com.williamdominguesprojetos.agenda.dto.AuthResponse;
import com.williamdominguesprojetos.agenda.dto.LoginRequest;
import com.williamdominguesprojetos.agenda.exception.UnauthorizedException;
import com.williamdominguesprojetos.agenda.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse login(LoginRequest req) {
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciais invalidas"));

        var hashed = hashPassword(req.password());
        if (!hashed.equals(user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciais invalidas");
        }

        var token = UUID.randomUUID().toString();
        return new AuthResponse(token, "Bearer", 120);
    }

    static String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
