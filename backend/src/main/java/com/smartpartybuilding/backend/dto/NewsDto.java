package com.smartpartybuilding.backend.dto;

import java.time.LocalDateTime;

public record NewsDto(
    Long id,
    String title,
    LocalDateTime publishTime,
    String content,
    String iconUrl,
    boolean carousel
) {}
