package com.williamdominguesprojetos.agenda.domain;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    @Test
    void prePersist_setsDefaultsWhenMissing() {
        User user = new User();

        user.prePersist();

        assertThat(user.getId()).isNotNull();
        assertThat(user.getCreatedAt()).isNotNull();
        assertThat(user.getRole()).isEqualTo(UserRole.USER);
    }

    @Test
    void prePersist_keepsExistingValues() {
        User user = new User();
        UUID id = UUID.randomUUID();
        Instant createdAt = Instant.parse("2024-01-01T10:00:00Z");

        user.setId(id);
        user.setCreatedAt(createdAt);
        user.setRole(UserRole.ADMIN);

        user.prePersist();

        assertThat(user.getId()).isEqualTo(id);
        assertThat(user.getCreatedAt()).isEqualTo(createdAt);
        assertThat(user.getRole()).isEqualTo(UserRole.ADMIN);
    }
}
