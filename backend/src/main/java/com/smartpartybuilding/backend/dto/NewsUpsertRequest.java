package com.smartpartybuilding.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record NewsUpsertRequest(
    @NotBlank String title,
    @NotNull LocalDateTime publishTime,
    @NotBlank String content,
    String iconUrl,
    boolean carousel
) {}
